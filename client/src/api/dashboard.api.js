import apiClient from './axios';

/**
 * Get dashboard summary data
 * @returns {Promise<Object>}
 */
export const getDashboardSummary = async () => {
  try {
    const response = await apiClient.get('/dashboard/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

/**
 * Get recent activity list
 * @param {number} limit 
 * @returns {Promise<Object>}
 */
export const getRecentActivity = async (limit = 5) => {
  try {
    const response = await apiClient.get(`/dashboard/recent-activity?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};
