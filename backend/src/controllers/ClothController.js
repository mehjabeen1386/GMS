// Purpose: Cloth / Raw Material Controller Layer
// Path: backend/src/controllers/ClothController.js

const BaseController = require('./BaseController');
const ClothService = require('../services/ClothService');

class ClothController extends BaseController {
  createCloth = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const cloth = await ClothService.createCloth(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Cloth created successfully', cloth);
  });

  getAllCloths = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const cloths = await ClothService.getAllCloths(contractorId);
    return this.sendSuccess(res, 200, 'Cloths retrieved successfully', cloths);
  });

  getClothById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const cloth = await ClothService.getClothById(id, contractorId);
    return this.sendSuccess(res, 200, 'Cloth retrieved successfully', cloth);
  });

  updateCloth = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const updatedCloth = await ClothService.updateCloth(id, req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Cloth updated successfully', updatedCloth);
  });

  // Added to handle router.patch('/:id/status', ...)
  toggleClothStatus = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const cloth = await ClothService.toggleClothStatus(id, isActive, contractorId, ipAddress);
    return this.sendSuccess(res, 200, `Cloth status updated to ${isActive ? 'active' : 'inactive'}`, cloth);
  });

  deleteCloth = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    await ClothService.deleteCloth(id, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Cloth deleted successfully');
  });
}

module.exports = new ClothController();