// Purpose: Worker Job Assignment & Piece-Rate Data Access Repository Layer
// Path: backend/src/repositories/AssignmentRepository.js

const BaseRepository = require('./BaseRepository');
const Assignment = require('../models/Assignment');

/**
 * Repository layer for Assignment entity database operations.
 */
class AssignmentRepository extends BaseRepository {
  constructor() {
    super(Assignment);
  }

  /**
   * Finds an assignment by ID with full relational population
   * @param {string} assignmentId - Assignment ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async findByIdAndContractor(assignmentId, contractorId) {
    return await this.model
      .findOne({ _id: assignmentId, contractorId, isDeleted: { $ne: true } })
      .populate('workerId', 'workerCode userId')
      .populate('orderId', 'orderNumber garmentType targetQuantity')
      .populate('workshopId', 'workshopName')
      .exec();
  }

  /**
   * Retrieves active assignments for a specific worker
   * @param {string} workerId - Worker ObjectId
   * @param {string} [status] - Optional status filter
   */
  async findByWorker(workerId, status = null) {
    const filter = { workerId };
    if (status) {
      filter.status = status;
    }

    return await this.model
      .find({ isDeleted: { $ne: true }, ...filter })
      .populate('orderId', 'orderNumber garmentType pieceRateAmount')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Retrieves all assignments linked to a specific job order
   * @param {string} orderId - Order ObjectId
   */
  async findByOrder(orderId) {
    return await this.model
      .find({ orderId, isDeleted: { $ne: true } })
      .populate('workerId', 'workerCode userId')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Updates assignment completed quantity and recalculates total earned wages
   * @param {string} assignmentId - Assignment ObjectId
   * @param {number} completedPieces - Completed pieces count to update
   * @param {number} pieceRateAmount - Rate per piece for calculation
   * @param {Object} [options] - Transaction session options
   */
  async updateProgress(assignmentId, completedPieces, pieceRateAmount, options = {}) {
    const totalEarned = completedPieces * pieceRateAmount;

    return await this.model
      .findOneAndUpdate(
        { _id: assignmentId, isDeleted: { $ne: true } },
        {
          $set: {
            completedPieces,
            totalEarned,
            status: completedPieces > 0 ? 'IN_PROGRESS' : 'ASSIGNED'
          }
        },
        { new: true, runValidators: true, ...options }
      )
      .exec();
  }

  /**
   * Verifies and locks an assignment completion status
   * @param {string} assignmentId - Assignment ObjectId
   * @param {string} verifiedByUserId - Manager/Contractor User ObjectId verifying the work
   * @param {Object} [options] - Transaction session options
   */
  async verifyAssignment(assignmentId, verifiedByUserId, options = {}) {
    return await this.model
      .findOneAndUpdate(
        { _id: assignmentId, isDeleted: { $ne: true } },
        {
          $set: {
            status: 'VERIFIED',
            verifiedBy: verifiedByUserId,
            verifiedAt: new Date()
          }
        },
        { new: true, runValidators: true, ...options }
      )
      .exec();
  }
}

module.exports = new AssignmentRepository();