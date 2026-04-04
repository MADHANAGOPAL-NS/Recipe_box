const express = require('express');
const router = express.Router();
const { registerUser, loginUser, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const { profileUpload, cloudinary } = require('../config/cloudinary');

//routes
router.post('/register', profileUpload.single('image'), registerUser);
router.post('/login', loginUser);
router.delete('/delete', protect, deleteUser);

module.exports = router;
