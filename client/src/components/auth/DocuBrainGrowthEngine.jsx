import React, { useState, useEffect, useMemo } from 'react';

const KnowledgeCube = ({ index, type, delay }) => {
  return (
    <div 
      className="absolute z-30 animate-cube-lifecycle"
      style={{
        animationDelay: `${delay}s`,
        left: `${40 + (index * 5)}%`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D-ish Glass Cube */}
      <div className="relative w-16 h-16 transform-gpu">
         {/* Front Face */}
         <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center shadow-2xl">
            <span className="text-[10px] font-black text-cyan-400 tracking-tighter">{type}</span>
         </div>
         {/* Top Face (Perspective) */}
         <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg transform -rotate-x-90 translate-y-[-50%] origin-bottom" />
         {/* Side Face (Perspective) */}
         <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg transform rotate-y-90 translate-x-[50%] origin-left" />
         
         {/* Internal Glow */}
         <div className="absolute inset-2 bg-gradient-to-tr from-cyan-500/40 to-purple-500/40 blur-md rounded-full animate-pulse" />
      </div>

      {/* Data Rain Stream connecting to Cube */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[1px] h-[200px] bg-gradient-to-t from-cyan-500/40 via-purple-500/10 to-transparent animate-data-rain" />
    </div>
  );
};

const DocuBrainGrowthEngine = () => {
  const [activeStage, setActiveStage] = useState(0);
  const messages = [
    "Uploading Knowledge...",
    "Structuring Data...",
    "Creating Embeddings...",
    "Building Vector Space...",
    "AI Engine Initializing..."
  ];

  const cubes = useMemo(() => [
    { type: 'PDF', delay: 0 },
    { type: 'DOC', delay: 2 },
    { type: 'TXT', delay: 4 },
    { type: 'PDF', delay: 6 },
    { type: 'CSV', delay: 8 },
    { type: 'JSON', delay: 10 }
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none select-none bg-transparent" style={{ perspective: '1200px' }}>
      
      {/* ── CENTRAL GROWING NETWORK SPHERE ── */}
      <div className="relative z-20 transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
         {/* Core Sphere */}
         <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-[1.5px] shadow-[0_0_100px_rgba(99,102,241,0.4)] animate-sphere-grow">
            <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center relative overflow-hidden">
               {/* Internal Core Activation Glow */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.4),transparent_70%)] animate-core-activation" />
               <svg width="60" height="60" viewBox="0 0 64 64" fill="none" className="relative z-10 drop-shadow-glow">
                  <path d="M32 12C26 12 22 14 18 18C14 22 12 28 12 34C12 40 14 46 18 50C22 54 26 56 32 56V34L32 12Z" fill="#06b6d4" fillOpacity="0.8" />
                  <path d="M32 12C38 12 42 14 46 18C50 22 52 28 52 34C52 40 50 46 46 50C42 54 38 56 32 56V34L32 12Z" fill="#8b5cf6" fillOpacity="0.8" />
               </svg>
            </div>
         </div>

         {/* Ripple Rings */}
         {[0, 1, 2].map((i) => (
           <div 
             key={i} 
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyan-500/20 rounded-full animate-ripple-expand" 
             style={{ animationDelay: `${i * 1.5}s` }} 
           />
         ))}
      </div>

      {/* ── KNOWLEDGE CUBES (FALLING & ORBITING) ── */}
      <div className="absolute inset-0 z-30 pointer-events-none">
         {cubes.map((cube, i) => (
           <KnowledgeCube key={i} index={i} {...cube} />
         ))}
      </div>

      {/* ── SYSTEM STATUS TEXT ── */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
         <span key={activeStage} className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-message-fade">
            {messages[activeStage]}
         </span>
      </div>

      {/* ── DATA RAIN BACKGROUND ── */}
      <div className="absolute inset-0 z-10 opacity-20 overflow-hidden">
         {[...Array(20)].map((_, i) => (
           <div 
             key={i}
             className="absolute w-px h-[300px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-rain-drift"
             style={{
               left: `${Math.random() * 100}%`,
               top: `${Math.random() * -100}%`,
               animationDelay: `${Math.random() * 5}s`,
               animationDuration: `${Math.random() * 3 + 2}s`
             }}
           />
         ))}
      </div>

      <style>{`
        @keyframes cube-lifecycle {
          0% { transform: translate3d(0, -500px, 1000px) rotateX(45deg); opacity: 0; }
          20% { transform: translate3d(0, 0, 0) rotateX(0deg); opacity: 1; }
          40% { transform: translate3d(200px, 100px, -200px) rotateY(45deg); opacity: 1; }
          100% { transform: rotateY(360deg) translateZ(300px) rotateY(-360deg); opacity: 0.8; }
        }
        @keyframes sphere-grow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes core-activation {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        @keyframes ripple-expand {
          0% { width: 100px; height: 100px; opacity: 0.8; border-width: 2px; }
          100% { width: 600px; height: 600px; opacity: 0; border-width: 0px; }
        }
        @keyframes data-rain {
          0% { height: 0; opacity: 0; }
          50% { height: 200px; opacity: 0.4; }
          100% { height: 0; opacity: 0; }
        }
        @keyframes rain-drift {
          0% { transform: translateY(0); }
          100% { transform: translateY(120vh); }
        }
        @keyframes message-fade {
          0%, 100% { opacity: 0; transform: translateY(10px); }
          20%, 80% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-cube-lifecycle { 
          animation: cube-lifecycle 15s cubic-bezier(0.4, 0, 0.2, 1) infinite forwards;
        }
        .animate-sphere-grow { animation: sphere-grow 8s ease-in-out infinite; }
        .animate-core-activation { animation: core-activation 4s ease-in-out infinite; }
        .animate-ripple-expand { animation: ripple-expand 4.5s ease-out infinite; }
        .animate-data-rain { animation: data-rain 3s ease-in-out infinite; }
        .animate-rain-drift { animation: rain-drift linear infinite; }
        .animate-message-fade { animation: message-fade 4s ease-in-out infinite; }
        
        .drop-shadow-glow { filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.8)); }
        .rotate-x-90 { transform: rotateX(90deg) translateZ(8px); }
        .rotate-y-90 { transform: rotateY(90deg) translateZ(8px); }
      `}</style>
    </div>
  );
};

export default DocuBrainGrowthEngine;
