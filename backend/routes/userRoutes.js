//routing to protect from unknown users

const express = require("express");
const router = express.Router();

const { followUser, unfollowUser, saveRecipe, unsaveRecipe, getSavedRecipes } = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.get('/saved', protect, getSavedRecipes);

router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

router.post('/:id/save', protect, saveRecipe);
router.post('/:id/unsave', protect, unsaveRecipe);

module.exports = router;