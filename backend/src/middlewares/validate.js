// Purpose: Zod Schema Request Payload Validation Middleware
// Path: backend/src/middleware/validate.js

const ApiError = require('../utils/ApiError');

/**
 * Validates request data against a provided Zod schema.
 * 
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Assign sanitized & typed data back to request object
    req.body = parsed.body;
    req.query = parsed.query;
    req.params = parsed.params;

    return next();
  } catch (error) {
    if (error.name === 'ZodError') {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.').replace(/^(body|query|params)\./, ''),
        message: err.message,
      }));

      return next(ApiError.unprocessableEntity(formattedErrors, 'Validation Failed'));
    }

    return next(error);
  }
};

module.exports = validate;