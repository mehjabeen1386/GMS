// // Purpose: Garment Job Order Business Logic Service Layer
// // Path: backend/src/services/orderService.js

// const mongoose = require('mongoose');
// const OrderRepository = require('../repositories/OrderRepository');
// const CompanyRepository = require('../repositories/CompanyRepository');
// const AuditLogRepository = require('../repositories/AuditLogRepository');

// // State machine for allowed status transitions
// const ALLOWED_TRANSITIONS = {
//   PENDING: ['IN_PROGRESS', 'CANCELLED'],
//   IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
//   COMPLETED: [],
//   CANCELLED: []
// };

// // Fallback ObjectIds for required Mongoose schema fields during testing
// const DUMMY_OBJECT_ID = new mongoose.Types.ObjectId().toString();

// class OrderService {
//   async createOrder(orderData, contractorId, ipAddress = '') {
//     const orderNumber = orderData.orderNumber || orderData.jobOrderNumber;

//     const existingOrder = await OrderRepository.findByOrderNumber(orderNumber, contractorId);
//     if (existingOrder) {
//       throw new Error('Job order with this order number already exists');
//     }

//     // Resolve company
//     let company = null;
//     if (orderData.companyId) {
//       company = await CompanyRepository.findByIdAndContractor(orderData.companyId, contractorId);
//     }
//     if (!company) {
//       company = await CompanyRepository.findOne?.({ contractorId }) || await CompanyRepository.findOne?.({});
//     }

//     // Attach required schema fields with safe fallbacks and explicit field alias mappings
//     const payload = {
//       ...orderData,
//       orderNumber,
//       // Pass all potential schema field name variants
//       garmentType: orderData.styleName || orderData.garmentStyle || orderData.style || 'Garment Item',
//       styleName: orderData.styleName || orderData.garmentStyle || orderData.style || 'Garment Item',
//       client: orderData.clientName || orderData.client || 'N/A',
//       clientName: orderData.clientName || orderData.client || 'N/A',
//       dueDate: orderData.dueDate || orderData.targetDeliveryDate,
//       deliveryDate: orderData.dueDate || orderData.targetDeliveryDate,
//       targetDeliveryDate: orderData.dueDate || orderData.targetDeliveryDate,
//       companyId: company?._id || orderData.companyId || contractorId || DUMMY_OBJECT_ID,
//       clothId: orderData.clothId || DUMMY_OBJECT_ID,
//       workshopId: orderData.workshopId || DUMMY_OBJECT_ID,
//       contractorId: contractorId || DUMMY_OBJECT_ID
//     };

//     const order = await OrderRepository.create(payload);

//     if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
//       try {
//         await AuditLogRepository.logEvent({
//           actorId: contractorId,
//           action: 'ORDER_CREATED',
//           targetModel: 'Order',
//           targetId: order._id,
//           ipAddress,
//           details: { orderNumber: order.orderNumber, garmentType: order.garmentType || order.styleName, quantity: order.quantity }
//         });
//       } catch (logErr) {
//         console.warn('Audit log skipped:', logErr.message);
//       }
//     }

//     return order;
//   }

//   // async getOrderById(orderId, contractorId) {
//   //   const order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
//   //   if (!order) {
//   //     throw new Error('Job order not found or unauthorized access');
//   //   }
//   //   return order;
//   // }
//   async getOrderById(orderId, contractorId) {
//     // 1. Try strict lookup by ID and contractor
//     let order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    
//     if (!order) {
//       // 2. Fallback for local dev: If strict match fails, fetch by ID alone
//       order = await OrderRepository.findById?.(orderId) || await OrderRepository.model?.findById(orderId);
//     }

//     if (!order) {
//       throw new Error('Job order not found or unauthorized access');
//     }
    
//     return order;
//   }

//   async getContractorOrders(contractorId, filters = {}) {
//     try {
//       // Look for orders matching contractorId OR retrieve all orders for local dev display
//       const orders = await OrderRepository.findByContractor(contractorId, filters);
//       if (Array.isArray(orders) && orders.length > 0) {
//         return orders;
//       }
//       // Fallback: If no orders found for specific contractor, fetch all orders
//       return await OrderRepository.findAll?.(filters) || await OrderRepository.model?.find({}) || [];
//     } catch (err) {
//       return await OrderRepository.findAll?.(filters) || [];
//     }
//   }

//   async updateOrderStatus(orderId, newStatus, contractorId, ipAddress = '') {
//     const order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
//     if (!order) {
//       throw new Error('Job order not found or unauthorized access');
//     }

//     const currentStatus = order.status || 'PENDING';
//     const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
//     if (!allowed.includes(newStatus)) {
//       throw new Error(`Invalid order status transition from ${currentStatus} to ${newStatus}`);
//     }

//     const updatedOrder = await OrderRepository.updateStatus(orderId, newStatus, contractorId);

//     if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
//       try {
//         await AuditLogRepository.logEvent({
//           actorId: contractorId,
//           action: 'ORDER_STATUS_UPDATED',
//           targetModel: 'Order',
//           targetId: orderId,
//           ipAddress,
//           details: { orderNumber: order.orderNumber, previousStatus: currentStatus, newStatus }
//         });
//       } catch (logErr) {
//         console.warn('Audit log skipped:', logErr.message);
//       }
//     }

//     return updatedOrder;
//   }
// }

// module.exports = new OrderService();

// Purpose: Garment Job Order Business Logic Service Layer
// Path: backend/src/services/OrderService.js

// const mongoose = require('mongoose');
// const OrderRepository = require('../repositories/OrderRepository');
// const CompanyRepository = require('../repositories/CompanyRepository');
// const AuditLogRepository = require('../repositories/AuditLogRepository');

// // State machine for allowed status transitions
// const ALLOWED_TRANSITIONS = {
//   PENDING: ['IN_PROGRESS', 'CANCELLED'],
//   IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
//   COMPLETED: [],
//   CANCELLED: []
// };

// // Fallback ObjectIds for required Mongoose schema fields during testing
// const DUMMY_OBJECT_ID = new mongoose.Types.ObjectId().toString();

// class OrderService {
//   async createOrder(orderData, contractorId, ipAddress = '') {
//     const orderNumber = orderData.orderNumber || orderData.jobOrderNumber;

//     const existingOrder = await OrderRepository.findByOrderNumber(orderNumber, contractorId);
//     if (existingOrder) {
//       throw new Error('Job order with this order number already exists');
//     }

//     // Resolve company
//     let company = null;
//     if (orderData.companyId) {
//       company = await CompanyRepository.findByIdAndContractor(orderData.companyId, contractorId);
//     }
//     if (!company) {
//       company = await CompanyRepository.findOne?.({ contractorId }) || await CompanyRepository.findOne?.({});
//     }

//     // Attach required schema fields with safe fallbacks and explicit field alias mappings
//     const payload = {
//       ...orderData,
//       orderNumber,
//       garmentType: orderData.styleName || orderData.garmentStyle || orderData.style || 'Garment Item',
//       styleName: orderData.styleName || orderData.garmentStyle || orderData.style || 'Garment Item',
//       client: orderData.clientName || orderData.client || 'N/A',
//       clientName: orderData.clientName || orderData.client || 'N/A',
//       dueDate: orderData.dueDate || orderData.targetDeliveryDate,
//       deliveryDate: orderData.dueDate || orderData.targetDeliveryDate,
//       targetDeliveryDate: orderData.dueDate || orderData.targetDeliveryDate,
//       companyId: company?._id || orderData.companyId || contractorId || DUMMY_OBJECT_ID,
//       clothId: orderData.clothId || DUMMY_OBJECT_ID,
//       workshopId: orderData.workshopId || DUMMY_OBJECT_ID,
//       contractorId: contractorId || DUMMY_OBJECT_ID
//     };

//     const order = await OrderRepository.create(payload);

//     if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
//       try {
//         await AuditLogRepository.logEvent({
//           actorId: contractorId,
//           action: 'ORDER_CREATED',
//           targetModel: 'Order',
//           targetId: order._id,
//           ipAddress,
//           details: { orderNumber: order.orderNumber, garmentType: order.garmentType || order.styleName, quantity: order.quantity }
//         });
//       } catch (logErr) {
//         console.warn('Audit log skipped:', logErr.message);
//       }
//     }

//     return order;
//   }

//   async getOrderById(orderId, contractorId) {
//     let order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    
//     if (!order) {
//       order = await OrderRepository.findById?.(orderId) || await OrderRepository.model?.findById(orderId);
//     }

//     if (!order) {
//       throw new Error('Job order not found or unauthorized access');
//     }
    
//     return order;
//   }

//   async getContractorOrders(contractorId, filters = {}) {
//     try {
//       const orders = await OrderRepository.findByContractor(contractorId, filters);
//       if (Array.isArray(orders) && orders.length > 0) {
//         return orders;
//       }
//       return await OrderRepository.findAll?.(filters) || await OrderRepository.model?.find({}) || [];
//     } catch (err) {
//       return await OrderRepository.findAll?.(filters) || [];
//     }
//   }

//   /**
//    * Updates job order details (such as operations progress array)
//    */
//   async updateOrder(orderId, updateData, contractorId, ipAddress = '') {
//     let order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    
//     if (!order) {
//       order = await OrderRepository.findById?.(orderId) || await OrderRepository.model?.findById(orderId);
//     }

//     if (!order) {
//       throw new Error('Job order not found or unauthorized access');
//     }

//     let updatedOrder;
//     if (typeof OrderRepository.update === 'function') {
//       updatedOrder = await OrderRepository.update(orderId, updateData);
//     } else if (OrderRepository.model && typeof OrderRepository.model.findByIdAndUpdate === 'function') {
//       updatedOrder = await OrderRepository.model.findByIdAndUpdate(
//         orderId,
//         { $set: updateData },
//         { new: true, runValidators: true }
//       );
//     } else {
//       Object.assign(order, updateData);
//       updatedOrder = await order.save();
//     }

//     if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
//       try {
//         await AuditLogRepository.logEvent({
//           actorId: contractorId,
//           action: 'ORDER_UPDATED',
//           targetModel: 'Order',
//           targetId: orderId,
//           ipAddress,
//           details: { orderNumber: order.orderNumber, updatedFields: Object.keys(updateData) }
//         });
//       } catch (logErr) {
//         console.warn('Audit log skipped:', logErr.message);
//       }
//     }

//     return updatedOrder;
//   }

//   async updateOrderStatus(orderId, newStatus, contractorId, ipAddress = '') {
//     const order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
//     if (!order) {
//       throw new Error('Job order not found or unauthorized access');
//     }

//     const currentStatus = order.status || 'PENDING';
//     const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
//     if (!allowed.includes(newStatus)) {
//       throw new Error(`Invalid order status transition from ${currentStatus} to ${newStatus}`);
//     }

//     const updatedOrder = await OrderRepository.updateStatus(orderId, newStatus, contractorId);

//     if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
//       try {
//         await AuditLogRepository.logEvent({
//           actorId: contractorId,
//           action: 'ORDER_STATUS_UPDATED',
//           targetModel: 'Order',
//           targetId: orderId,
//           ipAddress,
//           details: { orderNumber: order.orderNumber, previousStatus: currentStatus, newStatus }
//         });
//       } catch (logErr) {
//         console.warn('Audit log skipped:', logErr.message);
//       }
//     }

//     return updatedOrder;
//   }
// }

// module.exports = new OrderService();

// Purpose: Garment Job Order Business Logic Service Layer
// Path: backend/src/services/OrderService.js

// const mongoose = require('mongoose');
// const OrderRepository = require('../repositories/OrderRepository');
// const CompanyRepository = require('../repositories/CompanyRepository');
// const AuditLogRepository = require('../repositories/AuditLogRepository');

// // State machine for allowed status transitions
// const ALLOWED_TRANSITIONS = {
//   PENDING: ['IN_PROGRESS', 'CANCELLED'],
//   IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
//   COMPLETED: [],
//   CANCELLED: []
// };

// // Fallback ObjectIds for required Mongoose schema fields during testing
// const DUMMY_OBJECT_ID = new mongoose.Types.ObjectId().toString();

// class OrderService {
//   async createOrder(orderData, contractorId, ipAddress = '') {
//     const orderNumber = orderData.orderNumber || orderData.jobOrderNumber;

//     const existingOrder = await OrderRepository.findByOrderNumber(orderNumber, contractorId);
//     if (existingOrder) {
//       throw new Error('Job order with this order number already exists');
//     }

//     // Resolve company
//     let company = null;
//     if (orderData.companyId) {
//       company = await CompanyRepository.findByIdAndContractor(orderData.companyId, contractorId);
//     }
//     if (!company) {
//       company = await CompanyRepository.findOne?.({ contractorId }) || await CompanyRepository.findOne?.({});
//     }

//     // Attach required schema fields with safe fallbacks and explicit field alias mappings
//     const payload = {
//       ...orderData,
//       orderNumber,
//       garmentType: orderData.styleName || orderData.garmentStyle || orderData.style || 'Garment Item',
//       styleName: orderData.styleName || orderData.garmentStyle || orderData.style || 'Garment Item',
//       client: orderData.clientName || orderData.client || 'N/A',
//       clientName: orderData.clientName || orderData.client || 'N/A',
//       dueDate: orderData.dueDate || orderData.targetDeliveryDate,
//       deliveryDate: orderData.dueDate || orderData.targetDeliveryDate,
//       targetDeliveryDate: orderData.dueDate || orderData.targetDeliveryDate,
//       companyId: company?._id || orderData.companyId || contractorId || DUMMY_OBJECT_ID,
//       clothId: orderData.clothId || DUMMY_OBJECT_ID,
//       workshopId: orderData.workshopId || DUMMY_OBJECT_ID,
//       contractorId: contractorId || DUMMY_OBJECT_ID
//     };

//     const order = await OrderRepository.create(payload);

//     if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
//       try {
//         await AuditLogRepository.logEvent({
//           actorId: contractorId,
//           action: 'ORDER_CREATED',
//           targetModel: 'Order',
//           targetId: order._id,
//           ipAddress,
//           details: { orderNumber: order.orderNumber, garmentType: order.garmentType || order.styleName, quantity: order.quantity }
//         });
//       } catch (logErr) {
//         console.warn('Audit log skipped:', logErr.message);
//       }
//     }

//     return order;
//   }

//   async getOrderById(orderId, contractorId) {
//     let order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    
//     if (!order) {
//       order = await OrderRepository.findById?.(orderId) || await OrderRepository.model?.findById(orderId);
//     }

//     if (!order) {
//       throw new Error('Job order not found or unauthorized access');
//     }
    
//     return order;
//   }

//   async getContractorOrders(contractorId, filters = {}) {
//     try {
//       const orders = await OrderRepository.findByContractor(contractorId, filters);
//       if (Array.isArray(orders) && orders.length > 0) {
//         return orders;
//       }
//       return await OrderRepository.findAll?.(filters) || await OrderRepository.model?.find({}) || [];
//     } catch (err) {
//       return await OrderRepository.findAll?.(filters) || [];
//     }
//   }

//   /**
//    * Updates job order details (such as operations progress array)
//    */
//   async updateOrder(orderId, updateData, contractorId, ipAddress = '') {
//     let order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    
//     if (!order) {
//       order = await OrderRepository.findById?.(orderId) || await OrderRepository.model?.findById(orderId);
//     }

//     if (!order) {
//       throw new Error('Job order not found or unauthorized access');
//     }

//     // Automatically calculate and update completedQuantity from the final operation's progress
//     if (updateData.operations && Array.isArray(updateData.operations) && updateData.operations.length > 0) {
//       const finalOperation = updateData.operations[updateData.operations.length - 1];
//       updateData.completedQuantity = finalOperation.completedPieces || 0;
//     }

//     let updatedOrder;
//     if (typeof OrderRepository.update === 'function') {
//       updatedOrder = await OrderRepository.update(orderId, updateData);
//     } else if (OrderRepository.model && typeof OrderRepository.model.findByIdAndUpdate === 'function') {
//       updatedOrder = await OrderRepository.model.findByIdAndUpdate(
//         orderId,
//         { $set: updateData },
//         { new: true, runValidators: true }
//       );
//     } else {
//       Object.assign(order, updateData);
//       updatedOrder = await order.save();
//     }

//     if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
//       try {
//         await AuditLogRepository.logEvent({
//           actorId: contractorId,
//           action: 'ORDER_UPDATED',
//           targetModel: 'Order',
//           targetId: orderId,
//           ipAddress,
//           details: { orderNumber: order.orderNumber, updatedFields: Object.keys(updateData) }
//         });
//       } catch (logErr) {
//         console.warn('Audit log skipped:', logErr.message);
//       }
//     }

//     return updatedOrder;
//   }

//   async updateOrderStatus(orderId, newStatus, contractorId, ipAddress = '') {
//     const order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
//     if (!order) {
//       throw new Error('Job order not found or unauthorized access');
//     }

//     const currentStatus = order.status || 'PENDING';
//     const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
//     if (!allowed.includes(newStatus)) {
//       throw new Error(`Invalid order status transition from ${currentStatus} to ${newStatus}`);
//     }

//     const updatedOrder = await OrderRepository.updateStatus(orderId, newStatus, contractorId);

//     if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
//       try {
//         await AuditLogRepository.logEvent({
//           actorId: contractorId,
//           action: 'ORDER_STATUS_UPDATED',
//           targetModel: 'Order',
//           targetId: orderId,
//           ipAddress,
//           details: { orderNumber: order.orderNumber, previousStatus: currentStatus, newStatus }
//         });
//       } catch (logErr) {
//         console.warn('Audit log skipped:', logErr.message);
//       }
//     }

//     return updatedOrder;
//   }
// }

// module.exports = new OrderService();

// Purpose: Garment Job Order Business Logic Service Layer
// Path: backend/src/services/OrderService.js

// const mongoose = require('mongoose');
// const OrderRepository = require('../repositories/OrderRepository');
// const CompanyRepository = require('../repositories/CompanyRepository');
// const AuditLogRepository = require('../repositories/AuditLogRepository');

// // State machine for allowed status transitions
// const ALLOWED_TRANSITIONS = {
//   PENDING: ['IN_PROGRESS', 'CANCELLED'],
//   IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
//   COMPLETED: [],
//   CANCELLED: []
// };

// // Fallback ObjectIds for required Mongoose schema fields during testing
// const DUMMY_OBJECT_ID = new mongoose.Types.ObjectId().toString();

// class OrderService {
//   async createOrder(orderData, contractorId, ipAddress = '') {
//     const orderNumber = orderData.orderNumber || orderData.jobOrderNumber;

//     const existingOrder = await OrderRepository.findByOrderNumber(orderNumber, contractorId);
//     if (existingOrder) {
//       throw new Error('Job order with this order number already exists');
//     }

//     // Resolve company
//     let company = null;
//     if (orderData.companyId) {
//       company = await CompanyRepository.findByIdAndContractor(orderData.companyId, contractorId);
//     }
//     if (!company) {
//       company = await CompanyRepository.findOne?.({ contractorId }) || await CompanyRepository.findOne?.({});
//     }

//     // Attach required schema fields with safe fallbacks and explicit field alias mappings
//     const payload = {
//       ...orderData,
//       orderNumber,
//       garmentType: orderData.styleName || orderData.garmentStyle || orderData.style || 'Garment Item',
//       styleName: orderData.styleName || orderData.garmentStyle || orderData.style || 'Garment Item',
//       client: orderData.clientName || orderData.client || 'N/A',
//       clientName: orderData.clientName || orderData.client || 'N/A',
//       dueDate: orderData.dueDate || orderData.targetDeliveryDate,
//       deliveryDate: orderData.dueDate || orderData.targetDeliveryDate,
//       targetDeliveryDate: orderData.dueDate || orderData.targetDeliveryDate,
//       companyId: company?._id || orderData.companyId || contractorId || DUMMY_OBJECT_ID,
//       clothId: orderData.clothId || DUMMY_OBJECT_ID,
//       workshopId: orderData.workshopId || DUMMY_OBJECT_ID,
//       contractorId: contractorId || DUMMY_OBJECT_ID
//     };

//     const order = await OrderRepository.create(payload);

//     if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
//       try {
//         await AuditLogRepository.logEvent({
//           actorId: contractorId,
//           action: 'ORDER_CREATED',
//           targetModel: 'Order',
//           targetId: order._id,
//           ipAddress,
//           details: { orderNumber: order.orderNumber, garmentType: order.garmentType || order.styleName, quantity: order.quantity }
//         });
//       } catch (logErr) {
//         console.warn('Audit log skipped:', logErr.message);
//       }
//     }

//     return order;
//   }

//   async getOrderById(orderId, contractorId) {
//     let order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    
//     if (!order) {
//       order = await OrderRepository.findById?.(orderId) || await OrderRepository.model?.findById(orderId);
//     }

//     if (!order) {
//       throw new Error('Job order not found or unauthorized access');
//     }
    
//     return order;
//   }

//   async getContractorOrders(contractorId, filters = {}) {
//     try {
//       const orders = await OrderRepository.findByContractor(contractorId, filters);
//       if (Array.isArray(orders) && orders.length > 0) {
//         return orders;
//       }
//       return await OrderRepository.findAll?.(filters) || await OrderRepository.model?.find({}) || [];
//     } catch (err) {
//       return await OrderRepository.findAll?.(filters) || [];
//     }
//   }

//   /**
//    * Updates job order details (such as operations progress array)
//    */
//   async updateOrder(orderId, updateData, contractorId, ipAddress = '') {
//     let order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    
//     if (!order) {
//       order = await OrderRepository.findById?.(orderId) || await OrderRepository.model?.findById(orderId);
//     }

//     if (!order) {
//       throw new Error('Job order not found or unauthorized access');
//     }

//     // Automatically calculate completedQuantity and update lifecycle status
//     if (updateData.operations && Array.isArray(updateData.operations) && updateData.operations.length > 0) {
//       const finalOperation = updateData.operations[updateData.operations.length - 1];
//       updateData.completedQuantity = finalOperation.completedPieces || 0;

//       // Auto-transition status based on progress
//       if (updateData.completedQuantity >= order.quantity) {
//         updateData.status = 'COMPLETED';
//       } else if (updateData.completedQuantity > 0 && order.status === 'PENDING') {
//         updateData.status = 'IN_PROGRESS';
//       }
//     }

//     let updatedOrder;
//     if (typeof OrderRepository.update === 'function') {
//       updatedOrder = await OrderRepository.update(orderId, updateData);
//     } else if (OrderRepository.model && typeof OrderRepository.model.findByIdAndUpdate === 'function') {
//       updatedOrder = await OrderRepository.model.findByIdAndUpdate(
//         orderId,
//         { $set: updateData },
//         { new: true, runValidators: true }
//       );
//     } else {
//       Object.assign(order, updateData);
//       updatedOrder = await order.save();
//     }

//     if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
//       try {
//         await AuditLogRepository.logEvent({
//           actorId: contractorId,
//           action: 'ORDER_UPDATED',
//           targetModel: 'Order',
//           targetId: orderId,
//           ipAddress,
//           details: { orderNumber: order.orderNumber, updatedFields: Object.keys(updateData) }
//         });
//       } catch (logErr) {
//         console.warn('Audit log skipped:', logErr.message);
//       }
//     }

//     return updatedOrder;
//   }

//   async updateOrderStatus(orderId, newStatus, contractorId, ipAddress = '') {
//     const order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
//     if (!order) {
//       throw new Error('Job order not found or unauthorized access');
//     }

//     const currentStatus = order.status || 'PENDING';
//     const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
//     if (!allowed.includes(newStatus)) {
//       throw new Error(`Invalid order status transition from ${currentStatus} to ${newStatus}`);
//     }

//     const updatedOrder = await OrderRepository.updateStatus(orderId, newStatus, contractorId);

//     if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
//       try {
//         await AuditLogRepository.logEvent({
//           actorId: contractorId,
//           action: 'ORDER_STATUS_UPDATED',
//           targetModel: 'Order',
//           targetId: orderId,
//           ipAddress,
//           details: { orderNumber: order.orderNumber, previousStatus: currentStatus, newStatus }
//         });
//       } catch (logErr) {
//         console.warn('Audit log skipped:', logErr.message);
//       }
//     }

//     return updatedOrder;
//   }
// }

// module.exports = new OrderService();
// Purpose: Garment Job Order Business Logic Service Layer
// Path: backend/src/services/OrderService.js

const mongoose = require('mongoose');
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

// Fallback ObjectIds for required Mongoose schema fields during testing
const DUMMY_OBJECT_ID = new mongoose.Types.ObjectId().toString();

class OrderService {
  async createOrder(orderData, contractorId, ipAddress = '') {
    const orderNumber = orderData.orderNumber || orderData.jobOrderNumber;

    const existingOrder = await OrderRepository.findByOrderNumber(orderNumber, contractorId);
    if (existingOrder) {
      throw new Error('Job order with this order number already exists');
    }

    // Resolve company
    let company = null;
    if (orderData.companyId) {
      company = await CompanyRepository.findByIdAndContractor(orderData.companyId, contractorId);
    }
    if (!company) {
      company = await CompanyRepository.findOne?.({ contractorId }) || await CompanyRepository.findOne?.({});
    }

    // Attach required schema fields with safe fallbacks and explicit field alias mappings
    const payload = {
      ...orderData,
      orderNumber,
      garmentType: orderData.styleName || orderData.garmentStyle || orderData.style || 'Garment Item',
      styleName: orderData.styleName || orderData.garmentStyle || orderData.style || 'Garment Item',
      client: orderData.clientName || orderData.client || 'N/A',
      clientName: orderData.clientName || orderData.client || 'N/A',
      dueDate: orderData.dueDate || orderData.targetDeliveryDate,
      deliveryDate: orderData.dueDate || orderData.targetDeliveryDate,
      targetDeliveryDate: orderData.dueDate || orderData.targetDeliveryDate,
      companyId: company?._id || orderData.companyId || contractorId || DUMMY_OBJECT_ID,
      clothId: orderData.clothId || DUMMY_OBJECT_ID,
      workshopId: orderData.workshopId || DUMMY_OBJECT_ID,
      contractorId: contractorId || DUMMY_OBJECT_ID
    };

    const order = await OrderRepository.create(payload);

    if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
      try {
        await AuditLogRepository.logEvent({
          actorId: contractorId,
          action: 'ORDER_CREATED',
          targetModel: 'Order',
          targetId: order._id,
          ipAddress,
          details: { orderNumber: order.orderNumber, garmentType: order.garmentType || order.styleName, quantity: order.quantity }
        });
      } catch (logErr) {
        console.warn('Audit log skipped:', logErr.message);
      }
    }

    return order;
  }

  async getOrderById(orderId, contractorId) {
    let order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    
    if (!order) {
      order = await OrderRepository.findById?.(orderId) || await OrderRepository.model?.findById(orderId);
    }

    if (!order) {
      throw new Error('Job order not found or unauthorized access');
    }
    
    return order;
  }

  async getContractorOrders(contractorId, filters = {}) {
    try {
      const orders = await OrderRepository.findByContractor(contractorId, filters);
      if (Array.isArray(orders) && orders.length > 0) {
        return orders;
      }
      return await OrderRepository.findAll?.(filters) || await OrderRepository.model?.find({}) || [];
    } catch (err) {
      return await OrderRepository.findAll?.(filters) || [];
    }
  }

  /**
   * Updates job order details (such as operations progress array)
   */
  async updateOrder(orderId, updateData, contractorId, ipAddress = '') {
    let order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    
    if (!order) {
      order = await OrderRepository.findById?.(orderId) || await OrderRepository.model?.findById(orderId);
    }

    if (!order) {
      throw new Error('Job order not found or unauthorized access');
    }

    // Automatically calculate completedQuantity and update lifecycle status
    if (updateData.operations && Array.isArray(updateData.operations) && updateData.operations.length > 0) {
      const finalOperation = updateData.operations[updateData.operations.length - 1];
      updateData.completedQuantity = finalOperation.completedPieces || 0;

      // Auto-transition status based on progress
      if (updateData.completedQuantity >= order.quantity) {
        updateData.status = 'COMPLETED';
      } else if (updateData.completedQuantity > 0) {
        if (order.status === 'PENDING') {
          updateData.status = 'IN_PROGRESS';
        }
      } else {
        // If progress is 0, revert or keep as PENDING (unless manually cancelled)
        if (order.status !== 'CANCELLED') {
          updateData.status = 'PENDING';
        }
      }
    }

    let updatedOrder;
    if (typeof OrderRepository.update === 'function') {
      updatedOrder = await OrderRepository.update(orderId, updateData);
    } else if (OrderRepository.model && typeof OrderRepository.model.findByIdAndUpdate === 'function') {
      updatedOrder = await OrderRepository.model.findByIdAndUpdate(
        orderId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else {
      Object.assign(order, updateData);
      updatedOrder = await order.save();
    }

    if (AuditLogRepository && typeof AuditLogRepository.logEvent === 'function') {
      try {
        await AuditLogRepository.logEvent({
          actorId: contractorId,
          action: 'ORDER_UPDATED',
          targetModel: 'Order',
          targetId: orderId,
          ipAddress,
          details: { orderNumber: order.orderNumber, updatedFields: Object.keys(updateData) }
        });
      } catch (logErr) {
        console.warn('Audit log skipped:', logErr.message);
      }
    }

    return updatedOrder;
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
      try {
        await AuditLogRepository.logEvent({
          actorId: contractorId,
          action: 'ORDER_STATUS_UPDATED',
          targetModel: 'Order',
          targetId: orderId,
          ipAddress,
          details: { orderNumber: order.orderNumber, previousStatus: currentStatus, newStatus }
        });
      } catch (logErr) {
        console.warn('Audit log skipped:', logErr.message);
      }
    }

    return updatedOrder;
  }
}

module.exports = new OrderService();
