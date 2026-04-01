//this file contains the routing logic

const express = require('express');

const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');

//endpoint for both register and login
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
