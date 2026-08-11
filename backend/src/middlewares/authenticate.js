/**
 * Purpose: Authentication Middleware with Local Development Fallback
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

    // If token exists, try verifying it
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "default_jwt_secret_key"
        );
        req.user = decoded;
        return next();
      } catch (err) {
        console.warn("Invalid/Expired JWT provided. Falling back to local dev user.");
      }
    }

    // Fallback user for local testing when unauthenticated or token is expired
    req.user = {
      _id: "650000000000000000000001",
      id: "650000000000000000000001",
      contractorId: "650000000000000000000001",
      role: "CONTRACTOR",
      email: "dev@local.test"
    };

    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired authentication token."));
  }
};

module.exports = authenticate;