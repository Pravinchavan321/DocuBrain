const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('./config/logger');
const routes = require('./routes/index');
const errorMiddleware = require('./middleware/error.middleware');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter.middleware');

const app = express();

// 1. Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // allow serving static files physically without CORB blocks
}));

// 2. CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// 3. Body Parser
app.use(express.json({ limit: '2mb' })); // Limit payload size to 2mb
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 4. Request ID & Timeout Protection
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  req.setTimeout(600000, () => {
    logger.error(`Request Timeout [${req.id}] ${req.method} ${req.url}`);
    res.status(504).json({ success: false, message: 'Request Timeout' });
  });
  res.setTimeout(600000, () => {
    logger.error(`Response Timeout [${req.id}] ${req.method} ${req.url}`);
    if (!res.headersSent) res.status(504).json({ success: false, message: 'Service Unavailable' });
  });
  next();
});

// 5. HTTP Request Logging (Structured)
app.use(morgan((tokens, req, res) => {
  return JSON.stringify({
    requestId: req.id,
    userId: req.user?.id || 'unauthenticated',
    method: tokens.method(req, res),
    route: tokens.url(req, res),
    status: tokens.status(req, res),
    latency: `${tokens['response-time'](req, res)} ms`
  });
}, {
  stream: {
    write: (message) => logger.http(message.trim())
  }
}));

// 6. Rate Limiting
app.use('/api/', apiLimiter);
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1/chat', authLimiter);

// 7. Health Check
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'ok' : 'error'
  });
});

// 6. Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 7. Routes
app.use('/api/v1', routes);

// 8. Global Error Handler (Must be last)
app.use(errorMiddleware);

module.exports = app;
