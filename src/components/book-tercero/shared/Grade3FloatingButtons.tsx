'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook3 } from '../context/Book3Context';

interface Grade3FloatingButtonsProps {
  onOpenAiChat: () => void;
  onOpenIntro: () => void;
  onOpenDrawer: () => void;
}

const MASCOT_MESSAGES = [
  '¡Hola cadete! Soy Fedor, tu amigo astronauta. ¡Vamos a conquistar las matemáticas de 3°!',
  '¡Excelente trabajo! Con cada ejercicio sumas XP para desbloquear nuevos trajes espaciales.',
  '¿Sabías que multiplicar es sumar el mismo número varias veces? ¡Sigue adelante!',
  '¡No te rindas! Si fallas un ejercicio, en Mi Repaso puedes volver a practicarlo.',
  '¡Rumbo a las estrellas! Cada nivel resuelto te acerca al rango de Almirante.',
];

export default function Grade3FloatingButtons({
  onOpenAiChat,
  onOpenIntro,
  onOpenDrawer,
}: Grade3FloatingButtonsProps) {
  const { goScreen, dark, setDark, currentUnit, resetStudent, selectUnit } = useBook3();

  const [showTools, setShowTools] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMascotMessage, setShowMascotMessage] = useState(false);
  const [mascotText, setMascotText] = useState('');
  const [fontSizePercent, setFontSizePercent] = useState(100);
  const [musicActive, setMusicActive] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        const btn = document.getElementById('p3Fab');
        if (!btn || !btn.contains(event.target as Node)) {
          setShowTools(false);
        }
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        const btn = document.getElementById('ajFab');
        if (!btn || !btn.contains(event.target as Node)) {
          setShowSettings(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMascotClick = () => {
    const randomMsg = MASCOT_MESSAGES[Math.floor(Math.random() * MASCOT_MESSAGES.length)];
    setMascotText(randomMsg);
    setShowMascotMessage(true);
    setTimeout(() => {
      setShowMascotMessage(false);
    }, 4500);
  };

  const handleFontSize = (delta: number) => {
    setFontSizePercent((prev) => {
      const next = Math.max(80, Math.min(130, prev + delta * 10));
      document.documentElement.style.fontSize = `${(next / 100) * 16}px`;
      return next;
    });
  };

  const toggleMusic = () => {
    setMusicActive((prev) => !prev);
  };

  return (
    <>
      {/* ═════════════════════════════════════════════════════════════
          2 BOTONES IZQUIERDA (Idénticos a Imagen 1)
      ═════════════════════════════════════════════════════════════ */}
      {/* 1. Inicio (Izquierda Arriba) */}
      <button
        type="button"
        id="homeFab"
        onClick={() => goScreen('home')}
        title="Ir al Inicio"
        className="f3-fab-round"
      >
        <span className="fab-icon">🏠</span>
      </button>

      {/* 2. Mascota Fedor (Izquierda Abajo) */}
      <button
        type="button"
        id="mascotFab"
        onClick={handleMascotClick}
        title="Toca a tu mascota Fedor"
        className="f3-fab-round"
      >
        <span className="fab-icon">🐲</span>
      </button>

      {/* Globo de diálogo de la Mascota */}
      {showMascotMessage && (
        <div className="mascot-balloon">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🐲</span>
            <span className="text-purple-800 font-black text-[11px] uppercase tracking-wide">
              Fedor dice:
            </span>
          </div>
          <p className="leading-snug text-gray-700">{mascotText}</p>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          2 BOTONES DERECHA (Idénticos a Imagen 2)
      ═════════════════════════════════════════════════════════════ */}
      {/* 3. Herramientas y recursos (Derecha Arriba) */}
      <button
        type="button"
        id="p3Fab"
        onClick={() => {
          setShowTools((prev) => !prev);
          setShowSettings(false);
        }}
        title="Herramientas y recursos"
        className={`f3-fab-round ${showTools ? 'active' : ''}`}
      >
        <span id="p3FabIcon" className="fab-icon">🛠️</span>
      </button>

      {/* Popup de Herramientas (#p3Popup) */}
      {showTools && (
        <div id="p3Popup" ref={toolsRef} className="fab-popup right-tools-popup">
          <div className="popup-header">
            🛠️ Herramientas
          </div>
          <button
            type="button"
            onClick={() => {
              setShowTools(false);
              selectUnit(0);
            }}
            className="popup-item"
          >
            <span className="text-xl">🔢</span>
            <span>Tablas de Conteo</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowTools(false);
              selectUnit(2);
            }}
            className="popup-item"
          >
            <span className="text-xl">✖️</span>
            <span>Tablas de Multiplicar</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowTools(false);
              goScreen('estandares');
            }}
            className="popup-item"
          >
            <span className="text-xl">📐</span>
            <span>Estándares MEN 3°</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowTools(false);
              goScreen('definiciones');
            }}
            className="popup-item"
          >
            <span className="text-xl">📖</span>
            <span>Definiciones Fedor</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowTools(false);
              onOpenIntro();
            }}
            className="popup-item"
          >
            <span className="text-xl">🎬</span>
            <span>Intro Galáctica</span>
          </button>
        </div>
      )}

      {/* 4. Ajustes (Derecha Abajo) */}
      <button
        type="button"
        id="ajFab"
        onClick={() => {
          setShowSettings((prev) => !prev);
          setShowTools(false);
        }}
        title="Ajustes y accesibilidad"
        className={`f3-fab-round ${showSettings ? 'on' : ''}`}
      >
        <span id="ajFabIcon" className="fab-icon">⚙️</span>
      </button>

      {/* Popup de Ajustes (#ajPopup) */}
      {showSettings && (
        <div id="ajPopup" ref={settingsRef} className="fab-popup right-settings-popup">
          <div className="popup-header">
            ⚙️ Ajustes
          </div>
          <button
            type="button"
            onClick={() => {
              setShowSettings(false);
              onOpenDrawer();
            }}
            className="popup-item"
          >
            <span className="text-xl">📋</span>
            <span>Temario de Tercero</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowSettings(false);
              onOpenAiChat();
            }}
            className="popup-item"
          >
            <span className="text-xl">🤖</span>
            <span>Tutor Inteligente IA</span>
          </button>
          <button
            type="button"
            onClick={toggleMusic}
            className="popup-item justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🎵</span>
              <span>Música ambiental</span>
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${musicActive ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
              {musicActive ? 'ON' : 'OFF'}
            </span>
          </button>
          <div className="p-2 border-t border-purple-800/40 mt-1">
            <div className="text-[10px] font-bold text-gray-400 mb-1.5 flex justify-between items-center">
              <span>Tamaño de letra:</span>
              <span className="text-amber-400 font-black">{fontSizePercent}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFontSize(-1)}
                className="flex-1 py-1 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-black text-xs cursor-pointer text-center"
              >
                A -
              </button>
              <button
                type="button"
                onClick={() => handleFontSize(1)}
                className="flex-1 py-1 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-black text-xs cursor-pointer text-center"
              >
                A +
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* ═══ 4 BOTONES FLOTANTES REDONDOS (Idénticos a Imagen 1 e Imagen 2) ═══ */
        .f3-fab-round {
          position: fixed;
          z-index: 9990;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2A0F60 0%, #1A0A3C 100%);
          border: 3.5px solid #F5C518;
          box-shadow: 0 5px 20px rgba(44, 16, 112, 0.75), 0 0 14px rgba(245, 197, 24, 0.45);
          cursor: pointer;
          user-select: none;
          font-size: 26px;
          color: #ffffff;
          animation: f3FabGlow 2.4s ease-in-out infinite;
          transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s;
        }

        .fab-icon {
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .f3-fab-round:hover {
          transform: scale(1.12);
          box-shadow: 0 6px 24px rgba(44, 16, 112, 0.85), 0 0 20px rgba(245, 197, 24, 0.7);
          border-color: #FFD700;
        }

        .f3-fab-round:active {
          transform: scale(0.94);
        }

        /* 1. Inicio: Izquierda Arriba (Imagen 1) - Desplazado a la derecha del Sidebar (64px) */
        #homeFab {
          left: 88px;
          top: 92px;
          animation-delay: 0.5s;
        }

        /* 2. Mascota: Izquierda Abajo (Imagen 1) - Desplazado a la derecha del Sidebar (64px) */
        #mascotFab {
          left: 88px;
          top: 164px;
          animation-delay: 1s;
        }

        /* 3. Herramientas: Derecha Arriba (Imagen 2) */
        #p3Fab {
          right: 18px;
          top: 92px;
        }
        #p3Fab.active {
          transform: scale(1.06);
          border-color: #FFE066;
        }

        /* 4. Ajustes: Derecha Abajo (Imagen 2) */
        #ajFab {
          right: 18px;
          top: 164px;
        }
        #ajFab.on {
          transform: rotate(35deg) scale(1.05);
        }

        @keyframes f3FabGlow {
          0%, 100% {
            box-shadow: 0 4px 18px rgba(44, 16, 112, 0.7), 0 0 0 0 rgba(245, 197, 24, 0);
          }
          50% {
            box-shadow: 0 4px 18px rgba(44, 16, 112, 0.7), 0 0 14px 4px rgba(245, 197, 24, 0.45);
          }
        }

        .mascot-balloon {
          position: fixed;
          left: 158px;
          top: 154px;
          width: 250px;
          max-width: calc(100vw - 180px);
          padding: 12px 14px;
          background: #FFFFFF;
          color: #180D38;
          font-size: 12px;
          font-weight: 700;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          border: 2px solid #DDD8F5;
          animation: popIn 0.25s ease;
          z-index: 9999;
          user-select: none;
        }

        .fab-popup {
          position: fixed;
          width: 210px;
          padding: 12px;
          background: #1A0B36;
          border-radius: 18px;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.55);
          border: 2px solid rgba(245, 197, 24, 0.45);
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 9999;
          animation: popIn 0.2s ease;
        }

        .right-tools-popup {
          right: 86px;
          top: 86px;
        }

        .right-settings-popup {
          right: 86px;
          top: 154px;
        }

        .popup-header {
          font-size: 11px;
          font-weight: 900;
          color: #F5C518;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 2px 6px 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .popup-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Nunito', sans-serif;
        }

        .popup-item:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(245, 197, 24, 0.5);
          transform: translateX(-2px);
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 640px) {
          .f3-fab-round {
            width: 48px;
            height: 48px;
            font-size: 22px;
            border-width: 2.5px;
          }
          #homeFab { left: 76px; top: 80px; }
          #mascotFab { left: 76px; top: 138px; }
          #p3Fab { right: 10px; top: 80px; }
          #ajFab { right: 10px; top: 138px; }
          .right-tools-popup { right: 64px; top: 76px; }
          .right-settings-popup { right: 64px; top: 132px; }
          .mascot-balloon { left: 132px; top: 132px; max-width: calc(100vw - 145px); }
        }
      `}</style>
    </>
  );
}
