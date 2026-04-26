import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useDocuments } from '../../context/DocumentContext';

const RagSettingsPanel = () => {
  const { getActiveSettings, updateRagSettings } = useChat();
  const { 
    selectedDocumentIds = [],
    topK = 5,
    minScore = 0.1,
    includeSources = true,
    includeChunks = true
  } = getActiveSettings();
  
  const { documents } = useDocuments();
  const [isOpen, setIsOpen] = useState(false);

  const readyDocs = documents.filter(d => d.status === 'ready' || d.status === 'completed');

  const toggleDoc = (id) => {
    const isSelected = selectedDocumentIds.includes(id);
    updateRagSettings({
      selectedDocumentIds: isSelected 
        ? selectedDocumentIds.filter(docId => docId !== id) 
        : [...selectedDocumentIds, id]
    });
  };

  const useAll = () => updateRagSettings({ selectedDocumentIds: [] });

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center text-xs text-[var(--text-secondary)] hover:text-[var(--fx-primary)] font-medium py-2 focus:outline-none transition-colors mb-2"
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Retrieval Settings
      </button>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-xl rounded-xl shadow-lg p-5 text-sm mb-4 w-full">
      <div className="flex justify-between items-center mb-5 border-b border-[var(--border-color)] pb-3">
        <h3 className="font-semibold text-[var(--text-primary)] flex items-center">
          <svg className="w-4 h-4 mr-2 text-[var(--fx-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Advanced Retrieval
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-50 transition-colors focus:outline-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[var(--text-primary)] font-medium">Document Scope</label>
            <button 
              onClick={useAll} 
              className="text-xs text-[var(--fx-primary)] hover:opacity-80 font-medium focus:outline-none"
            >
              Select All
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto border border-[var(--border-color)] rounded-lg p-2 bg-black/10 space-y-1">
            {readyDocs.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-2">No ready documents available.</p>
            ) : (
              readyDocs.map(doc => (
                <label key={doc._id} className="flex items-center space-x-3 p-2 hover:bg-[var(--fx-primary)]/10 rounded cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedDocumentIds.length === 0 || selectedDocumentIds.includes(doc._id)}
                    onChange={() => toggleDoc(doc._id)}
                    className="form-checkbox h-4 w-4 text-[var(--fx-primary)] border-[var(--border-color)] rounded focus:ring-[var(--fx-primary)]"
                  />
                  <span className="text-gray-700 text-xs truncate flex-1" title={doc.filename || doc.title}>{doc.filename || doc.title}</span>
                </label>
              ))
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {selectedDocumentIds.length === 0 ? 'Using all documents' : `Using ${selectedDocumentIds.length} selected document(s)`}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[var(--text-primary)] font-medium">Top K Chunks</label>
              <span className="text-xs font-semibold bg-black/20 text-[var(--text-primary)] px-2 py-1 rounded">{topK}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={topK} 
              onChange={(e) => updateRagSettings({ topK: parseInt(e.target.value) })}
              className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer accent-[var(--fx-primary)]"
            />
            <p className="text-xs text-gray-500 mt-1.5">Maximum chunks to retrieve</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium">Min Relevance Score</label>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">{minScore.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={minScore} 
              onChange={(e) => updateRagSettings({ minScore: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-xs text-gray-500 mt-1.5">Higher score requires stricter matches</p>
          </div>

          <div className="flex items-center space-x-6 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={includeSources}
                onChange={(e) => updateRagSettings({ includeSources: e.target.checked })}
                className="form-checkbox h-4 w-4 text-[var(--fx-primary)] border-[var(--border-color)] rounded focus:ring-[var(--fx-primary)]"
              />
              <span className="text-[var(--text-primary)] font-medium text-sm">Include Sources</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={includeChunks}
                onChange={(e) => updateRagSettings({ includeChunks: e.target.checked })}
                disabled={!includeSources}
                className="form-checkbox h-4 w-4 text-[var(--fx-primary)] border-[var(--border-color)] rounded focus:ring-[var(--fx-primary)] disabled:opacity-50"
              />
              <span className={`text-sm font-medium ${!includeSources ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>Include Previews</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RagSettingsPanel;
