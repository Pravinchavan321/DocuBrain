import React, { useEffect, useState, useRef } from 'react';

const FloatingBlobs = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // Normalize to -1 to 1
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const blobs = [
    {
      size: 'w-[400px] h-[400px]',
      color: 'from-purple-600/40 to-indigo-600/20',
      initialPos: { top: '10%', left: '15%' },
      parallaxFactor: 30,
      animationDelay: '0s',
      blur: 'blur-[80px]',
    },
    {
      size: 'w-[500px] h-[500px]',
      color: 'from-blue-600/30 to-cyan-500/10',
      initialPos: { top: '50%', left: '60%' },
      parallaxFactor: -40,
      animationDelay: '2s',
      blur: 'blur-[100px]',
    },
    {
      size: 'w-[350px] h-[350px]',
      color: 'from-cyan-500/30 to-emerald-500/10',
      initialPos: { top: '70%', left: '20%' },
      parallaxFactor: 20,
      animationDelay: '4s',
      blur: 'blur-[70px]',
    },
    {
      size: 'w-[450px] h-[450px]',
      color: 'from-pink-600/20 to-purple-500/10',
      initialPos: { top: '20%', left: '70%' },
      parallaxFactor: -25,
      animationDelay: '1s',
      blur: 'blur-[90px]',
    },
  ];

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden bg-[#020617] pointer-events-none">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)]" />
      
      {blobs.map((blob, index) => (
        <div
          key={index}
          className={`absolute rounded-full bg-gradient-to-br ${blob.color} ${blob.size} ${blob.blur} mix-blend-screen animate-blob-float transition-transform duration-1000 ease-out`}
          style={{
            top: blob.initialPos.top,
            left: blob.initialPos.left,
            animationDelay: blob.animationDelay,
            transform: `translate(${mousePos.x * blob.parallaxFactor}px, ${mousePos.y * blob.parallaxFactor}px)`,
          }}
        />
      ))}

      <style>{`
        @keyframes blob-float {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.6; }
          33% { transform: translateY(-20px) rotate(5deg) scale(1.05); opacity: 0.8; }
          66% { transform: translateY(20px) rotate(-5deg) scale(0.95); opacity: 0.5; }
        }
        .animate-blob-float {
          animation: blob-float 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingBlobs;
