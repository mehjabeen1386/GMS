// Purpose: Garment Production Job Order Data Access Repository Layer
// Path: backend/src/repositories/OrderRepository.js

const mongoose = require('mongoose');
const BaseRepository = require('./BaseRepository');

// Register relational models explicitly to prevent MissingSchemaError during .populate()
require('../models/Cloth');
require('../models/Company');
require('../models/Workshop');

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
   */
  async findByIdAndContractor(orderId, contractorId) {
    // Guard against literal string "[id]" or invalid ObjectId lengths
    if (!orderId || orderId === '[id]' || !mongoose.Types.ObjectId.isValid(orderId)) {
      return null;
    }

    return await this.model
      .findOne({ _id: orderId, contractorId, isDeleted: { $ne: true } })
      .populate('companyId', 'companyName companyCode')
      .populate('workshopId', 'workshopName')
      .populate('clothId', 'clothType colorName rollCode')
      .exec();
  }

  /**
   * Finds an order by its unique system Order Number
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
   * Retrieves all job orders for a contractor with optional filters
   */
  async findByContractor(contractorId, filters = {}) {
    const query = { contractorId, isDeleted: { $ne: true }, ...filters };
    const orders = await this.model
      .find(query)
      .populate('companyId', 'companyName companyCode')
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.model.countDocuments(query);
    return { orders, total };
  }

  /**
   * Retrieves active job orders assigned to a specific workshop
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
   */
  async updateOrderStatus(orderId, status, updatedByUserId = null, notes = '', options = {}) {
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

  async updateStatus(orderId, status, updatedByUserId = null, notes = '', options = {}) {
    return await this.updateOrderStatus(orderId, status, updatedByUserId, notes, options);
  }

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