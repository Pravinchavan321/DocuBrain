import apiClient from './axios';

const unwrap = (res) => res.data?.data || res.data;

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrap(response);
};

export const ingestDocument = async (documentId) => {
  const response = await apiClient.post(`/ingest/${documentId}`);
  return unwrap(response);
};

export const getDocuments = async () => {
  const response = await apiClient.get('/documents');
  return unwrap(response);
};

export const deleteDocument = async (documentId) => {
  const response = await apiClient.delete(`/documents/${documentId}`);
  return unwrap(response);
};
