// Purpose: Factory Worker Attendance & Shift Business Logic Service Layer
// Path: backend/src/services/AttendanceService.js

const AttendanceRepository = require('../repositories/AttendanceRepository');
const WorkerRepository = require('../repositories/WorkerRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Service layer for worker attendance tracking and daily shift records.
 */
class AttendanceService {
  /**
   * Records daily attendance check-in for a worker
   * @param {Object} attendanceData - Attendance payload (workerId, date, status, checkInTime)
   * @param {string} contractorId - Contractor User ObjectId
   * @param {string} [ipAddress] - Client IP address
   */
  async checkIn(attendanceData, contractorId, ipAddress = '') {
    // Verify worker exists and belongs to contractor
    const worker = await WorkerRepository.findByIdAndContractor(attendanceData.workerId, contractorId);
    if (!worker) {
      throw new ApiError(404, 'Worker not found or unauthorized access');
    }

    const attendanceDate = attendanceData.date ? new Date(attendanceData.date) : new Date();
    
    // Check if attendance already exists for this worker on this date
    const existing = await AttendanceRepository.findByWorkerAndDate(attendanceData.workerId, attendanceDate);
    if (existing) {
      throw new ApiError(409, 'Attendance record already exists for this worker on this date');
    }

    const payload = {
      ...attendanceData,
      contractorId,
      date: attendanceDate,
      checkInTime: attendanceData.checkInTime || new Date()
    };

    const attendance = await AttendanceRepository.create(payload);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'ATTENDANCE_CHECK_IN',
      targetModel: 'Attendance',
      targetId: attendance._id,
      ipAddress,
      details: { workerId: attendance.workerId, status: attendance.status, date: attendanceDate }
    });

    logger.info(`Attendance check-in recorded for Worker: ${attendanceData.workerId}`);

    return attendance;
  }

  /**
   * Records daily attendance check-out for a worker
   * @param {string} attendanceId - Attendance record ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   * @param {Date|string} [checkOutTime] - Check-out timestamp
   * @param {string} [ipAddress] - Client IP address
   */
  async checkOut(attendanceId, contractorId, checkOutTime = null, ipAddress = '') {
    const attendance = await AttendanceRepository.findByIdAndContractor(attendanceId, contractorId);
    if (!attendance) {
      throw new ApiError(404, 'Attendance record not found or unauthorized access');
    }

    const resolvedCheckOut = checkOutTime ? new Date(checkOutTime) : new Date();
    const updatedAttendance = await AttendanceRepository.updateCheckOut(attendanceId, resolvedCheckOut);

    await AuditLogRepository.logEvent({
      actorId: contractorId,
      action: 'ATTENDANCE_CHECK_OUT',
      targetModel: 'Attendance',
      targetId: attendanceId,
      ipAddress,
      details: { workerId: attendance.workerId, checkOutTime: resolvedCheckOut }
    });

    logger.info(`Attendance check-out recorded for Attendance ID: ${attendanceId}`);

    return updatedAttendance;
  }

  /**
   * Retrieves attendance records for a worker with optional date range
   * @param {string} workerId - Worker ObjectId
   * @param {string} contractorId - Contractor User ObjectId
   * @param {Date|string} [startDate] - Start date filter
   * @param {Date|string} [endDate] - End date filter
   */
  async getWorkerAttendance(workerId, contractorId, startDate = null, endDate = null) {
    const worker = await WorkerRepository.findByIdAndContractor(workerId, contractorId);
    if (!worker) {
      throw new ApiError(404, 'Worker not found or unauthorized access');
    }

    return await AttendanceRepository.findByWorkerDateRange(workerId, startDate, endDate);
  }
}

module.exports = new AttendanceService();