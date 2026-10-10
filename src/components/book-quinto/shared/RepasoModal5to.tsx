'use client';

import React, { useState, useEffect } from 'react';
import { useBook5 } from '../context/Book5Context';

interface RepasoModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RepasoExercise {
  id: string;
  tema: string;
  ctx: string;
  q: string;
  opts: string[];
  ans: string;
  modelSubtitle: string;
  multiplier: number;
  decomposedParts: number[];
  partialProducts: number[];
  explanation: string;
}

const REPASO_QUESTIONS_5TO: RepasoExercise[] = [
  {
    id: 'rep-5-1',
    tema: 'Problemas Numéricos SABER · 5°',
    ctx: 'Leo organiza el inventario en el colegio. En el tema "Problemas Numéricos SABER" resuelve:',
    q: '¿Cuál es el triple de 1.194?',
    opts: ['3.582', '3.579', '3.572', '3.580'],
    ans: '3.582',
    modelSubtitle: '1.194 × 3 por partes',
    multiplier: 3,
    decomposedParts: [1000, 100, 90, 4],
    partialProducts: [3000, 300, 270, 12],
    explanation: 'Multiplicamos 1.194 × 3. Descomponemos 1.194 en 1.000 + 100 + 90 + 4. Multiplicamos cada parte: 1.000 × 3 = 3.000; 100 × 3 = 300; 90 × 3 = 270; 4 × 3 = 12. Sumamos: 3.000 + 300 + 270 + 12 = 3.582.',
  },
  {
    id: 'rep-5-2',
    tema: 'Geometría y Medición · 5°',
    ctx: 'En la huerta escolar se delimitó una parcela rectangular para sembrar hortalizas:',
    q: 'Un rectángulo mide 25 m de largo por 14 m de ancho. ¿Cuál es su área en m²?',
    opts: ['350 m²', '340 m²', '360 m²', '375 m²'],
    ans: '350 m²',
    modelSubtitle: '25 × 14 por partes',
    multiplier: 14,
    decomposedParts: [20, 5],
    partialProducts: [280, 70],
    explanation: 'El área es base × altura (25 × 14). Descomponemos 25 en 20 + 5. Multiplicamos: 20 × 14 = 280 y 5 × 14 = 70. Sumamos: 280 + 70 = 350 m².',
  },
  {
    id: 'rep-5-3',
    tema: 'Fracciones y Razones · 5°',
    ctx: 'En el laboratorio de ciencias se combinan soluciones con distinto volumen:',
    q: '¿Cuál es el resultado simplificado de 2/3 + 1/6?',
    opts: ['5/6', '3/9', '4/6', '1/2'],
    ans: '5/6',
    modelSubtitle: 'MCM(3, 6) = 6',
    multiplier: 6,
    decomposedParts: [4, 1],
    partialProducts: [4, 1],
    explanation: 'Como los denominadores son 3 y 6, el MCM es 6. Convertimos 2/3 a sextos: (2×2)/(3×2) = 4/6. Luego sumamos: 4/6 + 1/6 = 5/6.',
  },
];

export default function RepasoModal5to({ isOpen, onClose }: RepasoModal5toProps) {
  const { updateStats } = useBook5();

  const [questions] = useState<RepasoExercise[]>(REPASO_QUESTIONS_5TO);
  const [qIndex, setQIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [modelOpen, setModelOpen] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQ = questions[qIndex] || questions[0];
  const isAnswered = selectedOpt !== null;
  const isCorrect = isAnswered && selectedOpt === currentQ.ans;

  const playSound = (type: 'correct' | 'wrong') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'correct') {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch {}
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOpt(opt);

    if (opt === currentQ.ans) {
      setCorrectCount((prev) => prev + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const handleNext = () => {
    if (qIndex + 1 < questions.length) {
      setQIndex((prev) => prev + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      if (correctCount >= 2) {
        updateStats(60, 1, 40);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-purple-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            <h2
              className="text-2xl font-black text-[#5C21A6]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Mi Repaso Personalizado (5°)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-10 h-10 rounded-full bg-[#F3EEFF] hover:bg-[#E9DEFF] text-[#5C21A6] font-black text-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {!isFinished ? (
          <div className="overflow-y-auto pr-1 space-y-4 flex-1">
            {/* Barra de progreso */}
            <div className="flex items-center justify-between text-xs font-black text-gray-500 bg-purple-50 px-3.5 py-2 rounded-xl">
              <span>Ejercicio {qIndex + 1} de {questions.length}</span>
              <span>Aciertos: {correctCount}</span>
            </div>

            {/* Enunciado */}
            <div className="p-4 bg-white border-2 border-purple-200 rounded-2xl shadow-xs space-y-2">
              <div className="text-[11px] font-black uppercase text-purple-600 tracking-wider">
                {currentQ.tema}
              </div>
              <div className="text-xs text-gray-600 font-semibold">{currentQ.ctx}</div>
              <div className="text-base sm:text-lg font-black text-gray-900">{currentQ.q}</div>
            </div>

            {/* Modelo visual estructurado */}
            <div className="border-2 border-purple-200 rounded-2xl overflow-hidden bg-[#FAF8FF]">
              <div
                onClick={() => setModelOpen((o) => !o)}
                className="p-3 bg-purple-100/70 text-[#5C21A6] font-black text-xs flex items-center justify-between cursor-pointer"
              >
                <span>🧠 Modelo de partes: {currentQ.modelSubtitle}</span>
                <span>{modelOpen ? '▲ Ocultar' : '▼ Ver desglose'}</span>
              </div>

              {modelOpen && (
                <div className="p-4 space-y-2 text-center">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {currentQ.decomposedParts.map((part, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 bg-white border-2 border-purple-300 rounded-xl font-black text-xs text-purple-900 shadow-xs"
                      >
                        <div>{part} × {currentQ.multiplier}</div>
                        <div className="text-emerald-700 text-sm mt-0.5">= {currentQ.partialProducts[i]}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-gray-600 pt-1">
                    Suma total: {currentQ.partialProducts.join(' + ')} = <b>{currentQ.ans}</b>
                  </div>
                </div>
              )}
            </div>

            {/* Opciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentQ.opts.map((opt, i) => {
                const isSelected = selectedOpt === opt;
                let btnStyle = 'bg-white border-2 border-gray-200 text-gray-800 hover:border-purple-300';
                if (isAnswered) {
                  if (isSelected) {
                    btnStyle = opt === currentQ.ans ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600';
                  } else if (opt === currentQ.ans) {
                    btnStyle = 'bg-emerald-100 text-emerald-950 border-emerald-400';
                  }
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    className={`p-3.5 rounded-2xl font-black text-sm text-left transition-all cursor-pointer flex items-center gap-3 ${btnStyle}`}
                  >
                    <span className="w-7 h-7 rounded-xl bg-purple-100 text-[#5C21A6] font-black text-xs flex items-center justify-center flex-shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="truncate">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explicación y botón siguiente */}
            {isAnswered && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-emerald-950">
                    {isCorrect ? '✅ ¡Respuesta correcta!' : '❌ Respuesta incorrecta'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowExplanation((s) => !s)}
                    className="text-xs font-black text-emerald-700 underline cursor-pointer"
                  >
                    {showExplanation ? 'Ocultar paso a paso' : 'Ver explicación'}
                  </button>
                </div>
                {showExplanation && (
                  <p className="text-xs text-emerald-900 font-semibold leading-relaxed pt-1">
                    {currentQ.explanation}
                  </p>
                )}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-2.5 rounded-xl bg-[#5C21A6] text-white font-black text-xs shadow-md hover:bg-[#7C3AED] transition-colors cursor-pointer"
                  >
                    {qIndex + 1 < questions.length ? 'Siguiente ejercicio ➔' : 'Ver resultados del repaso'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Resumen de resultados */
          <div className="overflow-y-auto pr-1 text-center py-6 space-y-4 flex-1">
            <div className="text-6xl">🌟</div>
            <h3
              className="text-2xl font-black text-[#5C21A6]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              ¡Repaso Completado!
            </h3>
            <p className="text-sm font-bold text-gray-700">
              Resolviste correctamente <b>{correctCount} de {questions.length}</b> ejercicios de repaso.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl bg-[#5C21A6] text-white font-black text-xs shadow-md hover:bg-[#7C3AED] transition-colors cursor-pointer"
              >
                Cerrar y volver al libro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
