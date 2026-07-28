// Purpose: Factory Machinery & Equipment Business Logic Service Layer
// Path: backend/src/services/MachineService.js

const MachineRepository = require('../repositories/MachineRepository');
const WorkshopRepository = require('../repositories/WorkshopRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for factory machinery inventory and maintenance tracking.
 */
class MachineService {
  /**
   * Registers a new factory machine or equipment asset
   * @param {Object} machineData - Machine registration payload
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async createMachine(machineData, contractorId, ipAddress = '') {
    // Check if unique machine serial/code exists under contractor
    const existingMachine = await MachineRepository.findByMachineCode(machineData.machineCode, contractorId);
    if (existingMachine) {
      throw new ApiError(409, 'Machine with this code/serial number already exists');
    }

    // Verify workshop ownership if workshopId is provided
    if (machineData.workshopId) {
      const workshop = await WorkshopRepository.findByIdAndContractor(machineData.workshopId, contractorId);
      if (!workshop) {
        throw new ApiError(404, 'Assigned workshop not found or unauthorized access');
      }
    }

    const payload = {
      ...machineData,
      contractorId
    };

    const machine = await MachineRepository.create(payload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'MACHINE_REGISTERED',
      targetModel: 'Machine',
      targetId: machine._id,
      ipAddress,
      details: { machineCode: machine.machineCode, machineName: machine.machineName, status: machine.status }
    });

    logger.info(`Machine registered: ${machine.machineCode} [${machine._id}] by Contractor: ${contractorId}`);

    return machine;
  }

  /**
   * Retrieves a machine by ID with security verification
   * @param {string} machineId - Machine ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getMachineById(machineId, contractorId) {
    const machine = await MachineRepository.findByIdAndContractor(machineId, contractorId);
    if (!machine) {
      throw new ApiError(404, 'Machine not found or unauthorized access');
    }
    return machine;
  }

  /**
   * Retrieves all machines for a contractor with optional workshop filter
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [workshopId] - Optional workshop filter
   */
  async getContractorMachines(contractorId, workshopId = null) {
    if (workshopId) {
      return await MachineRepository.findByWorkshop(workshopId);
    }
    return await MachineRepository.findByContractor(contractorId);
  }

  /**
   * Updates machine operational status or maintenance details
   * @param {string} machineId - Machine ObjectId
   * @param {string} status - New operational status ('OPERATIONAL', 'UNDER_MAINTENANCE', 'DECOMMISSIONED')
   * @param {Object} [updateData] - Additional update fields
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async updateMachineStatus(machineId, status, updateData = {}, contractorId, ipAddress = '') {
    const machine = await MachineRepository.findByIdAndContractor(machineId, contractorId);
    if (!machine) {
      throw new ApiError(404, 'Machine not found or unauthorized access');
    }

    const updatedMachine = await MachineRepository.updateStatus(machineId, status, updateData);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'MACHINE_STATUS_UPDATED',
      targetModel: 'Machine',
      targetId: machineId,
      ipAddress,
      details: { machineCode: machine.machineCode, previousStatus: machine.status, newStatus: status }
    });

    logger.info(`Machine status updated: ${machine.machineCode} -> ${status}`);

    return updatedMachine;
  }
}

module.exports = new MachineService();