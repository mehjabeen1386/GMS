// Purpose: Fabric & Raw Material Inventory Controller Layer
// Path: backend/src/controllers/ClothController.js

const BaseController = require('./BaseController');
const ClothService = require('../services/ClothService');

/**
 * Controller handling fabric intake, roll inventory tracking, and stock deductions.
 */
class ClothController extends BaseController {
  /**
   * Registers a new fabric roll intake entry
   */
  createCloth = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const cloth = await ClothService.createCloth(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Fabric roll registered successfully', cloth);
  });

  /**
   * Retrieves a fabric roll by ID within contractor scope
   */
  getClothById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const cloth = await ClothService.getClothById(id, contractorId);
    return this.sendSuccess(res, 200, 'Fabric roll retrieved successfully', cloth);
  });

  /**
   * Retrieves all fabric inventory rolls for a contractor with optional company filter
   */
  getContractorCloths = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const companyId = req.query.companyId || null;
    const cloths = await ClothService.getContractorCloths(contractorId, companyId);
    return this.sendSuccess(res, 200, 'Fabric inventory retrieved successfully', cloths);
  });

  /**
   * Deducts meter usage from a fabric roll stock
   */
  deductStock = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { metersUsed } = req.body;
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const updatedCloth = await ClothService.deductStock(id, metersUsed, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Fabric inventory stock updated successfully', updatedCloth);
  });
}

module.exports = new ClothController();