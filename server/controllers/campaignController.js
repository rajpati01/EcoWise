const Campaign = require('../models/Campaign');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all campaigns with filtering and pagination
exports.getAllCampaigns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      // Default to approved campaigns for regular users
      filter.status = 'approved';
    }
    
    if (req.query.campaignType) {
      filter.campaignType = req.query.campaignType;
    }
    
    if (req.query.city) {
      filter['location.city'] = new RegExp(req.query.city, 'i');
    }
    
    if (req.query.tags) {
      filter.tags = { $in: req.query.tags.split(',') };
    }
    
    if (req.query.upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }
    
    if (req.query.featured === 'true') {
      filter.featured = true;
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
      .populate('organizer', 'name email profileImage')
      .populate('participants.user', 'name profileImage')
      .populate('approvedBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Campaign.countDocuments(filter);

    res.json({
      success: true,
      data: campaigns,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCampaigns: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaigns',
      error: error.message
    });
  }
};

// Get single campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('organizer', 'name email profileImage ecoPoints')
      .populate('participants.user', 'name profileImage ecoPoints')
      .populate('approvedBy', 'name');

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Increment view count
    campaign.views += 1;
    await campaign.save();

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaign',
      error: error.message
    });
  }
};

// Create new campaign
exports.createCampaign = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const campaignData = {
      ...req.body,
      organizer: req.user.id
    };

    // Handle image uploads if present
    if (req.files && req.files.length > 0) {
      campaignData.images = req.files.map(file => ({
        url: `/uploads/campaign-images/${file.filename}`,
        public_id: file.filename
      }));
    }

    const campaign = new Campaign(campaignData);
    await campaign.save();

    await campaign.populate('organizer', 'name email profileImage');

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully and pending approval',
      data: campaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating campaign',
      error: error.message
    });
  }
};

// Update campaign
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Check if user is organizer or admin
    if (campaign.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this campaign'
      });
    }

    // If campaign is approved and being updated by organizer, set status back to pending
    if (campaign.status === 'approved' && req.user.role !== 'admin') {
      req.body.status = 'pending';
      req.body.approvedBy = undefined;
      req.body.approvedAt = undefined;
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/campaign-images/${file.filename}`,
        public_id: file.filename
      }));
      req.body.images = [...(campaign.images || []), ...newImages];
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email profileImage');

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: updatedCampaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating campaign',
      error: error.message
    });
  }
};

// Delete campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Check if user is organizer or admin
    if (campaign.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this campaign'
      });
    }

    await Campaign.findByIdAndDelete(req.params.id);

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

// Join campaign
exports.joinCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    if (campaign.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot join unapproved campaign'
      });
    }

    if (campaign.date <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot join past campaigns'
      });
    }

    await campaign.addParticipant(req.user.id);

    await campaign.populate('participants.user', 'name profileImage');

    res.json({
      success: true,
      message: 'Successfully joined campaign',
      data: campaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error joining campaign'
    });
  }
};

// Leave campaign
exports.leaveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    await campaign.removeParticipant(req.user.id);

    res.json({
      success: true,
      message: 'Successfully left campaign'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error leaving campaign'
    });
  }
};

// Like/Unlike campaign
exports.toggleLikeCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    const likeIndex = campaign.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike
      campaign.likes.splice(likeIndex, 1);
    } else {
      // Like
      campaign.likes.push({ user: req.user.id });
    }

    await campaign.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? 'Campaign unliked' : 'Campaign liked',
      likesCount: campaign.likesCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating like status',
      error: error.message
    });
  }
};

// Get campaigns by organizer
exports.getCampaignsByOrganizer = async (req, res) => {
  try {
    const organizerId = req.params.organizerId || req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const campaigns = await Campaign.find({ organizer: organizerId })
      .populate('organizer', 'name email profileImage')
      .populate('participants.user', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Campaign.countDocuments({ organizer: organizerId });

    res.json({
      success: true,
      data: campaigns,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCampaigns: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaigns',
      error: error.message
    });
  }
};

// Get campaigns near location
exports.getCampaignsNearby = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const campaigns = await Campaign.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      parseInt(maxDistance)
    ).populate('organizer', 'name email profileImage');

    res.json({
      success: true,
      data: campaigns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby campaigns',
      error: error.message
    });
  }
};

// Report campaign
exports.reportCampaign = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Report reason is required'
      });
    }

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Check if user already reported this campaign
    const existingReport = campaign.reports.find(
      report => report.user.toString() === req.user.id
    );

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this campaign'
      });
    }

    campaign.reports.push({
      user: req.user.id,
      reason: reason
    });

    await campaign.save();

    res.json({
      success: true,
      message: 'Campaign reported successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reporting campaign',
      error: error.message
    });
  }
};