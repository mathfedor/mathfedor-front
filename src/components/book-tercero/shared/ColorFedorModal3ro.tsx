'use client';

import React, { useState, useEffect } from 'react';

interface ColorFedorModal3roProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ColorPalette {
  id: string;
  name: string;
  icon: string;
  bg: string;
  textColor: string;
  desc: string;
}

const PALETTES: ColorPalette[] = [
  {
    id: 'blanco',
    name: 'Blanco Luz',
    icon: '⬜',
    bg: '#FFFFFF',
    textColor: '#1A0A3C',
    desc: 'Mayor brillo y claridad para estudiar de día.',
  },
  {
    id: 'negro',
    name: 'Noche Cósmica',
    icon: '⬛',
    bg: '#07091B',
    textColor: '#FFFFFF',
    desc: 'Fondo oscuro ideal para descansar la vista.',
  },
  {
    id: 'azul',
    name: 'Azul Tecnológico',
    icon: '🔵',
    bg: '#0D1B2A',
    textColor: '#00B4D8',
    desc: 'Estilo espacial con tonos azules modernos.',
  },
  {
    id: 'verde',
    name: 'Verde Laboratorio',
    icon: '🟢',
    bg: '#0C2B1D',
    textColor: '#52B788',
    desc: 'Tono calmante inspirado en la ciencia y naturaleza.',
  },
  {
    id: 'amarillo',
    name: 'Oro Galáctico',
    icon: '🟡',
    bg: '#251C06',
    textColor: '#FFD166',
    desc: 'Calidez cósmica con toques dorados de estrella.',
  },
  {
    id: 'morado',
    name: 'Morado Fedor',
    icon: '🟣',
    bg: '#180D38',
    textColor: '#C5BFEE',
    desc: 'El color clásico del traje espacial de Fedor.',
  },
];

export default function ColorFedorModal3ro({ isOpen, onClose }: ColorFedorModal3roProps) {
  const [activeBg, setActiveBg] = useState<string>('#180D38');
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fedorBg');
      if (saved) setActiveBg(saved);
    }
  }, []);

  if (!isOpen) return null;

  const handleApplyColor = (pal: ColorPalette) => {
    setActiveBg(pal.bg);
    setFeedback(`✅ Fondo cambiado a ${pal.name}`);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fedorBg', pal.bg);
        localStorage.setItem('fedorFg', pal.textColor);
      } catch {}

      const bookEl = document.querySelector('.fedor-book') as HTMLElement;
      if (bookEl) {
        bookEl.style.backgroundColor = pal.bg;
      }
      document.body.style.backgroundColor = pal.bg;
    }

    setTimeout(() => {
      setFeedback('');
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-[99995] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Shell - 640px centrado y espacioso */}
      <div
        className="w-full max-w-[640px] bg-white rounded-[26px] shadow-2xl p-6 sm:p-8 relative border border-slate-100 animate-popIn"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xs border border-white/80 shrink-0">
              <span className="text-base leading-none">🎨</span>
            </div>

            <h2 className="text-xl sm:text-[22px] font-black text-[#2A0F60] tracking-tight">
              Color de Fondo — 3°
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F0EDFF] hover:bg-[#E4D9F5] text-[#5C21A6] font-black text-lg flex items-center justify-center cursor-pointer transition-colors border-none"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#5C21A6]">
            SELECCIONA UN TEMA VISUAL:
          </div>

          {/* Grid of 6 palettes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PALETTES.map((pal) => {
              const isSelected = activeBg.toLowerCase() === pal.bg.toLowerCase();
              return (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => handleApplyColor(pal)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center text-center gap-1.5 cursor-pointer transition-all border-2 ${
                    isSelected
                      ? 'border-amber-400 shadow-lg scale-[1.03] ring-3 ring-amber-300/40'
                      : 'border-gray-200 hover:border-purple-300 hover:scale-[1.02] shadow-xs'
                  }`}
                  style={{
                    backgroundColor: pal.bg,
                    color: pal.bg === '#FFFFFF' ? '#180D38' : '#FFFFFF',
                  }}
                >
                  <div className="text-2xl leading-none">{pal.icon}</div>
                  <div className="font-black text-xs sm:text-[13px]">{pal.name}</div>
                  <div className="text-[10px] opacity-75 leading-tight line-clamp-2">
                    {pal.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className="text-center font-black text-xs text-emerald-800 bg-emerald-50 py-2.5 px-4 rounded-xl border border-emerald-200 animate-fadeIn">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
