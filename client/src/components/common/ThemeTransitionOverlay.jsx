import React, { useEffect, useState } from 'react';

const ThemeTransitionOverlay = ({ isDark }) => {
  const [isActive, setIsActive] = useState(false);
  const [prevTheme, setPrevTheme] = useState(isDark);

  useEffect(() => {
    if (isDark !== prevTheme) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        setPrevTheme(isDark);
      }, 150); // Ultra fast 150ms duration
      return () => clearTimeout(timer);
    }
  }, [isDark, prevTheme]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
      {/* ── Ultra Fast GPU-Accelerated Fade Overlay ── */}
      <div 
        className={`absolute inset-0 ${
          isDark ? 'bg-[#020617]' : 'bg-[#fdfbff]'
        }`}
        style={{
          animation: 'theme-fade 0.15s cubic-bezier(0.25, 1, 0.5, 1) forwards',
          willChange: 'opacity'
        }}
      />

      {/* ── Instant Grid Flash ── */}
      <div 
        className="absolute inset-0 opacity-10 animate-flash-grid" 
        style={{
          backgroundImage: `linear-gradient(to right, var(--accent-cyan) 1px, transparent 1px), linear-gradient(to bottom, var(--accent-cyan) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <style>{`
        @keyframes theme-fade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes flash-grid {
          0% { opacity: 0; }
          30% { opacity: 0.3; }
          100% { opacity: 0; }
        }
        .animate-flash-grid {
          animation: flash-grid 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ThemeTransitionOverlay;


