//this file contains the logic of user registration and login

const User = require('../models/User');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { cloudinary } = require('../config/cloudinary');

//function to generate JWT

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

//Register the user

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    //validating the details

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please incluse all fields" });
    }

    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Use the Cloudinary URL from req.file
    const imagePath = req.file ? req.file.path : '';

    // Create User
    const user = await User.create({
        username,
        email,
        password,
        profilePic: imagePath
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            following: user.following, // Added following
            savedRecipes: user.savedRecipes, // Added savedRecipes
            token: generateToken(user._id),
        });
    }

    else {
        res.status(400).json({ message: 'Invalid user data' });
    }

};

//login the user

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            following: user.following, // Added following
            savedRecipes: user.savedRecipes, // Added savedRecipes
            token: generateToken(user._id)
        });
    }

    else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

// Delete the user and their profile picture from Cloudinary
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete profile pic from Cloudinary if it exists
        if (user.profilePic) {
            // Robust extraction: get everything between '/upload/' and the file extension
            // Example: .../upload/v12345/profile/abcd.jpg -> 'profile/abcd'
            const parts = user.profilePic.split('/');
            const uploadIndex = parts.findIndex(part => part === 'upload');
            // Public ID starts after the version (e.g., parts[uploadIndex + 2])
            // to include the folder 'profile/'.
            const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
            const publicId = publicIdWithExt.split('.')[0];
            
            await cloudinary.uploader.destroy(publicId);
        }

        await user.deleteOne();
        res.status(200).json({ message: 'User and profile picture deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during deletion' });
    }
};

// Forgot Password - Generate reset token and send (simulated) email
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No user with that email' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set expire (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Normally you'd send an email here.
        // For development/demonstration, we return the URL directly or log it.
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

        res.status(200).json({ 
            message: 'Email sent (simulated)', 
            resetToken // Sending token back for ease of use in this demo environment
        });
        
        console.log(`Password reset link: ${resetUrl}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password - Verify token and update password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, deleteUser, forgotPassword, resetPassword };