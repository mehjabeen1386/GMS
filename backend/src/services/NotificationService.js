// Purpose: In-App Notification & Alert Business Logic Service Layer
// Path: backend/src/services/NotificationService.js

const NotificationRepository = require('../repositories/NotificationRepository');
const UserRepository = require('../repositories/UserRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for in-app alert generation and notification management.
 */
class NotificationService {
  /**
   * Creates and dispatches a new notification to a recipient user
   * @param {Object} notificationData - Notification payload (recipientId, title, message, type)
   * @param {string} [actorId] - Optional actor ID who triggered the notification
   * @param {string} [ipAddress] - Client IP address
   */
  async createNotification(notificationData, actorId = null, ipAddress = '') {
    // Verify recipient user exists
    const recipient = await UserRepository.findById(notificationData.recipientId);
    if (!recipient || recipient.isDeleted) {
      throw new ApiError(404, 'Recipient user not found');
    }

    const notification = await NotificationRepository.create(notificationData);

    if (actorId) {
      await AuditLogRepository.logEvent({
        actorId,
        action: 'NOTIFICATION_DISPATCHED',
        targetModel: 'Notification',
        targetId: notification._id,
        ipAddress,
        details: { recipientId: notification.recipientId, type: notification.type }
      });
    }

    logger.info(`Notification dispatched to User: ${notificationData.recipientId} [Type: ${notificationData.type}]`);

    return notification;
  }

  /**
   * Retrieves notifications for a specific user
   * @param {string} userId - Recipient User ObjectId
   * @param {boolean} [unreadOnly=false] - Filter unread notifications only
   */
  async getUserNotifications(userId, unreadOnly = false) {
    const user = await UserRepository.findById(userId);
    if (!user || user.isDeleted) {
      throw new ApiError(404, 'User not found');
    }

    if (unreadOnly) {
      return await NotificationRepository.findUnreadByUser(userId);
    }

    return await NotificationRepository.findByUser(userId);
  }

  /**
   * Marks a notification as read
   * @param {string} notificationId - Notification ObjectId
   * @param {string} userId - Requesting User ObjectId (for authorization)
   */
  async markAsRead(notificationId, userId) {
    const notification = await NotificationRepository.findById(notificationId);
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    if (notification.recipientId.toString() !== userId) {
      throw new ApiError(403, 'Unauthorized access to notification');
    }

    return await NotificationRepository.markAsRead(notificationId);
  }

  /**
   * Marks all notifications as read for a given user
   * @param {string} userId - Recipient User ObjectId
   */
  async markAllAsRead(userId) {
    const user = await UserRepository.findById(userId);
    if (!user || user.isDeleted) {
      throw new ApiError(404, 'User not found');
    }

    return await NotificationRepository.markAllAsRead(userId);
  }
}

module.exports = new NotificationService();