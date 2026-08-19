// Purpose: Express Application Configuration Setup with Route Mounting
// Path: backend/src/app.js

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const aiRoutes = require('./routes/aiRoutes'); // Import
const aiEstimatorRoutes = require('./routes/aiEstimatorRoutes');

const app = express();

// 1. Enable CORS for local Next.js frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Parse Incoming Payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/ai', aiRoutes);
app.use('/api/ai', aiEstimatorRoutes);

// Helper function to safely mount routes if their file exists
const mountRoute = (path, routeFileName) => {
  try {
    const routeModule = require(`./routes/${routeFileName}`);
    app.use(path, routeModule);
    console.log(`[Route Loaded] Mounted ${path} -> ./routes/${routeFileName}`);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && err.message.includes(routeFileName)) {
      console.warn(`[Route Warning] Skipping ${path} - ./routes/${routeFileName} not found.`);
    } else {
      console.error(`[Route Error] Failed to load ./routes/${routeFileName}:`, err);
    }
  }
};

// 3. Mount Routes under /api/v1
mountRoute('/api/v1/auth', 'authRoutes');
mountRoute('/api/v1/orders', 'orderRoutes');
mountRoute('/api/v1/job-orders', 'orderRoutes'); // Maps /job-orders to orderRoutes as well
mountRoute('/api/v1/workers', 'workerRoutes');

// Mount Inventory & Fabric routes
mountRoute('/api/v1/inventory', 'inventoryRoutes');
mountRoute('/api/v1/inventory', 'fabricRoutes');

// Mount Dashboard / Reports routes
// mountRoute('/api/v1/reports', 'dashboardRoutes');

// Healthcheck Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

module.exports = app;