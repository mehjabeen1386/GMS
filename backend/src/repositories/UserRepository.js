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
   * Finds a user by username including the password field for credential verification
   * @param {string} username - Normalized username
   */
  async findByUsernameWithPassword(username) {
    return await this.model
      .findOne({ username, isDeleted: { $ne: true } })
      .select('+password')
      .exec();
  }

  /**
   * Finds a user by email address
   * @param {string} email - Normalized email address
   */
  async findByEmail(email) {
    return await this.findOne({ email });
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