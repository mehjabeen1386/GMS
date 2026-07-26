// Purpose: Authentication & Session Business Logic Service Layer
// Path: backend/src/services/AuthService.js

const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for authentication, token generation, and credential verification.
 */
class AuthService {
  /**
   * Generates a signed JWT Access Token
   * @param {Object} user - User document
   */
  generateAccessToken(user) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
  }

  /**
   * Generates a signed JWT Refresh Token
   * @param {Object} user - User document
   */
  generateRefreshToken(user) {
    const payload = {
      sub: user._id.toString(),
      tokenVersion: user.tokenVersion || 0
    };

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    });
  }

  /**
   * Registers a new system user
   * @param {Object} userData - Registration payload
   * @param {string} [ipAddress] - Client IP address for audit logging
   */
  async register(userData, ipAddress = '') {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const user = await UserRepository.create(userData);

    // Remove password hash from returned object
    const userObj = user.toObject();
    delete userObj.password;

    await AuditLogRepository.logEvent({
      actorId: user._id,
      action: 'USER_REGISTERED',
      targetModel: 'User',
      targetId: user._id,
      ipAddress,
      details: { email: user.email, role: user.role }
    });

    logger.info(`New user registered successfully: ${user.email} [${user.role}]`);

    return userObj;
  }

  /**
   * Authenticates user credentials and returns tokens
   * @param {string} email - User email
   * @param {string} password - Plaintext password
   * @param {string} [ipAddress] - Client IP address for audit logging
   */
  async login(email, password, ipAddress = '') {
    const user = await UserRepository.findByEmailWithPassword(email);
    if (!user || user.isDeleted) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated. Please contact your administrator.');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await AuditLogRepository.logEvent({
        actorId: user._id,
        action: 'LOGIN_FAILED',
        targetModel: 'User',
        targetId: user._id,
        ipAddress,
        details: { reason: 'Incorrect password' }
      });
      throw new ApiError(401, 'Invalid email or password');
    }

    // Update last login timestamp
    await UserRepository.updateLastLogin(user._id);

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await AuditLogRepository.logEvent({
      actorId: user._id,
      action: 'LOGIN_SUCCESS',
      targetModel: 'User',
      targetId: user._id,
      ipAddress,
      details: { email: user.email }
    });

    logger.info(`User authenticated successfully: ${user.email}`);

    const userObj = user.toObject();
    delete userObj.password;

    return {
      user: userObj,
      accessToken,
      refreshToken
    };
  }

  /**
   * Refreshes an expired access token using a valid refresh token
   * @param {string} incomingRefreshToken - Refresh token string
   */
  async refreshToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw new ApiError(401, 'Refresh token is required');
    }

    try {
      const decoded = jwt.verify(
        incomingRefreshToken,
        process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret'
      );

      const user = await UserRepository.findById(decoded.sub);
      if (!user || user.isDeleted || !user.isActive) {
        throw new ApiError(401, 'Invalid refresh token session');
      }

      if (user.tokenVersion !== decoded.tokenVersion) {
        throw new ApiError(401, 'Refresh token has been revoked');
      }

      const accessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }

  /**
   * Invalidates existing user sessions by incrementing token version
   * @param {string} userId - User ObjectId
   */
  async logout(userId) {
    await UserRepository.incrementTokenVersion(userId);
    logger.info(`User sessions invalidated (logout): ${userId}`);
    return { success: true, message: 'Logged out successfully' };
  }
}

module.exports = new AuthService();