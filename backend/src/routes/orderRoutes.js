// // Purpose: Garment Production Job Orders & Status Lifecycle Routes Layer
// // Path: backend/src/routes/orderRoutes.js

// const express = require('express');
// const router = express.Router();
// const orderController = require('../controllers/OrderController');
// const authenticate = require('../middlewares/authenticate');
// const authorize = require('../middlewares/authorize');
// const {
//   createOrderValidator,
//   updateOrderStatusValidator,
//   getOrderByIdValidator,
// } = require('../validators/orderValidator');

// // --- AUTHENTICATION TEMPORARILY BYPASSED FOR LOCAL TESTING ---
// // Uncomment this line when you want to re-enable global auth guard:
// router.use(authenticate);

// /**
//  * @route   POST /api/v1/orders
//  * @desc    Creates a new garment production job order
//  * @access  Private (Contractor / Admin / Manager)
//  */
// router.post(
//   '/',
//   // authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
//   createOrderValidator,
//   orderController.createOrder
// );

// /**
//  * @route   GET /api/v1/orders
//  * @desc    Retrieves paginated job orders under contractor scope
//  * @access  Private (Contractor / Admin / Manager)
//  */
// router.get(
//   '/',
//   // authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
//   orderController.getContractorOrders
// );

// /**
//  * @route   GET /api/v1/orders/:id
//  * @desc    Retrieves job order details by ID
//  * @access  Private (Contractor / Admin / Manager)
//  */
// router.get(
//   '/:id',
//   // authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
//   getOrderByIdValidator,
//   orderController.getOrderById
// );

// /**
//  * @route   PATCH /api/v1/orders/:id/status
//  * @desc    Updates job order lifecycle status (e.g., IN_PROGRESS, COMPLETED)
//  * @access  Private (Contractor / Admin / Manager)
//  */
// router.patch(
//   '/:id/status',
//   // authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
//   getOrderByIdValidator,
//   updateOrderStatusValidator,
//   orderController.updateOrderStatus
// );

// module.exports = router;

// Purpose: Garment Production Job Orders & Status Lifecycle Routes Layer
// Path: backend/src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const {
  createOrderValidator,
  updateOrderStatusValidator,
  getOrderByIdValidator,
} = require('../validators/orderValidator');

// --- AUTHENTICATION TEMPORARILY BYPASSED FOR LOCAL TESTING ---
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
 * @desc    Retrieves paginated job orders under contractor scope
 * @access  Private (Contractor / Admin / Manager)
 */
router.get(
  '/',
  orderController.getContractorOrders
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
 * @desc    Updates job order details (including operations progress array)
 * @access  Private (Contractor / Admin / Manager)
 */
router.patch(
  '/:id',
  getOrderByIdValidator,
  orderController.updateOrder // Ensure your OrderController has an updateOrder or update method
);

/**
 * @route   PATCH /api/v1/orders/:id/status
 * @desc    Updates job order lifecycle status (e.g., IN_PROGRESS, COMPLETED)
 * @access  Private (Contractor / Admin / Manager)
 */
router.patch(
  '/:id/status',
  getOrderByIdValidator,
  updateOrderStatusValidator,
  orderController.updateOrderStatus
);

module.exports = router;