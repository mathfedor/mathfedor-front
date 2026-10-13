'use client';

import React, { useState, useEffect } from 'react';
import { useBook5 } from '../context/Book5Context';
import UnitWelcomeModal5to, { UnitOperationIcon3D5to } from '../shared/UnitWelcomeModal5to';

const LEVEL_CONFIG_5TO = [
  { label: 'Nivel 1 — Básico', color: '#16876A', bg: '#DCF5EE' },
  { label: 'Nivel 2 — Medio', color: '#BA7517', bg: '#FEF3D6' },
  { label: 'Nivel 3 — Avanzado', color: '#C94B22', bg: '#FEE8E1' },
  { label: 'Nivel 4 — Experto', color: '#C25400', bg: '#FFEBD6' },
  { label: 'Nivel 5 — Pruebas SABER', color: '#6A1B9A', bg: '#F3E8FA' },
];

const UNIT_HERO_GRADIENTS_5TO = [
  'from-[#3D1468] via-[#521C8B] to-[#6C28B4]', // U1
  'from-[#0A4030] via-[#0E5B45] to-[#16876A]', // U2
  'from-[#6A2800] via-[#A84200] to-[#E8650A]', // U3
  'from-[#0D3875] via-[#14498C] to-[#0D3875]', // U4
  'from-[#6A0A30] via-[#9B1248] to-[#D4286A]', // U5
  'from-[#4A0E8F] via-[#6D18CF] to-[#9C27B0]', // U6
  'from-[#004D40] via-[#00796B] to-[#009688]', // U7
  'from-[#0D2E6E] via-[#1553B8] to-[#1976D2]', // U8
  'from-[#7B3300] via-[#B84E00] to-[#FF6F00]', // U9
  'from-[#1A4730] via-[#246142] to-[#2E7D32]', // U10
  'from-[#5C0B2F] via-[#8E1349] to-[#C62828]', // U11
  'from-[#1A237E] via-[#2431B0] to-[#283593]', // U12
  'from-[#311B92] via-[#4023BF] to-[#4A148C]', // U13
  'from-[#B45309] via-[#D97706] to-[#F59E0B]', // U14
  'from-[#991B1B] via-[#DC2626] to-[#EF4444]', // U15
  'from-[#1E1B4B] via-[#312E81] to-[#4338CA]', // U16
  'from-[#14532D] via-[#15803D] to-[#16A34A]', // U17
  'from-[#701A75] via-[#A21CAF] to-[#C026D3]', // U18
  'from-[#7C2D12] via-[#C2410C] to-[#EA580C]', // U19
  'from-[#164E63] via-[#0E7490] to-[#06B6D4]', // U20
];

const HERO_STARS = [
  { top: '15%', left: '10%', size: 2, delay: '0.2s' },
  { top: '22%', left: '82%', size: 3, delay: '0.9s' },
  { top: '70%', left: '18%', size: 1.5, delay: '1.4s' },
  { top: '65%', left: '76%', size: 2.5, delay: '0.5s' },
  { top: '35%', left: '45%', size: 1.5, delay: '1.1s' },
  { top: '18%', left: '60%', size: 2, delay: '1.7s' },
  { top: '80%', left: '55%', size: 2, delay: '0.3s' },
  { top: '48%', left: '90%', size: 1.5, delay: '0.8s' },
  { top: '85%', left: '32%', size: 2.5, delay: '1.5s' },
  { top: '12%', left: '32%', size: 1.5, delay: '0.6s' },
  { top: '55%', left: '8%', size: 2, delay: '1.2s' },
  { top: '40%', left: '68%', size: 2, delay: '0.4s' },
];

export default function UnitScreen5to() {
  const { book, currentUnit, scores, goScreen, startLevel } = useBook5();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({ 0: true });

  useEffect(() => {
    setShowWelcomeModal(true);
    setExpandedTopics({ 0: true });
  }, [currentUnit]);

  const unit = book?.units?.[currentUnit] || book?.units?.[0];
  if (!unit) return null;

  const heroGrad = UNIT_HERO_GRADIENTS_5TO[currentUnit] || UNIT_HERO_GRADIENTS_5TO[0];

  const unitDisplayName = unit.name?.startsWith('Unidad')
    ? unit.name
    : `Unidad ${currentUnit + 1} — ${unit.name}`;

  const toggleTopic = (tIdx: number) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [tIdx]: !prev[tIdx],
    }));
  };

  const renderLevelOrb = (lIdx: number) => {
    switch (lIdx) {
      case 0:
        return (
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #76E4B8 0%, #10B981 40%, #057A55 85%, #044E36 100%)',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.35)',
            }}
          />
        );
      case 1:
        return (
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #FFE98A 0%, #F59E0B 45%, #B45309 85%, #78350F 100%)',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.35)',
            }}
          />
        );
      case 2:
        return (
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #FFA896 0%, #EF4444 45%, #B91C1C 85%, #7F1D1D 100%)',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.35)',
            }}
          />
        );
      case 3:
        return (
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #C49BFF 0%, #8B5CF6 45%, #6D28D9 85%, #4C1D95 100%)',
              boxShadow: '0 2px 6px rgba(139, 92, 246, 0.35)',
            }}
          />
        );
      case 4:
      default:
        return (
          <span className="text-2xl sm:text-3xl select-none filter drop-shadow-xs">
            🏆
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDFF] text-slate-800 font-sans p-2 sm:p-4 md:p-6 pb-28 select-none">
      <div className="w-full max-w-[1008px] mx-auto">
        {/* Top bar: Volver al inicio */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => goScreen('home')}
            className="inline-flex items-center gap-1.5 text-xs md:text-sm font-black text-[#7B2FBE] hover:text-[#5B1F9E] hover:underline cursor-pointer transition-all"
          >
            <span>←</span>
            <span>Volver al inicio</span>
          </button>
        </div>

        {/* ══ Unit Hero Banner ══ */}
        <div
          className={`relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl bg-gradient-to-r ${heroGrad} mb-6`}
          style={{ boxShadow: '0 10px 30px rgba(61, 20, 104, 0.35)' }}
        >
          {HERO_STARS.map((s, idx) => (
            <span
              key={idx}
              className="absolute rounded-full bg-white animate-pulse pointer-events-none"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                animationDelay: s.delay,
                opacity: 0.75,
              }}
            />
          ))}

          <div className="relative z-10">
            {/* Unit Operation Icon */}
            <div className="mb-2 inline-flex items-center justify-center">
              <UnitOperationIcon3D5to unitIndex={currentUnit} fallbackIcon={unit.icon} />
            </div>

            <h1
              className="text-2xl md:text-3xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {unitDisplayName}
            </h1>

            <p className="text-xs md:text-sm font-semibold text-white/80 mt-1">
              {unit.short || 'Adición'}
            </p>

            <div className="mt-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-[11px] font-bold text-white tracking-wide">
                {unit.std || 'Pensamiento Numérico · MEN Colombia'}
              </span>
            </div>
          </div>
        </div>

        {/* ══ Topics List (Accordion + Vertical Cards) ══ */}
        <div className="space-y-4">
          {(unit.topics || []).map((topic: any, tIdx: number) => {
            const isOpen = expandedTopics[tIdx] ?? (tIdx === 0);
            const topicLevels = topic.levels || [];

            return (
              <div key={topic.id || tIdx} className="topics-section">
                {/* Topic Header Accordion Button */}
                <button
                  type="button"
                  onClick={() => toggleTopic(tIdx)}
                  className="w-full text-left flex items-center gap-2 py-2 px-1 text-xs md:text-sm font-black uppercase tracking-wider text-[#5B4886] hover:text-[#3D1468] transition-colors cursor-pointer select-none"
                  style={{ letterSpacing: '0.06em' }}
                >
                  {isOpen ? (
                    <>
                      <span className="text-sm md:text-base">{topic.icon || '🔣'}</span>
                      <span>{topic.title}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-base font-black leading-none text-[#5B4886]">+</span>
                      <span>{topic.title}</span>
                    </>
                  )}
                </button>

                {/* Vertical list of levels */}
                {isOpen && (
                  <div className="space-y-3 mt-1.5 mb-5">
                    {topicLevels.map((lvl: any, lIdx: number) => {
                      const cfg = LEVEL_CONFIG_5TO[lIdx] || LEVEL_CONFIG_5TO[0];
                      const levelKey1 = `${topic.id}-n${lIdx + 1}`;
                      const levelKey2 = `${topic.id || `u${currentUnit}t${tIdx}`}-n${lIdx + 1}`;
                      const levelKey3 = `${tIdx}-${lIdx}`;
                      const score = scores[levelKey1] ?? scores[levelKey2] ?? scores[levelKey3] ?? 0;
                      const isCompleted = score >= 50;

                      return (
                        <div
                          key={lIdx}
                          onClick={() => startLevel(currentUnit, tIdx, lIdx)}
                          className="w-full bg-white rounded-2xl p-3.5 sm:p-4.5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex items-center justify-between gap-4 cursor-pointer select-none group"
                          style={{
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                            transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(4px)';
                            e.currentTarget.style.boxShadow = '0 6px 18px rgba(123, 47, 190, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.03)';
                          }}
                        >
                          {/* Left 3D Sphere / Trophy Icon Badge */}
                          <div
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                            style={{ backgroundColor: cfg.bg }}
                          >
                            {renderLevelOrb(lIdx)}
                          </div>

                          {/* Middle Body */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm sm:text-base font-black text-[#1E1B4B] leading-tight group-hover:text-[#6C28B4] transition-colors">
                              {cfg.label}
                            </div>

                            <div className="text-xs text-slate-400 font-semibold mt-0.5 truncate">
                              {topic.desc || lvl.title || 'Hasta centenas de mil'}
                            </div>

                            {/* 5 Dots */}
                            <div className="flex items-center gap-1.5 mt-2">
                              {[0, 1, 2, 3, 4].map((dotIdx) => {
                                const isFilled = dotIdx <= lIdx;
                                const dotColor = isFilled
                                  ? LEVEL_CONFIG_5TO[dotIdx]?.color || '#16876A'
                                  : '#E2E8F0';
                                return (
                                  <div
                                    key={dotIdx}
                                    className="w-2 h-2 rounded-full transition-colors"
                                    style={{ backgroundColor: dotColor }}
                                  />
                                );
                              })}
                            </div>
                          </div>

                          {/* Right Action: Score badge (if completed) + Blue Play Button */}
                          <div className="flex items-center gap-3 shrink-0 pl-2">
                            {isCompleted && (
                              <div className="text-right hidden sm:block">
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  {score >= 80 ? 'Excelente' : 'Completado'}
                                </span>
                                <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                                  {score}% logrado
                                </div>
                              </div>
                            )}

                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-110 shrink-0">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tutorial modal */}
      {showWelcomeModal && (
        <UnitWelcomeModal5to
          isOpen={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
          unitIndex={currentUnit}
          unit={unit}
        />
      )}
    </div>
  );
}
