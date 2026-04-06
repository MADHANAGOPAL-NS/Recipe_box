// handles the logic for creating, fetching, updating, and deleting recipes
const Recipe = require('../models/Recipe');
const { cloudinary } = require('../config/cloudinary');

// API for creating new recipe
const createRecipe = async (req, res) => {
    const { title, description, ingredients, instructions, tags, cookTime } = req.body;

    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        // Use the Cloudinary URL from req.file
        const imagePath = req.file ? req.file.path : '';

        const recipe = await Recipe.create({
            title,
            description,
            ingredients: typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients,
            instructions: typeof instructions === 'string' ? JSON.parse(instructions) : instructions,
            tags: typeof tags === 'string' ? JSON.parse(tags) : tags,
            cookTime,
            image: imagePath,
            author: req.user._id
        });

        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Error creating recipe', error: error.message });
    }
};

// API for updating recipe
const updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Only the author can update the recipe
        if (recipe.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this recipe' });
        }

        const { title, description, ingredients, instructions, tags, cookTime } = req.body;

        // Update fields if provided
        if (title) recipe.title = title;
        if (description) recipe.description = description;
        if (ingredients) recipe.ingredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
        if (instructions) recipe.instructions = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;
        if (tags) recipe.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
        if (cookTime) recipe.cookTime = cookTime;

        // Handle image replacement in Cloudinary
        if (req.file) {
            // Delete the old image from Cloudinary if it exists
            if (recipe.image) {
                const publicId = recipe.image.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
            // Save the new Cloudinary URL
            recipe.image = req.file.path;
        }

        const updatedRecipe = await recipe.save();
        res.status(200).json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: 'Error updating recipe', error: error.message });
    }
};

// API for deleting recipe
const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Only the author can delete the recipe
        if (recipe.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this recipe' });
        }

        // Delete image from Cloudinary before removing from DB
        if (recipe.image) {
            const publicId = recipe.image.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await recipe.deleteOne();
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
};

// API for getting all recipes
const getRecipes = async (req, res) => {
    try {
        //including the search logic by using the backend technique

        const { search } = req.query;

        let query = {};

        //check if search is provided
        if (search) {
            query = {
                title: {
                    $regex: search,
                    $options: 'i'
                }
            };
        }

        //fetch recipes form MongoDB based on the query
        const recipes = await Recipe.find(query).populate('author', 'username email');
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes' });
    }
};

// API for getting single recipe
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

module.exports = { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe };
