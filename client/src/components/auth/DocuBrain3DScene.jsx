import React from 'react';

const DocuBrain3DScene = () => {
  const labels = ['RAG', 'Vector Search', 'Gemini', 'ChromaDB', 'Secure Docs'];
  
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none select-none" style={{ perspective: '1200px' }}>
      {/* ── CENTRAL BRAIN CORE ── */}
      <div className="relative z-20 transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
        {/* Main Pulsing Core */}
        <div className="w-48 h-48 bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 rounded-full blur-[2px] shadow-[0_0_80px_rgba(6,182,212,0.6)] animate-pulse flex items-center justify-center">
           <div className="w-40 h-40 bg-[#020617] rounded-full flex items-center justify-center border border-white/10 overflow-hidden relative">
              {/* Internal Circuit Animation */}
              <div className="absolute inset-0 opacity-30">
                 <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400 animate-scan-line" />
                 <div className="absolute top-0 left-1/2 w-[1px] h-full bg-purple-500 animate-scan-line-vert" />
              </div>
              <svg width="60" height="60" viewBox="0 0 64 64" fill="none" className="relative z-10 drop-shadow-glow">
                 <path d="M32 12C26 12 22 14 18 18C14 22 12 28 12 34C12 40 14 46 18 50C22 54 26 56 32 56V34L32 12Z" fill="#06b6d4" fillOpacity="0.8" />
                 <path d="M32 12C38 12 42 14 46 18C50 22 52 28 52 34C52 40 50 46 46 50C42 54 38 56 32 56V34L32 12Z" fill="#8b5cf6" fillOpacity="0.8" />
                 <circle cx="32" cy="34" r="4" fill="white" className="animate-pulse" />
              </svg>
           </div>
        </div>
        
        {/* Orbiting Rings */}
        <div className="absolute top-1/2 left-1/2 w-64 h-64 border border-white/5 rounded-full animate-orbit-slow" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 border border-cyan-500/20 rounded-full animate-orbit-reverse" />
      </div>

      {/* ── FLOATING DOCUMENTS ── */}
      {[0, 1, 2, 3].map((i) => (
        <div 
          key={i}
          className="absolute z-30 animate-doc-float"
          style={{
            animationDelay: `${i * 1.5}s`,
            transformStyle: 'preserve-3d',
            left: `${20 + (i * 20)}%`,
            top: `${15 + (i * 15)}%`,
          }}
        >
          <div className="w-24 h-32 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-3 flex flex-col gap-2">
            <div className="w-full h-2 bg-white/20 rounded-full" />
            <div className="w-3/4 h-1.5 bg-white/10 rounded-full" />
            <div className="w-full h-1.5 bg-white/10 rounded-full" />
            <div className="mt-auto flex justify-between items-center">
               <div className="w-4 h-4 rounded bg-cyan-500/40" />
               <div className="w-8 h-2 bg-purple-500/40 rounded-full" />
            </div>
          </div>
          {/* Connection Line to Core */}
          <div className="absolute top-1/2 left-1/2 w-[200px] h-px bg-gradient-to-r from-cyan-500/50 to-transparent origin-left rotate-[160deg] -translate-x-full animate-line-draw" />
        </div>
      ))}

      {/* ── FLOATING LABELS & NODES ── */}
      {labels.map((label, i) => (
        <div 
          key={label}
          className="absolute z-40 px-3 py-1 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest animate-float-random"
          style={{
            left: `${15 + (i * 17)}%`,
            top: `${70 - (i * 10)}%`,
            animationDelay: `${i * 0.8}s`,
          }}
        >
          {label}
        </div>
      ))}

      {/* ── VECTOR NODES ── */}
      <svg className="absolute inset-0 w-full h-full z-10">
        <defs>
          <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
        </defs>
        <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="url(#nodeGrad)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash" />
        <line x1="80%" y1="15%" x2="50%" y2="50%" stroke="url(#nodeGrad)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash" />
        <line x1="15%" y1="80%" x2="50%" y2="50%" stroke="url(#nodeGrad)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash" />
        <line x1="85%" y1="75%" x2="50%" y2="50%" stroke="url(#nodeGrad)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash" />
      </svg>

      {/* ── SCANNER BEAM ── */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
         <div className="w-full h-[300px] bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent -rotate-12 translate-y-[-100%] animate-scanner-sweep" />
      </div>

      <style>{`
        .drop-shadow-glow { filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.8)); }
        
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes scan-line-vert {
          0% { left: 0; }
          100% { left: 100%; }
        }
        @keyframes float-random {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -15px); }
          50% { transform: translate(-5px, 10px); }
          75% { transform: translate(-10px, -5px); }
        }
        .animate-scan-line { animation: scan-line 3s linear infinite; }
        .animate-scan-line-vert { animation: scan-line-vert 4s linear infinite; }
        .animate-dash { animation: dash 2s linear infinite; }
        .animate-float-random { animation: float-random 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default DocuBrain3DScene;
