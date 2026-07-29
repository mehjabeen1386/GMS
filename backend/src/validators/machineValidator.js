// Purpose: Workshop Machinery Asset & Maintenance Input Validation Rules Layer
// Path: backend/src/validators/machineValidator.js

const { body, param } = require('express-validator');

/**
 * Validator for registering a new machinery asset
 */
const createMachineValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Machine name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Machine name must be between 2 and 100 characters'),

  body('serialNumber')
    .trim()
    .notEmpty()
    .withMessage('Serial number is required')
    .isLength({ max: 50 })
    .withMessage('Serial number cannot exceed 50 characters'),

  body('workshopId')
    .notEmpty()
    .withMessage('Workshop ID is required')
    .isMongoId()
    .withMessage('Invalid workshop ID format'),

  body('type')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Machine type cannot exceed 50 characters'),

  body('status')
    .optional()
    .trim()
    .isIn(['OPERATIONAL', 'MAINTENANCE', 'IDLE', 'OUT_OF_SERVICE'])
    .withMessage('Status must be one of: OPERATIONAL, MAINTENANCE, IDLE, OUT_OF_SERVICE')
];

/**
 * Validator for updating machine equipment details
 */
const updateMachineValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid machine ID format'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Machine name must be between 2 and 100 characters'),

  body('workshopId')
    .optional()
    .isMongoId()
    .withMessage('Invalid workshop ID format'),

  body('status')
    .optional()
    .trim()
    .isIn(['OPERATIONAL', 'MAINTENANCE', 'IDLE', 'OUT_OF_SERVICE'])
    .withMessage('Status must be one of: OPERATIONAL, MAINTENANCE, IDLE, OUT_OF_SERVICE'),

  body('lastMaintenanceDate')
    .optional()
    .isISO8601()
    .withMessage('Last maintenance date must be a valid ISO 8601 date string')
];

/**
 * Validator for URL parameters containing Machine ID
 */
const getMachineByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid machine ID format')
];

module.exports = {
  createMachineValidator,
  updateMachineValidator,
  getMachineByIdValidator
};