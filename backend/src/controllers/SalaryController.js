// Purpose: Worker Payroll & Salary Calculation Controller Layer
// Path: backend/src/controllers/SalaryController.js

const BaseController = require('./BaseController');
const SalaryService = require('../services/SalaryService');

/**
 * Controller handling worker payroll processing, piece-rate calculation, and salary disbursement tracking.
 */
class SalaryController extends BaseController {
  /**
   * Processes piece-rate wage calculation and generates salary slip record
   */
  calculateSalary = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const salary = await SalaryService.calculateSalary(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Salary record calculated and generated successfully', salary);
  });

  /**
   * Retrieves a specific salary record by ID within contractor scope
   */
  getSalaryById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const salary = await SalaryService.getSalaryById(id, contractorId);
    return this.sendSuccess(res, 200, 'Salary record retrieved successfully', salary);
  });

  /**
   * Retrieves all payroll records for a specific worker
   */
  getWorkerSalaries = this.catchAsync(async (req, res) => {
    const { workerId } = req.params;
    const contractorId = req.user._id;
    const salaries = await SalaryService.getWorkerSalaries(workerId, contractorId);
    return this.sendSuccess(res, 200, 'Worker salary history retrieved successfully', salaries);
  });

  /**
   * Updates payout status for a salary record (e.g., mark as PAID)
   */
  updateSalaryStatus = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status, paymentMethod } = req.body;
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const updatedSalary = await SalaryService.updateSalaryStatus(id, status, paymentMethod, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Salary payment status updated successfully', updatedSalary);
  });
}

module.exports = new SalaryController();