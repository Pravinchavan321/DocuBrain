import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { DocumentProvider } from './context/DocumentContext';
import AppRouter from './routes/AppRouter';
import GlobalErrorBanner from './components/common/GlobalErrorBanner';
import { UIProvider, useUI } from './context/UIContext';
import PremiumThemePortalToggle from './components/common/PremiumThemePortalToggle';

const GlobalThemeToggle = () => {
  const { isDark, toggleTheme } = useUI();
  return (
    <div className="fixed top-6 right-6 z-[9999] scale-90 md:scale-100 origin-top-right">
      <PremiumThemePortalToggle isDark={isDark} onToggle={toggleTheme} />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <AuthProvider>
          <ChatProvider>
            <DocumentProvider>
              <GlobalErrorBanner />
              <GlobalThemeToggle />
              <AppRouter />
            </DocumentProvider>
          </ChatProvider>
        </AuthProvider>
      </UIProvider>
    </BrowserRouter>
  );
}

export default App;
