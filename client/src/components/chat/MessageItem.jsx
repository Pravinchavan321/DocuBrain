import React from 'react';
import SourceList from './SourceList';
import MarkdownText from './MarkdownText';

const MessageItem = React.memo(({ message }) => {
  const isUser = message.role === 'user';

  return (
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


        {message.isError && (
          <div className="mt-2 text-red-400 text-xs font-bold uppercase tracking-tight">
            Error occurred. Please try again.
          </div>
        )}
      </div>
    </div>
  );
});

export default MessageItem;
