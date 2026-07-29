// Purpose: Garment Quality Control & Defect Inspection Routes Layer
// Path: backend/src/routes/qualityCheckRoutes.js

const express = require('express');
const router = express.Router();
const qualityCheckController = require('../controllers/QualityCheckController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
  createQualityCheckValidator,
  getQualityCheckByIdValidator
} = require('../validators/qualityCheckValidator');

// Protect all quality check routes with JWT authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/quality-checks
 * @desc    Logs a new quality control inspection event
 * @access  Private (Contractor / Admin / Manager)
 */
router.post(
  '/',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  createQualityCheckValidator,
  validate,
  qualityCheckController.createQualityCheck
);

/**
 * @route   GET /api/v1/quality-checks/order/:orderId
 * @desc    Retrieves all quality check audit logs for a specific job order
 * @access  Private (Contractor / Admin / Manager)
 */
router.get(
  '/order/:orderId',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  qualityCheckController.getOrderQualityChecks
);

/**
 * @route   GET /api/v1/quality-checks/assignment/:assignmentId
 * @desc    Retrieves quality check audit logs associated with a specific worker assignment
 * @access  Private (Contractor / Admin / Manager)
 */
router.get(
  '/assignment/:assignmentId',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  qualityCheckController.getAssignmentQualityChecks
);

/**
 * @route   GET /api/v1/quality-checks/:id
 * @desc    Retrieves a single quality control inspection log by ID
 * @access  Private (Contractor / Admin / Manager)
 */
router.get(
  '/:id',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  getQualityCheckByIdValidator,
  validate,
  qualityCheckController.getQualityCheckById
);

module.exports = router;