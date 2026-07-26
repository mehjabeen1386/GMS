// Purpose: User Administration & Profile Business Logic Service Layer
// Path: backend/src/services/UserService.js

const UserRepository = require('../repositories/UserRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for user profile management and administrative controls.
 */
class UserService {
  /**
   * Retrieves a user profile by ID with sensitive fields stripped
   * @param {string} userId - User ObjectId
   */
  async getUserProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user || user.isDeleted) {
      throw new ApiError(404, 'User not found');
    }

    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  /**
   * Updates user profile attributes (full name, phone, preferred language)
   * @param {string} userId - User ObjectId
   * @param {Object} updateData - Fields to update
   * @param {string} [actorId] - User ID performing the action (for audit logs)
   * @param {string} [ipAddress] - Client IP address
   */
  async updateProfile(userId, updateData, actorId = null, ipAddress = '') {
    const user = await UserRepository.findById(userId);
    if (!user || user.isDeleted) {
      throw new ApiError(404, 'User not found');
    }

    // Prevent unauthorized role escalation via regular profile update
    delete updateData.role;
    delete updateData.password;
    delete updateData.tokenVersion;

    const updatedUser = await UserRepository.updateById(userId, updateData);

    await AuditLogRepository.logEvent({
      actorId: actorId || userId,
      action: 'USER_PROFILE_UPDATED',
      targetModel: 'User',
      targetId: userId,
      ipAddress,
      details: { updatedFields: Object.keys(updateData) }
    });

    logger.info(`User profile updated: ${user.email}`);

    const userObj = updatedUser.toObject();
    delete userObj.password;
    return userObj;
  }

  /**
   * Toggles user account active status (activation/deactivation)
   * @param {string} userId - Target User ObjectId
   * @param {boolean} isActive - New active status boolean
   * @param {string} adminId - Administrator User ObjectId performing the toggle
   * @param {string} [ipAddress] - Client IP address
   */
  async setUserActiveStatus(userId, isActive, adminId, ipAddress = '') {
    const user = await UserRepository.findById(userId);
    if (!user || user.isDeleted) {
      throw new ApiError(404, 'User not found');
    }

    const updatedUser = await UserRepository.updateById(userId, { isActive });

    await AuditLogRepository.logEvent({
      actorId: adminId,
      action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      targetModel: 'User',
      targetId: userId,
      ipAddress,
      details: { email: user.email, isActive }
    });

    logger.info(`User account status changed: ${user.email} -> isActive: ${isActive} by Admin: ${adminId}`);

    const userObj = updatedUser.toObject();
    delete userObj.password;
    return userObj;
  }

  /**
   * Retrieves paginated users filtered by role or contractor association
   * @param {Object} [filter={}] - Query filters
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Results per page
   */
  async getUsers(filter = {}, page = 1, limit = 20) {
    const query = { isDeleted: { $ne: true }, ...filter };
    const skip = (page - 1) * limit;

    const users = await UserRepository.model
      .find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await UserRepository.model.countDocuments(query);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new UserService();