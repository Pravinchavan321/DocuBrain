import { useState, useRef, useCallback } from 'react';

/* ── Integrated Neon Particles ── */
const Particle = ({ x, size, delay, hue }) => (
  <span
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      top: '-20%',
      width: `${size}px`,
      height: `${size}px`,
      background: `hsla(${hue}, 85%, 60%, 0.4)`,
      animation: `particleDrop 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s forwards`,
      opacity: 0,
      boxShadow: `0 0 ${size * 2}px hsla(${hue}, 85%, 60%, 0.2)`,
    }}
  />
);

const Button = ({ children, type = 'button', onClick, disabled = false, styleType = 'primary', fullWidth = true }) => {
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const particleId = useRef(0);
  const widthClass = fullWidth ? 'w-full' : 'w-auto';

  const handleEnter = useCallback(() => {
    if (disabled) return;
    setHovered(true);
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: particleId.current++,
      x: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 0.2,
      hue: Math.random() > 0.5 ? 190 : 270,
    }));
    setParticles(newParticles);
  }, [disabled]);

  const handleLeave = useCallback(() => {
    setHovered(false);
    setTimeout(() => setParticles([]), 800);
  }, []);

  const baseStyles = {
    primary: {
      background: hovered 
        ? 'linear-gradient(135deg, #06b6d4, #6366f1, #8b5cf6)' 
        : 'linear-gradient(135deg, #0891b2, #7c3aed)',
      boxShadow: hovered 
        ? '0 12px 30px -8px rgba(6, 182, 212, 0.5), 0 0 20px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
        : '0 4px 15px -4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444, #991b1b)',
      boxShadow: hovered ? '0 10px 25px -8px rgba(239, 68, 68, 0.4)' : 'none',
    }
  };

  const current = baseStyles[styleType] || baseStyles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] cursor-pointer overflow-hidden transition-all duration-300 active:scale-[0.97] active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed ${widthClass}`}
      style={{
        ...current,
        color: '#fff',
        transform: hovered && !disabled ? 'translateY(-3px)' : 'translateY(0)',
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Animated Shine Sweep */}
      <div className={`absolute inset-0 pointer-events-none ${hovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
         <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg] animate-shine-fast" />
      </div>

      {/* Glow Pulse */}
      {hovered && !disabled && (
        <div className="absolute inset-0 rounded-2xl animate-button-glow pointer-events-none" />
      )}

      {/* Particles */}
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}

      <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
        {children}
      </span>

      <style>{`
        @keyframes shine-fast {
          0% { transform: translateX(0) skewX(-30deg); }
          100% { transform: translateX(300%) skewX(-30deg); }
        }
        @keyframes button-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(34, 211, 238, 0); }
          50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.3); }
        }
        @keyframes particleDrop {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(300%) scale(0.8); }
        }
      `}</style>
    </button>
  );
};

export default Button;
