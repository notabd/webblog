const User = require('../models/User'); // Import User model
const Blog = require('../models/Blog'); // Import Blog model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userController = {
    // User registration
    signUp: async (req, res) => {
        const { username, email, password } = req.body;
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = new User({ username, email, password: hashedPassword });
            await newUser.save();

            res.status(201).send(`User ${username} registered successfully`);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // User login
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).send('Invalid email or password');
            }

            // Compare hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send('Invalid email or password');
            }

            // Create and assign a token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('auth_token', token);

            res.status(200).send(`Login successful for ${user.username}`);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Update user credentials
    updateCredentials: async (req, res) => {
        const { username, email, newPassword } = req.body;
        const userId = req.user.id; // Assuming req.user is set in the middleware

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send('User not found');
            }

            if (username) user.username = username;
            if (email) user.email = email;
            if (newPassword) user.password = await bcrypt.hash(newPassword, 12);

            await user.save();
            res.status(200).send('User credentials updated successfully');
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Follow another user
    followUser: async (req, res) => {
        const { usernameToFollow } = req.body;
        const userId = req.user.id; // Assuming req.user is set in the middleware

        try {
            const user = await User.findById(userId);
            const userToFollow = await User.findOne({ username: usernameToFollow });

            if (!userToFollow) {
                return res.status(404).send('User to follow not found');
            }

            if (user.following.includes(userToFollow._id)) {
                return res.status(400).send('Already following this user');
            }

            user.following.push(userToFollow._id);
            await user.save();

            res.status(200).send(`You are now following ${usernameToFollow}`);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Retrieve user's notifications
    getNotifications: async (req, res) => {
        const userId = req.user.id; // Assuming req.user is set in the middleware

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send('User not found');
            }

            res.status(200).json(user.notifications);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = userController;
