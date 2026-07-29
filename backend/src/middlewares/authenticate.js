/**
 * Purpose: Authentication Middleware
 * Path: backend/src/middlewares/authenticate.js
 */

const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const authenticate = (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Check cookie if token is not in header
    if (!token && req.cookies) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new ApiError(401, "Authentication token is missing."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired authentication token."));
  }
};

module.exports = authenticate;