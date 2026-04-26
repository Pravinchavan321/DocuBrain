import React, { useState, useEffect, useRef } from 'react';

const NeuralCoreBackground = ({ mode = 'login' }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    const timer = setTimeout(() => setIsEntering(false), 100);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  const statusTexts = {
    login: [
      "Verifying Secure Session...",
      "Connecting Neural Core...",
      "Knowledge Vault Ready..."
    ],
    signup: [
      "Creating Workspace...",
      "Preparing Vector Memory...",
      "AI Core Initializing..."
    ]
  };

  const [currentStatus, setCurrentStatus] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus((prev) => (prev + 1) % statusTexts[mode].length);
    }, 3000);
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#020617] pointer-events-none">
      {/* ── 1. Deep Space Void ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0f172a_0%,#020617_100%)]" />

      {/* ── 2. Cinematic Ambient Glows ── */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-600/10 blur-[160px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-cyan-600/10 blur-[160px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      {/* ── 3. Main Neural Core Assembly ── */}
      <div 
        className={`relative w-full h-full flex items-center justify-center lg:justify-end lg:pr-[10%] transition-all duration-[2000ms] ease-out ${isEntering ? 'opacity-0 scale-90 translate-y-10' : 'opacity-100 scale-100 translate-y-0'}`}
        style={{ 
          perspective: '1500px',
          transform: `translate3d(${mousePos.x * 25}px, ${mousePos.y * 25}px, 0)`
        }}
      >
        <div 
          className="relative w-[350px] h-[400px] md:w-[550px] md:h-[650px] lg:w-[750px] lg:h-[850px] flex items-center justify-center animate-core-float"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: `rotateX(${mousePos.y * -5}deg) rotateY(${mousePos.x * 8}deg)`
          }}
        >
          {/* ── Reference Image Layer ── */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
             {/* Intense Glow Behind Core */}
             <div className="absolute w-[80%] h-[80%] bg-gradient-to-t from-cyan-500/30 via-purple-500/20 to-transparent blur-[120px] animate-breathing opacity-60" />
             
             {/* THE IMAGE (Neural Core) */}
             <img 
               src="/assets/docubrain-neural-core.png" 
               alt="Neural Core"
               className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(34,211,238,0.4)] animate-breathing relative z-10"
               onError={(e) => {
                 e.target.style.display = 'none';
                 e.target.parentNode.classList.add('fallback-core');
               }}
             />

             {/* Energy Flow Lines (Intensified) */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible opacity-60">
                {[...Array(8)].map((_, i) => (
                  <path 
                    key={i}
                    d={`M${45 + Math.random() * 10}% 85% Q${40 + Math.random() * 20}% 60% ${45 + Math.random() * 10}% 35%`}
                    className="animate-energy-pulse"
                    stroke={i % 2 === 0 ? "url(#energy_cyan)" : "url(#energy_purple)"}
                    strokeWidth="2"
                    fill="none"
                    style={{ animationDelay: `${i * 0.4}s`, animationDuration: `${3 + Math.random() * 2}s` }}
                  />
                ))}
                <defs>
                   <linearGradient id="energy_cyan" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="50%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="transparent" />
                   </linearGradient>
                   <linearGradient id="energy_purple" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="transparent" />
                   </linearGradient>
                </defs>
             </svg>
          </div>

          {/* ── Orbital Rings (Enhanced) ── */}
          <div className="absolute inset-[-5%] border border-cyan-500/20 rounded-full animate-spin-slow opacity-40 shadow-[0_0_20px_rgba(34,211,238,0.1)]" style={{ transform: 'rotateX(75deg)' }} />
          <div className="absolute inset-[-15%] border border-purple-500/10 rounded-full animate-spin-reverse opacity-30 shadow-[0_0_20px_rgba(168,85,247,0.1)]" style={{ transform: 'rotateY(75deg)' }} />
          <div className="absolute inset-[-25%] border border-white/5 rounded-full animate-spin-slow opacity-20" style={{ transform: 'rotateX(45deg) rotateY(45deg)' }} />

          {/* ── Holographic Status Interface ── */}
          <div className="absolute bottom-[0%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 min-w-[400px] z-30">
             <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md">
                   <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_12px_#22d3ee]"></span>
                   <p className="text-[11px] font-black uppercase tracking-[0.6em] text-cyan-400">
                      {statusTexts[mode][currentStatus]}
                   </p>
                </div>
                {/* Micro Details */}
                <div className="flex gap-4 mt-2 opacity-40">
                   <div className="w-12 h-[2px] bg-cyan-500/30 rounded-full" />
                   <div className="w-12 h-[2px] bg-purple-500/30 rounded-full" />
                   <div className="w-12 h-[2px] bg-cyan-500/30 rounded-full" />
                </div>
             </div>
          </div>

          {/* ── High-Speed Scanner Beam ── */}
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden rounded-[200px] opacity-40">
             <div className="w-full h-2 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-xl animate-scanner-sweep-fast" />
          </div>

          {/* ── Data Sparks ── */}
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-spark-pulse"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${40 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes core-float {
          0%, 100% { transform: translateY(0) rotateX(0deg); }
          50% { transform: translateY(-40px) rotateX(3deg); }
        }
        @keyframes breathing {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.08); filter: brightness(1.3); }
        }
        @keyframes energy-pulse {
          0% { stroke-dasharray: 0 100; stroke-dashoffset: 0; opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { stroke-dasharray: 100 0; stroke-dashoffset: -100; opacity: 0; }
        }
        @keyframes scanner-sweep-fast {
          0% { transform: translateY(-100%) rotate(-15deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(600%) rotate(-15deg); opacity: 0; }
        }
        @keyframes spark-pulse {
          0%, 100% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.5); opacity: 0.8; }
        }
        .animate-core-float { animation: core-float 12s ease-in-out infinite; }
        .animate-breathing { animation: breathing 8s ease-in-out infinite; }
        .animate-energy-pulse { animation: energy-pulse linear infinite; }
        .animate-scanner-sweep-fast { animation: scanner-sweep-fast 8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-spark-pulse { animation: spark-pulse 4s ease-in-out infinite; }
        
        .fallback-core {
           background: radial-gradient(circle at center, var(--fx-primary) 0%, transparent 70%);
           border-radius: 50%;
           filter: blur(60px);
           opacity: 0.3;
           width: 400px;
           height: 400px;
        }
      `}</style>
    </div>
  );
};

export default NeuralCoreBackground;
