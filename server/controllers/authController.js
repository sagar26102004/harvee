const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const fs = require('fs'); // Node's File System module to delete images

// --- Helper function to generate JWT tokens ---
const generateToken = (id, role, expiresIn) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: expiresIn, // e.g., '1h' for access, '7d' for refresh
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    // 1. Check for validation errors from express-validator middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If validation fails, and an image was uploaded, delete it.
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address, state, city, country, pincode, password } = req.body;
    const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        // 2. Check if user already exists (email or phone)
        let user = await User.findOne({ $or: [{ email }, { phone }] });
        if (user) {
            // If user exists, and an image was uploaded, delete it.
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ message: 'User with this email or phone already exists.' });
        }

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create User
        user = await User.create({
            name, email, phone, address, state, city, country, pincode,
            profile_image,
            password: hashedPassword,
            role: email === 'admin@example.com' ? 'admin' : 'user', // Basic admin assignment (change to env var or manual setup later)
        });

        // 5. Generate Tokens
        const accessToken = generateToken(user._id, user.role, process.env.ACCESS_TOKEN_EXPIRY || '1h');
        const refreshToken = generateToken(user._id, user.role, process.env.REFRESH_TOKEN_EXPIRY || '7d');

        // 6. Return response
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
            refreshToken,
        });

    } catch (error) {
        console.error(error);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// @desc    Authenticate user & get tokens
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { loginId, password } = req.body; // loginId can be email or phone

    try {
        // 1. Find user by email or phone
        const user = await User.findOne({
            $or: [{ email: loginId }, { phone: loginId }]
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            // 2. Passwords match, generate tokens
            const accessToken = generateToken(user._id, user.role, process.env.ACCESS_TOKEN_EXPIRY || '1h');
            const refreshToken = generateToken(user._id, user.role, process.env.REFRESH_TOKEN_EXPIRY || '7d');

            // 3. Return response (No sensitive data returned)
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken,
            });
        } else {
            res.status(401).json({ message: 'Invalid Credentials (Email/Phone or Password)' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
};