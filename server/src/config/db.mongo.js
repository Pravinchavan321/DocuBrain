const mongoose = require('mongoose');
const logger = require('./logger');
const { MONGODB_URI } = require('./env');

const connectMongo = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB connected successfully via Mongoose');

    // Cleanly drop the old buggy unique sparse index so that the new partial index can be built
    try {
      await mongoose.connection.db.collection('chatmessages').dropIndex('sessionId_1_idempotencyKey_1_role_1');
      logger.info('Successfully dropped old unique sparse index sessionId_1_idempotencyKey_1_role_1');
    } catch (indexErr) {
      // The index might not exist or already be dropped, which is fine
      logger.info(`Buggy index check/drop (sessionId_1_idempotencyKey_1_role_1): ${indexErr.message}`);
    }
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
