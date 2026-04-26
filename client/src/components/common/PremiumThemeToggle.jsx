import React, { useState } from 'react';

const PremiumThemeToggle = ({ isDark, onToggle }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div 
      onClick={handleToggle}
      className={`relative w-[72px] h-9 rounded-full cursor-pointer p-1.5 transition-all duration-500 overflow-hidden shadow-inner flex items-center ${
        isDark 
          ? 'bg-slate-900 border border-indigo-500/30' 
          : 'bg-indigo-50 border border-indigo-200'
      }`}
    >
      {/* Background Glow */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark ? 'opacity-100 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900' : 'opacity-0'
        }`}
      />
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark ? 'opacity-0' : 'opacity-100 bg-gradient-to-r from-amber-100 via-orange-100 to-white'
        }`}
      />

      {/* Ripple Effect on Click */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-white/20 animate-ripple rounded-full" />
        </div>
      )}

      {/* Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 z-0 pointer-events-none">
        <svg 
          className={`w-3.5 h-3.5 transition-all duration-500 ${isDark ? 'text-indigo-400 opacity-100 scale-100' : 'text-slate-300 opacity-20 scale-75'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
        <svg 
          className={`w-4 h-4 transition-all duration-500 ${isDark ? 'text-slate-600 opacity-20 scale-75' : 'text-amber-500 opacity-100 scale-100'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Bubble Knob */}
      <div 
        className={`relative z-10 w-6 h-6 rounded-full shadow-lg transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${
          isDark 
            ? 'translate-x-0 bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
            : 'translate-x-[36px] bg-white shadow-[0_0_15px_rgba(251,191,36,0.4)]'
        } ${isAnimating ? 'w-9' : 'w-6'}`}
      >
        <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${isDark ? 'opacity-100 bg-white' : 'opacity-0 bg-amber-50'}`} />
      </div>

      <style>{`
        @keyframes ripple {
          from { transform: scale(0); opacity: 1; }
          to { transform: scale(4); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out forwards;
        }
        .cubic-bezier {
          transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default PremiumThemeToggle;
