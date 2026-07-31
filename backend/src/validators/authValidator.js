/**
 * Purpose: Authentication Validation Rules
 * Path: backend/src/validators/authValidator.js
 */

const { body } = require("express-validator");

const registerValidator = [
  body("fullName")
    .optional()
    .trim(),

  body("name")
    .optional()
    .trim(),

  body("username")
    .optional()
    .trim(),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
];

const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
];

const refreshTokenValidator = [
  body("refreshToken")
    .optional()
    .isString()
];

module.exports = {
  registerValidator,
  loginValidator,
  refreshTokenValidator
};