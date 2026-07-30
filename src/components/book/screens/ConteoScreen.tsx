'use client';

import React, { useState, useEffect } from 'react';
import { useBook } from '../context/BookContext';
import ConteoModal from '../shared/ConteoModal';

interface RangeConfig {
  id: string;
  title: string;
  numbers: number[];
  emoji: string;
}

const RANGE_CONFIGS: Record<string, RangeConfig> = {
  // Rangos simples (calculados con la fórmula exacta de Untitled.html)
  r1_5: { id: 'r1_5', title: 'Rango 1 a 5', numbers: [1, 2, 3, 4, 5], emoji: '🌸' },
  r1_10: { id: 'r1_10', title: 'Rango 1 a 10', numbers: Array.from({ length: 10 }, (_, i) => i + 1), emoji: '🐱' },
  r1_20: { id: 'r1_20', title: 'Rango 1 a 20', numbers: Array.from({ length: 20 }, (_, i) => i + 1), emoji: '🚢' },
  r1_30: { id: 'r1_30', title: 'Rango 1 a 30', numbers: Array.from({ length: 30 }, (_, i) => i + 1), emoji: '🚀' },
  r1_40: { id: 'r1_40', title: 'Rango 1 a 40', numbers: Array.from({ length: 40 }, (_, i) => i + 1), emoji: '🐱' },
  r1_50: { id: 'r1_50', title: 'Rango 1 a 50', numbers: Array.from({ length: 50 }, (_, i) => i + 1), emoji: '🚢' },
  r1_60: { id: 'r1_60', title: 'Rango 1 a 60', numbers: Array.from({ length: 60 }, (_, i) => i + 1), emoji: '🚀' },
  r1_80: { id: 'r1_80', title: 'Rango 1 a 80', numbers: Array.from({ length: 80 }, (_, i) => i + 1), emoji: '🚢' },
  r1_100: { id: 'r1_100', title: 'Rango 1 a 100', numbers: Array.from({ length: 100 }, (_, i) => i + 1), emoji: '🐱' },

  // Rangos con escala
  esc_2_20: { id: 'esc_2_20', title: 'Rango de 2 en 2 hasta 20', numbers: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20], emoji: '🐱' },
  esc_5_50: { id: 'esc_5_50', title: 'Rango de 5 en 5 hasta 50', numbers: Array.from({ length: 10 }, (_, i) => (i + 1) * 5), emoji: '🌸' },
  esc_10_100: { id: 'esc_10_100', title: 'Rango de 10 en 10 hasta 100', numbers: Array.from({ length: 10 }, (_, i) => (i + 1) * 10), emoji: '🦄' },
  esc_20_200: { id: 'esc_20_200', title: 'Rango de 20 en 20 hasta 200', numbers: Array.from({ length: 10 }, (_, i) => (i + 1) * 20), emoji: '🐱' },
  esc_50_500: { id: 'esc_50_500', title: 'Rango de 50 en 50 hasta 500', numbers: Array.from({ length: 10 }, (_, i) => (i + 1) * 50), emoji: '🚢' },
  esc_100_1000: { id: 'esc_100_1000', title: 'Rango de 100 en 100 hasta 1000', numbers: Array.from({ length: 10 }, (_, i) => (i + 1) * 100), emoji: '🦄' },

  // Conteo Ascendente / Descendente
  asc_1_50: { id: 'asc_1_50', title: 'Conteo Ascendente (1 → 50)', numbers: Array.from({ length: 50 }, (_, i) => i + 1), emoji: '🚢' },
  desc_50_1: { id: 'desc_50_1', title: 'Conteo Descendente (50 → 1)', numbers: Array.from({ length: 50 }, (_, i) => 50 - i), emoji: '🚢' },
};

const COLOR_MAP: Record<string, string> = {
  negro: '#18181b',
  blanco: '#ffffff',
  lila: '#f3e8ff',
  amarillo: '#fef9c3',
  verde: '#dcfce7',
  rosa: '#fce7f3',
};

export default function ConteoScreen() {
  const { goScreen } = useBook();
  const [activeRangeKey, setActiveRangeKey] = useState<string>('r1_5');
  const [showMenuModal, setShowMenuModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedRange = localStorage.getItem('fedor_active_conteo_range');
      if (savedRange && RANGE_CONFIGS[savedRange]) {
        setActiveRangeKey(savedRange);
      }
    } catch (e) {
      // ignore
    }

    const handleRangeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail && RANGE_CONFIGS[customEvent.detail]) {
        setActiveRangeKey(customEvent.detail);
      }
    };

    window.addEventListener('fedor_conteo_range_change', handleRangeChange);
    return () => {
      window.removeEventListener('fedor_conteo_range_change', handleRangeChange);
    };
  }, []);

  const currentRange = RANGE_CONFIGS[activeRangeKey] || RANGE_CONFIGS.r1_5;

  const applyBgColor = (colorKey: string) => {
    const bg = COLOR_MAP[colorKey];
    if (bg) {
      const target = (document.querySelector('.fedor-book') as HTMLElement) || document.body;
      if (target) {
        target.style.backgroundColor = bg;
        target.style.transition = 'background-color 0.4s ease';
      }
      try {
        localStorage.setItem('fedor_custom_bg', bg);
      } catch (e) {
        // ignore
      }
    }
  };

  const groupSizeFor = (n: number): number => {
    if (n < 10) return 0;
    if (n <= 100 && n % 10 === 0 && n >= 20) return 10;
    if (n <= 50 && n % 5 === 0) return 5;
    if (n <= 200 && n % 20 === 0) return 20;
    if (n <= 500 && n % 50 === 0) return 50;
    if (n <= 1000 && n % 100 === 0) return 100;
    return 0;
  };

  const renderCardEmojis = (num: number, emoji: string) => {
    const gs = groupSizeFor(num);

    // 1. Grouped sub-boxes (e.g. 10 -> 2 x 5; 15 -> 3 x 5; 20 -> 2 x 10; 25 -> 5 x 5; 30 -> 3 x 10; 40 -> 4 x 10)
    if (gs > 0) {
      const numGroups = num / gs;
      return (
        <div className="w-full flex flex-wrap items-center justify-center gap-1.5 p-1">
          {Array.from({ length: numGroups }).map((_, gIdx) => {
            const groupLabel = (gIdx + 1) * gs;
            return (
              <div
                key={gIdx}
                className="bg-indigo-50/60 rounded-xl p-1.5 flex flex-col items-center justify-between border border-indigo-100/70 shadow-xs flex-1 min-w-[50px] min-h-[85px]"
              >
                <div className="flex flex-wrap items-center justify-center gap-0.5 text-sm md:text-base leading-tight">
                  {Array.from({ length: gs }).map((_, eIdx) => (
                    <span key={eIdx} className="drop-shadow-xs">{emoji}</span>
                  ))}
                </div>
                <span className="text-[10px] font-black text-indigo-400 mt-1">
                  {groupLabel}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    // 2. Individual cards (1 to 9)
    if (num <= 9) {
      let gridStyle = 'flex flex-wrap justify-center gap-1.5 text-2xl md:text-3xl';
      if (num === 4) gridStyle = 'grid grid-cols-2 gap-2 text-2xl md:text-3xl';
      else if (num === 5) gridStyle = 'grid grid-cols-3 gap-2 text-xl md:text-2xl';
      else if (num === 6) gridStyle = 'grid grid-cols-3 gap-2 text-xl md:text-2xl';
      else if (num === 7 || num === 8) gridStyle = 'grid grid-cols-4 gap-1.5 text-lg md:text-xl';
      else if (num === 9) gridStyle = 'grid grid-cols-3 gap-1.5 text-lg md:text-xl';

      return (
        <div className={`p-2 items-center justify-center text-center ${gridStyle}`}>
          {Array.from({ length: num }).map((_, idx) => (
            <span key={idx} className="drop-shadow-sm hover:scale-110 transition-transform">
              {emoji}
            </span>
          ))}
        </div>
      );
    }

    // 3. Exact count for all other numbers (11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, etc.)
    // Render ALL `num` emojis cleanly without truncation
    let fontSize = 'text-lg md:text-xl';
    if (num > 30) fontSize = 'text-xs md:text-sm';
    else if (num > 16) fontSize = 'text-sm md:text-base';

    return (
      <div className="w-full h-full flex flex-wrap items-center justify-center gap-1 p-2 leading-tight">
        {Array.from({ length: num }).map((_, idx) => (
          <span key={idx} className={`drop-shadow-xs ${fontSize}`}>
            {emoji}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-4 px-3 md:px-6 flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 px-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 mb-6">
        <button
          type="button"
          onClick={() => goScreen('home')}
          className="w-10 h-10 rounded-full bg-white shadow border border-slate-200 flex items-center justify-center text-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Inicio"
        >
          🏠
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowMenuModal(true)}
            className="bg-gradient-to-r from-[#7B2FBE] via-[#9B51E0] to-[#B983FF] hover:opacity-95 text-white font-black text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-[0_6px_18px_rgba(123,47,190,0.4)] hover:scale-103 active:scale-97 transition-all flex items-center gap-2 cursor-pointer border border-white/30"
          >
            <span className="text-base md:text-lg">↩️</span>
            <span>Regresar al menú</span>
          </button>
          <button
            type="button"
            onClick={() => goScreen('home')}
            className="bg-gradient-to-r from-[#E24B4A] via-[#F26535] to-[#FF8C2A] hover:opacity-95 text-white font-black text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-[0_6px_18px_rgba(226,75,74,0.4)] hover:scale-103 active:scale-97 transition-all flex items-center gap-2 cursor-pointer border border-white/30"
          >
            <span className="text-base md:text-lg">🚪</span>
            <span>Salir</span>
          </button>
        </div>

        <div className="w-10 h-10 rounded-full bg-white shadow border border-slate-200 flex items-center justify-center text-lg">
          🔊
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-4xl font-black text-indigo-950 tracking-tight drop-shadow-sm">
          {currentRange.title}
        </h1>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 w-full max-w-6xl mx-auto mb-8">
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {currentRange.numbers.map((num) => (
            <div
              key={num}
              className="bg-white rounded-2xl md:rounded-3xl p-4 shadow-[0_10px_25px_rgba(79,70,229,0.08)] border-2 border-indigo-100/80 flex flex-col items-center justify-between min-h-[160px] md:min-h-[190px] w-[calc(50%-10px)] sm:w-[calc(33.333%-12px)] md:w-[calc(25%-16px)] lg:w-[210px] hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="text-2xl md:text-3xl font-black text-indigo-950 pt-1">
                {num}
              </div>
              <div className="flex-1 flex items-center justify-center w-full my-2">
                {renderCardEmojis(num, currentRange.emoji)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 pb-6">
        {/* Color Palette Dots */}
        <div className="flex items-center justify-center gap-3 md:gap-3.5 my-2">
          <button
            type="button"
            onClick={() => applyBgColor('negro')}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-zinc-950 border-[3px] border-white shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Negro"
            aria-label="Color negro"
          />
          <button
            type="button"
            onClick={() => applyBgColor('blanco')}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border-[3px] border-white shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Blanco"
            aria-label="Color blanco"
          />
          <button
            type="button"
            onClick={() => applyBgColor('lila')}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#E9D5FF] border-[3px] border-white shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Lila"
            aria-label="Color lila"
          />
          <button
            type="button"
            onClick={() => applyBgColor('amarillo')}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#FEF08A] border-[3px] border-white shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Amarillo pastel"
            aria-label="Color amarillo pastel"
          />
          <button
            type="button"
            onClick={() => applyBgColor('verde')}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#BBF7D0] border-[3px] border-white shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Verde pastel"
            aria-label="Color verde pastel"
          />
          <button
            type="button"
            onClick={() => applyBgColor('rosa')}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#FBCFE8] border-[3px] border-white shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Rosa"
            aria-label="Color rosa"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3.5 my-2">
          <button
            type="button"
            onClick={() => setShowMenuModal(true)}
            className="bg-gradient-to-r from-[#7B2FBE] via-[#9B51E0] to-[#B983FF] hover:opacity-95 text-white font-black text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-[0_6px_18px_rgba(123,47,190,0.4)] hover:scale-103 active:scale-97 transition-all flex items-center gap-2 cursor-pointer border border-white/30"
          >
            <span className="text-base md:text-lg">↩️</span>
            <span>Regresar al menú</span>
          </button>
          <button
            type="button"
            onClick={() => goScreen('home')}
            className="bg-gradient-to-r from-[#E24B4A] via-[#F26535] to-[#FF8C2A] hover:opacity-95 text-white font-black text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-[0_6px_18px_rgba(226,75,74,0.4)] hover:scale-103 active:scale-97 transition-all flex items-center gap-2 cursor-pointer border border-white/30"
          >
            <span className="text-base md:text-lg">🚪</span>
            <span>Salir</span>
          </button>
        </div>
      </div>

      {/* Menu Modal picker when requested */}
      {showMenuModal && (
        <ConteoModal
          onClose={() => setShowMenuModal(false)}
          onSelectOption={(rangeId) => {
            if (RANGE_CONFIGS[rangeId]) {
              setActiveRangeKey(rangeId);
            }
          }}
        />
      )}
    </div>
  );
}
