'use client';

import React from 'react';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectColor: (colorHex: string) => void;
}

export default function ColorPickerModal({
  isOpen,
  onClose,
  onSelectColor,
}: ColorPickerModalProps) {
  if (!isOpen) return null;

  const colorOptions: Array<{
    id: string;
    line1: string;
    line2?: string;
    hex: string;
    bgClass: string;
    textClass: string;
  }> = [
    {
      id: 'negro',
      line1: 'Negro',
      hex: '#18181b',
      bgClass: 'bg-[#141414]',
      textClass: 'text-white',
    },
    {
      id: 'blanco',
      line1: 'Blanco',
      hex: '#ffffff',
      bgClass: 'bg-white',
      textClass: 'text-[#18181b]',
    },
    {
      id: 'lila',
      line1: 'Lila',
      hex: '#f3e8ff',
      bgClass: 'bg-[#EAE2FF]',
      textClass: 'text-[#3D1468]',
    },
    {
      id: 'amarillo',
      line1: 'Amarillo',
      line2: 'pastel',
      hex: '#fef9c3',
      bgClass: 'bg-[#FFF9C4]',
      textClass: 'text-[#3D1468]',
    },
    {
      id: 'verde',
      line1: 'Verde',
      line2: 'pastel',
      hex: '#dcfce7',
      bgClass: 'bg-[#DCFCE7]',
      textClass: 'text-[#14532D]',
    },
    {
      id: 'rosa',
      line1: 'Rosa',
      hex: '#fce7f3',
      bgClass: 'bg-[#FCE7F3]',
      textClass: 'text-[#831843]',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none font-nunito"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl md:max-w-2xl bg-white rounded-[40px] p-8 sm:p-12 md:p-14 shadow-[0_24px_64px_rgba(0,0,0,0.3)] animate-scale-up text-center border-2 border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Title with palette icon */}
        <div className="flex items-center justify-center gap-3 mb-10 sm:mb-12 md:mb-14">
          <span className="text-3xl sm:text-4xl" role="img" aria-label="Paleta">
            🎨
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3D1468] font-baloo tracking-tight">
            Elige un color de fondo
          </h3>
        </div>

        {/* 6 Color Cards Grid with prominent borders & spacing */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-7 mb-10 sm:mb-12 md:mb-14">
          {colorOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelectColor(opt.hex);
                onClose();
              }}
              className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-[28px] border-[4px] border-[#D1D5DB] ${opt.bgClass} ${opt.textClass} font-black text-lg sm:text-xl md:text-2xl shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[110px] sm:min-h-[130px] leading-tight text-center`}
            >
              <span>{opt.line1}</span>
              {opt.line2 && <span>{opt.line2}</span>}
            </button>
          ))}
        </div>

        {/* Prominent Close Button */}
        <div className="flex justify-center mt-6 mb-2">
          <button
            type="button"
            onClick={onClose}
            className="px-12 py-3.5 sm:px-14 sm:py-4 rounded-full bg-[#802BB1] hover:bg-[#6B21A8] text-white font-black text-lg sm:text-xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
