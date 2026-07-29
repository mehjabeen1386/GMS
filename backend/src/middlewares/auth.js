// Purpose: Authentication Guard & Role-Based Access Control Middleware
// Path: backend/src/middleware/auth.js

const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

/**
 * Express Middleware: Protects routes by verifying Bearer JWT tokens in Authorization header.
 * Decodes user identity, checks active status in database, and attaches user payload to req.user.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Extract Bearer token from HTTP Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication required. Missing bearer token.', 'TOKEN_MISSING');
  }

  try {
    // Verify token validity using JWT Access Secret
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Fetch user from database to verify active status and role freshness
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists.', 'USER_NOT_FOUND');
    }

    if (!user.isActive || user.isDeleted) {
      throw ApiError.forbidden('Your user account has been deactivated or removed.', 'ACCOUNT_DISABLED');
    }

    // Attach authenticated user details to request object
    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Session expired. Please refresh your token.', 'TOKEN_EXPIRED');
    }
    throw ApiError.unauthorized('Invalid authentication token signature.', 'INVALID_TOKEN');
  }
});

/**
 * Express Middleware Factory: Authorizes requests based on permitted user roles.
 * 
 * @param {...string} permittedRoles - Roles authorized to access the route ('SUPER_ADMIN', 'CONTRACTOR', 'WORKSHOP_MANAGER', 'WORKER')
 */
const authorize = (...permittedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User identity missing from context.', 'UNAUTHENTICATED'));
    }

    if (!permittedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `User role '${req.user.role}' is not authorized to access this resource.`,
          'ACCESS_DENIED'
        )
      );
    }

    return next();
  };
};

module.exports = {
  authenticate,
  authorize,
};