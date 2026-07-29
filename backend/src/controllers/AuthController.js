// Purpose: Authentication & Session Controller Layer
// Path: backend/src/controllers/AuthController.js

const BaseController = require('./BaseController');
const AuthService = require('../services/AuthService');

/**
 * Controller handling user registration, login, token refresh, and logout.
 */
class AuthController extends BaseController {
  /**
   * Registers a new user account
   */
  register = this.catchAsync(async (req, res) => {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const result = await AuthService.register(req.body, ipAddress);
    return this.sendSuccess(res, 201, 'User registered successfully', result);
  });

  /**
   * Authenticates user credentials and initiates session
   */
  login = this.catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const result = await AuthService.login(email, password, ipAddress);

    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return this.sendSuccess(res, 200, 'Login successful', {
      user: result.user,
      accessToken: result.accessToken
    });
  });

  /**
   * Refreshes access token using valid HTTP-only refresh token cookie
   */
  refreshToken = this.catchAsync(async (req, res) => {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const result = await AuthService.refreshToken(token, ipAddress);

    return this.sendSuccess(res, 200, 'Token refreshed successfully', {
      accessToken: result.accessToken
    });
  });

  /**
   * Terminates active session and clears refresh token cookie
   */
  logout = this.catchAsync(async (req, res) => {
    const userId = req.user?._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';

    if (userId) {
      await AuthService.logout(userId, ipAddress);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return this.sendSuccess(res, 200, 'Logged out successfully');
  });
}

module.exports = new AuthController();