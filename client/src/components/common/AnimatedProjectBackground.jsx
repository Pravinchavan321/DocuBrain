import React, { useMemo } from 'react';

const AnimatedProjectBackground = ({ variant = 'dashboard' }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * -20,
      type: Math.random() > 0.6 ? 'leaf' : 'node',
      opacity: Math.random() * 0.3 + 0.1
    }));
  }, []);

  const lines = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: Math.random() * 300 + 100,
      rotate: Math.random() * 360,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * -10,
    }));
  }, []);

  const dashboardNodes = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.4 + 0.1,
      delay: Math.random() * -10,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[var(--bg-primary)] transition-colors duration-500">
      
      {/* ── Layer 1: TECH HEXAGON GRID (Dashboard Specific) ── */}
      {variant === 'dashboard' && (
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]" 
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='%2306b6d4' stroke-width='1'/%3E%3C/svg%3E")`,
               backgroundSize: '80px 80px'
             }} 
        />
      )}

      {/* ── Layer 2: Premium Ambient Gradients ── */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-[140px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 blur-[140px] animate-float-slow" style={{ animationDelay: '-8s' }} />
        <div className="absolute top-[20%] right-[5%] w-[45%] h-[45%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
      </div>

      {/* ── Layer 3: Moving Vertical Energy Beams (Dashboard Specific) ── */}
      {variant === 'dashboard' && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-scanner-sweep"
              style={{ 
                left: `${20 * i + 10}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: '10s'
              }}
            />
          ))}
        </div>
      )}

      {/* ── Layer 4: Neural Connection Lines ── */}
      <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.2]">
        {lines.map((l) => (
          <div
            key={l.id}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent animate-pulse"
            style={{
              left: l.left,
              top: l.top,
              width: l.width,
              transform: `rotate(${l.rotate}deg)`,
              animationDuration: `${l.duration}s`,
              animationDelay: `${l.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Layer 5: Floating Particles ── */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-float-slow"
            style={{
              left: p.left,
              top: p.top,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.type === 'leaf' ? (
              <svg width={p.size * 6} height={p.size * 6} viewBox="0 0 24 24" fill="none" className="text-emerald-500">
                <path d="M12 2C12 2 4 11 4 16C4 18.2091 5.79086 20 8 20C9.35144 20 10.5407 19.3295 11.25 18.3125C11.6667 19.375 12.3333 19.375 12.75 18.3125C13.4593 19.3295 14.6486 20 16 20C18.2091 20 20 18.2091 20 16C20 11 12 2 12 2Z" fill="currentColor" fillOpacity="0.8" />
              </svg>
            ) : (
              <div 
                className="rounded-full bg-cyan-400 shadow-[0_0_15px_var(--accent-cyan)]" 
                style={{ width: p.size, height: p.size }} 
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Layer 6: Scanning Light Sweep ── */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute inset-x-0 h-[300px] bg-gradient-to-b from-transparent via-[var(--accent-cyan)] to-transparent animate-scanner-sweep" style={{ animationDuration: '12s' }} />
      </div>

      {/* ── Layer 7: Noise Texture ── */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default AnimatedProjectBackground;
