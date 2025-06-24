import { Request, Response } from 'express';
import { Recipe } from '../model/Recipe';

export const toggleFavorite = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isFavorite } = req.body;

        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        recipe.isFavorite = isFavorite;
        await recipe.save();

        res.json(recipe);
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

