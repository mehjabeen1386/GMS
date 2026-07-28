// Purpose: Abstract Base Controller with standardized response and error handling wrappers
// Path: backend/src/controllers/BaseController.js

const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Abstract Base Controller providing standard response formatting helpers.
 */
class BaseController {
  /**
   * Sends a success response with standardized structure
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {Object|Array} [data=null] - Payload data
   */
  sendSuccess(res, statusCode, message, data = null) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
  }

  /**
   * Wraps an asynchronous controller action with asyncHandler and common execution context
   * @param {Function} fn - Async controller function (req, res, next)
   */
  catchAsync(fn) {
    return asyncHandler(fn);
  }

  /**
   * Extracts pagination query parameters from Express request
   * @param {Object} req - Express request object
   */
  getPaginationParams(req) {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }
}

module.exports = BaseController;