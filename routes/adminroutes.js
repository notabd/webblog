const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');
const { authenticate_admin } = require('../middleware/authMiddleware'); // This middleware is to authenticate admin

router.get('/view_all_users', authenticate_admin, adminController.viewAllUsers);
router.post('/disable_user/:username', authenticate_admin, adminController.disableUser);
router.post('/enable_user/:username', authenticate_admin, adminController.enableUser);
router.get('/get_all_blogs', authenticate_admin, adminController.viewAllBlogs);
router.put('/disable_blog/:title', authenticate_admin, adminController.disableBlog);
router.put('/enable_blog/:title', authenticate_admin, adminController.enableBlog);

module.exports = router;
