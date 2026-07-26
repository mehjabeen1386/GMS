// Purpose: Worker HR Profile & Rate Engine Data Access Repository Layer
// Path: backend/src/repositories/WorkerRepository.js

const BaseRepository = require('./BaseRepository');
const Worker = require('../models/Worker');

/**
 * Repository layer for Worker HR entity database operations.
 */
class WorkerRepository extends BaseRepository {
  constructor() {
    super(Worker);
  }

  /**
   * Finds worker profile by User ID reference
   * @param {string} userId - User ObjectId
   */
  async findByUserId(userId) {
    return await this.model
      .findOne({ userId, isDeleted: { $ne: true } })
      .populate('userId', 'fullName email phone preferredLanguage isActive')
      .populate('currentCompanyId', 'companyName companyCode')
      .populate('currentWorkshopId', 'workshopName')
      .exec();
  }

  /**
   * Finds worker profile by unique Worker Code
   * @param {string} workerCode - Unique Worker Code string
   */
  async findByWorkerCode(workerCode) {
    return await this.findOne({ workerCode: workerCode.toUpperCase() });
  }

  /**
   * Retrieves active workers for a specific contractor, with optional workshop filtering
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [workshopId] - Optional Workshop ObjectId filter
   */
  async findActiveWorkers(contractorId, workshopId = null) {
    const filter = { contractorId, status: 'ACTIVE' };
    if (workshopId) {
      filter.currentWorkshopId = workshopId;
    }

    return await this.model
      .find({ isDeleted: { $ne: true }, ...filter })
      .populate('userId', 'fullName phone')
      .populate('currentWorkshopId', 'workshopName')
      .exec();
  }

  /**
   * Transfers a worker to a new company or workshop and updates transfer history
   * @param {string} workerId - Worker ObjectId
   * @param {Object} transferPayload - Transfer metadata (toCompanyId, toWorkshopId, reason)
   * @param {Object} [options] - Transaction options session
   */
  async transferWorker(workerId, transferPayload, options = {}) {
    const worker = await this.findById(workerId);
    if (!worker) return null;

    const transferLog = {
      fromCompanyId: worker.currentCompanyId,
      toCompanyId: transferPayload.toCompanyId || worker.currentCompanyId,
      fromWorkshopId: worker.currentWorkshopId,
      toWorkshopId: transferPayload.toWorkshopId || worker.currentWorkshopId,
      reason: transferPayload.reason || 'Management Reassignment',
      transferredAt: new Date()
    };

    return await this.model
      .findByIdAndUpdate(
        workerId,
        {
          $set: {
            currentCompanyId: transferLog.toCompanyId,
            currentWorkshopId: transferLog.toWorkshopId,
            status: 'ACTIVE'
          },
          $push: { transferHistory: transferLog }
        },
        { new: true, runValidators: true, ...options }
      )
      .exec();
  }
}

module.exports = new WorkerRepository();