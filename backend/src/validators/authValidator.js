/**
 * Purpose: Authentication Validation Rules
 * Path: backend/src/validators/authValidator.js
 */

const { body } = require("express-validator");

const registerValidator = [
  // Accept fullName, name, or username
  body(["fullName", "name", "username"])
    .optional()
    .trim(),

  // Custom check to guarantee at least one name field is provided
  body().custom((value, { req }) => {
    const name = req.body.fullName || req.body.name || req.body.username;
    if (!name || !name.trim()) {
      throw new Error("Full name is required.");
    }
    return true;
  }),

  // Accept companyName or enterpriseName
  body(["companyName", "enterpriseName", "company"])
    .optional()
    .trim(),

  // Accept mobile or phone numbers
  body(["phone", "mobile", "phoneNumber", "mobileNumber"])
    .optional()
    .trim(),

  // Email validation without destructive normalization
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email address is required.")
    .isEmail()
    .withMessage("Please provide a valid email address."),

  // Password length & strength rules
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email address is required.")
    .isEmail()
    .withMessage("Please provide a valid email address."),

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