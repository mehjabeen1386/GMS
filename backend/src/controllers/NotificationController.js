// Purpose: User System Alerts & Real-time Notifications Controller Layer
// Path: backend/src/controllers/NotificationController.js

const BaseController = require('./BaseController');
const NotificationService = require('../services/NotificationService');

/**
 * Controller handling user alerts, notification retrieval, and read state management
 */
class NotificationController extends BaseController {
  /**
   * Retrieves paginated notifications for the authenticated user
   */
  getUserNotifications = this.catchAsync(async (req, res) => {
    const userId = req.user._id;
    const { page, limit } = this.getPaginationParams(req);
    const notifications = await NotificationService.getUserNotifications(userId, page, limit);
    return this.sendSuccess(res, 200, 'User notifications retrieved successfully', notifications);
  });

  /**
   * Retrieves the total count of unread notifications for the user
   */
  getUnreadCount = this.catchAsync(async (req, res) => {
    const userId = req.user._id;
    const count = await NotificationService.getUnreadCount(userId);
    return this.sendSuccess(res, 200, 'Unread notification count retrieved successfully', { unreadCount: count });
  });

  /**
   * Marks all unread notifications as read for the authenticated user
   */
  markAllAsRead = this.catchAsync(async (req, res) => {
    const userId = req.user._id;
    await NotificationService.markAllAsRead(userId);
    return this.sendSuccess(res, 200, 'All notifications marked as read');
  });

  /**
   * Marks a specific notification as read by ID
   */
  markAsRead = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const notification = await NotificationService.markAsRead(id, userId);
    return this.sendSuccess(res, 200, 'Notification marked as read', notification);
  });
}

module.exports = new NotificationController();