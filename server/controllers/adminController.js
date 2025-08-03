
const User = require('../models/User');
const Campaign = require('../models/Campaign');

// Get all campaigns for admin (including pending, rejected, etc.)
exports.getAllCampaignsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.campaignType) {
      filter.campaignType = req.query.campaignType;
    }
    
    if (req.query.organizer) {
      filter.organizer = req.query.organizer;
    }
    
    if (req.query.reported === 'true') {
      filter['reports.0'] = { $exists: true };
    }

    // Sort options
    let sort = {};
    if (req.query.sort) {
      const sortField = req.query.sort;
      const sortOrder = req.query.order === 'desc' ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort = { createdAt: -1 };
    }

    const campaigns = await Campaign.find(filter)
      .populate('organizer', 'name email profileImage ecoPoints')
      .populate('participants.user', 'name profileImage')
      .populate('approvedBy', 'name')
      .populate('reports.user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Campaign.countDocuments(filter);

    // Get campaign statistics
    const stats = await Campaign.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: campaigns,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCampaigns: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      stats: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaigns',
      error: error.message
    });
  }
};

// Approve campaign
exports.approveCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { ecoPointsReward, featured = false } = req.body;

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    if (campaign.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending campaigns can be approved'
      });
    }

    // Update campaign status
    campaign.status = 'approved';
    campaign.approvedBy = req.user.id;
    campaign.approvedAt = new Date();
    campaign.featured = featured;
    
    if (ecoPointsReward !== undefined) {
      campaign.ecoPointsReward = ecoPointsReward;
    }

    await campaign.save();

    // Award eco points to organizer for campaign approval
    const organizer = await User.findById(campaign.organizer);
    if (organizer) {
      organizer.ecoPoints += 25; // Bonus points for approved campaign
      await organizer.save();
    }

    await campaign.populate('organizer', 'name email profileImage');

    res.json({
      success: true,
      message: 'Campaign approved successfully',
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving campaign',
      error: error.message
    });
  }
};

// Reject campaign
exports.rejectCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    if (campaign.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending campaigns can be rejected'
      });
    }

    campaign.status = 'rejected';
    campaign.rejectionReason = rejectionReason;
    campaign.approvedBy = req.user.id;

    await campaign.save();
    await campaign.populate('organizer', 'name email profileImage');

    res.json({
      success: true,
      message: 'Campaign rejected successfully',
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting campaign',
      error: error.message
    });
  }
};

// Feature/Unfeature campaign
exports.toggleFeatureCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    campaign.featured = !campaign.featured;
    await campaign.save();

    res.json({
      success: true,
      message: `Campaign ${campaign.featured ? 'featured' : 'unfeatured'} successfully`,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating campaign feature status',
      error: error.message
    });
  }
};

// Delete campaign (Admin only)
exports.deleteCampaignByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    await Campaign.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting campaign',
      error: error.message
    });
  }
};

// Mark campaign as completed and award points
exports.completeCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { attendedParticipants } = req.body; // Array of participant IDs who attended

    const campaign = await Campaign.findById(id)
      .populate('participants.user', 'name email');

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    if (campaign.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved campaigns can be marked as completed'
      });
    }

    // Mark campaign as completed
    campaign.status = 'completed';

    // Mark attendance and award eco points
    if (attendedParticipants && attendedParticipants.length > 0) {
      for (const participant of campaign.participants) {
        const attended = attendedParticipants.includes(participant.user._id.toString());
        participant.attended = attended;

        // Award eco points to participants who attended
        if (attended) {
          const user = await User.findById(participant.user._id);
          if (user) {
            user.ecoPoints += campaign.ecoPointsReward;
            await user.save();
          }
        }
      }
    }

    await campaign.save();

    res.json({
      success: true,
      message: 'Campaign marked as completed and eco points awarded',
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing campaign',
      error: error.message
    });
  }
};

// Get campaign analytics
exports.getCampaignAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Campaign statistics by status
    const statusStats = await Campaign.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Campaign statistics by type
    const typeStats = await Campaign.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$campaignType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Campaign statistics by city
    const cityStats = await Campaign.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Monthly campaign creation trend
    const monthlyStats = await Campaign.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top organizers
    const topOrganizers = await Campaign.aggregate([
      { $match: { ...dateFilter, status: 'approved' } },
      {
        $group: {
          _id: '$organizer',
          campaignCount: { $sum: 1 },
          totalParticipants: { $sum: '$participantCount' }
        }
      },
      { $sort: { campaignCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'organizer'
        }
      },
      { $unwind: '$organizer' },
      {
        $project: {
          organizerName: '$organizer.name',
          organizerEmail: '$organizer.email',
          campaignCount: 1,
          totalParticipants: 1
        }
      }
    ]);

    // Participation statistics
    const participationStats = await Campaign.aggregate([
      { $match: { ...dateFilter, status: 'approved' } },
      {
        $group: {
          _id: null,
          totalCampaigns: { $sum: 1 },
          totalParticipants: { $sum: '$participantCount' },
          averageParticipants: { $avg: '$participantCount' },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likesCount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusStats: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        typeStats: typeStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        cityStats,
        monthlyStats,
        topOrganizers,
        participationStats: participationStats[0] || {}
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaign analytics',
      error: error.message
    });
  }
};

// Get reported campaigns
exports.getReportedCampaigns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const campaigns = await Campaign.find({
      'reports.0': { $exists: true }
    })
      .populate('organizer', 'name email profileImage')
      .populate('reports.user', 'name email')
      .sort({ 'reports.reportedAt': -1 })
      .skip(skip)
      .limit(limit);

    const total = await Campaign.countDocuments({
      'reports.0': { $exists: true }
    });

    res.json({
      success: true,
      data: campaigns,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReportedCampaigns: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reported campaigns',
      error: error.message
    });
  }
};