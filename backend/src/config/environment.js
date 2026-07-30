/**
 * Purpose: Environment Configuration
 * Path: backend/src/config/environment.js
 */

require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV || "development",

  port: process.env.PORT || 5000,

  cors: {
    origin: process.env.CLIENT_URL || "*",
  },

  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET || "access-secret",
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || "refresh-secret",
    accessExpiry:
      process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiry:
      process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  database: {
    uri: process.env.MONGODB_URI,
  },
};