const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const logger = require('../config/logger');

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        full_name: decoded.full_name,
      };

      next();
    } catch (error) {
      logger.error('Authentication error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
        error: error.message,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
      error: 'AccessTokenMissing',
    });
  }
};

module.exports = { protect };
