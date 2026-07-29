// Purpose: Worker Task & Piece-Rate Assignment Validation Rules Layer
// Path: backend/src/validators/assignmentValidator.js

const { body, param } = require('express-validator');

/**
 * Validator for creating a new task assignment
 */
const createAssignmentValidator = [
  body('workerId')
    .notEmpty()
    .withMessage('Worker ID is required')
    .isMongoId()
    .withMessage('Invalid worker ID format'),

  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID format'),

  body('operationName')
    .trim()
    .notEmpty()
    .withMessage('Operation name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Operation name must be between 2 and 100 characters'),

  body('pieceRate')
    .notEmpty()
    .withMessage('Piece rate is required')
    .isFloat({ min: 0 })
    .withMessage('Piece rate must be a non-negative number'),

  body('targetQuantity')
    .notEmpty()
    .withMessage('Target quantity is required')
    .isInt({ min: 1 })
    .withMessage('Target quantity must be an integer greater than 0')
];

/**
 * Validator for updating task completion progress
 */
const updateProgressValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid assignment ID format'),

  body('completedQuantity')
    .notEmpty()
    .withMessage('Completed quantity is required')
    .isInt({ min: 0 })
    .withMessage('Completed quantity must be a non-negative integer'),

  body('status')
    .optional()
    .trim()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'])
    .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, ON_HOLD')
];

/**
 * Validator for URL parameters containing Assignment ID
 */
const getAssignmentByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid assignment ID format')
];

module.exports = {
  createAssignmentValidator,
  updateProgressValidator,
  getAssignmentByIdValidator
};