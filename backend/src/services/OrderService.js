// Purpose: Garment Job Order Business Logic Service Layer
// Path: backend/src/services/OrderService.js

const OrderRepository = require('../repositories/OrderRepository');
const CompanyRepository = require('../repositories/CompanyRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for garment job order management and production scheduling.
 */
class OrderService {
  /**
   * Creates a new garment manufacturing job order
   * @param {Object} orderData - Job order payload
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async createOrder(orderData, contractorId, ipAddress = '') {
    // Verify unique order number under contractor
    const existingOrder = await OrderRepository.findByOrderNumber(orderData.orderNumber, contractorId);
    if (existingOrder) {
      throw new ApiError(409, 'Job order with this order number already exists');
    }

    // Verify company tenant existence and ownership
    const company = await CompanyRepository.findByIdAndContractor(orderData.companyId, contractorId);
    if (!company) {
      throw new ApiError(404, 'Associated company not found or unauthorized access');
    }

    const payload = {
      ...orderData,
      contractorId
    };

    const order = await OrderRepository.create(payload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'ORDER_CREATED',
      targetModel: 'Order',
      targetId: order._id,
      ipAddress,
      details: { orderNumber: order.orderNumber, garmentType: order.garmentType, quantity: order.quantity }
    });

    logger.info(`Job order created: ${order.orderNumber} [${order._id}] for Company: ${orderData.companyId}`);

    return order;
  }

  /**
   * Retrieves a job order by ID with security verification
   * @param {string} orderId - Order ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getOrderById(orderId, contractorId) {
    const order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    if (!order) {
      throw new ApiError(404, 'Job order not found or unauthorized access');
    }
    return order;
  }

  /**
   * Retrieves all job orders for a contractor with optional filters
   * @param {string} contractorId - Contractor User ObjectId
   * @param {Object} [filters] - Additional filters (companyId, status)
   */
  async getContractorOrders(contractorId, filters = {}) {
    return await OrderRepository.findByContractor(contractorId, filters);
  }

  /**
   * Updates production order status and milestone progress
   * @param {string} orderId - Order ObjectId
   * @param {string} status - New order status ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async updateOrderStatus(orderId, status, contractorId, ipAddress = '') {
    const order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    if (!order) {
      throw new ApiError(404, 'Job order not found or unauthorized access');
    }

    const updatedOrder = await OrderRepository.updateStatus(orderId, status);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'ORDER_STATUS_UPDATED',
      targetModel: 'Order',
      targetId: orderId,
      ipAddress,
      details: { orderNumber: order.orderNumber, previousStatus: order.status, newStatus: status }
    });

    logger.info(`Job order status updated: ${order.orderNumber} -> ${status}`);

    return updatedOrder;
  }
}

module.exports = new OrderService();