'use client';

import React, { useState } from 'react';
import { useBook1 } from '../context/Book1Context';
import { fedorTTS } from '@/services/tts.service';

import HerramientasModal, { ToolOption } from '@/components/book/shared/HerramientasModal';
import ColorPickerModal from '@/components/book/shared/ColorPickerModal';
import Juegos1roModal from '@/components/book/shared/Juegos1roModal';
import Videos1roModal from '@/components/book/shared/Videos1roModal';
import ConceptosFedorModal from '@/components/book/shared/ConceptosFedorModal';
import MultiplicationTables from '@/components/book/games/MultiplicationTables';
import StatsLab from '@/components/book/games/StatsLab';
import StickerAlbumModal from '@/components/book/shared/StickerAlbumModal';
import Conteo1roModal from '@/components/book/shared/Conteo1roModal';

// ═════════════════════════════════════════════════════════════════════════════
// 12 ÍCONOS 3D VECTORIALES IDÉNTICOS A IMAGEN 1 E IMAGEN 2
// ═════════════════════════════════════════════════════════════════════════════

const HouseIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm">
    <ellipse cx="32" cy="55" rx="22" ry="5" fill="#4ADE80" />
    <rect x="21" y="16" width="6" height="12" rx="1" fill="#B45309" />
    <path d="M 18 30 L 18 50 C 18 52 19 53 21 53 L 43 53 C 45 53 46 52 46 50 L 46 30 Z" fill="#FDBA74" />
    <path d="M 18 30 L 18 50 C 18 52 19 53 21 53 L 32 53 L 32 30 Z" fill="#FB923C" opacity="0.3" />
    <path d="M 10 32 L 32 12 L 54 32 C 55 33 54 35 52 35 L 12 35 C 10 35 9 33 10 32 Z" fill="#EF4444" />
    <path d="M 32 12 L 54 32 C 55 33 54 35 52 35 L 32 35 Z" fill="#DC2626" opacity="0.3" />
    <rect x="22" y="38" width="9" height="15" rx="2" fill="#881337" />
    <circle cx="29" cy="46" r="1" fill="#FDE047" />
    <rect x="34" y="36" width="9" height="9" rx="2" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
);

const ToolboxIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm">
    <path d="M 24 20 C 24 14 40 14 40 20 L 40 24 L 24 24 Z" fill="none" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
    <rect x="12" y="22" width="40" height="30" rx="6" fill="#EC4899" />
    <rect x="12" y="22" width="40" height="12" rx="6" fill="#F43F5E" />
    <rect x="12" y="32" width="40" height="4" fill="#BE185D" />
    <rect x="27" y="30" width="10" height="8" rx="2" fill="#FACC15" />
    <circle cx="32" cy="34" r="1.5" fill="#854D0E" />
  </svg>
);

const PaletteIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm">
    <path d="M 32 10 C 18 10 10 20 10 34 C 10 46 20 54 32 54 C 38 54 44 50 44 44 C 44 40 40 38 44 34 C 47 31 54 34 54 26 C 54 16 44 10 32 10 Z" fill="#FED7AA" stroke="#FB923C" strokeWidth="1.5" />
    <ellipse cx="42" cy="44" rx="4" ry="5" fill="#E2E8F0" />
    <circle cx="22" cy="22" r="4.5" fill="#F43F5E" />
    <circle cx="34" cy="18" r="4.5" fill="#A855F7" />
    <circle cx="45" cy="24" r="4.5" fill="#3B82F6" />
    <circle cx="20" cy="34" r="4.5" fill="#FACC15" />
    <circle cx="26" cy="45" r="4.5" fill="#10B981" />
  </svg>
);

const BooksIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none">
    <rect x="15" y="20" width="10" height="24" rx="2" fill="#4ADE80" />
    <rect x="15" y="41" width="10" height="3" fill="#E2E8F0" />
    <line x1="17" y1="23" x2="17" y2="41" stroke="#22C55E" strokeWidth="1.5" />
    <rect x="27" y="16" width="10" height="28" rx="2" fill="#F43F5E" />
    <rect x="27" y="41" width="10" height="3" fill="#E2E8F0" />
    <line x1="29" y1="19" x2="29" y2="41" stroke="#BE123C" strokeWidth="1.5" />
    <rect x="39" y="22" width="10" height="22" rx="2" fill="#38BDF8" />
    <rect x="39" y="41" width="10" height="3" fill="#E2E8F0" />
    <line x1="41" y1="25" x2="41" y2="41" stroke="#0284C7" strokeWidth="1.5" />
  </svg>
);

const GamepadIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none">
    <path
      d="M 19 23 C 15 23 11 26 11 32 C 11 37 13 45 17 47 C 20 48 24 45 26 41 L 29 36 L 35 36 L 38 41 C 40 45 44 48 47 47 C 51 45 53 37 53 32 C 53 26 49 23 45 23 L 19 23 Z"
      fill="#3730A3"
    />
    <path
      d="M 20 24 C 17 24 13 27 13 32 C 13 37 14 44 18 45 C 20 46 23 43 25 40 L 28 35 L 36 35 L 39 40 C 41 43 44 46 46 45 C 50 44 51 37 51 32 C 51 27 47 24 44 24 L 20 24 Z"
      fill="#4338CA"
    />
    <rect x="18.5" y="28" width="3" height="8" rx="1" fill="#C7D2FE" />
    <rect x="16" y="30.5" width="8" height="3" rx="1" fill="#C7D2FE" />
    <ellipse cx="28" cy="33" rx="1.5" ry="1.2" fill="#1E1B4B" />
    <ellipse cx="36" cy="33" rx="1.5" ry="1.2" fill="#1E1B4B" />
    <circle cx="44" cy="28" r="1.6" fill="#EF4444" />
    <circle cx="47.5" cy="31.5" r="1.6" fill="#38BDF8" />
    <circle cx="44" cy="35" r="1.6" fill="#22C55E" />
    <circle cx="40.5" cy="31.5" r="1.6" fill="#FACC15" />
  </svg>
);

const DragonIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none">
    <path
      d="M 44 22 C 49 21 53 24 53 28 C 53 31 51 33 48 34 C 52 35 54 38 53 42 C 52 45 49 48 45 48 L 42 34 Z"
      fill="#E83D84"
    />
    <path
      d="M 42 24 C 46 23 49 25 49 28 C 49 30 47 32 45 33 C 48 34 50 37 49 40 C 48 43 45 45 42 45 Z"
      fill="#F472B6"
    />
    <path
      d="M 33 16 C 35 11 41 9 44 10 C 45 11 43 15 39 18 C 36 20 34 19 33 16 Z"
      fill="#E59A18"
    />
    <path
      d="M 35 15 C 36 12 40 10 42 11 C 43 12 41 14 39 17 Z"
      fill="#FBBF24"
    />
    <path
      d="M 23 19 C 22 15 19 11 15 10 C 10 9 10 14 14 15 C 18 16 19 13 17 12 C 16 11 14 12 14 13 C 14 14 15 14 15 13 C 14 12 13 12 13 14 C 13 16 17 15 18 14 C 20 12 18 9 13 10 C 9 11 8 16 13 19 C 17 21 21 21 23 19 Z"
      fill="#D97706"
    />
    <path
      d="M 14 27 C 14 24 17 21 21 21 L 37 21 C 42 21 45 24 45 29 L 45 35 C 45 42 40 48 32 48 L 24 48 C 19 48 16 45 16 41 C 16 39 17 38 19 38 L 26 38 C 28 38 28 37 28 36 C 28 35 27 34 26 34 L 16 34 C 13 34 11 31 11 29 C 11 27 12 27 14 27 Z"
      fill="#10B981"
    />
    <ellipse cx="14" cy="30" rx="1.5" ry="2.2" fill="#047857" />
    <ellipse cx="28" cy="29" rx="2.5" ry="4" fill="#1E1B4B" />
    <ellipse cx="27.6" cy="27.8" rx="0.9" ry="1.4" fill="#FFFFFF" />
    <path
      d="M 24 48 C 27 48 30 47 32 46 C 29 45 27 44 24 42 C 23 45 23 47 24 48 Z"
      fill="#FDE047"
    />
  </svg>
);

const SpeakerIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm">
    <path d="M 16 26 L 24 26 L 36 16 L 36 48 L 24 38 L 16 38 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" strokeLinejoin="round" />
    <path d="M 16 26 L 24 26 L 36 16 L 36 48 L 24 38 L 16 38 Z" fill="#94A3B8" opacity="0.3" />
    <path d="M 42 24 C 45 28 45 36 42 40" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M 48 18 C 54 25 54 39 48 46" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" fill="none" />
  </svg>
);

const ClapperboardIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm">
    <rect x="14" y="26" width="36" height="26" rx="4" fill="#6B21A8" />
    <rect x="14" y="26" width="36" height="8" rx="2" fill="#581C87" />
    <g transform="rotate(-12 14 24)">
      <rect x="14" y="18" width="36" height="8" rx="2" fill="#7E22CE" />
      <polygon points="20,18 24,18 20,26 16,26" fill="#F3E8FF" />
      <polygon points="32,18 36,18 32,26 28,26" fill="#F3E8FF" />
      <polygon points="44,18 48,18 44,26 40,26" fill="#F3E8FF" />
    </g>
  </svg>
);

const MultiplyGridIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm">
    <path d="M 12 18 L 22 28 L 12 38 L 17 43 L 27 33 L 37 43 L 42 38 L 32 28 L 42 18 L 37 13 L 27 23 L 17 13 Z" fill="#7C3AED" />
    <rect x="34" y="28" width="22" height="22" rx="4" fill="#3B82F6" />
    <text x="39" y="38" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">1 2</text>
    <text x="39" y="46" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">3 4</text>
  </svg>
);

const StatsLabIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none">
    <rect x="10" y="20" width="22" height="28" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
    <line x1="10" y1="29" x2="32" y2="29" stroke="#E2E8F0" strokeWidth="1" />
    <line x1="10" y1="38" x2="32" y2="38" stroke="#E2E8F0" strokeWidth="1" />
    <rect x="12" y="27" width="5" height="21" rx="1.5" fill="#4ADE80" />
    <rect x="19" y="33" width="5" height="15" rx="1.5" fill="#F43F5E" />
    <rect x="26" y="22" width="5" height="26" rx="1.5" fill="#3B82F6" />
    <g transform="rotate(45 47 34)">
      <rect x="43" y="16" width="9" height="28" rx="4.5" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
      <rect x="41.5" y="14" width="12" height="3" rx="1.5" fill="#BAE6FD" />
      <path d="M 44 28 L 51 28 L 51 39.5 C 51 42 49.5 43.5 47.5 43.5 C 45.5 43.5 44 42 44 39.5 Z" fill="#22C55E" />
      <circle cx="46.5" cy="32" r="1" fill="#BBF7D0" />
      <circle cx="48.5" cy="36" r="1" fill="#BBF7D0" />
    </g>
  </svg>
);

const StickerAlbumIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm">
    <rect x="16" y="14" width="34" height="42" rx="4" fill="#3B0764" stroke="#581C87" strokeWidth="1.5" />
    <rect x="14" y="14" width="5" height="42" rx="2" fill="#7E22CE" />
    <text x="24" y="28" fill="#F43F5E" fontSize="9" fontWeight="bold">★ 🎴</text>
    <text x="24" y="38" fill="#FACC15" fontSize="9" fontWeight="bold">♦ 🪙</text>
    <text x="24" y="48" fill="#38BDF8" fontSize="9" fontWeight="bold">♥ 🚀</text>
  </svg>
);

const NumbersGridIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm">
    <rect x="16" y="16" width="32" height="32" rx="6" fill="#3B82F6" />
    <text x="23" y="31" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="sans-serif">1 2</text>
    <text x="23" y="43" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="sans-serif">3 4</text>
  </svg>
);

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL DE BOTONES FLOTANTES DE 1° GRADO
// ═════════════════════════════════════════════════════════════════════════════

interface Grade1FloatingButtonsProps {
  onOpenIntro?: () => void;
}

export default function Grade1FloatingButtons({ onOpenIntro }: Grade1FloatingButtonsProps = {}) {
  const { screen, goScreen, student, selectAvatar, grantReward } = useBook1();

  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [showHerramientas, setShowHerramientas] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showJuegosPicker, setShowJuegosPicker] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showConceptos, setShowConceptos] = useState(false);
  const [showTablas, setShowTablas] = useState(false);
  const [showStatsLab, setShowStatsLab] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showConteo, setShowConteo] = useState(false);

  // Ocultar solo en la pantalla 3D de galaxia
  if (screen === 'galaxy') return null;

  const handleMascotClick = () => {
    const avatars = ['🧑‍🚀', '👩‍🚀', '🦁', '🐯', '🦊', '🐸', '🦋', '🦄', '🐉', '🤖'];
    const currentAvatar = student?.avatar || '🐉';
    const currentIndex = avatars.indexOf(currentAvatar);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % avatars.length;
    const nextAvatar = avatars[nextIndex];

    selectAvatar(nextAvatar);

    const messages = [
      `¡Soy Fedor! Tu astronauta ahora es ${nextAvatar}. ¡Vamos a contar! 🚀`,
      '¡Tú puedes resolver todos los ejercicios! Sigue sumando estrellas 🌟',
      '¡Cada nivel completado te da monedas y gemas espaciales! 🪙',
      '¡Aprender matemáticas con Fedor es divertidísimo! ✨',
      `¡Nuevo astronauta ${nextAvatar} listo para despegar! 🧑‍🚀`,
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    setBubbleText(msg);
    fedorTTS.speak(msg);
    setTimeout(() => setBubbleText(null), 4500);
  };

  const handleSpeakerClick = () => {
    const msg = '¡Sonido y voz de Fedor activados! Te acompañamos en cada reto.';
    fedorTTS.speak(msg);
    setBubbleText(msg);
    setTimeout(() => setBubbleText(null), 3500);
  };

  const handleToolSelect = (opt: ToolOption) => {
    setShowHerramientas(false);
    if (opt === 'home') goScreen('home');
    else if (opt === 'videos') setShowVideos(true);
    else if (opt === 'definiciones') goScreen('definiciones');
    else if (opt === 'conceptos') setShowConceptos(true);
    else if (opt === 'tablas') setShowTablas(true);
    else if (opt === 'lab') setShowStatsLab(true);
  };

  const handleGameSelect = (gameId: 'stats' | 'tablas' | 'conteo' | 'retos') => {
    setShowJuegosPicker(false);
    if (gameId === 'stats') setShowStatsLab(true);
    else if (gameId === 'tablas') setShowTablas(true);
    else if (gameId === 'conteo') setShowConteo(true);
    else if (gameId === 'retos') goScreen('retos');
  };

  const handleColorSelect = (hex: string) => {
    setShowColorPicker(false);
    const container = document.querySelector('.book1-experience-container') as HTMLElement | null;
    if (container) {
      container.style.backgroundColor = hex;
    }
  };

  // Botones de la izquierda (Imagen 1)
  const leftButtons = [
    {
      id: 'f1-btn-home',
      label: 'Inicio',
      icon: <HouseIcon3D />,
      onClick: () => goScreen('home'),
      delay: '0s',
    },
    {
      id: 'f1-btn-tools',
      label: 'Herramientas del libro',
      icon: <ToolboxIcon3D />,
      onClick: () => setShowHerramientas(true),
      delay: '0.2s',
    },
    {
      id: 'f1-btn-palette',
      label: 'Cambiar color de fondo',
      icon: <PaletteIcon3D />,
      onClick: () => setShowColorPicker(true),
      delay: '0.4s',
    },
    {
      id: 'f1-btn-def',
      label: 'Definiciones FEDOR',
      icon: <BooksIcon3D />,
      onClick: () => goScreen('definiciones'),
      delay: '0.6s',
    },
    {
      id: 'f1-btn-games',
      label: 'Juegos Matemáticos',
      icon: <GamepadIcon3D />,
      onClick: () => setShowJuegosPicker(true),
      delay: '0.8s',
    },
    {
      id: 'f1-btn-mascot',
      label: 'Mascota Fedor',
      icon: <DragonIcon3D />,
      onClick: handleMascotClick,
      delay: '1.0s',
    },
  ];

  // Botones de la derecha (Imagen 2)
  const rightButtons = [
    {
      id: 'f1-btn-speaker',
      label: 'Sonido / Narrador',
      icon: <SpeakerIcon3D />,
      onClick: handleSpeakerClick,
      badge: null,
      delay: '0.1s',
    },
    {
      id: 'f1-btn-videos',
      label: 'Videos explicativos (290)',
      icon: <ClapperboardIcon3D />,
      onClick: () => setShowVideos(true),
      badge: '290',
      delay: '0.25s',
    },
    {
      id: 'f1-btn-concepts',
      label: 'Conceptos',
      icon: <BooksIcon3D />,
      onClick: () => setShowConceptos(true),
      badge: null,
      delay: '0.4s',
    },
    {
      id: 'f1-btn-mult',
      label: 'Tablas de multiplicar',
      icon: <MultiplyGridIcon3D />,
      onClick: () => setShowTablas(true),
      badge: null,
      delay: '0.55s',
    },
    {
      id: 'f1-btn-stats',
      label: 'Laboratorio de Estadística',
      icon: <StatsLabIcon3D />,
      onClick: () => setShowStatsLab(true),
      badge: null,
      delay: '0.7s',
    },
    {
      id: 'f1-btn-album',
      label: 'Álbum Coleccionable',
      icon: <StickerAlbumIcon3D />,
      onClick: () => setShowStickers(true),
      badge: null,
      delay: '0.85s',
    },
    {
      id: 'f1-btn-conteo',
      label: 'Conteo y Secuencias',
      icon: <NumbersGridIcon3D />,
      onClick: () => setShowConteo(true),
      badge: null,
      delay: '1.0s',
    },
  ];

  return (
    <>
      {/* Estilos CSS para animación de onda flotante e interactividad */}
      <style>{`
        @keyframes f1FloatWave {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .f1-bubble-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 55%, #EEF2F6 100%);
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12), inset 0 2px 4px rgba(255, 255, 255, 1), inset 0 -2px 4px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          position: relative;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .f1-bubble-btn:hover {
          transform: translateY(-2px) scale(1.1);
          box-shadow: 0 12px 26px rgba(0, 0, 0, 0.18), inset 0 2px 4px rgba(255, 255, 255, 1);
        }
        .f1-bubble-btn:active {
          transform: scale(0.94);
        }
        .f1-float-anim {
          animation: f1FloatWave 3.6s ease-in-out infinite;
        }
        .f1-float-anim:hover {
          animation-play-state: paused;
        }
        .f1-tooltip {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(26, 10, 60, 0.92);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          padding: 5px 10px;
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.18s ease, transform 0.18s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          z-index: 50;
          font-family: 'Nunito', sans-serif;
        }
        .f1-tooltip-left {
          left: calc(100% + 10px);
        }
        .f1-tooltip-right {
          right: calc(100% + 10px);
        }
        .f1-bubble-wrap:hover .f1-tooltip {
          opacity: 1;
        }
        @media (max-width: 640px) {
          .f1-bubble-btn {
            width: 42px;
            height: 42px;
          }
        }
      `}</style>

      {/* Globo de diálogo emergente de la Mascota */}
      {bubbleText && (
        <div
          style={{
            position: 'fixed',
            top: '40%',
            left: 'calc(64px + 72px)',
            transform: 'translateY(-50%)',
            background: '#FFFFFF',
            border: '2.5px solid #F59E0B',
            borderRadius: '18px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: 900,
            color: '#1A0A3C',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
            maxWidth: '260px',
            zIndex: 99995,
            animation: 'popIn 0.3s ease',
            fontFamily: "'Nunito', sans-serif",
            lineHeight: 1.35,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span>🐲</span>
            <span style={{ fontSize: '11px', color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Fedor dice:
            </span>
          </div>
          <div>{bubbleText}</div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          COLUMNA IZQUIERDA (Imagen 1): 6 Botones blancos tipo burbuja
          Posicionada a la derecha del Sidebar (64px) con margen de 12px: 76px
          ═════════════════════════════════════════════════════════════════════ */}
      <aside
        aria-label="Herramientas del libro - Columna izquierda"
        style={{
          position: 'fixed',
          left: 'calc(64px + 14px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
          userSelect: 'none',
        }}
      >
        {leftButtons.map((btn) => (
          <div
            key={btn.id}
            className="f1-bubble-wrap f1-float-anim"
            style={{ animationDelay: btn.delay, position: 'relative' }}
          >
            <button
              type="button"
              id={btn.id}
              onClick={btn.onClick}
              className="f1-bubble-btn"
              title={btn.label}
              aria-label={btn.label}
            >
              {btn.icon}
            </button>
            <span className="f1-tooltip f1-tooltip-left">{btn.label}</span>
          </div>
        ))}
      </aside>

      {/* ═════════════════════════════════════════════════════════════════════
          COLUMNA DERECHA (Imagen 2): 7 Botones blancos tipo burbuja
          ═════════════════════════════════════════════════════════════════════ */}
      <aside
        aria-label="Recursos didácticos - Columna derecha"
        style={{
          position: 'fixed',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
          userSelect: 'none',
        }}
      >
        {rightButtons.map((btn) => (
          <div
            key={btn.id}
            className="f1-bubble-wrap f1-float-anim"
            style={{ animationDelay: btn.delay, position: 'relative' }}
          >
            <button
              type="button"
              id={btn.id}
              onClick={btn.onClick}
              className="f1-bubble-btn"
              title={btn.label}
              aria-label={btn.label}
            >
              {btn.icon}
              {btn.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    background: '#F59E0B',
                    color: '#78350F',
                    fontSize: '10px',
                    fontWeight: 900,
                    borderRadius: '99px',
                    padding: '1px 5px',
                    border: '1.5px solid #ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    lineHeight: 1.1,
                  }}
                >
                  {btn.badge}
                </span>
              )}
            </button>
            <span className="f1-tooltip f1-tooltip-right">{btn.label}</span>
          </div>
        ))}
      </aside>

      {/* ═════════════════════════════════════════════════════════════════════
          MODALES CONECTADOS A LOS BOTONES
          ═════════════════════════════════════════════════════════════════════ */}
      <HerramientasModal
        isOpen={showHerramientas}
        onClose={() => setShowHerramientas(false)}
        onSelectOption={handleToolSelect}
      />

      <ColorPickerModal
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onSelectColor={handleColorSelect}
      />

      {showJuegosPicker && (
        <Juegos1roModal
          onClose={() => setShowJuegosPicker(false)}
          onSelectOption={handleGameSelect}
        />
      )}

      <Videos1roModal
        isOpen={showVideos}
        onClose={() => setShowVideos(false)}
      />

      {showConceptos && (
        <ConceptosFedorModal onClose={() => setShowConceptos(false)} />
      )}

      {showTablas && (
        <MultiplicationTables
          onReward={(coins) => grantReward(0, coins)}
          onClose={() => setShowTablas(false)}
        />
      )}

      {showStatsLab && (
        <StatsLab onClose={() => setShowStatsLab(false)} />
      )}

      {showStickers && (
        <StickerAlbumModal onClose={() => setShowStickers(false)} />
      )}

      {showConteo && (
        <Conteo1roModal onClose={() => setShowConteo(false)} />
      )}
    </>
  );
}
