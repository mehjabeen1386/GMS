/**
 * Purpose: Authentication Validation Rules
 * Path: backend/src/validators/authValidator.js
 */

const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number."),

  body("role")
    .optional()
    .isIn(["admin", "manager", "contractor", "worker"])
    .withMessage("Invalid role.")
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

/**
 * Validator for refresh token requests
 */
const refreshTokenValidator = [
  body("refreshToken")
    .optional()
    .isString()
    .withMessage("Refresh token must be a string.")
];

const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("New password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("New password must contain at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("New password must contain at least one number.")
];

module.exports = {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  changePasswordValidator,
};