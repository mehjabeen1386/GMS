/**
 * Purpose: Express Core App Initialization & Middleware Pipeline
 * Path: backend/src/app.js
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const config = require("./config/environment");
const routes = require("./routes");
const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/errorHandler");

// Initialize Express application
const app = express();

// Security HTTP Headers
app.use(helmet());

// Cross-Origin Resource Sharing Configuration
const corsOptions = {
  origin: config.cors?.origin || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// HTTP Request Logging
if (config.env !== "test") {
  app.use(
    morgan(config.env === "development" ? "dev" : "combined")
  );
}

// Request Parsing Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Garment Manufacturing Backend API is operational",
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// Mount API v1 Central Router
app.use("/api/v1", routes);

// Catch-All 404 Route Handler
app.use(notFoundHandler);

// Centralized Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;