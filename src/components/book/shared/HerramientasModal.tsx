'use client';

import React from 'react';

export type ToolOption = 'home' | 'videos' | 'definiciones' | 'conceptos' | 'tablas' | 'lab';

interface HerramientasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: ToolOption) => void;
}

export default function HerramientasModal({
  isOpen,
  onClose,
  onSelectOption,
}: HerramientasModalProps) {
  if (!isOpen) return null;

  const tools: Array<{
    id: ToolOption;
    title: string;
    icon: string;
  }> = [
    { id: 'home', title: 'Inicio', icon: '🏠' },
    { id: 'videos', title: 'Videos', icon: '🎬' },
    { id: 'definiciones', title: 'Definiciones', icon: '💡' },
    { id: 'conceptos', title: 'Conceptos', icon: '📚' },
    { id: 'tablas', title: 'Tablas', icon: '📊' },
    { id: 'lab', title: 'Laboratorio', icon: '🧪' },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm md:max-w-md bg-white border-[3px] border-[#7B2FBE] rounded-[28px] p-5 md:p-6 shadow-[0_20px_50px_rgba(123,47,190,0.3)] animate-scale-up select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-black text-lg transition-transform active:scale-95 cursor-pointer"
          aria-label="Cerrar"
        >
          ×
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-2xl" role="img" aria-label="Herramientas">
            🧰
          </span>
          <h3 className="text-xl md:text-2xl font-black text-[#3D1468] tracking-wide font-baloo">
            Herramientas
          </h3>
        </div>

        {/* 6 Grid Options */}
        <div className="grid grid-cols-2 gap-3.5 md:gap-4">
          {tools.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onSelectOption(t.id);
                onClose();
              }}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#F0F4FF] hover:bg-[#E5EDFF] border-2 border-[#C5BFEE] hover:border-[#7B2FBE] shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-95 transition-all duration-200 cursor-pointer group"
            >
              <span className="text-3xl md:text-4xl mb-1.5 transition-transform group-hover:scale-110">
                {t.icon}
              </span>
              <span className="text-sm md:text-base font-bold text-[#3D1468] group-hover:text-[#7B2FBE]">
                {t.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
