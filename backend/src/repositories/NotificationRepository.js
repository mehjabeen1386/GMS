// Purpose: In-App Notifications & Alerting Data Access Repository Layer
// Path: backend/src/repositories/NotificationRepository.js

const BaseRepository = require('./BaseRepository');
const Notification = require('../models/Notification');

/**
 * Repository layer for Notification entity database operations.
 */
class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);
  }

  /**
   * Retrieves notifications for a specific user, sorted by newest first
   * @param {string} userId - User ObjectId recipient
   * @param {boolean} [unreadOnly=false] - Filter unread notifications only
   */
  async findByUser(userId, unreadOnly = false) {
    const filter = { recipientId: userId, isDeleted: { $ne: true } };
    if (unreadOnly) {
      filter.isRead = false;
    }

    return await this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  /**
   * Counts unread notifications for a user
   * @param {string} userId - User ObjectId recipient
   */
  async countUnread(userId) {
    return await this.model.countDocuments({
      recipientId: userId,
      isRead: false,
      isDeleted: { $ne: true }
    });
  }

  /**
   * Marks a specific notification as read
   * @param {string} notificationId - Notification ObjectId
   * @param {string} userId - User ObjectId (ensures ownership)
   */
  async markAsRead(notificationId, userId) {
    return await this.model
      .findOneAndUpdate(
        { _id: notificationId, recipientId: userId, isDeleted: { $ne: true } },
        { $set: { isRead: true, readAt: new Date() } },
        { new: true, runValidators: true }
      )
      .exec();
  }

  /**
   * Marks all unread notifications as read for a user
   * @param {string} userId - User ObjectId recipient
   */
  async markAllAsRead(userId) {
    return await this.model.updateMany(
      { recipientId: userId, isRead: false, isDeleted: { $ne: true } },
      { $set: { isRead: true, readAt: new Date() } }
    ).exec();
  }
}

module.exports = new NotificationRepository();