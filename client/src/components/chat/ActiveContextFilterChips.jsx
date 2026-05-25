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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all shadow-sm backdrop-blur-md"
        >
          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Filter Context
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-64 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-[#0f172a] shadow-2xl z-50 p-2 backdrop-blur-xl">
            <div className="text-[10px] font-black text-white/50 uppercase tracking-widest px-2 pb-2 border-b border-white/10 mb-2 flex justify-between items-center">
              <span>Available Documents</span>
              {selectedDocumentIds.length > 0 && (
                <button type="button" onClick={handleClearAll} className="text-cyan-400 hover:text-cyan-300">Clear</button>
              )}
            </div>
            {readyDocuments.length === 0 ? (
              <div className="px-2 py-3 text-xs text-white/50 text-center font-medium">No ready documents.</div>
            ) : (
              readyDocuments.map(doc => {
                const isSelected = selectedDocumentIds.includes(doc._id);
                return (
                  <button
                    key={doc._id}
                    type="button"
                    onClick={() => handleToggleDocument(doc._id)}
                    className="flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-white/20'}`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-white/90 truncate flex-1 font-medium">{doc.title}</span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ── Active Filters ── */}
      {selectedDocumentIds.length === 0 ? (
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest px-2">Searching Entire Vault</span>
      ) : (
        selectedDocumentIds.map(docId => {
          const doc = documents.find(d => d._id === docId);
          if (!doc) return null;
          return (
            <div key={docId} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-200">
              <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate max-w-[120px]">{doc.title}</span>
              <button
                type="button"
                onClick={() => handleToggleDocument(doc._id)}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-cyan-500/20 text-cyan-400 transition-colors ml-1"
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
