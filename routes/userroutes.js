const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { authenticate_user } = require('../middleware/authMiddleware'); // Middleware to authenticate users

// User registration
router.post('/signup', userController.signUp);
// User login
router.post('/login', userController.login);
// Update user credentials
router.put('/update_credentials', authenticate_user, userController.updateCredentials);
// Follow another user
router.post('/follow', authenticate_user, userController.followUser);
// Retrieve user's notifications
router.get('/notifications', authenticate_user, userController.getNotifications);

module.exports = router;