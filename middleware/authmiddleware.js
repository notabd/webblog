const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const authenticate_user = async (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).send('Access Denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};

const authenticate_admin = async (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).send('Access Denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(403).send('Access denied. Not an admin.');
        }
        req.admin = admin;
        next();
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};

module.exports = { authenticate_user, authenticate_admin };
