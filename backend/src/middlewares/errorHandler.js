// Purpose: Centralized Global Express Error Handling Middleware
// Path: backend/src/middleware/errorHandler.js

const ApiError = require('../utils/ApiError');
const logger = require('../../config/logger');

/**
 * Express Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log all incoming errors via Winston Logger
  logger.error(`${error.message || 'Unhandled Exception'}`, {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    stack: error.stack,
  });

  // 1. Handle Mongoose Bad ObjectId (CastError)
  if (error.name === 'CastError') {
    const message = `Resource not found with invalid id format: ${error.value}`;
    error = ApiError.badRequest(message, [], 'INVALID_ID_FORMAT');
  }

  // 2. Handle Mongoose Duplicate Key Error (E11000)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    const message = `Duplicate value '${value}' entered for unique field '${field}'`;
    error = ApiError.conflict(message, 'DUPLICATE_RESOURCE');
  }

  // 3. Handle Mongoose Schema Validation Errors
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    error = ApiError.unprocessableEntity(validationErrors, 'Database Schema Validation Failed');
  }

  // 4. Handle JWT Token Verification Errors
  if (error.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid authentication token', 'INVALID_TOKEN');
  }

  // 5. Handle JWT Token Expiration
  if (error.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Authentication token has expired', 'TOKEN_EXPIRED');
  }

  // Default to 500 Internal Server Error if exception is not an operational ApiError
  const statusCode = error.statusCode || 500;
  const errorCode = error.errorCode || 'INTERNAL_SERVER_ERROR';
  const message = error.isOperational ? error.message : 'An unexpected internal server error occurred';
  const errors = error.errors || [];

  // Construct standardized error response payload
  const responsePayload = {
    success: false,
    statusCode,
    errorCode,
    message,
    errors,
    meta: {
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    },
  };

  // Include stack trace only in development environment
  if (process.env.NODE_ENV === 'development') {
    responsePayload.stack = error.stack;
  }

  return res.status(statusCode).json(responsePayload);
};

module.exports = errorHandler;