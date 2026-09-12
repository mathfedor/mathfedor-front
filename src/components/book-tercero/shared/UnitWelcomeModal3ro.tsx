'use client';

import React from 'react';
import unitTutsData from '@/mocks/data/book-unit-tuts-3.data.json';
import { fedorSpeak } from '../shared/Grade3Speech';

interface UnitWelcomeModal3roProps {
  isOpen: boolean;
  onClose: () => void;
  unitIndex: number;
}

export function UnitOperationIcon3D({ unitIndex }: { unitIndex: number }) {
  // Unit 0: Adición (+) - Plus 3D
  if (unitIndex === 0) {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_10px_rgba(109,40,217,0.35)]">
        <defs>
          <linearGradient id="u0_grad" x1="32" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A770FF" />
            <stop offset="40%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
        {/* Horizontal bar */}
        <rect x="10" y="27" width="44" height="10" rx="5" fill="url(#u0_grad)" />
        {/* Vertical bar */}
        <rect x="27" y="10" width="10" height="44" rx="5" fill="url(#u0_grad)" />
      </svg>
    );
  }

  // Unit 1: Sustracción (-) - Minus 3D
  if (unitIndex === 1) {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_10px_rgba(109,40,217,0.35)]">
        <defs>
          <linearGradient id="u1_grad" x1="32" y1="27" x2="32" y2="37" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A770FF" />
            <stop offset="40%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
        <rect x="9" y="27" width="46" height="10" rx="5" fill="url(#u1_grad)" />
      </svg>
    );
  }

  // Unit 2: Multiplicación (×) - Times 3D
  if (unitIndex === 2) {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_10px_rgba(109,40,217,0.35)]">
        <defs>
          <linearGradient id="u2_grad" x1="32" y1="10" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A770FF" />
            <stop offset="40%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
        <g transform="rotate(45 32 32)">
          <rect x="10" y="27" width="44" height="10" rx="5" fill="url(#u2_grad)" />
          <rect x="27" y="10" width="10" height="44" rx="5" fill="url(#u2_grad)" />
        </g>
      </svg>
    );
  }

  // Unit 3: División (÷) - Exact match to user Image 2!
  if (unitIndex === 3) {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_10px_rgba(109,40,217,0.35)]">
        <defs>
          <linearGradient id="u3_grad" x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A770FF" />
            <stop offset="40%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
        {/* Top dot */}
        <circle cx="32" cy="15" r="5.5" fill="url(#u3_grad)" />
        {/* Middle horizontal bar */}
        <rect x="9" y="27" width="46" height="10" rx="5" fill="url(#u3_grad)" />
        {/* Bottom dot */}
        <circle cx="32" cy="49" r="5.5" fill="url(#u3_grad)" />
      </svg>
    );
  }

  // Unit 4: Problemas SABER
  if (unitIndex === 4) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7B2FBE] to-[#A864E8] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(123,47,190,0.4)]">
        🏆
      </div>
    );
  }

  // Unit 5: Factores y Múltiplos
  if (unitIndex === 5) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7B2FBE] to-[#A864E8] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(123,47,190,0.4)]">
        🔢
      </div>
    );
  }

  // Unit 6: Fracciones
  if (unitIndex === 6) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#16876A] to-[#24C496] flex items-center justify-center text-2xl font-black text-white shadow-[0_4px_14px_rgba(22,135,106,0.4)]">
        ½
      </div>
    );
  }

  // Unit 7: Aplicaciones
  if (unitIndex === 7) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1E40AF] to-[#3B82F6] flex items-center justify-center text-2xl text-white shadow-[0_4px_14px_rgba(30,64,175,0.4)]">
        📝
      </div>
    );
  }

  // Unit 8: Potenciación
  if (unitIndex === 8) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D97706] to-[#F59E0B] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(217,119,6,0.4)]">
        ⚡
      </div>
    );
  }

  // Unit 9: Sistema Métrico
  if (unitIndex === 9) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(5,150,105,0.4)]">
        📏
      </div>
    );
  }

  // Unit 10: Geometría
  if (unitIndex === 10) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#DB2777] to-[#EC4899] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(219,39,119,0.4)]">
        📐
      </div>
    );
  }

  // Unit 11: Estadística
  if (unitIndex === 11) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4338CA] to-[#6366F1] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(67,56,202,0.4)]">
        📊
      </div>
    );
  }

  // Unit 12: Magnitudes
  if (unitIndex === 12) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7B2FBE] to-[#9333EA] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(123,47,190,0.4)]">
        ⚖️
      </div>
    );
  }

  return (
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7B2FBE] to-[#A864E8] flex items-center justify-center text-3xl text-white shadow-[0_4px_14px_rgba(123,47,190,0.4)]">
      📘
    </div>
  );
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
      className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none overflow-y-auto"
      onClick={onClose}
    >
      {/* Tall & slender card matching Image 2 perfectly */}
      <div
        className="relative w-full max-w-[390px] md:max-w-[415px] bg-white rounded-[32px] md:rounded-[36px] pt-10 pb-9 px-7 md:px-8 text-center shadow-[0_24px_65px_rgba(0,0,0,0.45)] animate-popIn my-auto border border-white/60 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating 3D mathematical symbol with smooth continuous float animation */}
        <div className="floating-unit-icon flex items-center justify-center mb-6">
          <UnitOperationIcon3D unitIndex={unitIndex} />
        </div>

        {/* Title */}
        <h2 className="text-[21px] md:text-[23px] font-black text-[#7B2FBE] font-['Baloo_2',sans-serif] leading-snug mb-2.5 tracking-tight w-full">
          {tut.title}
        </h2>

        {/* Subtitle / Description */}
        <p className="text-[13px] font-bold text-[#555555] leading-relaxed max-w-[300px] mx-auto mb-6">
          {tut.text}
        </p>

        {/* 4 Numbered Steps / Highlights with comfortable spacing */}
        <div className="space-y-3.5 mb-7 text-left w-full">
          {tut.steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 py-3.5 px-4 md:px-5 bg-[#F6F3FF] rounded-[20px] border border-purple-100/60 shadow-2xs hover:border-purple-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#8338EC] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                {idx + 1}
              </div>
              <div className="text-[12px] md:text-[13px] font-bold text-[#333333] leading-snug flex-1">
                {step}
              </div>
            </div>
          ))}
        </div>

        {/* Primary Action Button with prominent spacing */}
        <div className="w-full pt-1 mb-4">
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-[20px] bg-gradient-to-r from-[#7B2FBE] via-[#8538E5] to-[#9D4EDD] hover:from-[#6D24B0] hover:to-[#8E3AD5] text-white font-black text-sm md:text-base shadow-lg shadow-purple-600/25 transition-all hover:scale-[1.015] active:scale-[0.985] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>¡Empezar Aventura!</span>
            <span>🚀</span>
          </button>
        </div>

        {/* Secondary Link: Omitir tutorial strictly centered with bottom breathing space */}
        <div className="w-full text-center pb-1">
          <button
            type="button"
            onClick={onClose}
            className="text-xs md:text-[13px] text-gray-400 hover:text-gray-600 font-semibold underline cursor-pointer transition-colors inline-block tracking-wide"
          >
            Omitir tutorial
          </button>
        </div>

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

          @keyframes floatIcon {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          .floating-unit-icon {
            animation: floatIcon 2.6s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
