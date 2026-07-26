// Purpose: Financial General Ledger & Cash Flow Data Access Repository Layer
// Path: backend/src/repositories/LedgerRepository.js

const BaseRepository = require('./BaseRepository');
const Ledger = require('../models/Ledger');

/**
 * Repository layer for Ledger (Financial Accounting) entity database operations.
 */
class LedgerRepository extends BaseRepository {
  constructor() {
    super(Ledger);
  }

  /**
   * Finds a ledger entry by ID with company and contractor relation population
   * @param {string} ledgerId - Ledger transaction ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findByIdAndContractor(ledgerId, contractorId) {
    return await this.model
      .findOne({ _id: ledgerId, contractorId, isDeleted: { $ne: true } })
      .populate('companyId', 'companyName companyCode')
      .populate('workshopId', 'workshopName')
      .exec();
  }

  /**
   * Retrieves ledger transactions for a contractor within an optional date range and category
   * @param {string} contractorId - Contractor User ObjectId
   * @param {Object} [filters] - Additional filters (companyId, transactionType, category)
   * @param {Date|string} [startDate] - Range start date
   * @param {Date|string} [endDate] - Range end date
   */
  async findTransactions(contractorId, filters = {}, startDate = null, endDate = null) {
    const query = { contractorId, isDeleted: { $ne: true }, ...filters };

    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate);
      if (endDate) query.transactionDate.$lte = new Date(endDate);
    }

    return await this.model
      .find(query)
      .populate('companyId', 'companyName companyCode')
      .sort({ transactionDate: -1, createdAt: -1 })
      .exec();
  }

  /**
   * Calculates the net financial balance (Total Income - Total Expense) for a contractor/company
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [companyId] - Optional Company filter
   */
  async calculateNetBalance(contractorId, companyId = null) {
    const matchStage = { contractorId, isDeleted: { $ne: true } };
    if (companyId) {
      matchStage.companyId = companyId;
    }

    const result = await this.model.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$transactionType', 'CREDIT'] }, '$amount', 0] }
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$transactionType', 'DEBIT'] }, '$amount', 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpense: 1,
          netBalance: { $subtract: ['$totalIncome', '$totalExpense'] }
        }
      }
    ]);

    return result.length > 0 ? result[0] : { totalIncome: 0, totalExpense: 0, netBalance: 0 };
  }
}

module.exports = new LedgerRepository();