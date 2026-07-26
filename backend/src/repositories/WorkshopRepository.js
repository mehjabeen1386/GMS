// Purpose: Workshop (Karkhana) Data Access Repository Layer
// Path: backend/src/repositories/WorkshopRepository.js

const BaseRepository = require('./BaseRepository');
const Workshop = require('../models/Workshop');

/**
 * Repository layer for Workshop entity database operations.
 */
class WorkshopRepository extends BaseRepository {
  constructor() {
    super(Workshop);
  }

  /**
   * Finds a workshop by ID and verifies contractor ownership
   * @param {string} workshopId - Workshop ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findByIdAndContractor(workshopId, contractorId) {
    return await this.findOne({ _id: workshopId, contractorId });
  }

  /**
   * Retrieves all workshops associated with a parent company
   * @param {string} companyId - Parent Company ObjectId
   */
  async findByCompany(companyId) {
    return await this.find({ companyId });
  }

  /**
   * Retrieves all workshops managed by a specific contractor
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findByContractor(contractorId) {
    return await this.find({ contractorId });
  }

  /**
   * Finds workshop assigned to a specific manager
   * @param {string} managerId - Workshop Manager User ObjectId
   */
  async findByManager(managerId) {
    return await this.findOne({ managerId });
  }

  /**
   * Updates total active machine count for a workshop
   * @param {string} workshopId - Workshop ObjectId
   * @param {number} totalMachines - Total machine count
   */
  async updateMachineCount(workshopId, totalMachines) {
    return await this.updateById(workshopId, { totalMachines });
  }
}

module.exports = new WorkshopRepository();