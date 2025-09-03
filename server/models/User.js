import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [30, "Username cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, // Exclude password from queries by default
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  ecoPoints: {
    type: Number,
    default: 0,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  loginHistory: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      ip: String,
      device: String,
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog", // Assuming likes are for blog posts
    },
  ],
  classifications: [
    {
      wasteType: {
        type: String,
        enum: [
          "plastic",
          "paper",
          "glass",
          "metal",
          "organic",
          "electronic",
          "other",
        ],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      pointsEarned: {
        type: Number,
        default: 1,
      },
    },
  ],
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
  campaigns: [
    {
      campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign", // Reference to a Campaign model
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["active", "completed", "left"],
        default: "active",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// export default mongoose.model('User', userSchema);

// Check if model exists before compiling
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
