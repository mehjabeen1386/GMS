// Purpose: Workshop Input & Parameter Validation Rules Layer
// Path: backend/src/validators/workshopValidator.js

const { body, param } = require('express-validator');

/**
 * Validator for creating a new workshop profile
 */
const createWorkshopValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Workshop name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Workshop name must be between 2 and 100 characters'),

  body('code')
    .optional()
    .trim()
    .isUppercase()
    .withMessage('Workshop code must be uppercase')
    .isLength({ min: 2, max: 20 })
    .withMessage('Workshop code must be between 2 and 20 characters'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 250 })
    .withMessage('Address cannot exceed 250 characters'),

  body('capacity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Capacity must be a positive integer')
];

/**
 * Validator for updating workshop details
 */
const updateWorkshopValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Workshop name must be between 2 and 100 characters'),

  body('code')
    .optional()
    .trim()
    .isUppercase()
    .withMessage('Workshop code must be uppercase')
    .isLength({ min: 2, max: 20 })
    .withMessage('Workshop code must be between 2 and 20 characters'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 250 })
    .withMessage('Address cannot exceed 250 characters'),

  body('capacity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Capacity must be a positive integer'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

/**
 * Validator for URL parameters containing Workshop ID
 */
const getWorkshopByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid workshop ID format')
];

module.exports = {
  createWorkshopValidator,
  updateWorkshopValidator,
  getWorkshopByIdValidator
};