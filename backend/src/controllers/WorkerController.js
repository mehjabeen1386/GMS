// Purpose: Factory Worker Management Controller Layer
// Path: backend/src/controllers/WorkerController.js

const BaseController = require('./BaseController');
const WorkerService = require('../services/WorkerService');

/**
 * Controller handling factory worker onboarding, assignments, and wage profiles.
 */
class WorkerController extends BaseController {
  /**
   * Onboards a new worker under the authenticated contractor
   */
  createWorker = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const worker = await WorkerService.createWorker(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Worker registered successfully', worker);
  });

  /**
   * Retrieves a worker profile by ID within contractor scope
   */
  getWorkerById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const worker = await WorkerService.getWorkerById(id, contractorId);
    return this.sendSuccess(res, 200, 'Worker profile retrieved successfully', worker);
  });

  /**
   * Retrieves a worker profile by unique worker code within contractor scope
   */
  getWorkerByCode = this.catchAsync(async (req, res) => {
    const { workerCode } = req.params;
    const contractorId = req.user._id;
    const worker = await WorkerService.getWorkerByCode(workerCode, contractorId);
    return this.sendSuccess(res, 200, 'Worker retrieved successfully', worker);
  });

  /**
   * Retrieves paginated workers managed by the authenticated contractor with optional filters
   */
  getContractorWorkers = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const { page, limit } = this.getPaginationParams(req);
    const filters = {
      workshopId: req.query.workshopId,
      skillLevel: req.query.skillLevel,
      search: req.query.search
    };
    const workers = await WorkerService.getContractorWorkers(contractorId, filters, page, limit);
    return this.sendSuccess(res, 200, 'Workers retrieved successfully', workers);
  });

  /**
   * Updates worker details, skill level, or piece-rate wages
   */
  updateWorker = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const updatedWorker = await WorkerService.updateWorker(id, req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Worker updated successfully', updatedWorker);
  });

  /**
   * Reassigns worker to a new workshop unit
   */
  assignWorkshop = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { workshopId } = req.body;
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const worker = await WorkerService.assignWorkshop(id, workshopId, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Worker workshop reassigned successfully', worker);
  });
}

module.exports = new WorkerController();