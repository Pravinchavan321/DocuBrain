import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import * as docApi from '../api/document.api';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const DocumentContext = createContext();

export const useDocuments = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }) => {
  const { logout } = useAuth();
  const { showToast } = useUI();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const normalizeDoc = (doc) => {
    let status = doc.ingestionStatus || doc.status;
    if (!status) status = 'processing';
    if (status === 'completed') status = 'ready';
    if (!['processing', 'ready', 'failed'].includes(status)) status = 'processing';
    return { ...doc, status };
  };

  const handleError = useCallback((err, defaultMsg) => {
    if (err.response?.status === 401) {
      logout();
    } else {
      setError(defaultMsg);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setError(null), 5000);
    }
  }, [logout]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await docApi.getDocuments();
      const fetchedDocs = data.documents || data || [];
      setDocuments(fetchedDocs.map(normalizeDoc));
    } catch (err) {
      handleError(err, 'Failed to fetch documents.');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const upload = useCallback(async (file) => {
    setUploading(true);
    setError(null);
    try {
      const data = await docApi.uploadDocument(file);
      const newDoc = normalizeDoc(data.document || data);
      setDocuments(prev => [newDoc, ...prev]);
      showToast('Document uploaded successfully!');
      return newDoc;
    } catch (err) {
      handleError(err, 'Failed to upload document.');
      throw err;
    } finally {
      setUploading(false);
    }
  }, [handleError, showToast]);

  const ingest = useCallback(async (documentId) => {
    setIngesting(true);
    setError(null);
    
    setDocuments(prev => prev.map(d => d._id === documentId ? { ...d, status: 'processing' } : d));
    
    try {
      const data = await docApi.ingestDocument(documentId);
      const readyDoc = normalizeDoc(data.document || data);
      setDocuments(prev => prev.map(d => d._id === readyDoc._id ? readyDoc : d));
      showToast('Document processed and indexed!');
      return readyDoc;
    } catch (err) {
      setDocuments(prev => prev.map(d => d._id === documentId ? { ...d, status: 'failed' } : d));
      handleError(err, 'Failed to process document.');
      throw err;
    } finally {
      setIngesting(false);
    }
  }, [handleError, showToast]);

  const deleteDoc = useCallback(async (documentId) => {
    setError(null);
    const previousDocs = [...documents];
    setDocuments(prev => prev.filter(d => d._id !== documentId));
    
    try {
      await docApi.deleteDocument(documentId);
      showToast('Document deleted.');
    } catch (err) {
      setDocuments(previousDocs);
      handleError(err, 'Failed to delete document.');
    }
  }, [documents, handleError, showToast]);

  return (
    <DocumentContext.Provider value={{
      documents,
      loading,
      uploading,
      ingesting,
      error,
      setError,
      fetchDocuments,
      upload,
      ingest,
      deleteDoc
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentContext;
