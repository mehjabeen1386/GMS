// Purpose: Multi-Tenant Company Data Access Repository Layer
// Path: backend/src/repositories/CompanyRepository.js

const BaseRepository = require('./BaseRepository');
const Company = require('../models/Company');

/**
 * Repository layer for Company entity database operations.
 */
class CompanyRepository extends BaseRepository {
  constructor() {
    super(Company);
  }

  /**
   * Finds a company by ID and verifies contractor ownership
   * @param {string} companyId - Company ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findByIdAndContractor(companyId, contractorId) {
    return await this.findOne({ _id: companyId, contractorId });
  }

  /**
   * Finds all active companies owned by a specific contractor
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findByContractor(contractorId) {
    return await this.find({ contractorId });
  }

  /**
   * Checks if a company code already exists for a given contractor
   * @param {string} companyCode - Uppercase company code
   * @param {string} contractorId - Contractor User ObjectId
   */
  async existsByCode(companyCode, contractorId) {
    const count = await this.model.countDocuments({
      companyCode: companyCode.toUpperCase(),
      contractorId,
      isDeleted: { $ne: true }
    });
    return count > 0;
  }
}

module.exports = new CompanyRepository();