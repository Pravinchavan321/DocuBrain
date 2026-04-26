import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDocuments } from '../../context/DocumentContext';
import DocumentItem from './DocumentItem';

const DocumentList = () => {
  const { documents, loading, fetchDocuments } = useDocuments();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  if (loading && documents.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center space-x-4 w-1/2">
              <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
              <div className="flex flex-col space-y-2 w-full">
                <div className="h-4 bg-white/10 rounded-lg w-3/4"></div>
                <div className="h-3 bg-white/5 rounded-lg w-1/4"></div>
              </div>
            </div>
            <div className="w-20 h-6 bg-white/10 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  const filteredDocs = documents.filter(doc => 
    (doc.originalName || doc.fileName || doc.title || '').toLowerCase().includes(searchQuery)
  );

  if (documents.length === 0) {
    return (
      <div className="knowledge-empty-state">
        <div>
          <div className="knowledge-empty-icon text-2xl">📄</div>
          <h3>No documents yet</h3>
          <p>Upload a document to activate RAG-powered answers.</p>
        </div>
      </div>
    );
  }

  if (filteredDocs.length === 0 && searchQuery) {
    return (
      <div className="knowledge-empty-state">
        <div>
          <div className="knowledge-empty-icon">🔍</div>
          <h3>No results found</h3>
          <p>No documents match your search query: "{searchQuery}"</p>
        </div>
      </div>
    );
  }

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    if (timeB === timeA) {
      return (a._id || '').localeCompare(b._id || '');
    }
    return timeB - timeA;
  });

  return (
    <div className="knowledge-document-list">
      {sortedDocs.map(doc => (
        <DocumentItem key={doc._id} document={doc} />
      ))}
    </div>
  );
};

export default DocumentList;
