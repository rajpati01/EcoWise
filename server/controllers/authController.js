import User from "../models/User.js";
import EcoPoint from "../models/EcoPoints.js";
import PasswordReset from "../models/PasswordReset.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";

dotenv.config();

// Generate a random 6-digit code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // create new user
    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    await user.save();

    // add eco point record for the new user
    const newEcoPoint = new EcoPoint({
      user: user._id,
      totalPoints: 0,
      history: [],
    });
    await newEcoPoint.save();

    const token = generateToken(user._id);
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // log to confirm what's being received
    // console.log("Login attempt for:", email);

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // console.log("user from db:", user);
    // console.log("entered password:", password);
    // console.log("stored password:", user.password);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log("🔍 isMatch result:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

    // After successful authentication, update lastLogin
    await User.findByIdAndUpdate(user._id, {
      $set: { lastLogin: new Date() },
      $push: {
        loginHistory: {
          timestamp: new Date(),
          ip: req.ip,
          device: req.headers["user-agent"],
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle forgot password request
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "No account found with that email address",
      });
    }

    // Generate a 6-digit code
    const resetCode = generateResetCode();

    // Set expiration time (10 MINUTE from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Changed to 10 minute

    // Store or update reset code in database
    await PasswordReset.findOneAndUpdate(
      { email },
      {
        email,
        code: resetCode,
        expiresAt,
      },
      { upsert: true, new: true }
    );

    // console.log(`RESET CODE for ${email}: ${resetCode}`);

    res.status(200).json({
      message: "Verification code sent to your email",
      resetCode: resetCode, // Return code for demo purposes
      expiresIn: 600,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify the reset code
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find the reset record
    const resetRecord = await PasswordReset.findOne({ email });

    // Check if record exists and is valid
    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid reset request" });
    }

    // Check if code has expired
    if (new Date() > new Date(resetRecord.expiresAt)) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Verify code
    if (resetRecord.code !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Generate a secure token for password reset
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Update reset record with the token
    resetRecord.resetToken = resetToken;
    await resetRecord.save();

    res.status(200).json({
      message: "Code verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error("Verify code error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset the password
export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    // Find the reset record
    const resetRecord = await PasswordReset.findOne({
      email,
      resetToken: token,
    });

    // Check if record exists and is valid
    if (!resetRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Check if token has expired
    if (new Date() > new Date(resetRecord.expiresAt)) {
      return res.status(400).json({ message: "Reset token has expired" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // CHANGE THIS PART: Use findOneAndUpdate instead of save()
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true, runValidators: false }
    );

    // Delete the reset record
    await PasswordReset.findByIdAndDelete(resetRecord._id);

    res.status(200).json({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
