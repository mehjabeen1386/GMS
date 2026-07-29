// Purpose: Garment Job Order Management Controller Layer
// Path: backend/src/controllers/OrderController.js

const BaseController = require('./BaseController');
const OrderService = require('../services/OrderService');

/**
 * Controller handling garment production orders, milestone status transitions, and client job listings.
 */
class OrderController extends BaseController {
  /**
   * Registers a new production job order
   */
  createOrder = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const order = await OrderService.createOrder(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Production order created successfully', order);
  });

  /**
   * Retrieves an order by ID within contractor scope
   */
  getOrderById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const order = await OrderService.getOrderById(id, contractorId);
    return this.sendSuccess(res, 200, 'Order retrieved successfully', order);
  });

  /**
   * Retrieves paginated job orders for a contractor with optional status or company filters
   */
  getContractorOrders = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const { page, limit } = this.getPaginationParams(req);
    const filters = {
      status: req.query.status,
      companyId: req.query.companyId,
      search: req.query.search
    };
    const orders = await OrderService.getContractorOrders(contractorId, filters, page, limit);
    return this.sendSuccess(res, 200, 'Orders retrieved successfully', orders);
  });

  /**
   * Updates order production milestone status
   */
  updateOrderStatus = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const updatedOrder = await OrderService.updateOrderStatus(id, status, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Order status updated successfully', updatedOrder);
  });
}

module.exports = new OrderController();