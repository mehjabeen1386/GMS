// Purpose: Factory Worker Attendance Controller Layer
// Path: backend/src/controllers/AttendanceController.js

const BaseController = require('./BaseController');
const AttendanceService = require('../services/AttendanceService');

/**
 * Controller handling worker shift check-ins, check-outs, and attendance reporting.
 */
class AttendanceController extends BaseController {
  /**
   * Records a worker shift check-in entry
   */
  checkIn = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const attendance = await AttendanceService.checkIn(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Worker checked in successfully', attendance);
  });

  /**
   * Records a worker shift check-out entry
   */
  checkOut = this.catchAsync(async (req, res) => {
    const { workerId } = req.body;
    const contractorId = req.user._id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const attendance = await AttendanceService.checkOut(workerId, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Worker checked out successfully', attendance);
  });

  /**
   * Retrieves attendance records for a specific worker
   */
  getWorkerAttendance = this.catchAsync(async (req, res) => {
    const { workerId } = req.params;
    const contractorId = req.user._id;
    const attendanceRecords = await AttendanceService.getWorkerAttendance(workerId, contractorId);
    return this.sendSuccess(res, 200, 'Worker attendance retrieved successfully', attendanceRecords);
  });

  /**
   * Retrieves attendance records across a date range with optional workshop filter
   */
  getAttendanceByDateRange = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const { startDate, endDate, workshopId } = req.query;
    const attendanceRecords = await AttendanceService.getAttendanceByDateRange(
      contractorId,
      startDate,
      endDate,
      workshopId || null
    );
    return this.sendSuccess(res, 200, 'Attendance range report retrieved successfully', attendanceRecords);
  });
}

module.exports = new AttendanceController();