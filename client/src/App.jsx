import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { DocumentProvider } from './context/DocumentContext';
import AppRouter from './routes/AppRouter';
import GlobalErrorBanner from './components/common/GlobalErrorBanner';
import { UIProvider } from './context/UIContext';

function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <AuthProvider>
          <ChatProvider>
            <DocumentProvider>
              <GlobalErrorBanner />
              <AppRouter />
            </DocumentProvider>
          </ChatProvider>
        </AuthProvider>
      </UIProvider>
    </BrowserRouter>
  );
}

export default App;
