'use client';

import React, { useState, useEffect } from 'react';

interface LaunchIntro3roProps {
  onClose: () => void;
}

export default function LaunchIntro3ro({ onClose }: LaunchIntro3roProps) {
  const [countdown, setCountdown] = useState(3);
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setLaunched(true);
          setTimeout(onClose, 2200);
          return 0;
        }
        return prev - 1;
      });
    }, 900);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[99999] bg-gradient-to-b from-[#020514] via-[#0B0626] to-[#1E0844] flex flex-col items-center justify-center overflow-hidden font-sans select-none animate-fadeIn">
      {/* Skip button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 z-50 bg-white/15 hover:bg-white/25 text-white text-xs font-black px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm transition-all cursor-pointer"
      >
        Saltar Intro ⏭️
      </button>

      {/* Starfield simulation */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="w-1 h-1 bg-white rounded-full absolute top-12 left-20 animate-ping" />
        <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full absolute top-1/4 right-1/4 animate-pulse" />
        <div className="w-1 h-1 bg-purple-300 rounded-full absolute bottom-1/3 left-1/3 animate-ping" />
        <div className="w-2 h-2 bg-blue-300 rounded-full absolute top-1/2 left-12 animate-pulse" />
        <div className="w-1.5 h-1.5 bg-white rounded-full absolute bottom-20 right-20 animate-ping" />
      </div>

      {/* Title & Badge */}
      <div className="relative z-10 text-center mb-8 px-4">
        <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-purple-950 text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg shadow-amber-400/30 mb-3">
          Libro Digital · Grado 3°
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
          Misión: Galaxia del Saber
        </h1>
        <p className="text-sm font-bold text-purple-200 mt-2">
          Método Fedor · Matemáticas de Primaria
        </p>
      </div>

      {/* Rocket Vessel */}
      <div
        className={`relative z-10 transition-all duration-1000 ease-in flex flex-col items-center ${
          launched ? '-translate-y-[120vh] scale-75 opacity-90' : 'animate-bounce'
        }`}
        style={{ animationDuration: launched ? '1s' : '3s' }}
      >
        {/* Fedor Space Ship SVG */}
        <div className="w-36 h-48 md:w-44 md:h-56 relative">
          <svg viewBox="0 0 160 220" className="w-full h-full drop-shadow-2xl">
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7B2FBE" />
                <stop offset="100%" stopColor="#3A0D6B" />
              </linearGradient>
              <linearGradient id="fireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F5C518" />
                <stop offset="50%" stopColor="#FF8C2A" />
                <stop offset="100%" stopColor="#FF1D4E" />
              </linearGradient>
            </defs>

            {/* Wings */}
            <path d="M 30 140 L 5 180 L 40 180 Z" fill="url(#wingGrad)" stroke="#F5C518" strokeWidth="2" />
            <path d="M 130 140 L 155 180 L 120 180 Z" fill="url(#wingGrad)" stroke="#F5C518" strokeWidth="2" />

            {/* Body */}
            <path
              d="M 80 15 C 50 60 45 130 45 180 L 115 180 C 115 130 110 60 80 15 Z"
              fill="url(#bodyGrad)"
              stroke="#CBD5E1"
              strokeWidth="3"
            />

            {/* Red Nose Cone */}
            <path d="M 80 15 C 68 40 60 60 60 70 L 100 70 C 100 60 92 40 80 15 Z" fill="#FF1D4E" />

            {/* Glass Visor */}
            <circle cx="80" cy="110" r="22" fill="#0284C7" stroke="#F5C518" strokeWidth="3" />
            <circle cx="80" cy="110" r="16" fill="#38BDF8" />
            <text x="80" y="117" textAnchor="middle" fontSize="18">🧑‍🚀</text>

            {/* Rocket Thruster */}
            <rect x="65" y="180" width="30" height="12" rx="4" fill="#475569" />

            {/* Flame */}
            <path
              d="M 67 192 Q 80 230 80 250 Q 80 230 93 192 Z"
              fill="url(#fireGrad)"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>

      {/* Countdown or Launch text */}
      <div className="relative z-10 mt-6 text-center">
        {countdown > 0 ? (
          <div className="text-5xl md:text-7xl font-black text-amber-400 drop-shadow-lg tracking-widest animate-ping" style={{ animationDuration: '0.9s' }}>
            {countdown}
          </div>
        ) : (
          <div className="text-3xl md:text-5xl font-black text-amber-300 drop-shadow-lg tracking-wide animate-pulse">
            ¡DESPEGUE! 🚀
          </div>
        )}
      </div>
    </div>
  );
}
