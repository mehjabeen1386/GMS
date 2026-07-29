// Purpose: Piece-Rate Payroll & Worker Salary Calculation Routes Layer
// Path: backend/src/routes/salaryRoutes.js
const express = require('express'); const router = express.Router();
const salaryController = require('../controllers/SalaryController'); const authenticate = require('../middlewares/authenticate'); const authorize = require('../middlewares/authorize');
const {
  calculateSalaryValidator,   paySalaryValidator,   getSalaryByIdValidator } = require('../validators/salaryValidator');
// Protect all salary and payroll routes with JWT authentication router.use(authenticate);
/**
*	@route   POST /api/v1/salaries/calculate
*	@desc    Calculates piece-rate wages and generates draft salary payout for a worker
*	@access  Private (Contractor / Admin)
 */
router.post(
  '/calculate',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  calculateSalaryValidator,   salaryController.calculateSalary );
/**
*	@route   PATCH /api/v1/salaries/:id/pay
*	@desc    Marks a calculated salary slip as PAID and logs ledger debit transaction
*	@access  Private (Contractor / Admin)
 */ router.patch(   '/:id/pay',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  getSalaryByIdValidator,   paySalaryValidator,   salaryController.paySalary );
/**
*	@route   GET /api/v1/salaries/worker/:workerId
*	@desc    Retrieves historical salary slips for a specific worker
*	@access  Private (Contractor / Admin / Manager)
 */ router.get(
  '/worker/:workerId',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  salaryController.getWorkerSalaries );
/**
*	@route   GET /api/v1/salaries/:id
*	@desc    Retrieves detailed breakdown for a single salary slip by ID
*	@access  Private (Contractor / Admin / Manager)
 */ router.get(   '/:id',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  getSalaryByIdValidator,   salaryController.getSalaryById ); module.exports = router;
