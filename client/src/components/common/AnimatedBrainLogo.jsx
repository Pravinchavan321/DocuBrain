import React from 'react';

const AnimatedBrainLogo = ({ size = 40, className = "" }) => {
  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      style={{ width: size, height: size, perspective: '1000px' }}
    >
      {/* ── Rotating Outer Glow Rings ── */}
      <div className="absolute inset-[-20%] border border-cyan-500/10 rounded-full animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute inset-[-40%] border border-purple-500/10 rounded-full animate-spin-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* ── 3D Floating Brain Core ── */}
      <div 
        className="relative w-full h-full transform-gpu transition-all duration-700 group-hover:rotate-x-12 group-hover:rotate-y-12"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Glow Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--fx-primary)] to-[var(--fx-accent)] rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-brain-pulse" />
        
        {/* Main SVG Icon */}
        <svg 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
        >
          {/* Left Hemisphere */}
          <path 
            d="M32 12C26 12 22 14 18 18C14 22 12 28 12 34C12 40 14 46 18 50C22 54 26 56 32 56V34L32 12Z" 
            fill="url(#logo_grad_left)" 
            fillOpacity="0.2" 
            stroke="url(#logo_grad_left)" 
            strokeWidth="1.5"
            className="animate-pulse"
          />
          {/* Right Hemisphere */}
          <path 
            d="M32 12C38 12 42 14 46 18C50 22 52 28 52 34C52 40 50 46 46 50C42 54 38 56 32 56V34L32 12Z" 
            fill="url(#logo_grad_right)" 
            fillOpacity="0.2" 
            stroke="url(#logo_grad_right)" 
            strokeWidth="1.5"
            style={{ animationDelay: '1s' }}
            className="animate-pulse"
          />
          
          {/* Neural Core */}
          <g className="animate-brain-pulse">
             <circle cx="32" cy="34" r="6" fill="url(#core_glow)" />
             <circle cx="32" cy="34" r="3" fill="white" />
             <path d="M32 34L22 25M32 34L42 25M32 34L20 34M32 34L44 34" stroke="white" strokeWidth="1" opacity="0.3" />
          </g>

          <defs>
            <linearGradient id="logo_grad_left" x1="12" y1="12" x2="32" y2="56">
              <stop offset="0" className="animate-color-shift-1" />
              <stop offset="1" className="animate-color-shift-2" />
            </linearGradient>
            <linearGradient id="logo_grad_right" x1="32" y1="12" x2="52" y2="56">
              <stop offset="0" className="animate-color-shift-2" />
              <stop offset="1" className="animate-color-shift-3" />
            </linearGradient>
            <radialGradient id="core_glow" cx="32" cy="34" r="6">
              <stop offset="0" stopColor="white" />
              <stop offset="1" stopColor="var(--fx-accent)" />
            </radialGradient>
          </defs>
        </svg>

        {/* 3D Depth Illusion Layers */}
        <div className="absolute inset-0 border border-white/5 rounded-full -translate-z-4 scale-95 opacity-50" />
        <div className="absolute inset-0 border border-white/5 rounded-full -translate-z-8 scale-90 opacity-20" />
      </div>

      <style>{`
        .animate-color-shift-1 { animation: colorShift 5s linear infinite; }
        .animate-color-shift-2 { animation: colorShift 5s linear infinite -2.5s; }
        .animate-color-shift-3 { animation: colorShift 5s linear infinite -1.2s; }
      `}</style>
    </div>
  );
};

export default AnimatedBrainLogo;
