// Purpose: Garment Quality Control & Inspection Business Logic Service Layer
// Path: backend/src/services/QualityCheckService.js

const QualityCheckRepository = require('../repositories/QualityCheckRepository');
const OrderRepository = require('../repositories/OrderRepository');
const WorkerRepository = require('../repositories/WorkerRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for garment quality assurance, defect inspection, and rework management.
 */
class QualityCheckService {
  /**
   * Creates a new quality check inspection report for an order
   * @param {Object} qaData - Quality check payload
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async createQualityCheck(qaData, contractorId, ipAddress = '') {
    // Verify target order exists and belongs to contractor
    const order = await OrderRepository.findByIdAndContractor(qaData.orderId, contractorId);
    if (!order) {
      throw new ApiError(404, 'Job order not found or unauthorized access');
    }

    // Verify worker exists if workerId is provided
    if (qaData.workerId) {
      const worker = await WorkerRepository.findByIdAndContractor(qaData.workerId, contractorId);
      if (!worker) {
        throw new ApiError(404, 'Worker not found or unauthorized access');
      }
    }

    const payload = {
      ...qaData,
      contractorId
    };

    const qualityCheck = await QualityCheckRepository.create(payload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'QUALITY_CHECK_CREATED',
      targetModel: 'QualityCheck',
      targetId: qualityCheck._id,
      ipAddress,
      details: { orderId: qualityCheck.orderId, status: qualityCheck.status, defectCount: qualityCheck.defects ? qualityCheck.defects.length : 0 }
    });

    logger.info(`Quality check created: ${qualityCheck._id} for Order: ${qaData.orderId} [Status: ${qualityCheck.status}]`);

    return qualityCheck;
  }

  /**
   * Retrieves a quality check inspection report by ID with security verification
   * @param {string} qaId - QualityCheck ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getQualityCheckById(qaId, contractorId) {
    const qualityCheck = await QualityCheckRepository.findByIdAndContractor(qaId, contractorId);
    if (!qualityCheck) {
      throw new ApiError(404, 'Quality check report not found or unauthorized access');
    }
    return qualityCheck;
  }

  /**
   * Retrieves all quality inspection reports for a specific order
   * @param {string} orderId - Order ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   */
  async getOrderQualityChecks(orderId, contractorId) {
    const order = await OrderRepository.findByIdAndContractor(orderId, contractorId);
    if (!order) {
      throw new ApiError(404, 'Job order not found or unauthorized access');
    }

    return await QualityCheckRepository.findByOrder(orderId);
  }

  /**
   * Updates quality check status or records inspection defects
   * @param {string} qaId - QualityCheck ObjectId
   * @param {string} status - New inspection status ('PASSED', 'FAILED', 'REWORK')
   * @param {Array} [defects] - Array of defect logs
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async updateQualityCheck(qaId, status, defects = null, contractorId, ipAddress = '') {
    const qualityCheck = await QualityCheckRepository.findByIdAndContractor(qaId, contractorId);
    if (!qualityCheck) {
      throw new ApiError(404, 'Quality check report not found or unauthorized access');
    }

    const updatePayload = { status };
    if (defects !== null) {
      updatePayload.defects = defects;
    }

    const updatedQualityCheck = await QualityCheckRepository.updateById(qaId, updatePayload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'QUALITY_CHECK_UPDATED',
      targetModel: 'QualityCheck',
      targetId: qaId,
      ipAddress,
      details: { previousStatus: qualityCheck.status, newStatus: status }
    });

    logger.info(`Quality check updated: ${qaId} -> Status: ${status}`);

    return updatedQualityCheck;
  }
}

module.exports = new QualityCheckService();