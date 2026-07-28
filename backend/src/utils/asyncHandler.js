/**
 * Async Handler Utility
 * Purpose: Wraps asynchronous functions and forwards errors to Express error middleware.
 * Path: backend/utils/asyncHandler.js
 */

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
      .catch((error) => next(error));
  };
};

module.exports = asyncHandler;