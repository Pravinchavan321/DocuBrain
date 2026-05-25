import React from 'react';
import { useChat } from '../../context/ChatContext';

const STARTER_PROMPTS = [
  { id: 1, text: "Summarize this document", icon: "📄" },
  { id: 2, text: "Find key risks", icon: "⚠️" },
  { id: 3, text: "Extract financial highlights", icon: "💰" },
  { id: 4, text: "Create action points", icon: "✅" }
];

const StarterCards = () => {
  const { sendMessage, activeSessionId, createSession, sending } = useChat();

  const handlePromptClick = async (promptText) => {
    if (sending) return;
    try {
      if (!activeSessionId) {
        await createSession();
      }
      await sendMessage(promptText);
    } catch (err) {
      console.error("Failed to send starter prompt", err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => handlePromptClick(prompt.text)}
            disabled={sending}
            className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              {prompt.icon}
            </div>
            <div className="flex-1">
              <span className="block text-sm font-bold text-white/90">{prompt.text}</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarterCards;
