import React, { useState, useEffect } from 'react';

const SunIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const PremiumThemePortalToggle = ({ isDark, onToggle }) => {
  const [isRippling, setIsRippling] = useState(false);
  const [isLiquid, setIsLiquid] = useState(false);

  const handleClick = () => {
    setIsRippling(true);
    setIsLiquid(true);
    
    // Portal Flash Effect trigger (global)
    document.body.classList.add('portal-flash');
    
    setTimeout(() => {
      onToggle();
      setIsLiquid(false);
    }, 150); // Cut delay in half

    setTimeout(() => {
      setIsRippling(false);
      document.body.classList.remove('portal-flash');
    }, 400); // Faster cleanup
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* ── Ripple Effect ── */}
      {isRippling && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-2 border-[var(--fx-accent)] rounded-full animate-ripple" />
        </div>
      )}

      {/* ── Dimensional Toggle Track ── */}
      <button
        onClick={handleClick}
        className={`relative w-20 h-10 rounded-full transition-all duration-200 overflow-hidden ${
          isDark ? 'bg-slate-900 border-cyan-500/30' : 'bg-slate-100 border-purple-500/20'
        } border glass-card shadow-inner flex items-center px-1 group`}
      >
        {/* Internal Glow Track */}
        <div className={`absolute inset-0 opacity-20 transition-opacity duration-200 ${isDark ? 'bg-cyan-500/20' : 'bg-purple-500/20'}`} />
        
        {/* ── Liquid Portal Knob ── */}
        <div 
          className={`relative z-10 w-8 h-8 flex items-center justify-center transition-all duration-300 transform-gpu ease-in-out ${
            isDark ? 'translate-x-10' : 'translate-x-0'
          } ${isLiquid ? 'scale-x-[2] scale-y-[0.5] blur-[1px]' : 'scale-100 blur-0'} ${!isLiquid ? 'animate-liquid' : ''}`}
          style={{
            background: isDark 
              ? 'linear-gradient(135deg, #22d3ee, #3b82f6)' 
              : 'linear-gradient(135deg, #a855f7, #6366f1)',
            boxShadow: isDark 
              ? '0 0 25px rgba(34, 211, 238, 0.8)' 
              : '0 0 25px rgba(168, 85, 247, 0.8)'
          }}
        >
          {isDark ? (
            <MoonIcon className="w-4 h-4 text-white" />
          ) : (
            <SunIcon className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Ambient Symbols */}
        <div className={`absolute left-2 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-20'}`}>
           <SunIcon className="w-4 h-4 text-slate-400" />
        </div>
        <div className={`absolute right-2 transition-opacity duration-300 ${isDark ? 'opacity-20' : 'opacity-0'}`}>
           <MoonIcon className="w-4 h-4 text-slate-400" />
        </div>
      </button>

      {/* ── Portal Flash Overlay (Brief) ── */}
      {isLiquid && (
        <div className="fixed inset-0 z-[9999] pointer-events-none bg-white dark:bg-black opacity-10 animate-pulse" />
      )}
    </div>
  );
};



export default PremiumThemePortalToggle;
