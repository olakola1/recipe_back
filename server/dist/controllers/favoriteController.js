"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFavorite = void 0;
const Recipe_1 = require("../model/Recipe");
const toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const { isFavorite } = req.body;
        const recipe = await Recipe_1.Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        recipe.isFavorite = isFavorite;
        await recipe.save();
        res.json(recipe); // Возвращаем обновленный рецепт
    }
    catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.toggleFavorite = toggleFavorite;
