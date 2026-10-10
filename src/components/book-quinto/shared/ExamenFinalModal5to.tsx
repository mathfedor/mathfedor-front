'use client';

import React, { useState, useEffect } from 'react';
import { useBook5 } from '../context/Book5Context';
import examDataRaw from './examen5to-data.json';

interface ExamenFinalModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FinalExamQuestion {
  id: number;
  unit: string;
  cat: string;
  ctx: string;
  q: string;
  opts: string[];
  ans: string;
  hasModel?: boolean;
}

const EXAM_POOL_5TO = examDataRaw as FinalExamQuestion[];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ExamenFinalModal5to({ isOpen, onClose }: ExamenFinalModal5toProps) {
  const { updateStats } = useBook5();

  const [inExam, setInExam] = useState<boolean>(false);
  const [examQuestions, setExamQuestions] = useState<FinalExamQuestion[]>([]);
  const [qIndex, setQIndex] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Estadísticas acumuladas en localStorage
  const [stats, setStats] = useState<{ aprobados: number; mejor: number; intentos: number }>({
    aprobados: 0,
    mejor: 0,
    intentos: 0,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fedor5_final_stats');
      if (saved) {
        setStats(JSON.parse(saved));
      }
    } catch {}
  }, [isOpen]);

  const playTono = (freq = 520) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {}
  };

  const hablar = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-CO';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    } catch {}
  };

  const handleStartExam = () => {
    const pool = shuffleArray(EXAM_POOL_5TO).slice(0, 25);
    setExamQuestions(pool);
    setQIndex(0);
    setSelectedOpt(null);
    setCorrectCount(0);
    setIsFinished(false);
    setInExam(true);
    playTono(540);
  };

  const currentQ = examQuestions[qIndex];

  const handleSelectOption = (opt: string) => {
    if (selectedOpt !== null || !currentQ) return;
    setSelectedOpt(opt);

    const isCorrect = String(opt).trim().toLowerCase() === String(currentQ.ans).trim().toLowerCase();
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      playTono(650);
      hablar('¡Correcto!');
    } else {
      playTono(280);
      hablar('Incorrecto.');
    }

    setTimeout(() => {
      setSelectedOpt(null);
      if (qIndex + 1 < examQuestions.length) {
        setQIndex((i) => i + 1);
      } else {
        // Fin del examen
        setIsFinished(true);
        const finalScore = isCorrect ? correctCount + 1 : correctCount;
        const passed = finalScore >= 18;

        const nextStats = {
          aprobados: passed ? stats.aprobados + 1 : stats.aprobados,
          mejor: Math.max(stats.mejor, finalScore),
          intentos: stats.intentos + 1,
        };
        setStats(nextStats);

        try {
          localStorage.setItem('fedor5_final_stats', JSON.stringify(nextStats));
        } catch {}

        if (passed) {
          updateStats(500, 3, 250);
        }
      }
    }, 1100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-purple-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h2
              className="text-2xl font-black text-[#2A0F60]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Examen Final Integrador · Grado 5°
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

        {/* VISTA 1: Menú Inicial y Estadísticas */}
        {!inExam ? (
          <div className="overflow-y-auto pr-1 space-y-4 flex-1">
            <div
              className="rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #A30041 0%, #FF1D4E 60%, #E8650A 100%)' }}
            >
              <h3
                className="text-xl sm:text-2xl font-black mb-1 flex items-center gap-2"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                <span>🏆</span>
                <span>Gran Evaluación de Fin de Ciclo (5°)</span>
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-white/95">
                25 preguntas aleatorias extraídas de las 15 unidades del libro interactivo. Demuestra todo lo que aprendiste este año.
              </p>
            </div>

            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-[#F8F5FF] border border-purple-200 rounded-2xl text-center">
                <div className="text-xs font-black text-gray-500 mb-1">Aprobados</div>
                <div className="text-2xl sm:text-3xl font-black text-[#5C21A6]">
                  {stats.aprobados}
                </div>
              </div>
              <div className="p-4 bg-[#F8F5FF] border border-purple-200 rounded-2xl text-center">
                <div className="text-xs font-black text-gray-500 mb-1">Mejor Récord</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {stats.mejor}/25
                </div>
              </div>
              <div className="p-4 bg-[#F8F5FF] border border-purple-200 rounded-2xl text-center">
                <div className="text-xs font-black text-gray-500 mb-1">Intentos</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">
                  {stats.intentos}
                </div>
              </div>
            </div>

            {/* Aviso de Recompensa */}
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center gap-3">
              <span className="text-3xl">🏅</span>
              <div className="text-xs sm:text-sm font-black text-amber-950">
                ¡Aprueba con 18/25 o más para graduarte de 5° grado y ganar <b>+500 🪙 Monedas</b> y <b>+250 XP ⭐</b>!
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartExam}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#A30041] to-[#FF1D4E] hover:from-[#8B0037] hover:to-[#E01742] text-white font-black text-base shadow-lg transition-transform hover:scale-101 active:scale-99 cursor-pointer"
            >
              🎓 Iniciar Examen Final (25 Preguntas)
            </button>
          </div>
        ) : isFinished ? (
          /* VISTA 2: Fin del Examen */
          <div className="overflow-y-auto pr-1 text-center py-6 space-y-4 flex-1">
            <div className="text-6xl animate-bounce">
              {correctCount >= 18 ? '🎓' : '📚'}
            </div>
            <h3
              className="text-2xl font-black text-[#2A0F60]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {correctCount >= 18 ? '¡Felicitaciones! Has Aprobado el Examen Final' : 'Examen Completado'}
            </h3>
            <p className="text-lg font-black text-gray-800">
              Puntaje: <span className="text-[#5C21A6] text-2xl">{correctCount}</span> de 25
            </p>
            {correctCount >= 18 ? (
              <div className="inline-block bg-emerald-100 text-emerald-950 border border-emerald-300 px-6 py-2.5 rounded-2xl font-black text-sm">
                ¡Has superado el 5° Grado con honores! +500 🪙 Monedas y +250 XP ⭐ agregadas.
              </div>
            ) : (
              <div className="inline-block bg-amber-100 text-amber-950 border border-amber-300 px-6 py-2.5 rounded-2xl font-black text-sm">
                Necesitas 18/25 para aprobar. ¡Repasa las unidades e inténtalo de nuevo!
              </div>
            )}
            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleStartExam}
                className="px-6 py-2.5 rounded-2xl bg-[#A30041] text-white font-black text-sm shadow-md hover:bg-[#8B0037] transition-colors cursor-pointer"
              >
                Intentar de nuevo
              </button>
              <button
                type="button"
                onClick={() => setInExam(false)}
                className="px-6 py-2.5 rounded-2xl bg-gray-100 text-gray-800 font-black text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Volver al resumen
              </button>
            </div>
          </div>
        ) : (
          /* VISTA 3: Pregunta Activa del Examen */
          <div className="overflow-y-auto pr-1 space-y-3 flex-1">
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-2xl border border-purple-200">
              <div className="font-black text-xs text-[#5C21A6]">
                Pregunta {qIndex + 1} de 25 · {currentQ?.unit}
              </div>
              <div className="font-black text-xs bg-white text-[#5C21A6] px-3 py-1 rounded-xl border">
                Aciertos: {correctCount} / {qIndex}
              </div>
            </div>

            {currentQ && (
              <div className="space-y-3">
                <div className="p-4 bg-white border-2 border-purple-200 rounded-2xl shadow-xs">
                  <div className="text-[11px] font-black uppercase tracking-wider text-rose-600 mb-1">
                    {currentQ.cat}
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mb-1">{currentQ.ctx}</div>
                  <div className="text-base sm:text-lg font-black text-gray-900">{currentQ.q}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentQ.opts.map((opt, i) => {
                    const isSelected = selectedOpt === opt;
                    const isCorrect = String(opt).trim().toLowerCase() === String(currentQ.ans).trim().toLowerCase();

                    let btnClass = 'bg-white border-2 border-gray-200 text-gray-800 hover:border-purple-400';
                    if (selectedOpt !== null) {
                      if (isSelected) {
                        btnClass = isCorrect ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600';
                      } else if (isCorrect) {
                        btnClass = 'bg-emerald-100 text-emerald-950 border-emerald-400';
                      }
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        disabled={selectedOpt !== null}
                        className={`p-3.5 rounded-2xl font-black text-left text-sm transition-all shadow-xs flex items-center gap-3 cursor-pointer ${btnClass}`}
                      >
                        <span className="w-7 h-7 rounded-xl bg-purple-100 text-[#5C21A6] font-black text-xs flex items-center justify-center flex-shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="truncate">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
