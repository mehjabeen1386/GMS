// Purpose: Workshop Management Routes Layer
// Path: backend/src/routes/workshopRoutes.js

const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/WorkshopController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
  createWorkshopValidator,
  updateWorkshopValidator,
  getWorkshopByIdValidator
} = require('../validators/workshopValidator');

// Protect all workshop routes with JWT authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/workshops
 * @desc    Creates a new workshop profile
 * @access  Private (Contractor / Admin / Super Admin)
 */
router.post(
  '/',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  createWorkshopValidator,
  validate,
  workshopController.createWorkshop
);

/**
 * @route   GET /api/v1/workshops
 * @desc    Retrieves list of workshops
 * @access  Private
 */
router.get(
  '/',
  workshopController.getAllWorkshops
);

/**
 * @route   GET /api/v1/workshops/:id
 * @desc    Retrieves a specific workshop by ID
 * @access  Private
 */
router.get(
  '/:id',
  getWorkshopByIdValidator,
  validate,
  workshopController.getWorkshopById
);

/**
 * @route   PUT /api/v1/workshops/:id
 * @desc    Updates workshop details
 * @access  Private (Contractor / Admin / Super Admin)
 */
router.put(
  '/:id',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  getWorkshopByIdValidator,
  updateWorkshopValidator,
  validate,
  workshopController.updateWorkshop
);

/**
 * @route   PATCH /api/v1/workshops/:id/status
 * @desc    Toggles workshop active/inactive status
 * @access  Private (Contractor / Admin / Super Admin)
 */
router.patch(
  '/:id/status',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  getWorkshopByIdValidator,
  validate,
  workshopController.toggleWorkshopStatus
);

module.exports = router;