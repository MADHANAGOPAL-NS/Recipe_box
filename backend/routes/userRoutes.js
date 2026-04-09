//routing to protect from unknown users

const express = require("express");
const router = express.Router();

const { followUser, unfollowUser } = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

module.exports = router;