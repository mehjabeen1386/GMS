// Purpose: Authentication Routes
// Path: backend/src/routes/authRoutes.js

const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/AuthController');
const authenticate = require('../middlewares/authenticate');
const { rateLimiter } = require('../middlewares/rateLimiter');

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

// Safe rate limiter check
const safeLimiter = (options) => {
  if (typeof rateLimiter === 'function') {
    return rateLimiter(options);
  }
  return (req, res, next) => next();
};

router.post(
  '/register',
  safeLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  ...registerValidator, // Spread array elements safely
  handleValidation,
  (req, res, next) => authController.register(req, res, next)
);

router.post(
  '/login',
  safeLimiter({ windowMs: 15 * 60 * 1000, max: 15 }),
  ...loginValidator, // Spread array elements safely
  handleValidation,
  (req, res, next) => authController.login(req, res, next)
);

router.post(
  '/refresh-token',
  ...refreshTokenValidator, // Spread array elements safely
  handleValidation,
  (req, res, next) => authController.refreshToken(req, res, next)
);

router.post(
  '/logout',
  authenticate,
  (req, res, next) => authController.logout(req, res, next)
);

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