import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AnimatedBrain3D from '../common/AnimatedBrain3D';
import AIBrainBackground from '../backgrounds/AIBrainBackground';

const AuthLayout = ({ children, title, subtitle }) => {
  const cardRef = useRef(null);
  const location = useLocation();
  const isRegister = location.pathname === '/register';
  const mode = isRegister ? 'signup' : 'login';
  
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    // Elegant entrance animation trigger
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth 3D Tilt
    const rotateX = ((y - centerY) / centerY) * -8; 
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#030816] font-sans antialiased">
      
      {/* ── DOCUBRAIN PREMIUM ANIMATED BRAIN BACKGROUND ── */}
      <AIBrainBackground />

      {/* ── AUTH CARD CONTAINER ── */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full max-w-[400px] z-10 transition-all duration-[600ms] ease-out-expo group ${isEntering ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'} hover:scale-[1.02]`}
        style={{
          transformStyle: 'preserve-3d',
          transform: !isEntering 
            ? `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` 
            : undefined,
        }}
      >
        {/* Layer 1: Animated Border (Clockwise & Anticlockwise Purple Lights) */}
        <div className="absolute -inset-[2px] rounded-[34px] overflow-hidden p-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500">
           {/* Clockwise Purple Ring */}
           <div 
             className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_15%,#a855f7_25%,#7c3aed_40%,#c084fc_55%,transparent_70%)] animate-spin-fast"
             style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor', padding: '3px' }}
           />
           {/* Anticlockwise Purple Ring */}
           <div 
             className="absolute inset-[-100%] bg-[conic-gradient(from_360deg,transparent_15%,#d8b4fe_25%,#6b21a8_40%,#9333ea_55%,transparent_70%)] animate-spin-reverse-fast opacity-80"
             style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor', padding: '3px' }}
           />
        </div>

        {/* Layer 2: Main Content Container (Crisp & Sharp Text) */}
        <div 
          className="relative z-10 p-8 md:p-10 rounded-[32px] overflow-hidden"
          style={{ 
            transform: 'translateZ(100px)',
            background: 'rgba(3, 8, 22, 0.01)', // 99% Transparent
            border: '1px solid rgba(255, 255, 255, 0.1)' // Sharper edge
          }}
        >
          {/* Dedicated Blur Layer (Sibling to content to prevent text blur) */}
          <div className="absolute inset-0 z-[-1] backdrop-blur-[20px]" />
          {/* Header (Condensed & Sharp) */}
          <div className="flex flex-col items-center mb-6">
            <AnimatedBrain3D size="sm" className="mb-4" />
            <h1 className="text-3xl font-black text-white tracking-tighter text-center uppercase leading-none" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(168, 85, 247, 0.2)' }}>
              DocuBrain
            </h1>
            <p className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.3em] mt-2 text-shadow-sm">{subtitle}</p>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.9)' }}>{title}</h2>
            <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mx-auto shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          </div>


          {/* Form Content */}
          <div className="relative z-20">
            {children}
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      <style>{`
        .ease-out-expo { transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-fast {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-fast { animation: spin-fast 2.5s linear infinite; }
        .animate-spin-reverse-fast { animation: spin-reverse-fast 3.5s linear infinite; }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
