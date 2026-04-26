import React, { useState, useEffect, useRef } from 'react';

const AnimatedBrain3D = ({ size = "md", intensity = "medium", className = "" }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Size mapping
  const sizeMap = {
    sm: { width: 60, height: 60, scale: 0.5, particles: 8 },
    md: { width: 180, height: 180, scale: 1, particles: 15 },
    lg: { width: 400, height: 400, scale: 2.2, particles: 30 },
    xl: { width: 600, height: 600, scale: 3.5, particles: 40 }
  };

  const config = sizeMap[size] || sizeMap.md;

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center justify-center pointer-events-none ${className}`}
      style={{ 
        width: config.width, 
        height: config.height,
        perspective: '1200px'
      }}
    >
      {/* ── 3D Container with Mouse Parallax ── */}
      <div 
        className="relative w-full h-full transition-transform duration-700 ease-out"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `rotateX(${mousePos.y * -6}deg) rotateY(${mousePos.x * 8}deg) translate3d(${mousePos.x * 10}px, ${mousePos.y * 10}px, 0)`
        }}
      >
        
        {/* ── Ambient Glow Layers ── */}
        <div className="absolute inset-0 bg-[var(--fx-primary)] opacity-20 blur-[60px] rounded-full animate-brain-pulse" />
        <div className="absolute inset-[10%] bg-[var(--fx-accent)] opacity-10 blur-[40px] rounded-full animate-brain-pulse" style={{ animationDelay: '1s' }} />

        {/* ── Neural Core (The Sphere) ── */}
        <div 
          className="absolute inset-0 flex items-center justify-center animate-brain-float"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Main Brain-Leaf Hybrid Body */}
          <div className="relative w-full h-full flex items-center justify-center">
             <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                <defs>
                   <linearGradient id="leaf_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#10b981" />
                   </linearGradient>
                </defs>
                {/* Left Side: Brain Lobes */}
                <path 
                  d="M50 20 C35 20, 20 35, 20 50 C20 65, 35 80, 50 80 Q45 50 50 20" 
                  fill="none" stroke="url(#leaf_grad)" strokeWidth="2.5" 
                  className="animate-pulse"
                />
                <path d="M30 40 Q40 45 50 40 M25 55 Q40 60 50 55 M35 70 Q45 75 50 70" stroke="#fff" strokeWidth="1" opacity="0.4" fill="none" />
                
                {/* Right Side: Leaf Structure */}
                <path 
                  d="M50 20 C65 20, 80 35, 80 50 C80 65, 65 80, 50 80 Q55 50 50 20" 
                  fill="url(#leaf_grad)" fillOpacity="0.15" stroke="url(#leaf_grad)" strokeWidth="2.5"
                />
                <path d="M50 20 L50 80 M50 35 L70 25 M50 50 L75 45 M50 65 L65 75" stroke="url(#leaf_grad)" strokeWidth="1.5" opacity="0.6" />
                
                {/* Glowing Core */}
                <circle cx="50" cy="50" r="4" fill="#fff" className="animate-ping" />
                <circle cx="50" cy="50" r="2" fill="#fff" />
             </svg>
          </div>


          {/* ── 3D Orbit Rings ── */}
          <div className="absolute inset-[-10%] border border-[var(--fx-primary)] rounded-full opacity-20 animate-ring-rotate" style={{ transform: 'rotateX(75deg)' }} />
          <div className="absolute inset-[-25%] border border-[var(--fx-accent)] rounded-full opacity-10 animate-ring-rotate-reverse" style={{ transform: 'rotateY(75deg)' }} />
          <div className="absolute inset-[-40%] border border-[var(--fx-secondary)] rounded-full opacity-5 animate-ring-rotate" style={{ transform: 'rotateX(45deg) rotateY(45deg)' }} />

          {/* ── Scanner Sweep Beam ── */}
          <div className="absolute inset-[-50%] pointer-events-none z-20">
             <div className="w-full h-[10px] bg-white/10 blur-[5px] absolute top-1/2 -translate-y-1/2 animate-scanner-sweep-2 opacity-0 dark:opacity-30" />
          </div>
        </div>

        {/* ── Neural Particles ── */}
        {[...Array(config.particles)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: 0.2,
              transform: `translateZ(${Math.random() * 200 - 100}px)`
            }}
          />
        ))}

      </div>

      <style>{`
        @keyframes brain-float {
          0%, 100% { transform: translateY(0) translateZ(0); }
          50% { transform: translateY(-20px) translateZ(50px); }
        }
        @keyframes brain-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes brain-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.1); }
        }
        @keyframes ring-rotate {
          from { transform: rotateX(75deg) rotateZ(0deg); }
          to { transform: rotateX(75deg) rotateZ(360deg); }
        }
        @keyframes ring-rotate-reverse {
          from { transform: rotateY(75deg) rotateZ(360deg); }
          to { transform: rotateY(75deg) rotateZ(0deg); }
        }
        @keyframes particle-float {
          0% { transform: translateY(0) translateZ(-100px); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-200px) translateZ(100px); opacity: 0; }
        }
        @keyframes scanner-sweep-2 {
          0% { transform: translateY(-200px) rotate(-15deg); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateY(200px) rotate(-15deg); opacity: 0; }
        }

        .animate-brain-float { animation: brain-float 8s ease-in-out infinite; }
        .animate-brain-rotate { animation: brain-rotate 20s linear infinite; }
        .animate-brain-pulse { animation: brain-pulse 4s ease-in-out infinite; }
        .animate-ring-rotate { animation: ring-rotate 15s linear infinite; }
        .animate-ring-rotate-reverse { animation: ring-rotate-reverse 20s linear infinite; }
        .animate-particle-float { animation: particle-float 10s linear infinite; }
        .animate-scanner-sweep-2 { animation: scanner-sweep-2 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};

export default AnimatedBrain3D;
