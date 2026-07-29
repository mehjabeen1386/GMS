// Purpose: Higher-Order Function Wrapper for Async Express Route Handlers
// Path: backend/src/middleware/asyncHandler.js

/**
 * Wraps an asynchronous Express route handler function to catch rejected promises
 * and pass any caught errors directly to the Express next() middleware.
 *
 * @param {Function} fn - Async Express controller middleware function (req, res, next)
 * @returns {Function} Express middleware function with automatic promise error catching
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;