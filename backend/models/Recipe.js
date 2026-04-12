//this file contains the module of recipe the main strcture of our app

const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    title: {
        type: String,
        require: [true, 'Please add a recipe title']
    },

    description: {
        type: String
    },

    ingredients: [
        {
            name: {
                type: String,
                require: true
            },

            quantity: {
                type: String
            },

            unit: {
                type: String
            },
        }
    ],

    instructions: {
        type: [String],
        require: [true, 'Please add instructions'],
    },

    tags: [String],

    cookTime: {
        type: Number
    },

    image: {
        type: String
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Linking to the User model
    },

    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        text: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        value: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    }]
},

    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Recipe', recipeSchema);