// Purpose: Worker Attendance Tracking & Shift Log Routes Layer
// Path: backend/src/routes/attendanceRoutes.js
const express = require('express'); const router = express.Router();
const attendanceController = require('../controllers/AttendanceController');
const authenticate = require('../middlewares/authenticate'); const authorize = require('../middlewares/authorize');
const {   checkInValidator,   checkOutValidator,   getAttendanceByIdValidator } = require('../validators/attendanceValidator');
// Protect all attendance routes with JWT authentication router.use(authenticate);
/**
*	@route   POST /api/v1/attendances/check-in
*	@desc    Records a worker shift check-in
*	@access  Private (Contractor / Admin / Manager)
 */ router.post(   '/check-in',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  checkInValidator,
  attendanceController.checkIn );
/**
*	@route   POST /api/v1/attendances/check-out
*	@desc    Records a worker shift check-out
*	@access  Private (Contractor / Admin / Manager)
 */ router.post(
  '/check-out',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  checkOutValidator,
  attendanceController.checkOut );
/**
*	@route   GET /api/v1/attendances/worker/:workerId
*	@desc    Retrieves attendance shift history for a specific worker
*	@access  Private (Contractor / Admin / Manager)
 */ router.get(
  '/worker/:workerId',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  attendanceController.getWorkerAttendance );
/**
*	@route   GET /api/v1/attendances/range
*	@desc    Retrieves workshop attendance logs within a date range
*	@access  Private (Contractor / Admin / Manager)
 */ router.get(   '/range',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  attendanceController.getAttendanceByRange );
/**
*	@route   GET /api/v1/attendances/:id
*	@desc    Retrieves a specific attendance record by ID
*	@access  Private (Contractor / Admin / Manager)
 */ router.get(   '/:id',
  authorize('CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'),
  getAttendanceByIdValidator,
  attendanceController.getAttendanceById ); module.exports = router;
