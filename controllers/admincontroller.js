const User = require('../models/User'); // Import User model
const Blog = require('../models/Blog'); // Import Blog model
const mongoose = require('mongoose');

const adminController = {
    // View all users
    viewAllUsers: async (req, res) => {
        try {
            const users = await User.find({}, 'username email disabled');
            res.status(200).json(users);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Disable a user
    disableUser: async (req, res) => {
        const username = req.params.username;
        try {
            const user = await User.findOneAndUpdate({ username }, { disabled: true }, { new: true });
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.status(200).send(`User ${username} disabled successfully`);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Enable a user
    enableUser: async (req, res) => {
        const username = req.params.username;
        try {
            const user = await User.findOneAndUpdate({ username }, { disabled: false }, { new: true });
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.status(200).send(`User ${username} enabled successfully`);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // View all blog posts
    viewAllBlogs: async (req, res) => {
        try {
            const blogs = await Blog.find({});
            res.status(200).json(blogs);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Disable a blog post
    disableBlog: async (req, res) => {
        const { title } = req.params;
        try {
            const blog = await Blog.findOneAndUpdate({ title }, { disabled: true }, { new: true });
            if (!blog) {
                return res.status(404).send('Blog not found');
            }
            res.status(200).send(`Blog titled "${title}" disabled successfully`);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Enable a blog post
    enableBlog: async (req, res) => {
        const { title } = req.params;
        try {
            const blog = await Blog.findOneAndUpdate({ title }, { disabled: false }, { new: true });
            if (!blog) {
                return res.status(404).send('Blog not found');
            }
            res.status(200).send(`Blog titled "${title}" enabled successfully`);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};

module.exports = adminController;