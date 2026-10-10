'use client';

import React, { useState, useMemo } from 'react';
import { useBook4 } from '../context/Book4Context';
import bookCurriculum4 from '@/mocks/data/book-curriculum-4.data.json';

interface InformeModal4toProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullScreen?: () => void;
}

const RANKS_4TO = [
  { min: 0, label: '🌱 Explorador', color: '#16876A' },
  { min: 200, label: '🚀 Aprendiz', color: '#BA7517' },
  { min: 500, label: '⭐ Aventurero', color: '#E8650A' },
  { min: 1000, label: '🪐 Experto', color: '#1A6CB4' },
  { min: 2000, label: '👑 Maestro', color: '#7B2FBE' },
  { min: 4000, label: '🌌 Leyenda', color: '#C94B22' },
];

function getRank4to(xp: number) {
  return [...RANKS_4TO].reverse().find((r) => xp >= r.min) || RANKS_4TO[0];
}

export default function InformeModal4to({
  isOpen,
  onClose,
  onOpenFullScreen,
}: InformeModal4toProps) {
  const { student, coins, streak, totalXP, scores } = useBook4();

  const [activeTab, setActiveTab] = useState<'unidades' | 'competencias' | 'recomendaciones'>('unidades');

  const units = (bookCurriculum4 as any).UNITS || [];

  const { unitStats, totalLevels, totalDone, globalPct } = useMemo(() => {
    let tt = 0;
    let td = 0;
    const list = units.map((u: any, ui: number) => {
      let uTotal = 0;
      let uDone = 0;
      let uScoreSum = 0;

      (u.topics || []).forEach((t: any, ti: number) => {
        (t.levels || []).forEach((_: any, li: number) => {
          tt++;
          uTotal++;
          const k = `${t.id || `u${ui}t${ti}`}-n${li + 1}`;
          const sc = scores[k] || 0;
          if (sc >= 50) {
            td++;
            uDone++;
          }
          uScoreSum += sc;
        });
      });

      const uPct = uTotal > 0 ? Math.round(uScoreSum / uTotal) : 0;
      return {
        name: u.name,
        icon: u.icon || '📘',
        total: uTotal,
        done: uDone,
        pct: uPct,
      };
    });

    const gPct = tt > 0 ? Math.round((td / tt) * 100) : 0;
    return { unitStats: list, totalLevels: tt, totalDone: td, globalPct: gPct };
  }, [units, scores]);

  const currentRank = getRank4to(totalXP);

  // Competencias MEN breakdown
  const competencias = useMemo(() => {
    const calcAvg = (indices: number[]) => {
      const selected = unitStats.filter((_: any, idx: number) => indices.includes(idx));
      if (!selected.length) return 0;
      const sum = selected.reduce((acc: number, item: any) => acc + item.pct, 0);
      return Math.round(sum / selected.length);
    };

    return [
      {
        nombre: 'Pensamiento Numérico y Sistemas Numéricos',
        icon: '🔢',
        desc: 'Operaciones básicas, valor posicional hasta millones, múltiplos, divisores y fracciones.',
        pct: calcAvg([0, 1, 2, 3, 14]),
        color: '#5C21A6',
      },
      {
        nombre: 'Pensamiento Espacial y Sistemas Geométricos',
        icon: '📐',
        desc: 'Polígonos, cuerpos tridimensionales, rotaciones, traslaciones y plano cartesiano.',
        pct: calcAvg([5, 6, 11]),
        color: '#0D9488',
      },
      {
        nombre: 'Pensamiento Métrico y Sistemas de Medidas',
        icon: '📏',
        desc: 'Longitud, masa, capacidad, tiempo, cálculo de perímetros y áreas.',
        pct: calcAvg([4, 7, 12]),
        color: '#E8650A',
      },
      {
        nombre: 'Pensamiento Aleatorio y Sistemas de Datos',
        icon: '📊',
        desc: 'Tablas de frecuencia, gráficas de barras, media, moda y probabilidad básica.',
        pct: calcAvg([8, 9]),
        color: '#1E3A8A',
      },
      {
        nombre: 'Pensamiento Variacional y Sistemas Algebraicos',
        icon: '⚡',
        desc: 'Patrones numéricos, ecuaciones simples en balanza y proporcionalidad directa.',
        pct: calcAvg([10, 13]),
        color: '#C94B22',
      },
    ];
  }, [unitStats]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99995] flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      style={{ background: 'rgba(18, 8, 42, 0.75)', backdropFilter: 'blur(4px)' }}
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
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#16876A] to-[#24C496] flex items-center justify-center text-white text-xl shadow-md shrink-0">
              📊
            </div>
            <div>
              <h2
                className="text-xl sm:text-2xl font-black text-[#2A0F60] leading-none"
                style={{ fontFamily: "'Baloo 2', cursive, sans-serif" }}
              >
                Informe Diagnóstico y de Progreso (4°)
              </h2>
              <p className="text-xs text-gray-500 font-bold mt-1">
                Monitoreo del desempeño escolar, logros alcanzados y competencias MEN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.print();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-black border border-purple-200 transition-colors cursor-pointer"
              title="Imprimir informe oficial"
            >
              <span>🖨️</span>
              <span>Imprimir</span>
            </button>

            {onOpenFullScreen && (
              <button
                type="button"
                onClick={onOpenFullScreen}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-black border border-indigo-200 transition-colors cursor-pointer"
                title="Ver informe en pantalla completa"
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

        {/* ══ CONTENIDO CON SCROLL ══ */}
        <div className="flex-1 overflow-y-auto pr-1 mt-4 space-y-4">
          {/* Tarjeta del Estudiante */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 p-4 sm:p-5 rounded-2xl border-2 border-purple-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-700 to-amber-400 p-1 shadow-lg shrink-0">
              <div className="w-full h-full bg-[#1A0848] rounded-full flex items-center justify-center text-3xl">
                {student?.avatar || '🧑‍🚀'}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-black text-purple-700 uppercase tracking-wider">
                Estudiante · 4° Grado de Primaria
              </div>
              <h3
                className="text-xl sm:text-2xl font-black text-[#1A1033] leading-tight truncate"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                {student?.name || 'Estudiante Fedor'}
              </h3>
              <div className="text-xs text-gray-600 font-bold mt-1 flex flex-wrap gap-x-3 gap-y-1 justify-center sm:justify-start">
                <span>🏫 {student?.school || 'Colegio'}</span>
                <span>📍 {student?.city || 'Colombia'}</span>
                <span>👩‍🏫 Docente: {student?.teacher || 'Asignado'}</span>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div
                className="text-xs font-black px-3 py-1 rounded-full text-white inline-block shadow-sm"
                style={{ background: currentRank.color }}
              >
                {currentRank.label}
              </div>
              <div className="text-xs font-bold text-gray-500 mt-1">
                {totalXP} XP acumulados
              </div>
            </div>
          </div>

          {/* 4 KPIs de Rendimiento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
              <div className="text-2xl font-black text-purple-900">{globalPct}%</div>
              <div className="text-[11px] font-bold text-purple-700 uppercase mt-0.5">Progreso Global</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="text-2xl font-black text-amber-900">{totalDone}/{totalLevels}</div>
              <div className="text-[11px] font-bold text-amber-700 uppercase mt-0.5">Niveles Aprobados</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="text-2xl font-black text-emerald-900">{coins} 🪙</div>
              <div className="text-[11px] font-bold text-emerald-700 uppercase mt-0.5">Monedas Cósmicas</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200">
              <div className="text-2xl font-black text-orange-900">{streak} 🔥</div>
              <div className="text-[11px] font-bold text-orange-700 uppercase mt-0.5">Racha de Días</div>
            </div>
          </div>

          {/* Selector de Pestañas */}
          <div className="flex border-b border-gray-200 gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('unidades')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-black transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'unidades'
                  ? 'border-purple-600 text-purple-800'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>🪐</span>
              <span>15 Unidades ({unitStats.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('competencias')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-black transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'competencias'
                  ? 'border-purple-600 text-purple-800'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>📐</span>
              <span>Competencias MEN</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('recomendaciones')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-black transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'recomendaciones'
                  ? 'border-purple-600 text-purple-800'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>💡</span>
              <span>Recomendaciones</span>
            </button>
          </div>

          {/* PESTAÑA 1: 15 UNIDADES */}
          {activeTab === 'unidades' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold px-1">
                <span>Unidad de Aprendizaje</span>
                <span>Niveles Aprobados y Avance</span>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {unitStats.map((u: any, idx: number) => {
                  const isComplete = u.pct >= 100;
                  const isInProgress = u.pct > 0 && u.pct < 100;

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100/80 border border-gray-200 transition-all flex flex-col sm:flex-row items-center justify-between gap-2.5"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-2xl shrink-0">{u.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-black text-gray-900 truncate">
                            Unidad {idx + 1}: {u.name}
                          </div>
                          <div className="text-[11px] text-gray-500 font-bold flex items-center gap-2">
                            <span>{u.done} de {u.total} niveles</span>
                            <span
                              className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                                isComplete
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isInProgress
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {isComplete ? 'Completado' : isInProgress ? 'En progreso' : 'Pendiente'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-48">
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${u.pct}%`,
                              background:
                                u.pct >= 70 ? '#10B981' : u.pct >= 40 ? '#F59E0B' : '#8B5CF6',
                            }}
                          />
                        </div>
                        <span className="text-xs font-black text-gray-800 w-10 text-right">
                          {u.pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PESTAÑA 2: COMPETENCIAS MEN */}
          {activeTab === 'competencias' && (
            <div className="space-y-3">
              {competencias.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 w-full sm:w-auto">
                    <span className="text-2xl shrink-0 mt-0.5">{comp.icon}</span>
                    <div>
                      <div className="text-sm font-black text-gray-900">
                        {comp.nombre}
                      </div>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">
                        {comp.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-44 shrink-0">
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${comp.pct}%`,
                          backgroundColor: comp.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-black text-gray-900 w-10 text-right">
                      {comp.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PESTAÑA 3: RECOMENDACIONES PEDAGÓGICAS */}
          {activeTab === 'recomendaciones' && (
            <div className="space-y-3">
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                <div className="text-sm font-black text-purple-950 mb-1 flex items-center gap-2">
                  <span>💡</span>
                  <span>Diagnóstico Pedagógico del Estudiante</span>
                </div>
                <p className="text-xs sm:text-sm text-purple-900 leading-relaxed font-semibold">
                  El estudiante cuenta con un avance del <strong>{globalPct}%</strong> del plan curricular de 4° de primaria. Ha superado <strong>{totalDone}</strong> niveles con un total de <strong>{totalXP} XP</strong> acumulados.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="text-sm font-black text-emerald-950 mb-1 flex items-center gap-2">
                  <span>🎯</span>
                  <span>Estrategias para Docentes y Familias</span>
                </div>
                <ul className="text-xs sm:text-sm text-emerald-900 space-y-1.5 list-disc list-inside font-semibold">
                  <li>Dedicar 15 minutos diarios a la resolución de problemas cotidianos de la vida real.</li>
                  <li>Reforzar el uso del ábaco y la grilla de cuentas visual para consolidar el valor posicional.</li>
                  <li>Revisar los pasos de resolución de problemas SABER: Comprender, Planear, Resolver y Verificar.</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs sm:text-sm text-blue-950 font-semibold leading-relaxed">
                <div className="font-black text-blue-900 mb-1">
                  🏛️ Alineación Curricular MEN Colombia:
                </div>
                <p>
                  Los estándares evaluados corresponden a los Derechos Básicos de Aprendizaje (DBA) de Matemáticas grado 4°, integrando pruebas Saber orientadas a la comprensión y transferencia contextualizada.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ══ FOOTER ══ */}
        <div className="pt-4 mt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.print();
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-md transition-all flex items-center gap-1.5"
            >
              <span>🖨️</span>
              <span>Imprimir Informe</span>
            </button>

            {onOpenFullScreen && (
              <button
                type="button"
                onClick={onOpenFullScreen}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1.5"
              >
                <span>🖥️</span>
                <span>Ver en Pantalla Completa</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-black cursor-pointer transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
