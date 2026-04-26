import apiClient from './axios';
import { getRefreshToken } from '../utils/storage';

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const registerUser = async (payload) => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

/**
 * Log in a user
 * POST /api/v1/auth/login
 */
export const loginUser = async (payload) => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data;
};

/**
 * Log out a user
 * POST /api/v1/auth/logout
 * Sends the stored refresh_token so the server can invalidate the session.
 * No Authorization header required — route is public.
 */
export const logoutUser = async () => {
  const refresh_token = getRefreshToken(); // ✅ FIX: was sending empty body before
  const response = await apiClient.post('/auth/logout', { refresh_token });
  return response.data;
};

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 */
export const refreshAccessToken = async () => {
  const refresh_token = getRefreshToken();
  const response = await apiClient.post('/auth/refresh', { refresh_token });
  return response.data;
};

/**
 * Get current user profile
 * GET /api/v1/auth/me
 */
export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};
