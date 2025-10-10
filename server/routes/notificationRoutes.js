import express from 'express';
import { listNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { downloadCertificate } from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - add timestamp to break cache
router.get('/', protect, (req, res, next) => {
  // Add cache-busting headers
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Expires', '-1');
  res.set('Pragma', 'no-cache');
  next();
}, listNotifications);

// Fix parameter name to match controller
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);

// Certificate download route
router.get('/certificate/:certificateId', protect, downloadCertificate);

export default router;