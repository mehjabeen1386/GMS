// Purpose: User System Alerts & Real-time Notifications Routes Layer
// Path: backend/src/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate'); // <-- IMPORT ADDED HERE
const { getNotificationByIdValidator } = require('../validators/notificationValidator');

// Protect all notification routes with JWT authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/notifications
 * @desc    Retrieves paginated notifications for the authenticated user
 * @access  Private
 */
router.get(
  '/',
  notificationController.getUserNotifications
);

/**
 * @route   GET /api/v1/notifications/unread-count
 * @desc    Retrieves the total count of unread notifications for the user
 * @access  Private
 */
router.get(
  '/unread-count',
  notificationController.getUnreadCount
);

/**
 * @route   PATCH /api/v1/notifications/read-all
 * @desc    Marks all unread notifications as read for the authenticated user
 * @access  Private
 */
router.patch(
  '/read-all',
  notificationController.markAllAsRead
);

/**
 * @route   PATCH /api/v1/notifications/:id/read
 * @desc    Marks a specific notification as read by ID
 * @access  Private
 */
router.patch(
  '/:id/read',
  getNotificationByIdValidator,
  validate,
  notificationController.markAsRead
);

module.exports = router;