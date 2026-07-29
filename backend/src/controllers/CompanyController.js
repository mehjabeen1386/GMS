// Purpose: Manufacturing Company Tenant Controller Layer
// Path: backend/src/controllers/CompanyController.js

const BaseController = require('./BaseController');
const CompanyService = require('../services/CompanyService');

/**
 * Controller handling company profile management and administrative company operations.
 */
class CompanyController extends BaseController {
  /**
   * Registers a new manufacturing company profile
   */
  createCompany = this.catchAsync(async (req, res) => {
    const ownerId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const company = await CompanyService.createCompany(req.body, ownerId, ipAddress);
    return this.sendSuccess(res, 201, 'Company registered successfully', company);
  });

  /**
   * Retrieves profile details for the authenticated user's company
   */
  getCompanyProfile = this.catchAsync(async (req, res) => {
    const userId = req.user._id;
    const company = await CompanyService.getCompanyByOwner(userId);
    return this.sendSuccess(res, 200, 'Company profile retrieved successfully', company);
  });

  /**
   * Retrieves details of a specific company by ID
   */
  getCompanyById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const company = await CompanyService.getCompanyById(id);
    return this.sendSuccess(res, 200, 'Company retrieved successfully', company);
  });

  /**
   * Updates details for the authenticated user's company profile
   */
  updateCompanyProfile = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const ownerId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const updatedCompany = await CompanyService.updateCompany(id, req.body, ownerId, ipAddress);
    return this.sendSuccess(res, 200, 'Company profile updated successfully', updatedCompany);
  });

  /**
   * Retrieves paginated list of all companies (Super Admin / System Admin only)
   */
  getAllCompanies = this.catchAsync(async (req, res) => {
    const { page, limit } = this.getPaginationParams(req);
    const result = await CompanyService.getAllCompanies(page, limit);
    return this.sendSuccess(res, 200, 'Companies retrieved successfully', result);
  });
}

module.exports = new CompanyController();