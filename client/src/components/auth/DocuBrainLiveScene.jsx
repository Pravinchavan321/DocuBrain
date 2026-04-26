import React, { useEffect, useState, useRef } from 'react';

const DocuBrainLiveScene = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // Max 20px shift
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none select-none bg-[#020617]" style={{ perspective: '1200px' }}>
      
      {/* ── BACKGROUND DEPTH: LARGE GLOWS ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] z-0" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] z-0 animate-pulse" />

      {/* ── PARTICLE SYSTEM ── */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400 opacity-20 animate-particle-rise"
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

      {/* ── PARALLAX CONTAINER ── */}
      <div 
        className="relative z-20 flex items-center justify-center transition-transform duration-700 ease-out"
        style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
      >
        
        {/* ── CENTRAL AI CORE (BRAIN / ORB) ── */}
        <div className="relative group" style={{ transformStyle: 'preserve-3d' }}>
           {/* Inner Rotating Glow */}
           <div className="absolute inset-[-40px] bg-gradient-to-tr from-purple-600/20 via-blue-500/20 to-cyan-400/20 rounded-full blur-3xl animate-spin-slow opacity-60" />
           
           {/* The Core Orb */}
           <div className="relative w-56 h-56 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-[2px] shadow-[0_0_100px_rgba(99,102,241,0.4)] animate-core-pulse">
              <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center relative overflow-hidden">
                 {/* Internal Core Glow */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.3),transparent_70%)]" />
                 
                 {/* 3D Brain Icon Layer */}
                 <svg width="80" height="80" viewBox="0 0 64 64" fill="none" className="relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                    <path d="M32 12C26 12 22 14 18 18C14 22 12 28 12 34C12 40 14 46 18 50C22 54 26 56 32 56V34L32 12Z" fill="#06b6d4" fillOpacity="0.8" />
                    <path d="M32 12C38 12 42 14 46 18C50 22 52 28 52 34C52 40 50 46 46 50C42 54 38 56 32 56V34L32 12Z" fill="#8b5cf6" fillOpacity="0.8" />
                    <circle cx="32" cy="34" r="5" fill="white" className="animate-pulse" />
                 </svg>

                 {/* Rotating Circuit Pattern */}
                 <div className="absolute inset-0 border-[1px] border-dashed border-cyan-500/20 rounded-full animate-spin-slow scale-110" />
                 <div className="absolute inset-0 border-[1px] border-dotted border-purple-500/20 rounded-full animate-spin-reverse scale-125" />
              </div>
           </div>

           {/* ── ORBITING LAYERS (RINGS) ── */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full rotate-x-60 animate-orbit-slow" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-cyan-500/10 rounded-full rotate-y-60 animate-orbit-reverse" />
        </div>

        {/* ── FLOATING DATA CARDS ── */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute z-30 animate-float-card"
            style={{
              animationDelay: `${i * 1.2}s`,
              left: `${Math.cos(i * 60 * Math.PI / 180) * 280}px`,
              top: `${Math.sin(i * 60 * Math.PI / 180) * 280}px`,
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="w-20 h-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-3 flex flex-col gap-2 group-hover:border-cyan-500/40 transition-colors duration-500">
               <div className="w-full h-1.5 bg-white/20 rounded-full" />
               <div className="w-2/3 h-1 bg-white/10 rounded-full" />
               <div className="w-full h-1 bg-white/10 rounded-full" />
               <div className="mt-auto flex justify-between">
                  <div className="w-3 h-3 rounded-sm bg-cyan-500/30" />
                  <div className="w-6 h-1.5 bg-purple-500/30 rounded-full" />
               </div>
            </div>
            {/* Connection Line to Core */}
            <div className="absolute top-1/2 left-1/2 w-[280px] h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent origin-left rotate-[180deg] -translate-x-full animate-connection-pulse" />
          </div>
        ))}
      </div>

      {/* ── SCANNER BEAM ── */}
      <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
        <div className="w-full h-[400px] bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent -rotate-12 translate-y-[-100%] animate-scanner-sweep" />
      </div>

      <style>{`
        @keyframes core-pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.02); filter: brightness(1.2); }
        }
        @keyframes particle-rise {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0) rotateY(15deg) rotateX(10deg); }
          50% { transform: translateY(-30px) rotateY(-15deg) rotateX(-10deg); }
        }
        @keyframes connection-pulse {
          0%, 100% { opacity: 0.1; width: 200px; }
          50% { opacity: 0.5; width: 280px; }
        }
        @keyframes scanner-sweep {
          0% { transform: translateY(-100%) rotate(-12deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(200%) rotate(-12deg); opacity: 0; }
        }
        .rotate-x-60 { transform: rotateX(60deg) translate(-50%, -50%); }
        .rotate-y-60 { transform: rotateY(60deg) translate(-50%, -50%); }
        
        .animate-core-pulse { animation: core-pulse 4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-float-card { animation: float-card 8s ease-in-out infinite; }
        .animate-connection-pulse { animation: connection-pulse 4s ease-in-out infinite; }
        .animate-scanner-sweep { animation: scanner-sweep 6s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};

export default DocuBrainLiveScene;
