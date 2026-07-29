// Purpose: Financial Ledger & Double-Entry Accounting Controller Layer
// Path: backend/src/controllers/LedgerController.js

const BaseController = require('./BaseController');
const LedgerService = require('../services/LedgerService');

/**
 * Controller handling financial transactions, contractor balances, and audit logging
 */
class LedgerController extends BaseController {
  /**
   * Logs a manual financial debit or credit transaction in contractor ledger
   */
  createLedgerEntry = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const entry = await LedgerService.createLedgerEntry(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Ledger entry recorded successfully', entry);
  });

  /**
   * Retrieves paginated ledger transactions under contractor scope
   */
  getContractorLedger = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const { page, limit } = this.getPaginationParams(req);
    const ledgerData = await LedgerService.getContractorLedger(contractorId, page, limit);
    return this.sendSuccess(res, 200, 'Ledger transactions retrieved successfully', ledgerData);
  });

  /**
   * Retrieves current contractor ledger total debits, total credits, and net balance
   */
  getContractorBalance = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const balance = await LedgerService.getContractorBalance(contractorId);
    return this.sendSuccess(res, 200, 'Contractor balance retrieved successfully', balance);
  });

  /**
   * Retrieves details for a specific ledger transaction entry by ID
   */
  getLedgerById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const entry = await LedgerService.getLedgerById(id, contractorId);
    return this.sendSuccess(res, 200, 'Ledger entry details retrieved successfully', entry);
  });
}

module.exports = new LedgerController();