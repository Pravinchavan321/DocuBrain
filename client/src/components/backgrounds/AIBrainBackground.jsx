import React, { useMemo } from "react";
import "./AIBrainBackground.css";

export default function AIBrainBackground() {
  const nodes = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 5,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
      })),
    []
  );

  const firingNeurons = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        delay: i * 0.8,
      })),
    []
  );

  return (
    <div className="ai-bg" aria-hidden="true">
      {/* ── Layer 1: Ambient Depth ── */}
      <div className="depth-glow blue" />
      <div className="depth-glow pink" />
      <div className="depth-glow indigo" />

      {/* ── Layer 2: The Mega Brain (Zoomed In) ── */}
      <div className="brain-container">
        <svg viewBox="0 0 800 400" className="mega-brain-svg">
          <defs>
            <filter id="brainGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="brainGradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d9ff" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Detailed Brain Lobes */}
          <g className="brain-lobes" filter="url(#brainGlow)">
            <path className="lobe lobe-left" d="M380 80 C300 80, 240 140, 240 220 C240 280, 300 340, 380 340 Q390 210 380 80" />
            <path className="lobe lobe-right" d="M420 80 C500 80, 560 140, 560 220 C560 280, 500 340, 420 340 Q410 210 420 80" />
          </g>

          {/* Neural Convolutions */}
          <g className="convolutions" fill="none" strokeWidth="1.5">
             <path d="M280 180 Q330 150 380 180" className="path-pulse" />
             <path d="M300 240 Q340 220 380 240" className="path-pulse" />
             <path d="M520 180 Q470 150 420 180" className="path-pulse" />
             <path d="M500 240 Q460 220 420 240" className="path-pulse" />
             <path d="M340 120 Q380 140 380 200" className="path-pulse" />
             <path d="M460 120 Q420 140 420 200" className="path-pulse" />
          </g>

          {/* Firing Neurons (Animated Dots on paths) */}
          {firingNeurons.map(fn => (
            <circle key={fn.id} r="3" fill="#fff" className="firing-neuron">
               <animateMotion 
                 dur="3s" 
                 repeatCount="indefinite" 
                 begin={`${fn.delay}s`}
                 path="M280 180 Q330 150 380 180" 
               />
            </circle>
          ))}
        </svg>
      </div>

      {/* ── Layer 3: Circular Tech Hub (Bottom) ── */}
      <div className="tech-hub">
        <div className="hub-ring ring-outer" />
        <div className="hub-ring ring-middle" />
        <div className="hub-ring ring-inner" />
        <div className="hub-core" />
        
        {/* Vertical Energy Beams */}
        <div className="hub-beams">
          <div className="beam beam-center" />
          <div className="beam beam-left" />
          <div className="beam beam-right" />
        </div>
      </div>

      {/* ── Layer 4: Floating Data Particles ── */}
      {nodes.map((n) => (
        <span
          key={n.id}
          className="node-particle"
          style={{
            left: `${n.left}%`,
            top: `${n.top}%`,
            width: `${n.size}px`,
            height: `${n.size}px`,
            animationDelay: `${n.delay}s`,
            animationDuration: `${n.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
