// Purpose: Garment Quality Control & Defect Inspection Validation Rules Layer
// Path: backend/src/validators/qualityCheckValidator.js

const { body, param } = require('express-validator');

/**
 * Validator for logging a quality control inspection event
 */
const createQualityCheckValidator = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID format'),

  body('assignmentId')
    .optional()
    .isMongoId()
    .withMessage('Invalid assignment ID format'),

  body('inspectedQuantity')
    .notEmpty()
    .withMessage('Inspected quantity is required')
    .isInt({ min: 1 })
    .withMessage('Inspected quantity must be an integer greater than 0'),

  body('passedQuantity')
    .notEmpty()
    .withMessage('Passed quantity is required')
    .isInt({ min: 0 })
    .withMessage('Passed quantity must be a non-negative integer'),

  body('failedQuantity')
    .notEmpty()
    .withMessage('Failed quantity is required')
    .isInt({ min: 0 })
    .withMessage('Failed quantity must be a non-negative integer'),

  body('defects')
    .optional()
    .isArray()
    .withMessage('Defects must be an array of objects'),

  body('remarks')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Remarks cannot exceed 500 characters')
];

/**
 * Validator for URL parameters containing Quality Check ID
 */
const getQualityCheckByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid quality check ID format')
];

module.exports = {
  createQualityCheckValidator,
  getQualityCheckByIdValidator
};