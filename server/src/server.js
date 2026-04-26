const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const logger = require('./config/logger');
const { validateEnv, PORT } = require('./config/env');
const connectMongo = require('./config/db.mongo');
const initSentry = require('./config/sentry');

const startServer = async () => {
  try {
    logger.info('Starting server initialization...');
    validateEnv();

    initSentry(app);

    await connectMongo();
    logger.info('MongoDB connection established');

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.id}`);
      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
      });
    });

    server.listen(PORT, () => {
      logger.info(`DocuBrain Backend running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();