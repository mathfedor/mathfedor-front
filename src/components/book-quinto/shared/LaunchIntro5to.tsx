'use client';

import React, { useState, useEffect } from 'react';

interface LaunchIntro5toProps {
  onClose: () => void;
}

export default function LaunchIntro5to({ onClose }: LaunchIntro5toProps) {
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
    <div className="fixed inset-0 z-[99999] bg-gradient-to-b from-[#020514] via-[#090A24] to-[#170E38] flex flex-col items-center justify-center overflow-hidden font-sans select-none animate-fadeIn">
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
        <div className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg shadow-amber-400/30 mb-3">
          Libro Digital Interactivo · Grado 5°
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
          Galaxia del Saber: Fedor 5°
        </h1>
        <p className="text-sm font-bold text-amber-200 mt-2">
          15 Misiones Planetarias · Mercurio hasta el Cinturón de Kuiper
        </p>
      </div>

      {/* Central Visual: Rocket Launch */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {!launched ? (
          <div className="flex flex-col items-center">
            <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-orange-500 animate-pulse">
              {countdown}
            </div>
            <p className="text-sm font-black text-amber-200 uppercase tracking-widest mt-4">
              Preparando Travesía Interplanetaria...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-bounce">
            <div className="text-8xl md:text-9xl transform -rotate-45">🚀</div>
            <div className="text-2xl md:text-3xl font-black text-emerald-400 mt-4 tracking-wider animate-pulse">
              ¡DESPEGUE EXITOSO!
            </div>
            <p className="text-xs text-white/80 mt-1">Entrando a la Galaxia Fedor...</p>
          </div>
        )}
      </div>

      {/* Bottom Planet Arc */}
      <div className="absolute -bottom-24 w-[120vw] h-48 bg-gradient-to-t from-indigo-900/60 to-transparent rounded-[100%] border-t-2 border-indigo-400/40 pointer-events-none" />
    </div>
  );
}
