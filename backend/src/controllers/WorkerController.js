// Purpose: Worker Management Controller Layer
// Path: backend/src/controllers/WorkerController.js

const BaseController = require('./BaseController');
const WorkerService = require('../services/WorkerService');

class WorkerController extends BaseController {
  createWorker = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const worker = await WorkerService.createWorker(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Worker profile created successfully', worker);
  });

  getWorkerById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const worker = await WorkerService.getWorkerById(id);
    return this.sendSuccess(res, 200, 'Worker details retrieved successfully', worker);
  });

  getAllWorkers = this.catchAsync(async (req, res) => {
    const { page, limit } = this.getPaginationParams(req);
    const result = await WorkerService.getAllWorkers(page, limit);
    return this.sendSuccess(res, 200, 'Workers retrieved successfully', result);
  });

  updateWorker = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const updatedWorker = await WorkerService.updateWorker(id, req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Worker updated successfully', updatedWorker);
  });

  toggleWorkerStatus = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const worker = await WorkerService.toggleWorkerStatus(id, isActive, contractorId, ipAddress);
    return this.sendSuccess(res, 200, `Worker status updated to ${isActive ? 'active' : 'inactive'}`, worker);
  });
}

module.exports = new WorkerController();