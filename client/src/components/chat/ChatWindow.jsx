import React from 'react';
import { useChat } from '../../context/ChatContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatWindow = () => {
  const { activeSessionId, messages, error, setError } = useChat();

  return (
    <div className="chat-main-premium">
      <div className="chat-main-topbar">
        {error && (
          <div className="mr-auto bg-red-500/10 text-red-500 px-4 py-1.5 rounded-full border border-red-500/20 flex items-center gap-3 animate-pulse">
            <span className="text-[10px] font-bold uppercase tracking-wider">{error}</span>
            <button onClick={() => setError(null)} className="text-[10px] font-black uppercase hover:underline">Dismiss</button>
          </div>
        )}
        <button className="chat-model-pill" type="button">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span>Model 2.5 Flash</span>
          <span className="text-[10px] opacity-50">⌄</span>
        </button>
      </div>

      {!activeSessionId || messages.length === 0 ? (
        <div className="chat-empty-center">
          <div className="chat-hero-panel">
            <h1 className="chat-hero-title">What’s on your mind today?</h1>
            <ChatInput variant="hero" />
            <div className="chat-quick-actions">
              <button className="chat-quick-pill">✦ AI script writer</button>
              <button className="chat-quick-pill">✦ Coding Assistant</button>
              <button className="chat-quick-pill">✦ Essay writer</button>
              <button className="chat-quick-pill">✦ Business</button>
              <button className="chat-quick-pill">✦ Translate</button>
              <button className="chat-quick-pill">✦ YouTube summaries</button>
              <button className="chat-quick-pill">✦ AI Email writing</button>
              <button className="chat-quick-pill">✦ AI pdf chat</button>
              <button className="chat-quick-pill">✦ Research assistant</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-messages-layout">
          <MessageList />
          <div className="mt-auto pt-6">
            <ChatInput />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
