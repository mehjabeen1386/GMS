// Purpose: Financial General Ledger Business Logic Service Layer
// Path: backend/src/services/LedgerService.js

const LedgerRepository = require('../repositories/LedgerRepository');
const CompanyRepository = require('../repositories/CompanyRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for general ledger financial tracking and cash flow management.
 */
class LedgerService {
  /**
   * Records a financial ledger transaction (income, expense, advance, etc.)
   * @param {Object} transactionData - Ledger entry payload
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async createTransaction(transactionData, contractorId, ipAddress = '') {
    // Verify company association and ownership if companyId is provided
    if (transactionData.companyId) {
      const company = await CompanyRepository.findByIdAndContractor(transactionData.companyId, contractorId);
      if (!company) {
        throw new ApiError(404, 'Associated company not found or unauthorized access');
      }
    }

    const payload = {
      ...transactionData,
      contractorId
    };

    const transaction = await LedgerRepository.create(payload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'LEDGER_TRANSACTION_CREATED',
      targetModel: 'Ledger',
      targetId: transaction._id,
      ipAddress,
      details: { type: transaction.type, amount: transaction.amount, category: transaction.category }
    });

    logger.info(`Ledger transaction recorded: [${transaction.type}] ${transaction.amount} by Contractor: ${contractorId}`);

    return transaction;
  }

  /**
   * Retrieves a ledger transaction by ID with security verification
   * @param {string} transactionId - Ledger transaction ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getTransactionById(transactionId, contractorId) {
    const transaction = await LedgerRepository.findByIdAndContractor(transactionId, contractorId);
    if (!transaction) {
      throw new ApiError(404, 'Ledger transaction not found or unauthorized access');
    }
    return transaction;
  }

  /**
   * Retrieves financial transactions for a contractor with optional filters
   * @param {string} contractorId - Contractor User ObjectId
   * @param {Object} [filters] - Additional filters (companyId, type, category)
   */
  async getContractorLedger(contractorId, filters = {}) {
    return await LedgerRepository.findByContractor(contractorId, filters);
  }

  /**
   * Calculates total cash balance (income minus expenses) for a contractor or company
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [companyId] - Optional company ID filter
   */
  async getBalanceSummary(contractorId, companyId = null) {
    return await LedgerRepository.calculateBalance(contractorId, companyId);
  }
}

module.exports = new LedgerService();