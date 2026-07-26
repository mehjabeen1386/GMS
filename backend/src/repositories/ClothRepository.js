// Purpose: Fabric Raw Material & Stock Inventory Data Access Repository Layer
// Path: backend/src/repositories/ClothRepository.js

const BaseRepository = require('./BaseRepository');
const Cloth = require('../models/Cloth');

/**
 * Repository layer for Cloth (Fabric Inventory) entity database operations.
 */
class ClothRepository extends BaseRepository {
  constructor() {
    super(Cloth);
  }

  /**
   * Finds a fabric roll/stock item by ID and verifies contractor ownership
   * @param {string} clothId - Cloth ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findByIdAndContractor(clothId, contractorId) {
    return await this.model
      .findOne({ _id: clothId, contractorId, isDeleted: { $ne: true } })
      .populate('companyId', 'companyName companyCode')
      .exec();
  }

  /**
   * Retrieves all fabric stock records for a given contractor
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [companyId] - Optional Company filter
   */
  async findByContractor(contractorId, companyId = null) {
    const filter = { contractorId };
    if (companyId) {
      filter.companyId = companyId;
    }

    return await this.model
      .find({ isDeleted: { $ne: true }, ...filter })
      .populate('companyId', 'companyName companyCode')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Retrieves fabric stock records falling below alert threshold
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findLowStockAlerts(contractorId) {
    return await this.model
      .find({
        contractorId,
        isDeleted: { $ne: true },
        $expr: { $lte: ['$quantityInMeters', '$minimumThresholdMeters'] }
      })
      .populate('companyId', 'companyName companyCode')
      .exec();
  }

  /**
   * Atomically adjusts fabric stock quantity (deduction or addition)
   * @param {string} clothId - Cloth ObjectId
   * @param {number} deltaMeters - Quantity delta (negative for deduction, positive for addition)
   * @param {Object} [options] - Transaction session options
   */
  async adjustStockQuantity(clothId, deltaMeters, options = {}) {
    return await this.model
      .findOneAndUpdate(
        { _id: clothId, isDeleted: { $ne: true } },
        { $inc: { quantityInMeters: deltaMeters } },
        { new: true, runValidators: true, ...options }
      )
      .exec();
  }
}

module.exports = new ClothRepository();