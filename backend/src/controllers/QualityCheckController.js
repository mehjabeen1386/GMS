// Purpose: Garment Quality Control & Defect Inspection Controller Layer
// Path: backend/src/controllers/QualityCheckController.js

const BaseController = require('./BaseController');
const QualityCheckService = require('../services/QualityCheckService');

/**
 * Controller handling quality inspections, defect logging, and audit history
 */
class QualityCheckController extends BaseController {
  /**
   * Logs a new quality control inspection event
   */
  createQualityCheck = this.catchAsync(async (req, res) => {
    const inspectorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const qualityCheck = await QualityCheckService.createQualityCheck(req.body, inspectorId, ipAddress);
    return this.sendSuccess(res, 201, 'Quality check inspection logged successfully', qualityCheck);
  });

  /**
   * Retrieves all quality check audit logs for a specific job order
   */
  getOrderQualityChecks = this.catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const contractorId = req.user._id;
    const qualityChecks = await QualityCheckService.getOrderQualityChecks(orderId, contractorId);
    return this.sendSuccess(res, 200, 'Order quality check logs retrieved successfully', qualityChecks);
  });

  /**
   * Retrieves quality check audit logs associated with a specific worker assignment
   */
  getAssignmentQualityChecks = this.catchAsync(async (req, res) => {
    const { assignmentId } = req.params;
    const contractorId = req.user._id;
    const qualityChecks = await QualityCheckService.getAssignmentQualityChecks(assignmentId, contractorId);
    return this.sendSuccess(res, 200, 'Assignment quality check logs retrieved successfully', qualityChecks);
  });

  /**
   * Retrieves a single quality control inspection log by ID
   */
  getQualityCheckById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const qualityCheck = await QualityCheckService.getQualityCheckById(id, contractorId);
    return this.sendSuccess(res, 200, 'Quality check log details retrieved successfully', qualityCheck);
  });
}

module.exports = new QualityCheckController();