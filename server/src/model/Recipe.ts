import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { env, platform, stdin, stdout } from 'node:process';
import * as readline from "readline";
import { config } from "dotenv";
config();

const dbName = env.SUBD_DB_NAME || 'recipes_db';
const dbUser = env.SUBD_DB_USER || 'postgres';
const dbPass = env.SUBD_DB_PASS || 'mysecretpassword';
const dbHost = env.SUBD_DB_HOST || 'localhost';
const dbDialect = (env.SUBD_DB_DIALECT as 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql') || 'postgres';
const syncDatabase = (env.SUBD_DB_SYNC || 'no') === 'yes';

const sequelizeOptions = {
    timestamps: false,
};

interface RecipeAttributes {
    id: number;
    title: string;
    ingredients: string;
    time: number;
    image?: string | null;
    isFavorite?: boolean;
}

interface RecipeCreationAttributes extends Optional<RecipeAttributes, 'id' | 'image'> {}

class Recipe extends Model<RecipeAttributes, RecipeCreationAttributes> implements RecipeAttributes {
    public id!: number;
    public title!: string;
    public ingredients!: string;
    public time!: number;
    public image!: string | null;
    public isFavorite?: boolean;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            ingredients: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            time: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            image: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            isFavorite: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, {
            sequelize: sequelize,
            tableName: 'recipes',
            ...sequelizeOptions
        });
    }
}

class Database {
    private static instance: Database;
    private sequelize: Sequelize;

    private constructor() {
        this.sequelize = new Sequelize(dbName, dbUser, dbPass, {
            host: dbHost,
            dialect: dbDialect,
            logging: console.log
        });

        this.setupEventHandlers();
        this.initializeModels();
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    private initializeModels(): void {
        Recipe.initialize(this.sequelize);

        if (syncDatabase) {
            this.syncDatabase();
        }
    }

    private async syncDatabase(): Promise<void> {
        try {
            await this.sequelize.sync({ alter: true });
            console.log('Database synchronized successfully');
        } catch (error) {
            console.error('Error synchronizing database:', error);
        }
    }

    private setupEventHandlers(): void {
        if (platform === "win32") {
            const rl = readline.createInterface({
                input: stdin,
                output: stdout
            });

            rl.on("SIGINT", () => {
                process.emit("SIGINT");
            });
        }

        process.on("SIGINT", async () => {
            try {
                await this.sequelize.close();
                console.log('Disconnected From DB Success');
                process.exit(0);
            } catch (error) {
                console.error('Disconnected From DB Error:', error);
                process.exit(1);
            }
        });
    }

    public async testConnection(): Promise<void> {
        try {
            await this.sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

const database = Database.getInstance();
database.testConnection();

export { Recipe, Database };