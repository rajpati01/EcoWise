import EcoPoint from "../models/ecopoints.js";
import User from "../models/user.js";

// Get top users by EcoPoints
const getLeaderboard = async (req, res) => {
  try {
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const total = await EcoPoint.countDocuments();

    // Get top users by EcoPoints
    const topUsers = await EcoPoint.find()
      .sort({ totalPoints: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username name profileImage");

    // Format response with null checks
    const leaderboardData = topUsers
      .filter(entry => entry && entry.user) // Filter out any null entries
      .map((entry, index) => {
        if (!entry.user) {
          console.warn(`Missing user reference in EcoPoint ${entry._id}`);
          return null;
        }
        
        return {
          rank: skip + index + 1,
          _id: entry._id,
          user: {
            _id: entry.user._id,
            username: entry.user.username || entry.user.name || "Unknown User",
            profileImage: entry.user.profileImage
          },
          totalPoints: entry.totalPoints || 0,
          lastActive: entry.updatedAt,
        };
      })
      .filter(Boolean); // Remove any null results

    res.status(200).json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      leaderboard: leaderboardData,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch leaderboard" });
  }
};

// Fallback to get leaderboard directly from User model if EcoPoint doesn't exist
const getLeaderboardFromUsers = async (req, res) => {
  try {
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const total = await User.countDocuments();

    // Get top users by ecoPoints
    const topUsers = await User.find()
      .select('username name profileImage ecoPoints')
      .sort({ ecoPoints: -1 })
      .skip(skip)
      .limit(limit);

    // Format response with null checks
    const leaderboardData = topUsers
      .filter(user => user) // Filter out any null users
      .map((user, index) => {
        return {
          rank: skip + index + 1,
          user: {
            _id: user._id,
            username: user.username || user.name || "Unknown User",
            profileImage: user.profileImage
          },
          totalPoints: user.ecoPoints || 0,
          lastActive: user.updatedAt,
        };
      });

    res.status(200).json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      leaderboard: leaderboardData,
    });
  } catch (error) {
    console.error("Error fetching leaderboard from users:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch leaderboard" });
  }
};

// Get user rank
const getUserRank = async (req, res) => {
  try {
    // Carefully check for user ID from different sources
    let userId;
    
    if (req.params && req.params.id) {
      userId = req.params.id;
    } else if (req.user) {
      // Check both id and _id possibilities
      userId = req.user.id || req.user._id;
    }
    
    // If we still don't have a userId, return an error
    if (!userId) {
      console.warn("No user ID available for getUserRank");
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }
    
    let rank, totalPoints;

    // First try with EcoPoint model
    try {
      // Get user's EcoPoints
      const userPoints = await EcoPoint.findOne({ user: userId });

      if (userPoints) {
        // Count users with more points
        const higherRankedCount = await EcoPoint.countDocuments({
          totalPoints: { $gt: userPoints.totalPoints },
        });

        // User's rank is higher ranked count + 1
        rank = higherRankedCount + 1;
        totalPoints = userPoints.totalPoints;
      } else {
        throw new Error("EcoPoint not found");
      }
    } catch (error) {
      console.log("Falling back to User model for rank calculation", error.message);
      
      // Fallback to User model
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Count users with more points
      const higherRankedCount = await User.countDocuments({
        ecoPoints: { $gt: user.ecoPoints || 0 },
      });

      // User's rank is higher ranked count + 1
      rank = higherRankedCount + 1;
      totalPoints = user.ecoPoints || 0;
    }

    res.status(200).json({
      success: true,
      rank,
      totalPoints,
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user rank" });
  }
};

// Export all controller functions
export { getLeaderboard, getLeaderboardFromUsers, getUserRank };