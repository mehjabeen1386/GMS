// Purpose: Financial Ledger & Double-Entry Accounting Validation Rules Layer
// Path: backend/src/validators/ledgerValidator.js

const { body, param } = require('express-validator');

/**
 * Validator for creating a manual financial debit/credit ledger entry
 */
const createLedgerEntryValidator = [
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Transaction type is required')
    .isIn(['DEBIT', 'CREDIT'])
    .withMessage('Transaction type must be either DEBIT or CREDIT'),

  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a number greater than 0'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Description cannot exceed 255 characters'),

  body('referenceId')
    .optional()
    .isMongoId()
    .withMessage('Invalid reference ID format')
];

/**
 * Validator for URL parameters containing Ledger Transaction ID
 */
const getLedgerByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ledger entry ID format')
];

module.exports = {
  createLedgerEntryValidator,
  getLedgerByIdValidator
};