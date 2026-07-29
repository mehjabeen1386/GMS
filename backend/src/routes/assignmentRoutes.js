// Purpose: Worker Task & Piece-Rate Assignment Routes Layer
// Path: backend/src/routes/assignmentRoutes.js
const express = require('express'); const router = express.Router();
const assignmentController = require('../controllers/AssignmentController');
const authenticate = require('../middlewares/authenticate'); const authorize = require('../middlewares/authorize');
const {
  createAssignmentValidator,   updateProgressValidator,   getAssignmentByIdValidator } = require('../validators/assignmentValidator');
// Protect all task assignment routes with JWT authentication router.use(authenticate);
/**
*	@route   POST /api/v1/assignments
*	@desc    Assigns a piece-rate production task/operation to a worker
*	@access  Private (Contractor / Admin / Manager)
 */ router.post(
  '/',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  createAssignmentValidator,
  assignmentController.createAssignment );
/**
*	@route   GET /api/v1/assignments/worker/:workerId
*	@desc    Retrieves all task assignments allocated to a specific worker
*	@access  Private (Contractor / Admin / Manager)
 */ router.get(
  '/worker/:workerId',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  assignmentController.getWorkerAssignments );
/**
*	@route   GET /api/v1/assignments/order/:orderId
*	@desc    Retrieves all worker task assignments linked to a specific job order
*	@access  Private (Contractor / Admin / Manager)
 */ router.get(
  '/order/:orderId',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  assignmentController.getOrderAssignments
);
/**
*	@route   GET /api/v1/assignments/:id
*	@desc    Retrieves assignment details by ID
*	@access  Private (Contractor / Admin / Manager)
 */ router.get(   '/:id',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  getAssignmentByIdValidator,
  assignmentController.getAssignmentById );
/**
*	@route   PATCH /api/v1/assignments/:id/progress
*	@desc    Updates completed piece count and operational progress on an assignment
*	@access  Private (Contractor / Admin / Manager)
 */
router.patch(
  '/:id/progress',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  getAssignmentByIdValidator,   updateProgressValidator,
  assignmentController.updateProgress ); module.exports = router;
