
// Purpose: Garment Task & Piece-Rate Assignment Business Logic Service Layer
// Path: backend/src/services/AssignmentService.js

const AssignmentRepository = require('../repositories/AssignmentRepository');
const OrderRepository = require('../repositories/OrderRepository');
const WorkerRepository = require('../repositories/WorkerRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for worker piece-rate task allocations and progress tracking.
 */
class AssignmentService {
  /**
   * Creates a new garment task assignment for a worker
   * @param {Object} assignmentData - Task assignment payload
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async createAssignment(assignmentData, contractorId, ipAddress = '') {
    // Verify target order exists and belongs to contractor
    const order = await OrderRepository.findByIdAndContractor(assignmentData.orderId, contractorId);
    if (!order) {
      throw new ApiError(404, 'Job order not found or unauthorized access');
    }

    // Verify target worker exists and belongs to contractor
    const worker = await WorkerRepository.findByIdAndContractor(assignmentData.workerId, contractorId);
    if (!worker) {
      throw new ApiError(404, 'Worker not found or unauthorized access');
    }

    const payload = {
      ...assignmentData,
      contractorId
    };

    const assignment = await AssignmentRepository.create(payload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'ASSIGNMENT_CREATED',
      targetModel: 'Assignment',
      targetId: assignment._id,
      ipAddress,
      details: { orderId: assignment.orderId, workerId: assignment.workerId, quantityAssigned: assignment.quantityAssigned }
    });

    logger.info(`Task assignment created: ${assignment._id} for Worker: ${assignmentData.workerId} on Order: ${assignmentData.orderId}`);

    return assignment;
  }

  /**
   * Retrieves an assignment by ID with security verification
   * @param {string} assignmentId - Assignment ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getAssignmentById(assignmentId, contractorId) {
    const assignment = await AssignmentRepository.findByIdAndContractor(assignmentId, contractorId);
    if (!assignment) {
      throw new ApiError(404, 'Assignment not found or unauthorized access');
    }
    return assignment;
  }

  /**
   * Retrieves task assignments for a specific worker
   * @param {string} workerId - Worker ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [status] - Optional status filter
   */
  async getWorkerAssignments(workerId, contractorId, status = null) {
    const worker = await WorkerRepository.findByIdAndContractor(workerId, contractorId);
    if (!worker) {
      throw new ApiError(404, 'Worker not found or unauthorized access');
    }

    return await AssignmentRepository.findByWorker(workerId, status);
  }

  /**
   * Updates task assignment status and completed item quantities
   * @param {string} assignmentId - Assignment ObjectId
   * @param {string} status - New status ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')
   * @param {number} [quantityCompleted] - Number of successfully completed pieces
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async updateAssignmentStatus(assignmentId, status, quantityCompleted = null, contractorId, ipAddress = '') {
    const assignment = await AssignmentRepository.findByIdAndContractor(assignmentId, contractorId);
    if (!assignment) {
      throw new ApiError(404, 'Assignment not found or unauthorized access');
    }

    const updatePayload = { status };
    if (quantityCompleted !== null) {
      if (quantityCompleted > assignment.quantityAssigned) {
        throw new ApiError(400, 'Completed quantity cannot exceed assigned quota');
      }
      updatePayload.quantityCompleted = quantityCompleted;
    }

    const updatedAssignment = await AssignmentRepository.updateById(assignmentId, updatePayload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'ASSIGNMENT_STATUS_UPDATED',
      targetModel: 'Assignment',
      targetId: assignmentId,
      ipAddress,
      details: { previousStatus: assignment.status, newStatus: status, quantityCompleted }
    });

    logger.info(`Assignment status updated: ${assignmentId} -> ${status}`);

    return updatedAssignment;
  }
}

module.exports = new AssignmentService();