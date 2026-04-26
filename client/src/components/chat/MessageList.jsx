import React, { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import MessageItem from './MessageItem';

const MessageList = () => {
  const { messages, messagesLoading, sending } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  if (messagesLoading && messages.length === 0) {
    return (
      <div className="chat-message-list-premium flex items-center justify-center">
         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="chat-message-list-premium no-scrollbar">
      {messages.map((message) => (
        <MessageItem key={message._id} message={message} />
      ))}
      
      {sending && messages[messages.length - 1]?.role === 'user' && (
        <div className="chat-message-row assistant animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="chat-message-avatar">AI</div>
          <div className="chat-message-bubble-premium flex items-center gap-3">
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-4" />
    </div>
  );
};

export default MessageList;
