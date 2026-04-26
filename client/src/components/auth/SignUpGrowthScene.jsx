import React, { useState, useEffect, useMemo } from 'react';

const DocumentCube = ({ index, type, delay }) => {
  return (
    <div 
      className="absolute z-30 animate-cube-onboarding"
      style={{
        animationDelay: `${delay}s`,
        left: `${45 + (index * 2)}%`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="relative w-14 h-14 group">
         {/* Glass Cube Body */}
         <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-[10px] font-black text-white/80 tracking-tighter z-10">{type}</span>
         </div>
         {/* Depth Panels */}
         <div className="absolute inset-0 border border-white/5 rounded-xl translate-z-[-10px] scale-95" />
         {/* Connection Sparkle */}
         <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full blur-[2px] animate-pulse" />
      </div>
    </div>
  );
};

const SignUpGrowthScene = () => {
  const [activeMsg, setActiveMsg] = useState(0);
  const messages = [
    "Uploading Knowledge...",
    "Chunking Documents...",
    "Creating Embeddings...",
    "Building Vector Space...",
    "AI Engine Ready..."
  ];

  const cubes = useMemo(() => [
    { type: 'PDF', delay: 0 },
    { type: 'DOCX', delay: 1.5 },
    { type: 'TXT', delay: 3 },
    { type: 'CSV', delay: 4.5 },
    { type: 'JSON', delay: 6 },
    { type: 'MD', delay: 7.5 }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMsg((prev) => (prev + 1) % messages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-transparent select-none pointer-events-none" style={{ perspective: '1500px' }}>
      
      {/* ── CENTRAL GROWING NEURAL SPHERE ── */}
      <div className="relative z-20">
         {/* Deep Glow Layers */}
         <div className="absolute inset-[-100px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute inset-[-60px] bg-purple-600/10 rounded-full blur-[80px] animate-pulse delay-700" />
         
         {/* The Brain Core */}
         <div className="relative w-56 h-56 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 p-[1.5px] shadow-[0_0_100px_rgba(34,211,238,0.3)] animate-float-slow">
            <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center relative overflow-hidden">
               {/* Internal Pulse Pattern */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.3),transparent_70%)]" />
               
               {/* Neural SVG Icon */}
               <svg width="80" height="80" viewBox="0 0 64 64" fill="none" className="relative z-10 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                  <path d="M32 12C24 12 18 18 18 26C18 34 24 38 24 46C24 50 28 54 32 54C36 54 40 50 40 46C40 38 46 34 46 26C46 18 40 12 32 12Z" fill="url(#grad_growth)" fillOpacity="0.8" />
                  <defs>
                    <linearGradient id="grad_growth" x1="18" y1="12" x2="46" y2="54">
                      <stop stopColor="#06b6d4" /><stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <circle cx="32" cy="26" r="4" fill="white" className="animate-pulse" />
               </svg>

               {/* Rotating Vector Network Lines */}
               <div className="absolute inset-[-20%] border border-cyan-500/10 rounded-full animate-spin-slow" />
               <div className="absolute inset-[-40%] border border-purple-500/5 rounded-full animate-spin-reverse" />
            </div>
         </div>

         {/* Expanding Ripple Rings */}
         {[0, 1, 2].map((i) => (
           <div 
             key={i} 
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyan-500/20 rounded-full animate-ripple-expand" 
             style={{ animationDelay: `${i * 2}s` }} 
           />
         ))}
      </div>

      {/* ── FALLING & ORBITING KNOWLEDGE CUBES ── */}
      <div className="absolute inset-0 z-30">
         {cubes.map((cube, i) => (
            <DocumentCube key={i} index={i} {...cube} />
         ))}
      </div>

      {/* ── EMBEDDING PARTICLES (DATA RAIN) ── */}
      <div className="absolute inset-0 z-10 opacity-30">
         {[...Array(20)].map((_, i) => (
            <div 
               key={i}
               className="absolute w-px h-16 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-particle-fall"
               style={{
                  left: `${Math.random() * 100}%`,
                  top: '-20%',
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`
               }}
            />
         ))}
      </div>

      {/* ── SYSTEM STATUS TEXT ── */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl z-50">
         <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
         </div>
         <span key={activeMsg} className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] animate-in fade-in slide-in-from-bottom-2 duration-700">
            {messages[activeMsg]}
         </span>
      </div>

      <style>{`
        @keyframes cube-onboarding {
          0% { transform: translate3d(0, -600px, 800px) rotateX(45deg); opacity: 0; }
          25% { transform: translate3d(0, 0, 0) rotateX(0deg); opacity: 1; }
          45% { transform: translate3d(250px, 150px, -200px) rotateY(45deg); opacity: 1; }
          100% { transform: rotateY(360deg) translateZ(400px) rotateY(-360deg); opacity: 0; }
        }
        @keyframes ripple-expand {
          0% { width: 100px; height: 100px; opacity: 0.8; border-width: 2px; }
          100% { width: 800px; height: 800px; opacity: 0; border-width: 0px; }
        }
        @keyframes particle-fall {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(120vh); opacity: 0; }
        }
        .animate-cube-onboarding { animation: cube-onboarding 16s cubic-bezier(0.4, 0, 0.2, 1) infinite forwards; }
        .animate-ripple-expand { animation: ripple-expand 6s ease-out infinite; }
        .animate-particle-fall { animation: particle-fall linear infinite; }
      `}</style>
    </div>
  );
};

export default SignUpGrowthScene;
