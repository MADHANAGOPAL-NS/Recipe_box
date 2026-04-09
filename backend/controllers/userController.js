//this file contains the logic for follow and unfollow the user...

const User = require("../models/User");

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
module.exports = { followUser, unfollowUser };
