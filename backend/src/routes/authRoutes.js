// Purpose: Authentication Routes
// Path: backend/src/routes/authRoutes.js

const express = require('express');

const router = express.Router();

const authController = require('../controllers/AuthController');
const authenticate = require('../middlewares/authenticate');

const { rateLimiter } = require('../middlewares/rateLimiter');

const {
  registerValidator,
  loginValidator,
  refreshTokenValidator
} = require('../validators/authValidator');

router.post(
  '/register',
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10
  }),
  registerValidator,
  authController.register
);

router.post(
  '/login',
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 15
  }),
  loginValidator,
  authController.login
);

router.post(
  '/refresh-token',
  refreshTokenValidator,
  authController.refreshToken
);

router.post(
  '/logout',
  authenticate,
  authController.logout
);

module.exports = router;