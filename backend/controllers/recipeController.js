//handels the logic for creating and fetching the recipes

const Recipe = require('../models/Recipe');

//API for creating new recipe

const createRecipe = async (req, res) => {
    const { title, description, ingredients, instructions, tags, cookTime, image } = req.body;

    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const recipe = await Recipe.create({
            title,
            description,
            ingredients,
            instructions,
            tags,
            cookTime,
            image,
            author: req.user._id
        });

        res.status(201).json(recipe);
    }

    catch (error) {
        res.status(500).json({ message: 'Error creating recipe' });
    }
};

//API for getting all recipes

const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('author', 'username email');
        res.status(200).json(recipes);
    }

    catch (error) {
        res.status(500).json({ message: 'Error fetching recipes' });
    }
};

//API for getting single recipe

const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('author', 'username email');

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipe', error: error.message });
    }
};

module.exports = { createRecipe, getRecipes, getRecipeById };

