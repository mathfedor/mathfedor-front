'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook3 } from '../context/Book3Context';
import StatsLabModal3ro from './StatsLabModal3ro';
import TablasConteoModal3ro from './TablasConteoModal3ro';
import TablasMultModal3ro from './TablasMultModal3ro';
import ColorFedorModal3ro from './ColorFedorModal3ro';
import VideosModal3ro from './VideosModal3ro';

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
  const { goScreen, dark, setDark, selectUnit } = useBook3();

  // Floating menus state
  const [showTools, setShowTools] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMascotMessage, setShowMascotMessage] = useState(false);
  const [mascotText, setMascotText] = useState('');
  const [fontSizePercent, setFontSizePercent] = useState(100);
  const [musicActive, setMusicActive] = useState(false);

  // Modals state triggered from the 5 tools
  const [showConteoModal, setShowConteoModal] = useState(false);
  const [showMultModal, setShowMultModal] = useState(false);
  const [showStatsLabModal, setShowStatsLabModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);

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
          2 BOTONES IZQUIERDA (Inicio y Mascota Fedor)
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
          2 BOTONES DERECHA (Herramientas con Martillo y Ajustes)
      ═════════════════════════════════════════════════════════════ */}
      {/* 3. Botón Flotante con Martillo (Herramientas y Recursos) */}
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
        {/* Ícono de Martillo y Llave cruzados idéntico a la imagen */}
        <span id="p3FabIcon" className="fab-icon">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hammer (Diagonal de izquierda a derecha) */}
            <g transform="rotate(45 16 16)">
              {/* Mango del martillo */}
              <rect x="14" y="10" width="4" height="18" rx="2" fill="#BA8248" stroke="#7A4C1B" strokeWidth="1" />
              {/* Cabeza metálica */}
              <path
                d="M9 5C9 4 10 3.2 11.2 3.2H20.8C22 3.2 23 4 23 5V10.5C23 11.2 22.2 11.8 21.5 11.8H10.5C9.8 11.8 9 11.2 9 10.5V5Z"
                fill="#E2E8F0"
                stroke="#94A3B8"
                strokeWidth="1.2"
              />
              <path d="M9.5 5.5H22.5V8.5H9.5V5.5Z" fill="#CBD5E1" />
            </g>
            {/* Wrench (Diagonal de derecha a izquierda) */}
            <g transform="rotate(-45 16 16)">
              {/* Vástago de la llave */}
              <rect x="13.8" y="5.5" width="4.4" height="20" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
              {/* Boca de la llave */}
              <path
                d="M10.8 5.8C10.8 3.2 12.8 1.6 16 1.6C19.2 1.6 21.2 3.2 21.2 5.8C21.2 7 20.5 8 19.5 8.6L17.8 6.8H14.2L12.5 8.6C11.5 8 10.8 7 10.8 5.8Z"
                fill="#E2E8F0"
                stroke="#94A3B8"
                strokeWidth="1.2"
              />
              {/* Corona inferior */}
              <circle cx="16" cy="24.5" r="3.2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
              <circle cx="16" cy="24.5" r="1.4" fill="#2A0F60" />
            </g>
          </svg>
        </span>
      </button>

      {/* ══ Menú Desplegable de Herramientas (Fiel a la Imagen) ══ */}
      {showTools && (
        <div id="p3Popup" ref={toolsRef} className="fab-popup right-tools-popup animate-popIn">
          {/* Flecha indicadora dorada hacia el botón martillo */}
          <div className="popup-arrow-indicator" />

          {/* 1. Conteo */}
          <button
            type="button"
            onClick={() => {
              setShowTools(false);
              setShowConteoModal(true);
            }}
            title="Tablas de Conteo"
            className="tool-circle-btn"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#4AA3FF] to-[#2072E8] border border-white/70 shadow-xs flex flex-col items-center justify-center p-0.5 leading-none">
              <div className="grid grid-cols-2 gap-x-1.5 gap-y-0.5 text-[8.5px] font-black text-white">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
              </div>
            </div>
            <span className="tool-circle-lbl">Conteo</span>
          </button>

          {/* 2. Multiplicar */}
          <button
            type="button"
            onClick={() => {
              setShowTools(false);
              setShowMultModal(true);
            }}
            title="Tablas de Multiplicar"
            className="tool-circle-btn"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 3D Drop Shadow */}
                <path
                  d="M18.8 6.4L17.4 5L12 10.4L6.6 5L5.2 6.4L10.6 11.8L5.2 17.2L6.6 18.6L12 13.2L17.4 18.6L18.8 17.2L13.4 11.8L18.8 6.4Z"
                  fill="#431475"
                  transform="translate(0, 1.6)"
                />
                {/* 3D Foreground Purple Cross */}
                <path
                  d="M18.6 6.2L17.2 4.8L12 10L6.8 4.8L5.4 6.2L10.6 11.4L5.4 16.6L6.8 18L12 12.8L17.2 18L18.6 16.6L13.4 11.4L18.6 6.2Z"
                  fill="#B784FA"
                  stroke="#F3E8FF"
                  strokeWidth="1.2"
                />
              </svg>
            </div>
            <span className="tool-circle-lbl">Multiplicar</span>
          </button>

          {/* 3. Lab. Est. */}
          <button
            type="button"
            onClick={() => {
              setShowTools(false);
              setShowStatsLabModal(true);
            }}
            title="Laboratorio de Estadística"
            className="tool-circle-btn"
          >
            <span className="text-[23px] leading-none select-none filter drop-shadow-[0_2px_4px_rgba(0,180,216,0.3)]">
              🔬
            </span>
            <span className="tool-circle-lbl">Lab. Est.</span>
          </button>

          {/* 4. Color */}
          <button
            type="button"
            onClick={() => {
              setShowTools(false);
              setShowColorModal(true);
            }}
            title="Cambiar Color de Fondo"
            className="tool-circle-btn"
          >
            <span className="text-[23px] leading-none select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              🎨
            </span>
            <span className="tool-circle-lbl">Color</span>
          </button>

          {/* 5. Videos */}
          <button
            type="button"
            onClick={() => {
              setShowTools(false);
              setShowVideosModal(true);
            }}
            title="Videos animados por tema"
            className="tool-circle-btn"
          >
            <span className="text-[23px] leading-none select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              🎬
            </span>
            <span className="tool-circle-lbl">Videos</span>
          </button>
        </div>
      )}

      {/* 4. Botón Flotante con Engranaje (Ajustes y Accesibilidad) */}
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
        <span id="ajFabIcon" className="fab-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
              fill="rgba(255,255,255,0.18)"
            />
            <circle cx="12" cy="12" r="3" fill="#2A0F60" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        </span>
      </button>

      {/* Popup de Ajustes (#ajPopup) */}
      {showSettings && (
        <div id="ajPopup" ref={settingsRef} className="fab-popup right-settings-popup animate-popIn">
          {/* Flecha indicadora hacia el botón de ajustes */}
          <div className="popup-arrow-indicator" style={{ top: '24px' }} />

          <div className="popup-header">
            ⚙️ Ajustes Fedor 3°
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

      {/* ═════════════════════════════════════════════════════════════
          MODALES DE HERRAMIENTAS VINCULADOS AL DESPLEGABLE
      ═════════════════════════════════════════════════════════════ */}
      {/* 1. Modal Tablas de Conteo */}
      <TablasConteoModal3ro
        isOpen={showConteoModal}
        onClose={() => setShowConteoModal(false)}
        onSelectUnit={selectUnit}
      />

      {/* 2. Modal Tablas de Multiplicar */}
      <TablasMultModal3ro
        isOpen={showMultModal}
        onClose={() => setShowMultModal(false)}
        onSelectUnit={selectUnit}
      />

      {/* 3. Modal Laboratorio de Estadística */}
      <StatsLabModal3ro
        isOpen={showStatsLabModal}
        onClose={() => setShowStatsLabModal(false)}
      />

      {/* 4. Modal Color de Fondo */}
      <ColorFedorModal3ro
        isOpen={showColorModal}
        onClose={() => setShowColorModal(false)}
      />

      {/* 5. Modal Videos Educativos */}
      <VideosModal3ro
        isOpen={showVideosModal}
        onClose={() => setShowVideosModal(false)}
        onOpenIntro={onOpenIntro}
      />

      <style jsx>{`
        /* ═══ 4 BOTONES FLOTANTES REDONDOS (Estilo Fiel a la Imagen) ═══ */
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
          transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s, border-color 0.18s;
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

        /* 1. Inicio: Izquierda Arriba */
        #homeFab {
          left: 88px;
          top: 92px;
          animation-delay: 0.5s;
        }

        /* 2. Mascota: Izquierda Abajo */
        #mascotFab {
          left: 88px;
          top: 164px;
          animation-delay: 1s;
        }

        /* 3. Herramientas Martillo: Derecha Arriba */
        #p3Fab {
          right: 18px;
          top: 92px;
        }
        #p3Fab.active {
          transform: scale(1.08);
          border-color: #FFE066;
          box-shadow: 0 6px 24px rgba(44, 16, 112, 0.9), 0 0 22px rgba(245, 197, 24, 0.8);
        }

        /* 4. Ajustes Engranaje: Derecha Abajo */
        #ajFab {
          right: 18px;
          top: 164px;
        }
        #ajFab.on {
          transform: rotate(35deg) scale(1.06);
          border-color: #FFE066;
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

        /* ═══ MENÚ DESPLEGABLE DERECHA (PÍLDORA EXACTA A LA IMAGEN) ═══ */
        .fab-popup {
          position: fixed;
          z-index: 9995;
          background: linear-gradient(180deg, #180938 0%, #14072E 50%, #0F0524 100%);
          border-radius: 26px;
          border: 2px solid #C4973B;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.75), 0 0 20px rgba(196, 151, 59, 0.25);
          animation: popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Contenedor vertical de herramientas */
        .right-tools-popup {
          right: 86px;
          top: 78px;
          width: 88px;
          padding: 12px 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        /* Flecha indicadora triangular dorada hacia la derecha */
        .popup-arrow-indicator {
          position: absolute;
          right: -10px;
          top: 26px;
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 10px solid #C4973B;
          pointer-events: none;
        }

        /* Botón circular individual de herramienta */
        .tool-circle-btn {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1.2px solid rgba(255, 255, 255, 0.22);
          cursor: pointer;
          transition: transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.16s, border-color 0.16s, box-shadow 0.16s;
          color: #ffffff;
          padding: 0;
          user-select: none;
        }

        .tool-circle-btn:hover {
          transform: scale(1.08);
          background: rgba(245, 197, 24, 0.14);
          border-color: #F5C518;
          box-shadow: 0 0 14px rgba(245, 197, 24, 0.45);
        }

        .tool-circle-btn:active {
          transform: scale(0.95);
        }

        .tool-circle-lbl {
          font-size: 9.5px;
          font-weight: 900;
          color: #ffffff;
          font-family: 'Nunito', sans-serif;
          letter-spacing: 0.01em;
          margin-top: 3px;
          line-height: 1;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        }

        /* Popup de Ajustes */
        .right-settings-popup {
          right: 86px;
          top: 148px;
          width: 240px;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-radius: 24px;
        }

        .popup-header {
          font-size: 11px;
          font-weight: 900;
          color: #F5C518;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0 4px 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .popup-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          font-size: 12.5px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Nunito', sans-serif;
        }

        .popup-item:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(245, 197, 24, 0.5);
          transform: translateX(-3px);
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.88);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
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
          .right-tools-popup {
            right: 68px;
            top: 70px;
            width: 80px;
            padding: 10px 4px;
            gap: 8px;
          }
          .tool-circle-btn {
            width: 56px;
            height: 56px;
          }
          .tool-circle-lbl {
            font-size: 8.5px;
          }
          .right-settings-popup {
            right: 68px;
            top: 130px;
          }
          .mascot-balloon {
            left: 132px;
            top: 132px;
            max-width: calc(100vw - 145px);
          }
        }
      `}</style>
    </>
  );
}
