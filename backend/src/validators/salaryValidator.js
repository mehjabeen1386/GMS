// Purpose: Piece-Rate Payroll & Worker Salary Calculation Validation Rules Layer
// Path: backend/src/validators/salaryValidator.js

const { body, param } = require('express-validator');

/**
 * Validator for calculating piece-rate salary/wages for a worker
 */
const calculateSalaryValidator = [
  body('workerId')
    .notEmpty()
    .withMessage('Worker ID is required')
    .isMongoId()
    .withMessage('Invalid worker ID format'),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date string'),

  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date string'),

  body('bonus')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Bonus must be a non-negative number'),

  body('deductions')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Deductions must be a non-negative number')
];

/**
 * Validator for marking a salary slip as PAID
 */
const paySalaryValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid salary slip ID format'),

  body('paymentMode')
    .optional()
    .trim()
    .isIn(['CASH', 'BANK_TRANSFER', 'UPI', 'CHEQUE'])
    .withMessage('Payment mode must be CASH, BANK_TRANSFER, UPI, or CHEQUE'),

  body('transactionReference')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Transaction reference cannot exceed 100 characters')
];

/**
 * Validator for URL parameters containing Salary ID
 */
const getSalaryByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid salary slip ID format')
];

module.exports = {
  calculateSalaryValidator,
  paySalaryValidator,
  getSalaryByIdValidator
};