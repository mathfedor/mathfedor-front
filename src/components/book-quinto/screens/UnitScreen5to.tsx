'use client';

import React, { useState, useEffect } from 'react';
import { useBook5 } from '../context/Book5Context';
import UnitWelcomeModal5to from '../shared/UnitWelcomeModal5to';

const LEVEL_CONFIG_5TO = [
  { label: 'Nivel 1 — Básico', orb: '🟢', color: '#16876A', bg: '#DCF5EE' },
  { label: 'Nivel 2 — Medio', orb: '🟡', color: '#BA7517', bg: '#FEF3D6' },
  { label: 'Nivel 3 — Avanzado', orb: '🔴', color: '#C94B22', bg: '#FEE8E1' },
  { label: 'Nivel 4 — Experto', orb: '🟣', color: '#C25400', bg: '#FFEBD6' },
  { label: 'Nivel 5 — Pruebas SABER', orb: '🏆', color: '#6A1B9A', bg: '#F3E8FA' },
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

  useEffect(() => {
    setShowWelcomeModal(true);
  }, [currentUnit]);

  const unit = book?.units?.[currentUnit] || book?.units?.[0];
  if (!unit) return null;

  const heroGrad = UNIT_HERO_GRADIENTS_5TO[currentUnit] || UNIT_HERO_GRADIENTS_5TO[0];

  const handleSpeakUnitHero = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Unidad ${currentUnit + 1}. ${unit.name}. ${unit.std || 'Pensamiento Numérico · Grado 5°'}.`;
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
          className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-xl bg-gradient-to-br ${heroGrad} mb-6`}
        >
          {HERO_STARS.map((s, idx) => (
            <span
              key={idx}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                animationDelay: s.delay,
                opacity: 0.7,
              }}
            />
          ))}

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-black tracking-wider uppercase backdrop-blur-xs mb-3">
                <span>🪐</span>
                <span>Unidad {currentUnit + 1} de {book?.units?.length || 20} · 5° Grado</span>
              </div>

              <h1 className="text-2xl md:text-4xl font-black font-['Baloo_2',sans-serif] leading-tight text-white drop-shadow-sm mb-2">
                {unitDisplayName}
              </h1>

              {unit.std && (
                <p className="text-xs md:text-sm text-purple-100 font-bold opacity-90 max-w-2xl leading-relaxed">
                  {unit.std}
                </p>
              )}
            </div>

            <div className="flex md:flex-col items-center gap-2 self-end md:self-auto">
              <button
                type="button"
                onClick={handleSpeakUnitHero}
                className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-xl transition-transform active:scale-95 cursor-pointer shadow-md"
                title="Escuchar título y objetivos"
              >
                🔊
              </button>
            </div>
          </div>
        </div>

        {/* ══ Topics List ══ */}
        <div className="space-y-6">
          {(unit.topics || []).map((topic: any, tIdx: number) => {
            return (
              <div
                key={topic.id || tIdx}
                className="bg-white rounded-2xl border-2 border-[#DDD8F5] p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl md:text-3xl">{topic.icon || '📘'}</span>
                  <div className="flex-1">
                    <h2 className="text-base md:text-lg font-black text-[#180D38]">
                      Tema {tIdx + 1}: {topic.title}
                    </h2>
                    {topic.desc && (
                      <p className="text-xs md:text-sm text-[#7A7299] font-semibold mt-0.5">
                        {topic.desc}
                      </p>
                    )}
                  </div>
                </div>

                {/* Levels Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {(topic.levels || []).map((lvl: any, lIdx: number) => {
                    const cfg = LEVEL_CONFIG_5TO[lIdx] || LEVEL_CONFIG_5TO[0];
                    const key = `${topic.id || `u${currentUnit}t${tIdx}`}-n${lIdx + 1}`;
                    const score = scores[key] || 0;

                    return (
                      <button
                        key={lIdx}
                        type="button"
                        onClick={() => startLevel(currentUnit, tIdx, lIdx)}
                        className="group flex flex-col justify-between p-3.5 rounded-xl border-2 transition-all text-left cursor-pointer hover:-translate-y-1 hover:shadow-md"
                        style={{
                          backgroundColor: score >= 100 ? '#DCF5EE' : '#FAF8FF',
                          borderColor: score >= 100 ? '#16876A' : '#DDD8F5',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">{cfg.orb}</span>
                          <span
                            className="text-xs font-black px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: cfg.bg,
                              color: cfg.color,
                            }}
                          >
                            {score > 0 ? `${score}%` : 'Iniciar'}
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-black text-[#180D38] group-hover:text-[#6C28B4]">
                            {cfg.label}
                          </div>
                          <div className="text-[10px] text-[#7A7299] font-bold mt-0.5">
                            {lvl.title || `${lvl.blocks?.length || 20} ejercicios`}
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[11px] font-black text-[#6C28B4] group-hover:underline">
                          <span>Comenzar</span>
                          <span>➔</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tutorial modal */}
      <UnitWelcomeModal5to
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        unitIndex={currentUnit}
      />
    </div>
  );
}
