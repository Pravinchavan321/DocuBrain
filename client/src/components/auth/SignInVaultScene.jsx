import React, { useState, useEffect } from 'react';

const SignInVaultScene = () => {
  const [statusIndex, setStatusIndex] = useState(0);
  const statusMessages = [
    "Verifying Secure Session...",
    "Checking Knowledge Vault...",
    "Access Layer Ready..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-transparent select-none pointer-events-none" style={{ perspective: '1200px' }}>
      
      {/* ── SECURITY GRID FLOOR ── */}
      <div className="absolute bottom-0 w-full h-[300px] opacity-20" 
           style={{ 
             background: 'linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.1)), repeating-linear-gradient(0deg, rgba(6, 182, 212, 0.1) 0, rgba(6, 182, 212, 0.1) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(6, 182, 212, 0.1) 0, rgba(6, 182, 212, 0.1) 1px, transparent 1px, transparent 40px)',
             transform: 'rotateX(60deg) translateY(100px)',
             maskImage: 'linear-gradient(to top, black, transparent)'
           }} 
      />

      {/* ── CENTRAL NEURAL VAULT / CORE ── */}
      <div className="relative z-20 group">
        {/* Outer Glow Pulsing */}
        <div className="absolute inset-[-80px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        
        {/* Rotating Security Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-cyan-500/20 rounded-full animate-spin-slow" style={{ transform: 'translate(-50%, -50%) rotateX(75deg)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-purple-500/20 rounded-full animate-spin-reverse" style={{ transform: 'translate(-50%, -50%) rotateY(75deg)' }} />
        
        {/* Core Vault Orb */}
        <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-[2px] shadow-[0_0_120px_rgba(99,102,241,0.4)] animate-float-slow">
          <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center relative overflow-hidden">
            {/* Internal Circuitry Reflection */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.2),transparent_70%)]" />
            
            {/* Vault Gateway SVG Icon */}
            <svg width="100" height="100" viewBox="0 0 64 64" fill="none" className="relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
               <path d="M32 10L14 18V30C14 42 32 54 32 54C32 54 50 42 50 30V18L32 10Z" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-dash" />
               <path d="M32 22V38" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
               <path d="M26 30H38" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
               <circle cx="32" cy="30" r="14" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
            </svg>

            {/* Inner Rotating Code/Nodes */}
            <div className="absolute inset-0 border border-cyan-500/10 rounded-full animate-spin-slow scale-110" />
          </div>
        </div>

        {/* Scanner Beam */}
        <div className="absolute inset-[-100px] z-30 pointer-events-none overflow-hidden rounded-full">
           <div className="w-full h-[50%] bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-scanner-sweep" />
        </div>
      </div>

      {/* ── SECURITY NODES & PARTICLES ── */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-node-drift"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.8}s`,
            opacity: 0.3
          }}
        />
      ))}

      {/* ── SYSTEM STATUS TEXT ── */}
      <div className="absolute bottom-16 left-12 font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500 flex items-center gap-4">
         <div className="flex gap-1">
            <div className="w-1 h-3 bg-cyan-500 animate-pulse" />
            <div className="w-1 h-3 bg-cyan-500 animate-pulse delay-75" />
            <div className="w-1 h-3 bg-cyan-500 animate-pulse delay-150" />
         </div>
         <span key={statusIndex} className="animate-in fade-in slide-in-from-left-4 duration-1000">
            {statusMessages[statusIndex]}
         </span>
      </div>

      <style>{`
        @keyframes scanner-sweep {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        @keyframes node-drift {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translate(40px, -40px); opacity: 0; }
        }
        .animate-scanner-sweep { animation: scanner-sweep 5s ease-in-out infinite; }
        .animate-node-drift { animation: node-drift 8s linear infinite; }
      `}</style>
    </div>
  );
};

export default SignInVaultScene;
