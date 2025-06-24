import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/db";

interface RecipeAttributes {
    id: number;
    title: string;
    ingredients: string;
    description: string;
    time: number;
    image?: string | null;
    isFavorite: boolean;
}

interface RecipeCreationAttributes extends Optional<RecipeAttributes, 'id' | 'image' | 'isFavorite'> {}

export class Recipe extends Model<RecipeAttributes, RecipeCreationAttributes> implements RecipeAttributes {
    public id!: number;
    public title!: string;
    public ingredients!: string;
    public description!: string;
    public time!: number;
    public image!: string | null;
    public isFavorite!: boolean;

    public static async initialize(): Promise<void> {
        try {
            await this.init({
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: true
                    }
                },
                ingredients: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notEmpty: true
                    }
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    validate: {
                        notEmpty: true
                    }
                },
                time: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        min: 1
                    }
                },
                image: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                isFavorite: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                }
            }, {
                sequelize,
                tableName: 'recipes',
                timestamps: false,
                modelName: 'recipe'
            });
            console.log('Recipe model initialized successfully');
        } catch (error) {
            console.error('Error initializing Recipe model:', error);
            throw error;
        }
    }
}

export default Recipe;