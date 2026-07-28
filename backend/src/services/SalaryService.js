// Purpose: Worker Payroll & Piece-Rate Salary Business Logic Service Layer
// Path: backend/src/services/SalaryService.js

const SalaryRepository = require('../repositories/SalaryRepository');
const WorkerRepository = require('../repositories/WorkerRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for worker payroll disbursements and wage calculations.
 */
class SalaryService {
  /**
   * Generates a salary disbursement record for a worker
   * @param {Object} salaryData - Salary payroll payload
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async createSalary(salaryData, contractorId, ipAddress = '') {
    // Verify worker exists and belongs to contractor
    const worker = await WorkerRepository.findByIdAndContractor(salaryData.workerId, contractorId);
    if (!worker) {
      throw new ApiError(404, 'Worker not found or unauthorized access');
    }

    const payload = {
      ...salaryData,
      contractorId
    };

    const salary = await SalaryRepository.create(payload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'SALARY_CREATED',
      targetModel: 'Salary',
      targetId: salary._id,
      ipAddress,
      details: { workerId: salary.workerId, netPayable: salary.netPayable, paymentStatus: salary.paymentStatus }
    });

    logger.info(`Salary record generated for Worker: ${salaryData.workerId} [Net: ${salary.netPayable}]`);

    return salary;
  }

  /**
   * Retrieves a salary record by ID with security verification
   * @param {string} salaryId - Salary ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getSalaryById(salaryId, contractorId) {
    const salary = await SalaryRepository.findByIdAndContractor(salaryId, contractorId);
    if (!salary) {
      throw new ApiError(404, 'Salary record not found or unauthorized access');
    }
    return salary;
  }

  /**
   * Retrieves payroll history for a specific worker
   * @param {string} workerId - Worker ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getWorkerSalaryHistory(workerId, contractorId) {
    const worker = await WorkerRepository.findByIdAndContractor(workerId, contractorId);
    if (!worker) {
      throw new ApiError(404, 'Worker not found or unauthorized access');
    }

    return await SalaryRepository.findByWorker(workerId);
  }

  /**
   * Updates salary payment status (e.g., marking payroll as paid)
   * @param {string} salaryId - Salary ObjectId
   * @param {string} paymentStatus - New payment status ('PENDING', 'PAID')
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async updatePaymentStatus(salaryId, paymentStatus, contractorId, ipAddress = '') {
    const salary = await SalaryRepository.findByIdAndContractor(salaryId, contractorId);
    if (!salary) {
      throw new ApiError(404, 'Salary record not found or unauthorized access');
    }

    const updatedSalary = await SalaryRepository.updatePaymentStatus(salaryId, paymentStatus);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'SALARY_PAYMENT_STATUS_UPDATED',
      targetModel: 'Salary',
      targetId: salaryId,
      ipAddress,
      details: { previousStatus: salary.paymentStatus, newStatus: paymentStatus }
    });

    logger.info(`Salary payment status updated for record ${salaryId} -> ${paymentStatus}`);

    return updatedSalary;
  }
}

module.exports = new SalaryService();