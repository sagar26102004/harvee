const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Used if you need to fetch fresh user data

/**
 * Middleware to verify the Access Token and protect private routes.
 * Populates req.user with decoded token data (id and role).
 */
exports.protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in the Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user data (id, role) to the request object
            req.user = decoded; 

            next();
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed or expired.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};

/**
 * Middleware to check if the authenticated user has the 'admin' role.
 * Must be used AFTER the protect middleware.
 */
exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Not authorized as an admin.' });
    }
};