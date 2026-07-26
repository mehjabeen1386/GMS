// Purpose: Express Rate-Limiting Protection Configurations
// Path: backend/src/middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');
const ApiError = require('../utils/ApiError');

/**
 * Standard Global API Rate Limiter
 * Applied across general REST endpoints.
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // Default 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res, next) => {
    next(
      ApiError.badRequest(
        'Too many requests from this IP. Please try again after 15 minutes.',
        [],
        'RATE_LIMIT_EXCEEDED'
      )
    );
  },
});

/**
 * Strict Auth Limiter
 * Applied to sensitive authentication endpoints (login, register, password reset).
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 10, // Max 10 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      ApiError.badRequest(
        'Too many authentication attempts. Account access temporarily throttled for security. Please try again in 15 minutes.',
        [],
        'AUTH_RATE_LIMIT_EXCEEDED'
      )
    );
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};