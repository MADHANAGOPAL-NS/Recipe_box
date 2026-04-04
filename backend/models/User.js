//this file defines the user schema with followers, following and password hashing

const mongoose = require('mongoose');

//to hash the password we use bcrypt
const bcrypt = require('bcryptjs');

//defining the user schema

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please add a username']
        },

        email: {
            type: String,
            require: [true, 'Please add an email'],
            unique: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
        },

        password: {
            type: String,
            require: [true, 'Please add a password'],
            minlength: 6
        },

        profilePic: {
            type: String,
            default: ''
        },

        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },

    {
        timestamps: true,
    }
);

//Encrypt pwd before saving

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Match the user entered pwd and DB hashed pwd

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await
        bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);