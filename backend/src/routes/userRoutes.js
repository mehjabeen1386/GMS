// Purpose: User Profile & Administrative User Management Routes Layer
// Path: backend/src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const {
  updateProfileValidator,
  updateUserRoleValidator,
  getUserByIdValidator
} = require('../validators/userValidator');

// Protect all user routes with JWT authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/users/profile
 * @desc    Retrieves profile details for authenticated user
 * @access  Private (Authenticated User)
 */
router.get(
  '/profile',
  userController.getProfile
);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Updates profile details for authenticated user
 * @access  Private (Authenticated User)
 */
router.put(
  '/profile',
  updateProfileValidator,
  userController.updateProfile
);

/**
 * @route   GET /api/v1/users
 * @desc    Retrieves paginated list of system users
 * @access  Private (Super Admin / Admin)
 */
router.get(
  '/',
  authorize('SUPER_ADMIN', 'ADMIN'),
  userController.getAllUsers
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Retrieves user profile details by ID
 * @access  Private (Super Admin / Admin)
 */
router.get(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN'),
  getUserByIdValidator,
  userController.getUserById
);

/**
 * @route   PATCH /api/v1/users/:id/role
 * @desc    Updates user system role permissions
 * @access  Private (Super Admin)
 */
router.patch(
  '/:id/role',
  authorize('SUPER_ADMIN'),
  getUserByIdValidator,
  updateUserRoleValidator,
  userController.updateUserRole
);

/**
 * @route   PATCH /api/v1/users/:id/status
 * @desc    Toggles account active/inactive status
 * @access  Private (Super Admin / Admin)
 */
router.patch(
  '/:id/status',
  authorize('SUPER_ADMIN', 'ADMIN'),
  getUserByIdValidator,
  userController.toggleUserStatus
);

module.exports = router;