const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogcontroller');
const { authenticate_user } = require('../middleware/authMiddleware'); // Middleware to authenticate users

// Create a new blog post
router.post('/create', authenticate_user, blogController.createBlog);
// Get all blogs
router.get('/all', authenticate_user, blogController.getAllBlogs);
// Get a single blog by title
router.get('/title/:title', authenticate_user, blogController.getBlogByTitle);
// Update a blog post
router.put('/update/:title', authenticate_user, blogController.updateBlog);
// Delete a blog post
router.delete('/delete/:title', authenticate_user, blogController.deleteBlog);
// Rate a blog post
router.put('/rate/:title', authenticate_user, blogController.rateBlog);
// Comment on a blog post
router.post('/comment/:title', authenticate_user, blogController.commentOnBlog);
// Search for blog posts
router.get('/search', authenticate_user, blogController.searchBlogs);

module.exports = router;