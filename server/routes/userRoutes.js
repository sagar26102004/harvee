const express = require('express');
const router = express.Router();
const { 
    listUsers, 
    getUserById, 
    updateUser, 
    deleteUser 
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { updateValidation } = require('../middleware/validation');
const upload = require('../middleware/uploadMiddleware'); // Multer config

// --- Admin Panel Routes ---

// @route   GET /api/users (Admin Only)
router.route('/')
    .get(protect, adminOnly, listUsers); // List all users (protected and admin only)

// @route   GET, PUT, DELETE /api/users/:id
router.route('/:id')
    // Get single user details (Admin or User's own ID)
    .get(protect, getUserById) 
    
    // Update user details (Protected, Admin only for other users)
    .put(protect, adminOnly, upload, updateValidation, updateUser) 
    
    // Delete user (Protected, Admin only)
    .delete(protect, adminOnly, deleteUser); 


module.exports = router;