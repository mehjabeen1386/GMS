// Purpose: Garment Quality Assurance & Inspection Controller Layer
// Path: backend/src/controllers/QualityCheckController.js

const BaseController = require('./BaseController');
const QualityCheckService = require('../services/QualityCheckService');

/**
 * Controller handling quality assurance inspections, defect logging, and inspection reports.
 */
class QualityCheckController extends BaseController {
  /**
   * Logs a new quality assurance inspection result for a production batch/assignment
   */
  createQualityCheck = this.catchAsync(async (req, res) => {
    const inspectorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const qualityCheck = await QualityCheckService.createQualityCheck(req.body, inspectorId, ipAddress);
    return this.sendSuccess(res, 201, 'Quality check recorded successfully', qualityCheck);
  });

  /**
   * Retrieves a quality check record by ID within contractor scope
   */
  getQualityCheckById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const qualityCheck = await QualityCheckService.getQualityCheckById(id, contractorId);
    return this.sendSuccess(res, 200, 'Quality check retrieved successfully', qualityCheck);
  });

  /**
   * Retrieves all quality inspection records linked to a specific job order
   */
  getQualityChecksByOrder = this.catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const contractorId = req.user._id;
    const records = await QualityCheckService.getQualityChecksByOrder(orderId, contractorId);
    return this.sendSuccess(res, 200, 'Order quality inspections retrieved successfully', records);
  });

  /**
   * Retrieves all quality inspection records linked to a specific worker assignment
   */
  getQualityChecksByAssignment = this.catchAsync(async (req, res) => {
    const { assignmentId } = req.params;
    const contractorId = req.user._id;
    const records = await QualityCheckService.getQualityChecksByAssignment(assignmentId, contractorId);
    return this.sendSuccess(res, 200, 'Assignment quality inspections retrieved successfully', records);
  });
}

module.exports = new QualityCheckController();