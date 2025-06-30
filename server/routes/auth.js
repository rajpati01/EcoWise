const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

// Import middleware
const { protect } = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateChangePassword,
} = require("../middleware/validation");

// @route   POST /api/auth/register
router.post("/register", validateRegister, register);

// @route   POST /api/auth/login
router.post("/login", validateLogin, login);

// @route   POST /api/auth/logout
router.post("/logout", logout);

// @route   GET /api/auth/me
// @desc    Get current logged in user
router.get("/profile", protect, getMe);

// @route   PUT /api/auth/profile
router.put("/profile", protect, validateProfileUpdate, updateProfile);

// @route   PUT /api/auth/change-password
router.put("/change-password", protect, validateChangePassword, changePassword);

module.exports = router;
