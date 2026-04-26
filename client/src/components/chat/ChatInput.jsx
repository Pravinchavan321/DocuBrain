import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';

const ChatInput = ({ variant = 'default' }) => {
  const [text, setText] = useState('');
  const { sendMessage, sending, activeSessionId, createSession } = useChat();
  const textareaRef = useRef(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    
    // If we're in the hero view and no active session, create one first
    if (variant === 'hero' && !activeSessionId) {
      try {
        const newSession = await createSession();
        await sendMessage(trimmed);
      } catch (err) {
        console.error("Failed to start session from hero", err);
      }
    } else {
      await sendMessage(trimmed);
    }
    
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  return (
    <form className="chat-composer-premium" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isOffline ? "You are offline" : "Message DocuBrain AI..."}
        disabled={sending || isOffline}
        rows="1"
      />

      <div className="chat-composer-actions">
        <div className="chat-composer-left">
          <button type="button" className="chat-tool-btn" title="Shortcuts">⌘</button>
          <button type="button" className="chat-tool-btn">🌐 Search</button>
          <button type="button" className="chat-tool-btn">✦ Create image</button>
        </div>

        <div className="chat-composer-right">
          <button type="button" className="chat-tool-btn">🎙</button>
          <button 
            type="submit" 
            className="chat-send-premium" 
            disabled={!text.trim() || sending || isOffline}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
               <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
