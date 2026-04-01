//this file contains the logic of user registration and login

const User = require('../models/User');

const jwt = require('jsonwebtoken');

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

    // Create User
    const user = await User.create({ username, email, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
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
            token: generateToken(user._id)
        });
    }

    else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

module.exports = { registerUser, loginUser };