//this file contains the logic for follow and unfollow the user...

const User = require("../models/User");

const Recipe = require('../models/Recipe');
//follow the user

const followUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user._id;

        //prevent self follow
        if (currentUserId.toString() === targetUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const targetUser = await User.findById(targetUserId);

        const currentUser = await User.findById(currentUserId);

        //check if target user exist
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        //Prevent duplicate follow
        if (currentUser.following.includes(targetUserId)) {
            return res.status(400).json({ message: "You are already follwing this user" });
        }

        //update following/followers list

        currentUser.following.push(targetUserId);

        targetUser.followers.push(currentUserId);

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: "User followed successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//unfollow the user

const unfollowUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;

        const currentUserId = req.user._id;

        const targetUser = await User.findById(targetUserId);

        const currentUser = await User.findById(currentUserId);

        if (!targetUser) {

            return res.status(404).json({ message: "User not found" });

        }
        // Check if currently following
        if (!currentUser.following.includes(targetUserId)) {

            return res.status(400).json({ message: "You are not following this user" });

        }
        // Remove from lists
        currentUser.following = currentUser.following.filter(
            (id) => id.toString() !== targetUserId
        );

        targetUser.followers = targetUser.followers.filter(
            (id) => id.toString() !== currentUserId.toString()
        );

        await currentUser.save();

        await targetUser.save();

        res.status(200).json({ message: "User unfollowed successfully" });

    }

    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//save recipe function

const saveRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const currentUserId = req.user._id;

        //check if the recipe exist in the database

        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const currentUser = await User.findById(currentUserId);

        //prevent duplicate saving

        if (currentUser.savedRecipes.includes(recipeId)) {
            return res.status(400).json({ message: "Recipe is already saved" });
        }

        currentUser.savedRecipes.push(recipeId);
        await currentUser.save();
        res.status(200).json({ message: "Recipe saved successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Remove a recipe from Cookbook

const unsaveRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const currentUserId = req.user._id;
        const currentUser = await User.findById(currentUserId);

        // Check if the user has actually saved this recipe

        if (!currentUser.savedRecipes.includes(recipeId)) {

            return res.status(400).json({ message: "Recipe is not in your saved list" });

        }
        // Remove the recipe from the array

        currentUser.savedRecipes = currentUser.savedRecipes.filter(

            (id) => id.toString() !== recipeId
        );

        await currentUser.save();

        res.status(200).json({ message: "Recipe removed from saved list" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fetch all saved recipes for the user

const getSavedRecipes = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        // Find the user and fetch real recipe objects using .populate()
        // We only populate author username & profile picture inside the recipe

        const user = await User.findById(currentUserId).populate({
            path: 'savedRecipes',

            populate: { path: 'author', select: 'username profilePic' }

        });

        if (!user) {

            return res.status(404).json({ message: "User not found" });

        }
        res.status(200).json(user.savedRecipes);

    }

    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const addMealPlan = async (req, res) => {
    try {
        const { date, recipeId } = req.body;

        const currentUserId = req.user._id;

        // 1. Edge Case: Missing Date

        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }
        // 2. Edge Case: Recipe not found or Invalid ID
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        // 3. Add to User's meal plan array
        const currentUser = await User.findById(currentUserId);

        currentUser.mealPlans.push({
            date: new Date(date), // Formats text date into true Date object
            recipe: recipeId
        });
        await currentUser.save();
        res.status(200).json({ message: "Meal plan added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//fetch all meal plans for the user

const getMealPlans = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        const user = await User.findById(currentUserId).populate('mealPlans.recipe');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.mealPlans);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { followUser, unfollowUser, saveRecipe, unsaveRecipe, getSavedRecipes, addMealPlan, getMealPlans };
