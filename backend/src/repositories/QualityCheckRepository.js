// Purpose: Quality Inspection & Defect Tracking Data Access Repository Layer
// Path: backend/src/repositories/QualityCheckRepository.js

const BaseRepository = require('./BaseRepository');
const QualityCheck = require('../models/QualityCheck');

/**
 * Repository layer for QualityCheck entity database operations.
 */
class QualityCheckRepository extends BaseRepository {
  constructor() {
    super(QualityCheck);
  }

  /**
   * Finds a quality check report by ID with full relational population
   * @param {string} qcId - QualityCheck ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findByIdAndContractor(qcId, contractorId) {
    return await this.model
      .findOne({ _id: qcId, contractorId, isDeleted: { $ne: true } })
      .populate('orderId', 'orderNumber garmentType')
      .populate('workerId', 'workerCode userId')
      .populate('workshopId', 'workshopName')
      .populate('inspectorId', 'fullName email')
      .exec();
  }

  /**
   * Retrieves inspection reports for a specific job order
   * @param {string} orderId - Order ObjectId
   */
  async findByOrder(orderId) {
    return await this.model
      .find({ orderId, isDeleted: { $ne: true } })
      .populate('workerId', 'workerCode')
      .populate('inspectorId', 'fullName')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Retrieves inspection logs for a specific worker
   * @param {string} workerId - Worker ObjectId
   * @param {string} [status] - Optional QA result status filter ('PASSED', 'FAILED', 'REWORK_REQUIRED')
   */
  async findByWorker(workerId, status = null) {
    const filter = { workerId, isDeleted: { $ne: true } };
    if (status) {
      filter.inspectionStatus = status;
    }

    return await this.model
      .find(filter)
      .populate('orderId', 'orderNumber garmentType')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Updates quality inspection status and logs defect corrections or rework notes
   * @param {string} qcId - QualityCheck ObjectId
   * @param {string} inspectionStatus - New inspection status ('PASSED', 'FAILED', 'REWORK_REQUIRED')
   * @param {Object} [updateData] - Additional update fields (defectTypes, remarks)
   * @param {Object} [options] - Transaction session options
   */
  async updateInspectionStatus(qcId, inspectionStatus, updateData = {}, options = {}) {
    return await this.model
      .findOneAndUpdate(
        { _id: qcId, isDeleted: { $ne: true } },
        {
          $set: {
            inspectionStatus,
            ...updateData,
            inspectedAt: new Date()
          }
        },
        { new: true, runValidators: true, ...options }
      )
      .exec();
  }
}

module.exports = new QualityCheckRepository();