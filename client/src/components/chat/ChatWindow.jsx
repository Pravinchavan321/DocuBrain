import React from 'react';
import { useChat } from '../../context/ChatContext';
import { useUI } from '../../context/UIContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import StarterCards from './StarterCards';
import ActiveContextFilterChips from './ActiveContextFilterChips';
import PremiumThemePortalToggle from '../common/PremiumThemePortalToggle';

const ChatWindow = () => {
  const { activeSessionId, messages, error, setError } = useChat();
  const { isDark, toggleTheme } = useUI();

  return (
    <div className="chat-main-premium">
      <div className="chat-main-topbar">
        {error && (
          <div className="mr-auto bg-red-500/10 text-red-500 px-4 py-1.5 rounded-full border border-red-500/20 flex items-center gap-3 animate-pulse">
            <span className="text-[10px] font-bold uppercase tracking-wider">{error}</span>
            <button onClick={() => setError(null)} className="text-[10px] font-black uppercase hover:underline">Dismiss</button>
          </div>
        )}
        <div className="flex items-center gap-4 ml-auto">
          <PremiumThemePortalToggle isDark={isDark} onToggle={toggleTheme} />
          <button className="chat-model-pill" type="button">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span>Model 2.5 Flash</span>
            <span className="text-[10px] opacity-50">⌄</span>
          </button>
        </div>
      </div>

      {!activeSessionId || messages.length === 0 ? (
        <div className="chat-empty-center">
          <div className="chat-hero-panel">
            <h1 className="chat-hero-title font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">What’s on your mind today?</h1>
            <ActiveContextFilterChips />
            <ChatInput variant="hero" />
            <StarterCards />
          </div>
        </div>
      ) : (
        <div className="chat-messages-layout">
          <MessageList />
          <div className="mt-auto pt-6 flex flex-col items-center">
            <div className="w-full max-w-4xl mx-auto flex flex-col">
              <ActiveContextFilterChips />
              <ChatInput />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
