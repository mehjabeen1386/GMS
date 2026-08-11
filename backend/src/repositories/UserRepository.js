// Purpose: User Data Access Repository Layer
// Path: backend/src/repositories/UserRepository.js

const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

/**
 * Repository layer for User entity database operations.
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Overridden create method to map frontend form inputs to Mongoose Schema constraints
   */
  async create(data) {
    const payload = { ...data };

    // 1. Normalize Email
    if (payload.email) {
      payload.email = payload.email.toLowerCase().trim();
    }

    // 2. Ensure fullName matches Mongoose schema required field
    payload.fullName = payload.fullName || payload.name || payload.username || 'Contractor Admin';

    // 3. Ensure phone matches Mongoose schema required field
    payload.phone = payload.phone || payload.mobileNumber || payload.mobile || payload.phoneNumber || '0000000000';

    // 4. Auto-generate unique username if not provided
    if (!payload.username) {
      const emailPrefix = payload.email ? payload.email.split('@')[0] : 'user';
      payload.username = `${emailPrefix}_${Date.now()}`;
    }

    // 5. Set default Role for Contractor Workspace provision
    if (!payload.role || payload.role === 'USER') {
      payload.role = 'CONTRACTOR';
    }

    // 6. Explicitly set soft-delete status flags
    payload.isDeleted = false;
    payload.isActive = true;

    return await super.create(payload);
  }

  /**
   * Finds a user by username including the password field for credential verification
   * @param {string} username - Username query
   */
  async findByUsernameWithPassword(username) {
    const cleanUsername = username ? username.toLowerCase().trim() : '';
    return await this.model
      .findOne({ username: cleanUsername, isDeleted: { $ne: true } })
      .select('+password')
      .exec();
  }

  /**
   * Finds a user by email including the password field for authentication
   * @param {string} email - Raw or normalized email address
   */
  async findByEmailWithPassword(email) {
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    return await this.model
      .findOne({ email: cleanEmail, isDeleted: { $ne: true } })
      .select('+password')
      .exec();
  }

  /**
   * Finds a user by email address
   * @param {string} email - Raw or normalized email address
   */
  async findByEmail(email) {
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    return await this.model
      .findOne({ email: cleanEmail, isDeleted: { $ne: true } })
      .exec();
  }

  /**
   * Updates last login timestamp for a user
   * @param {string} userId - User ObjectId
   */
  async updateLastLogin(userId) {
    return await this.model
      .findByIdAndUpdate(userId, { $set: { lastLoginAt: new Date() } }, { new: true })
      .exec();
  }

  /**
   * Increments the token version to invalidate all active refresh tokens for user
   * @param {string} userId - User ObjectId
   */
  async incrementTokenVersion(userId) {
    return await this.model
      .findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } }, { new: true })
      .exec();
  }

  /**
   * Appends a new refresh token object to the user's refreshTokens array
   * @param {string} userId - User ObjectId
   * @param {Object} tokenObj - Token metadata object
   */
  async addRefreshToken(userId, tokenObj) {
    return await this.model
      .findByIdAndUpdate(
        userId,
        { $push: { refreshTokens: tokenObj } },
        { new: true }
      )
      .exec();
  }

  /**
   * Removes a specific refresh token from the user's refreshTokens array
   * @param {string} userId - User ObjectId
   * @param {string} token - Refresh token string to pull
   */
  async removeRefreshToken(userId, token) {
    return await this.model
      .findByIdAndUpdate(
        userId,
        { $pull: { refreshTokens: { token } } },
        { new: true }
      )
      .exec();
  }

  /**
   * Clears all refresh tokens for a user (forces full logout across devices)
   * @param {string} userId - User ObjectId
   */
  async clearAllRefreshTokens(userId) {
    return await this.model
      .findByIdAndUpdate(
        userId,
        { $set: { refreshTokens: [] } },
        { new: true }
      )
      .exec();
  }
}

module.exports = new UserRepository();