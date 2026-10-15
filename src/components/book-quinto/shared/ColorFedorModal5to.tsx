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
    name: 'Galaxia (default)',
    bg: 'linear-gradient(135deg, #12082A 0%, #1E0F4A 40%, #0A1B40 100%)',
    txt: '#FFFFFF',
    border: '2px solid rgba(0, 0, 0, 0.2)',
  },
  {
    name: 'Blanco',
    bg: '#FFFFFF',
    txt: '#180D38',
    border: '2px solid rgba(0, 0, 0, 0.15)',
  },
  {
    name: 'Azul claro',
    bg: '#E8F4FD',
    txt: '#180D38',
    border: '2px solid rgba(0, 0, 0, 0.12)',
  },
  {
    name: 'Verde claro',
    bg: '#E8F5E9',
    txt: '#180D38',
    border: '2px solid rgba(0, 0, 0, 0.12)',
  },
  {
    name: 'Negro',
    bg: '#000000',
    txt: '#FFFFFF',
    border: '2px solid rgba(0, 0, 0, 0.2)',
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

        // Toast feedback idéntico al libro original
        const existingToast = document.getElementById('fedor5-color-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.id = 'fedor5-color-toast';
        toast.style.cssText =
          'position:fixed;top:100px;left:50%;transform:translateX(-50%);background:#5C21A6;color:#fff;padding:10px 22px;border-radius:20px;z-index:99999;font-weight:900;box-shadow:0 4px 14px rgba(0,0,0,.3);font-family:Nunito,sans-serif;font-size:14px;transition:opacity 0.2s ease;';
        toast.textContent = '✓ Fondo cambiado a: ' + color.name;
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => toast.remove(), 250);
        }, 2000);
      }
    } catch {}

    onClose();
  };

  return (
    <div
      className="tool-modal-bg animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        .tool-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 9995;
          background: rgba(18, 8, 42, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          box-sizing: border-box;
        }

        .tool-modal {
          background: #FFFFFF;
          border-radius: 20px;
          max-width: 520px;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          padding: 22px 24px 26px;
          position: relative;
          box-shadow: 0 24px 70px rgba(20, 8, 50, 0.5);
          font-family: 'Nunito', sans-serif;
          color: #180D38;
          box-sizing: border-box;
        }

        .tm-close {
          position: absolute;
          right: 14px;
          top: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid #E4DFF5;
          background: #F7F4FF;
          color: #6C28B4;
          font-weight: 900;
          cursor: pointer;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: all 0.15s ease;
          padding: 0;
          outline: none;
        }

        .tm-close:hover {
          background: #6C28B4;
          color: #FFFFFF;
        }

        .tm-title {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: #3D1468;
          margin: 0 40px 10px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.2;
        }

        .color-btn {
          width: 100%;
          padding: 15px 20px;
          border-radius: 16px;
          font-weight: 900;
          font-size: 15px;
          font-family: 'Nunito', sans-serif;
          text-align: left;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease;
          box-sizing: border-box;
          display: block;
        }

        .color-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
          filter: brightness(1.02);
        }
      `}</style>

      <div className="tool-modal animate-popIn">
        {/* Botón Cerrar .tm-close */}
        <button
          type="button"
          onClick={onClose}
          className="tm-close"
          title="Cerrar"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Título de la modal */}
        <div className="tm-title">
          <span>🎨</span>
          <span>Color de Fondo</span>
        </div>

        {/* Subtítulo */}
        <p
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#180D38',
            margin: '0 0 14px 0',
            lineHeight: 1.4,
          }}
        >
          Elige el color de fondo del libro:
        </p>

        {/* Lista vertical de los 5 colores exactos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {COLOR_OPTIONS.map((c, i) => (
            <button
              key={i}
              type="button"
              className="color-btn"
              style={{
                background: c.bg,
                color: c.txt,
                border: c.border || 'none',
              }}
              onClick={() => handleApplyColor(c)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
