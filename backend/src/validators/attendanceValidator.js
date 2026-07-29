// Purpose: Worker Attendance Input & Parameter Validation Rules Layer
// Path: backend/src/validators/attendanceValidator.js

const { body, param } = require('express-validator');

/**
 * Validator for recording a worker check-in
 */
const checkInValidator = [
  body('workerId')
    .notEmpty()
    .withMessage('Worker ID is required')
    .isMongoId()
    .withMessage('Invalid worker ID format'),

  body('workshopId')
    .optional()
    .isMongoId()
    .withMessage('Invalid workshop ID format'),

  body('checkInTime')
    .optional()
    .isISO8601()
    .withMessage('Check-in time must be a valid ISO 8601 date string')
];

/**
 * Validator for recording a worker check-out
 */
const checkOutValidator = [
  body('attendanceId')
    .notEmpty()
    .withMessage('Attendance ID is required')
    .isMongoId()
    .withMessage('Invalid attendance ID format'),

  body('checkOutTime')
    .optional()
    .isISO8601()
    .withMessage('Check-out time must be a valid ISO 8601 date string')
];

/**
 * Validator for URL parameters containing Attendance ID
 */
const getAttendanceByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid attendance ID format')
];

module.exports = {
  checkInValidator,
  checkOutValidator,
  getAttendanceByIdValidator
};