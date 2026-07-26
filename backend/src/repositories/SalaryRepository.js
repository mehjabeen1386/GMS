// Purpose: Payroll Ledger & Wage Advance Data Access Repository Layer
// Path: backend/src/repositories/SalaryRepository.js

const BaseRepository = require('./BaseRepository');
const Salary = require('../models/Salary');

/**
 * Repository layer for Salary (Payroll) entity database operations.
 */
class SalaryRepository extends BaseRepository {
  constructor() {
    super(Salary);
  }

  /**
   * Finds a salary record by ID with full relational population
   * @param {string} salaryId - Salary ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findByIdAndContractor(salaryId, contractorId) {
    return await this.model
      .findOne({ _id: salaryId, contractorId, isDeleted: { $ne: true } })
      .populate('workerId', 'workerCode userId')
      .populate('companyId', 'companyName companyCode')
      .populate('workshopId', 'workshopName')
      .exec();
  }

  /**
   * Retrieves salary records for a specific worker
   * @param {string} workerId - Worker ObjectId
   * @param {string} [status] - Optional payment status filter ('PENDING', 'PAID')
   */
  async findByWorker(workerId, status = null) {
    const filter = { workerId };
    if (status) {
      filter.status = status;
    }

    return await this.model
      .find({ isDeleted: { $ne: true }, ...filter })
      .sort({ payPeriodEnd: -1 })
      .exec();
  }

  /**
   * Retrieves pending payroll records for a given workshop and pay period
   * @param {string} workshopId - Workshop ObjectId
   * @param {Date|string} payPeriodStart - Period start date
   * @param {Date|string} payPeriodEnd - Period end date
   */
  async findByWorkshopAndPeriod(workshopId, payPeriodStart, payPeriodEnd) {
    return await this.model
      .find({
        workshopId,
        payPeriodStart: { $lte: new Date(payPeriodEnd) },
        payPeriodEnd: { $gte: new Date(payPeriodStart) },
        isDeleted: { $ne: true }
      })
      .populate('workerId', 'workerCode userId')
      .exec();
  }

  /**
   * Marks a salary record as paid and records disbursement metadata
   * @param {string} salaryId - Salary ObjectId
   * @param {string} paidByUserId - Contractor/Manager User ObjectId executing payment
   * @param {string} paymentMethod - Payment method ('CASH', 'BANK_TRANSFER', 'UPI')
   * @param {string} [transactionReference] - External transaction or receipt reference ID
   * @param {Object} [options] - Transaction session options
   */
  async markAsPaid(salaryId, paidByUserId, paymentMethod = 'CASH', transactionReference = '', options = {}) {
    return await this.model
      .findOneAndUpdate(
        { _id: salaryId, isDeleted: { $ne: true } },
        {
          $set: {
            status: 'PAID',
            paidBy: paidByUserId,
            paymentMethod,
            transactionReference,
            paidAt: new Date()
          }
        },
        { new: true, runValidators: true, ...options }
      )
      .exec();
  }
}

module.exports = new SalaryRepository();