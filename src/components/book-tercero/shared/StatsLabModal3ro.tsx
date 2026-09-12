'use client';

import React, { useState, useMemo } from 'react';
import { fedorSpeak } from './Grade3Speech';

interface StatRow {
  id: string;
  label: string;
  value: number;
  color: string;
}

const PRESET_COLORS = [
  '#0284c7', // Blue (Rojo)
  '#d97706', // Gold / Amber (Azul)
  '#059669', // Green (Verde)
  '#c2410c', // Red-orange (Amarillo)
  '#7c3aed', // Purple
  '#db2777', // Pink
  '#0891b2', // Cyan
  '#4f46e5', // Indigo
];

const INITIAL_ROWS: StatRow[] = [
  { id: '1', label: 'Rojo', value: 5, color: '#0284c7' },
  { id: '2', label: 'Azul', value: 8, color: '#d97706' },
  { id: '3', label: 'Verde', value: 3, color: '#059669' },
  { id: '4', label: 'Amarillo', value: 6, color: '#c2410c' },
];

const RANDOM_DATASETS: Array<{ theme: string; rows: Array<{ label: string; value: number }> }> = [
  {
    theme: 'Colores Favoritos',
    rows: [
      { label: 'Rojo', value: 5 },
      { label: 'Azul', value: 8 },
      { label: 'Verde', value: 3 },
      { label: 'Amarillo', value: 6 },
    ],
  },
  {
    theme: 'Mascotas Preferidas',
    rows: [
      { label: 'Perro', value: 9 },
      { label: 'Gato', value: 7 },
      { label: 'Hamster', value: 3 },
      { label: 'Pez', value: 5 },
    ],
  },
  {
    theme: 'Frutas Favoritas',
    rows: [
      { label: 'Manzana', value: 7 },
      { label: 'Banano', value: 10 },
      { label: 'Fresa', value: 8 },
      { label: 'Uva', value: 4 },
    ],
  },
  {
    theme: 'Deportes del Salón',
    rows: [
      { label: 'Fútbol', value: 11 },
      { label: 'Básquet', value: 6 },
      { label: 'Natación', value: 4 },
      { label: 'Patinaje', value: 7 },
    ],
  },
  {
    theme: 'Instrumentos Musicales',
    rows: [
      { label: 'Guitarra', value: 8 },
      { label: 'Piano', value: 5 },
      { label: 'Batería', value: 9 },
      { label: 'Flauta', value: 4 },
    ],
  },
];

function playSound(type: 'click' | 'coin' | 'correct' | 'fanfare') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'coin') {
      osc.frequency.setValueAtTime(987.77, ctx.currentTime);
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'correct') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.09);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch {}
}

function triggerConfetti() {
  if (typeof window === 'undefined') return;
  const anyWin = window as unknown as { confetti?: () => void; kjConfetti?: (n: number) => void };
  if (typeof anyWin.confetti === 'function') {
    try { anyWin.confetti(); } catch {}
  } else if (typeof anyWin.kjConfetti === 'function') {
    try { anyWin.kjConfetti(40); } catch {}
  }
}

interface StatsLabModal3roProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatsLabModal3ro({ isOpen, onClose }: StatsLabModal3roProps) {
  const [rows, setRows] = useState<StatRow[]>(INITIAL_ROWS);
  const [selectedRowId, setSelectedRowId] = useState<string>('1');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | '3d'>('bar');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // Total de datos
  const total = useMemo(() => rows.reduce((acc, r) => acc + (Number(r.value) || 0), 0), [rows]);

  // Cálculos estadísticos automáticos
  const statsCalculations = useMemo(() => {
    let runningAccum = 0;
    return rows.map((r) => {
      const val = Number(r.value) || 0;
      runningAccum += val;
      const rel = total > 0 ? val / total : 0;
      const pct = rel * 100;
      return {
        ...r,
        accum: runningAccum,
        rel: rel.toFixed(2),
        pct: pct.toFixed(1) + '%',
      };
    });
  }, [rows, total]);

  // Moda y extremos
  const { modeLabel, modeVal, maxVal, minVal } = useMemo(() => {
    if (rows.length === 0) return { modeLabel: '—', modeVal: 0, maxVal: 0, minVal: 0 };
    let maxV = -Infinity;
    let minV = Infinity;
    let maxLbl = rows[0]?.label || '—';

    rows.forEach((r) => {
      const v = Number(r.value) || 0;
      if (v > maxV) {
        maxV = v;
        maxLbl = r.label;
      }
      if (v < minV) {
        minV = v;
      }
    });

    return {
      modeLabel: maxLbl,
      modeVal: maxV > -Infinity ? maxV : 0,
      maxVal: maxV > -Infinity ? maxV : 0,
      minVal: minV < Infinity ? minV : 0,
    };
  }, [rows]);

  if (!isOpen) return null;

  // Acciones de la barra de herramientas
  const handleAddData = () => {
    playSound('coin');
    setRows((prev) => {
      const targetId = selectedRowId || prev[0]?.id;
      return prev.map((r) => (r.id === targetId ? { ...r, value: r.value + 1 } : r));
    });
  };

  const handleSubData = () => {
    playSound('click');
    setRows((prev) => {
      const targetId = selectedRowId || prev[0]?.id;
      return prev.map((r) => (r.id === targetId ? { ...r, value: Math.max(0, r.value - 1) } : r));
    });
  };

  const handleAddRow = () => {
    playSound('coin');
    const newId = String(Date.now());
    const nextIdx = rows.length % PRESET_COLORS.length;
    const newColor = PRESET_COLORS[nextIdx];
    const defaultLabels = ['Naranja', 'Morado', 'Rosa', 'Blanco', 'Turquesa', 'Marrón'];
    const newLabel = defaultLabels[rows.length % defaultLabels.length] || `Dato ${rows.length + 1}`;
    setRows((prev) => [...prev, { id: newId, label: newLabel, value: 4, color: newColor }]);
    setSelectedRowId(newId);
  };

  const handleRandomize = () => {
    playSound('click');
    const set = RANDOM_DATASETS[Math.floor(Math.random() * RANDOM_DATASETS.length)];
    const newRows = set.rows.map((r, i) => ({
      id: String(i + 1),
      label: r.label,
      value: r.value,
      color: PRESET_COLORS[i % PRESET_COLORS.length],
    }));
    setRows(newRows);
    setSelectedRowId(newRows[0]?.id || '1');
    fedorSpeak(`¡Datos aleatorios cargados sobre ${set.theme}!`);
  };

  const handleClear = () => {
    playSound('click');
    setRows((prev) => prev.map((r) => ({ ...r, value: 0 })));
  };

  const handleUpdateLabel = (id: string, newLbl: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, label: newLbl } : r)));
  };

  const handleUpdateValue = (id: string, newVal: number) => {
    const safeVal = Math.max(0, isNaN(newVal) ? 0 : newVal);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, value: safeVal } : r)));
  };

  // Preguntas automáticas generadas a partir de los datos actuales
  const quizQuestions = [
    {
      q: '¿Cuál es la MODA (la categoría con mayor frecuencia)?',
      opts: rows.map((r) => r.label),
      ans: modeLabel,
    },
    {
      q: '¿Cuál es el TOTAL de datos registrados en la encuesta?',
      opts: [String(total), String(total + 3), String(Math.max(1, total - 4)), String(total + 5)].sort(() => Math.random() - 0.5),
      ans: String(total),
    },
    {
      q: `¿Cuántos datos corresponden a la categoría "${rows[0]?.label}"?`,
      opts: [String(rows[0]?.value || 0), String((rows[0]?.value || 0) + 2), String(Math.max(0, (rows[0]?.value || 0) - 1))].sort(() => Math.random() - 0.5),
      ans: String(rows[0]?.value || 0),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[99990] flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn select-none font-['Nunito',sans-serif]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Shell */}
      <div className="relative w-full max-w-[1040px] max-h-[92vh] bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col border border-purple-200/40">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 bg-white">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🔬</span>
            <h3 className="text-xl md:text-2xl font-black text-[#1e1035] tracking-tight">
              Laboratorio de Estadística — 3°
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="text-gray-400 hover:text-gray-700 font-black text-2xl transition-colors cursor-pointer bg-transparent border-none p-1"
            title="Cerrar laboratorio"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 px-7 pb-7 pt-1 insignias-custom-scroll">
          {/* Top Control Panel with Light Background (Exacto a Imagen) */}
          <div className="bg-[#f0f4f9] rounded-2xl p-4 md:p-4.5 mb-6 border border-slate-200/60 shadow-xs">
            {/* Row 1: Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleAddData}
                className="px-4 py-2 rounded-xl text-xs md:text-[13px] font-extrabold text-white bg-[#0284c7] hover:bg-[#0369a1] transition-all cursor-pointer shadow-xs flex items-center gap-1.5 border-none"
              >
                <span>➕</span> Agregar dato
              </button>
              <button
                type="button"
                onClick={handleSubData}
                className="px-4 py-2 rounded-xl text-xs md:text-[13px] font-extrabold text-white bg-[#ea580c] hover:bg-[#c2410c] transition-all cursor-pointer shadow-xs flex items-center gap-1.5 border-none"
              >
                <span>➖</span> Eliminar dato
              </button>
              <button
                type="button"
                onClick={handleAddRow}
                className="px-4 py-2 rounded-xl text-xs md:text-[13px] font-extrabold text-white bg-[#059669] hover:bg-[#047857] transition-all cursor-pointer shadow-xs flex items-center gap-1.5 border-none"
              >
                <span>🗂️</span> Agregar fila
              </button>
              <button
                type="button"
                onClick={handleRandomize}
                className="px-4 py-2 rounded-xl text-xs md:text-[13px] font-extrabold text-white bg-[#b45309] hover:bg-[#92400e] transition-all cursor-pointer shadow-xs flex items-center gap-1.5 border-none"
              >
                <span>🎲</span> Aleatorio
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 rounded-xl text-xs md:text-[13px] font-extrabold text-white bg-[#64748b] hover:bg-[#475569] transition-all cursor-pointer shadow-xs flex items-center gap-1.5 border-none"
              >
                <span>🗑️</span> Limpiar
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setShowQuiz(true);
                  setQuizIndex(0);
                  setQuizSelected(null);
                  setQuizScore(0);
                  fedorSpeak('¡Demuestra lo que sabes respondiendo estas preguntas sobre la tabla!');
                }}
                className="px-4 py-2 rounded-xl text-xs md:text-[13px] font-extrabold text-white bg-[#7c3aed] hover:bg-[#6d28d9] transition-all cursor-pointer shadow-xs flex items-center gap-1.5 border-none"
              >
                <span>❓</span> Generar preguntas
              </button>
            </div>

            {/* Row 2: Right-aligned Chart Type Switcher */}
            <div className="flex items-center justify-end gap-2 mt-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setChartType('bar');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all border-none flex items-center gap-1.5 ${
                  chartType === 'bar'
                    ? 'bg-[#38126e] text-white shadow-xs'
                    : 'bg-[#ede9fe] text-[#1e1035] hover:bg-[#ddd6fe]'
                }`}
              >
                <span>📊</span> Barras
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setChartType('line');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all border-none flex items-center gap-1.5 ${
                  chartType === 'line'
                    ? 'bg-[#38126e] text-white shadow-xs'
                    : 'bg-[#ede9fe] text-[#1e1035] hover:bg-[#ddd6fe]'
                }`}
              >
                <span>📈</span> Línea
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setChartType('pie');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all border-none flex items-center gap-1.5 ${
                  chartType === 'pie'
                    ? 'bg-[#38126e] text-white shadow-xs'
                    : 'bg-[#ede9fe] text-[#1e1035] hover:bg-[#ddd6fe]'
                }`}
              >
                <span>🟠</span> Pastel
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setChartType('3d');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all border-none flex items-center gap-1.5 ${
                  chartType === '3d'
                    ? 'bg-[#38126e] text-white shadow-xs'
                    : 'bg-[#ede9fe] text-[#1e1035] hover:bg-[#ddd6fe]'
                }`}
              >
                <span>🧱</span> 3D
              </button>
            </div>
          </div>

          {/* Main Content Grid: Table on Left (7 cols), Chart on Right (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Frequency Table */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                {/* Table Header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.8fr 1.6fr 1.8fr 1.8fr 2fr',
                    background: '#38126e',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '12.5px',
                    padding: '12px 16px',
                    alignItems: 'center',
                  }}
                >
                  <div>Categoría / Dato</div>
                  <div style={{ textAlign: 'center' }}>Frecuencia</div>
                  <div style={{ textAlign: 'center' }}>Frec. Acumulada</div>
                  <div style={{ textAlign: 'center' }}>Frec. Relativa</div>
                  <div style={{ textAlign: 'center' }}>Frec. Porcentual</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-slate-100">
                  {statsCalculations.map((r, rIdx) => {
                    const isSelected = selectedRowId === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRowId(r.id)}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2.8fr 1.6fr 1.8fr 1.8fr 2fr',
                          padding: '9px 16px',
                          alignItems: 'center',
                          backgroundColor: isSelected
                            ? '#faf5ff'
                            : rIdx % 2 === 1
                            ? '#fcfaff'
                            : '#ffffff',
                          transition: 'background-color 0.15s ease',
                          cursor: 'pointer',
                        }}
                      >
                        {/* Categoría Input */}
                        <div style={{ paddingRight: '10px' }}>
                          <input
                            type="text"
                            value={r.label}
                            onChange={(e) => handleUpdateLabel(r.id, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '7px 12px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              fontSize: '14px',
                              fontWeight: 700,
                              color: '#1e1035',
                              outline: 'none',
                              backgroundColor: '#ffffff',
                            }}
                          />
                        </div>

                        {/* Frecuencia Input */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <input
                            type="number"
                            min="0"
                            value={r.value}
                            onChange={(e) => handleUpdateValue(r.id, parseInt(e.target.value, 10) || 0)}
                            style={{
                              width: '64px',
                              padding: '7px 0',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              fontSize: '15px',
                              fontWeight: 800,
                              color: '#1e1035',
                              textAlign: 'center',
                              outline: 'none',
                              backgroundColor: '#ffffff',
                            }}
                          />
                        </div>

                        {/* Frecuencia Acumulada */}
                        <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '14px', color: '#1e1035' }}>
                          {r.accum}
                        </div>

                        {/* Frecuencia Relativa */}
                        <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '13.5px', color: '#7c3aed' }}>
                          {r.rel}
                        </div>

                        {/* Frecuencia Porcentual */}
                        <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '13.5px', color: '#059669' }}>
                          {r.pct}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Table Footer: TOTAL */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.8fr 1.6fr 1.8fr 1.8fr 2fr',
                    padding: '12px 16px',
                    alignItems: 'center',
                    background: '#ede9fe',
                    color: '#1e1035',
                    borderTop: '1px solid #ddd6fe',
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: '13.5px', letterSpacing: '0.02em' }}>TOTAL</div>
                  <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '15px' }}>{total}</div>
                  <div style={{ textAlign: 'center', fontWeight: 800, color: '#64748b' }}>—</div>
                  <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '14px' }}>
                    {total > 0 ? '1.00' : '0.00'}
                  </div>
                  <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '14px' }}>
                    {total > 0 ? '100%' : '0%'}
                  </div>
                </div>
              </div>

              {/* KPI Summary Bar (Exacto a Imagen) */}
              <div
                style={{
                  marginTop: '14px',
                  background: '#f0fdfa',
                  border: '1px solid #ccfbf1',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <span><strong>Total:</strong> {total}</span>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <span>
                  <strong>Moda:</strong> <span style={{ color: '#6d28d9' }}>{modeLabel}</span> (fr={modeVal})
                </span>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <span><strong>Mayor fr:</strong> {maxVal}</span>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <span><strong>Menor fr:</strong> {minVal}</span>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <span><strong>Categorías:</strong> {rows.length}</span>
              </div>
            </div>

            {/* Right Column: Chart View Container */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px 20px 18px 20px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                minHeight: '315px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              className="lg:col-span-5"
            >
              {chartType === 'bar' && (
                <div className="w-full flex flex-col h-full justify-between">
                  {/* Y Axis Grid + Bars */}
                  <div className="relative flex-1 flex items-end justify-around pt-6 pb-2 border-b border-slate-200 min-h-[220px]">
                    {/* Horizontal Guides */}
                    <div className="absolute inset-x-0 top-6 border-b border-slate-100 flex items-center text-[10px] text-gray-400 pl-1">
                      {Math.max(8, maxVal)}
                    </div>
                    <div className="absolute inset-x-0 top-1/2 border-b border-slate-100 flex items-center text-[10px] text-gray-400 pl-1">
                      {Math.round(Math.max(8, maxVal) / 2)}
                    </div>
                    <div className="absolute inset-x-0 bottom-2 border-b border-slate-100 flex items-center text-[10px] text-gray-400 pl-1">
                      0
                    </div>

                    {/* Bars */}
                    {rows.map((r, i) => {
                      const peak = Math.max(8, maxVal);
                      const heightPct = peak > 0 ? (r.value / peak) * 100 : 0;
                      return (
                        <div key={r.id} className="flex flex-col items-center z-10 w-14 group">
                          {/* Value above bar */}
                          <span className="text-xs font-black text-[#1e1035] mb-1.5">
                            {r.value}
                          </span>
                          {/* Colored bar */}
                          <div
                            style={{
                              height: `${Math.max(4, heightPct * 1.6)}px`,
                              backgroundColor: r.color || PRESET_COLORS[i % PRESET_COLORS.length],
                            }}
                            className="w-10 rounded-t-sm transition-all duration-300 shadow-sm group-hover:opacity-90"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* X Axis Labels */}
                  <div className="flex items-center justify-around pt-2.5">
                    {rows.map((r) => (
                      <div
                        key={r.id}
                        className="text-[11.5px] font-bold text-gray-600 text-center truncate w-14"
                        title={r.label}
                      >
                        {r.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {chartType === 'line' && (
                <div className="w-full flex flex-col h-full justify-between pt-2">
                  <div className="relative flex-1 min-h-[220px] border-b border-slate-200">
                    <svg viewBox="0 0 300 170" className="w-full h-full">
                      {/* Grid lines */}
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="85" x2="300" y2="85" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="150" x2="300" y2="150" stroke="#e2e8f0" strokeWidth="1" />

                      {/* Polyline */}
                      {(() => {
                        const peak = Math.max(8, maxVal);
                        const step = 300 / (rows.length + 1);
                        const points = rows.map((r, i) => {
                          const x = step * (i + 1);
                          const y = 150 - (r.value / (peak || 1)) * 125;
                          return { x, y, r };
                        });
                        const pointsStr = points.map((p) => `${p.x},${p.y}`).join(' ');

                        return (
                          <>
                            <polyline
                              fill="none"
                              stroke="#6d28d9"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={pointsStr}
                            />
                            {points.map((p, i) => (
                              <g key={i}>
                                <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke={p.r.color} strokeWidth="3" />
                                <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e1035">
                                  {p.r.value}
                                </text>
                              </g>
                            ))}
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                  {/* Labels */}
                  <div className="flex items-center justify-around pt-2.5">
                    {rows.map((r) => (
                      <div key={r.id} className="text-[11.5px] font-bold text-gray-600 text-center truncate w-14">
                        {r.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {chartType === 'pie' && (
                <div className="w-full flex flex-col items-center justify-center gap-4 py-2">
                  <div className="w-44 h-44 relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {(() => {
                        let accumulatedPercent = 0;
                        if (total === 0) {
                          return <circle cx="50" cy="50" r="40" fill="#f1f5f9" />;
                        }
                        return rows.map((r, i) => {
                          const percent = r.value / total;
                          if (percent === 0) return null;
                          const strokeDasharray = `${percent * 251.2} 251.2`;
                          const strokeDashoffset = -accumulatedPercent * 251.2;
                          accumulatedPercent += percent;
                          return (
                            <circle
                              key={r.id}
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke={r.color || PRESET_COLORS[i % PRESET_COLORS.length]}
                              strokeWidth="20"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              className="transition-all duration-300 hover:opacity-90"
                            />
                          );
                        });
                      })()}
                    </svg>
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-xs">
                    {rows.map((r) => (
                      <span
                        key={r.id}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100"
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                        <span>{r.label}:</span>
                        <span>{r.value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {chartType === '3d' && (
                <div className="w-full flex flex-col h-full justify-between pt-2">
                  <div className="relative flex-1 flex items-end justify-around pt-6 pb-2 border-b border-slate-200 min-h-[220px]">
                    {rows.map((r, i) => {
                      const peak = Math.max(8, maxVal);
                      const h = peak > 0 ? Math.max(8, (r.value / peak) * 130) : 8;
                      const col = r.color || PRESET_COLORS[i % PRESET_COLORS.length];
                      return (
                        <div key={r.id} className="flex flex-col items-center z-10 w-14">
                          <span className="text-xs font-black text-[#1e1035] mb-1.5">{r.value}</span>
                          <div
                            style={{
                              height: `${h}px`,
                              background: `linear-gradient(90deg, ${col} 0%, ${col}dd 60%, ${col}99 100%)`,
                              boxShadow: '3px 3px 0px rgba(0,0,0,0.15)',
                            }}
                            className="w-10 rounded-t-sm transition-all duration-300"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-around pt-2.5">
                    {rows.map((r) => (
                      <div key={r.id} className="text-[11.5px] font-bold text-gray-600 text-center truncate w-14">
                        {r.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Modal Overlay */}
        {showQuiz && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-purple-200 animate-fadeIn font-['Nunito',sans-serif]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-purple-700 uppercase tracking-wider">
                  Pregunta {quizIndex + 1} de {quizQuestions.length}
                </span>
                <span className="text-xs font-bold text-gray-500">
                  Aciertos: {quizScore}
                </span>
              </div>

              <h4 className="text-base font-black text-[#1e1035] mb-4">
                {quizQuestions[quizIndex]?.q}
              </h4>

              <div className="space-y-2 mb-4">
                {quizQuestions[quizIndex]?.opts.map((opt, idx) => {
                  const isSelected = quizSelected === idx;
                  const isCorrect = opt === quizQuestions[quizIndex]?.ans;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setQuizSelected(idx);
                        if (isCorrect) {
                          playSound('correct');
                          triggerConfetti();
                          setQuizScore((s) => s + 1);
                        } else {
                          playSound('click');
                        }
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                            : 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-purple-50'
                      }`}
                    >
                      {opt} {isSelected && (isCorrect ? '✓ ¡Correcto!' : '✗ Inténtalo de nuevo')}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2">
                {quizIndex < quizQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizIndex((i) => i + 1);
                      setQuizSelected(null);
                    }}
                    className="px-4 py-2 bg-[#38126e] text-white rounded-xl text-xs font-black hover:bg-purple-900 cursor-pointer border-none"
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuiz(false);
                      fedorSpeak(`¡Bien hecho! Terminaste con ${quizScore} aciertos de ${quizQuestions.length}.`);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 cursor-pointer border-none"
                  >
                    Finalizar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
