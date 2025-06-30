const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// Apply admin middleware to all routes
router.use(protect);
// router.use(admin);

// Campaign management routes
router.get('/campaigns', adminController.getAllCampaignsForAdmin);
router.get('/campaigns/reported', adminController.getReportedCampaigns);
router.get('/campaigns/analytics', adminController.getCampaignAnalytics);

// Campaign approval/rejection
router.put('/campaigns/:id/approve', adminController.approveCampaign);
router.put('/campaigns/:id/reject', adminController.rejectCampaign);

// Campaign feature toggle
router.put('/campaigns/:id/feature', adminController.toggleFeatureCampaign);

// Mark campaign as completed
router.put('/campaigns/:id/complete', adminController.completeCampaign);

// Delete campaign (admin only)
router.delete('/campaigns/:id', adminController.deleteCampaignByAdmin);

module.exports = router;