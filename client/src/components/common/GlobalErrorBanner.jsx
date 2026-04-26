import React, { useState, useEffect } from 'react';

const GlobalErrorBanner = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGlobalError = (e) => {
      setError(e.detail);
      setTimeout(() => setError(null), 8000);
    };

    window.addEventListener('globalError', handleGlobalError);
    return () => window.removeEventListener('globalError', handleGlobalError);
  }, []);

  if (!error) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span className="text-sm font-medium">{error}</span>
      <button onClick={() => setError(null)} className="ml-4 hover:text-red-200">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default GlobalErrorBanner;
