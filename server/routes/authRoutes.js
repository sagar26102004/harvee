const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');
const upload = require('../middleware/uploadMiddleware'); // Multer config
const { validationResult } = require('express-validator'); // To catch errors after validation

// --- Register User Route ---
router.post('/register', 
    upload,                   // 1. Handle image upload (uses 'profile_image' field name)
    registerValidation,       // 2. Validate input fields
    (req, res, next) => {     // 3. Custom check for image file existence after Multer/Validation
        const errors = validationResult(req);
        
        // If validation failed, the controller (registerUser) will handle deleting the file.
        // If required fields were missing, we still pass to the controller.
        
        // Check if profile_image is required and missing
        // For simplicity here, we assume if Multer didn't upload a file AND
        // validation passed, we can proceed. The controller handles the required check.

        next(); // Proceed to controller
    },
    registerUser              // 4. Execute registration logic
);

// --- Login User Route ---
router.post('/login', 
    loginValidation,          // 1. Validate input fields
    loginUser                 // 2. Execute login logic
);

module.exports = router;