'use client';

import React, { useState, useEffect } from 'react';
import { useBook4 } from '../context/Book4Context';
import UnitWelcomeModal4to, { UnitOperationIcon3D4to } from '../shared/UnitWelcomeModal4to';

const LEVEL_CONFIG_4TO = [
  { label: 'Nivel 1 — Básico', orb: '🟢', color: '#16876A', bg: '#DCF5EE' },
  { label: 'Nivel 2 — Medio', orb: '🟡', color: '#BA7517', bg: '#FEF3D6' },
  { label: 'Nivel 3 — Avanzado', orb: '🔴', color: '#C94B22', bg: '#FEE8E1' },
  { label: 'Nivel 4 — Experto', orb: '🟣', color: '#C25400', bg: '#FFEBD6' },
  { label: 'Nivel 5 — Pruebas SABER', orb: '🏆', color: '#6A1B9A', bg: '#F3E8FA' },
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

export default function UnitScreen4to() {
  const { book, currentUnit, scores, goScreen, startLevel } = useBook4();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  useEffect(() => {
    setShowWelcomeModal(true);
  }, [currentUnit]);

  const unit = book?.units?.[currentUnit] || book?.units?.[0];
  if (!unit) return null;

  const heroGrad = UNIT_HERO_GRADIENTS_4TO[currentUnit] || UNIT_HERO_GRADIENTS_4TO[0];

  const handleSpeakUnitHero = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Unidad ${currentUnit + 1}. ${unit.name}. ${unit.std || 'Pensamiento Numérico · Grado 4°'}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CO';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const unitDisplayName = unit.name?.startsWith('Unidad')
    ? unit.name
    : `Unidad ${currentUnit + 1} — ${unit.name}`;

  return (
    <div className="min-h-screen bg-[#F0EDFF] text-slate-800 font-sans p-2 sm:p-4 md:p-6 pb-28 select-none">
      <div className="w-full max-w-[1008px] mx-auto">
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
            className="inline-flex items-center gap-1.5 text-xs font-black text-purple-700 bg-white hover:bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200 cursor-pointer transition-colors shadow-2xs"
          >
            <span>💡</span>
            <span>Tutorial de Unidad</span>
          </button>
        </div>

        {/* ══ Unit Hero Banner ══ */}
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${heroGrad} p-6 md:p-8 text-white shadow-xl mb-6`}
          style={{ boxShadow: '0 10px 30px rgba(61, 20, 104, 0.35)' }}
        >
          {/* Twinkling stars */}
          {HERO_STARS.map((star, idx) => (
            <div
              key={idx}
              className="absolute rounded-full bg-white animate-pulse pointer-events-none"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
                opacity: 0.75,
              }}
            />
          ))}

          <div className="relative z-10">
            {/* Unit Icon */}
            <div className="mb-2 inline-flex items-center justify-center">
              <UnitOperationIcon3D4to unitIndex={currentUnit} fallbackIcon={unit.icon} />
            </div>

            <h1
              className="text-2xl md:text-3xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {unitDisplayName}
            </h1>

            <p className="text-xs md:text-sm font-semibold text-white/80 mt-1">
              {unit.short || unit.name}
            </p>

            <div className="mt-3 flex items-center gap-2.5 flex-wrap">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/25 text-[11px] font-bold text-white tracking-wide">
                {unit.std || 'Pensamiento Numérico · Grado 4° · MEN Colombia'}
              </span>

              <button
                type="button"
                onClick={handleSpeakUnitHero}
                title="Escuchar unidad"
                className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-purple-800 flex items-center justify-center text-xs shadow-xs transition-transform hover:scale-105 cursor-pointer"
              >
                🔊
              </button>
            </div>
          </div>
        </div>

        {/* ══ Topics & Vertical Level Cards List ══ */}
        <div className="space-y-6">
          {(unit.topics || []).map((topic, tIdx) => {
            const topicLevels = topic.levels || [];

            return (
              <div key={tIdx} className="topics-section">
                {/* Topic Header: small uppercase title */}
                <div
                  className="flex items-center gap-2 mb-2 px-1 text-xs font-black uppercase tracking-wider text-[#6C28B4]"
                  style={{ letterSpacing: '0.08em' }}
                >
                  <span className="text-sm">{topic.icon || '📝'}</span>
                  <span style={{ fontFamily: "'Nunito', sans-serif" }}>{topic.title}</span>
                </div>

                {/* Vertical list of levels (.tc cards from HTML) */}
                <div className="grid gap-2.5">
                  {topicLevels.map((lv, lIdx) => {
                    const cfg = LEVEL_CONFIG_4TO[lIdx] || LEVEL_CONFIG_4TO[0];
                    const levelKey1 = `${topic.id}-n${lIdx + 1}`;
                    const levelKey2 = `${tIdx}-${lIdx}`;
                    const score = scores[levelKey1] ?? scores[levelKey2] ?? 0;
                    const isCompleted = score >= 50;

                    return (
                      <div
                        key={lIdx}
                        onClick={() => startLevel(currentUnit, tIdx, lIdx)}
                        className={`tc-card flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
                          isCompleted
                            ? 'border-emerald-300 bg-gradient-to-r from-emerald-50/50 to-white'
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                        style={{
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                          transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateX(5px)';
                          e.currentTarget.style.boxShadow = '0 6px 18px rgba(123, 47, 190, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateX(0)';
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.04)';
                        }}
                      >
                        {/* Left Icon (44×44px pastel badge) */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ background: cfg.bg }}
                        >
                          {isCompleted ? '✅' : cfg.orb}
                        </div>

                        {/* Middle Body */}
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-sm sm:text-base font-black text-[#180D38] leading-tight"
                            style={{ fontFamily: "'Nunito', sans-serif" }}
                          >
                            {cfg.label}
                          </div>

                          <div className="text-xs text-slate-500 font-semibold mt-0.5 truncate">
                            {topic.desc || 'Hasta centenas de mil'}
                          </div>

                          {/* 5 Indicator Dots */}
                          <div className="flex items-center gap-1 mt-1.5">
                            {[0, 1, 2, 3, 4].map((k) => {
                              const isFilled = k <= lIdx;
                              const dotColor = isFilled
                                ? LEVEL_CONFIG_4TO[k]?.color || '#16876A'
                                : '#E2E8F0';
                              return (
                                <div
                                  key={k}
                                  className="w-2 h-2 rounded-full transition-colors"
                                  style={{ background: dotColor }}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Right Arrow / Action */}
                        <div className="flex items-center gap-2.5 shrink-0 pl-2">
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

                          <span
                            className="text-xl leading-none flex items-center justify-center"
                            style={{
                              fontFamily: "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif",
                            }}
                          >
                            {isCompleted ? '✅' : '▶️'}
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
          unit={unit}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}
    </div>
  );
}

