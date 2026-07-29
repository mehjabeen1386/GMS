// Purpose: Worker Management Input & Parameter Validation Rules Layer
// Path: backend/src/validators/workerValidator.js

const { body, param } = require('express-validator');

/**
 * Validator for registering/creating a new worker profile
 */
const createWorkerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Worker name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Worker name must be between 2 and 100 characters'),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array of strings'),

  body('workshopId')
    .optional()
    .isMongoId()
    .withMessage('Invalid workshop ID format'),

  body('dailyRate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Daily rate must be a positive number')
];

/**
 * Validator for updating worker details
 */
const updateWorkerValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Worker name must be between 2 and 100 characters'),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array of strings'),

  body('workshopId')
    .optional()
    .isMongoId()
    .withMessage('Invalid workshop ID format'),

  body('dailyRate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Daily rate must be a positive number'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

/**
 * Validator for URL parameters containing Worker ID
 */
const getWorkerByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid worker ID format')
];

module.exports = {
  createWorkerValidator,
  updateWorkerValidator,
  getWorkerByIdValidator
};