//mapping endpoints to create route

const express = require('express');

const router = express.Router();

const { createRecipe, getRecipes, getRecipeById } = require('../controllers/recipeController');

const { protect } = require('../middleware/authMiddleware');

//public routes

router.get('/', getRecipes);
router.get('/:id', getRecipeById);

//protected routes only logged users can reach this

router.post('/', protect, createRecipe);

module.exports = router;
