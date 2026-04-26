import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import ChatAestheticBackground from '../components/chat/ChatAestheticBackground';
import './ChatPage.css';

// Note: ChatProvider and DocumentProvider are already mounted in App.jsx
// Do NOT wrap again here — that creates duplicate context instances
const ChatPage = () => {
  return (
    <main className="chat-page-premium">
      <ChatAestheticBackground />

      <section className="chat-shell-premium">
        <Sidebar />
        <ChatWindow />
      </section>
    </main>
  );
};



export default ChatPage;
