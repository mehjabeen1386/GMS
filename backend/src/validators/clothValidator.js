// Purpose: Cloth / Raw Material Input & Parameter Validation Rules
// Path: backend/src/validators/clothValidator.js

const { body, param } = require('express-validator');

/**
 * Validator for creating a new cloth item
 */
const createClothValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Cloth name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Cloth name must be between 2 and 100 characters'),

  body('code')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Cloth code cannot exceed 50 characters'),

  body('unit')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Unit cannot exceed 20 characters')
];

/**
 * Validator for updating cloth details
 */
const updateClothValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cloth name must be between 2 and 100 characters'),

  body('code')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Cloth code cannot exceed 50 characters')
];

/**
 * Validator for URL parameters containing Cloth ID
 */
const getClothByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid cloth ID format')
];

module.exports = {
  createClothValidator,
  updateClothValidator,
  getClothByIdValidator
};