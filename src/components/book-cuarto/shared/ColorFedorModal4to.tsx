'use client';

import React, { useEffect } from 'react';

interface ColorFedorModal4toProps {
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
    name: 'Galaxia (default)',
    bg: 'linear-gradient(135deg, #12082A 0%, #1E0F4A 40%, #0A1B40 100%)',
    txt: '#FFFFFF',
    border: '2px solid rgba(0, 0, 0, 0.25)',
  },
  {
    name: 'Blanco',
    bg: '#FFFFFF',
    txt: '#1A1033',
    border: '2px solid rgba(0, 0, 0, 0.2)',
  },
  {
    name: 'Azul claro',
    bg: '#E8F4FD',
    txt: '#1A1033',
    border: '2px solid rgba(0, 0, 0, 0.2)',
  },
  {
    name: 'Verde claro',
    bg: '#E8F5E9',
    txt: '#1A1033',
    border: '2px solid rgba(0, 0, 0, 0.2)',
  },
  {
    name: 'Rosa pastel',
    bg: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)',
    txt: '#1A1033',
    border: '2px solid rgba(0, 0, 0, 0.2)',
  },
  {
    name: 'Negro',
    bg: '#000000',
    txt: '#FFFFFF',
    border: '2px solid #000000',
  },
];

export default function ColorFedorModal4to({ isOpen, onClose }: ColorFedorModal4toProps) {
  // Escuchar tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApplyColor = (color: ColorOption) => {
    try {
      if (typeof window !== 'undefined') {
        // 1. Guardar en localStorage
        localStorage.setItem('fedor4_bg', color.bg);
        localStorage.setItem('fedor4_bg_name', color.name);

        // 2. Aplicar a document.body y contenedor principal
        document.body.style.background = color.bg;
        document.body.style.minHeight = '100vh';

        const bookEl = document.querySelector('.fedor-book') as HTMLElement;
        if (bookEl) {
          bookEl.style.background = color.bg;
        }

        // 3. Notificar evento personalizado
        window.dispatchEvent(
          new CustomEvent('fedor4:color-changed', {
            detail: { bg: color.bg, name: color.name },
          })
        );

        // 4. Mostrar toast idéntico al sistema original
        const existingToast = document.getElementById('fedor4-color-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.id = 'fedor4-color-toast';
        toast.style.cssText = `
          position: fixed;
          top: 90px;
          left: 50%;
          transform: translateX(-50%);
          background: #5C21A6;
          color: #FFFFFF;
          padding: 10px 22px;
          border-radius: 9999px;
          z-index: 999999;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 900;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
          transition: opacity 0.25s ease, transform 0.25s ease;
        `;
        toast.textContent = `✓ Fondo cambiado a: ${color.name}`;
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translate(-50%, -10px)';
          setTimeout(() => toast.remove(), 300);
        }, 2200);
      }
    } catch (err) {
      console.warn('Error applying color:', err);
    }

    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="color-modal-overlay animate-fadeIn"
    >
      <style>{`
        .color-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background-color: rgba(10, 5, 30, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          box-sizing: border-box;
        }

        .color-modal-container {
          width: 100%;
          max-width: 480px;
          background-color: #FFFFFF;
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.40);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
          box-sizing: border-box;
          padding: 24px 28px 28px;
        }

        .color-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          box-sizing: border-box;
        }

        .color-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .color-header-icon {
          font-size: 24px;
          line-height: 1;
        }

        .color-title-wrap h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 900;
          color: #2A0F60;
          font-family: 'Baloo 2', sans-serif;
          letter-spacing: 0.01em;
          line-height: 1.2;
        }

        .color-close-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #F3EEFF;
          color: #5C21A6;
          font-size: 20px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.12s ease;
          flex-shrink: 0;
          padding: 0;
          line-height: 1;
        }

        .color-close-circle:hover {
          background-color: #E9DEFF;
          transform: scale(1.06);
        }

        .color-subtitle {
          margin: 0 0 14px 0;
          font-size: 15px;
          font-weight: 800;
          color: #1A1033;
          font-family: 'Nunito', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .color-btn-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
        }

        .color-option-btn {
          width: 100%;
          padding: 15px 22px;
          border-radius: 14px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 900;
          text-align: left;
          cursor: pointer;
          box-sizing: border-box;
          transition: transform 0.12s ease, filter 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }

        .color-option-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.02);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }

        .color-option-btn:active {
          transform: scale(0.99);
        }
      `}</style>

      <div className="color-modal-container animate-popIn">
        {/* Header */}
        <div className="color-header-row">
          <div className="color-title-wrap">
            <span className="color-header-icon">🎨</span>
            <h2>Color de Fondo</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="color-close-circle"
            title="Cerrar"
            aria-label="Cerrar modal de color de fondo"
          >
            ✕
          </button>
        </div>

        {/* Subtitle */}
        <div className="color-subtitle">
          <span>🎨</span>
          <span>Elige el color de fondo:</span>
        </div>

        {/* Botones de color idénticos a la imagen de referencia */}
        <div className="color-btn-stack">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => handleApplyColor(c)}
              className="color-option-btn"
              style={{
                background: c.bg,
                color: c.txt,
                border: c.border || '2px solid rgba(0, 0, 0, 0.2)',
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
