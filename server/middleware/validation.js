const { body } = require('express-validator');

// Validation rules for the User Registration API
exports.registerValidation = [
    // Name: min 3 chars, alphabets only
    body('name')
        .trim()
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters.')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain only alphabets.'),

    // Email: valid email format, normalize to lowercase
    body('email')
        .isEmail().withMessage('Please enter a valid email address.')
        .normalizeEmail()
        .custom(async (value) => {
            // Note: Actual uniqueness check should be done in the controller
            // as part of the transaction to avoid race conditions, but this checks format.
            return true;
        }),

    // Phone: 10-15 digits
    body('phone')
        .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits.')
        .isNumeric().withMessage('Phone number must contain only digits.'),

    // Address: optional, max 150 chars
    body('address')
        .optional()
        .isLength({ max: 150 }).withMessage('Address cannot exceed 150 characters.'),

    // State, City, Country: required
    body('state').notEmpty().withMessage('State is required.'),
    body('city').notEmpty().withMessage('City is required.'),
    body('country').notEmpty().withMessage('Country is required.'),

    // Pincode: 4-10 digits
    body('pincode')
        .isLength({ min: 4, max: 10 }).withMessage('Pincode must be between 4 and 10 digits.')
        .isNumeric().withMessage('Pincode must contain only digits.'),

    // Password: min 6 chars, must contain a number
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .matches(/\d/).withMessage('Password must contain at least one number.'),

    // profile_image validation (handled separately by multer/uploadMiddleware
    // but the required status can be checked here if needed)
];

// Validation rules for the Login API
exports.loginValidation = [
    // Login ID (email/phone)
    body('loginId')
        .notEmpty().withMessage('Email or phone number is required.'),
        
    // Password
    body('password')
        .notEmpty().withMessage('Password is required.'),
];

// Validation rules for updating user details (Less strict on fields)
exports.updateValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters.')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain only alphabets.'),

    body('email')
        .optional()
        .isEmail().withMessage('Please enter a valid email address.')
        .normalizeEmail(),

    body('phone')
        .optional()
        .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits.')
        .isNumeric().withMessage('Phone number must contain only digits.'),

    // Add other optional update validations here
];