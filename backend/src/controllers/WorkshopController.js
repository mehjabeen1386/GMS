// Purpose: Manufacturing Workshop Floor Controller Layer
// Path: backend/src/controllers/WorkshopController.js

const BaseController = require('./BaseController');
const WorkshopService = require('../services/WorkshopService');

/**
 * Controller handling shop-floor unit operations, worker capacity, and workshop management.
 */
class WorkshopController extends BaseController {
  /**
   * Registers a new workshop unit under the authenticated contractor
   */
  createWorkshop = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const workshop = await WorkshopService.createWorkshop(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Workshop created successfully', workshop);
  });

  /**
   * Retrieves a workshop by ID under the contractor's scope
   */
  getWorkshopById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const workshop = await WorkshopService.getWorkshopById(id, contractorId);
    return this.sendSuccess(res, 200, 'Workshop retrieved successfully', workshop);
  });

  /**
   * Retrieves all workshops (Alias for getAllWorkshops used in routes)
   */
  getAllWorkshops = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const workshops = await WorkshopService.getContractorWorkshops(contractorId);
    return this.sendSuccess(res, 200, 'Workshops retrieved successfully', workshops);
  });

  /**
   * Updates workshop details, supervisor, or capacity configuration
   */
  updateWorkshop = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const updatedWorkshop = await WorkshopService.updateWorkshop(id, req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Workshop updated successfully', updatedWorkshop);
  });

  /**
   * Toggles workshop active/inactive status
   */
  toggleWorkshopStatus = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const workshop = await WorkshopService.toggleWorkshopStatus(id, isActive, contractorId, ipAddress);
    return this.sendSuccess(res, 200, `Workshop status updated to ${isActive ? 'active' : 'inactive'}`, workshop);
  });

  /**
   * Deactivates/removes a workshop unit
   */
  deleteWorkshop = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    await WorkshopService.deleteWorkshop(id, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Workshop deleted successfully');
  });
}

module.exports = new WorkshopController();