//mapping endpoints to create route

const express = require('express');

const router = express.Router();

const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } = require('../controllers/recipeController');

const { protect } = require('../middleware/authMiddleware');

const { upload } = require('../config/cloudinary');

//public routes

router.get('/', getRecipes);
router.get('/:id', getRecipeById);

//protected routes only logged users can reach this

router.post('/', protect, upload.single('image'), createRecipe);

router.put('/:id', protect, upload.single('image'), updateRecipe);

router.delete('/:id', protect, deleteRecipe);

module.exports = router;
