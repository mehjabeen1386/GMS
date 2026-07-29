// Purpose: User Profile & Account Management Controller Layer
// Path: backend/src/controllers/UserController.js

const BaseController = require('./BaseController');
const UserService = require('../services/UserService');

/**
 * Controller handling user profiles, account administration, and status updates.
 */
class UserController extends BaseController {
  /**
   * Retrieves profile details for the currently authenticated user
   */
  getProfile = this.catchAsync(async (req, res) => {
    const userId = req.user._id;
    const user = await UserService.getUserById(userId);
    return this.sendSuccess(res, 200, 'User profile retrieved successfully', user);
  });

  /**
   * Updates profile details for the currently authenticated user
   */
  updateProfile = this.catchAsync(async (req, res) => {
    const userId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const updatedUser = await UserService.updateUserProfile(userId, req.body, userId, ipAddress);
    return this.sendSuccess(res, 200, 'User profile updated successfully', updatedUser);
  });

  /**
   * Retrieves paginated list of users (Admin only)
   */
  getAllUsers = this.catchAsync(async (req, res) => {
    const { page, limit } = this.getPaginationParams(req);
    const filters = {
      role: req.query.role,
      search: req.query.search
    };
    const result = await UserService.getAllUsers(filters, page, limit);
    return this.sendSuccess(res, 200, 'Users retrieved successfully', result);
  });

  /**
   * Retrieves a specific user by ID (Admin only)
   */
  getUserById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    return this.sendSuccess(res, 200, 'User retrieved successfully', user);
  });

  /**
   * Toggles user active account status (Admin only)
   */
  toggleUserStatus = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    const adminId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const user = await UserService.toggleUserStatus(id, isActive, adminId, ipAddress);
    return this.sendSuccess(res, 200, `User status updated to ${isActive ? 'active' : 'inactive'}`, user);
  });
}

module.exports = new UserController();