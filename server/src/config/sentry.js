const logger = require('./logger');

const initSentry = (app) => {
  if (process.env.SENTRY_DSN_NODE && process.env.SENTRY_DSN_NODE !== 'https://xxx@o0.ingest.sentry.io/xxx') {
    try {
      const Sentry = require('@sentry/node');
      Sentry.init({
        dsn: process.env.SENTRY_DSN_NODE,
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV || 'development',
      });
      logger.info('Sentry initialized');
    } catch (err) {
      logger.warn('Sentry initialization failed, skipping:', err.message);
    }
  } else {
    logger.warn('Sentry DSN not configured, skipping initialization');
  }
};

module.exports = initSentry;