/**
 * Purpose: User Input Validation Rules
 * Path: backend/src/validators/userValidator.js
 *
 * Description:
 * Validates user related request payloads and route parameters.
 */

const { body, param } = require("express-validator");

/**
 * User Registration Validator
 */
const registerUserValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters"),

  body("role")
    .optional()
    .isIn(["SUPER_ADMIN", "ADMIN", "MANAGER", "CONTRACTOR", "WORKER"])
    .withMessage("Invalid user role")
];

/**
 * User Login Validator
 */
const loginUserValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

/**
 * Update Profile Validator (Matches updateProfileValidator in userRoutes.js)
 */
const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
];

/**
 * Update User Role Validator (Matches updateUserRoleValidator in userRoutes.js)
 */
const updateUserRoleValidator = [
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["SUPER_ADMIN", "ADMIN", "MANAGER", "CONTRACTOR", "WORKER"])
    .withMessage("Invalid user role")
];

/**
 * Get User By ID / URL Param Validator (Matches getUserByIdValidator in userRoutes.js)
 */
const getUserByIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid user ID format")
];

module.exports = {
  registerUserValidator,
  loginUserValidator,
  updateProfileValidator,
  updateUserRoleValidator,
  getUserByIdValidator
};