// Purpose: Authentication & Session Controller Layer
// Path: backend/src/controllers/AuthController.js

const AuthService = require('../services/AuthService');

class AuthController {
  register = async (req, res, next) => {
    try {
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
      const result = await AuthService.register(req.body, ipAddress);

      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      console.error('--- REGISTRATION ERROR DETAILS ---', error);
      return res.status(error.statusCode || 400).json({
        status: 'fail',
        message: error.message || 'Registration failed'
      });
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';

      const result = await AuthService.login(email, password, ipAddress);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          token: result.accessToken
        }
      });
    } catch (error) {
      console.error('--- LOGIN ERROR DETAILS ---', error);
      return res.status(error.statusCode || 401).json({
        status: 'fail',
        message: error.message || 'Invalid email or password'
      });
    }
  };

  getMe = async (req, res, next) => {
    try {
      return res.status(200).json({
        status: 'success',
        message: 'User profile fetched successfully',
        data: req.user
      });
    } catch (error) {
      return res.status(500).json({ status: 'fail', message: error.message });
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      const result = await AuthService.refreshToken(token);

      return res.status(200).json({
        status: 'success',
        message: 'Token refreshed',
        data: {
          accessToken: result.accessToken,
          token: result.accessToken
        }
      });
    } catch (error) {
      return res.status(401).json({ status: 'fail', message: error.message || 'Token refresh failed' });
    }
  };

  logout = async (req, res, next) => {
    try {
      if (req.user?._id) {
        await AuthService.logout(req.user._id);
      }
      res.clearCookie('refreshToken');
      return res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
      });
    } catch (error) {
      return res.status(500).json({ status: 'fail', message: error.message });
    }
  };
}

module.exports = new AuthController();