'use client';

import React, { useMemo } from 'react';
import { useBook5 } from '../context/Book5Context';
import bookCurriculum5 from '@/mocks/data/book-curriculum-5.data.json';

const RANKS_5TO = [
  { min: 0, label: '🌱 Explorador', color: '#16876A' },
  { min: 250, label: '🚀 Aprendiz', color: '#BA7517' },
  { min: 600, label: '⭐ Aventurero', color: '#E8650A' },
  { min: 1200, label: '🪐 Experto', color: '#1A6CB4' },
  { min: 2500, label: '👑 Maestro', color: '#7B2FBE' },
  { min: 5000, label: '🌌 Leyenda', color: '#C94B22' },
];

function getRank5to(xp: number) {
  return [...RANKS_5TO].reverse().find((r) => xp >= r.min) || RANKS_5TO[0];
}

export default function ReportScreen5to() {
  const { student, coins, streak, totalXP, scores, goScreen } = useBook5();

  const units = (bookCurriculum5.UNITS || []) as any[];

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

  const currentRank = getRank5to(totalXP);

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-3 sm:px-6 select-none font-sans">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-200">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <button
            type="button"
            onClick={() => goScreen('home')}
            className="text-xs sm:text-sm font-black text-purple-700 hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span> Volver al Inicio
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-md hover:scale-105 transition-transform"
          >
            🖨️ Imprimir Reporte
          </button>
        </div>

        {/* Student & School Header */}
        <div className="bg-gradient-to-r from-purple-50 to-amber-50 p-6 rounded-2xl border-2 border-purple-200 mb-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-700 to-amber-400 p-1 shadow-lg shrink-0">
            <div className="w-full h-full bg-[#1A0848] rounded-full flex items-center justify-center text-4xl">
              {student?.avatar || '🧑‍🚀'}
            </div>
          </div>

          <div className="flex-1">
            <div className="text-xs font-black text-purple-700 uppercase tracking-wider mb-1">
              Informe Diagnóstico y de Progreso · 5° Grado
            </div>
            <h1
              className="text-2xl sm:text-3xl font-black text-[#1A1033] leading-tight"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {student?.name || 'Estudiante'}
            </h1>
            <div className="text-xs sm:text-sm text-gray-600 font-bold mt-1">
              {student?.school || 'Institución Educativa'} {student?.city ? `· ${student.city}` : ''}
              {student?.teacher ? ` · Profe: ${student.teacher}` : ''}
            </div>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-300">
              {currentRank.label}
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">{totalXP} XP</div>
          </div>
        </div>

        {/* Global Progress Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-center">
            <div className="text-2xl font-black text-purple-700">{globalPct}%</div>
            <div className="text-xs font-bold text-gray-500 uppercase mt-0.5">Avance Global</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
            <div className="text-2xl font-black text-emerald-700">
              {totalDone}/{totalLevels}
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase mt-0.5">Niveles Aprobados</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center">
            <div className="text-2xl font-black text-amber-600">{coins} 🪙</div>
            <div className="text-xs font-bold text-gray-500 uppercase mt-0.5">Monedas Ganadas</div>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-center">
            <div className="text-2xl font-black text-red-600">{streak} 🔥</div>
            <div className="text-xs font-bold text-gray-500 uppercase mt-0.5">Racha Actual</div>
          </div>
        </div>

        {/* Detailed Units Breakdown */}
        <div className="mb-6">
          <h2 className="text-base font-black text-[#1A1033] mb-3 flex items-center gap-2">
            <span>📚</span> Desglose por Misiones y Unidades ({unitStats.length}):
          </h2>

          <div className="space-y-2">
            {unitStats.map((u, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-purple-300 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{u.icon}</span>
                  <div className="truncate">
                    <div className="text-[#1A1033] truncate font-black text-sm">{u.name}</div>
                    <div className="text-gray-500 text-[11px]">
                      {u.done} de {u.total} niveles completados
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                  <div className="w-24 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-emerald-500 h-full transition-all"
                      style={{ width: `${u.pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-black text-purple-700">{u.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
