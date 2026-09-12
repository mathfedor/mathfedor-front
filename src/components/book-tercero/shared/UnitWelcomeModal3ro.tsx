'use client';

import React from 'react';
import unitTutsData from '@/mocks/data/book-unit-tuts-3.data.json';
import { fedorSpeak } from '../shared/Grade3Speech';

interface UnitWelcomeModal3roProps {
  isOpen: boolean;
  onClose: () => void;
  unitIndex: number;
}

export default function UnitWelcomeModal3ro({
  isOpen,
  onClose,
  unitIndex,
}: UnitWelcomeModal3roProps) {
  if (!isOpen) return null;

  const tuts = unitTutsData?.UNIT_TUTS || [];
  const tut = tuts[unitIndex] || {
    icon: '📘',
    title: `¡Unidad ${unitIndex + 1}!`,
    text: 'Aprende y domina los conceptos matemáticos de esta aventura.',
    steps: [
      'Explora las bases conceptuales con ejemplos didácticos',
      'Desarrolla el pensamiento matemático paso a paso',
      'Domina la operación con ejercicios interactivos',
      'Evalúa tus conocimientos con retos estilo SABER',
    ],
  };

  const handleStart = () => {
    fedorSpeak(`¡Empezamos la aventura en ${tut.title}!`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] bg-white rounded-[38px] px-8 py-9 md:px-10 md:py-10 text-center shadow-[0_25px_70px_rgba(0,0,0,0.35)] animate-popIn border border-white/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glossy 3D purple pill indicator bar */}
        <div className="w-16 h-3 bg-gradient-to-b from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] rounded-full mx-auto mb-7 mt-1 shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_3px_6px_rgba(109,40,217,0.3)]" />

        {/* Title */}
        <h2 className="text-2xl md:text-[27px] font-black text-[#7B2FBE] font-['Baloo_2',sans-serif] leading-tight mb-3.5 tracking-tight">
          {tut.title}
        </h2>

        {/* Subtitle / Description */}
        <p className="text-sm md:text-[15px] font-bold text-[#555555] leading-relaxed max-w-[360px] mx-auto mb-7">
          {tut.text}
        </p>

        {/* 4 Numbered Steps / Highlights with generous spacing */}
        <div className="space-y-3.5 mb-7 text-left">
          {tut.steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 md:gap-4 py-3.5 px-4 md:py-4 md:px-5 bg-[#F7F4FF] rounded-[20px] border border-purple-100/60 shadow-xs hover:border-purple-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7B2FBE] to-[#9333EA] text-white font-black text-xs md:text-sm flex items-center justify-center shrink-0 shadow-sm">
                {idx + 1}
              </div>
              <div className="text-xs md:text-[14px] font-extrabold text-[#333333] leading-snug">
                {step}
              </div>
            </div>
          ))}
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-[20px] bg-gradient-to-r from-[#8638DF] via-[#8130DA] to-[#7625C9] hover:from-[#7625C9] hover:to-[#681DB7] text-white font-black text-base md:text-[17px] shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.015] active:scale-[0.985] cursor-pointer mb-3.5 flex items-center justify-center gap-2"
        >
          <span>¡Empezar Aventura!</span>
          <span>🚀</span>
        </button>

        {/* Secondary Link: Omitir tutorial */}
        <button
          type="button"
          onClick={onClose}
          className="text-xs md:text-[13px] text-gray-400 hover:text-gray-600 font-semibold underline cursor-pointer transition-colors block mx-auto pt-0.5 tracking-wide"
        >
          Omitir tutorial
        </button>

        <style jsx>{`
          @keyframes popIn {
            0% {
              transform: scale(0.92);
              opacity: 0;
            }
            70% {
              transform: scale(1.02);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-popIn {
            animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
      </div>
    </div>
  );
}
