import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AnimatedBrain3D from '../common/AnimatedBrain3D';
import AIBrainBackground from '../backgrounds/AIBrainBackground';

const AuthLayout = ({ children, title, subtitle }) => {
  const cardRef = useRef(null);
  const location = useLocation();
  const isRegister = location.pathname === '/register';
  
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
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
    
    const rotateX = ((y - centerY) / centerY) * -4; 
    const rotateY = ((x - centerX) / centerX) * 4;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-primary)] font-sans antialiased text-[var(--text-primary)]">
      
      {/* ── DOCUBRAIN PREMIUM ANIMATED BRAIN BACKGROUND ── */}
      <AIBrainBackground />

      <div className={`relative z-10 w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 transition-all duration-700 ease-out-expo ${isEntering ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'}`}>
        
        {/* ── LEFT SIDE: VISUAL SHOWCASE ── */}
        <div className="hidden lg:flex flex-col justify-center pr-12">
          <div className="mb-8">
            <AnimatedBrain3D size="lg" className="mb-6 drop-shadow-2xl" />
          </div>
          <h1 className="text-5xl font-black font-display tracking-tight leading-tight mb-4 text-[var(--text-primary)]">
            Enterprise <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">Intelligence.</span>
          </h1>
          <p className="text-lg font-medium text-[var(--text-secondary)] leading-relaxed">
            Secure, precise, and instantaneous context retrieval. Ask short prompts, get comprehensive multi-document insights.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md shadow-sm font-bold text-sm text-[var(--text-primary)]">Hybrid Search</div>
            <div className="px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md shadow-sm font-bold text-sm text-[var(--text-primary)]">Query Expansion</div>
          </div>
        </div>

        {/* ── RIGHT SIDE: AUTH CARD CONTAINER ── */}
        <div className="flex items-center justify-center">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-[420px] group transition-transform duration-300 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: !isEntering 
                ? `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` 
                : undefined,
            }}
          >
            {/* Layer 1: Animated Border */}
            <div className="absolute -inset-[2px] rounded-[34px] overflow-hidden p-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block">
               {/* Clockwise Purple Ring */}
               <div 
                 className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_15%,#a855f7_25%,#7c3aed_40%,#c084fc_55%,transparent_70%)] animate-spin-fast"
                 style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor', padding: '3px' }}
               />
            </div>
            
            <div className="absolute inset-0 rounded-[32px] shadow-2xl dark:shadow-[0_0_40px_rgba(168,85,247,0.15)] bg-white/40 dark:bg-black/40 blur-xl z-[-2]" />

            {/* Layer 2: Main Content Container (Crisp & Sharp Text) */}
            <div 
              className="relative z-10 p-8 md:p-10 rounded-[32px] overflow-hidden bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800"
              style={{ transform: 'translateZ(20px)' }}
            >
              {/* Dedicated Blur Layer (Sibling to content to prevent text blur) */}
              <div className="absolute inset-0 z-[-1] backdrop-blur-[24px]" />
              
              {/* Header (Condensed & Sharp) */}
              <div className="flex flex-col items-center mb-8 lg:hidden">
                <AnimatedBrain3D size="sm" className="mb-4" />
                <h1 className="text-3xl font-black font-display text-[var(--text-primary)] tracking-tighter text-center uppercase leading-none">
                  DocuBrain
                </h1>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-black font-display text-[var(--text-primary)] mb-2 tracking-tight">{title}</h2>
                <p className="text-[var(--text-secondary)] font-bold tracking-wide uppercase text-xs">{subtitle}</p>
                <div className="h-1.5 w-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mt-4 shadow-sm" />
              </div>

              {/* Form Content */}
              <div className="relative z-20">
                {children}
              </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <style>{`
        .ease-out-expo { transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-fast { animation: spin-fast 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default AuthLayout;
