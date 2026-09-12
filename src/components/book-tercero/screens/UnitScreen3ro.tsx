'use client';

import React, { useState, useEffect } from 'react';
import { useBook3 } from '../context/Book3Context';
import UnitWelcomeModal3ro, { UnitOperationIcon3D } from '../shared/UnitWelcomeModal3ro';
import { fedorSpeak } from '../shared/Grade3Speech';

const LEVEL_CONFIG_3RO = [
  { label: 'Nivel 1 — Básico', orb: '🟢', color: '#16876A', bg: '#DCF5EE' },
  { label: 'Nivel 2 — Medio', orb: '🟡', color: '#BA7517', bg: '#FEF3D6' },
  { label: 'Nivel 3 — Avanzado', orb: '🔴', color: '#C94B22', bg: '#FEE8E1' },
  { label: 'Nivel 4 — Reto', orb: '🟠', color: '#C25400', bg: '#FFEBD6' },
  { label: 'Nivel 5 — Experto', orb: '🟣', color: '#6A1B9A', bg: '#F3E8FA' },
];

const UNIT_HERO_GRADIENTS = [
  'from-[#3D1468] via-[#521C8B] to-[#6C28B4]', // U1 Suma
  'from-[#0A4030] via-[#0E5B45] to-[#16876A]', // U2 Resta
  'from-[#6A2800] via-[#A84200] to-[#E8650A]', // U3 Mult
  'from-[#0D3875] via-[#14498C] to-[#0D3875]', // U4 Div (blue gradient matching screenshot)
  'from-[#6A0A30] via-[#9B1248] to-[#D4286A]', // U5 Saber
  'from-[#4A0E8F] via-[#6D18CF] to-[#9C27B0]', // U6 Factores
  'from-[#004D40] via-[#00796B] to-[#009688]', // U7 Fracc
  'from-[#0D2E6E] via-[#1553B8] to-[#1976D2]', // U8 Apli
  'from-[#7B3300] via-[#B84E00] to-[#FF6F00]', // U9 Potencia
  'from-[#1A4730] via-[#246142] to-[#2E7D32]', // U10 Metrico
  'from-[#5C0B2F] via-[#8E1349] to-[#C62828]', // U11 Geom
  'from-[#1A237E] via-[#2431B0] to-[#283593]', // U12 Estad
  'from-[#311B92] via-[#4023BF] to-[#4A148C]', // U13 Magni
];

const HERO_STARS = [
  { top: '14%', left: '12%', size: 2, opacity: 0.6 },
  { top: '24%', left: '26%', size: 3, opacity: 0.8 },
  { top: '65%', left: '16%', size: 1.5, opacity: 0.5 },
  { top: '38%', left: '44%', size: 2.5, opacity: 0.7 },
  { top: '18%', left: '72%', size: 3, opacity: 0.85 },
  { top: '75%', left: '60%', size: 2, opacity: 0.6 },
  { top: '30%', left: '85%', size: 2, opacity: 0.5 },
  { top: '80%', left: '82%', size: 2.5, opacity: 0.7 },
  { top: '52%', left: '92%', size: 1.5, opacity: 0.6 },
  { top: '8%', left: '55%', size: 2, opacity: 0.75 },
  { top: '62%', left: '38%', size: 2, opacity: 0.5 },
  { top: '85%', left: '30%', size: 1.5, opacity: 0.6 },
];

export default function UnitScreen3ro() {
  const { book, currentUnit, scores, goScreen, startLevel } = useBook3();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  useEffect(() => {
    setShowWelcomeModal(true);
  }, [currentUnit]);

  const unit = book?.units?.[currentUnit] || book?.units?.[0];
  if (!unit) return null;

  const heroGrad = UNIT_HERO_GRADIENTS[currentUnit] || UNIT_HERO_GRADIENTS[0];

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    fedorSpeak(text);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-4 md:p-8 pb-28 select-none">
      <div className="max-w-6xl mx-auto">
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

        {/* Unit Hero Banner matching screenshot */}
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${heroGrad} p-6 md:p-8 text-white shadow-xl mb-6`}
        >
          {/* Starfield overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {HERO_STARS.map((s, idx) => (
              <div
                key={idx}
                className="absolute rounded-full bg-white"
                style={{
                  top: s.top,
                  left: s.left,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  opacity: s.opacity,
                }}
              />
            ))}
          </div>

          {/* Banner content */}
          <div className="relative z-10">
            {/* 3D or authentic Unit Operation Icon */}
            <div className="mb-2">
              <UnitOperationIcon3D unitIndex={currentUnit} />
            </div>

            <h1 className="text-xl md:text-3xl font-black text-white tracking-tight mt-1">
              Unidad {currentUnit + 1} — {unit.name}
            </h1>

            <p className="text-xs md:text-sm font-semibold text-white/80 mt-1">
              {unit.name}
            </p>

            <div className="mt-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-black/20 backdrop-blur-xs border border-white/20 text-[11px] font-bold text-white tracking-wide">
                {unit.std || 'Pensamiento Numérico · Grado 3° · MEN Colombia'}
              </span>
            </div>
          </div>
        </div>

        {/* Topics & Levels (Vertical list downward) */}
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
                      <span className="text-base">{topic.icon || '➗'}</span>
                      <span>{topic.title}</span>
                    </div>
                    <div className="text-[11px] sm:text-xs font-black text-[#6C28B4] bg-[#EEEDFE] px-3 py-0.5 rounded-full border border-purple-200 shrink-0">
                      {doneCount}/{topicLevels.length} niveles
                    </div>
                  </div>

                  {/* 5-segment level progress bar */}
                  <div className="flex gap-1.5 items-center mt-2.5">
                    {topicLevels.map((lv, segIdx) => {
                      const segCfg = LEVEL_CONFIG_3RO[segIdx] || LEVEL_CONFIG_3RO[0];
                      const segColor = lv.color || segCfg.color;
                      const segBg = lv.bg || segCfg.bg;
                      const segKey1 = `${topic.id}-n${segIdx + 1}`;
                      const segKey2 = `${tIdx}-${segIdx}`;
                      const segScore = scores[segKey1] ?? scores[segKey2] ?? 0;
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
                        >
                          {segDone && (
                            <span className="text-[8px] font-black text-white leading-none">✓</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Levels list (vertical downwards: lista hacia abajo) */}
                <div className="space-y-2.5">
                  {topicLevels.map((lv, lIdx) => {
                    const cfg = LEVEL_CONFIG_3RO[lIdx] || LEVEL_CONFIG_3RO[0];
                    const levelLabel = lv.label || cfg.label;
                    const levelColor = lv.color || cfg.color;
                    const levelBg = lv.bg || cfg.bg;
                    const levelOrb = cfg.orb;
                    const levelDesc = topic.levelDescs?.[lIdx] || topic.desc || 'Práctica interactiva guiada';

                    const levelKey = `${topic.id}-n${lIdx + 1}`;
                    const score = scores[levelKey] ?? scores[`${tIdx}-${lIdx}`] ?? 0;
                    const isCompleted = score >= 50;

                    return (
                      <div
                        key={lIdx}
                        onClick={() => startLevel(currentUnit, tIdx, lIdx)}
                        className={`w-full bg-white border ${
                          isCompleted
                            ? 'border-emerald-300 bg-gradient-to-r from-emerald-50/20 to-white'
                            : 'border-gray-200/90'
                        } rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-purple-300 hover:translate-x-1 transition-all flex items-center justify-between gap-4 cursor-pointer select-none group`}
                      >
                        {/* Left Icon Badge */}
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-[2.5px] shadow-xs text-xl"
                          style={{
                            borderColor: levelColor,
                            backgroundColor: levelBg,
                          }}
                        >
                          {isCompleted ? '✅' : levelOrb}
                        </div>

                        {/* Middle Body */}
                        <div className="flex-1 min-w-0">
                          {/* Title + Speak button */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className="font-black text-sm md:text-base tracking-tight"
                              style={{ color: levelColor }}
                            >
                              {levelLabel}
                            </span>
                            <button
                              type="button"
                              title="Escuchar nivel"
                              aria-label="Escuchar nivel"
                              onClick={(e) => handleSpeak(e, levelLabel)}
                              className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-300/80 text-xs text-gray-600 transition-colors shadow-2xs cursor-pointer active:scale-95"
                            >
                              🔊
                            </button>
                          </div>

                          {/* Description + Speak button */}
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-xs text-gray-500 font-semibold">
                              {levelDesc}
                            </span>
                            <button
                              type="button"
                              title="Escuchar descripción"
                              aria-label="Escuchar descripción"
                              onClick={(e) => handleSpeak(e, levelDesc)}
                              className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-300/80 text-xs text-gray-600 transition-colors shadow-2xs cursor-pointer active:scale-95"
                            >
                              🔊
                            </button>
                          </div>

                          {/* Completed progress bar indicator */}
                          {isCompleted && (
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="h-1.5 w-24 bg-emerald-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-600 rounded-full"
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-black text-emerald-700">
                                {score}% logrado
                              </span>
                            </div>
                          )}

                          {/* 5 Indicator Dots */}
                          <div className="flex items-center gap-1 mt-2">
                            {LEVEL_CONFIG_3RO.map((c, dotIdx) => {
                              const isFilled = lIdx >= dotIdx;
                              return (
                                <div
                                  key={dotIdx}
                                  className="w-2 h-2 rounded-full transition-colors"
                                  style={{
                                    backgroundColor: isFilled ? c.color : '#E2E8F0',
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Right Action Button */}
                        <div className="flex items-center gap-3 shrink-0">
                          {isCompleted ? (
                            <div className="text-right hidden sm:block">
                              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                                ¡Superado!
                              </span>
                            </div>
                          ) : null}

                          <div
                            className="w-7 h-7 rounded-lg bg-[#3B82F6] group-hover:bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 active:scale-95 transition-all"
                            title="Comenzar nivel"
                          >
                            <svg className="w-3.5 h-3.5 ml-0.5 fill-current" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
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

      {/* Modal de Bienvenida de Unidad */}
      <UnitWelcomeModal3ro
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        unitIndex={currentUnit}
      />
    </div>
  );
}
