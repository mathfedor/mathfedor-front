'use client';

import React from 'react';
import tutsRaw from '@/mocks/data/book-unit-tuts-4.data.json';

interface UnitTutorialItem {
  icon: string;
  title: string;
  text: string;
  steps: string[];
}

interface UnitWelcomeModal4toProps {
  isOpen: boolean;
  unitIndex: number;
  onClose: () => void;
}

const UNIT_TUTS_4TO: UnitTutorialItem[] = (tutsRaw as any).UNIT_TUTS || [];

export default function UnitWelcomeModal4to({
  isOpen,
  unitIndex,
  onClose,
}: UnitWelcomeModal4toProps) {
  if (!isOpen) return null;

  const tut = UNIT_TUTS_4TO[unitIndex] || {
    icon: '📘',
    title: `¡Unidad ${unitIndex + 1} de Matemáticas 4°!`,
    text: 'Aprende y practica los conceptos matemáticos fundamentales con ejemplos y ejercicios dinámicos.',
    steps: [
      'Observa el Proceso paso a paso en los ejemplos didácticos',
      'Resuelve cada reto antes de que se agote el temporizador',
      'Acumula puntos XP y estrellas para desbloquear medallas',
    ],
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-purple-500 relative overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Top Glow Decor */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-purple-200/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header with Unit Icon */}
          <div className="flex items-center gap-4 mb-4 pb-3 border-b border-purple-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center text-3xl shadow-md shrink-0">
              {tut.icon}
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-purple-700">
                Misión de Aprendizaje · 4°
              </div>
              <h2
                className="text-lg sm:text-xl font-black text-[#1A1033] leading-tight"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                {tut.title}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-4 leading-relaxed bg-[#F8F5FF] border-l-4 border-purple-600 rounded-r-xl p-3">
            {tut.text}
          </p>

          <div className="text-[11px] font-black uppercase text-purple-900 tracking-wider mb-2">
            Temas y Pasos de la Unidad:
          </div>

          <div className="space-y-2 mb-6 max-h-56 overflow-y-auto pr-1">
            {tut.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2 rounded-xl bg-purple-50/60 border border-purple-100"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-700 to-purple-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="text-xs font-bold text-gray-800 leading-snug">
                  {step}
                </div>
              </div>
            ))}
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            🚀 ¡Entendido, a practicar los niveles!
          </button>
        </div>
      </div>
    </div>
  );
}
