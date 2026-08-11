// Purpose: Authentication Routes
// Path: backend/src/routes/authRoutes.js

const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/AuthController');
const authenticate = require('../middlewares/authenticate');

// Import validators
const authValidators = require('../validators/authValidator');
const registerValidator = authValidators.registerValidator || [];
const loginValidator = authValidators.loginValidator || [];
const refreshTokenValidator = authValidators.refreshTokenValidator || [];

// Helper middleware to handle express-validator errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Register endpoint
router.post(
  '/register',
  ...registerValidator,
  handleValidation,
  (req, res, next) => authController.register(req, res, next)
);

// Login endpoint
router.post(
  '/login',
  ...loginValidator,
  handleValidation,
  (req, res, next) => authController.login(req, res, next)
);

// Refresh Token endpoint
router.post(
  '/refresh-token',
  ...refreshTokenValidator,
  handleValidation,
  (req, res, next) => authController.refreshToken(req, res, next)
);

// Logout endpoint
router.post(
  '/logout',
  authenticate,
  (req, res, next) => authController.logout(req, res, next)
);

// Profile endpoint
router.get(
  '/me',
  authenticate,
  (req, res) => {
    res.status(200).json({
      status: 'success',
      data: { user: req.user }
    });
  }
);

module.exports = router;