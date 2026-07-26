// Purpose: Security Audit Trail & System Activity Data Access Repository Layer
// Path: backend/src/repositories/AuditLogRepository.js

const BaseRepository = require('./BaseRepository');
const AuditLog = require('../models/AuditLog');

/**
 * Repository layer for AuditLog entity database operations.
 */
class AuditLogRepository extends BaseRepository {
  constructor() {
    super(AuditLog);
  }

  /**
   * Logs a security or administrative action event
   * @param {Object} logData - Audit event payload (actorId, action, targetModel, targetId, ipAddress, userAgent, details)
   * @param {Object} [options] - Transaction session options
   */
  async logEvent(logData, options = {}) {
    return await this.create(logData, options);
  }

  /**
   * Retrieves audit logs performed by a specific actor (User)
   * @param {string} actorId - User ObjectId who performed the action
   * @param {number} [limit=100] - Result limit cap
   */
  async findByActor(actorId, limit = 100) {
    return await this.model
      .find({ actorId, isDeleted: { $ne: true } })
      .populate('actorId', 'fullName email role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Searches audit logs matching target entity references
   * @param {string} targetModel - Mongoose model name (e.g., 'User', 'Order', 'Salary')
   * @param {string} targetId - Target entity ObjectId
   */
  async findByTarget(targetModel, targetId) {
    return await this.model
      .find({ targetModel, targetId, isDeleted: { $ne: true } })
      .populate('actorId', 'fullName email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Retrieves recent system audit logs with optional action type filtering
   * @param {string} [actionType] - Optional action category filter
   * @param {number} [limit=50] - Result limit cap
   */
  async getRecentLogs(actionType = null, limit = 50) {
    const filter = { isDeleted: { $ne: true } };
    if (actionType) {
      filter.action = actionType;
    }

    return await this.model
      .find(filter)
      .populate('actorId', 'fullName email role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}

module.exports = new AuditLogRepository();