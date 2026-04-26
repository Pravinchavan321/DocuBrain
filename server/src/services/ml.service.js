const axios = require('axios');
const logger = require('../config/logger');

const delay = ms => new Promise(res => setTimeout(res, ms));

const isRetryableError = (error) => {
  if (['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT'].includes(error.code)) return true;
  if (error.message && error.message.toLowerCase().includes('timeout')) return true;
  
  const status = error.response?.status || error.status;
  if (status) {
    if ([429, 500, 502, 503, 504].includes(status)) return true;
    if ([400, 401, 403, 404].includes(status)) return false;
  }
  
  return false;
};

class MLService {
  constructor() {
    this.baseUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000/ml/v1';
    
    if (!this.baseUrl.startsWith('http://') && !this.baseUrl.startsWith('https://')) {
      logger.error('ML_SERVICE_URL is improperly configured natively breaking HTTP constraints.');
    }
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000 // Safely adding 30s timeout natively preventing hanging queues
    });
  }

  async storeChunk({ id, text, metadata }) {
    try {
      const response = await this.client.post('/store', {
        id,
        text,
        metadata
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      logger.error(`ML Service /store Error [${id}]: ${msg}`);
      throw new Error(`ML Service /store failed: ${msg}`);
    }
  }

  async queryVector(query) {
    const maxRetries = 2;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.post('/query', { query });
        return response.data;
      } catch (error) {
        const msg = error.response?.data?.message || error.message;
        
        if (!isRetryableError(error) || attempt === maxRetries) {
          logger.error(`ML Service Vector Extraction Query Error: ${msg} - Not retryable or max attempts reached.`);
          throw new Error(`ML Service /query failed: ${msg}`);
        }

        logger.warn(`ML Service Vector Extraction Query Error on attempt ${attempt}: ${msg} - Retrying...`);
        await delay(1000); // 1 second backoff
      }
    }
  }
}

module.exports = new MLService();
