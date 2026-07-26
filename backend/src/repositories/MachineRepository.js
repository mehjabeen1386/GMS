// Purpose: Factory Machinery & Maintenance Data Access Repository Layer
// Path: backend/src/repositories/MachineRepository.js

const BaseRepository = require('./BaseRepository');
const Machine = require('../models/Machine');

/**
 * Repository layer for Machine entity database operations.
 */
class MachineRepository extends BaseRepository {
  constructor() {
    super(Machine);
  }

  /**
   * Finds a machine by ID with workshop and contractor population
   * @param {string} machineId - Machine ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findByIdAndContractor(machineId, contractorId) {
    return await this.model
      .findOne({ _id: machineId, contractorId, isDeleted: { $ne: true } })
      .populate('workshopId', 'workshopName')
      .populate('assignedWorkerId', 'workerCode')
      .exec();
  }

  /**
   * Finds all machines assigned to a specific workshop
   * @param {string} workshopId - Workshop ObjectId
   */
  async findByWorkshop(workshopId) {
    return await this.model
      .find({ workshopId, isDeleted: { $ne: true } })
      .populate('assignedWorkerId', 'workerCode')
      .sort({ machineCode: 1 })
      .exec();
  }

  /**
   * Finds machines requiring maintenance or matching status filter
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [status] - Optional machine status filter ('OPERATIONAL', 'UNDER_MAINTENANCE', 'OUT_OF_ORDER')
   */
  async findByStatus(contractorId, status = null) {
    const filter = { contractorId, isDeleted: { $ne: true } };
    if (status) {
      filter.status = status;
    }

    return await this.model
      .find(filter)
      .populate('workshopId', 'workshopName')
      .populate('assignedWorkerId', 'workerCode')
      .sort({ updatedAt: -1 })
      .exec();
  }

  /**
   * Updates machine operational status and records maintenance log entry
   * @param {string} machineId - Machine ObjectId
   * @param {string} status - New status ('OPERATIONAL', 'UNDER_MAINTENANCE', 'OUT_OF_ORDER')
   * @param {Object} maintenanceLog - Maintenance entry details (description, cost, performedBy)
   * @param {Object} [options] - Transaction session options
   */
  async updateStatusWithMaintenanceLog(machineId, status, maintenanceLog = null, options = {}) {
    const updatePayload = { status };

    if (maintenanceLog) {
      updatePayload.$push = { maintenanceHistory: { ...maintenanceLog, date: new Date() } };
    }

    return await this.model
      .findByIdAndUpdate(machineId, updatePayload, {
        new: true,
        runValidators: true,
        ...options
      })
      .exec();
  }
}

module.exports = new MachineRepository();