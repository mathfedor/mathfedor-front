'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook5 } from '../context/Book5Context';
import saberDataRaw from './saber5to-data.json';

interface SaberModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SaberExercise {
  id: string;
  tema: string;
  ctx: string;
  q: string;
  opts: string[];
  ans: string;
  formula?: string;
}

interface SaberLevelPool {
  level: number;
  count: number;
  pool: SaberExercise[];
}

const SABER_POOLS = saberDataRaw as SaberLevelPool[];

const LEVEL_CONFIGS = [
  { nivel: 1, time: 90, color: '#14B8A6', label: 'Nivel 1 · ⏱ 90s' },
  { nivel: 2, time: 90, color: '#3B82F6', label: 'Nivel 2 · ⏱ 90s' },
  { nivel: 3, time: 120, color: '#F97316', label: 'Nivel 3 · ⏱ 120s' },
  { nivel: 4, time: 150, color: '#7C3AED', label: 'Nivel 4 · ⏱ 150s' },
  { nivel: 5, time: 180, color: '#EC4899', label: 'Nivel 5 · ⏱ 180s' },
];

const PEN_COLORS = ['#5C21A6', '#E8650A', '#16876A', '#1E40AF', '#C94B22'];

// Helper para extraer datos numéricos del enunciado
function extractDatos(text: string): string[] {
  const matches =
    text.match(/\$?\s?\d{1,3}(?:\.\d{3})+(?:,\d+)?\s*%?|\$?\s?\d+(?:,\d+)?(?:\s*\/\s*\d+)?\s*%?|«[^»]+»/g) || [];
  return matches
    .map((m) => m.trim().replace(/[°º]/g, ''))
    .filter((m, i, arr) => m && arr.indexOf(m) === i)
    .slice(0, 8);
}

// Helper para barajar aleatoriamente preguntas
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SaberModal5to({ isOpen, onClose }: SaberModal5toProps) {
  const { updateStats } = useBook5();

  const [activeNivelIdx, setActiveNivelIdx] = useState<number | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<SaberExercise[]>([]);
  const [qIndex, setQIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [totalTime, setTotalTime] = useState<number>(90);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [bestScores, setBestScores] = useState<Record<number, number>>({});

  // Pizarra de apoyo
  const [pizarraOpen, setPizarraOpen] = useState<boolean>(true);
  const [selectedChips, setSelectedChips] = useState<Record<string, boolean>>({});
  const [penColor, setPenColor] = useState<string>('#5C21A6');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar mejores puntajes de 5°
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fedor5_saber_scores');
      if (saved) {
        setBestScores(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Control del cronómetro
  useEffect(() => {
    if (activeNivelIdx === null || isFinished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeNivelIdx, isFinished]);

  // Audio helpers
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

  // Iniciar nivel SABER
  const handleStartLevel = (lvlIdx: number) => {
    const config = LEVEL_CONFIGS[lvlIdx];
    const poolData = SABER_POOLS[lvlIdx]?.pool || [];

    if (!poolData.length) return;

    const chosen = shuffleArray(poolData).slice(0, 10);
    setSessionQuestions(chosen);
    setQIndex(0);
    setCorrectCount(0);
    setSelectedOpt(null);
    setTimeLeft(config.time);
    setTotalTime(config.time);
    setIsFinished(false);
    setActiveNivelIdx(lvlIdx);
    setSelectedChips({});
    playTono(540);
  };

  const currentQ = sessionQuestions[qIndex];

  // Canvas drawing logic
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [penColor, pizarraOpen]);

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

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
      clearCanvas();
      setSelectedChips({});

      if (qIndex + 1 < sessionQuestions.length) {
        setQIndex((i) => i + 1);
      } else {
        // Sesión finalizada
        setIsFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);

        const finalScore = isCorrect ? correctCount + 1 : correctCount;
        if (activeNivelIdx !== null) {
          const currentBest = bestScores[activeNivelIdx + 1] || 0;
          if (finalScore > currentBest) {
            const nextBest = { ...bestScores, [activeNivelIdx + 1]: finalScore };
            setBestScores(nextBest);
            try {
              localStorage.setItem('fedor5_saber_scores', JSON.stringify(nextBest));
            } catch {}
          }

          if (finalScore >= 7) {
            updateStats(100, 1, 60);
          }
        }
      }
    }, 1200);
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
            <span className="text-2xl">🏆</span>
            <h2
              className="text-2xl font-black text-[#5C21A6]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Pruebas SABER 5° · Entrenamiento Oficial
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

        {/* VISTA 1: Selector de Niveles */}
        {activeNivelIdx === null ? (
          <div className="overflow-y-auto pr-1 space-y-4 flex-1">
            <div
              className="rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1E0F4A 0%, #7C3AED 55%, #059669 100%)' }}
            >
              <h3
                className="text-xl sm:text-2xl font-black mb-1 flex items-center gap-2"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                <span>⏱️</span>
                <span>Simulador Cronometrado SABER 5°</span>
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-white/95">
                Resuelve 10 situaciones problema por nivel antes de que se agote el tiempo. ¡Aprueba con 7/10 para ganar 100 🪙!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEVEL_CONFIGS.map((lvl, idx) => {
                const best = bestScores[lvl.nivel];
                return (
                  <button
                    key={lvl.nivel}
                    type="button"
                    onClick={() => handleStartLevel(idx)}
                    className="p-4 rounded-2xl text-left text-white font-black shadow-md transition-transform hover:scale-102 active:scale-98 cursor-pointer flex flex-col justify-between min-h-[90px]"
                    style={{ background: lvl.color }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{lvl.label}</span>
                      <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">10 preguntas</span>
                    </div>
                    <div className="text-xs text-white/90 font-semibold pt-2">
                      {best !== undefined ? `Mejor récord: ${best}/10 ⭐` : 'Sin intentos previos'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : isFinished ? (
          /* VISTA 2: Resultados del Nivel */
          <div className="overflow-y-auto pr-1 text-center py-6 space-y-4 flex-1">
            <div className="text-6xl animate-bounce">
              {correctCount >= 7 ? '🎉' : '💪'}
            </div>
            <h3
              className="text-2xl font-black text-[#5C21A6]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {correctCount >= 7 ? '¡Prueba Superada!' : '¡Sigue Practicando!'}
            </h3>
            <p className="text-base font-bold text-gray-700">
              Obtuviste <b>{correctCount} de 10</b> respuestas correctas.
            </p>
            {correctCount >= 7 && (
              <div className="inline-block bg-amber-100 text-amber-900 border border-amber-300 px-5 py-2 rounded-2xl font-black text-sm">
                +100 Monedas 🪙 y +60 XP ⭐ acreditadas a tu perfil.
              </div>
            )}
            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => handleStartLevel(activeNivelIdx)}
                className="px-6 py-2.5 rounded-2xl bg-[#5C21A6] text-white font-black text-sm shadow-md hover:bg-[#7C3AED] transition-colors cursor-pointer"
              >
                Reintentar nivel
              </button>
              <button
                type="button"
                onClick={() => setActiveNivelIdx(null)}
                className="px-6 py-2.5 rounded-2xl bg-gray-100 text-gray-800 font-black text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Volver a la selección
              </button>
            </div>
          </div>
        ) : (
          /* VISTA 3: Pregunta en curso con Pizarra de Apoyo */
          <div className="overflow-y-auto pr-1 space-y-3 flex-1">
            {/* Barra superior de progreso y cronómetro */}
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-2xl border border-purple-200">
              <div className="font-black text-xs text-[#5C21A6]">
                Pregunta {qIndex + 1} de 10 · Aciertos: {correctCount}
              </div>
              <div
                className={`font-black text-sm px-3 py-1 rounded-xl ${
                  timeLeft <= 20 ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-[#5C21A6] border'
                }`}
              >
                ⏱ {timeLeft}s
              </div>
            </div>

            {/* Enunciado */}
            {currentQ && (
              <div className="space-y-3">
                <div className="p-4 bg-white border-2 border-purple-200 rounded-2xl shadow-xs">
                  <div className="text-[11px] font-black uppercase tracking-wider text-purple-600 mb-1">
                    {currentQ.tema}
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mb-1">{currentQ.ctx}</div>
                  <div className="text-base sm:text-lg font-black text-gray-900">{currentQ.q}</div>

                  {/* Chips de datos extraídos */}
                  {(() => {
                    const datos = extractDatos(`${currentQ.ctx} ${currentQ.q}`);
                    if (!datos.length) return null;
                    return (
                      <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-gray-100">
                        <span className="text-[11px] font-bold text-gray-500">Datos clave:</span>
                        {datos.map((d, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-black text-xs border border-amber-300"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Opciones de respuesta */}
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

                {/* Pizarra de apoyo desplegable */}
                <div className="border-2 border-purple-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div
                    onClick={() => setPizarraOpen((o) => !o)}
                    className="p-2.5 bg-purple-50 text-purple-900 font-black text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>✏️</span>
                      <span>Pizarra de Apoyo y Borrador de Cálculos</span>
                    </span>
                    <span>{pizarraOpen ? '▲ Ocultar' : '▼ Dibujar aquí'}</span>
                  </div>

                  {pizarraOpen && (
                    <div className="p-3 space-y-2 bg-gray-50">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {PEN_COLORS.map((col) => (
                            <button
                              key={col}
                              type="button"
                              onClick={() => setPenColor(col)}
                              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                penColor === col ? 'scale-125 border-gray-900' : 'border-white'
                              }`}
                              style={{ backgroundColor: col }}
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={clearCanvas}
                          className="px-2.5 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 font-black text-[11px] text-gray-800 cursor-pointer"
                        >
                          Limpiar trazos
                        </button>
                      </div>

                      <div className="border-2 border-dashed border-purple-300 rounded-xl bg-white overflow-hidden">
                        <canvas
                          ref={canvasRef}
                          width={600}
                          height={140}
                          onMouseDown={(e) => {
                            isDrawingRef.current = true;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const ctx = e.currentTarget.getContext('2d');
                            if (ctx) {
                              ctx.beginPath();
                              ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                            }
                          }}
                          onMouseMove={(e) => {
                            if (!isDrawingRef.current) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const ctx = e.currentTarget.getContext('2d');
                            if (ctx) {
                              ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                              ctx.stroke();
                            }
                          }}
                          onMouseUp={() => {
                            isDrawingRef.current = false;
                          }}
                          onMouseLeave={() => {
                            isDrawingRef.current = false;
                          }}
                          className="w-full h-[140px] touch-none cursor-crosshair"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
