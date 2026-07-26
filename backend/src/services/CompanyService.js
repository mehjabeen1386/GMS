// Purpose: Enterprise Company Tenant Business Logic Service Layer
// Path: backend/src/services/CompanyService.js

const CompanyRepository = require('../repositories/CompanyRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for company tenant management and configuration.
 */
class CompanyService {
  /**
   * Registers a new company tenant under a contractor
   * @param {Object} companyData - Company registration payload
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async createCompany(companyData, contractorId, ipAddress = '') {
    const existingCode = await CompanyRepository.findByCompanyCode(companyData.companyCode);
    if (existingCode) {
      throw new ApiError(409, 'Company with this unique company code already exists');
    }

    const payload = {
      ...companyData,
      contractorId
    };

    const company = await CompanyRepository.create(payload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'COMPANY_CREATED',
      targetModel: 'Company',
      targetId: company._id,
      ipAddress,
      details: { companyName: company.companyName, companyCode: company.companyCode }
    });

    logger.info(`Company tenant created: ${company.companyName} (${company.companyCode}) by Contractor: ${contractorId}`);

    return company;
  }

  /**
   * Retrieves a company by ID with contractor security verification
   * @param {string} companyId - Company ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getCompanyById(companyId, contractorId) {
    const company = await CompanyRepository.findByIdAndContractor(companyId, contractorId);
    if (!company) {
      throw new ApiError(404, 'Company not found or unauthorized access');
    }
    return company;
  }

  /**
   * Retrieves all companies registered to a contractor
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getContractorCompanies(contractorId) {
    return await CompanyRepository.findByContractor(contractorId);
  }

  /**
   * Updates company profile metadata
   * @param {string} companyId - Company ObjectId
   * @param {Object} updateData - Fields to update
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async updateCompany(companyId, updateData, contractorId, ipAddress = '') {
    const company = await CompanyRepository.findByIdAndContractor(companyId, contractorId);
    if (!company) {
      throw new ApiError(404, 'Company not found or unauthorized access');
    }

    // Prevent tampering with primary tenant ownership keys
    delete updateData.contractorId;
    delete updateData.companyCode;

    const updatedCompany = await CompanyRepository.updateById(companyId, updateData);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'COMPANY_UPDATED',
      targetModel: 'Company',
      targetId: companyId,
      ipAddress,
      details: { updatedFields: Object.keys(updateData) }
    });

    logger.info(`Company updated: ${company.companyName} [${companyId}]`);

    return updatedCompany;
  }
}

module.exports = new CompanyService();