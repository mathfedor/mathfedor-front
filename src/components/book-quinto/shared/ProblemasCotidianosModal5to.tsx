'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook5 } from '../context/Book5Context';
import probData from '@/mocks/data/problemas-cotidianos-5.json';

interface ProblemaItem {
  q: string;
  ans: string;
  opts: string[];
  proc: string[];
  datos: number[];
  pts: number;
  t: number;
}

interface ProblemaLevel {
  nombre: string;
  ejemplos: ProblemaItem[];
  ejercicios: ProblemaItem[];
}

interface ProblemasCotidianosModal5toProps {
  isOpen?: boolean;
  onClose: () => void;
  onOpenFullScreen?: () => void;
}

const NIVELES: ProblemaLevel[] = (probData as any).PC_NIVELES || [];

const LEVEL_GRADIENTS = [
  'linear-gradient(135deg, #16876A, #24C496)', // Nivel 1: Adición
  'linear-gradient(135deg, #C94B22, #F97316)', // Nivel 2: Sustracción
  'linear-gradient(135deg, #E8650A, #F5A524)', // Nivel 3: Multiplicación
  'linear-gradient(135deg, #1E40AF, #3B82F6)', // Nivel 4: División
  'linear-gradient(135deg, #5C21A6, #8B3EDB)', // Nivel 5: Operaciones combinadas
];

const LEVEL_COLORS = ['#16876A', '#C94B22', '#E8650A', '#1E40AF', '#5C21A6'];

const LUG: [number, string, string][] = [
  [1000000, 'Unidades de millón', '#7C3AED'],
  [100000, 'Centenas de mil', '#BE185D'],
  [10000, 'Decenas de mil', '#0F766E'],
  [1000, 'Unidades de mil', '#1E40AF'],
  [100, 'Centenas', '#F97316'],
  [10, 'Decenas', '#10B981'],
  [1, 'Unidades', '#EAB308'],
];

function fmt(n: number): string {
  return Number(n).toLocaleString('es-CO');
}

function numDe(s: string): number {
  return parseInt(String(s).replace(/[^\d]/g, ''), 10) || 0;
}

function playSound(type: 'ok' | 'bad' | 'win') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'ok') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'bad') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(146.83, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.5, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch {
    // Audio no disponible
  }
}

// ── Representaciones del Método Fedor (Ábaco, Grilla, Tarjetas) ──
function FedorAbaco({ val }: { val: number }) {
  const digits = String(val).padStart(6, '0').slice(-6).split('').map(Number);
  const labels = ['CM', 'DM', 'UM', 'C', 'D', 'U'];
  const colors = ['#BE185D', '#0F766E', '#1E40AF', '#F97316', '#10B981', '#EAB308'];

  return (
    <div className="bg-[#180A38] rounded-xl p-3 border border-[#3D1468] shadow-inner text-center">
      <div className="text-[10px] font-black text-[#F5C518] uppercase tracking-wider mb-2">
        🧮 Ábaco de Cuentas Fedor (5° Grado)
      </div>
      <div className="flex justify-center items-end gap-2.5 sm:gap-4 py-2 border-b-4 border-[#F5C518]">
        {digits.map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="h-20 w-1 bg-white/20 relative flex flex-col justify-end items-center pb-1">
              {Array.from({ length: d }).map((_, bi) => (
                <div
                  key={bi}
                  className="w-4 h-2.5 rounded-full my-0.5 shadow-sm transition-transform"
                  style={{
                    backgroundColor: colors[i],
                    boxShadow: `0 0 6px ${colors[i]}`,
                  }}
                />
              ))}
            </div>
            <div className="mt-1 text-xs font-black text-white">{d}</div>
            <div className="text-[9px] font-bold text-gray-400">{labels[i]}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs font-black text-amber-300">
        Valor representado: ${fmt(val)}
      </div>
    </div>
  );
}

function FedorGrilla({ val }: { val: number }) {
  const centenas = Math.min(10, Math.floor(val / 100));
  const decenas = Math.floor((val % 100) / 10);
  const unidades = val % 10;

  return (
    <div className="bg-white rounded-xl p-3 border border-purple-200 shadow-xs">
      <div className="text-[11px] font-black text-[#5C21A6] mb-2 flex items-center justify-between">
        <span>🔲 Descomposición en Bloques Base 10</span>
        <span className="text-gray-500 font-bold">${fmt(val)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 justify-center py-2 bg-purple-50/60 rounded-lg">
        {centenas > 0 && (
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap gap-1 w-16 justify-center">
              {Array.from({ length: centenas }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-amber-400 border border-amber-600 rounded-xs shadow-2xs"
                  title="Centena (100)"
                />
              ))}
            </div>
            <span className="text-[10px] font-black text-amber-800 mt-1">
              {centenas} C ({centenas * 100})
            </span>
          </div>
        )}

        {decenas > 0 && (
          <div className="flex flex-col items-center">
            <div className="flex gap-1">
              {Array.from({ length: decenas }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-7 bg-emerald-500 border border-emerald-700 rounded-xs"
                  title="Decena (10)"
                />
              ))}
            </div>
            <span className="text-[10px] font-black text-emerald-800 mt-1">
              {decenas} D ({decenas * 10})
            </span>
          </div>
        )}

        {unidades > 0 && (
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap gap-1 w-10 justify-center">
              {Array.from({ length: unidades }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  title="Unidad (1)"
                />
              ))}
            </div>
            <span className="text-[10px] font-black text-blue-800 mt-1">
              {unidades} U
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function FedorTarjetasPosicionales({ val }: { val: number }) {
  const parts: { label: string; v: number; color: string }[] = [];
  LUG.forEach(([pot, name, color]) => {
    const c = Math.floor(val / pot);
    if (c > 0) {
      parts.push({ label: `${c} ${name}`, v: c * pot, color });
      val %= pot;
    }
  });

  return (
    <div className="flex flex-wrap gap-1.5 items-center justify-center my-2">
      {parts.map((p, i) => (
        <span
          key={i}
          className="px-2.5 py-1 rounded-lg text-white font-black text-xs shadow-xs"
          style={{ background: p.color }}
        >
          {fmt(p.v)}
        </span>
      ))}
    </div>
  );
}

function FedorRepresentation({ val }: { val: number }) {
  if (val >= 1000) {
    return (
      <div className="space-y-2 my-3">
        <FedorAbaco val={val} />
        <FedorTarjetasPosicionales val={val} />
      </div>
    );
  }
  return (
    <div className="space-y-2 my-3">
      <FedorGrilla val={val} />
      <FedorTarjetasPosicionales val={val} />
    </div>
  );
}

export default function ProblemasCotidianosModal5to({
  isOpen = true,
  onClose,
  onOpenFullScreen,
}: ProblemasCotidianosModal5toProps) {
  const { updateStats } = useBook5();

  const [activeLevel, setActiveLevel] = useState<number>(0);
  const [subView, setSubView] = useState<'ejemplos' | 'ejercicios'>('ejemplos');

  // Estado Ejemplos
  const [curEjemploIdx, setCurEjemploIdx] = useState<number>(0);
  const [showRepresentation, setShowRepresentation] = useState<boolean>(true);

  // Estado Ejercicios
  const [curEjercicioIdx, setCurEjercicioIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(90);

  const levelData = NIVELES[activeLevel] || NIVELES[0];
  const ejemplos = levelData?.ejemplos || [];
  const ejercicios = levelData?.ejercicios || [];

  const curEjemplo = ejemplos[curEjemploIdx] || ejemplos[0];
  const curEjercicio = ejercicios[curEjercicioIdx] || ejercicios[0];

  // Timer para ejercicios
  useEffect(() => {
    if (subView !== 'ejercicios' || showFeedback) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [subView, showFeedback, curEjercicioIdx]);

  const handleSelectLevel = (idx: number) => {
    setActiveLevel(idx);
    setCurEjemploIdx(0);
    setCurEjercicioIdx(0);
    setSelectedOpt(null);
    setShowFeedback(false);
  };

  const handleCheckAnswer = (opt: string) => {
    if (showFeedback) return;
    setSelectedOpt(opt);
    setShowFeedback(true);

    const isOk = opt === curEjercicio.ans;
    if (isOk) {
      playSound('ok');
      setScore((s) => s + (curEjercicio.pts || 10));
      updateStats(10, 0, 15);
    } else {
      playSound('bad');
    }
  };

  const handleNextEjercicio = () => {
    if (curEjercicioIdx < ejercicios.length - 1) {
      setCurEjercicioIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setShowFeedback(false);
      setTimer(curEjercicio.t || 90);
    } else {
      playSound('win');
      alert(`¡Completaste los 20 ejercicios del ${levelData.nombre}! Puntos logrados: ${score}`);
      setSubView('ejemplos');
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-ES';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99995] flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      style={{
        background: 'rgba(18, 8, 42, 0.75)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-[26px] p-5 sm:p-7 text-[#180D38] relative shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn"
        style={{
          boxShadow: '0 25px 60px -15px rgba(25, 8, 55, 0.45)',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* ══ HEADER ══ */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xl shadow-md shrink-0"
              style={{ background: LEVEL_GRADIENTS[activeLevel] }}
            >
              🛒
            </div>
            <div>
              <h2
                className="text-lg sm:text-2xl font-black text-[#2A0F60] leading-none"
                style={{ fontFamily: "'Baloo 2', cursive, sans-serif" }}
              >
                Problemas Cotidianos — Tipo Prueba SABER (5°)
              </h2>
              <p className="text-xs text-gray-500 font-bold mt-1">
                Situaciones reales de compras, recetas, almacén y manejo de dinero con proceso paso a paso
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenFullScreen && (
              <button
                type="button"
                onClick={onOpenFullScreen}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-black border border-purple-200 transition-colors cursor-pointer"
                title="Abrir en pantalla completa"
              >
                <span>🖥️</span>
                <span>Pantalla completa</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full border-[1.5px] border-[#E4DFF5] bg-[#F7F4FF] hover:bg-[#E9DCFC] text-[#6C28B4] flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
              title="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ══ SELECTOR DE NIVELES (5 Niveles) ══ */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-3 shrink-0">
          {NIVELES.map((niv, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectLevel(idx)}
              className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer text-center truncate ${
                activeLevel === idx
                  ? 'text-white shadow-md scale-102 ring-2 ring-purple-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              style={{
                background: activeLevel === idx ? LEVEL_GRADIENTS[idx] : undefined,
              }}
            >
              {niv.nombre}
            </button>
          ))}
        </div>

        {/* ══ SELECTOR DE SUBVISTA: EJEMPLOS VS EJERCICIOS ══ */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3 shrink-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSubView('ejemplos')}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                subView === 'ejemplos'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              💡 10 Ejemplos Resueltos
            </button>
            <button
              type="button"
              onClick={() => setSubView('ejercicios')}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                subView === 'ejercicios'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              🎯 20 Ejercicios Prácticos
            </button>
          </div>

          <div className="text-xs font-bold text-gray-500">
            {subView === 'ejemplos' ? (
              <span>Ejemplo {curEjemploIdx + 1} de {ejemplos.length}</span>
            ) : (
              <span>Ejercicio {curEjercicioIdx + 1} de {ejercicios.length} · ⏱ {timer}s</span>
            )}
          </div>
        </div>

        {/* ══ CONTENIDO CON SCROLL ══ */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* VISTA 1: EJEMPLOS RESUELTOS */}
          {subView === 'ejemplos' && curEjemplo && (
            <div className="space-y-3 animate-fadeIn">
              {/* Enunciado */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-amber-50 rounded-2xl border-2 border-purple-200 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-[11px] font-black text-purple-700 uppercase tracking-wide">
                    Ejemplo {curEjemploIdx + 1} · {levelData.nombre}
                  </div>
                  <p className="text-sm sm:text-base font-bold text-[#1A1033] leading-relaxed">
                    {curEjemplo.q}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => speakText(curEjemplo.q)}
                  className="w-9 h-9 rounded-xl bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
                  title="Escuchar problema"
                >
                  🔊
                </button>
              </div>

              {/* Botón para alternar representaciones visuales */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowRepresentation(!showRepresentation)}
                  className="text-xs font-black text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{showRepresentation ? '🙈 Ocultar' : '👁️ Mostrar'}</span>
                  <span>Representación Visual Fedor</span>
                </button>
              </div>

              {/* Representaciones pedagógicas del Método Fedor */}
              {showRepresentation && curEjemplo.datos && curEjemplo.datos.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="text-xs font-black text-gray-700">
                    🔬 Representación Visual del Problema:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {curEjemplo.datos.slice(0, 2).map((dat, di) => (
                      <div key={di}>
                        <div className="text-[11px] font-bold text-gray-500 mb-1">
                          Dato {di + 1}: ${fmt(dat)}
                        </div>
                        <FedorRepresentation val={dat} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Proceso Paso a Paso */}
              <div className="p-4 bg-white rounded-2xl border-2 border-purple-300 shadow-sm space-y-2.5">
                <div className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📝</span>
                  <span>Proceso de Solución Paso a Paso:</span>
                </div>
                <div className="space-y-1.5">
                  {(curEjemplo.proc || []).map((step: string, si: number) => (
                    <div
                      key={si}
                      className="p-2.5 rounded-xl bg-purple-50/70 border-l-4 border-purple-600 text-xs sm:text-sm font-bold text-[#2A0F60] leading-relaxed"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Respuesta Destacada */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border-2 border-emerald-400 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-black text-emerald-800 uppercase tracking-wide">
                    Respuesta Correcta:
                  </div>
                  <div className="text-lg font-black text-emerald-950">
                    {curEjemplo.ans}
                  </div>
                </div>
                <div className="text-2xl">✅</div>
              </div>

              {/* Navegación entre los 10 ejemplos */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={curEjemploIdx === 0}
                  onClick={() => setCurEjemploIdx((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black disabled:opacity-40 cursor-pointer"
                >
                  ← Anterior
                </button>
                <span className="text-xs font-bold text-gray-500">
                  {curEjemploIdx + 1} de {ejemplos.length}
                </span>
                <button
                  type="button"
                  disabled={curEjemploIdx === ejemplos.length - 1}
                  onClick={() => setCurEjemploIdx((prev) => Math.min(ejemplos.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* VISTA 2: 20 EJERCICIOS PRÁCTICOS */}
          {subView === 'ejercicios' && curEjercicio && (
            <div className="space-y-4 animate-fadeIn">
              {/* Enunciado del Ejercicio */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-300">
                <div className="flex items-center justify-between text-xs font-black text-emerald-800 mb-2">
                  <span>EJERCICIO {curEjercicioIdx + 1} DE {ejercicios.length}</span>
                  <span>+{curEjercicio.pts || 10} XP / PUNTOS</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-[#1A1033] leading-relaxed">
                  {curEjercicio.q}
                </p>
              </div>

              {/* Opciones Múltiples */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(curEjercicio.opts || []).map((opt: string, oi: number) => {
                  const isSelected = selectedOpt === opt;
                  const isCorrect = opt === curEjercicio.ans;

                  let btnStyle = 'bg-white hover:bg-purple-50 text-gray-800 border-2 border-gray-200';
                  if (showFeedback) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black scale-102';
                    } else if (isSelected) {
                      btnStyle = 'bg-red-100 border-red-500 text-red-950 font-black';
                    } else {
                      btnStyle = 'bg-gray-100 border-gray-200 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={showFeedback}
                      onClick={() => handleCheckAnswer(opt)}
                      className={`p-3.5 rounded-xl text-left text-sm font-black transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showFeedback && isCorrect && <span>✅</span>}
                      {showFeedback && isSelected && !isCorrect && <span>❌</span>}
                    </button>
                  );
                })}
              </div>

              {/* Feedback y Explicación */}
              {showFeedback && (
                <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-300 animate-fadeIn space-y-2">
                  <div className="text-xs font-black text-purple-900 uppercase">
                    Explicación del Proceso:
                  </div>
                  <div className="space-y-1">
                    {(curEjercicio.proc || []).map((p: string, pi: number) => (
                      <p key={pi} className="text-xs sm:text-sm font-bold text-[#2A0F60]">
                        {p}
                      </p>
                    ))}
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextEjercicio}
                      className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs cursor-pointer shadow-md"
                    >
                      Continuar al siguiente →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ══ FOOTER ══ */}
        <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500 shrink-0">
          <div>
            <span>Nivel: <strong>{levelData.nombre}</strong></span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-black cursor-pointer transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
