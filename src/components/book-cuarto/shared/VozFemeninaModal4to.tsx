'use client';

import React, { useState, useEffect } from 'react';

interface VozFemeninaModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VozFemeninaModal4to({ isOpen, onClose }: VozFemeninaModal4toProps) {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [voiceLabel, setVoiceLabel] = useState<string>('Google español de Estados Unidos (es-US)');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fedor4_voz_femenina');
      if (saved === 'off') {
        setIsActive(false);
      }
    } catch {}

    const detectVoice = () => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const voices = window.speechSynthesis.getVoices();
      const esVoices = voices.filter((v) => v.lang.startsWith('es'));
      const femaleVoice =
        esVoices.find((v) =>
          /female|mujer|paulina|monica|sabina|helena|laura|lucia|sofia|victoria|paloma|mia/i.test(v.name)
        ) ||
        esVoices.find((v) => /google/i.test(v.name)) ||
        esVoices[0];

      if (femaleVoice) {
        setVoiceLabel(`${femaleVoice.name} (${femaleVoice.lang})`);
      } else {
        setVoiceLabel('Google español de Estados Unidos (es-US)');
      }
    };

    detectVoice();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = detectVoice;
    }
  }, []);

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

  const speakText = (rawText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Normalizar símbolos matemáticos según las reglas pedagógicas
    const clean = rawText
      .replace(/\+/g, ' más ')
      .replace(/[−-]/g, ' menos ')
      .replace(/[×*]/g, ' por ')
      .replace(/[÷/]/g, ' dividido entre ')
      .replace(/=/g, ' es igual a ')
      .replace(/1\.200/g, 'mil doscientos')
      .replace(/1\.500/g, 'mil quinientos')
      .replace(/\s+/g, ' ')
      .trim();

    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = 'es-US';
    utter.rate = 0.92;
    utter.pitch = 1.12;

    const voices = window.speechSynthesis.getVoices();
    const esVoices = voices.filter((v) => v.lang.startsWith('es'));
    const femaleVoice =
      esVoices.find((v) =>
        /female|mujer|paulina|monica|sabina|helena|laura|lucia|sofia|victoria|paloma|mia/i.test(v.name)
      ) ||
      esVoices.find((v) => /google/i.test(v.name)) ||
      esVoices[0];

    if (femaleVoice) {
      utter.voice = femaleVoice;
      utter.lang = femaleVoice.lang;
    }

    window.speechSynthesis.speak(utter);
  };

  const handleToggle = () => {
    const next = !isActive;
    setIsActive(next);
    try {
      localStorage.setItem('fedor4_voz_femenina', next ? 'on' : 'off');
      (window as any).__f4VozFemActiva = next;
    } catch {}
    if (next) {
      speakText('Voz femenina activada.');
    }
  };

  const handleTest = () => {
    speakText('Hola. Soy la voz femenina del sistema FEDOR. 7 × 8 = 56 y 1.200 + 300 = 1.500.');
  };

  const handleReadScreen = () => {
    let textToRead = '';
    const contextEl = document.querySelector('.ex-context-txt, .ex-question, .lesson-question');
    if (contextEl && contextEl.textContent) {
      textToRead = contextEl.textContent.trim();
    } else {
      const headerTitle = document.querySelector('h1, h2, .les-name, .hero-title');
      if (headerTitle && headerTitle.textContent) {
        textToRead = headerTitle.textContent.trim();
      }
    }

    if (!textToRead) {
      textToRead = 'Elige un ejemplo o un ejercicio para escucharlo.';
    }

    speakText(textToRead);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="voz-modal-overlay animate-fadeIn"
    >
      <style>{`
        .voz-modal-overlay {
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

        .voz-modal-container {
          width: 100%;
          max-width: 530px;
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

        .voz-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
          box-sizing: border-box;
        }

        .voz-title-wrap {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          flex: 1;
          padding-right: 12px;
        }

        .voz-header-icon {
          font-size: 24px;
          line-height: 1.2;
          flex-shrink: 0;
        }

        .voz-title-wrap h2 {
          margin: 0;
          font-size: 21px;
          font-weight: 900;
          color: #2A0F60;
          font-family: 'Baloo 2', sans-serif;
          letter-spacing: 0.01em;
          line-height: 1.25;
        }

        .voz-close-circle {
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

        .voz-close-circle:hover {
          background-color: #E9DEFF;
          transform: scale(1.06);
        }

        .voz-subtitle {
          margin: 0 0 16px 0;
          font-size: 14.5px;
          font-weight: 800;
          color: #1A1033;
          font-family: 'Nunito', sans-serif;
          line-height: 1.45;
        }

        .voz-actions-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 18px;
        }

        .voz-btn-row-1 {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .voz-toggle-btn {
          padding: 13px 20px;
          border-radius: 14px;
          font-family: 'Nunito', sans-serif;
          font-size: 14.5px;
          font-weight: 900;
          color: #FFFFFF;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.12s ease, filter 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .voz-toggle-btn.active {
          background: #0FA888;
        }

        .voz-toggle-btn.inactive {
          background: linear-gradient(135deg, #94A3B8, #64748B);
        }

        .voz-toggle-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.04);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .voz-toggle-btn:active {
          transform: scale(0.98);
        }

        .voz-outline-btn {
          padding: 13px 20px;
          border-radius: 14px;
          font-family: 'Nunito', sans-serif;
          font-size: 14.5px;
          font-weight: 900;
          color: #5C21A6;
          background-color: #FFFFFF;
          border: 2px solid #C4B5FD;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.12s ease, border-color 0.15s ease, background-color 0.15s ease;
        }

        .voz-outline-btn:hover {
          background-color: #FAF8FF;
          border-color: #8B5CF6;
          transform: translateY(-1px);
        }

        .voz-outline-btn:active {
          transform: scale(0.98);
        }

        .voz-info-card {
          font-size: 12.5px;
          color: #334155;
          background-color: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 14px 18px;
          line-height: 1.55;
          box-sizing: border-box;
        }

        .voz-info-header {
          margin-bottom: 4px;
        }

        .voz-rules-title {
          font-weight: 800;
          color: #1E293B;
          margin-top: 4px;
          margin-bottom: 6px;
        }

        .voz-rules-list {
          list-style-type: disc !important;
          padding-left: 20px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .voz-rules-list li {
          color: #334155;
          font-size: 12.5px;
          line-height: 1.5;
        }
      `}</style>

      <div className="voz-modal-container animate-popIn">
        {/* Header */}
        <div className="voz-header-row">
          <div className="voz-title-wrap">
            <span className="voz-header-icon">🎙️</span>
            <h2>Módulo de sonido — Voz Femenina · Sistema FEDOR</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="voz-close-circle"
            title="Cerrar"
            aria-label="Cerrar módulo de voz femenina"
          >
            ✕
          </button>
        </div>

        {/* Subtitle */}
        <p className="voz-subtitle">
          Activa la lectura en voz femenina, clara, pausada y neutral. Lee sólo el texto solicitado: el ejemplo o el ejercicio que está en pantalla.
        </p>

        {/* Botones de acción */}
        <div className="voz-actions-grid">
          <div className="voz-btn-row-1">
            <button
              type="button"
              onClick={handleToggle}
              className={`voz-toggle-btn ${isActive ? 'active' : 'inactive'}`}
            >
              <span>🧕</span>
              <span>{isActive ? 'Voz Femenina: ACTIVADA' : 'Voz Femenina: desactivada'}</span>
            </button>

            <button
              type="button"
              onClick={handleTest}
              className="voz-outline-btn"
            >
              <span>▶</span>
              <span>Probar la voz</span>
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={handleReadScreen}
              className="voz-outline-btn"
            >
              <span>🔊</span>
              <span>Leer lo que está en pantalla</span>
            </button>
          </div>
        </div>

        {/* Tarjeta de información y reglas pedagógicas */}
        <div className="voz-info-card">
          <div className="voz-info-header">
            <b style={{ color: '#1E293B' }}>Voz en uso:</b>{' '}
            <span style={{ color: '#475569' }}>{voiceLabel}</span>
          </div>
          <div className="voz-rules-title">Reglas de producción</div>
          <ul className="voz-rules-list">
            <li>Voz femenina, tono claro, pausado y neutral, apta para estudiantes de 4° y 5°.</li>
            <li>No agrega explicaciones ni comentarios: lee sólo el texto solicitado.</li>
            <li>
              Símbolos matemáticos en palabras: «+» más · «−» menos · «×» por · «÷» dividido entre · «=» es igual a.
            </li>
            <li>Números completos, sin abreviaciones (1.200 se lee «mil doscientos»).</li>
            <li>No lee opciones de respuesta, contenido oculto, claves ni soluciones no solicitadas.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
