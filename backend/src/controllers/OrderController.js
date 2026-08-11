// // Purpose: Garment Production Job Orders Controller Layer
// // Path: backend/src/controllers/OrderController.js

// const BaseController = require('./BaseController');
// const OrderService = require('../services/OrderService');

// // Fallback mock contractor ID for local testing when auth middleware is bypassed
// const MOCK_CONTRACTOR_ID = '650000000000000000000001';

// /**
//  * Controller handling garment production job order management and lifecycle updates
//  */
// class OrderController extends BaseController {
//   /**
//    * Creates a new garment production job order
//    */
//   createOrder = this.catchAsync(async (req, res) => {
//     const contractorId = req.user?._id || req.user?.id || MOCK_CONTRACTOR_ID;
//     const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
//     const order = await OrderService.createOrder(req.body, contractorId, ipAddress);
//     return this.sendSuccess(res, 201, 'Job order created successfully', order);
//   });

//   /**
//    * Retrieves paginated job orders under contractor scope
//    */
//   getContractorOrders = this.catchAsync(async (req, res) => {
//     const contractorId = req.user?._id || req.user?.id || MOCK_CONTRACTOR_ID;
//     const { page, limit } = this.getPaginationParams(req);
//     const orders = await OrderService.getContractorOrders(contractorId, page, limit);
//     return this.sendSuccess(res, 200, 'Job orders retrieved successfully', orders);
//   });

//   /**
//    * Retrieves job order details by ID
//    */
//   getOrderById = this.catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const contractorId = req.user?._id || req.user?.id || MOCK_CONTRACTOR_ID;
//     const order = await OrderService.getOrderById(id, contractorId);
//     return this.sendSuccess(res, 200, 'Job order retrieved successfully', order);
//   });

//   /**
//    * Updates job order lifecycle status
//    */
//   updateOrderStatus = this.catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const { status } = req.body;
//     const contractorId = req.user?._id || req.user?.id || MOCK_CONTRACTOR_ID;
//     const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
//     const updatedOrder = await OrderService.updateOrderStatus(id, status, contractorId, ipAddress);
//     return this.sendSuccess(res, 200, `Job order status updated to ${status}`, updatedOrder);
//   });
// }

// module.exports = new OrderController();

// Purpose: Garment Production Job Orders Controller Layer
// Path: backend/src/controllers/OrderController.js

const BaseController = require('./BaseController');
const OrderService = require('../services/OrderService');

// Fallback mock contractor ID for local testing when auth middleware is bypassed
const MOCK_CONTRACTOR_ID = '650000000000000000000001';

/**
 * Controller handling garment production job order management and lifecycle updates
 */
class OrderController extends BaseController {
  /**
   * Creates a new garment production job order
   */
  createOrder = this.catchAsync(async (req, res) => {
    const contractorId = req.user?._id || req.user?.id || MOCK_CONTRACTOR_ID;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const order = await OrderService.createOrder(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Job order created successfully', order);
  });

  /**
   * Retrieves paginated job orders under contractor scope
   */
  getContractorOrders = this.catchAsync(async (req, res) => {
    const contractorId = req.user?._id || req.user?.id || MOCK_CONTRACTOR_ID;
    const { page, limit } = this.getPaginationParams(req);
    const orders = await OrderService.getContractorOrders(contractorId, page, limit);
    return this.sendSuccess(res, 200, 'Job orders retrieved successfully', orders);
  });

  /**
   * Retrieves job order details by ID
   */
  getOrderById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user?._id || req.user?.id || MOCK_CONTRACTOR_ID;
    const order = await OrderService.getOrderById(id, contractorId);
    return this.sendSuccess(res, 200, 'Job order retrieved successfully', order);
  });

  /**
   * Updates job order details (including operations progress array)
   */
  updateOrder = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user?._id || req.user?.id || MOCK_CONTRACTOR_ID;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    
    // Delegates the update payload (such as operations progress) to your service layer
    const updatedOrder = await OrderService.updateOrder(id, req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Job order updated successfully', updatedOrder);
  });

  /**
   * Updates job order lifecycle status
   */
  updateOrderStatus = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const contractorId = req.user?._id || req.user?.id || MOCK_CONTRACTOR_ID;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const updatedOrder = await OrderService.updateOrderStatus(id, status, contractorId, ipAddress);
    return this.sendSuccess(res, 200, `Job order status updated to ${status}`, updatedOrder);
  });
}

module.exports = new OrderController();