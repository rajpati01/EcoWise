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

// Send token response
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);
<<<<<<< HEAD
  
  const options = {
    expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
=======

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
  };

  // Remove password from output
  user.password = undefined;

  res
    .status(statusCode)
<<<<<<< HEAD
    .cookie('token', token, options)
=======
    .cookie("token", token, options)
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
    .json({
      success: true,
      message,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        ecoPoints: user.ecoPoints,
        level: user.level,
        badges: user.badges,
        location: user.location,
        preferences: user.preferences,
        isVerified: user.isVerified,
<<<<<<< HEAD
        createdAt: user.createdAt
      }
=======
        createdAt: user.createdAt,
      },
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
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
<<<<<<< HEAD
    res.status(201).json({
      _id: user._id,
      name: User.firstName,
      email: User.email,
      role: User.role,
      token: generateToken(user._id),
    });

    // Award welcome bonus points
    await user.addEcoPoints(10);
    await user.addBadge('Welcome', 'Welcome to EcoWise!');
=======

    // Award welcome bonus points
    await user.addEcoPoints(10);
    await user.addBadge("Welcome", "Welcome to EcoWise!");
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11

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

    // match password
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
<<<<<<< HEAD
        message: 'Account has been deactivated. Please contact support.'
      });
    }

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.firstName,
        email: user.email,
        role: user.role,
        tokenL: generateToken(user._id),
=======
        message: "Account has been deactivated. Please contact support.",
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

<<<<<<< HEAD
    sendTokenResponse(user, 200, res, 'Login successful');

=======
    sendTokenResponse(user, 200, res, "Login successful");
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
<<<<<<< HEAD
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
=======
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
  });

  res.status(200).json({
    success: true,
<<<<<<< HEAD
    message: 'Logged out successfully'
=======
    message: "Logged out successfully",
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
<<<<<<< HEAD
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
=======

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        ecoPoints: user.ecoPoints,
        level: user.level,
        badges: user.badges,
        location: user.location,
        preferences: user.preferences,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
<<<<<<< HEAD
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
=======
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
<<<<<<< HEAD
        message: 'Validation failed',
        errors: errors.array()
=======
        message: "Validation failed",
        errors: errors.array(),
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
      });
    }

    const { firstName, lastName, location, preferences } = req.body;
<<<<<<< HEAD
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
=======

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
      });
    }

    // Update allowed fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (location) user.location = location;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.status(200).json({
      success: true,
<<<<<<< HEAD
      message: 'Profile updated successfully',
=======
      message: "Profile updated successfully",
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        ecoPoints: user.ecoPoints,
        level: user.level,
        badges: user.badges,
        location: user.location,
        preferences: user.preferences,
        isVerified: user.isVerified,
<<<<<<< HEAD
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
=======
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
<<<<<<< HEAD
        message: 'Validation failed',
        errors: errors.array()
=======
        message: "Validation failed",
        errors: errors.array(),
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
      });
    }

    const { currentPassword, newPassword } = req.body;
<<<<<<< HEAD
    
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
=======

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
<<<<<<< HEAD
        message: 'Current password is incorrect'
=======
        message: "Current password is incorrect",
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
<<<<<<< HEAD
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
=======
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
