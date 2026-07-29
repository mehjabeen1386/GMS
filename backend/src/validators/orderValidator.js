// Purpose: Garment Production Job Orders Input & Parameter Validation Rules
// Path: backend/src/validators/orderValidator.js

const { body, param } = require('express-validator');

/**
 * Validator for creating a new production job order
 */
const createOrderValidator = [
  body('orderNumber')
    .trim()
    .notEmpty()
    .withMessage('Order number is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Order number must be between 3 and 50 characters'),

  body('workshopId')
    .optional()
    .isMongoId()
    .withMessage('Invalid workshop ID format'),

  body('totalQuantity')
    .notEmpty()
    .withMessage('Total quantity is required')
    .isInt({ min: 1 })
    .withMessage('Total quantity must be an integer greater than 0'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date string')
];

/**
 * Validator for updating order lifecycle status
 */
const updateOrderStatusValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),

  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['PENDING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PENDING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED')
];

/**
 * Validator for URL parameters containing Order ID
 */
const getOrderByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format')
];

module.exports = {
  createOrderValidator,
  updateOrderStatusValidator,
  getOrderByIdValidator
};