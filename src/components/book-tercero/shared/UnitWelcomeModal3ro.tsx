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
        className="relative w-full max-w-[420px] bg-white rounded-[28px] p-6 md:p-7 text-center shadow-2xl animate-popIn border border-white/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top purple pill indicator bar */}
        <div className="w-12 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto mb-5 shadow-xs" />

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-black text-[#7B2FBE] font-['Baloo_2',sans-serif] leading-tight mb-2 tracking-tight">
          {tut.title}
        </h2>

        {/* Subtitle / Description */}
        <p className="text-xs md:text-sm font-bold text-gray-600 leading-relaxed max-w-xs mx-auto mb-5">
          {tut.text}
        </p>

        {/* 4 Numbered Steps / Highlights */}
        <div className="space-y-2.5 mb-6 text-left">
          {tut.steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-[#F7F4FF] rounded-2xl border border-purple-100/70 shadow-xs hover:border-purple-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#7B2FBE] to-[#9B5CE5] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                {idx + 1}
              </div>
              <div className="text-xs md:text-sm font-bold text-gray-800 leading-snug">
                {step}
              </div>
            </div>
          ))}
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#7B2FBE] via-[#8E3DE0] to-[#A864E8] hover:from-[#6A23A8] hover:to-[#924CE0] text-white font-black text-sm md:text-base shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer mb-2.5 flex items-center justify-center gap-2"
        >
          <span>¡Empezar Aventura!</span>
          <span>🚀</span>
        </button>

        {/* Secondary Link: Omitir tutorial */}
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-gray-600 font-bold underline cursor-pointer transition-colors block mx-auto pt-1"
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
