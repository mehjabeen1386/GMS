// Purpose: Standardized REST API Success Response Wrapper Envelopes
// Path: backend/src/utils/ApiResponse.js

/**
 * Standard Success Response Envelope Wrapper
 */
class ApiResponse {
  constructor(statusCode, message = 'Success', data = null, meta = {}) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = {
      timestamp: new Date().toISOString(),
      ...meta
    };
  }

  /**
   * Sends the structured response via Express res object
   * @param {Object} res - Express Response object
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      meta: this.meta
    });
  }

  /**
   * Helper factory for paginated response payloads
   */
  static paginated(res, message, docs, page, limit, totalDocs) {
    const totalPages = Math.ceil(totalDocs / limit) || 1;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message,
      data: docs,
      meta: {
        page: Number(page),
        limit: Number(limit),
        totalDocs: Number(totalDocs),
        totalPages,
        hasNextPage,
        hasPrevPage,
        timestamp: new Date().toISOString()
      }
    });
  }
}

module.exports = ApiResponse;