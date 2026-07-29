// Purpose: General Ledger & Financial Transactions Controller Layer
// Path: backend/src/controllers/LedgerController.js

const BaseController = require('./BaseController');
const LedgerService = require('../services/LedgerService');

/**
 * Controller handling financial ledger entries, credits/debits, and balance summaries.
 */
class LedgerController extends BaseController {
  /**
   * Records a new transaction entry in the financial ledger
   */
  createLedgerEntry = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const ledgerEntry = await LedgerService.createLedgerEntry(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Ledger entry recorded successfully', ledgerEntry);
  });

  /**
   * Retrieves a ledger transaction entry by ID within contractor scope
   */
  getLedgerEntryById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const entry = await LedgerService.getLedgerEntryById(id, contractorId);
    return this.sendSuccess(res, 200, 'Ledger entry retrieved successfully', entry);
  });

  /**
   * Retrieves paginated financial ledger transactions for a contractor
   */
  getContractorLedger = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const { page, limit } = this.getPaginationParams(req);
    const filters = {
      type: req.query.type, // 'CREDIT' or 'DEBIT'
      category: req.query.category,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    const ledgerData = await LedgerService.getContractorLedger(contractorId, filters, page, limit);
    return this.sendSuccess(res, 200, 'Financial ledger records retrieved successfully', ledgerData);
  });

  /**
   * Retrieves current net balance and ledger summary for a contractor
   */
  getLedgerSummary = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const summary = await LedgerService.getLedgerSummary(contractorId);
    return this.sendSuccess(res, 200, 'Financial ledger summary retrieved successfully', summary);
  });
}

module.exports = new LedgerController();