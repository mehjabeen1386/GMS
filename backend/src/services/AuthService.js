/**
 * Purpose: Authentication & Session Business Logic Service Layer
 * Path: backend/src/services/AuthService.js
 */

const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Helper to retrieve required environment variables safely.
   */
  #getSecret(key) {
    const secret = process.env[key];
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error(`CRITICAL: Environment variable ${key} is missing.`);
    }
    return secret || `fallback_${key.toLowerCase()}`;
  }

  /**
   * Generates a signed JWT Access Token
   * @param {Object} user - User document or object
   */
  generateAccessToken = (user) => {
    const userId = user._id ? user._id.toString() : user.id;
    const payload = {
      sub: userId,
      id: userId,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, this.#getSecret('JWT_SECRET'), {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m'
    });
  };

  /**
   * Generates a signed JWT Refresh Token
   * @param {Object} user - User document or object
   */
  generateRefreshToken = (user) => {
    const userId = user._id ? user._id.toString() : user.id;
    const payload = {
      sub: userId,
      id: userId,
      tokenVersion: user.tokenVersion ?? 0
    };

    return jwt.sign(payload, this.#getSecret('JWT_REFRESH_SECRET'), {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    });
  };

  /**
   * Verifies and decodes a given JWT Access Token
   * @param {string} token - Raw JWT token
   * @returns {Object} Decoded payload
   */
  async verifyToken(token) {
    if (!token) {
      throw new ApiError(401, 'Token is required');
    }

    try {
      const decoded = jwt.verify(token, this.#getSecret('JWT_SECRET'));
      return decoded;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, 'Invalid or expired token');
    }
  }

  /**
   * Registers a new system user
   * @param {Object} userData - Registration payload
   * @param {string} [ipAddress] - Client IP address for audit logging
   */
  async register(userData, ipAddress = '') {
    const normalizedEmail = userData.email?.toLowerCase().trim();
    const existingUser = await UserRepository.findByEmail(normalizedEmail);
    
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const user = await UserRepository.create({
      ...userData,
      email: normalizedEmail
    });

    const userObj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
    delete userObj.password;

    // Log registration audit safely
    await AuditLogRepository.logEvent({
      actorId: user._id,
      userId: user._id,
      action: 'REGISTER',
      module: 'AUTH',
      role: user.role || 'USER',
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
    const normalizedEmail = email?.toLowerCase().trim();
    const user = await UserRepository.findByEmailWithPassword(normalizedEmail);

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
        userId: user._id,
        action: 'LOGIN_FAILED',
        module: 'AUTH',
        role: user.role || 'USER',
        ipAddress,
        details: { reason: 'Incorrect password' }
      });
      throw new ApiError(401, 'Invalid email or password');
    }

    await UserRepository.updateLastLogin(user._id);

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await AuditLogRepository.logEvent({
      actorId: user._id,
      userId: user._id,
      action: 'LOGIN_SUCCESS',
      module: 'AUTH',
      role: user.role || 'USER',
      ipAddress,
      details: { email: user.email }
    });

    logger.info(`User authenticated successfully: ${user.email}`);

    const userObj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
    delete userObj.password;

    return {
      user: userObj,
      token: accessToken,
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
        this.#getSecret('JWT_REFRESH_SECRET')
      );

      const userId = decoded.sub || decoded.id;
      const user = await UserRepository.findById(userId);
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