'use client';

import React, { useState, useEffect } from 'react';
import { useBook5 } from '../context/Book5Context';
import UnitWelcomeModal5to, { UnitOperationIcon3D5to } from '../shared/UnitWelcomeModal5to';

const LEVEL_CONFIG_5TO = [
  { label: 'Nivel 1 — Básico', color: '#10B981', bg: '#DCF5EE' },
  { label: 'Nivel 2 — Medio', color: '#F59E0B', bg: '#FEF3D6' },
  { label: 'Nivel 3 — Avanzado', color: '#EF4444', bg: '#FEE8E1' },
  { label: 'Nivel 4 — Experto', color: '#8B5CF6', bg: '#FFF0E4' },
  { label: 'Nivel 5 — Pruebas SABER', color: '#F59E0B', bg: '#EDE0FF' },
];

const LEVEL_DOT_COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F59E0B'];

const UNIT_HERO_GRADIENTS_5TO = [
  'linear-gradient(135deg, #3D1468 0%, #521C8B 55%, #6C28B4 100%)', // U1
  'linear-gradient(135deg, #0A4030 0%, #0E5B45 55%, #16876A 100%)', // U2
  'linear-gradient(135deg, #6A2800 0%, #A84200 55%, #E8650A 100%)', // U3
  'linear-gradient(135deg, #0D3875 0%, #14498C 55%, #1A6CB4 100%)', // U4
  'linear-gradient(135deg, #6A0A30 0%, #9B1248 55%, #D4286A 100%)', // U5
  'linear-gradient(135deg, #4A0E8F 0%, #6D18CF 55%, #9C27B0 100%)', // U6
  'linear-gradient(135deg, #004D40 0%, #00796B 55%, #009688 100%)', // U7
  'linear-gradient(135deg, #0D2E6E 0%, #1553B8 55%, #1976D2 100%)', // U8
  'linear-gradient(135deg, #7B3300 0%, #B84E00 55%, #FF6F00 100%)', // U9
  'linear-gradient(135deg, #1A4730 0%, #246142 55%, #2E7D32 100%)', // U10
  'linear-gradient(135deg, #5C0B2F 0%, #8E1349 55%, #C62828 100%)', // U11
  'linear-gradient(135deg, #1A237E 0%, #2431B0 55%, #283593 100%)', // U12
  'linear-gradient(135deg, #311B92 0%, #4023BF 55%, #4A148C 100%)', // U13
  'linear-gradient(135deg, #B45309 0%, #D97706 55%, #F59E0B 100%)', // U14
  'linear-gradient(135deg, #991B1B 0%, #DC2626 55%, #EF4444 100%)', // U15
  'linear-gradient(135deg, #1E1B4B 0%, #312E81 55%, #4338CA 100%)', // U16
  'linear-gradient(135deg, #14532D 0%, #15803D 55%, #16A34A 100%)', // U17
  'linear-gradient(135deg, #701A75 0%, #A21CAF 55%, #C026D3 100%)', // U18
  'linear-gradient(135deg, #7C2D12 0%, #C2410C 55%, #EA580C 100%)', // U19
  'linear-gradient(135deg, #164E63 0%, #0E7490 55%, #06B6D4 100%)', // U20
];

const HERO_STARS = [
  { top: '15%', left: '10%', size: 2 },
  { top: '22%', left: '82%', size: 3 },
  { top: '70%', left: '18%', size: 1.5 },
  { top: '65%', left: '76%', size: 2.5 },
  { top: '35%', left: '45%', size: 1.5 },
  { top: '18%', left: '60%', size: 2 },
  { top: '80%', left: '55%', size: 2 },
  { top: '48%', left: '90%', size: 1.5 },
  { top: '85%', left: '32%', size: 2.5 },
  { top: '12%', left: '32%', size: 1.5 },
  { top: '55%', left: '8%', size: 2 },
  { top: '40%', left: '68%', size: 2 },
];

export default function UnitScreen5to() {
  const { book, currentUnit, scores, goScreen, startLevel } = useBook5();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({ 0: true });

  useEffect(() => {
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
              background: 'radial-gradient(circle at 35% 30%, #5EEAD4 0%, #10B981 40%, #057A55 85%, #044E36 100%)',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)',
            }}
          />
        );
      case 1:
        return (
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #FFE98A 0%, #F59E0B 45%, #B45309 85%, #78350F 100%)',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)',
            }}
          />
        );
      case 2:
        return (
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #FFA896 0%, #EF4444 45%, #B91C1C 85%, #7F1D1D 100%)',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
            }}
          />
        );
      case 3:
        return (
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #D8B4FE 0%, #8B5CF6 45%, #6D28D9 85%, #4C1D95 100%)',
              boxShadow: '0 2px 6px rgba(139, 92, 246, 0.4)',
            }}
          />
        );
      case 4:
      default:
        return (
          <span className="text-2xl sm:text-[28px] select-none filter drop-shadow-xs">
            🏆
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDFF] text-slate-800 font-sans p-3 sm:p-5 md:p-8 pb-32 select-none">
      <div className="w-full max-w-[940px] mx-auto">
        {/* Top bar: Volver al inicio */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => goScreen('home')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#5C21A6] hover:text-[#401278] hover:opacity-85 transition-all cursor-pointer select-none"
          >
            <span className="text-sm font-black leading-none">←</span>
            <span>Volver al inicio</span>
          </button>
        </div>

        {/* ══ Unit Hero Banner ══ */}
        <div
          className="relative overflow-hidden rounded-[24px] p-6 sm:p-8 md:p-9 text-white mb-6"
          style={{
            background: heroGrad,
            boxShadow: '0 10px 30px rgba(61, 20, 104, 0.3)',
          }}
        >
          {HERO_STARS.map((s, idx) => (
            <span
              key={idx}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                opacity: 0.65,
              }}
            />
          ))}

          <div className="relative z-10">
            {/* Unit Operation Icon */}
            <div className="mb-2.5 inline-flex items-center justify-center">
              <UnitOperationIcon3D5to unitIndex={currentUnit} fallbackIcon={unit.icon} />
            </div>

            <h1
              className="text-xl sm:text-2xl md:text-[26px] font-black text-white tracking-tight leading-snug"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {unitDisplayName}
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-white/85 mt-1">
              {unit.short || 'Adición'}
            </p>

            <div className="mt-3.5">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/25 text-[11px] sm:text-xs font-bold text-white tracking-wide">
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
                  className={`w-full text-left flex items-center gap-2 py-2 px-1 text-xs sm:text-[13px] font-black uppercase tracking-wider transition-colors cursor-pointer select-none ${
                    isOpen ? 'text-[#5A4E7A] hover:text-[#3D1468]' : 'text-[#5C21A6] hover:text-[#3D1468]'
                  }`}
                  style={{ letterSpacing: '0.06em' }}
                >
                  {isOpen ? (
                    <>
                      <span className="text-sm sm:text-base leading-none">{topic.icon || '🔢'}</span>
                      <span>{topic.title}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-base font-black leading-none text-[#5C21A6]">+</span>
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
                          className="w-full bg-white rounded-[20px] p-3.5 sm:px-5 sm:py-4 border border-[#EDE8F5] shadow-xs hover:border-[#D8B4FE] hover:shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer select-none group"
                          style={{
                            boxShadow: '0 2px 8px rgba(92, 33, 166, 0.04)',
                            transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(4px)';
                            e.currentTarget.style.boxShadow = '0 6px 18px rgba(92, 33, 166, 0.09)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(92, 33, 166, 0.04)';
                          }}
                        >
                          {/* Left 3D Sphere / Trophy Icon Badge */}
                          <div
                            className="w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                            style={{ backgroundColor: cfg.bg }}
                          >
                            {renderLevelOrb(lIdx)}
                          </div>

                          {/* Middle Body */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm sm:text-base font-black text-[#1E1B4B] leading-tight group-hover:text-[#5C21A6] transition-colors">
                              {cfg.label}
                            </div>

                            <div className="text-xs text-[#94A3B8] font-semibold mt-0.5 truncate">
                              {topic.desc || lvl.title || 'Hasta centenas de mil'}
                            </div>

                            {/* 5 Dots */}
                            <div className="flex items-center gap-1.5 mt-2">
                              {[0, 1, 2, 3, 4].map((dotIdx) => {
                                const isFilled = dotIdx <= lIdx;
                                const dotColor = isFilled
                                  ? LEVEL_DOT_COLORS[dotIdx] || '#10B981'
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
                          <div className="flex items-center gap-3 shrink-0 pl-1">
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

                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105 shrink-0">
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

      {/* Tutorial modal (can be opened on demand) */}
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

