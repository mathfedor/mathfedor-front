'use client';

import React, { useState, useMemo } from 'react';
import { useBook4 } from '../context/Book4Context';
import bookCurriculum4 from '@/mocks/data/book-curriculum-4.data.json';

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

export default function ReportScreen4to() {
  const { student, coins, streak, totalXP, scores, goScreen } = useBook4();

  const units = bookCurriculum4.UNITS || [];

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
              Informe Diagnóstico y de Progreso · 4° Grado
            </div>
            <h1
              className="text-2xl sm:text-3xl font-black text-[#1A1033] leading-tight"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {student?.name || 'Estudiante de 4°'}
            </h1>
            <div className="text-xs text-gray-600 font-bold mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span>🏫 {student?.school || 'Colegio'}</span>
              <span>📍 {student?.city || 'Ciudad'}</span>
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

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-center">
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
            <div className="text-2xl font-black text-purple-900">{globalPct}%</div>
            <div className="text-xs font-bold text-purple-700 uppercase mt-0.5">Progreso Global</div>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="text-2xl font-black text-amber-900">{totalDone}/{totalLevels}</div>
            <div className="text-xs font-bold text-amber-700 uppercase mt-0.5">Niveles Aprobados</div>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="text-2xl font-black text-emerald-900">{coins} 🪙</div>
            <div className="text-xs font-bold text-emerald-700 uppercase mt-0.5">Monedas Cósmicas</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
            <div className="text-2xl font-black text-orange-900">{streak} 🔥</div>
            <div className="text-xs font-bold text-orange-700 uppercase mt-0.5">Racha de Días</div>
          </div>
        </div>

        {/* Detailed Units Progress Breakdown */}
        <div className="mb-6">
          <h2
            className="text-lg font-black text-[#1A1033] mb-3"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            Avance por Unidades de Aprendizaje (15 Unidades):
          </h2>

          <div className="space-y-3">
            {unitStats.map((u: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-2xl">{u.icon}</span>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-gray-900">
                      Unidad {idx + 1}: {u.name}
                    </div>
                    <div className="text-[11px] text-gray-500 font-bold">
                      {u.done} de {u.total} niveles completados
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
                  <span className="text-xs font-black text-gray-700 w-10 text-right">
                    {u.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pedagogical recommendations */}
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs sm:text-sm text-blue-950 font-semibold leading-relaxed">
          <div className="font-black text-blue-900 mb-1">
            💡 Observaciones y Recomendaciones Pedagógicas Fedor:
          </div>
          <p>
            El estudiante avanza en las 15 unidades de 4° grado cubriendo los estándares de pensamiento numérico, espacial, métrico y aleatorio según el MEN Colombia. Se recomienda mantener la práctica diaria de los <strong>Problemas Cotidianos tipo SABER</strong> para fortalecer la resolución de problemas en contextos reales.
          </p>
        </div>
      </div>
    </div>
  );
}
