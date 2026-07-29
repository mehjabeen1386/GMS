// Purpose: Worker Management Routes Layer
// Path: backend/src/routes/workerRoutes.js

const express = require('express');
const router = express.Router();
const workerController = require('../controllers/WorkerController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
  createWorkerValidator,
  updateWorkerValidator,
  getWorkerByIdValidator
} = require('../validators/workerValidator');

// Protect all worker routes with JWT authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/workers
 * @desc    Creates a new worker profile
 * @access  Private (Contractor / Admin / Super Admin)
 */
router.post(
  '/',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  createWorkerValidator,
  validate,
  workerController.createWorker
);

/**
 * @route   GET /api/v1/workers
 * @desc    Retrieves all workers
 * @access  Private
 */
router.get(
  '/',
  workerController.getAllWorkers
);

/**
 * @route   GET /api/v1/workers/:id
 * @desc    Retrieves a specific worker by ID
 * @access  Private
 */
router.get(
  '/:id',
  getWorkerByIdValidator,
  validate,
  workerController.getWorkerById
);

/**
 * @route   PUT /api/v1/workers/:id
 * @desc    Updates worker details
 * @access  Private (Contractor / Admin / Super Admin)
 */
router.put(
  '/:id',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  getWorkerByIdValidator,
  updateWorkerValidator,
  validate,
  workerController.updateWorker
);

/**
 * @route   PATCH /api/v1/workers/:id/status
 * @desc    Toggles worker active/inactive status
 * @access  Private (Contractor / Admin / Super Admin)
 */
router.patch(
  '/:id/status',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  getWorkerByIdValidator,
  validate,
  workerController.toggleWorkerStatus
);

module.exports = router;