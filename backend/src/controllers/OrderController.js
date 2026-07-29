// Purpose: Garment Production Job Orders Controller Layer
// Path: backend/src/controllers/OrderController.js

const BaseController = require('./BaseController');
const OrderService = require('../services/OrderService');

/**
 * Controller handling garment production job order management and lifecycle updates
 */
class OrderController extends BaseController {
  /**
   * Creates a new garment production job order
   */
  createOrder = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const order = await OrderService.createOrder(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Job order created successfully', order);
  });

  /**
   * Retrieves paginated job orders under contractor scope
   */
  getContractorOrders = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const { page, limit } = this.getPaginationParams(req);
    const orders = await OrderService.getContractorOrders(contractorId, page, limit);
    return this.sendSuccess(res, 200, 'Job orders retrieved successfully', orders);
  });

  /**
   * Retrieves job order details by ID
   */
  getOrderById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const order = await OrderService.getOrderById(id, contractorId);
    return this.sendSuccess(res, 200, 'Job order retrieved successfully', order);
  });

  /**
   * Updates job order lifecycle status
   */
  updateOrderStatus = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const updatedOrder = await OrderService.updateOrderStatus(id, status, contractorId, ipAddress);
    return this.sendSuccess(res, 200, `Job order status updated to ${status}`, updatedOrder);
  });
}

module.exports = new OrderController();