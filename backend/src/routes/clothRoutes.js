// Purpose: Cloth / Raw Material Management Routes Layer
// Path: backend/src/routes/clothRoutes.js

const express = require('express');
const router = express.Router();
const clothController = require('../controllers/ClothController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
  createClothValidator,
  updateClothValidator,
  getClothByIdValidator
} = require('../validators/clothValidator');

// Protect all cloth routes with authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/cloths
 */
router.post(
  '/',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  createClothValidator,
  validate,
  clothController.createCloth
);

/**
 * @route   GET /api/v1/cloths
 */
router.get(
  '/',
  clothController.getAllCloths
);

/**
 * @route   GET /api/v1/cloths/:id
 */
router.get(
  '/:id',
  getClothByIdValidator,
  validate,
  clothController.getClothById
);

/**
 * @route   PUT /api/v1/cloths/:id
 */
router.put(
  '/:id',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  getClothByIdValidator,
  updateClothValidator,
  validate,
  clothController.updateCloth
);

/**
 * @route   PATCH /api/v1/cloths/:id/status
 */
router.patch(
  '/:id/status',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  getClothByIdValidator,
  validate,
  clothController.toggleClothStatus
);

/**
 * @route   DELETE /api/v1/cloths/:id
 */
router.delete(
  '/:id',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN'),
  getClothByIdValidator,
  validate,
  clothController.deleteCloth
);

module.exports = router;