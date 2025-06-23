const express = require('express');
const router = express.Router();

const {
  register,
  login,
} = require('../controllers/authController');


// Import middleware
const { protect } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
} = require('../middleware/validation');

// @route   POST /api/auth/register
router.post('/register', validateRegister, register);

// @route   POST /api/auth/login
router.post('/login', validateLogin, login);


module.exports = router;