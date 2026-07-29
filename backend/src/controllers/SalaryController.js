// Purpose: Piece-Rate Payroll & Worker Salary Calculation Controller Layer
// Path: backend/src/controllers/SalaryController.js

const BaseController = require('./BaseController');
const SalaryService = require('../services/SalaryService');

/**
 * Controller handling worker payroll, piece-rate wage calculation, and payment transactions
 */
class SalaryController extends BaseController {
  /**
   * Calculates piece-rate wages and generates draft salary payout for a worker
   */
  calculateSalary = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const salary = await SalaryService.calculateSalary(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Salary calculated successfully', salary);
  });

  /**
   * Marks a calculated salary slip as PAID and logs ledger debit transaction
   */
  paySalary = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const paidSalary = await SalaryService.paySalary(id, req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Salary payment processed successfully', paidSalary);
  });

  /**
   * Retrieves historical salary slips for a specific worker
   */
  getWorkerSalaries = this.catchAsync(async (req, res) => {
    const { workerId } = req.params;
    const contractorId = req.user._id;
    const { page, limit } = this.getPaginationParams(req);
    const salaries = await SalaryService.getWorkerSalaries(workerId, contractorId, page, limit);
    return this.sendSuccess(res, 200, 'Worker salary history retrieved successfully', salaries);
  });

  /**
   * Retrieves detailed breakdown for a single salary slip by ID
   */
  getSalaryById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const salary = await SalaryService.getSalaryById(id, contractorId);
    return this.sendSuccess(res, 200, 'Salary slip details retrieved successfully', salary);
  });
}

module.exports = new SalaryController();