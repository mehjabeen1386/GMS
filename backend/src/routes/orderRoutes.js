// Purpose: Garment Production Job Orders & Status Lifecycle Routes Layer
// Path: backend/src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();

const orderController = require('../controllers/OrderController');
const authenticate = require('../middlewares/authenticate');

const {
  createOrderValidator,
  updateOrderStatusValidator,
  getOrderByIdValidator,
} = require('../validators/orderValidator');

// --- AUTHENTICATION ---
// Authentication is applied to all order routes.
router.use(authenticate);

/**
 * @route   POST /api/v1/orders
 * @desc    Creates a new garment production job order
 * @access  Private (Contractor / Admin / Manager)
 */
router.post(
  '/',
  createOrderValidator,
  orderController.createOrder
);

/**
 * @route   GET /api/v1/orders
 * @desc    Retrieves paginated active job orders under contractor scope
 * @access  Private (Contractor / Admin / Manager)
 */
router.get(
  '/',
  orderController.getContractorOrders
);

/**
 * @route   GET /api/v1/orders/trash
 * @desc    Retrieves soft-deleted job orders
 * @access  Private (Contractor / Admin / Manager)
 *
 * IMPORTANT:
 * This route must come BEFORE /:id.
 * Otherwise "trash" may be treated as an order ID.
 */
router.get(
  '/trash',
  orderController.getTrashedOrders
);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Retrieves job order details by ID
 * @access  Private (Contractor / Admin / Manager)
 */
router.get(
  '/:id',
  getOrderByIdValidator,
  orderController.getOrderById
);

/**
 * @route   PATCH /api/v1/orders/:id
 * @desc    Updates job order details
 * @access  Private (Contractor / Admin / Manager)
 */
router.patch(
  '/:id',
  getOrderByIdValidator,
  orderController.updateOrder
);

/**
 * @route   PATCH /api/v1/orders/:id/status
 * @desc    Updates job order lifecycle status
 * @access  Private (Contractor / Admin / Manager)
 */
router.patch(
  '/:id/status',
  getOrderByIdValidator,
  updateOrderStatusValidator,
  orderController.updateOrderStatus
);

/**
 * @route   PATCH /api/v1/orders/:id/soft-delete
 * @desc    Soft deletes an order (moves it to trash)
 * @access  Private (Contractor / Admin / Manager)
 */
router.patch(
  '/:id/soft-delete',
  getOrderByIdValidator,
  orderController.softDeleteOrder
);

/**
 * @route   PATCH /api/v1/orders/:id/restore
 * @desc    Restores a soft-deleted order within the 3-month window
 * @access  Private (Contractor / Admin / Manager)
 */
router.patch(
  '/:id/restore',
  getOrderByIdValidator,
  orderController.restoreOrder
);

module.exports = router;

