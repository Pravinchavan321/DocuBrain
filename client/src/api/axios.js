import axios from 'axios';
import { getAccessToken, clearAuthStorage } from '../utils/storage';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("Missing VITE_API_BASE_URL in environment variables.");
}

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Global Error Normalization
    if (error.response?.status === 401) {
      clearAuthStorage();
      window.dispatchEvent(new CustomEvent('unauthorized'));
    } else if (error.response?.status === 429) {
      window.dispatchEvent(new CustomEvent('globalError', { detail: 'Too many requests. Please try again later.' }));
    } else if (error.response?.status === 504 || error.code === 'ECONNABORTED') {
      window.dispatchEvent(new CustomEvent('globalError', { detail: 'The server took too long to respond. Please try again.' }));
    }
    
    // Retry Strategy for Chat/Query
    const config = error.config;
    if (config) {
      if (!config.retryCount) config.retryCount = 0;
      
      if (config.retryCount < 2 && (!error.response || error.response.status >= 500)) {
        if (config.url?.includes('/chat') || config.url?.includes('/query')) {
          config.retryCount += 1;
          const backoff = Math.pow(2, config.retryCount) * 1000;
          await new Promise(res => setTimeout(res, backoff));
          return apiClient(config);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
