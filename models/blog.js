const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    ratings: {
        type: [Number],
        default: []
    },
    comments: {
        type: [{ body: String, date: Date }],
        default: []
    },
    avgrating: {
        type: Number,
        default: 0
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

// Middleware to calculate average rating before saving
blogSchema.pre('save', function(next) {
    if (this.ratings.length > 0) {
        this.avgrating = this.ratings.reduce((acc, curr) => acc + curr, 0) / this.ratings.length;
    }
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
