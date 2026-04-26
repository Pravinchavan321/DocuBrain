import React, { useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import SessionItem from './SessionItem';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { 
    sessions, 
    fetchSessions, 
    fetchMessages, 
    activeSessionId, 
    createSession, 
    sessionsLoading, 
    sessionCreating,
    deleteAllSessions,
    clearActiveSession
  } = useChat();
  
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const loaded = await fetchSessions();
      if (loaded.length > 0 && !activeSessionId && window.location.pathname === '/chat') {
        fetchMessages(loaded[0]._id);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewChat = async () => {
    await createSession();
    navigate('/chat');
  };

  const handleChatClick = () => {
    clearActiveSession();
    navigate('/chat');
  };

  return (
    <aside className="chat-sidebar-premium">
      <div className="chat-logo-row">
        <Link to="/dashboard" className="chat-logo-mark no-underline">
          <span className="chat-logo-icon text-white text-[10px]">D</span>
          <span>DocuBrain</span>
        </Link>
        <button className="chat-collapse-btn" type="button">⌘</button>
      </div>

      <div className="chat-sidebar-scroll">
        <div className="chat-search-box">
          <span className="text-xs">⌕</span>
          <input placeholder="Search" />
        </div>

        <div className="chat-sidebar-label">Main Menu</div>
        
        <button 
          onClick={handleNewChat}
          disabled={sessionCreating}
          className={`chat-menu-item ${!activeSessionId && window.location.pathname === '/chat' ? 'active' : ''}`}
        >
          <span className="chat-menu-icon">+</span>
          <span>{sessionCreating ? 'Creating...' : 'New Chat'}</span>
        </button>

        <Link to="/knowledge" className={`chat-menu-item no-underline ${window.location.pathname === '/knowledge' ? 'active' : ''}`}>
          <span className="chat-menu-icon">📚</span>
          <span>Knowledge</span>
        </Link>

        <button 
          onClick={handleChatClick}
          className={`chat-menu-item ${!activeSessionId && window.location.pathname === '/chat' ? 'active' : ''}`}
        >
          <span className="chat-menu-icon">💬</span>
          <span>Chat</span>
        </button>


        <div className="chat-sidebar-section-header">
          <span className="chat-sidebar-label">Recent Conversations</span>
          {sessions.length > 0 && (
            <button 
              className="chat-delete-all-btn" 
              onClick={deleteAllSessions}
              title="Delete all conversations"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-1">
          {sessionsLoading && sessions.length === 0 ? (
            <div className="space-y-2 opacity-20">
              {[1, 2, 3].map(i => <div key={i} className="h-8 bg-white/10 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            sessions.map((session) => (
              <SessionItem key={session._id} session={session} />
            ))
          )}
        </div>
      </div>

      <div className="chat-upgrade-card">
        <span className="chat-upgrade-badge">PRO PLAN</span>
        <p>Upgrade to premium and enjoy the benefits for a long time</p>
        <button type="button">View Plan</button>
      </div>

      <div className="chat-user-card">
        <div className="chat-user-avatar text-[10px] text-white">U</div>
        <div className="chat-user-meta">
          <strong>DocuBrain User</strong>
          <span>Free Tier</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
