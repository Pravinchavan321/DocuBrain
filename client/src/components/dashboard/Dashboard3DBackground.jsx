import React, { useEffect, useRef } from 'react';
import AnimatedBrain3D from '../common/AnimatedBrain3D';

const Dashboard3DBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 40; 
      const yPos = (clientY / window.innerHeight - 0.5) * 40;
      
      containerRef.current.style.setProperty('--mx', `${xPos}px`);
      containerRef.current.style.setProperty('--my', `${yPos}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]"
      style={{ perspective: '1500px' }}
    >
      {/* ── 1. Deep Space Atmosphere ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)]" />
      
      {/* ── 2. Cinematic Horizon Glow ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[40%] bg-cyan-500/5 blur-[160px] rotate-[-5deg]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[40%] bg-purple-500/5 blur-[160px] rotate-[5deg]" />

      {/* ── 3. Dual-Layered Perspective Grid ── */}
      <div 
        className="absolute bottom-[-100px] w-full h-[800px] opacity-[0.15]"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--fx-accent)), repeating-linear-gradient(0deg, var(--fx-accent) 0, var(--fx-accent) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, var(--fx-accent) 0, var(--fx-accent) 1px, transparent 1px, transparent 60px)',
          transform: 'rotateX(70deg) translateY(0) translate(var(--mx, 0), var(--my, 0))',
          maskImage: 'linear-gradient(to top, black 20%, transparent 80%)',
          transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      />
      <div 
        className="absolute bottom-[-100px] w-full h-[800px] opacity-[0.05]"
        style={{
          background: 'repeating-linear-gradient(0deg, var(--fx-primary) 0, var(--fx-primary) 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, var(--fx-primary) 0, var(--fx-primary) 1px, transparent 1px, transparent 30px)',
          transform: 'rotateX(70deg) translateY(0) translate(calc(var(--mx, 0) * 1.5), calc(var(--my, 0) * 1.5))',
          maskImage: 'linear-gradient(to top, black 10%, transparent 60%)',
          transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      />

      {/* ── 4. Moving Data Stream Beams ── */}
      <div className="absolute inset-0 opacity-20">
         {[...Array(8)].map((_, i) => (
           <div 
             key={i}
             className="absolute w-[2px] h-[400px] bg-gradient-to-t from-transparent via-[var(--fx-accent)] to-transparent animate-beam-drift"
             style={{
               left: `${10 + i * 12}%`,
               top: `${-50 + Math.random() * 50}%`,
               animationDelay: `${i * 1.2}s`,
               animationDuration: `${10 + Math.random() * 10}s`
             }}
           />
         ))}
      </div>

      {/* ── 5. The Heart of Intelligence (3D Brain Core) ── */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{ 
          transform: 'translate(calc(var(--mx, 0) * -0.8), calc(var(--my, 0) * -0.8))', 
          transition: 'transform 0.4s ease-out' 
        }}
      >
         <AnimatedBrain3D size="xl" className="opacity-[0.12] dark:opacity-[0.18]" />
      </div>

      {/* ── 6. Floating Document Panels ── */}
      {[...Array(6)].map((_, i) => (
        <div 
          key={i}
          className="absolute bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl animate-doc-float hidden lg:block"
          style={{
            width: `${120 + i * 20}px`,
            height: `${160 + i * 10}px`,
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
            animationDelay: `${i * 1.2}s`,
            opacity: 0.05,
            transform: `rotateY(${10 + i * 5}deg) rotateX(5deg) translateZ(${i * 20}px)`
          }}
        >
           <div className="w-full h-2 bg-white/10 m-4 rounded-full" />
           <div className="w-3/4 h-2 bg-white/5 m-4 rounded-full" />
           <div className="w-1/2 h-2 bg-white/5 m-4 rounded-full" />
        </div>
      ))}

      {/* ── 7. Floating Ambient Particles ── */}
      <div className="absolute inset-0 z-0">
         {[...Array(40)].map((_, i) => (
           <div 
             key={i}
             className="absolute w-1 h-1 bg-white rounded-full animate-float-ambient"
             style={{
               left: `${Math.random() * 100}%`,
               top: `${Math.random() * 100}%`,
               opacity: Math.random() * 0.2,
               animationDelay: `${Math.random() * 10}s`,
               animationDuration: `${15 + Math.random() * 15}s`
             }}
           />
         ))}
      </div>

      <style>{`
        @keyframes beam-drift {
          0% { transform: translateY(0) scaleY(0.5); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(120vh) scaleY(1.5); opacity: 0; }
        }
        @keyframes float-ambient {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
        }
        @keyframes doc-float {
          0%, 100% { transform: translateY(0) rotateY(10deg); }
          50% { transform: translateY(-20px) rotateY(15deg); }
        }
        .animate-beam-drift { animation: beam-drift linear infinite; }
        .animate-float-ambient { animation: float-ambient ease-in-out infinite; }
        .animate-doc-float { animation: doc-float 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard3DBackground;
