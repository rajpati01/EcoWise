const { body } = require("express-validator");

// User registration validation
exports.validateRegister = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email cannot exceed 100 characters"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6, max: 128 })
    .withMessage("Password must be between 6 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

// User login validation
exports.validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

// Profile update validation
exports.validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('location.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City name cannot exceed 100 characters'),

  body('location.country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country name cannot exceed 100 characters'),

  body('location.coordinates.lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('location.coordinates.lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

  body('preferences.notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification preference must be a boolean'),

  body('preferences.notifications.campaigns')
    .optional()
    .isBoolean()
    .withMessage('Campaign notification preference must be a boolean'),

  body('preferences.notifications.blogs')
    .optional()
    .isBoolean()
    .withMessage('Blog notification preference must be a boolean'),

  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Theme must be either light or dark')
];

// Change password validation
exports.validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6, max: 128 })
    .withMessage('New password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('confirmNewPassword')
    .notEmpty()
    .withMessage('Confirm new password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New passwords do not match');
      }
      return true;
    })
];

// Email validation (for forgot password, etc.)
exports.validateEmail = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

// Generic validation for MongoDB ObjectId
exports.validateObjectId = (paramName) => [
  body(paramName)
    .notEmpty()
    .withMessage(`${paramName} is required`)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`)
];

// Validation for creating campaign
exports.validateCampaign = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Campaign title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Campaign description is required')
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),

  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Campaign address is required'),

  body('location.coordinates.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required (-90 to 90)'),

  body('location.coordinates.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required (-180 to 180)'),

  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('location.country')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Country must be at least 2 characters'),

  body('date')
    .isISO8601()
    .withMessage('Valid date is required')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Campaign date must be in the future');
      }
      return true;
    }),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required')
    .custom((value, { req }) => {
      if (value && new Date(value) <= new Date(req.body.date)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  body('maxParticipants')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Maximum participants must be between 1 and 1000'),

  body('campaignType')
    .isIn(['cleanup', 'awareness', 'recycling', 'tree-planting', 'educational', 'other'])
    .withMessage('Valid campaign type is required'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Each tag must be between 2 and 20 characters'),

  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array'),

  body('requirements.*')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Each requirement must be between 5 and 100 characters'),

  body('contactInfo.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),

  body('contactInfo.email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),

  body('ecoPointsReward')
    .optional()
    .isInt({ min: 0, max: 500 })
    .withMessage('Eco points reward must be between 0 and 500')
];

// Validation for updating campaign
exports.validateCampaignUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),

  body('location.address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Campaign address cannot be empty'),

  body('location.coordinates.lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required (-90 to 90)'),

  body('location.coordinates.lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required (-180 to 180)'),

  body('location.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Valid date is required')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Campaign date must be in the future');
      }
      return true;
    }),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required'),

  body('maxParticipants')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Maximum participants must be between 1 and 1000'),

  body('campaignType')
    .optional()
    .isIn(['cleanup', 'awareness', 'recycling', 'tree-planting', 'educational', 'other'])
    .withMessage('Valid campaign type is required'),

  body('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'completed', 'cancelled'])
    .withMessage('Valid status is required'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),

  body('rejectionReason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Rejection reason cannot exceed 500 characters')
];


