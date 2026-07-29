// Purpose: Manufacturing Company Tenant Validation Layer
// Path: backend/src/validators/companyValidator.js

const { body, param } = require('express-validator');

/**
 * Validator for creating a new company profile
 */
const createCompanyValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid company email')
    .normalizeEmail()
];

/**
 * Validator for updating company details
 */
const updateCompanyValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid company ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid company email')
    .normalizeEmail()
];

/**
 * Validator for URL parameters containing Company ID
 */
const getCompanyByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid company ID format')
];

module.exports = {
  createCompanyValidator,
  updateCompanyValidator,
  getCompanyByIdValidator
};