const express = require('express');
const router = express.Router();
const { registerUser, loginUser, deleteUser, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const { profileUpload, cloudinary } = require('../config/cloudinary');

//routes
router.post('/register', profileUpload.single('image'), registerUser);
router.post('/login', loginUser);
router.delete('/delete', protect, deleteUser);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
