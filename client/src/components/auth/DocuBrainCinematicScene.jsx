import React, { useState, useEffect, useRef } from 'react';

const DocuBrainCinematicScene = ({ mode = 'login' }) => {
  const [bootIndex, setBootIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const loginStats = [
    'Initializing Neural Core...',
    'Syncing Knowledge Vectors...',
    'Securing Enterprise Session...',
    'RAG Engine Ready'
  ];
  
  const signupStats = [
    'Priming Data Ingestion...',
    'Preparing Vector Graph...',
    'Allocating Knowledge Shards...',
    'Onboarding Module Active'
  ];

  const labels = mode === 'login' 
    ? ['Secure', 'Access', 'Verify', 'Retrieve', 'Vault']
    : ['Upload', 'Chunk', 'Embed', 'Learn', 'Index'];

  const stats = mode === 'login' ? loginStats : signupStats;

  useEffect(() => {
    const timer = setInterval(() => {
      setBootIndex((prev) => (prev + 1) % stats.length);
    }, 3000);
    
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [stats.length]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none select-none bg-transparent" style={{ perspective: '1200px' }}>
      
      {/* ── PARALLAX WRAPPER ── */}
      <div 
        className="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
        style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
      >
        
        {/* ── CENTRAL BRAIN CORE ── */}
        <div className="relative z-20 transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
           {/* Pulsing Outer Glow */}
           <div className="absolute inset-[-60px] bg-gradient-to-tr from-purple-600/20 via-blue-500/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse opacity-60" />
           
           {/* The Core Orb */}
           <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-[1.5px] shadow-[0_0_120px_rgba(139,92,246,0.3)] animate-float-slow">
              <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center relative overflow-hidden">
                 {/* Inner Circuit Background */}
                 <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400 animate-scan-line" />
                    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-purple-500 animate-scan-line-vert" />
                 </div>
                 
                 {/* 3D Brain Icon */}
                 <svg width="100" height="100" viewBox="0 0 64 64" fill="none" className="relative z-10 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                    <path d="M32 12C26 12 22 14 18 18C14 22 12 28 12 34C12 40 14 46 18 50C22 54 26 56 32 56V34L32 12Z" fill="#06b6d4" fillOpacity="0.8" />
                    <path d="M32 12C38 12 42 14 46 18C50 22 52 28 52 34C52 40 50 46 46 50C42 54 38 56 32 56V34L32 12Z" fill="#8b5cf6" fillOpacity="0.8" />
                    <circle cx="32" cy="34" r="5" fill="white" className="animate-pulse" />
                 </svg>

                 {/* Rotating Neural Rings */}
                 <div className="absolute inset-0 border-[1px] border-dashed border-cyan-500/30 rounded-full animate-spin-slow scale-[1.1]" />
                 <div className="absolute inset-0 border-[1px] border-dotted border-purple-500/30 rounded-full animate-spin-reverse scale-[1.3]" />
              </div>
           </div>

           {/* ── ORBITING RINGS (DEPTH) ── */}
           <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] border border-white/5 rounded-full animate-orbit-slow" style={{ transform: 'translate(-50%, -50%) rotateX(65deg)' }} />
           <div className="absolute top-1/2 left-1/2 w-[550px] h-[550px] border border-cyan-500/10 rounded-full animate-orbit-reverse" style={{ transform: 'translate(-50%, -50%) rotateY(65deg)' }} />
        </div>

        {/* ── FLOATING DOCUMENT CARDS (ORBITING) ── */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute z-30 animate-doc-orbit-3d"
            style={{
              animationDelay: `${i * -2}s`,
              transformStyle: 'preserve-3d',
            }}
          >
            <div 
               className="w-24 h-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-3 flex flex-col gap-2 animate-doc-float-local"
               style={{ animationDelay: `${i * 0.5}s` }}
            >
               <div className="w-full h-1.5 bg-white/20 rounded-full" />
               <div className="w-2/3 h-1 bg-white/10 rounded-full" />
               <div className="w-full h-1 bg-white/10 rounded-full" />
               <div className="mt-auto flex justify-between">
                  <div className="w-4 h-4 rounded bg-cyan-500/30" />
                  <div className="w-8 h-1.5 bg-purple-500/30 rounded-full" />
               </div>
            </div>
            {/* Connection Line to Core */}
            <div className="absolute top-1/2 left-1/2 w-[300px] h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent origin-left rotate-180 -translate-x-full overflow-hidden">
               <div className="w-full h-full bg-cyan-400 animate-data-pulse" />
            </div>
          </div>
        ))}

        {/* ── FLOATING LABELS ── */}
        {labels.map((label, i) => (
          <div 
            key={label}
            className="absolute z-40 px-4 py-1.5 bg-black/40 backdrop-blur-2xl border border-cyan-500/30 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] animate-label-float"
            style={{
              left: `${15 + (i * 18)}%`,
              top: `${20 + (i * 12)}%`,
              animationDelay: `${i * 1.2}s`,
            }}
          >
            {label}
          </div>
        ))}

        {/* ── PARTICLES ── */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-cyan-400 opacity-20 animate-particle-drift"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── SCANNER BEAM ── */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        <div className="w-full h-[500px] bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent -rotate-12 translate-y-[-100%] animate-scan-sweep" />
      </div>

      {/* ── SYSTEM BOOT TEXT ── */}
      <div className="absolute bottom-12 left-12 z-50 font-mono text-[10px] tracking-[0.2em] uppercase text-slate-500 flex items-center gap-3">
         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
         <span key={bootIndex} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            {stats[bootIndex]}
         </span>
      </div>

      <style>{`
        @keyframes scan-sweep {
          0% { transform: translateY(-100%) rotate(-12deg); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(200%) rotate(-12deg); opacity: 0; }
        }
        @keyframes data-pulse {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes doc-orbit-3d {
          from { transform: rotateY(0deg) translateX(300px) rotateY(0deg); }
          to { transform: rotateY(360deg) translateX(300px) rotateY(-360deg); }
        }
        @keyframes doc-float-local {
          0%, 100% { transform: translateY(0) rotateX(10deg); }
          50% { transform: translateY(-20px) rotateX(-10deg); }
        }
        @keyframes label-float {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(15px, -15px) scale(1.05); opacity: 1; }
        }
        @keyframes particle-drift {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        .animate-scan-sweep { animation: scan-sweep 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-data-pulse { animation: data-pulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-doc-orbit-3d { animation: doc-orbit-3d 20s linear infinite; }
        .animate-doc-float-local { animation: doc-float-local 6s ease-in-out infinite; }
        .animate-label-float { animation: label-float 8s ease-in-out infinite; }
        .animate-particle-drift { animation: particle-drift 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default DocuBrainCinematicScene;
