const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Campaign description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: {
      type: String,
      required: [true, 'Campaign address is required'],
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'Nepal'
    }
  },
  date: {
    type: Date,
    required: [true, 'Campaign date is required'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Campaign date must be in the future'
    }
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(endDate) {
        return !endDate || endDate > this.date;
      },
      message: 'End date must be after start date'
    }
  },
  maxParticipants: {
    type: Number,
    min: [1, 'Maximum participants must be at least 1'],
    max: [1000, 'Maximum participants cannot exceed 1000']
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  campaignType: {
    type: String,
    enum: ['cleanup', 'awareness', 'recycling', 'tree-planting', 'educational', 'other'],
    required: true,
    default: 'cleanup'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    public_id: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  contactInfo: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  ecoPointsReward: {
    type: Number,
    default: 50,
    min: [0, 'Eco points reward cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reports: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for participant count
campaignSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Virtual for likes count
campaignSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for checking if campaign is full
campaignSchema.virtual('isFull').get(function() {
  return this.maxParticipants && this.participants.length >= this.maxParticipants;
});

// Virtual for checking if campaign is upcoming
campaignSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date();
});

// Index for better query performance
campaignSchema.index({ 'location.coordinates.lat': 1, 'location.coordinates.lng': 1 });
campaignSchema.index({ date: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ organizer: 1 });
campaignSchema.index({ tags: 1 });
campaignSchema.index({ campaignType: 1 });

// Pre-save middleware to set approval date
campaignSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'approved' && !this.approvedAt) {
    this.approvedAt = new Date();
  }
  next();
});

// Method to add participant
campaignSchema.methods.addParticipant = function(userId) {
  const isAlreadyParticipant = this.participants.some(
    participant => participant.user.toString() === userId.toString()
  );
  
  if (isAlreadyParticipant) {
    throw new Error('User is already a participant');
  }
  
  if (this.isFull) {
    throw new Error('Campaign is full');
  }
  
  this.participants.push({ user: userId });
  return this.save();
};

// Method to remove participant
campaignSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(
    participant => participant.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to mark attendance
campaignSchema.methods.markAttendance = function(userId, attended = true) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (!participant) {
    throw new Error('User is not a participant');
  }
  
  participant.attended = attended;
  return this.save();
};

// Static method to find campaigns near location
campaignSchema.statics.findNearby = function(lat, lng, maxDistance = 10000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: maxDistance
      }
    },
    status: 'approved',
    date: { $gte: new Date() }
  });
};

module.exports = mongoose.model('Campaign', campaignSchema);