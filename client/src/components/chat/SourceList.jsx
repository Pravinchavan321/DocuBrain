import React, { useState } from 'react';

const SourceList = ({ sources, retrieval }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const safeSources = sources || [];

  if (safeSources.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
      <div className="flex items-center justify-between mb-3">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-xs font-semibold text-[var(--fx-primary)] hover:opacity-80 transition-colors focus:outline-none"
        >
          <svg className={`w-4 h-4 mr-1.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
          Sources ({safeSources.length})
        </button>
        {retrieval && (
          <div className="text-[10px] text-[var(--text-secondary)] flex items-center gap-2">
            <span>Used {retrieval.documentsUsed} doc{retrieval.documentsUsed !== 1 ? 's' : ''}</span>
            <span>&bull;</span>
            <span>TopK: {retrieval.topK}</span>
            <span>&bull;</span>
            <span>MinScore: {retrieval.minScore}</span>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 gap-3 mt-3">
          {safeSources.map((src, idx) => {
            const preview = src.preview || src.chunkTextPreview || "";
            const title = src.title || src.filename || 'Unknown Document';
            const score = src.score || 0;
            return (
              <div key={idx} className="bg-black/10 rounded-lg p-3 border border-[var(--border-color)] shadow-sm">
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-xs font-semibold text-[var(--text-primary)] truncate pr-3" title={title}>
                    {title}
                  </span>
                  <span className="text-[10px] bg-black/20 text-[var(--text-primary)] px-1.5 py-0.5 rounded font-mono border border-[var(--border-color)] shrink-0">
                    {score ? `Score: ${score}` : 'Metadata'}
                  </span>
                </div>
                {preview && (
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed italic border-l-2 border-[var(--fx-primary)] pl-2 mt-2">
                    "{preview}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SourceList;
