// Purpose: Garment Job Order Business Logic Service Layer
// Path: backend/src/services/orderService.js

const OrderRepository = require('../repositories/OrderRepository');
const CompanyRepository = require('../repositories/CompanyRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');

// State machine for allowed status transitions
const ALLOWED_TRANSITIONS = {
  PENDING: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: []
};

class OrderService {
  async createOrder(orderData, contractorId, ipAddress = '') {
    const existingOrder = await OrderRepository.findByOrderNumber(orderData.orderNumber, contractorId);
    if (existingOrder) {
      throw new Error('Job order with this order number already exists');
    }

    const company = await CompanyRepository.findByIdAndContractor(orderData.companyId, contractorId);
    if (!company) {
      throw new Error('Associated company not found or unauthorized access');
    }

    const payload = {
      ...orderData,
      contractorId
    };

    const order = await OrderRepository.create(payload);

    if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
      await AuditLogRepository.logEvent({
        actorId: contractorId,
        action: 'ORDER_CREATED',
        targetModel: 'Order',
        targetId: order._id,
        ipAddress,
        details: { orderNumber: order.orderNumber, garmentType: order.garmentType, quantity: order.quantity }
      });
    }

    return order;
  }

  async getOrderById(orderId, contractorId) {
    const order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    if (!order) {
      throw new Error('Job order not found or unauthorized access');
    }
    return order;
  }

  async getContractorOrders(contractorId, filters = {}) {
    return await OrderRepository.findByContractor(contractorId, filters);
  }

  async updateOrderStatus(orderId, newStatus, contractorId, ipAddress = '') {
    const order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    if (!order) {
      throw new Error('Job order not found or unauthorized access');
    }

    const currentStatus = order.status || 'PENDING';
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Invalid order status transition from ${currentStatus} to ${newStatus}`);
    }

    const updatedOrder = await OrderRepository.updateStatus(orderId, newStatus, contractorId);

    if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
      await AuditLogRepository.logEvent({
        actorId: contractorId,
        action: 'ORDER_STATUS_UPDATED',
        targetModel: 'Order',
        targetId: orderId,
        ipAddress,
        details: { orderNumber: order.orderNumber, previousStatus: currentStatus, newStatus }
      });
    }

    return updatedOrder;
  }
}

module.exports = new OrderService();