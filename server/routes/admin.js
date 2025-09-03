import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import  isAdmin  from '../middleware/admin.js'; 
import {
  approveCampaign,
  rejectCampaign,
  approveBlog,
  rejectBlog,
} from '../controllers/adminController.js';
import { 
  getUsers,
  getUserDetails,
  deleteUser
} from "../controllers/adminUserController.js";
import {
  getAdminBlogs,
  deleteBlog,
  bulkApproveBlog,
  bulkRejectBlog,
  bulkDeleteBlog
} from '../controllers/adminBlogController.js';

import {
  getAdminCampaigns,
  deleteCampaign,
  bulkApproveCampaign,
  bulkRejectCampaign,
  bulkDeleteCampaign
} from '../controllers/adminCampaignController.js';
import {
  getAnalytics
} from '../controllers/adminAnalyticsController.js';

const router = express.Router();

// Secure all admin routes with your existing middleware
router.use(protect, admin);

// Campaign approval/rejection
router.post('/campaigns/:id/approve', protect, isAdmin, approveCampaign);
router.post('/campaigns/:id/reject', protect, isAdmin, rejectCampaign);

// Blog approval/rejection
router.post('/blogs/:id/approve', protect, isAdmin, approveBlog);
router.post('/blogs/:id/reject', protect, isAdmin, rejectBlog);

// New user management routes
router.get('/users', getUsers);
router.get('/users/:userId', getUserDetails);
router.delete('/users/:userId', deleteUser);

// Blog management routes
router.get('/blogs', protect, isAdmin, getAdminBlogs);
router.delete('/blogs/:blogId', protect, isAdmin, deleteBlog);
router.put('/blogs/:blogId/approve', protect, isAdmin, approveBlog);
router.put('/blogs/:blogId/reject', protect, isAdmin, rejectBlog);
router.post('/blogs/bulk-approve', protect, isAdmin, bulkApproveBlog);
router.post('/blogs/bulk-reject', protect, isAdmin, bulkRejectBlog);
router.post('/blogs/bulk-delete', protect, isAdmin, bulkDeleteBlog);

// Campaign management routes
router.get('/campaigns', protect, isAdmin, getAdminCampaigns);
router.delete('/campaigns/:campaignId', protect, isAdmin, deleteCampaign);
router.put('/campaigns/:campaignId/approve', protect, isAdmin, approveCampaign);
router.put('/campaigns/:campaignId/reject', protect, isAdmin, rejectCampaign);
router.post('/campaigns/bulk-approve',protect, isAdmin,  bulkApproveCampaign);
router.post('/campaigns/bulk-reject', protect, isAdmin, bulkRejectCampaign);
router.post('/campaigns/bulk-delete', protect, isAdmin, bulkDeleteCampaign);

// Analytics routes
router.get('/analytics', getAnalytics);

export default router;