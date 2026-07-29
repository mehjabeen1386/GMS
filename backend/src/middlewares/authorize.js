/**
 * Purpose: Role Based Authorization Middleware
 * Path: backend/src/middlewares/authorize.js
 *
 * Description:
 * Allows access only to users having required roles.
 * Used after authentication middleware.
 */

const ApiError = require("../utils/ApiError");

/**
 * Authorize user roles
 *
 * Usage:
 * router.get(
 *   "/workers",
 *   authenticate,
 *   authorize("ADMIN", "MANAGER"),
 *   workerController.getWorkers
 * );
 *
 * @param  {...String} roles Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      // Check authentication
      if (!req.user) {
        throw new ApiError(
          401,
          "Authentication required"
        );
      }

      // Check role permission
      if (!roles.includes(req.user.role)) {
        throw new ApiError(
          403,
          "You do not have permission to perform this action"
        );
      }

      next();

    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorize;