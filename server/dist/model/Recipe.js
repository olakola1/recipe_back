"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipe = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db/db"); // Импортируем из нового файла
class Recipe extends sequelize_1.Model {
    static initialize() {
        Recipe.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            ingredients: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            time: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }
            },
            image: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
                validate: {
                    isUrl: true
                }
            },
            isFavorite: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            sequelize: db_1.sequelize,
            tableName: 'recipes',
            timestamps: false,
            modelName: 'recipe'
        });
    }
}
exports.Recipe = Recipe;
exports.default = Recipe;
