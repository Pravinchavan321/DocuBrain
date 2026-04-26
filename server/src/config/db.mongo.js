const mongoose = require('mongoose');
const logger = require('./logger');
const { MONGODB_URI } = require('./env');

const connectMongo = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB connected successfully via Mongoose');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error handler:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected');
});

module.exports = connectMongo;
