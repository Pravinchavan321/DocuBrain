import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [portalFlash, setPortalFlash] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setPortalFlash(true);
    setIsDark(prev => !prev);
    setTimeout(() => {
      setPortalFlash(false);
    }, 150);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <UIContext.Provider value={{ showToast, isDark, toggleTheme, portalFlash }}>
      {children}
      {portalFlash && <div className="fixed inset-0 z-[9999] portal-flash pointer-events-none" />}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-3 rounded-2xl shadow-2xl z-[1000] animate-fade-in flex items-center gap-3 border ${
          toast.type === 'error' 
            ? 'bg-red-500 text-white border-red-400' 
            : 'bg-indigo-600 text-white border-indigo-500'
        }`}>
          {toast.type === 'error' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          )}
          <span className="text-sm font-bold tracking-wide">{toast.message}</span>
        </div>
      )}
    </UIContext.Provider>
  );
};

export default UIContext;
