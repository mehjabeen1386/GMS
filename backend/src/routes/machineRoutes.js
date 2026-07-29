// Purpose: Workshop Machinery Asset & Maintenance Routes Layer
// Path: backend/src/routes/machineRoutes.js
const express = require('express'); const router = express.Router();
const machineController = require('../controllers/MachineController');
const authenticate = require('../middlewares/authenticate'); const authorize = require('../middlewares/authorize');
const {
  createMachineValidator,   updateMachineValidator,   getMachineByIdValidator } = require('../validators/machineValidator');
// Protect all machinery asset routes with JWT authentication router.use(authenticate);
/**
*	@route   POST /api/v1/machines
*	@desc    Registers a new machinery asset in a workshop
*	@access  Private (Contractor / Admin / Manager)
 */ router.post(
  '/',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  createMachineValidator,   machineController.createMachine );
/**
*	@route   GET /api/v1/machines
*	@desc    Retrieves paginated machinery assets under contractor scope
*	@access  Private (Contractor / Admin / Manager)
 */ router.get(   '/',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  machineController.getContractorMachines );
/**
*	@route   GET /api/v1/machines/workshop/:workshopId
*	@desc    Retrieves machinery assets filtered by specific workshop ID
*	@access  Private (Contractor / Admin / Manager)
 */ router.get(
  '/workshop/:workshopId',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  machineController.getMachinesByWorkshop );
/**
*	@route   GET /api/v1/machines/:id
*	@desc    Retrieves detailed machine equipment record by ID
*	@access  Private (Contractor / Admin / Manager)
 */ router.get(   '/:id',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  getMachineByIdValidator,   machineController.getMachineById );
/**
*	@route   PUT /api/v1/machines/:id
*	@desc    Updates machine equipment details and maintenance status
*	@access  Private (Contractor / Admin / Manager)
 */ router.put(   '/:id',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  getMachineByIdValidator,   updateMachineValidator,   machineController.updateMachine );
/**
*	@route   PATCH /api/v1/machines/:id/status
*	@desc    Toggles machine operational state (e.g. MAINTENANCE, IN_USE)
*	@access  Private (Contractor / Admin / Manager)
 */
router.patch(
  '/:id/status',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  getMachineByIdValidator,
  machineController.toggleMachineStatus ); module.exports = router;
