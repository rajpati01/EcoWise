import mongoose from 'mongoose';
import EcoPoint from './EcoPoints.js';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      enum: [
        'login',
        'registration',
        'create_blog',
        'edit_blog',
        'delete_blog',
        'comment_blog',
        'like_blog',
        'create_campaign',
        'join_campaign',
        'complete_campaign',
        'classification',  // Waste classification
        'share_content',
        'earn_badge',
        'level_up',
        'daily_checkin',
        'complete_challenge',
        'admin_action'
      ]
    },
    action: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    points: {
      type: Number,
      default: 0
    },
    metadata: {
      // For storing additional activity-specific data
      type: mongoose.Schema.Types.Mixed
    },
    // References to related content
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign'
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    },
    // For tracking IP address and device info for security
    ipAddress: String,
    userAgent: String,
    // For tracking whether points were awarded for this activity
    pointsAwarded: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes for common queries
activitySchema.index({ createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ userId: 1, type: 1, createdAt: -1 });

// Map activity types to EcoPoint action types
const activityToEcoPointMap = {
  'classification': 'classification',
  'create_blog': 'article',
  'comment_blog': 'comment_blog',
  'like_blog': 'like_blog',
  'join_campaign': 'join_campaign',
  'create_campaign': 'campaign',
  'complete_campaign': 'campaign',
  // Add more mappings as needed
};

// Static method to log a new activity
activitySchema.statics.logActivity = async function(activityData) {
  try {
    const activity = new this(activityData);
    await activity.save();
    
    // If points are associated with this activity, update user's eco points
    if (activity.points > 0 && !activity.pointsAwarded) {
      // Map activity type to EcoPoint action type
      const ecoPointAction = activityToEcoPointMap[activity.type] || 'article'; // Default to article
      
      // First try to find existing EcoPoint document for this user
      let ecoPoint = await EcoPoint.findOne({ user: activity.userId });
      
      // If no document exists, create one
      if (!ecoPoint) {
        ecoPoint = new EcoPoint({
          user: activity.userId,
          totalPoints: 0,
          history: []
        });
      }
      
      // Add to total points
      ecoPoint.totalPoints += activity.points;
      
      // Add to history
      ecoPoint.history.push({
        action: ecoPointAction,
        points: activity.points,
        description: activity.description || `Points for ${activity.action}`,
      });
      
      // Save the updated EcoPoint document
      await ecoPoint.save();
      
      // Also update the user's lastActive date
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(
        activity.userId,
        { $set: { lastActive: new Date() } }
      );
      
      // Mark points as awarded
      activity.pointsAwarded = true;
      await activity.save();
    }
    
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

// Get user's recent activities
activitySchema.statics.getUserActivities = async function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('blogId', 'title')
    .populate('campaignId', 'title')
    .lean();
};

// Get activity stats for a user
activitySchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalPoints: { $sum: '$points' }
      }
    }
  ]);
  
  return stats;
};

// Get daily active users for a specific date range
activitySchema.statics.getDailyActiveUsers = async function(startDate, endDate) {
  return this.aggregate([
    { 
      $match: { 
        createdAt: { $gte: startDate, $lte: endDate } 
      } 
    },
    {
      $group: {
        _id: { 
          userId: "$userId",
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: {
          year: "$_id.year",
          month: "$_id.month",
          day: "$_id.day"
        },
        uniqueUsers: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
  ]);
};

// Get most common activities
activitySchema.statics.getMostCommonActivities = async function(limit = 10) {
  return this.aggregate([
    { $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;