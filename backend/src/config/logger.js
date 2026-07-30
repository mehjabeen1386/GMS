// Purpose: Enterprise Winston Structured JSON Logger
// Path: backend/config/logger.js

const winston = require('winston');
const path = require('path');

// Custom format for human-readable console output during local development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `[${timestamp}] ${level}: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

// Standard JSON format for production environment logging (ELK / CloudWatch Ready)
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const transports = [
  // Console Transport
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? jsonFormat : consoleFormat
  })
];

// File Transports for production or non-test runs
if (process.env.NODE_ENV !== 'test') {
  const logDir = path.join(__dirname, '../../logs');
  
  transports.push(
    // Error Logs File Transport
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: jsonFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Combined Application Logs File Transport
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: jsonFormat,
      maxsize: 10485760, // 10MB
      maxFiles: 5
    })
  );
}

const logger = winston.createLogger({
  level,
  defaultMeta: { service: 'aigcwms-backend-api' },
  transports
});

module.exports = logger; 