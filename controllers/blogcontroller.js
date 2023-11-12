const Blog = require('../models/Blog'); // Import Blog model
const User = require('../models/User'); // Import User model
const mongoose = require('mongoose');

const blogController = {
    // Create a new blog post
    createBlog: async (req, res) => {
        const { title, content, author } = req.body;
        try {
            const newBlog = new Blog({ title, content, author, date: new Date(), ratings: [], comments: [], avgrating: 0, disabled: false });
            await newBlog.save();
            res.status(201).send(`Blog titled "${title}" created successfully`);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Get all blogs
    getAllBlogs: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Get the page from the query parameters or default to page 1
            const limit = parseInt(req.query.limit) || 10; // Get the limit from the query parameters or default to 10

            // Sorting and filtering options
            const sort = req.query.sort || '-date'; // Default sorting by date (descending)
            const filter = req.query.filter || {}; // Default no filtering

            const options = {
                skip: (page - 1) * limit,
                limit,
                sort,
            };

            const blogs = await Blog.find({ ...filter, disabled: false }, null, options);
            res.status(200).json(blogs);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Get a single blog by title
    getBlogByTitle: async (req, res) => {
        const { title } = req.params;
        try {
            const blog = await Blog.findOne({ title, disabled: false });
            if (!blog) {
                return res.status(404).send('Blog not found');
            }
            res.status(200).json(blog);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Update a blog post
    updateBlog: async (req, res) => {
        const { title } = req.params;
        const { content } = req.body;
        try {
            const updatedBlog = await Blog.findOneAndUpdate({ title, disabled: false }, { content }, { new: true });
            if (!updatedBlog) {
                return res.status(404).send('Blog not found');
            }
            res.status(200).send(`Blog titled "${title}" updated successfully`);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Delete a blog post
    deleteBlog: async (req, res) => {
        const { title } = req.params;
        try {
            const deletedBlog = await Blog.findOneAndDelete({ title, disabled: false });
            if (!deletedBlog) {
                return res.status(404).send('Blog not found');
            }
            res.status(200).send(`Blog titled "${title}" deleted successfully`);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Rate a blog post
    rateBlog: async (req, res) => {
        const { title } = req.params;
        const { rating } = req.body;
        try {
            const blog = await Blog.findOne({ title, disabled: false });
            if (!blog) {
                return res.status(404).send('Blog not found');
            }
            blog.ratings.push(rating);
            blog.avgrating = blog.ratings.reduce((acc, curr) => acc + curr, 0) / blog.ratings.length;
            await blog.save();
            res.status(200).send(`Rating added to blog titled "${title}"`);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Comment on a blog post
    commentOnBlog: async (req, res) => {
        const { title } = req.params;
        const { comment } = req.body;
        try {
            const blog = await Blog.findOne({ title, disabled: false });
            if (!blog) {
                return res.status(404).send('Blog not found');
            }
            blog.comments.push(comment);
            await blog.save();
            res.status(200).send(`Comment added to blog titled "${title}"`);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Search for blog posts by keywords, categories, and authors
    searchBlogs: async (req, res) => {
        const { keywords, categories, authors } = req.query;
        try {
            const filter = {};
            if (keywords) {
                filter.$or = [{ title: { $regex: keywords, $options: 'i' } }, { content: { $regex: keywords, $options: 'i' } }];
            }
            if (categories) {
                filter.categories = { $in: categories.split(',') };
            }
            if (authors) {
                filter.author = { $in: authors.split(',') };
            }

            const blogs = await Blog.find({ ...filter, disabled: false });
            res.status(200).json(blogs);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = blogController;