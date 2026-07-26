// Purpose: Garment Production Job Order Data Access Repository Layer
// Path: backend/src/repositories/OrderRepository.js

const BaseRepository = require('./BaseRepository');
const Order = require('../models/Order');

/**
 * Repository layer for Order entity database operations.
 */
class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  /**
   * Finds an order by ID with tenant isolation and full relational population
   * @param {string} orderId - Order ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findByIdAndContractor(orderId, contractorId) {
    return await this.model
      .findOne({ _id: orderId, contractorId, isDeleted: { $ne: true } })
      .populate('companyId', 'companyName companyCode')
      .populate('workshopId', 'workshopName')
      .populate('clothId', 'clothType colorName rollCode')
      .exec();
  }

  /**
   * Finds an order by its unique system Order Number (e.g., ORD-2026-0001)
   * @param {string} orderNumber - Unique Order Number
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findByOrderNumber(orderNumber, contractorId) {
    return await this.model
      .findOne({
        orderNumber: orderNumber.toUpperCase(),
        contractorId,
        isDeleted: { $ne: true }
      })
      .populate('companyId', 'companyName companyCode')
      .populate('workshopId', 'workshopName')
      .exec();
  }

  /**
   * Retrieves active job orders assigned to a specific workshop
   * @param {string} workshopId - Workshop ObjectId
   * @param {string} [status] - Optional order status filter
   */
  async findByWorkshop(workshopId, status = null) {
    const filter = { workshopId };
    if (status) {
      filter.status = status;
    }

    return await this.model
      .find({ isDeleted: { $ne: true }, ...filter })
      .populate('companyId', 'companyName companyCode')
      .populate('clothId', 'clothType colorName')
      .sort({ priority: -1, createdAt: -1 })
      .exec();
  }

  /**
   * Updates job order status and appends status history log entry
   * @param {string} orderId - Order ObjectId
   * @param {string} status - New order status ('PENDING', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED')
   * @param {string} updatedByUserId - User ObjectId who initiated status update
   * @param {string} [notes] - Optional status change notes
   * @param {Object} [options] - Transaction session options
   */
  async updateOrderStatus(orderId, status, updatedByUserId, notes = '', options = {}) {
    const statusEntry = {
      status,
      updatedBy: updatedByUserId,
      notes,
      timestamp: new Date()
    };

    const updatePayload = {
      status,
      $push: { statusHistory: statusEntry }
    };

    if (status === 'COMPLETED') {
      updatePayload.completedAt = new Date();
    }

    return await this.model
      .findByIdAndUpdate(orderId, updatePayload, {
        new: true,
        runValidators: true,
        ...options
      })
      .exec();
  }

  /**
   * Incrementally updates completed pieces count for an order
   * @param {string} orderId - Order ObjectId
   * @param {number} quantity - Quantity of completed pieces to increment
   * @param {Object} [options] - Transaction session options
   */
  async incrementCompletedQuantity(orderId, quantity, options = {}) {
    return await this.model
      .findOneAndUpdate(
        { _id: orderId, isDeleted: { $ne: true } },
        { $inc: { completedPieces: quantity } },
        { new: true, runValidators: true, ...options }
      )
      .exec();
  }
}

module.exports = new OrderRepository();