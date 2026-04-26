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
      }, 350); // Ultra fast duration
      return () => clearTimeout(timer);
    }
  }, [isDark, prevTheme]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
      {/* ── Ultra Fast Expanding Circle Wipe ── */}
      <div 
        className={`absolute inset-0 transition-all duration-300 ease-out ${
          isDark ? 'bg-[#020617]' : 'bg-[#fdfbff]'
        }`}
        style={{
          clipPath: isActive ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)',
          animation: 'theme-wipe 0.35s cubic-bezier(0.19, 1, 0.22, 1) forwards'
        }}
      />

      {/* ── Instant Grid Flash ── */}
      <div 
        className="absolute inset-0 opacity-20 animate-flash-grid" 
        style={{
          backgroundImage: `linear-gradient(to right, var(--accent-cyan) 1px, transparent 1px), linear-gradient(to bottom, var(--accent-cyan) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <style>{`
        @keyframes theme-wipe {
          0% { clip-path: circle(0% at 50% 50%); }
          100% { clip-path: circle(150% at 50% 50%); }
        }
        @keyframes flash-grid {
          0% { opacity: 0; }
          40% { opacity: 0.4; }
          100% { opacity: 0; }
        }
        .animate-flash-grid {
          animation: flash-grid 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ThemeTransitionOverlay;


