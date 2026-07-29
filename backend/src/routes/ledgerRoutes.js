// Purpose: Financial Ledger & Double-Entry Accounting Routes Layer
// Path: backend/src/routes/ledgerRoutes.js
const express = require('express'); const router = express.Router();
const ledgerController = require('../controllers/LedgerController'); const authenticate = require('../middlewares/authenticate'); const authorize = require('../middlewares/authorize');
const {
  createLedgerEntryValidator,   getLedgerByIdValidator } = require('../validators/ledgerValidator');
// Protect all financial ledger routes with JWT authentication router.use(authenticate);
/**
*	@route   POST /api/v1/ledger
*	@desc    Logs a manual financial debit or credit transaction in contractor ledger
*	@access  Private (Contractor / Admin)
 */ router.post(
  '/',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  createLedgerEntryValidator,   ledgerController.createLedgerEntry );
/**
*	@route   GET /api/v1/ledger
*	@desc    Retrieves paginated ledger transactions under contractor scope
*	@access  Private (Contractor / Admin)
 */ router.get(
  '/',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  ledgerController.getContractorLedger );
/**
*	@route   GET /api/v1/ledger/balance
*	@desc    Retrieves current contractor ledger total debits, total credits, and net balance
*	@access  Private (Contractor / Admin)
 */ router.get(   '/balance',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  ledgerController.getContractorBalance );
/**
*	@route   GET /api/v1/ledger/:id
*	@desc    Retrieves details for a specific ledger transaction entry by ID
*	@access  Private (Contractor / Admin)
 */ router.get(   '/:id',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  getLedgerByIdValidator,   ledgerController.getLedgerById ); module.exports = router;
