// Purpose: Fabric Inventory & Raw Material Business Logic Service Layer
// Path: backend/src/services/ClothService.js

const ClothRepository = require('../repositories/ClothRepository');
const CompanyRepository = require('../repositories/CompanyRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for fabric inventory and roll stock management.
 */
class ClothService {
  /**
   * Registers a new fabric roll in inventory
   * @param {Object} clothData - Fabric roll payload
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async createCloth(clothData, contractorId, ipAddress = '') {
    // Check if unique roll code exists under contractor
    const existingRoll = await ClothRepository.findByRollCode(clothData.rollCode, contractorId);
    if (existingRoll) {
      throw new ApiError(409, 'Fabric roll with this roll code already exists');
    }

    // Verify company association if companyId is provided
    if (clothData.companyId) {
      const company = await CompanyRepository.findByIdAndContractor(clothData.companyId, contractorId);
      if (!company) {
        throw new ApiError(404, 'Associated company not found or unauthorized access');
      }
    }

    const payload = {
      ...clothData,
      contractorId
    };

    const cloth = await ClothRepository.create(payload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'CLOTH_REGISTERED',
      targetModel: 'Cloth',
      targetId: cloth._id,
      ipAddress,
      details: { rollCode: cloth.rollCode, fabricType: cloth.fabricType, initialMeters: cloth.totalMeters }
    });

    logger.info(`Fabric roll registered: ${cloth.rollCode} [${cloth._id}] by Contractor: ${contractorId}`);

    return cloth;
  }

  /**
   * Retrieves a fabric roll by ID with security verification
   * @param {string} clothId - Cloth ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getClothById(clothId, contractorId) {
    const cloth = await ClothRepository.findByIdAndContractor(clothId, contractorId);
    if (!cloth) {
      throw new ApiError(404, 'Fabric roll not found or unauthorized access');
    }
    return cloth;
  }

  /**
   * Retrieves all fabric inventory for a contractor with optional filters
   * @param {string} contractorId - Contractor User ObjectId
   * @param {Object} [filters] - Additional filters (companyId, status)
   */
  async getContractorInventory(contractorId, filters = {}) {
    return await ClothRepository.findByContractor(contractorId, filters);
  }

  /**
   * Adjusts fabric roll stock meters (consumption or addition)
   * @param {string} clothId - Cloth ObjectId
   * @param {number} metersUsed - Meters consumed or added (can be negative for consumption)
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async adjustStock(clothId, metersUsed, contractorId, ipAddress = '') {
    const cloth = await ClothRepository.findByIdAndContractor(clothId, contractorId);
    if (!cloth) {
      throw new ApiError(404, 'Fabric roll not found or unauthorized access');
    }

    const newRemainingMeters = cloth.remainingMeters - metersUsed;
    if (newRemainingMeters < 0) {
      throw new ApiError(400, 'Stock adjustment exceeds available meters on this roll');
    }

    const updatedCloth = await ClothRepository.updateRemainingMeters(clothId, newRemainingMeters);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'CLOTH_STOCK_ADJUSTED',
      targetModel: 'Cloth',
      targetId: clothId,
      ipAddress,
      details: { rollCode: cloth.rollCode, metersUsed, remainingMeters: newRemainingMeters }
    });

    logger.info(`Fabric stock adjusted for roll ${cloth.rollCode}: remaining ${newRemainingMeters}m`);

    return updatedCloth;
  }
}

module.exports = new ClothService();