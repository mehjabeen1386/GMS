// Purpose: Worker Attendance Tracking & Shift Log Controller Layer
// Path: backend/src/controllers/AttendanceController.js

const BaseController = require('./BaseController');
const AttendanceService = require('../services/AttendanceService');

/**
 * Controller handling worker shift check-ins, check-outs, and shift history logging
 */
class AttendanceController extends BaseController {
  /**
   * Records a worker shift check-in
   */
  checkIn = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const attendance = await AttendanceService.checkIn(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 201, 'Worker checked in successfully', attendance);
  });

  /**
   * Records a worker shift check-out
   */
  checkOut = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const attendance = await AttendanceService.checkOut(req.body, contractorId, ipAddress);
    return this.sendSuccess(res, 200, 'Worker checked out successfully', attendance);
  });

  /**
   * Retrieves attendance shift history for a specific worker
   */
  getWorkerAttendance = this.catchAsync(async (req, res) => {
    const { workerId } = req.params;
    const contractorId = req.user._id;
    const history = await AttendanceService.getWorkerAttendance(workerId, contractorId);
    return this.sendSuccess(res, 200, 'Worker attendance history retrieved successfully', history);
  });

  /**
   * Retrieves workshop attendance logs within a date range
   */
  getAttendanceByRange = this.catchAsync(async (req, res) => {
    const contractorId = req.user._id;
    const { startDate, endDate, workshopId } = req.query;
    const logs = await AttendanceService.getAttendanceByRange(contractorId, startDate, endDate, workshopId);
    return this.sendSuccess(res, 200, 'Attendance range logs retrieved successfully', logs);
  });

  /**
   * Retrieves a specific attendance record by ID
   */
  getAttendanceById = this.catchAsync(async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user._id;
    const record = await AttendanceService.getAttendanceById(id, contractorId);
    return this.sendSuccess(res, 200, 'Attendance record retrieved successfully', record);
  });
}

module.exports = new AttendanceController();