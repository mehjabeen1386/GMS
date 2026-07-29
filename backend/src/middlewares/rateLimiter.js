/**
 * Purpose: Rate Limiter Middleware
 * Path: backend/src/middlewares/rateLimiter.js
 */

const rateLimit = require("express-rate-limit");

const rateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: options.message || "Too many requests. Please try again later.",
  });
};

module.exports = { rateLimiter };