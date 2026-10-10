'use client';

import React, { useEffect } from 'react';

interface ColorFedorModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ColorOption {
  name: string;
  bg: string;
  txt: string;
  border?: string;
}

const COLOR_OPTIONS: ColorOption[] = [
  {
    name: 'Galaxia Cósmica (Default)',
    bg: 'linear-gradient(135deg, #12082A 0%, #1E0F4A 40%, #0A1B40 100%)',
    txt: '#FFFFFF',
    border: '2px solid rgba(0, 0, 0, 0.25)',
  },
  {
    name: 'Blanco Puro',
    bg: '#FFFFFF',
    txt: '#1A1033',
    border: '2px solid rgba(0, 0, 0, 0.2)',
  },
  {
    name: 'Azul Espacial Claro',
    bg: '#E8F4FD',
    txt: '#1A1033',
    border: '2px solid rgba(0, 0, 0, 0.2)',
  },
  {
    name: 'Verde Menta Suave',
    bg: '#E8F5E9',
    txt: '#1A1033',
    border: '2px solid rgba(0, 0, 0, 0.2)',
  },
  {
    name: 'Rosa Pastel',
    bg: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)',
    txt: '#1A1033',
    border: '2px solid rgba(0, 0, 0, 0.2)',
  },
  {
    name: 'Noche Oscura',
    bg: '#0A051B',
    txt: '#FFFFFF',
    border: '2px solid #000000',
  },
];

export default function ColorFedorModal5to({ isOpen, onClose }: ColorFedorModal5toProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApplyColor = (color: ColorOption) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('fedor5_bg', color.bg);
        localStorage.setItem('fedor5_bg_name', color.name);

        document.body.style.background = color.bg;
        document.body.style.minHeight = '100vh';

        const bookEl = document.querySelector('.fedor-book-5') as HTMLElement;
        if (bookEl) {
          bookEl.style.background = color.bg;
        }

        window.dispatchEvent(
          new CustomEvent('fedor5:color-changed', {
            detail: { bg: color.bg, name: color.name },
          })
        );

        // Toast feedback
        const existingToast = document.getElementById('fedor5-color-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.id = 'fedor5-color-toast';
        toast.style.cssText = `
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #5C21A6;
          color: #FFFFFF;
          padding: 12px 20px;
          border-radius: 16px;
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 14px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          z-index: 100001;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: fadeIn 0.25s ease;
        `;
        toast.innerHTML = `<span>🎨</span><span>Fondo cambiado a "${color.name}"</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
      }
    } catch {}
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎨</span>
            <h2
              className="text-2xl font-black text-[#2A0F60]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Selector de Color del Libro (5°)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-10 h-10 rounded-full bg-[#F3EEFF] hover:bg-[#E9DEFF] text-[#5C21A6] font-black text-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-xs sm:text-sm font-bold text-gray-700">
            Elige el color de fondo para la experiencia de lectura e interacción en 5° Grado:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COLOR_OPTIONS.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyColor(c)}
                className="p-4 rounded-2xl text-center font-black text-xs shadow-xs cursor-pointer border transition-transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center min-h-[85px] gap-1"
                style={{
                  background: c.bg,
                  color: c.txt,
                  border: c.border || 'none',
                }}
              >
                <span className="text-base leading-none">✨</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          <p className="text-[11px] font-semibold text-gray-500 text-center pt-2">
            Tu preferencia se guarda en tu dispositivo y se recordará en tus próximas sesiones.
          </p>
        </div>
      </div>
    </div>
  );
}
