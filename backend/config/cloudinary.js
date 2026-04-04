const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Recipe storage configuration
const recipeStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'recipes', 
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }]
    }
});

// Profile picture storage configuration
const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile', 
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
    }
});

const recipeUpload = multer({ storage: recipeStorage });
const profileUpload = multer({ storage: profileStorage });

module.exports = { cloudinary, recipeUpload, profileUpload };
