// Purpose: Custom Operational API Error Class for Predictable Exception Handling
// Path: backend/src/utils/ApiError.js

/**
 * Enterprise Operational Exception Class
 * Standardizes operational error payloads passed to global error handling middleware.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 400, 401, 403, 404, 409, 500)
   * @param {string} message - Human-readable error message
   * @param {Array} errors - Optional array of field-level validation errors
   * @param {string} errorCode - Machine-readable system error code
   * @param {string} stack - Optional stack trace override
   */
  constructor(
    statusCode = 500,
    message = 'Internal Server Error',
    errors = [],
    errorCode = 'INTERNAL_SERVER_ERROR',
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errorCode = errorCode;
    this.errors = errors;
    this.isOperational = true; // Distinguishes operational errors from system crashes

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // --- Static Helper Factories ---

  static badRequest(message = 'Bad Request', errors = [], errorCode = 'BAD_REQUEST') {
    return new ApiError(400, message, errors, errorCode);
  }

  static unauthorized(message = 'Unauthorized Access', errorCode = 'UNAUTHORIZED') {
    return new ApiError(401, message, [], errorCode);
  }

  static forbidden(message = 'Access Forbidden', errorCode = 'FORBIDDEN') {
    return new ApiError(403, message, [], errorCode);
  }

  static notFound(message = 'Resource Not Found', errorCode = 'NOT_FOUND') {
    return new ApiError(404, message, [], errorCode);
  }

  static conflict(message = 'Resource Already Exists', errorCode = 'CONFLICT') {
    return new ApiError(409, message, [], errorCode);
  }

  static unprocessableEntity(errors = [], message = 'Validation Error') {
    return new ApiError(422, message, errors, 'VALIDATION_ERROR');
  }

  static internal(message = 'Internal Server Error', errorCode = 'INTERNAL_SERVER_ERROR') {
    return new ApiError(500, message, [], errorCode);
  }
}

module.exports = ApiError;