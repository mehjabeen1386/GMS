// Purpose: Worker Attendance & Shift Logging Data Access Repository Layer
// Path: backend/src/repositories/AttendanceRepository.js

const BaseRepository = require('./BaseRepository');
const Attendance = require('../models/Attendance');

/**
 * Repository layer for Attendance entity database operations.
 */
class AttendanceRepository extends BaseRepository {
  constructor() {
    super(Attendance);
  }

  /**
   * Finds attendance record for a worker on a specific date
   * @param {string} workerId - Worker ObjectId
   * @param {Date|string} date - Target date (normalized to start of day)
   */
  async findByWorkerAndDate(workerId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.model
      .findOne({
        workerId,
        date: { $gte: startOfDay, $lte: endOfDay },
        isDeleted: { $ne: true }
      })
      .exec();
  }

  /**
   * Retrieves attendance history for a worker within a date range
   * @param {string} workerId - Worker ObjectId
   * @param {Date|string} startDate - Range start date
   * @param {Date|string} endDate - Range end date
   */
  async findByWorkerDateRange(workerId, startDate, endDate) {
    return await this.model
      .find({
        workerId,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        isDeleted: { $ne: true }
      })
      .sort({ date: 1 })
      .exec();
  }

  /**
   * Retrieves all attendance records for a workshop on a specific date
   * @param {string} workshopId - Workshop ObjectId
   * @param {Date|string} date - Target date
   */
  async findByWorkshopAndDate(workshopId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.model
      .find({
        workshopId,
        date: { $gte: startOfDay, $lte: endOfDay },
        isDeleted: { $ne: true }
      })
      .populate('workerId', 'workerCode userId')
      .exec();
  }

  /**
   * Clocks out a worker and calculates total shift duration / overtime
   * @param {string} attendanceId - Attendance ObjectId
   * @param {Date} clockOutTime - Clock out timestamp
   * @param {number} overtimeHours - Calculated overtime hours
   * @param {Object} [options] - Transaction session options
   */
  async clockOut(attendanceId, clockOutTime = new Date(), overtimeHours = 0, options = {}) {
    return await this.model
      .findOneAndUpdate(
        { _id: attendanceId, isDeleted: { $ne: true } },
        {
          $set: {
            clockOut: clockOutTime,
            overtimeHours,
            status: 'PRESENT'
          }
        },
        { new: true, runValidators: true, ...options }
      )
      .exec();
  }
}

module.exports = new AttendanceRepository();