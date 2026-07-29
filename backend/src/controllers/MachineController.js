// Purpose: Workshop Machinery Asset & Maintenance Controller Layer
// Path: backend/src/controllers/MachineController.js

const BaseController = require('./BaseController');
const MachineService = require('../services/MachineService');

/**
 * Controller handling machinery asset tracking, operational status, and maintenance logs.
 */
class MachineController extends BaseController {
  /**
   * Registers a new machinery asset in the workshop floor inventory
   */
  createMachine = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const machine = await MachineService.createMachine(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Machinery asset registered successfully', machine);
  });

  /**
   * Retrieves a machinery asset by ID within contractor scope
   */
  getMachineById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const machine = await MachineService.getMachineById(id, contractorId);
    return this.sendSuccess(res, 200, 'Machinery asset retrieved successfully', machine);
  });

  /**
   * Retrieves paginated machinery assets for a contractor with optional status or workshop filters
   */
  getContractorMachines = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const { page, limit } = this.getPaginationParams(req);
    const filters = {
      status: req.query.status,
      workshopId: req.query.workshopId,
      search: req.query.search
    };
    const machines = await MachineService.getContractorMachines(contractorId, filters, page, limit);
    return this.sendSuccess(res, 200, 'Machinery inventory retrieved successfully', machines);
  });

  /**
   * Updates operational status of a machinery asset (e.g., ACTIVE, MAINTENANCE, DECOMMISSIONED)
   */
  updateMachineStatus = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const updatedMachine = await MachineService.updateMachineStatus(id, status, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Machinery operational status updated successfully', updatedMachine);
  });

  /**
   * Logs a maintenance or repair record for a machinery asset
   */
  logMaintenance = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const updatedMachine = await MachineService.logMaintenance(id, req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Maintenance record logged successfully', updatedMachine);
  });
}

module.exports = new MachineController();