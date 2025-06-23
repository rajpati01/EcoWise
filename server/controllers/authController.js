const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

// genetate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  console.log("Incoming req.body:", req.body);

  const errors = validationResult(req);

  // Check for validation errors
  if (!errors.isEmpty()) {
    const formatted = errors.array();
    console.log("Validation failed:", formatted);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formatted,
    });
  }
  const { firstName, lastName, email, password, confirmPassword, role } =
    req.body;
  try {
    // check if user already exist
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    //create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    res.status(201).json({
      _id: user._id,
      name: User.firstName,
      email: User.email,
      role: User.role,
      token: generateToken(user._id),
    });
    sendTokenResponse(user, 201, res, "User registered successfully");
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message });
  }
  console.dir(errors, { depth: null });

};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.firstName,
        email: user.email,
        role: user.role,
        tokenL: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
