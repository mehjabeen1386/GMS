// Purpose: Workshop Machinery Asset & Maintenance Controller Layer
// Path: backend/src/controllers/MachineController.js

const BaseController = require('./BaseController');
const MachineService = require('../services/MachineService');

/**
 * Controller handling machinery asset tracking, workshop allocation, and maintenance status
 */
class MachineController extends BaseController {
  /**
   * Registers a new machinery asset in a workshop
   */
  createMachine = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const machine = await MachineService.createMachine(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Machine asset registered successfully', machine);
  });

  /**
   * Retrieves paginated machinery assets under contractor scope
   */
  getContractorMachines = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const { page, limit } = this.getPaginationParams(req);
    const machines = await MachineService.getContractorMachines(contractorId, page, limit);
    return this.sendSuccess(res, 200, 'Machinery assets retrieved successfully', machines);
  });

  /**
   * Retrieves machinery assets filtered by specific workshop ID
   */
  getMachinesByWorkshop = this.catchAsync(async (req, res) => {
    const { workshopId } = req.params;
    const contractorId = req.user._id;
    const machines = await MachineService.getMachinesByWorkshop(workshopId, contractorId);
    return this.sendSuccess(res, 200, 'Workshop machines retrieved successfully', machines);
  });

  /**
   * Retrieves detailed machine equipment record by ID
   */
  getMachineById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const machine = await MachineService.getMachineById(id, contractorId);
    return this.sendSuccess(res, 200, 'Machine equipment details retrieved successfully', machine);
  });

  /**
   * Updates machine equipment details and maintenance status
   */
  updateMachine = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const updatedMachine = await MachineService.updateMachine(id, req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Machine details updated successfully', updatedMachine);
  });

  /**
   * Toggles machine operational state (e.g. MAINTENANCE, OPERATIONAL)
   */
  toggleMachineStatus = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const machine = await MachineService.toggleMachineStatus(id, status, contractorId, ipAddress);
    return this.sendSuccess(res, 200, `Machine status updated to ${status}`, machine);
  });
}

module.exports = new MachineController();