import React from 'react';
import { useChat } from '../../context/ChatContext';
import { useNavigate } from 'react-router-dom';

const SessionItem = ({ session }) => {
  const { activeSessionId, fetchMessages, deleteSession } = useChat();
  const navigate = useNavigate();
  const isActive = activeSessionId === session._id;

  const handleSelect = async () => {
    await fetchMessages(session._id);
    navigate('/chat');
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this conversation?")) {
      deleteSession(session._id);
    }
  };

  return (
    <div className={`chat-session-premium group ${isActive ? "active" : ""}`} onClick={handleSelect}>
      <span className="chat-menu-icon text-xs opacity-50 shrink-0">●</span>
      <span className="chat-session-title truncate flex-1">{session.title || 'New Chat Session'}</span>
      <button 
        onClick={handleDelete}
        className="chat-session-delete"
        title="Delete"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};


export default React.memo(SessionItem);
