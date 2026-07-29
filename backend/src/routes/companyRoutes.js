// Purpose: Manufacturing Company Tenant Routes Layer
// Path: backend/src/routes/companyRoutes.js

const express = require('express');
const router = express.Router();
const companyController = require('../controllers/CompanyController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
  createCompanyValidator,
  updateCompanyValidator,
  getCompanyByIdValidator
} = require('../validators/companyValidator');

// Protect all company routes with authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/companies
 * @desc    Registers a new company profile
 * @access  Private
 */
router.post(
  '/',
  createCompanyValidator,
  validate,
  companyController.createCompany
);

/**
 * @route   GET /api/v1/companies/profile
 * @desc    Retrieves profile for authenticated user's company
 * @access  Private
 */
router.get(
  '/profile',
  companyController.getCompanyProfile
);

/**
 * @route   GET /api/v1/companies
 * @desc    Retrieves all companies (Super Admin / Admin only)
 * @access  Private (Super Admin / Admin)
 */
router.get(
  '/',
  authorize('SUPER_ADMIN', 'ADMIN'),
  companyController.getAllCompanies
);

/**
 * @route   GET /api/v1/companies/:id
 * @desc    Retrieves company profile details by ID
 * @access  Private
 */
router.get(
  '/:id',
  getCompanyByIdValidator,
  validate,
  companyController.getCompanyById
);

/**
 * @route   PUT /api/v1/companies/:id
 * @desc    Updates company profile details
 * @access  Private
 */
router.put(
  '/:id',
  updateCompanyValidator,
  validate,
  companyController.updateCompanyProfile
);

module.exports = router;