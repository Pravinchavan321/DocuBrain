import React, { useState, useRef } from 'react';
import { useDocuments } from '../../context/DocumentContext';

const DocumentItem = ({ document }) => {
  const { deleteDoc, ingest } = useDocuments();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const isProcessing = document.status === 'processing';
  const isFailed = document.status === 'failed';
  const fileName = document.originalName || document.fileName || document.title || 'Untitled Document';

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getStatusBadge = () => {
    if (isProcessing) {
      return <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 animate-pulse">Syncing...</span>;
    }
    if (isFailed) {
      return <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Failed</span>;
    }
    return <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Vectorized</span>;
  };

  const getFileIcon = (filename) => {
    if (!filename) return '📄';
    if (filename.endsWith('.pdf')) return '📕';
    if (filename.endsWith('.txt')) return '📄';
    if (filename.endsWith('.doc') || filename.endsWith('.docx')) return '📘';
    if (filename.endsWith('.md')) return '📝';
    return '📄';
  };

  const fileSizeStr = formatFileSize(document.size);

  return (
    <article className={`knowledge-document-item group animate-in fade-in slide-in-from-bottom-2 ${isDeleting ? 'opacity-30 pointer-events-none' : ''}`}>
      <div className="knowledge-doc-icon text-lg">
        {getFileIcon(fileName)}
      </div>
      
      <div className="knowledge-doc-main">
        <strong title={fileName}>{fileName}</strong>
        <span>
          {getStatusBadge()} • {fileSizeStr} • {new Date(document.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>
      
      <div className="knowledge-doc-actions">
        {isFailed && (
          <button 
            onClick={() => {
              if (isRetrying) return;
              setIsRetrying(true);
              ingest(document._id).finally(() => {
                setTimeout(() => setIsRetrying(false), 3000);
              });
            }}
            disabled={isRetrying}
            className="knowledge-doc-action-btn hover:text-cyan-400"
            title="Retry Ingestion"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}

        {showConfirm ? (
          <div className="flex items-center gap-1 animate-in slide-in-from-right-2">
            <button 
              onClick={async () => {
                if (isDeleting) return;
                setIsDeleting(true);
                await deleteDoc(document._id);
                setIsDeleting(false);
                setShowConfirm(false);
              }}
              disabled={isDeleting}
              className="text-[10px] font-black uppercase px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
            <button 
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="text-[10px] font-black uppercase px-3 py-1 bg-white/10 text-[var(--text-primary)] rounded-lg"
            >
              No
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowConfirm(true)}
            className="knowledge-doc-action-btn hover:text-red-400 group-hover:opacity-100 opacity-40 transition-opacity"
            title="Delete document"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
};

export default React.memo(DocumentItem);
