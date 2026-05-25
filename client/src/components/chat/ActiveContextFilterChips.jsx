import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useDocuments } from '../../context/DocumentContext';

const ActiveContextFilterChips = () => {
  const { getActiveSettings, updateRagSettings } = useChat();
  const { documents, fetchDocuments } = useDocuments();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (documents.length === 0) {
      fetchDocuments();
    }
  }, [documents.length, fetchDocuments]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const settings = getActiveSettings();
  const selectedDocumentIds = settings.selectedDocumentIds || [];
  
  const readyDocuments = documents.filter(doc => doc.status === 'ready');

  const handleToggleDocument = (docId) => {
    const isSelected = selectedDocumentIds.includes(docId);
    let newSelection;
    if (isSelected) {
      newSelection = selectedDocumentIds.filter(id => id !== docId);
    } else {
      newSelection = [...selectedDocumentIds, docId];
    }
    updateRagSettings({ selectedDocumentIds: newSelection });
  };

  const handleClearAll = () => {
    updateRagSettings({ selectedDocumentIds: [] });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2 items-center relative">
      {/* ── Add Document Filter Button ── */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--fx-primary)] text-xs font-bold text-[var(--text-primary)] transition-all shadow-sm backdrop-blur-md"
        >
          <svg className="w-3.5 h-3.5 text-[var(--fx-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Filter Context
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-64 max-h-60 overflow-y-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl z-50 p-2 backdrop-blur-xl">
            <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest px-2 pb-2 border-b border-[var(--border-color)] mb-2 flex justify-between items-center">
              <span>Available Documents</span>
              {selectedDocumentIds.length > 0 && (
                <button type="button" onClick={handleClearAll} className="text-[var(--fx-accent)] hover:opacity-80">Clear</button>
              )}
            </div>
            {readyDocuments.length === 0 ? (
              <div className="px-2 py-3 text-xs text-[var(--text-secondary)] text-center font-medium">No ready documents.</div>
            ) : (
              readyDocuments.map(doc => {
                const isSelected = selectedDocumentIds.includes(doc._id);
                return (
                  <button
                    key={doc._id}
                    type="button"
                    onClick={() => handleToggleDocument(doc._id)}
                    className="flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg hover:bg-[var(--border-color)] transition-colors"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-[var(--fx-accent)] border-[var(--fx-accent)]' : 'border-[var(--border-color)]'}`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-primary)] truncate flex-1 font-medium">{doc.title}</span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ── Active Filters ── */}
      {selectedDocumentIds.length === 0 ? (
        <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest px-2">Searching Entire Vault</span>
      ) : (
        selectedDocumentIds.map(docId => {
          const doc = documents.find(d => d._id === docId);
          if (!doc) return null;
          return (
            <div key={docId} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--fx-accent)]/10 border border-[var(--fx-accent)]/20 text-xs font-bold text-[var(--text-primary)]">
              <svg className="w-3.5 h-3.5 opacity-70 text-[var(--fx-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate max-w-[120px]">{doc.title}</span>
              <button
                type="button"
                onClick={() => handleToggleDocument(doc._id)}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[var(--fx-accent)]/20 text-[var(--fx-accent)] transition-colors ml-1"
              >
                ✕
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ActiveContextFilterChips;
