'use client';

import { useState } from 'react';
import { useBook } from '../context/BookContext';
import { fedorTTS } from '@/services/tts.service';
import MinijuegosPickerModal from './MinijuegosPickerModal';
import StatsLab from '../games/StatsLab';
import MultiplicationTables from '../games/MultiplicationTables';
import ConceptosFedorModal from './ConceptosFedorModal';
import VideosModal from './VideosModal';
import ColorPickerModal from './ColorPickerModal';
import ExplicacionModal from './ExplicacionModal';
import LoreModal from './LoreModal';
import ContenidosModal from './ContenidosModal';
import WelcomeTutorialModal from './WelcomeTutorialModal';
import Juegos2doModal from './Juegos2doModal';
import Retos2doModal from './Retos2doModal';
import ConteoModal from './ConteoModal';

// ── ÍCONOS SVG DE ALTA DEFINICIÓN PARA BOTONES DE 2° ──

const ClipboardMenuIcon = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="10" width="36" height="46" rx="7" fill="#FFFFFF" />
    <rect x="18" y="14" width="28" height="38" rx="4" fill="#F0FDF4" />
    <rect x="22" y="6" width="20" height="9" rx="3.5" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
    <circle cx="32" cy="10.5" r="2" fill="#FFFFFF" />
    <rect x="23" y="22" width="5" height="5" rx="1.5" fill="#10B981" />
    <line x1="31" y1="24.5" x2="41" y2="24.5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="23" y="31" width="5" height="5" rx="1.5" fill="#10B981" />
    <line x1="31" y1="33.5" x2="41" y2="33.5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="23" y="40" width="5" height="5" rx="1.5" fill="#10B981" />
    <line x1="31" y1="42.5" x2="38" y2="42.5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const DragonFaceIcon = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 16 32 C 16 22 24 16 36 16 C 46 16 52 24 50 34 C 48 44 38 48 28 48 C 20 48 16 42 16 32 Z" fill="#2DD4BF" />
    <path d="M 12 32 C 12 28 16 26 22 26 L 22 38 C 16 38 12 36 12 32 Z" fill="#14B8A6" />
    <path d="M 32 16 C 30 10 32 6 36 4 C 38 7 37 11 36 16 Z" fill="#FACC15" />
    <path d="M 42 18 C 42 12 46 8 50 7 C 50 11 48 15 44 19 Z" fill="#FACC15" />
    <path d="M 48 26 C 54 26 58 30 56 34 C 54 33 50 31 48 30 Z" fill="#F43F5E" />
    <path d="M 44 36 C 50 38 52 42 50 46 C 47 44 45 40 43 38 Z" fill="#F43F5E" />
    <circle cx="28" cy="28" r="3" fill="#1E293B" />
    <circle cx="27" cy="27" r="1" fill="#FFFFFF" />
    <circle cx="16" cy="31" r="1.5" fill="#0F766E" />
    <circle cx="26" cy="36" r="3" fill="#FB7185" opacity="0.6" />
  </svg>
);

const BooksStackIcon = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="14" width="34" height="9" rx="2.5" fill="#38BDF8" />
    <rect x="12" y="14" width="5" height="9" rx="1.5" fill="#0284C7" />
    <line x1="20" y1="18.5" x2="43" y2="18.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="18" y="25" width="34" height="9" rx="2.5" fill="#FB7185" />
    <rect x="15" y="25" width="5" height="9" rx="1.5" fill="#E11D48" />
    <line x1="23" y1="29.5" x2="46" y2="29.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="14" y="36" width="36" height="9" rx="2.5" fill="#34D399" />
    <rect x="11" y="36" width="5" height="9" rx="1.5" fill="#059669" />
    <line x1="19" y1="40.5" x2="44" y2="40.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GamepadIcon = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 18 20 C 13 20 8 28 10 40 C 11 46 16 50 22 47 C 27 44 29 38 32 38 C 35 38 37 44 42 47 C 48 50 53 46 54 40 C 56 28 51 20 46 20 Z"
      fill="#4F46E5"
    />
    <path
      d="M 19 22 C 15 22 11 28 12 38 C 13 43 16 46 20 44 C 24 42 26 38 29 37 C 27 31 23 23 19 22 Z"
      fill="#6366F1"
      opacity="0.6"
    />
    <rect x="18" y="27" width="8" height="3" rx="1" fill="#E0E7FF" />
    <rect x="20.5" y="24.5" width="3" height="8" rx="1" fill="#E0E7FF" />
    <circle cx="44" cy="27" r="2" fill="#F43F5E" />
    <circle cx="48" cy="31" r="2" fill="#FBBF24" />
    <circle cx="40" cy="31" r="2" fill="#10B981" />
    <circle cx="44" cy="35" r="2" fill="#38BDF8" />
  </svg>
);

const NumbersGridIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="14" width="36" height="36" rx="7" fill="#38BDF8" />
    <rect x="17" y="17" width="30" height="30" rx="5" fill="#0284C7" />
    <text x="25" y="29" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif">1 2</text>
    <text x="25" y="41" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif">3 4</text>
  </svg>
);

const ClapperboardIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const StatsLabIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Test tube angled */}
    <g transform="rotate(45 32 32)">
      <rect x="27" y="10" width="10" height="36" rx="5" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
      <rect x="25" y="8" width="14" height="4" rx="2" fill="#E2E8F0" />
      <path d="M 28 26 L 36 26 L 36 41 C 36 44 33 45 32 45 C 31 45 28 44 28 41 Z" fill="#22C55E" />
      <circle cx="31" cy="30" r="1.5" fill="#BBF7D0" />
      <circle cx="34" cy="35" r="1.5" fill="#BBF7D0" />
    </g>
  </svg>
);

const GraduationCapIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 32 14 L 10 25 L 32 36 L 54 25 Z" fill="#1E1B4B" stroke="#0F172A" strokeWidth="1.5" />
    <path d="M 18 30 L 18 43 C 18 48 46 48 46 43 L 46 30 L 32 37 Z" fill="#312E81" />
    <path d="M 50 27 L 54 36 L 52 48" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="52" cy="50" r="2.5" fill="#F43F5E" />
  </svg>
);

const ExplicacionIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="12" width="32" height="42" rx="5" fill="#CBD5E1" />
    <rect x="18" y="14" width="28" height="38" rx="4" fill="#FFFFFF" />
    <line x1="23" y1="22" x2="41" y2="22" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="23" y1="28" x2="41" y2="28" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="23" y1="34" x2="35" y2="34" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="44" y="24" width="6" height="5" rx="1.5" fill="#F43F5E" />
    <rect x="44" y="32" width="6" height="5" rx="1.5" fill="#F59E0B" />
  </svg>
);

const OpenBookIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 12 44 C 20 40 28 41 32 44 C 36 41 44 40 52 44 L 52 20 C 44 16 36 17 32 20 C 28 17 20 16 12 20 Z" fill="#38BDF8" />
    <path d="M 14 42 C 21 38 28 39 32 42 C 36 39 43 38 50 42 L 50 20 C 43 16 36 17 32 20 C 28 17 21 16 14 20 Z" fill="#FFFFFF" />
    <line x1="32" y1="20" x2="32" y2="42" stroke="#0284C7" strokeWidth="2" />
    <line x1="18" y1="26" x2="28" y2="26" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="18" y1="31" x2="28" y2="31" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="18" y1="36" x2="26" y2="36" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="36" y1="26" x2="46" y2="26" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="36" y1="31" x2="46" y2="31" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="36" y1="36" x2="44" y2="36" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FullDragonMascot = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 28 42 C 28 35 34 30 42 30 C 52 30 58 38 56 48 C 54 58 42 62 36 68 C 30 74 32 82 42 84 C 54 86 64 78 72 74 C 78 71 84 74 86 80 C 88 86 82 92 72 94 C 58 96 42 94 30 86 C 18 78 18 64 26 54 C 32 46 36 44 28 42 Z"
      fill="url(#dragonBodyGradG2)"
    />
    <path d="M 44 28 C 47 22 52 24 50 29 Z" fill="#F43F5E" />
    <path d="M 57 38 C 62 36 65 40 60 43 Z" fill="#F43F5E" />
    <path d="M 52 56 C 58 56 60 62 54 63 Z" fill="#F43F5E" />
    <path d="M 76 72 C 82 68 86 73 80 77 Z" fill="#F43F5E" />
    <path d="M 85 80 C 92 80 94 87 87 89 Z" fill="#F43F5E" />
    <path
      d="M 24 38 C 22 28 30 20 40 20 C 50 20 54 26 52 34 C 50 42 42 46 32 46 C 26 46 24 42 24 38 Z"
      fill="#2DD4BF"
    />
    <path d="M 18 36 C 18 32 22 30 28 30 L 28 40 C 22 40 18 39 18 36 Z" fill="#14B8A6" />
    <path d="M 38 20 C 36 12 40 6 46 4 C 48 8 46 14 44 20 Z" fill="#FACC15" />
    <path d="M 46 22 C 48 15 54 10 58 8 C 58 13 54 18 50 22 Z" fill="#FACC15" />
    <path d="M 22 33 C 14 30 12 24 16 22" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
    <circle cx="34" cy="30" r="3.5" fill="#1E293B" />
    <circle cx="33" cy="29" r="1.2" fill="#FFFFFF" />
    <path d="M 36 50 C 38 52 42 53 46 51" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 33 60 C 35 62 39 63 43 61" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 38 78 C 42 80 46 79 50 76" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 22 84 C 20 88 16 92 12 90 C 14 86 18 84 22 84 Z" fill="#14B8A6" />
    <path d="M 52 90 C 56 94 62 96 64 92 C 60 88 56 88 52 90 Z" fill="#14B8A6" />
    <defs>
      <linearGradient id="dragonBodyGradG2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2DD4BF" />
        <stop offset="50%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#0D9488" />
      </linearGradient>
    </defs>
  </svg>
);

interface Grade2FloatingButtonsProps {
  onOpenAiChat?: () => void;
  onOpenIntro?: () => void;
}

/**
 * Componente independiente de botones flotantes para SEGUNDO GRADO (Grado 2).
 * Presenta los 6 botones en el lado izquierdo y los 8 botones en el lado derecho.
 */
export default function Grade2FloatingButtons({ onOpenAiChat, onOpenIntro }: Grade2FloatingButtonsProps) {
  const { screen, goScreen, selectAvatar, progress, grantReward } = useBook();
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [showJuegos2do, setShowJuegos2do] = useState(false);
  const [showRetos2do, setShowRetos2do] = useState(false);
  const [showConteo, setShowConteo] = useState(false);
  const [showMinijuegos, setShowMinijuegos] = useState(false);
  const [showStatsLab, setShowStatsLab] = useState(false);
  const [showTablas, setShowTablas] = useState(false);
  const [showConceptos, setShowConceptos] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showExplicacion, setShowExplicacion] = useState(false);
  const [showLore, setShowLore] = useState(false);
  const [showContenidos, setShowContenidos] = useState(false);
  const [showAyuda, setShowAyuda] = useState(false);

  // Ocultar la botonera en lección activa o mapa galaxia 3D
  const hidden = screen === 'lesson' || screen === 'galaxy';
  if (hidden) return null;

  const handleScrollToUnits = () => {
    if (screen !== 'home') {
      goScreen('home');
    }
    setTimeout(() => {
      const units = document.querySelector(
        '#screen-home .unit-grid, #screen-home .units-container, #unitList, #screen-home .u-cards, .unit-card'
      );
      if (units) {
        units.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  const handleMascotClick = () => {
    const avatars = ['🧑‍🚀', '👩‍🚀', '🦁', '🐯', '🦊', '🐸', '🦋', '🦄', '🐉', '🤖'];
    const currentAvatar = progress?.student?.avatar || '🧑‍🚀';
    const currentIndex = avatars.indexOf(currentAvatar);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % avatars.length;
    const nextAvatar = avatars[nextIndex];

    selectAvatar(nextAvatar);

    try {
      fedorTTS.speak('¡Hola! Soy Fedor, tu compañero espacial de 2° grado. 🐲');
    } catch {
      // ignore
    }

    const messages = [
      '¡Hola! Soy Fedor, tu compañero de 2° grado. 🐲',
      '¡Excelente trabajo hoy! Sigue sumando estrellas ⭐',
      '¡Exploremos la galaxia matemática juntos! 🚀',
      '¿Tienes dudas con un ejercicio? ¡Pregúntale a la IA! 🤖',
      '¡Nuevo astronauta seleccionado! ¡A resolver retos! 🌟',
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setBubbleText(randomMsg);
    setTimeout(() => {
      setBubbleText(null);
    }, 4500);
  };

  // 8 BOTONES FLOTANTES DE LA DERECHA (Grado 2)
  const rightButtons = [
    {
      key: 'g2-r-tablas',
      label: 'Tablas de multiplicar',
      icon: <NumbersGridIcon3D />,
      onClick: () => setShowTablas(true),
      s: {
        background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
        border: '2px solid rgba(255, 255, 255, 0.45)',
        boxShadow: '0 6px 14px rgba(245, 124, 0, 0.45), inset 0 2px 2px rgba(255, 255, 255, 0.4)',
      },
      delay: '0s',
    },
    {
      key: 'g2-r-conteo',
      label: 'Módulo de conteo',
      icon: <NumbersGridIcon3D />,
      onClick: () => setShowConteo(true),
      s: {
        background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 6px 14px rgba(109, 40, 217, 0.45), inset 0 2px 2px rgba(255, 255, 255, 0.3)',
      },
      delay: '0.12s',
    },
    {
      key: 'g2-r-videos',
      label: 'Videos',
      icon: <ClapperboardIcon3D />,
      onClick: () => setShowVideos(true),
      s: {
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
        border: '2px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 6px 14px rgba(0, 0, 0, 0.15), inset 0 2px 2px rgba(255, 255, 255, 0.9)',
      },
      delay: '0.24s',
    },
    {
      key: 'g2-r-stats',
      label: 'Laboratorio estadistica',
      icon: <StatsLabIcon3D />,
      onClick: () => setShowStatsLab(true),
      s: {
        background: 'linear-gradient(135deg, #0F2B5C 0%, #0A1C3E 100%)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 6px 14px rgba(10, 28, 62, 0.55), inset 0 2px 2px rgba(255, 255, 255, 0.2)',
      },
      delay: '0.36s',
    },
    {
      key: 'g2-r-explicacion',
      label: 'Explicacion',
      icon: <GraduationCapIcon3D />,
      onClick: () => setShowExplicacion(true),
      s: {
        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        border: '2px solid rgba(255, 255, 255, 0.45)',
        boxShadow: '0 6px 14px rgba(217, 119, 6, 0.45), inset 0 2px 2px rgba(255, 255, 255, 0.4)',
      },
      delay: '0.48s',
    },
    {
      key: 'g2-r-juegos',
      label: 'Mini-juegos',
      icon: <GamepadIcon />,
      onClick: () => setShowMinijuegos(true),
      s: {
        background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 6px 14px rgba(109, 40, 217, 0.45), inset 0 2px 2px rgba(255, 255, 255, 0.3)',
      },
      delay: '0.6s',
    },
    {
      key: 'g2-r-contenidos',
      label: 'Contenidos',
      icon: <ExplicacionIcon3D />,
      onClick: () => setShowContenidos(true),
      s: {
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
        border: '2px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 6px 14px rgba(0, 0, 0, 0.15), inset 0 2px 2px rgba(255, 255, 255, 0.9)',
      },
      delay: '0.72s',
    },
    {
      key: 'g2-r-lore',
      label: 'Historia de Fedor',
      icon: <OpenBookIcon3D />,
      onClick: () => setShowLore(true),
      s: {
        background: 'linear-gradient(135deg, #1E3A8A 0%, #172554 100%)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 6px 14px rgba(23, 37, 84, 0.55), inset 0 2px 2px rgba(255, 255, 255, 0.2)',
      },
      delay: '0.84s',
    },
  ];

  return (
    <>
      <style>{`
        @keyframes fedorWaveLeft {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fedorWaveRight {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fedorMascotBob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .g2-float-btn {
          animation: fedorWaveLeft 3.8s ease-in-out infinite;
        }
        .g2-float-btn:hover {
          animation-play-state: paused;
          transform: translateY(-3px) scale(1.08);
        }
        .g2-right-btn {
          animation: fedorWaveRight 3.8s ease-in-out infinite;
        }
        .g2-right-btn:hover {
          animation-play-state: paused;
          transform: translateY(-3px) scale(1.08);
        }
        .g2-mascot-btn {
          animation: fedorMascotBob 3.2s ease-in-out infinite;
        }
        .g2-mascot-btn:hover {
          transform: scale(1.12) rotate(-3deg);
        }
      `}</style>

      {/* Globo de diálogo para Fedor */}
      {bubbleText && (
        <div
          className="fixed top-1/3 left-36 md:left-44 bg-white border-2 border-purple-400 rounded-2xl p-4 shadow-2xl z-[9999] max-w-xs animate-bounce"
          style={{ animationDuration: '3.5s' }}
        >
          <div className="text-sm font-black text-purple-950 leading-snug">{bubbleText}</div>
          {onOpenAiChat && (
            <button
              type="button"
              onClick={() => {
                setBubbleText(null);
                onOpenAiChat();
              }}
              className="mt-2.5 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black px-3.5 py-1.5 rounded-full shadow hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              <span>🤖</span> Hablar con la IA de Fedor
            </button>
          )}
        </div>
      )}

      {/* ── BOTONERA FLOTANTE IZQUIERDA (6 BOTONES DE 2° GRADO) ── */}
      <div className="fixed left-20 md:left-24 top-1/2 -translate-y-1/2 z-[9996] flex flex-col gap-3 md:gap-3.5 select-none items-center">
        {/* 1. Botón Verde - 📋 Menú de Unidades */}
        <div className="relative group g2-float-btn" style={{ animationDelay: '0s' }}>
          <button
            type="button"
            onClick={handleScrollToUnits}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl transition-all duration-200 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: '2.5px solid rgba(255, 255, 255, 0.45)',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.45), inset 0 2px 2px rgba(255, 255, 255, 0.6)',
            }}
            title="Menú de unidades"
            aria-label="Menú de unidades"
          >
            <ClipboardMenuIcon />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Menú de unidades
          </span>
        </div>

        {/* 2. Botón Morado - 🐲 Fedor · Compañero */}
        <div className="relative group g2-float-btn" style={{ animationDelay: '0.15s' }}>
          <button
            type="button"
            onClick={handleMascotClick}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl transition-all duration-200 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
              border: '2.5px solid rgba(255, 255, 255, 0.45)',
              boxShadow: '0 8px 20px rgba(124, 58, 237, 0.45), inset 0 2px 2px rgba(255, 255, 255, 0.6)',
            }}
            title="Fedor · tu compañero"
            aria-label="Fedor · tu compañero"
          >
            <DragonFaceIcon />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Fedor · tu compañero
          </span>
        </div>

        {/* 3. Botón Azul Cielo - 📚 Definiciones FEDOR */}
        <div className="relative group g2-float-btn" style={{ animationDelay: '0.3s' }}>
          <button
            type="button"
            onClick={() => goScreen('definiciones')}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl transition-all duration-200 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
              border: '2.5px solid rgba(255, 255, 255, 0.45)',
              boxShadow: '0 8px 20px rgba(2, 132, 199, 0.45), inset 0 2px 2px rgba(255, 255, 255, 0.6)',
            }}
            title="Definiciones FEDOR"
            aria-label="Definiciones FEDOR"
          >
            <BooksStackIcon />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Definiciones FEDOR
          </span>
        </div>

        {/* 4. Botón Naranja - 🎮 Panel de Juegos */}
        <div className="relative group g2-float-btn" style={{ animationDelay: '0.45s' }}>
          <button
            type="button"
            onClick={() => setShowJuegos2do(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl transition-all duration-200 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
              border: '2.5px solid rgba(255, 255, 255, 0.45)',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.45), inset 0 2px 2px rgba(255, 255, 255, 0.6)',
            }}
            title="Panel de juegos"
            aria-label="Panel de juegos"
          >
            <GamepadIcon />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Panel de juegos
          </span>
        </div>

        {/* 5. Botón Morado Píldora - ❓ Ayuda */}
        <div className="relative group g2-float-btn" style={{ animationDelay: '0.6s' }}>
          <button
            type="button"
            onClick={() => setShowAyuda(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 md:py-3 rounded-2xl transition-all duration-200 cursor-pointer shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
              border: '2.5px solid rgba(255, 255, 255, 0.45)',
              boxShadow: '0 8px 20px rgba(109, 40, 217, 0.45), inset 0 2px 2px rgba(255, 255, 255, 0.6)',
            }}
            title="Tutorial y Guía de Ayuda"
            aria-label="Tutorial y Guía de Ayuda"
          >
            <span className="text-base md:text-lg leading-none">❓</span>
            <span className="font-extrabold text-xs md:text-sm text-white pr-0.5 font-sans tracking-wide">
              Ayuda
            </span>
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Tutorial y Ayuda
          </span>
        </div>

        {/* 6. Dragón Mascota Fedor Flotante Inferior */}
        <div className="relative group g2-mascot-btn mt-2 md:mt-3">
          <button
            type="button"
            onClick={handleMascotClick}
            className="cursor-pointer transition-transform duration-200 focus:outline-none"
            title="Toca a Fedor"
            aria-label="Toca a Fedor"
          >
            <FullDragonMascot />
          </button>
          <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            ¡Hola! Soy Fedor 🐲
          </span>
        </div>
      </div>

      {/* ── BOTONERA FLOTANTE DERECHA (8 BOTONES DE 2° GRADO) ── */}
      <div className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-[9996] flex flex-col gap-2 md:gap-2.5 select-none items-center">
        {rightButtons.map((btn) => (
          <div key={btn.key} className="relative group g2-right-btn" style={{ animationDelay: btn.delay }}>
            <button
              type="button"
              onClick={btn.onClick}
              className="flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-2xl transition-all duration-200 cursor-pointer"
              style={btn.s}
              title={btn.label}
              aria-label={btn.label}
            >
              {btn.icon}
            </button>
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
              {btn.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── MODALES Y DIÁLOGOS DE SEGUNDO GRADO ── */}
      {showJuegos2do && (
        <Juegos2doModal
          onClose={() => setShowJuegos2do(false)}
          onSelectOption={(optionId) => {
            setShowJuegos2do(false);
            if (optionId === 'stats') setShowStatsLab(true);
            else if (optionId === 'tablas') setShowTablas(true);
            else if (optionId === 'conteo') goScreen('conteo');
            else if (optionId === 'retos') setShowRetos2do(true);
          }}
        />
      )}

      {showRetos2do && (
        <Retos2doModal onClose={() => setShowRetos2do(false)} />
      )}

      {showConteo && (
        <ConteoModal onClose={() => setShowConteo(false)} />
      )}

      {showMinijuegos && (
        <MinijuegosPickerModal onClose={() => setShowMinijuegos(false)} />
      )}

      {showStatsLab && (
        <StatsLab onClose={() => setShowStatsLab(false)} />
      )}

      {showTablas && (
        <MultiplicationTables
          onReward={(coins) => grantReward(0, coins)}
          onClose={() => setShowTablas(false)}
        />
      )}

      {showConceptos && (
        <ConceptosFedorModal onClose={() => setShowConceptos(false)} />
      )}

      <VideosModal
        isOpen={showVideos}
        onClose={() => setShowVideos(false)}
      />

      <ColorPickerModal
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onSelectColor={(colorHex) => {
          const target = (document.querySelector('.fedor-book') as HTMLElement) || document.body;
          if (target) target.style.backgroundColor = colorHex;
          localStorage.setItem('fedor_custom_bg', colorHex);
        }}
      />

      {showExplicacion && <ExplicacionModal onClose={() => setShowExplicacion(false)} />}
      {showLore && <LoreModal onClose={() => setShowLore(false)} />}
      {showContenidos && <ContenidosModal onClose={() => setShowContenidos(false)} />}
      {showAyuda && <WelcomeTutorialModal onClose={() => setShowAyuda(false)} />}
    </>
  );
}
