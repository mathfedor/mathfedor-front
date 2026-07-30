'use client';

import React, { useState } from 'react';

interface ConteoModalProps {
  onClose: () => void;
  onSelectOption?: (optionId: string) => void;
}

const RANGOS_SIMPLES = [
  { id: 'r1_5', label: 'Rango 1 a 5' },
  { id: 'r1_10', label: 'Rango 1 a 10' },
  { id: 'r1_20', label: 'Rango 1 a 20' },
  { id: 'r1_30', label: 'Rango 1 a 30' },
  { id: 'r1_40', label: 'Rango 1 a 40' },
  { id: 'r1_50', label: 'Rango 1 a 50' },
  { id: 'r1_60', label: 'Rango 1 a 60' },
  { id: 'r1_80', label: 'Rango 1 a 80' },
  { id: 'r1_100', label: 'Rango 1 a 100' },
];

const RANGOS_ESCALA = [
  { id: 'esc_2_20', label: 'Rango de 2 en 2 hasta 20' },
  { id: 'esc_5_50', label: 'Rango de 5 en 5 hasta 50' },
  { id: 'esc_10_100', label: 'Rango de 10 en 10 hasta 100' },
  { id: 'esc_20_200', label: 'Rango de 20 en 20 hasta 200' },
  { id: 'esc_50_500', label: 'Rango de 50 en 50 hasta 500' },
  { id: 'esc_100_1000', label: 'Rango de 100 en 100 hasta 1000' },
];

const CONTEO_DIRECCION = [
  { id: 'asc_1_50', label: 'Conteo Ascendente (1 → 50)', type: 'asc' },
  { id: 'desc_50_1', label: 'Conteo Descendente (50 → 1)', type: 'desc' },
];

const CONTEO_COLORES = [
  { id: 'col_20', label: 'Conteo por Colores (1 a 20)' },
  { id: 'col_patrones', label: 'Secuencias y Patrones de Colores' },
];

export default function ConteoModal({ onClose, onSelectOption }: ConteoModalProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleItemClick = (id: string) => {
    try {
      localStorage.setItem('fedor_active_conteo_range', id);
      window.dispatchEvent(new CustomEvent('fedor_conteo_range_change', { detail: id }));
    } catch (e) {
      // ignore
    }
    if (onSelectOption) {
      onSelectOption(id);
    }
    onClose();
  };

  const applyBgColor = (colorKey: string) => {
    const COLOR_MAP: Record<string, string> = {
      negro: '#18181b',
      blanco: '#ffffff',
      lila: '#f3e8ff',
      amarillo: '#fef9c3',
      verde: '#dcfce7',
      rosa: '#fce7f3',
    };
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

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[88vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative pt-6 pb-4 px-6 text-center border-b border-slate-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-600 font-black text-lg flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="bg-indigo-100 text-indigo-700 font-bold p-2 rounded-xl text-xl inline-flex items-center justify-center">
              🔢
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">
              Conteo
            </h2>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Elige un rango y practica
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 custom-scrollbar bg-white">
          {/* Section 1: Rangos simples */}
          <section>
            <div className="flex items-center gap-2 text-indigo-950 font-black text-base pb-2 mb-3 border-b-2 border-dashed border-indigo-100">
              <span className="text-lg">🎯</span>
              <span>Rangos simples</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {RANGOS_SIMPLES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className="flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl bg-gradient-to-b from-amber-50 via-amber-50/80 to-amber-100/90 border-2 border-amber-200/90 shadow-sm hover:shadow-md hover:scale-103 active:scale-97 transition-all cursor-pointer group text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500 text-white font-black text-[11px] leading-tight flex flex-col items-center justify-center shadow-sm group-hover:bg-blue-600 transition-colors">
                    <span>1 2</span>
                    <span>3 4</span>
                  </div>
                  <span className="text-xs md:text-sm font-black text-amber-950 leading-tight">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Section 2: Rangos con escala */}
          <section>
            <div className="flex items-center gap-2 text-indigo-950 font-black text-base pb-2 mb-3 border-b-2 border-dashed border-indigo-100">
              <span className="text-lg">🚀</span>
              <span>Rangos con escala</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {RANGOS_ESCALA.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className="flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl bg-gradient-to-b from-amber-50 via-amber-50/80 to-amber-100/90 border-2 border-amber-200/90 shadow-sm hover:shadow-md hover:scale-103 active:scale-97 transition-all cursor-pointer text-center"
                >
                  <span className="text-2xl leading-none drop-shadow-sm">🐸</span>
                  <span className="text-xs md:text-sm font-black text-amber-950 leading-tight">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Section 3: Conteo Ascendente / Descendente */}
          <section>
            <div className="flex items-center gap-2 text-indigo-950 font-black text-base pb-2 mb-3 border-b-2 border-dashed border-indigo-100">
              <span className="text-lg">⬆️ ⬇️</span>
              <span>Conteo Ascendente / Descendente</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONTEO_DIRECCION.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-b from-amber-50 via-amber-50/80 to-amber-100/90 border-2 border-amber-200/90 shadow-sm hover:shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500 text-white font-black text-sm flex items-center justify-center shadow-sm">
                    {item.type === 'asc' ? '⬆️' : '⬇️'}
                  </div>
                  <span className="text-xs md:text-sm font-black text-amber-950">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Section 4: Colores */}
          <section className="pb-4">
            <div className="flex items-center gap-2 text-indigo-950 font-black text-base pb-2 mb-3 border-b-2 border-dashed border-indigo-100">
              <span className="text-lg">🎨</span>
              <span>Colores</span>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowColorPicker(true)}
                className="w-full sm:w-72 py-3.5 px-6 rounded-2xl md:rounded-3xl bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 border-2 border-purple-300/80 shadow-[0_8px_20px_rgba(168,85,247,0.35),_inset_0_2px_4px_rgba(255,255,255,0.6)] flex flex-col items-center justify-center gap-1 hover:scale-102 active:scale-98 transition-all cursor-pointer text-white"
              >
                <span className="text-2xl drop-shadow-sm">🎨</span>
                <span className="text-sm md:text-base font-black tracking-wide drop-shadow-sm">
                  Cambiar Colores
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Sub-popup Color Picker */}
      {showColorPicker && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowColorPicker(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 flex flex-col items-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <div className="flex items-center justify-center gap-2 text-purple-950 font-black text-xl md:text-2xl text-center">
              <span className="text-2xl">🎨</span>
              <h2>Elige un color de fondo</h2>
            </div>

            {/* Grid of colors */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
              {/* Negro */}
              <button
                type="button"
                onClick={() => {
                  applyBgColor('negro');
                  setShowColorPicker(false);
                }}
                className="h-16 md:h-20 rounded-2xl bg-zinc-900 text-white font-black text-sm md:text-base border-2 border-zinc-800 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              >
                Negro
              </button>

              {/* Blanco */}
              <button
                type="button"
                onClick={() => {
                  applyBgColor('blanco');
                  setShowColorPicker(false);
                }}
                className="h-16 md:h-20 rounded-2xl bg-white text-zinc-900 font-black text-sm md:text-base border-2 border-zinc-200 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              >
                Blanco
              </button>

              {/* Lila */}
              <button
                type="button"
                onClick={() => {
                  applyBgColor('lila');
                  setShowColorPicker(false);
                }}
                className="h-16 md:h-20 rounded-2xl bg-purple-100 text-purple-900 font-black text-sm md:text-base border-2 border-purple-200 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              >
                Lila
              </button>

              {/* Amarillo pastel */}
              <button
                type="button"
                onClick={() => {
                  applyBgColor('amarillo');
                  setShowColorPicker(false);
                }}
                className="h-16 md:h-20 rounded-2xl bg-yellow-100 text-amber-900 font-black text-xs md:text-sm text-center px-1 border-2 border-yellow-200 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center leading-tight"
              >
                Amarillo pastel
              </button>

              {/* Verde pastel */}
              <button
                type="button"
                onClick={() => {
                  applyBgColor('verde');
                  setShowColorPicker(false);
                }}
                className="h-16 md:h-20 rounded-2xl bg-emerald-100 text-emerald-900 font-black text-xs md:text-sm text-center px-1 border-2 border-emerald-200 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center leading-tight"
              >
                Verde pastel
              </button>

              {/* Rosa */}
              <button
                type="button"
                onClick={() => {
                  applyBgColor('rosa');
                  setShowColorPicker(false);
                }}
                className="h-16 md:h-20 rounded-2xl bg-pink-100 text-pink-900 font-black text-sm md:text-base border-2 border-pink-200 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              >
                Rosa
              </button>
            </div>

            {/* Button Cerrar */}
            <button
              type="button"
              onClick={() => setShowColorPicker(false)}
              className="mt-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black px-8 py-2.5 rounded-full shadow-md text-base transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
