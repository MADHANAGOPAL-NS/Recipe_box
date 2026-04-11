//mapping endpoints to create route

const express = require('express');

const router = express.Router();

const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe, getFeed, addComments, getComments } = require('../controllers/recipeController');

const { protect } = require('../middleware/authMiddleware');

const { recipeUpload } = require('../config/cloudinary');

//feed router

router.get('/feed', protect, getFeed);

//public routes

router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.get('/:id/comments', getComments);

//protected routes only logged users can reach this

router.post('/', protect, recipeUpload.single('image'), createRecipe);

router.put('/:id', protect, recipeUpload.single('image'), updateRecipe);

router.delete('/:id', protect, deleteRecipe);

router.post('/:id/comments', protect, addComments);

module.exports = router;
