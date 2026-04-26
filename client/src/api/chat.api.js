import apiClient from './axios';

const unwrap = (res) => res.data?.data || res.data;

export const getSessions = async (page = 1, limit = 20) => {
  const response = await apiClient.get('/chat/sessions', { params: { page, limit } });
  return unwrap(response);
};

export const createSession = async (title = '') => {
  const response = await apiClient.post('/chat/sessions', { title });
  return unwrap(response);
};

export const getMessages = async (sessionId, page = 1, limit = 50) => {
  const response = await apiClient.get(`/chat/sessions/${sessionId}/messages`, { params: { page, limit } });
  return unwrap(response);
};

export const sendMessage = async (sessionId, message, options, idempotencyKey) => {
  const response = await apiClient.post(`/chat/sessions/${sessionId}/messages`, { message, options }, {
    headers: {
      'X-Idempotency-Key': idempotencyKey
    }
  });
  return unwrap(response);
};

export const deleteSession = async (sessionId) => {
  const response = await apiClient.delete(`/chat/sessions/${sessionId}`);
  return unwrap(response);
};

export const deleteAllSessions = async () => {
  const response = await apiClient.delete('/chat/sessions');
  return unwrap(response);
};

