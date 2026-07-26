// Purpose: Physical Production Workshop Business Logic Service Layer
// Path: backend/src/services/WorkshopService.js

const WorkshopRepository = require('../repositories/WorkshopRepository');
const CompanyRepository = require('../repositories/CompanyRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for workshop management and operational supervision.
 */
class WorkshopService {
  /**
   * Registers a new physical workshop under a company tenant
   * @param {Object} workshopData - Workshop registration payload
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async createWorkshop(workshopData, contractorId, ipAddress = '') {
    // Verify that the target company exists and belongs to the contractor
    const company = await CompanyRepository.findByIdAndContractor(workshopData.companyId, contractorId);
    if (!company) {
      throw new ApiError(404, 'Associated company not found or unauthorized access');
    }

    const payload = {
      ...workshopData,
      contractorId
    };

    const workshop = await WorkshopRepository.create(payload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'WORKSHOP_CREATED',
      targetModel: 'Workshop',
      targetId: workshop._id,
      ipAddress,
      details: { workshopName: workshop.workshopName, companyId: workshop.companyId }
    });

    logger.info(`Workshop created: ${workshop.workshopName} under Company: ${workshopData.companyId}`);

    return workshop;
  }

  /**
   * Retrieves a workshop by ID with tenant security verification
   * @param {string} workshopId - Workshop ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getWorkshopById(workshopId, contractorId) {
    const workshop = await WorkshopRepository.findByIdAndContractor(workshopId, contractorId);
    if (!workshop) {
      throw new ApiError(404, 'Workshop not found or unauthorized access');
    }
    return workshop;
  }

  /**
   * Retrieves all workshops registered under a contractor, with optional company filter
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [companyId] - Optional Company filter
   */
  async getContractorWorkshops(contractorId, companyId = null) {
    return await WorkshopRepository.findByContractor(contractorId, companyId);
  }

  /**
   * Updates workshop metadata and operational capacity settings
   * @param {string} workshopId - Workshop ObjectId
   * @param {Object} updateData - Fields to update
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async updateWorkshop(workshopId, updateData, contractorId, ipAddress = '') {
    const workshop = await WorkshopRepository.findByIdAndContractor(workshopId, contractorId);
    if (!workshop) {
      throw new ApiError(404, 'Workshop not found or unauthorized access');
    }

    // If companyId is being updated, verify ownership of the new company
    if (updateData.companyId && updateData.companyId !== workshop.companyId.toString()) {
      const newCompany = await CompanyRepository.findByIdAndContractor(updateData.companyId, contractorId);
      if (!newCompany) {
        throw new ApiError(404, 'Target company not found or unauthorized access');
      }
    }

    // Prevent tampering with tenant boundaries
    delete updateData.contractorId;

    const updatedWorkshop = await WorkshopRepository.updateById(workshopId, updateData);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'WORKSHOP_UPDATED',
      targetModel: 'Workshop',
      targetId: workshopId,
      ipAddress,
      details: { updatedFields: Object.keys(updateData) }
    });

    logger.info(`Workshop updated: ${workshop.workshopName} [${workshopId}]`);

    return updatedWorkshop;
  }
}

module.exports = new WorkshopService();