// Purpose: User System Alerts & Real-time Notifications Validation Rules Layer
// Path: backend/src/validators/notificationValidator.js

const { param } = require('express-validator');

/**
 * Validator for URL parameters containing Notification ID
 */
const getNotificationByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid notification ID format')
];

module.exports = {
  getNotificationByIdValidator
};