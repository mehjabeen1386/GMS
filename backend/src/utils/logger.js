// Purpose: Enterprise Winston Structured JSON Logger
// Path: backend/utils/logger.js

const winston = require('winston');
const path = require('path');

// Human-readable console format for development
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

// JSON format for production
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const level =
  process.env.LOG_LEVEL ||
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const transports = [
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production'
      ? jsonFormat
      : consoleFormat,
  }),
];

// File logging (except during tests)
if (process.env.NODE_ENV !== 'test') {
  const logDir = path.join(__dirname, '../logs');

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: jsonFormat,
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
    }),

    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: jsonFormat,
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    })
  );
}

const logger = winston.createLogger({
  level,
  defaultMeta: {
    service: 'aigcwms-backend-api',
  },
  transports,
});

module.exports = logger;