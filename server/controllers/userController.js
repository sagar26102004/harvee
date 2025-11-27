const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// --- Helper function to remove old profile image ---
const deleteOldImage = async (userId) => {
    const user = await User.findById(userId);
    if (user && user.profile_image) {
        const imagePath = path.join(__dirname, '..', user.profile_image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
};

// @desc    List all users with search/filter (Admin Only)
// @route   GET /api/users
// @access  Private (Admin)
exports.listUsers = async (req, res) => {
    // Implement Search & Filter (Bonus points)
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
            { state: { $regex: req.query.search, $options: 'i' } },
            { city: { $regex: req.query.search, $options: 'i' } },
        ]
    } : {};

    try {
        const users = await User.find({ ...keyword, role: { $ne: 'admin' } }) // Exclude admin from the list
            .select('-password -__v -updatedAt') // Exclude sensitive/unnecessary data
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users.' });
    }
};

// @desc    Get single user details
// @route   GET /api/users/:id
// @access  Private (Admin or Self-Access - RBAC Bonus)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Basic RBAC check: user can view their own profile, or Admin can view any profile.
        if (req.user.role !== 'admin' && req.user.id !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this user.' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details.' });
    }
};

// @desc    Update user details (Admin Only)
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
    const { name, email, phone, address, state, city, country, pincode, password } = req.body;
    const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            // Delete new file if user not found
            if (req.file) { fs.unlinkSync(req.file.path); }
            return res.status(404).json({ message: 'User not found.' });
        }
        
        // 1. Handle Old Image Deletion
        if (profile_image) {
            await deleteOldImage(user._id);
        }

        // 2. Prepare Update Object
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.address = address;
        user.state = state || user.state;
        user.city = city || user.city;
        user.country = country || user.country;
        user.pincode = pincode || user.pincode;
        user.profile_image = profile_image || user.profile_image;

        // Handle password change if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // 3. Save and return
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profile_image: updatedUser.profile_image,
            message: 'User updated successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user.' });
    }
};

// @desc    Delete user (Admin Only)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent admin from deleting themselves or other admins accidentally
        if (user.role === 'admin' && user._id.toString() !== req.user.id) {
             return res.status(403).json({ message: 'Cannot delete another admin.' });
        }

        // Delete the profile image from the server storage
        await deleteOldImage(user._id);

        // Remove from database
        await User.deleteOne({ _id: req.params.id });

        res.json({ message: 'User removed successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting user.' });
    }
};