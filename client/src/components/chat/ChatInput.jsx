import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';

const AUTOCOMPLETE_SUGGESTIONS = [
  { trigger: "what is the revenue", suggestions: ["for Q3 2023?", "for North America?", "year over year?"] },
  { trigger: "summarize", suggestions: ["the key findings", "the executive summary", "the financial risks"] },
  { trigger: "find", suggestions: ["all mentions of compliance", "the latest financial metrics", "action items in the document"] },
  { trigger: "explain", suggestions: ["the pricing strategy", "the technical architecture", "how the integration works"] }
];

const ChatInput = ({ variant = 'default' }) => {
  const [text, setText] = useState('');
  const { sendMessage, sending, activeSessionId, createSession } = useChat();
  const textareaRef = useRef(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  // Handle Autocomplete Logic
  useEffect(() => {
    const lowerText = text.toLowerCase().trim();
    if (lowerText.length < 3) {
      setShowSuggestions(false);
      return;
    }

    const match = AUTOCOMPLETE_SUGGESTIONS.find(item => lowerText.startsWith(item.trigger));
    if (match) {
      setCurrentSuggestions(match.suggestions);
      setShowSuggestions(true);
      setSelectedIndex(0);
    } else {
      setShowSuggestions(false);
    }
  }, [text]);

  const applySuggestion = (suggestion) => {
    // Replace the end of the trigger with the full phrase or just append
    const match = AUTOCOMPLETE_SUGGESTIONS.find(item => text.toLowerCase().trim().startsWith(item.trigger));
    if (match) {
      // Keep original casing for the trigger part
      const triggerPart = text.substring(0, match.trigger.length);
      setText(`${triggerPart} ${suggestion} `);
    }
    setShowSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    const handleSendFollowUp = async (e) => {
      if (e.detail?.text) {
        if (!activeSessionId) {
          try {
            await createSession();
          } catch (err) {
            console.error(err);
          }
        }
        await sendMessage(e.detail.text);
      }
    };
    window.addEventListener('send-followup', handleSendFollowUp);
    return () => window.removeEventListener('send-followup', handleSendFollowUp);
  }, [sendMessage, activeSessionId, createSession]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    
    setShowSuggestions(false);

    if (variant === 'hero' && !activeSessionId) {
      try {
        await createSession();
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
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % currentSuggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + currentSuggestions.length) % currentSuggestions.length);
        return;
      }
      if (e.key === 'Tab' || (e.key === 'Enter' && !e.shiftKey)) {
        e.preventDefault();
        applySuggestion(currentSuggestions[selectedIndex]);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  return (
    <form className="chat-composer-premium relative" onSubmit={handleSubmit}>
      {/* ── Autocomplete Dropdown ── */}
      {showSuggestions && currentSuggestions.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-[#0f172a]/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden z-50 animate-fade-in-up">
          <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5">
            Suggestions
          </div>
          <div className="p-1">
            {currentSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applySuggestion(suggestion)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  idx === selectedIndex ? 'bg-cyan-500/20 text-cyan-200' : 'text-white/80 hover:bg-white/5'
                }`}
              >
                <span className="opacity-50">↳</span>
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

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
