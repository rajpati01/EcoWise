const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: null
  },
  ecoPoints: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    name: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      campaigns: {
        type: Boolean,
        default: true
      },
      blogs: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ ecoPoints: -1 });

// Hashed password before saving
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds)
        next();
    } catch(error) {
        next(error);
    }
})

// Instance method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to update eco points and level
userSchema.methods.addEcoPoints = function(points) {
  this.ecoPoints += points;
  
  // Level calculation (every 100 points = 1 level)
  this.level = Math.floor(this.ecoPoints / 100) + 1;
  
  return this.save();
};

// Instance method to add badge
userSchema.methods.addBadge = function(badgeName, description) {
  const existingBadge = this.badges.find(badge => badge.name === badgeName);
  
  if (!existingBadge) {
    this.badges.push({
      name: badgeName,
      description: description
    });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method for leaderboard
userSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ ecoPoints: -1 })
    .limit(limit)
    .select('firstName lastName avatar ecoPoints level badges');
};

module.exports = mongoose.model('User', userSchema);