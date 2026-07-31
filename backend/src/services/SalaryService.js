// Purpose: Worker Payroll & Piece-Rate Salary Business Logic Service Layer
// Path: backend/src/services/SalaryService.js

const SalaryRepository = require('../repositories/SalaryRepository');
const WorkerRepository = require('../repositories/WorkerRepository');
const Assignment = require('../models/Assignment');
const Ledger = require('../models/Ledger');
const AuditLogRepository = require('../repositories/AuditLogRepository');

/**
 * Service layer for worker payroll disbursements and wage calculations.
 */
class SalaryService {
  /**
   * Calculates piece-rate earnings and generates a draft salary slip
   * @param {Object} payrollInput - Payroll calculation payload
   * @param {string} contractorId - Contractor User ObjectId
   */
  async calculateSalary(payrollInput, contractorId) {
    const { workerId, startDate, endDate, bonus = 0, deductions = 0, notes = '' } = payrollInput;

    // Verify worker exists under this contractor tenant
    let worker = null;
    if (WorkerRepository && typeof WorkerRepository.findByIdAndContractor === 'function') {
      worker = await WorkerRepository.findByIdAndContractor(workerId, contractorId);
    }

    if (!worker) {
      throw new Error('Worker not found under this contractor');
    }

    // Aggregate piece-rate earnings from completed assignments
    const assignments = await Assignment.find({
      contractorId,
      workerId,
      status: 'COMPLETED'
    });

    const pieceRateEarnings = assignments.reduce((acc, item) => {
      return acc + (item.totalAmount || (item.completedQuantity * item.ratePerPiece));
    }, 0);

    const netSalary = pieceRateEarnings + bonus - deductions;

    const salaryPayload = {
      contractorId,
      workerId,
      periodStart: startDate,
      periodEnd: endDate,
      pieceRateEarnings,
      bonus,
      deductions,
      netSalary,
      notes,
      paymentStatus: 'PENDING'
    };

    return await SalaryRepository.create(salaryPayload);
  }

  /**
   * Executes salary disbursement and logs double-entry financial ledger transaction
   * @param {string} salaryId - Salary ObjectId
   * @param {Object} paymentData - Payment metadata
   * @param {string} contractorId - Contractor User ObjectId
   */
  async paySalary(salaryId, paymentData, contractorId) {
    const salary = await SalaryRepository.findById(salaryId);
    if (!salary || salary.contractorId.toString() !== contractorId.toString()) {
      throw new Error('Salary record not found');
    }

    if (salary.paymentStatus === 'PAID') {
      throw new Error('Salary slip has already been paid');
    }

    // Update salary payment status
    if (typeof salary.save === 'function') {
      salary.paymentStatus = 'PAID';
      salary.paidAt = new Date();
      salary.paymentMethod = paymentData.paymentMethod;
      salary.referenceNumber = paymentData.referenceNumber;
      await salary.save();
    } else {
      await SalaryRepository.markAsPaid(
        salaryId,
        contractorId,
        paymentData.paymentMethod,
        paymentData.referenceNumber
      );
      salary.paymentStatus = 'PAID';
      salary.paidAt = new Date();
    }

    // Record DEBIT transaction in financial Ledger
    await Ledger.create({
      contractorId,
      referenceId: salaryId,
      type: 'DEBIT',
      amount: salary.netSalary,
      category: 'SALARY'
    });

    return salary;
  }

  async getSalaryById(salaryId, contractorId) {
    const salary = await SalaryRepository.findByIdAndContractor(salaryId, contractorId);
    if (!salary) {
      throw new Error('Salary record not found or unauthorized access');
    }
    return salary;
  }

  async getWorkerSalaryHistory(workerId, contractorId) {
    return await SalaryRepository.findByWorker(workerId);
  }
}

module.exports = new SalaryService();