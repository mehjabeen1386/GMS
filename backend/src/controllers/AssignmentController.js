// Purpose: Worker Task & Piece-Rate Assignment Controller Layer
// Path: backend/src/controllers/AssignmentController.js

const BaseController = require('./BaseController');
const AssignmentService = require('../services/AssignmentService');

/**
 * Controller handling task allocation to workers, completed piece logging, and assignment progress tracking.
 */
class AssignmentController extends BaseController {
  /**
   * Assigns a production task or piece-rate quota to a worker
   */
  createAssignment = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const assignment = await AssignmentService.createAssignment(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Task assigned to worker successfully', assignment);
  });

  /**
   * Retrieves an assignment by ID within contractor scope
   */
  getAssignmentById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const assignment = await AssignmentService.getAssignmentById(id, contractorId);
    return this.sendSuccess(res, 200, 'Assignment retrieved successfully', assignment);
  });

  /**
   * Retrieves all assignments for a specific worker
   */
  getWorkerAssignments = this.catchAsync(async (req, res) => {
    const { workerId } = req.params;
    const contractorId = req.user._id;
    const assignments = await AssignmentService.getWorkerAssignments(workerId, contractorId);
    return this.sendSuccess(res, 200, 'Worker assignments retrieved successfully', assignments);
  });

  /**
   * Retrieves all assignments linked to a specific job order
   */
  getOrderAssignments = this.catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const contractorId = req.user._id;
    const assignments = await AssignmentService.getOrderAssignments(orderId, contractorId);
    return this.sendSuccess(res, 200, 'Order assignments retrieved successfully', assignments);
  });

  /**
   * Logs completed piece count progress for an active assignment
   */
  updateProgress = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { completedQuantity } = req.body;
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const updatedAssignment = await AssignmentService.updateProgress(id, completedQuantity, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Assignment progress updated successfully', updatedAssignment);
  });
}

module.exports = new AssignmentController();