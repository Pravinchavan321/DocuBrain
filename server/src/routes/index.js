const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const authRouter = require('./auth.routes');
const documentRouter = require('./document.routes');
const uploadRouter = require('./upload.routes');
const ingestRouter = require('./ingest.routes');
const queryRouter = require('./query.routes');
const chatRouter = require('./chat.routes');
const dashboardRouter = require('./dashboard.routes');

router.get('/health', asyncHandler(async (req, res) => {
  let mongoStatus = 'disconnected';

  if (mongoose.connection.readyState === 1) {
    mongoStatus = 'connected';
  } else {
    mongoStatus = `state: ${mongoose.connection.readyState}`;
  }

  const isHealthy = mongoStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    data: {
      mongodb: mongoStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    },
    message: isHealthy ? 'Systems are operational' : 'Database connection error'
  });
}));

// Auth routes
router.use('/auth', authRouter);

// Document routes
router.use('/documents', documentRouter);

// Upload routes
router.use('/uploads', uploadRouter);

// Ingestion routes
router.use('/ingest', ingestRouter);

// Query routes
router.use('/query', queryRouter);

// Chat routes
router.use('/chat', chatRouter);

// Dashboard routes
router.use('/dashboard', dashboardRouter);

module.exports = router;
