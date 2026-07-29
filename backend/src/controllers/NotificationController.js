// Purpose: In-App System & Real-Time Alerts Controller Layer
// Path: backend/src/controllers/NotificationController.js

const BaseController = require('./BaseController');
const NotificationService = require('../services/NotificationService');

/**
 * Controller handling user notification feeds, unread counters, and mark-as-read state updates.
 */
class NotificationController extends BaseController {
  /**
   * Retrieves paginated list of notifications for the authenticated user
   */
  getUserNotifications = this.catchAsync(async (req, res) => {
    const userId = req.user._id;
    const { page, limit } = this.getPaginationParams(req);
    const notifications = await NotificationService.getUserNotifications(userId, page, limit);
    return this.sendSuccess(res, 200, 'User notifications retrieved successfully', notifications);
  });

  /**
   * Retrieves total unread notification count for the authenticated user
   */
  getUnreadCount = this.catchAsync(async (req, res) => {
    const userId = req.user._id;
    const count = await NotificationService.getUnreadCount(userId);
    return this.sendSuccess(res, 200, 'Unread notification count retrieved successfully', { unreadCount: count });
  });

  /**
   * Marks a specific notification as read
   */
  markAsRead = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const updatedNotification = await NotificationService.markAsRead(id, userId);
    return this.sendSuccess(res, 200, 'Notification marked as read', updatedNotification);
  });

  /**
   * Marks all notifications as read for the authenticated user
   */
  markAllAsRead = this.catchAsync(async (req, res) => {
    const userId = req.user._id;
    const result = await NotificationService.markAllAsRead(userId);
    return this.sendSuccess(res, 200, 'All notifications marked as read', result);
  });
}

module.exports = new NotificationController();