// Purpose: Authentication & Session Controller Layer
// Path: backend/src/controllers/AuthController.js

const BaseController = require('./BaseController');
const AuthService = require('../services/AuthService');

class AuthController extends BaseController {
  register = this.catchAsync(async (req, res) => {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';

    const result = await AuthService.register(req.body, ipAddress);

    return this.sendSuccess(
      res,
      201,
      'User registered successfully',
      result
    );
  });

  login = this.catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';

    const result = await AuthService.login(
      email,
      password,
      ipAddress
    );

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return this.sendSuccess(res, 200, 'Login successful', {
      user: result.user,
      accessToken: result.accessToken
    });
  });

  refreshToken = this.catchAsync(async (req, res) => {
    const token =
      req.cookies?.refreshToken ||
      req.body?.refreshToken;

    const result = await AuthService.refreshToken(token);

    return this.sendSuccess(res, 200, 'Token refreshed', {
      accessToken: result.accessToken
    });
  });

  logout = this.catchAsync(async (req, res) => {
    if (req.user?._id) {
      await AuthService.logout(req.user._id);
    }

    res.clearCookie('refreshToken');

    return this.sendSuccess(
      res,
      200,
      'Logged out successfully'
    );
  });
}

module.exports = new AuthController();