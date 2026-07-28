// Purpose: Factory Worker Personnel Business Logic Service Layer
// Path: backend/src/services/WorkerService.js

const WorkerRepository = require('../repositories/WorkerRepository');
const WorkshopRepository = require('../repositories/WorkshopRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for worker personnel management and shop-floor assignments.
 */
class WorkerService {
  /**
   * Registers a new factory worker profile under a contractor
   * @param {Object} workerData - Worker registration payload
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async createWorker(workerData, contractorId, ipAddress = '') {
    // Check if unique worker code already exists
    const existingCode = await WorkerRepository.findByWorkerCode(workerData.workerCode, contractorId);
    if (existingCode) {
      throw new ApiError(409, 'Worker with this worker code already exists under your organization');
    }

    // Verify workshop belongs to contractor if workshopId is provided
    if (workerData.workshopId) {
      const workshop = await WorkshopRepository.findByIdAndContractor(workerData.workshopId, contractorId);
      if (!workshop) {
        throw new ApiError(404, 'Assigned workshop not found or unauthorized access');
      }
    }

    const payload = {
      ...workerData,
      contractorId
    };

    const worker = await WorkerRepository.create(payload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'WORKER_REGISTERED',
      targetModel: 'Worker',
      targetId: worker._id,
      ipAddress,
      details: { workerCode: worker.workerCode, skillGrade: worker.skillGrade }
    });

    logger.info(`Worker registered: ${worker.workerCode} [${worker._id}] by Contractor: ${contractorId}`);

    return worker;
  }

  /**
   * Retrieves a worker profile by ID with full relational population
   * @param {string} workerId - Worker ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getWorkerById(workerId, contractorId) {
    const worker = await WorkerRepository.findByIdAndContractor(workerId, contractorId);
    if (!worker) {
      throw new ApiError(404, 'Worker not found or unauthorized access');
    }
    return worker;
  }

  /**
   * Retrieves all workers registered to a contractor, with optional workshop filter
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [workshopId] - Optional Workshop filter
   */
  async getContractorWorkers(contractorId, workshopId = null) {
    if (workshopId) {
      return await WorkerRepository.findByWorkshop(workshopId);
    }
    return await WorkerRepository.findByContractor(contractorId);
  }

  /**
   * Updates worker profile, wage configuration, or workshop assignment
   * @param {string} workerId - Worker ObjectId
   * @param {Object} updateData - Fields to update
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async updateWorker(workerId, updateData, contractorId, ipAddress = '') {
    const worker = await WorkerRepository.findByIdAndContractor(workerId, contractorId);
    if (!worker) {
      throw new ApiError(404, 'Worker not found or unauthorized access');
    }

    // If changing workshop, verify new workshop ownership
    if (updateData.workshopId && updateData.workshopId !== worker.workshopId?.toString()) {
      const workshop = await WorkshopRepository.findByIdAndContractor(updateData.workshopId, contractorId);
      if (!workshop) {
        throw new ApiError(404, 'Target workshop not found or unauthorized access');
      }
    }

    // Prevent tampering with core tenant isolation keys
    delete updateData.contractorId;
    delete updateData.workerCode; // Keep worker codes immutable

    const updatedWorker = await WorkerRepository.updateById(workerId, updateData);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'WORKER_UPDATED',
      targetModel: 'Worker',
      targetId: workerId,
      ipAddress,
      details: { updatedFields: Object.keys(updateData) }
    });

    logger.info(`Worker updated: ${worker.workerCode} [${workerId}]`);

    return updatedWorker;
  }
}

module.exports = new WorkerService();