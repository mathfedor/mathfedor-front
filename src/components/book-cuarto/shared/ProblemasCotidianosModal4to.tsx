'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook4 } from '../context/Book4Context';
import probData from '@/mocks/data/problemas-cotidianos-4.json';

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

interface ProblemasCotidianosModal4toProps {
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
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'bad') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(146.83, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.5, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch {}
}

/* ══════════════════════════════════════════════════════════════════
   COMPONENTES DE REPRESENTACIÓN FEDOR (Ábaco y Grillas de Bolitas)
   ══════════════════════════════════════════════════════════════════ */

function FedorAbaco({ value }: { value: number }) {
  let r = value;
  const rows: { label: string; count: number; color: string; items: React.ReactNode }[] = [];

  LUG.forEach(([placeVal, label, color]) => {
    if (placeVal > value) return;
    const d = Math.floor(r / placeVal);
    r = r % placeVal;

    let items: React.ReactNode = null;
    if (d > 0) {
      if (placeVal === 1) {
        items = (
          <div className="flex items-center gap-1 flex-wrap">
            {Array.from({ length: d }).map((_, i) => (
              <span
                key={i}
                className="inline-block w-4 h-4 rounded-full border border-amber-800"
                style={{
                  background: 'radial-gradient(circle at 35% 30%, #FDE68A, #EAB308)',
                }}
              />
            ))}
          </div>
        );
      } else {
        items = (
          <div className="flex items-center gap-1.5 flex-wrap">
            {Array.from({ length: d }).map((_, i) => (
              <span
                key={i}
                className="inline-flex items-center justify-center min-w-[44px] h-[26px] px-2 rounded-[7px] bg-white border-2 text-[11px] font-black"
                style={{ borderColor: color, color }}
              >
                {fmt(placeVal)}
              </span>
            ))}
          </div>
        );
      }
    } else {
      items = <span className="text-xs text-gray-400 font-bold">—</span>;
    }

    rows.push({ label, count: d, color, items });
  });

  return (
    <div className="flex flex-col gap-1.5 my-1">
      {rows.map((row, idx) => (
        <div key={idx} className="flex items-center gap-3 flex-wrap">
          <span
            className="min-w-[110px] sm:min-w-[125px] text-xs font-black"
            style={{ color: row.color }}
          >
            {row.label}: {row.count}
          </span>
          <div className="flex-1 min-w-0">{row.items}</div>
        </div>
      ))}
    </div>
  );
}

function FedorGrilla({ value }: { value: number }) {
  const cols = Math.min(10, value);
  return (
    <div
      className="inline-grid gap-1 my-1"
      style={{
        gridTemplateColumns: `repeat(${cols}, 13px)`,
      }}
    >
      {Array.from({ length: value }).map((_, i) => (
        <span
          key={i}
          className="w-[13px] h-[13px] rounded-full block shadow-2xs"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #FFD27A, #E8650A)',
          }}
        />
      ))}
    </div>
  );
}

function FedorItemCard({ value, etiqueta = '' }: { value: number; etiqueta?: string }) {
  const isAbaco = value > 100;
  return (
    <div className="bg-white border-[1.5px] border-dashed border-[#D9CCFF] rounded-xl p-2.5 sm:p-3">
      <div
        className="font-black text-[15px] sm:text-[15.5px] mb-1.5"
        style={{
          fontFamily: "'Baloo 2', 'Nunito', sans-serif",
          color: '#5C21A6',
        }}
      >
        {etiqueta}
        {isAbaco ? '🧮 Ábaco FEDOR: ' : '🔵 '}
        {fmt(value)}
      </div>

      {isAbaco ? <FedorAbaco value={value} /> : <FedorGrilla value={value} />}
    </div>
  );
}

function FedorRepresentation({
  datos,
  resultado,
}: {
  datos: number[];
  resultado: number | null;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const validDatos = datos.filter((x) => x >= 1).slice(0, 5);

  if (validDatos.length === 0 && resultado === null) return null;

  return (
    <div className="my-2.5 bg-white border-2 border-[#E4DCFA] rounded-2xl p-2.5 sm:p-3.5 text-left">
      {/* Header colapsable */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between font-black text-[13.5px] sm:text-[14px] cursor-pointer mb-1 text-[#3D1468] hover:text-purple-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🧮</span>
          <span>Representación FEDOR de las cantidades</span>
        </div>
        <span className="text-xs text-[#6B5E8A] transition-transform duration-200">
          {isOpen ? '▾' : '▸'}
        </span>
      </button>

      {/* Contenido */}
      {isOpen && (
        <div className="flex flex-col gap-2.5 mt-2 animate-fadeIn">
          {validDatos.map((num, i) => (
            <FedorItemCard key={i} value={num} />
          ))}

          {resultado !== null && resultado > 0 && (
            <FedorItemCard
              key="resultado"
              value={resultado}
              etiqueta="✅ Resultado · "
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════════════════════════════ */

export default function ProblemasCotidianosModal4to({
  isOpen = true,
  onClose,
  onOpenFullScreen,
}: ProblemasCotidianosModal4toProps) {
  const { updateStats } = useBook4();

  // Mode: 'menu' (Imagen 1) | 'level-menu' | 'ejemplos' (Imagen 2) | 'practica' | 'finished'
  const [view, setView] = useState<'menu' | 'level-menu' | 'ejemplos' | 'practica' | 'finished'>('menu');
  const [activeLevelIdx, setActiveLevelIdx] = useState<number>(0);

  // Ejemplos state
  const [ejemploIdx, setEjemploIdx] = useState<number>(0);

  // Practica state
  const [exIdx, setExIdx] = useState<number>(0);
  const [timer, setTimer] = useState<number>(60);
  const [answered, setAnswered] = useState<boolean>(false);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [showProc, setShowProc] = useState<boolean>(false);

  const answeredRef = useRef(false);
  useEffect(() => {
    answeredRef.current = answered;
  }, [answered]);

  const currentLevel = NIVELES[activeLevelIdx] || NIVELES[0];
  const curEjemplo = currentLevel?.ejemplos?.[ejemploIdx];
  const curEx = currentLevel?.ejercicios?.[exIdx];

  // Timer for exercises
  useEffect(() => {
    if (view !== 'practica' || !curEx) return;

    setTimer(curEx.t || 60);
    setAnswered(false);
    answeredRef.current = false;
    setSelectedOpt(null);
    setShowProc(false);

    const intv = setInterval(() => {
      if (answeredRef.current) return;
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intv);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exIdx, view, activeLevelIdx]);

  const handleTimeOut = () => {
    if (answeredRef.current || !curEx) return;
    setAnswered(true);
    answeredRef.current = true;
    playSound('bad');
  };

  const handleSelectOption = (opt: string) => {
    if (answered || !curEx) return;
    setAnswered(true);
    answeredRef.current = true;
    setSelectedOpt(opt);

    const isOk = opt === curEx.ans;
    if (isOk) {
      setCorrectCount((c) => c + 1);
      setScore((s) => s + (curEx.pts || 10));
      playSound('ok');
    } else {
      playSound('bad');
    }
  };

  const handleNextEx = () => {
    const total = currentLevel?.ejercicios?.length || 20;
    if (exIdx + 1 < total) {
      setExIdx((p) => p + 1);
    } else {
      setView('finished');
      playSound('win');
      if (score > 0) {
        updateStats(Math.round(score / 5), 1, score * 2);
      }
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'es-ES';
      window.speechSynthesis.speak(utter);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5"
      style={{
        backgroundColor: 'rgba(14, 8, 48, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="w-full max-w-[565px] bg-white rounded-[24px] relative flex flex-col overflow-hidden animate-fadeIn max-h-[92vh] overflow-y-auto"
        style={{
          fontFamily: "'Nunito', sans-serif",
          boxShadow: '0 25px 60px -12px rgba(20, 6, 45, 0.45)',
          padding: '24px 24px 26px 24px',
        }}
      >
        {/* ══════════════════════════════════════════════════════════════
            VISTA 1: LAUNCHER DE 5 NIVELES (IDÉNTICO A IMAGEN 1)
           ══════════════════════════════════════════════════════════════ */}
        {view === 'menu' && (
          <div>
            {/* Header: 🛒 Problemas Cotidianos — Tipo Prueba SABER (4°) + Botón Circular ✕ */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 pr-2">
                <span className="text-2xl sm:text-[26px] leading-none">🛒</span>
                <h2
                  className="text-lg sm:text-[21px] font-black leading-snug m-0"
                  style={{
                    fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                    color: '#2A0F60',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Problemas Cotidianos — Tipo Prueba SABER (4°)
                </h2>
              </div>

              {/* Botón Circular ✕ */}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: '#F7F4FF',
                  border: '1.5px solid #E4DFF5',
                  color: '#6C28B4',
                  fontSize: '17px',
                  fontWeight: 900,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#EDE6FD';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F7F4FF';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            {/* Texto explicativo fiel a la imagen */}
            <div className="text-[13px] sm:text-[13.5px] font-bold text-gray-900 mt-3.5 mb-4 leading-snug space-y-0.5">
              <p className="m-0">
                Situaciones reales de compras escolares, tienda, alimentos, almacén, reparticiones y manejo de dinero.
              </p>
              <p className="m-0">
                Cada nivel tiene <b>10 ejemplos</b> y <b>20 ejercicios</b>, de lo más simple a lo más complejo.
              </p>
            </div>

            {/* Lista de las 5 Tarjetas con sus Colores Originales */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {NIVELES.map((lvl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveLevelIdx(idx);
                    setView('level-menu');
                  }}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-[16px] sm:rounded-[18px] text-white transition-all duration-150 cursor-pointer shadow-sm hover:scale-[1.01] hover:shadow-md"
                  style={{
                    background: LEVEL_GRADIENTS[idx % LEVEL_GRADIENTS.length],
                    border: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Número grande a la izquierda */}
                  <span
                    className="text-2xl sm:text-[28px] font-black w-9 sm:w-11 text-left leading-none"
                    style={{ fontFamily: "'Baloo 2', sans-serif" }}
                  >
                    {idx + 1}
                  </span>

                  {/* Nombre y subtítulo */}
                  <div className="flex-1 text-left min-w-0 pr-3">
                    <div className="text-[15.5px] sm:text-[16.5px] font-black leading-tight drop-shadow-xs">
                      {lvl.nombre}
                    </div>
                    <div className="text-[12px] sm:text-[12.5px] font-bold opacity-95 mt-0.5">
                      10 ejemplos · 20 ejercicios
                    </div>
                  </div>

                  {/* Flecha blanca Play */}
                  <span className="text-lg sm:text-[20px] font-black leading-none drop-shadow-xs">
                    ▶
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 2: MENÚ DE ACCIÓN DEL NIVEL (Ejemplos vs Práctica)
           ══════════════════════════════════════════════════════════════ */}
        {view === 'level-menu' && currentLevel && (
          <div className="text-center py-1">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛒</span>
                <h3
                  className="text-lg sm:text-xl font-black m-0"
                  style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    color: LEVEL_COLORS[activeLevelIdx],
                  }}
                >
                  {currentLevel.nombre}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setView('menu')}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer bg-purple-50 text-purple-700 font-black text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-sm font-bold text-gray-700 mb-5">
              Primero mira los ejemplos resueltos con su explicación paso a paso y luego resuelve los 20 ejercicios interactivos.
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setEjemploIdx(0);
                  setView('ejemplos');
                }}
                className="w-full p-4 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer hover:brightness-105"
                style={{ background: LEVEL_GRADIENTS[activeLevelIdx] }}
              >
                <span className="text-2xl">📖</span>
                <span>Ver los 10 ejemplos resueltos</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExIdx(0);
                  setScore(0);
                  setCorrectCount(0);
                  setView('practica');
                }}
                className="w-full p-4 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer hover:brightness-105"
                style={{ background: 'linear-gradient(135deg, #3D1468, #7C3AED)' }}
              >
                <span className="text-2xl">🎯</span>
                <span>Resolver los 20 ejercicios</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 mt-5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setView('menu')}
                className="px-4 py-2 rounded-xl text-xs font-black text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
              >
                ◀ Volver a Niveles
              </button>
              {onOpenFullScreen && (
                <button
                  type="button"
                  onClick={onOpenFullScreen}
                  className="px-4 py-2 rounded-xl text-xs font-black text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  🖥️ Ver en Pantalla Completa
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 3: VISOR DE EJEMPLOS RESUELTOS (IDÉNTICO A LA IMAGEN)
           ══════════════════════════════════════════════════════════════ */}
        {view === 'ejemplos' && curEjemplo && (
          <div>
            {/* Header del Modal: 📖 Nivel X · Nombre + Botón Circular ✕ */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl leading-none">📖</span>
                <h2
                  className="text-xl sm:text-[22px] font-black leading-none m-0"
                  style={{
                    fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                    color: '#2A0F60',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {currentLevel.nombre}
                </h2>
              </div>

              {/* Botón Circular ✕ */}
              <button
                type="button"
                onClick={() => setView('level-menu')}
                className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all cursor-pointer"
                style={{
                  backgroundColor: '#F7F4FF',
                  border: '1.5px solid #E4DFF5',
                  color: '#6C28B4',
                  fontSize: '17px',
                  fontWeight: 900,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#EDE6FD';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F7F4FF';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="Cerrar ejemplos"
              >
                ✕
              </button>
            </div>

            {/* Sub-header row: 📖 Ejemplo X de 10 | Nivel X · Nombre */}
            <div className="flex items-center justify-between mt-1.5 mb-2 font-black text-xs sm:text-[13.5px]">
              <span
                className="flex items-center gap-1.5"
                style={{ color: LEVEL_COLORS[activeLevelIdx] }}
              >
                <span>📖</span>
                <span>Ejemplo {ejemploIdx + 1} de 10</span>
              </span>
              <span style={{ color: LEVEL_COLORS[activeLevelIdx] }}>
                {currentLevel.nombre}
              </span>
            </div>

            {/* Enunciado del Problema en Negrita */}
            <h3
              className="text-base sm:text-[17.5px] font-black text-slate-900 leading-snug my-2"
              style={{
                fontFamily: "'Baloo 2', 'Nunito', sans-serif",
              }}
            >
              {curEjemplo.q}
            </h3>

            {/* 🧮 Representación FEDOR de las cantidades (Ábaco y Grillas de bolitas) */}
            <FedorRepresentation
              datos={curEjemplo.datos || []}
              resultado={numDe(curEjemplo.ans)}
            />

            {/* 🧠 Tarjeta de Proceso con borde izquierdo morado fiel a la imagen */}
            <div
              className="rounded-2xl p-3.5 sm:p-4 my-2.5 text-left border-l-4"
              style={{
                background: '#FAF7FD',
                borderLeftColor: '#7C3AED',
              }}
            >
              <div className="flex items-center gap-1.5 mb-2 font-black text-sm text-[#2A0F60]">
                <span className="text-base">🧠</span>
                <span>Proceso</span>
              </div>
              <div className="flex flex-col gap-1 text-[13px] sm:text-[13.5px] font-extrabold text-[#1F2937] leading-relaxed">
                {curEjemplo.proc?.map((p, pi) => (
                  <div key={pi}>{p}</div>
                ))}
              </div>
            </div>

            {/* Navegación entre los 10 ejemplos */}
            <div className="flex items-center gap-2 pt-3 mt-1 border-t border-gray-100">
              <button
                type="button"
                disabled={ejemploIdx === 0}
                onClick={() => setEjemploIdx((p) => Math.max(0, p - 1))}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 cursor-pointer transition-colors"
              >
                ◀ Anterior
              </button>

              <button
                type="button"
                onClick={() => handleSpeak(`${curEjemplo.q}. ${curEjemplo.proc.join('. ')}`)}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-amber-100 text-amber-900 hover:bg-amber-200 cursor-pointer transition-colors"
                title="Escuchar explicación"
              >
                🔊 Escuchar
              </button>

              <button
                type="button"
                onClick={() => {
                  if (ejemploIdx < 9) {
                    setEjemploIdx((p) => p + 1);
                  } else {
                    setView('level-menu');
                  }
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-black text-white cursor-pointer hover:brightness-105 transition-all shadow-xs"
                style={{ background: LEVEL_GRADIENTS[activeLevelIdx] }}
              >
                {ejemploIdx < 9 ? 'Siguiente ▶' : '✔ Terminar'}
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 4: PRÁCTICA DE 20 EJERCICIOS
           ══════════════════════════════════════════════════════════════ */}
        {view === 'practica' && curEx && (
          <div>
            {/* Header del ejercicio */}
            <div className="flex items-center justify-between pb-2 mb-2 text-xs font-black">
              <span style={{ color: LEVEL_COLORS[activeLevelIdx] }}>
                Ejercicio {exIdx + 1} de 20
              </span>
              <span className="text-purple-800">⭐ {score} pts</span>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: timer <= 15 ? '#FEE2E2' : '#F3E8FF',
                  color: timer <= 15 ? '#DC2626' : '#6B21A8',
                }}
              >
                ⏱ {timer}s
              </span>
            </div>

            {/* Barra de Tiempo */}
            <div className="w-full h-1.5 bg-purple-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full transition-all duration-1000 ease-linear rounded-full"
                style={{
                  width: `${(timer / (curEx.t || 60)) * 100}%`,
                  background: LEVEL_GRADIENTS[activeLevelIdx],
                }}
              />
            </div>

            {/* Enunciado */}
            <div
              className="text-base sm:text-lg font-black text-slate-900 leading-snug mb-3 p-3.5 bg-purple-50/60 rounded-xl border"
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                borderColor: `${LEVEL_COLORS[activeLevelIdx]}30`,
              }}
            >
              {curEx.q}
            </div>

            {/* Representación de cantidades para el ejercicio */}
            <FedorRepresentation
              datos={curEx.datos || []}
              resultado={null}
            />

            {/* Opciones A, B, C, D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
              {curEx.opts.map((opt, oIdx) => {
                const isSelected = selectedOpt === opt;
                const isCorrect = opt === curEx.ans;

                let btnBg = 'bg-white border-2 border-purple-100 text-gray-800 hover:border-purple-300';
                if (answered) {
                  if (isCorrect) {
                    btnBg = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-900 font-black';
                  } else if (isSelected) {
                    btnBg = 'bg-rose-50 border-2 border-rose-400 text-rose-900 font-black';
                  } else {
                    btnBg = 'bg-gray-50 border border-gray-200 text-gray-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    disabled={answered}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-3 rounded-xl text-left text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${btnBg}`}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0"
                      style={{
                        backgroundColor: isCorrect && answered ? '#10B981' : `${LEVEL_COLORS[activeLevelIdx]}20`,
                        color: isCorrect && answered ? '#FFFFFF' : LEVEL_COLORS[activeLevelIdx],
                      }}
                    >
                      {['A', 'B', 'C', 'D'][oIdx]}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Proceso */}
            {answered && (
              <div className="space-y-2 mb-3 animate-fadeIn">
                <div
                  className="p-2.5 rounded-xl text-center text-xs font-black"
                  style={{
                    backgroundColor: selectedOpt === curEx.ans ? '#DCFCE7' : '#FEE2E2',
                    color: selectedOpt === curEx.ans ? '#14532D' : '#7F1D1D',
                  }}
                >
                  {selectedOpt === curEx.ans
                    ? `✅ ¡Correcto! +${curEx.pts} puntos`
                    : `❌ La respuesta correcta es ${curEx.ans}`}
                </div>

                {showProc && (
                  <div className="p-3 bg-purple-50 rounded-xl text-xs space-y-1 font-semibold text-purple-950">
                    <div className="font-black text-purple-800 text-[11px] uppercase">
                      🧠 Proceso:
                    </div>
                    {curEx.proc.map((p, pi) => (
                      <div key={pi}>• {p}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setView('level-menu')}
                className="px-3 py-2 rounded-xl text-xs font-black text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                Salir
              </button>

              {answered && !showProc && (
                <button
                  type="button"
                  onClick={() => setShowProc(true)}
                  className="px-3 py-2 rounded-xl text-xs font-black text-purple-700 bg-purple-50 hover:bg-purple-100 cursor-pointer"
                >
                  🧠 Ver Proceso
                </button>
              )}

              {answered && (
                <button
                  type="button"
                  onClick={handleNextEx}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-white cursor-pointer hover:brightness-105"
                  style={{ background: LEVEL_GRADIENTS[activeLevelIdx] }}
                >
                  {exIdx + 1 < (currentLevel?.ejercicios?.length || 20)
                    ? '➡ Siguiente'
                    : '🏁 Ver Resultados'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 5: RESULTADOS DEL NIVEL
           ══════════════════════════════════════════════════════════════ */}
        {view === 'finished' && (
          <div className="text-center py-3">
            <div className="text-5xl mb-2">
              {correctCount >= 18 ? '🏆' : correctCount >= 14 ? '🎉' : '💪'}
            </div>

            <h3
              className="text-2xl font-black mb-1"
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                color: '#2A0F60',
              }}
            >
              ¡Nivel Completado!
            </h3>

            <div className="text-3xl font-black text-purple-700 mb-1">
              {correctCount} de 20 correctas
            </div>

            <div className="text-xl my-2">
              {'⭐'.repeat(
                correctCount >= 19 ? 5 : correctCount >= 16 ? 4 : correctCount >= 12 ? 3 : correctCount >= 8 ? 2 : 1
              )}
            </div>

            <p className="text-sm font-bold text-gray-700 mb-5">
              Puntaje total obtenido: <b className="text-purple-900">{score} puntos</b>
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={() => {
                  setExIdx(0);
                  setScore(0);
                  setCorrectCount(0);
                  setView('practica');
                }}
                className="px-5 py-2.5 rounded-xl font-black text-white text-xs sm:text-sm cursor-pointer hover:brightness-105"
                style={{ backgroundColor: '#16876A' }}
              >
                🔁 Repetir Nivel
              </button>

              {activeLevelIdx < NIVELES.length - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveLevelIdx((p) => p + 1);
                    setView('level-menu');
                  }}
                  className="px-5 py-2.5 rounded-xl font-black text-white text-xs sm:text-sm cursor-pointer hover:brightness-105"
                  style={{ backgroundColor: '#E8650A' }}
                >
                  Nivel {activeLevelIdx + 2} ▶
                </button>
              )}

              <button
                type="button"
                onClick={() => setView('menu')}
                className="px-5 py-2.5 rounded-xl font-black text-white text-xs sm:text-sm cursor-pointer hover:brightness-105"
                style={{ backgroundColor: '#5C21A6' }}
              >
                🛒 Ver Niveles
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
