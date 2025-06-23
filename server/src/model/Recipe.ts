import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/db"; // Импортируем из нового файла

interface RecipeAttributes {
    id: number;
    title: string;
    ingredients: string;
    time: number;
    image?: string | null;
    isFavorite: boolean;
}

interface RecipeCreationAttributes extends Optional<RecipeAttributes, 'id' | 'image' | 'isFavorite'> {}

export class Recipe extends Model<RecipeAttributes, RecipeCreationAttributes>
    implements RecipeAttributes {

    public id!: number;
    public title!: string;
    public ingredients!: string;
    public time!: number;
    public image!: string | null;
    public isFavorite!: boolean;

    public static initialize(): void {
        Recipe.init({
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
                validate: {
                    isUrl: true
                }
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
    }
}

export default Recipe;