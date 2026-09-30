'use client';

import React, { useState, useEffect } from 'react';
import { useBook4 } from '../context/Book4Context';
import UnitWelcomeModal4to from '../shared/UnitWelcomeModal4to';

const LEVEL_CONFIG_4TO = [
  { label: 'Nivel 1 — Básico', orb: '🟢', color: '#16876A', bg: '#DCF5EE' },
  { label: 'Nivel 2 — Medio', orb: '🟡', color: '#BA7517', bg: '#FEF3D6' },
  { label: 'Nivel 3 — Avanzado', orb: '🔴', color: '#C94B22', bg: '#FEE8E1' },
  { label: 'Nivel 4 — Reto', orb: '🟠', color: '#C25400', bg: '#FFEBD6' },
  { label: 'Nivel 5 — Experto SABER', orb: '🟣', color: '#6A1B9A', bg: '#F3E8FA' },
];

const UNIT_HERO_GRADIENTS_4TO = [
  'from-[#3D1468] via-[#521C8B] to-[#6C28B4]', // U1 Adición
  'from-[#0A4030] via-[#0E5B45] to-[#16876A]', // U2 Sustracción
  'from-[#6A2800] via-[#A84200] to-[#E8650A]', // U3 Multiplicación
  'from-[#0D3875] via-[#14498C] to-[#0D3875]', // U4 División
  'from-[#6A0A30] via-[#9B1248] to-[#D4286A]', // U5 Problemas Mixtos
  'from-[#4A0E8F] via-[#6D18CF] to-[#9C27B0]', // U6 Divisores
  'from-[#004D40] via-[#00796B] to-[#009688]', // U7 MCD y MCM
  'from-[#0D2E6E] via-[#1553B8] to-[#1976D2]', // U8 Fracciones
  'from-[#7B3300] via-[#B84E00] to-[#FF6F00]', // U9 Apli Fracciones
  'from-[#1A4730] via-[#246142] to-[#2E7D32]', // U10 Sistema Métrico
  'from-[#5C0B2F] via-[#8E1349] to-[#C62828]', // U11 Potenciación
  'from-[#1A237E] via-[#2431B0] to-[#283593]', // U12 Geometría
  'from-[#311B92] via-[#4023BF] to-[#4A148C]', // U13 Estadística
  'from-[#B45309] via-[#D97706] to-[#F59E0B]', // U14 Cálculo Mental
  'from-[#991B1B] via-[#DC2626] to-[#EF4444]', // U15 Retos Multiplicativos
];

export default function UnitScreen4to() {
  const { book, currentUnit, scores, goScreen, startLevel } = useBook4();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  useEffect(() => {
    setShowWelcomeModal(true);
  }, [currentUnit]);

  const unit = book?.units?.[currentUnit] || book?.units?.[0];
  if (!unit) return null;

  const heroGrad = UNIT_HERO_GRADIENTS_4TO[currentUnit] || UNIT_HERO_GRADIENTS_4TO[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-2 sm:p-4 md:p-6 pb-28 select-none">
      <div className="w-full max-w-full mx-auto">
        {/* Top bar: Volver al inicio & Tutorial */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => goScreen('home')}
            className="inline-flex items-center gap-1.5 text-xs md:text-sm font-black text-[#7B2FBE] hover:text-[#5B1F9E] hover:underline cursor-pointer transition-all"
          >
            <span>←</span>
            <span>Volver al inicio</span>
          </button>

          <button
            type="button"
            onClick={() => setShowWelcomeModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-black text-purple-700 bg-purple-50 hover:bg-purple-100 px-3.5 py-1.5 rounded-full border border-purple-200 cursor-pointer transition-colors shadow-2xs"
          >
            <span>💡</span>
            <span>Tutorial de Unidad</span>
          </button>
        </div>

        {/* Unit Hero Banner */}
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${heroGrad} p-6 md:p-8 text-white shadow-xl mb-6`}
        >
          <div className="relative z-10">
            <div className="text-4xl mb-2">{unit.icon || '📘'}</div>
            <h1
              className="text-xl md:text-3xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Unidad {currentUnit + 1} — {unit.name}
            </h1>
            <p className="text-xs md:text-sm font-semibold text-white/80 mt-1">
              {unit.name}
            </p>
            <div className="mt-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-black/20 backdrop-blur-xs border border-white/20 text-[11px] font-bold text-white tracking-wide">
                {unit.std || 'Pensamiento Numérico · Grado 4° · MEN Colombia'}
              </span>
            </div>
          </div>
        </div>

        {/* Topics & Levels */}
        <div className="space-y-6">
          {(unit.topics || []).map((topic, tIdx) => {
            const topicLevels = topic.levels || [];
            const doneCount = topicLevels.reduce((acc, _, lIdx) => {
              const key1 = `${topic.id}-n${lIdx + 1}`;
              const key2 = `${tIdx}-${lIdx}`;
              const sc = scores[key1] ?? scores[key2] ?? 0;
              return acc + (sc >= 50 ? 1 : 0);
            }, 0);

            return (
              <div key={tIdx} className="space-y-3">
                {/* Topic Header Card */}
                <div className="bg-gradient-to-r from-[#F8F5FF] to-white border border-[#E9D5FF] rounded-2xl p-3.5 sm:p-4 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-black text-[#2A0F60]">
                      <span className="text-lg">{topic.icon || '📝'}</span>
                      <span style={{ fontFamily: "'Baloo 2', sans-serif" }}>{topic.title}</span>
                    </div>
                    <div className="text-[11px] sm:text-xs font-black text-[#6C28B4] bg-[#EEEDFE] px-3 py-0.5 rounded-full border border-purple-200 shrink-0">
                      {doneCount}/{topicLevels.length} niveles
                    </div>
                  </div>

                  {/* 5-segment level progress bar */}
                  <div className="flex gap-1.5 items-center mt-2.5">
                    {topicLevels.map((lv, segIdx) => {
                      const segCfg = LEVEL_CONFIG_4TO[segIdx] || LEVEL_CONFIG_4TO[0];
                      const segColor = lv.color || segCfg.color;
                      const segBg = lv.bg || segCfg.bg;
                      const segKey = `${topic.id}-n${segIdx + 1}`;
                      const segScore = scores[segKey] || 0;
                      const segDone = segScore >= 50;

                      return (
                        <div
                          key={segIdx}
                          title={lv.label || segCfg.label}
                          className="flex-1 h-2.5 sm:h-3 rounded-xs relative transition-all border flex items-center justify-center overflow-hidden"
                          style={{
                            borderColor: segColor,
                            backgroundColor: segDone ? segColor : (segBg || '#F1F5F9'),
                            opacity: segDone ? 1 : 0.45,
                            borderWidth: '1.5px',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Level Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {topicLevels.map((lv, lIdx) => {
                    const cfg = LEVEL_CONFIG_4TO[lIdx] || LEVEL_CONFIG_4TO[0];
                    const levelKey = `${topic.id}-n${lIdx + 1}`;
                    const score = scores[levelKey] || 0;
                    const isCompleted = score >= 50;

                    return (
                      <div
                        key={lIdx}
                        onClick={() => startLevel(currentUnit, tIdx, lIdx)}
                        className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                        style={{ minHeight: '140px' }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl">{cfg.orb}</span>
                            <span
                              className="text-[10px] font-black px-2 py-0.5 rounded-full"
                              style={{ background: cfg.bg, color: cfg.color }}
                            >
                              N{lIdx + 1}
                            </span>
                          </div>

                          <div
                            className="font-black text-sm text-slate-800 leading-tight mb-1"
                            style={{ fontFamily: "'Baloo 2', sans-serif" }}
                          >
                            {lv.label || cfg.label}
                          </div>
                          <div className="text-[11px] text-slate-500 font-semibold">
                            {lv.exercises?.length || 10} retos matemáticos
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-black text-amber-600">
                            {score > 0 ? `${score}% pts` : 'Por iniciar'}
                          </span>
                          <span
                            className="text-xs font-black px-2.5 py-1 rounded-xl text-white"
                            style={{ background: cfg.color }}
                          >
                            {isCompleted ? 'Repasar' : 'Entrar 🚀'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ Welcome / Tutorial Modal for this Unit ══ */}
      {showWelcomeModal && (
        <UnitWelcomeModal4to
          isOpen={showWelcomeModal}
          unitIndex={currentUnit}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}
    </div>
  );
}
