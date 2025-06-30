const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateCampaign, validateCampaignUpdate } = require('../middleware/validation');

// Public routes
router.get('/', campaignController.getAllCampaigns);
router.get('/nearby', campaignController.getCampaignsNearby);
router.get('/:id', campaignController.getCampaignById);

// Protected routes (require authentication)
router.use(protect);

// Create new campaign
router.post('/', 
  upload.array('images', 5), 
  validateCampaign, 
  campaignController.createCampaign
);

// Update campaign
router.put('/:id', 
  upload.array('images', 5), 
  validateCampaignUpdate, 
  campaignController.updateCampaign
);

// Delete campaign
router.delete('/:id', campaignController.deleteCampaign);

// Join/Leave campaign
router.post('/:id/join', campaignController.joinCampaign);
router.post('/:id/leave', campaignController.leaveCampaign);

// Like/Unlike campaign
router.post('/:id/like', campaignController.toggleLikeCampaign);

// Report campaign
router.post('/:id/report', campaignController.reportCampaign);

// Get campaigns by organizer
router.get('/organizer/:organizerId', campaignController.getCampaignsByOrganizer);
router.get('/my/campaigns', campaignController.getCampaignsByOrganizer);

module.exports = router;