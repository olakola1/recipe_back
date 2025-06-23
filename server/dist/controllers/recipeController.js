"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipe = exports.getRecipes = exports.createRecipe = void 0;
const Recipe_1 = require("../model/Recipe");
const createRecipe = async (req, res) => {
    try {
        const { title, ingredients, time, image } = req.body;
        const recipe = await Recipe_1.Recipe.create({
            title,
            ingredients,
            time,
            image: image || null
        });
        res.status(201).json(recipe);
    }
    catch (error) {
        console.error('Error creating recipe:', error);
        res.status(400).json({ error: 'Invalid data' });
    }
};
exports.createRecipe = createRecipe;
const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe_1.Recipe.findAll();
        res.json(recipes);
    }
    catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getRecipes = getRecipes;
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe_1.Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        await recipe.destroy();
        res.json({
            success: true,
            message: 'Recipe deleted',
            recipeId: id
        });
    }
    catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteRecipe = deleteRecipe;
