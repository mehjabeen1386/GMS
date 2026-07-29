// Purpose: Worker Task & Piece-Rate Assignment Controller Layer
// Path: backend/src/controllers/AssignmentController.js

const BaseController = require('./BaseController');
const AssignmentService = require('../services/AssignmentService');

/**
 * Controller handling worker task allocation, piece-rate tracking, and progress updates
 */
class AssignmentController extends BaseController {
  /**
   * Assigns a piece-rate production task/operation to a worker
   */
  createAssignment = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const assignment = await AssignmentService.createAssignment(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Task assigned successfully', assignment);
  });

  /**
   * Retrieves all task assignments allocated to a specific worker
   */
  getWorkerAssignments = this.catchAsync(async (req, res) => {
    const { workerId } = req.params;
    const contractorId = req.user._id;
    const assignments = await AssignmentService.getWorkerAssignments(workerId, contractorId);
    return this.sendSuccess(res, 200, 'Worker task assignments retrieved successfully', assignments);
  });

  /**
   * Retrieves all worker task assignments linked to a specific job order
   */
  getOrderAssignments = this.catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const contractorId = req.user._id;
    const assignments = await AssignmentService.getOrderAssignments(orderId, contractorId);
    return this.sendSuccess(res, 200, 'Order task assignments retrieved successfully', assignments);
  });

  /**
   * Retrieves assignment details by ID
   */
  getAssignmentById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const assignment = await AssignmentService.getAssignmentById(id, contractorId);
    return this.sendSuccess(res, 200, 'Assignment details retrieved successfully', assignment);
  });

  /**
   * Updates completed piece count and operational progress on an assignment
   */
  updateProgress = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const updatedAssignment = await AssignmentService.updateProgress(id, req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Assignment progress updated successfully', updatedAssignment);
  });
}

module.exports = new AssignmentController();