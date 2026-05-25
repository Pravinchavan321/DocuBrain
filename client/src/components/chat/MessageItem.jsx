import React, { useState, useEffect } from 'react';
import SourceList from './SourceList';
import MarkdownText from './MarkdownText';

const MessageItem = React.memo(({ message }) => {
  const isUser = message.role === 'user';
  const [activeModalSourceIndex, setActiveModalSourceIndex] = useState(null);

  useEffect(() => {
    const handleOpenModal = (e) => {
      // Only handle if this message has the corresponding source
      if (!isUser && message.sources && message.sources.length >= e.detail.sourceIndex) {
        setActiveModalSourceIndex(e.detail.sourceIndex);
      }
    };
    window.addEventListener('open-source-modal', handleOpenModal);
    return () => window.removeEventListener('open-source-modal', handleOpenModal);
  }, [message, isUser]);

  const activeSource = activeModalSourceIndex && message.sources ? message.sources[activeModalSourceIndex - 1] : null;

  return (
    <>
      <div className={`chat-message-row ${isUser ? 'user' : 'assistant'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
        <div className="chat-message-avatar">
          {isUser ? 'U' : 'AI'}
        </div>
        
        <div className="chat-message-bubble-premium">
          <MarkdownText content={message.content} />
          
        {!isUser && !message.isError && message.metadata?.retrieval?.totalRetrieved > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
               <SourceList sources={message.sources} retrieval={message.metadata.retrieval} />
            </div>
          )}

          {!isUser && !message.isError && message.metadata?.followUpQuestions && message.metadata.followUpQuestions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {message.metadata.followUpQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const event = new CustomEvent('send-followup', { detail: { text: q } });
                    window.dispatchEvent(event);
                  }}
                  className="px-3 py-1.5 text-[11px] font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all text-left"
                >
                  <span className="opacity-50 mr-1.5">↳</span>
                  {q}
                </button>
              ))}
            </div>
          )}

          {message.isError && (
            <div className="mt-2 text-red-400 text-xs font-bold uppercase tracking-tight">
              Error occurred. Please try again.
            </div>
          )}
        </div>
      </div>

      {/* Interactive Citation Modal */}
      {activeSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setActiveModalSourceIndex(null)}>
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
              <h3 className="font-display font-semibold text-lg text-white">
                Citation Context
              </h3>
              <button 
                onClick={() => setActiveModalSourceIndex(null)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-1 rounded">
                  Source {activeModalSourceIndex}
                </span>
                <span className="text-sm font-medium text-white/90 truncate">
                  {activeSource.title || activeSource.filename || "Unknown Document"}
                </span>
              </div>
              
              <div className="bg-black/30 rounded-xl p-4 border border-white/5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <p className="text-sm text-white/80 leading-relaxed font-mono">
                  {activeSource.preview || "No preview available for this source."}
                </p>
              </div>
              
              <div className="mt-4 flex justify-between items-center text-xs text-white/40 font-semibold tracking-wider uppercase">
                <span>Confidence Score: {activeSource.score ? activeSource.score : "N/A"}</span>
                <span>Document ID: {activeSource.documentId ? activeSource.documentId.substring(0, 8) + '...' : "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default MessageItem;
