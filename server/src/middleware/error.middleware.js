const logger = require('../config/logger');

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(JSON.stringify({
    requestId: req.id,
    userId: req.user?.id || 'unauthenticated',
    route: req.path,
    status: statusCode,
    error: err.message,
    stack: err.stack
  }));

  res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
};

module.exports = errorMiddleware;
