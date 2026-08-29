'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import { BookProvider, useBook, type BookScreen } from './context/BookContext';
import { evaluateMissions } from '@/services/missions.service';
import { authService } from '@/services/auth.service';
import { chatService } from '@/services/chat.service';
import Swal from 'sweetalert2';
import SetupScreen from './screens/SetupScreen';
import HomeScreen from './screens/HomeScreen';
import GalaxyMapScreen from './screens/GalaxyMapScreen';
import UnitScreen from './screens/UnitScreen';
import LessonScreen from './screens/LessonScreen';
import ResultsScreen from './screens/ResultsScreen';
import ReportScreen from './screens/ReportScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShopScreen from './screens/ShopScreen';
import GamesScreen from './screens/GamesScreen';
import DiaryScreen from './screens/DiaryScreen';
import FinalExamScreen from './screens/FinalExamScreen';
import EspacialScreen from './screens/EspacialScreen';
import EstandaresScreen from './screens/EstandaresScreen';
import ProblemasScreen from './screens/ProblemasScreen';
import ConteoScreen from './screens/ConteoScreen';
import RetosScreen from './screens/RetosScreen';
import DefinicionesScreen from './screens/DefinicionesScreen';
import ConceptosScreen from './screens/ConceptosScreen';
import ConceptosFedorModal from './shared/ConceptosFedorModal';
import StickerAlbumModal from './shared/StickerAlbumModal';
import ConteoModal from './shared/ConteoModal';
import HerramientasModal from './shared/HerramientasModal';
import VideosModal from './shared/VideosModal';
import ColorPickerModal from './shared/ColorPickerModal';
import ExplicacionModal from './shared/ExplicacionModal';
import LoreModal from './shared/LoreModal';
import MinijuegosPickerModal from './shared/MinijuegosPickerModal';
import Juegos1roModal from './shared/Juegos1roModal';
import ContenidosModal from './shared/ContenidosModal';
import PwaRegister from './shared/PwaRegister';
import InstallPrompt from './shared/InstallPrompt';
import BookHeader from './shared/BookHeader';
import LaunchIntro from './shared/LaunchIntro';
import StatsLab from './games/StatsLab';
import MultiplicationTables from './games/MultiplicationTables';
import { fedorTTS } from '@/services/tts.service';

const SCREENS: Record<BookScreen, ComponentType> = {
  setup: SetupScreen,
  home: HomeScreen,
  galaxy: GalaxyMapScreen,
  unit: UnitScreen,
  lesson: LessonScreen,
  results: ResultsScreen,
  report: ReportScreen,
  profile: ProfileScreen,
  shop: ShopScreen,
  games: GamesScreen,
  diary: DiaryScreen,
  examen: FinalExamScreen,
  espacial: EspacialScreen,
  estandares: EstandaresScreen,
  problemas: ProblemasScreen,
  conteo: ConteoScreen,
  retos: RetosScreen,
  definiciones: DefinicionesScreen,
  conceptos: ConceptosScreen,
};

/** Punto de entrada de la experiencia del libro (incluye el proveedor). */
export default function BookExperience({ slug }: { slug: string }) {
  return (
    <BookProvider slug={slug}>
      <BookShell />
    </BookProvider>
  );
}

/** Aplica las preferencias de tema (modo oscuro) al contenedor raíz. */
function BookShell() {
  const { book, dark, loading, screen } = useBook();
  const [showIntro, setShowIntro] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const isGrade1 = book?.slug === 'libro-1ro';
  const bookGroup = book?.slug === 'libro-1ro' ? 'Grado1' : 'Grado2';

  const prevScreenRef = useRef(screen);
  useEffect(() => {
    if (prevScreenRef.current === 'setup' && screen === 'home') {
      setShowIntro(true);
    }
    prevScreenRef.current = screen;
  }, [screen]);

  useEffect(() => {
    try {
      const savedBg = localStorage.getItem('fedor_custom_bg');
      if (savedBg) {
        const target = (document.querySelector('.fedor-book') as HTMLElement) || document.body;
        if (target) {
          target.style.backgroundColor = savedBg;
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Hide AI floating button when inside active lesson and galaxy map screens
  const showFloatingChatButton = !loading && screen !== 'lesson' && screen !== 'galaxy';

  return (
    <div className={`fedor-book${dark ? ' dark' : ''}`}>
      <PwaRegister />
      <div className="app">
        {!loading && <BookHeader onOpenIntro={() => setShowIntro(true)} />}
        <BookRouter />
      </div>
      <Grade1FloatingButtons
        onOpenAiChat={() => setShowAiChat(true)}
        onOpenIntro={() => setShowIntro(true)}
        bookGroup={bookGroup}
      />

      {showFloatingChatButton && (
        <button
          type="button"
          className="f1-aichat-btn"
          onClick={() => setShowAiChat(true)}
          title="Conversar con la IA de Fedor"
        >
          🤖
        </button>
      )}

      <AiChatSidebar 
        isOpen={showAiChat} 
        onClose={() => setShowAiChat(false)} 
        bookGroup={bookGroup} 
      />

      <InstallPrompt />
      {showIntro && <LaunchIntro onClose={() => setShowIntro(false)} />}
    </div>
  );
}

function BookRouter() {
  const { loading, screen, book } = useBook();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  const isGrade1 = book?.slug === 'libro-1ro';

  const ActiveScreen = SCREENS[screen];
  return (
    <>
      <ActiveScreen />
      {!isGrade1 && screen !== 'setup' && screen !== 'lesson' && screen !== 'galaxy' && <BottomNav />}
    </>
  );
}

function BottomNav() {
  const { screen, goScreen } = useBook();
  const items: Array<{ id: BookScreen; icon: string; label: string }> = [
    { id: 'home', icon: '🏠', label: 'Inicio' },
    { id: 'report', icon: '📊', label: 'Informe' },
    { id: 'shop', icon: '🛒', label: 'Tienda' },
    { id: 'profile', icon: '🧑‍🚀', label: 'Perfil' },
  ];
  return (
    <nav className="book-bottom-nav">
      {items.map((it) => (
        <button
          key={it.id}
          className={`bn-item${screen === it.id ? ' active' : ''}`}
          onClick={() => goScreen(it.id)}
        >
          <span className="bn-icon">{it.icon}</span>
          <span className="bn-label">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

function FloatingQuickActions() {
  const { book, progress, screen, goScreen, openGameShortcut } = useBook();
  const hidden = screen === 'setup' || screen === 'lesson' || screen === 'galaxy';

  const claimableMissions = useMemo(() => {
    if (!book || !progress) return 0;
    return evaluateMissions(book, progress).filter((m) => m.claimable).length;
  }, [book, progress]);

  if (hidden || !progress) return null;

  const openMissions = () => {
    goScreen('profile');
    window.setTimeout(() => {
      document.getElementById('book-missions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const actions = [
    {
      label: 'Tablas de Multiplicar',
      icon: '🔢',
      tone: 'orange',
      onClick: () => openGameShortcut('tablas'),
    },
    {
      label: 'Laboratorio Estadística',
      icon: '🧪',
      tone: 'teal',
      onClick: () => openGameShortcut('stats'),
    },
    {
      label: 'Historia de Fedor',
      icon: '📖',
      tone: 'purple',
      onClick: () => goScreen('diary'),
    },
    {
      label: 'Misiones Diarias',
      icon: '🎯',
      tone: 'amber',
      badge: claimableMissions,
      onClick: openMissions,
    },
    {
      label: 'Juegos',
      icon: '🎮',
      tone: 'violet',
      onClick: () => goScreen('games'),
    },
  ];

  return (
    <div className="book-quick-actions" aria-label="Accesos rápidos del libro">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className={`bqa-item ${action.tone}`}
          onClick={action.onClick}
          title={action.label}
          aria-label={action.label}
        >
          <span className="bqa-label">{action.label}</span>
          <span className="bqa-orb">
            <span className="bqa-icon">{action.icon}</span>
            {Boolean(action.badge) && <span className="bqa-badge">{action.badge}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}

const HouseIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <ellipse cx="32" cy="55" rx="22" ry="5" fill="#4ADE80" />
    <path d="M 18 30 L 18 50 C 18 52 19 53 21 53 L 43 53 C 45 53 46 52 46 50 L 46 30 Z" fill="#FDBA74" />
    <path d="M 18 30 L 18 50 C 18 52 19 53 21 53 L 32 53 L 32 30 Z" fill="#FB923C" opacity="0.3" />
    <path d="M 10 32 L 32 12 L 54 32 C 55 33 54 35 52 35 L 12 35 C 10 35 9 33 10 32 Z" fill="#EF4444" />
    <path d="M 32 12 L 54 32 C 55 33 54 35 52 35 L 32 35 Z" fill="#DC2626" opacity="0.3" />
    <rect x="27" y="38" width="10" height="15" rx="2" fill="#881337" />
    <circle cx="34" cy="46" r="1" fill="#FDE047" />
    <rect x="35" y="24" width="9" height="9" rx="2" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
);

const ToolboxIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <path d="M 24 20 C 24 14 40 14 40 20 L 40 24 L 24 24 Z" fill="none" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
    <rect x="12" y="22" width="40" height="30" rx="6" fill="#EC4899" />
    <rect x="12" y="22" width="40" height="12" rx="6" fill="#F43F5E" />
    <rect x="12" y="32" width="40" height="4" fill="#BE185D" />
    <rect x="27" y="30" width="10" height="8" rx="2" fill="#FACC15" />
    <circle cx="32" cy="34" r="1.5" fill="#854D0E" />
  </svg>
);

const PaletteIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
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
  <svg viewBox="0 0 64 64" className="w-8 h-8 md:w-9 md:h-9 drop-shadow-sm" fill="none">
    {/* Green book (left) */}
    <rect x="15" y="20" width="10" height="24" rx="2" fill="#4ADE80" />
    <rect x="15" y="41" width="10" height="3" fill="#E2E8F0" />
    <line x1="17" y1="23" x2="17" y2="41" stroke="#22C55E" strokeWidth="1.5" />

    {/* Red/Pink book (middle) */}
    <rect x="27" y="16" width="10" height="28" rx="2" fill="#F43F5E" />
    <rect x="27" y="41" width="10" height="3" fill="#E2E8F0" />
    <line x1="29" y1="19" x2="29" y2="41" stroke="#BE123C" strokeWidth="1.5" />

    {/* Blue book (right) */}
    <rect x="39" y="22" width="10" height="22" rx="2" fill="#38BDF8" />
    <rect x="39" y="41" width="10" height="3" fill="#E2E8F0" />
    <line x1="41" y1="25" x2="41" y2="41" stroke="#0284C7" strokeWidth="1.5" />
  </svg>
);

const GamepadIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 md:w-9 md:h-9 drop-shadow-sm" fill="none">
    {/* Purple gamepad body */}
    <path
      d="M 19 23 C 15 23 11 26 11 32 C 11 37 13 45 17 47 C 20 48 24 45 26 41 L 29 36 L 35 36 L 38 41 C 40 45 44 48 47 47 C 51 45 53 37 53 32 C 53 26 49 23 45 23 L 19 23 Z"
      fill="#3730A3"
    />
    <path
      d="M 20 24 C 17 24 13 27 13 32 C 13 37 14 44 18 45 C 20 46 23 43 25 40 L 28 35 L 36 35 L 39 40 C 41 43 44 46 46 45 C 50 44 51 37 51 32 C 51 27 47 24 44 24 L 20 24 Z"
      fill="#4338CA"
    />
    {/* Grip highlight */}
    <path
      d="M 14 31 C 14 35 15 41 17 43 C 18 44 20 42 22 40"
      stroke="#6366F1"
      strokeWidth="1.2"
      strokeLinecap="round"
    />

    {/* Left D-pad */}
    <rect x="18.5" y="28" width="3" height="8" rx="1" fill="#C7D2FE" />
    <rect x="16" y="30.5" width="8" height="3" rx="1" fill="#C7D2FE" />

    {/* Center subtle stick dots */}
    <ellipse cx="28" cy="33" rx="1.5" ry="1.2" fill="#1E1B4B" />
    <ellipse cx="36" cy="33" rx="1.5" ry="1.2" fill="#1E1B4B" />

    {/* 4 Action buttons */}
    <circle cx="44" cy="28" r="1.6" fill="#EF4444" />
    <circle cx="47.5" cy="31.5" r="1.6" fill="#38BDF8" />
    <circle cx="44" cy="35" r="1.6" fill="#22C55E" />
    <circle cx="40.5" cy="31.5" r="1.6" fill="#FACC15" />
  </svg>
);

const DragonIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 md:w-9 md:h-9 drop-shadow-sm" fill="none">
    {/* Pink/magenta crest/fins on the right */}
    <path
      d="M 44 22 C 49 21 53 24 53 28 C 53 31 51 33 48 34 C 52 35 54 38 53 42 C 52 45 49 48 45 48 L 42 34 Z"
      fill="#E83D84"
    />
    <path
      d="M 42 24 C 46 23 49 25 49 28 C 49 30 47 32 45 33 C 48 34 50 37 49 40 C 48 43 45 45 42 45 Z"
      fill="#F472B6"
    />

    {/* Back straight horn */}
    <path
      d="M 33 16 C 35 11 41 9 44 10 C 45 11 43 15 39 18 C 36 20 34 19 33 16 Z"
      fill="#E59A18"
    />
    <path
      d="M 35 15 C 36 12 40 10 42 11 C 43 12 41 14 39 17 Z"
      fill="#FBBF24"
    />

    {/* Yellow Curled front horn */}
    <path
      d="M 23 19 C 22 15 19 11 15 10 C 10 9 10 14 14 15 C 18 16 19 13 17 12 C 16 11 14 12 14 13 C 14 14 15 14 15 13 C 14 12 13 12 13 14 C 13 16 17 15 18 14 C 20 12 18 9 13 10 C 9 11 8 16 13 19 C 17 21 21 21 23 19 Z"
      fill="#D97706"
    />
    <path
      d="M 23 19 C 22 14 18 11 15 11 C 12 11 11 15 15 16 C 18 17 18 14 16 13 C 15 12 14 14 15 14 C 16 15 17 13 16 12 C 14 11 13 13 14 15 C 15 16 17 16 19 15 C 21 13 20 10 16 10 C 11 10 10 16 15 18 C 18 19 21 19 23 19 Z"
      fill="#F59E0B"
    />

    {/* Main Green Dragon Head */}
    <path
      d="M 14 27 C 14 24 17 21 21 21 L 37 21 C 42 21 45 24 45 29 L 45 35 C 45 42 40 48 32 48 L 24 48 C 19 48 16 45 16 41 C 16 39 17 38 19 38 L 26 38 C 28 38 28 37 28 36 C 28 35 27 34 26 34 L 16 34 C 13 34 11 31 11 29 C 11 27 12 27 14 27 Z"
      fill="#10B981"
    />

    {/* Snout highlight */}
    <path
      d="M 14 27 C 12 27 11 28 11 29 C 11 32 13 34 16 34 L 26 34 C 27 34 28 35 28 36 C 28 37 27 38 26 38 L 19 38 C 17 38 16 39 16 41 C 16 44 19 47 23 48 C 19 46 17 43 17 40 C 17 38 19 37 21 37 L 28 37 C 30 37 31 35 31 33 C 31 31 29 30 27 30 L 16 30 C 13 30 12 28 12 27 Z"
      fill="#34D399"
    />

    {/* Nostril */}
    <ellipse cx="14" cy="30" rx="1.5" ry="2.2" fill="#047857" />

    {/* Mouth / Teeth */}
    <path
      d="M 16 34 L 26 34 C 27 34 27 35 27 35.5 C 27 36 27 36.5 26 36.5 L 17 36.5 C 16 36.5 16 36 16 35.5 Z"
      fill="#064E3B"
    />
    <polygon points="17.5,34 18.8,36 20.1,34" fill="#FFFFFF" />
    <polygon points="21,34 22.3,36 23.6,34" fill="#FFFFFF" />
    <polygon points="24.5,34 25.8,36 27.1,34" fill="#FFFFFF" />

    {/* Eye */}
    <ellipse cx="28" cy="29" rx="2.5" ry="4" fill="#1E1B4B" />
    <ellipse cx="27.6" cy="27.8" rx="0.9" ry="1.4" fill="#FFFFFF" />

    {/* Throat underside / yellow-green gradient */}
    <path
      d="M 24 48 C 27 48 30 47 32 46 C 29 45 27 44 24 42 C 23 45 23 47 24 48 Z"
      fill="#FDE047"
    />
    <path
      d="M 32 46 C 37 44 40 40 41 35 C 39 36 36 37 34 39 C 33 42 32 44 32 46 Z"
      fill="#6EE7B7"
    />
  </svg>
);

const SpeakerIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <path d="M 16 26 L 24 26 L 36 16 L 36 48 L 24 38 L 16 38 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" strokeLinejoin="round" />
    <path d="M 16 26 L 24 26 L 36 16 L 36 48 L 24 38 L 16 38 Z" fill="#94A3B8" opacity="0.3" />
    <path d="M 42 24 C 45 28 45 36 42 40" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M 48 18 C 54 25 54 39 48 46" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" fill="none" />
  </svg>
);

const ClapperboardIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
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
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <path d="M 12 18 L 22 28 L 12 38 L 17 43 L 27 33 L 37 43 L 42 38 L 32 28 L 42 18 L 37 13 L 27 23 L 17 13 Z" fill="#7C3AED" />
    <rect x="34" y="28" width="22" height="22" rx="4" fill="#3B82F6" />
    <text x="39" y="38" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">1 2</text>
    <text x="39" y="46" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">3 4</text>
  </svg>
);

const StatsLabIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <rect x="12" y="28" width="6" height="22" rx="2" fill="#4ADE80" />
    <rect x="20" y="34" width="6" height="16" rx="2" fill="#F43F5E" />
    <rect x="28" y="22" width="6" height="28" rx="2" fill="#3B82F6" />
    <path d="M 40 18 L 48 18 M 42 18 L 42 42 C 42 46 46 50 50 50 C 54 50 58 46 58 42 L 58 18" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
    <path d="M 44 32 C 48 30 52 34 56 32 L 56 42 C 56 45 53 48 50 48 C 47 48 44 45 44 42 Z" fill="#4ADE80" />
  </svg>
);

const StickerAlbumIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <rect x="16" y="14" width="34" height="42" rx="4" fill="#3B0764" stroke="#581C87" strokeWidth="1.5" />
    <rect x="14" y="14" width="5" height="42" rx="2" fill="#7E22CE" />
    <text x="24" y="28" fill="#F43F5E" fontSize="9" fontWeight="bold">★ 🎴</text>
    <text x="24" y="38" fill="#FACC15" fontSize="9" fontWeight="bold">♦ 🪙</text>
    <text x="24" y="48" fill="#38BDF8" fontSize="9" fontWeight="bold">♥ 🚀</text>
  </svg>
);

const NumbersGridIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <rect x="16" y="16" width="32" height="32" rx="6" fill="#3B82F6" />
    <text x="23" y="31" fill="#FFFFFF" fontSize="12" fontWeight="black" fontFamily="sans-serif">1 2</text>
    <text x="23" y="43" fill="#FFFFFF" fontSize="12" fontWeight="black" fontFamily="sans-serif">3 4</text>
  </svg>
);

const MenuUnitsIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <rect x="14" y="12" width="36" height="42" rx="6" fill="#3B82F6" />
    <rect x="20" y="8" width="24" height="8" rx="3" fill="#60A5FA" />
    <circle cx="32" cy="12" r="2" fill="#FFFFFF" />
    <line x1="22" y1="24" x2="42" y2="24" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="22" y1="32" x2="42" y2="32" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="22" y1="40" x2="34" y2="40" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

const TutorialIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <path d="M 32 14 L 12 24 L 32 34 L 52 24 Z" fill="#8B5CF6" />
    <path d="M 18 28 L 18 42 C 18 48 46 48 46 42 L 46 28 L 32 35 Z" fill="#6D28D9" />
    <path d="M 48 27 L 54 36 L 52 48" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="52" cy="50" r="3" fill="#F59E0B" />
  </svg>
);

const ExplicacionIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <rect x="14" y="12" width="36" height="42" rx="6" fill="#F59E0B" />
    <rect x="18" y="16" width="28" height="34" rx="4" fill="#FEF3C7" />
    <line x1="23" y1="24" x2="41" y2="24" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
    <line x1="23" y1="31" x2="37" y2="31" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
    <circle cx="25" cy="38" r="2.5" fill="#D97706" />
    <circle cx="32" cy="38" r="2.5" fill="#D97706" />
    <circle cx="39" cy="38" r="2.5" fill="#D97706" />
  </svg>
);

const LoreIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <rect x="14" y="12" width="36" height="42" rx="5" fill="#7C3AED" />
    <rect x="12" y="12" width="6" height="42" rx="2" fill="#5B21B6" />
    <text x="24" y="30" fill="#FDE047" fontSize="13">🌙</text>
    <text x="36" y="44" fill="#FDE047" fontSize="11">⭐</text>
  </svg>
);

const ContenidosIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <rect x="14" y="10" width="36" height="44" rx="6" fill="#FF1D4E" />
    <rect x="18" y="14" width="28" height="36" rx="4" fill="#FFE4E9" />
    <line x1="24" y1="22" x2="40" y2="22" stroke="#A30041" strokeWidth="3" strokeLinecap="round" />
    <line x1="24" y1="30" x2="40" y2="30" stroke="#A30041" strokeWidth="3" strokeLinecap="round" />
    <line x1="24" y1="38" x2="34" y2="38" stroke="#A30041" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const ASTRONAUT_AVATARS = ['🧑‍🚀', '👩‍🚀', '🦁', '🐯', '🦊', '🐸', '🦋', '🦄', '🐉', '🤖'];

function Grade1FloatingButtons({ onOpenAiChat, onOpenIntro, bookGroup }: { onOpenAiChat?: () => void; onOpenIntro?: () => void; bookGroup?: string }) {
  const { book, screen, goScreen, openGameShortcut, grantReward, progress, selectAvatar } = useBook();
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [showJuegosPicker, setShowJuegosPicker] = useState(false);
  const [showStatsLab, setShowStatsLab] = useState(false);
  const [showTablas, setShowTablas] = useState(false);
  const [showConceptos, setShowConceptos] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showConteo, setShowConteo] = useState(false);
  const [showHerramientas, setShowHerramientas] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showExplicacion, setShowExplicacion] = useState(false);
  const [showLore, setShowLore] = useState(false);
  const [showContenidos, setShowContenidos] = useState(false);

  const hidden = screen === 'lesson' || screen === 'galaxy';
  if (hidden) return null;

  const isGrade1Internal =
    bookGroup === 'Grado1' ||
    book?.slug === 'libro-1ro' ||
    book?.slug === 'matematicas-fedor-1' ||
    book?.grade === '1' ||
    book?.grade === '1°';

  const tutorialClick = () => {
    if (onOpenIntro) {
      onOpenIntro();
    } else {
      goScreen('setup');
    }
  };

  const handleMascotClick = () => {
    // 1. Cycle avatar through the list from 'Elige tu astronauta'
    const currentAvatar = progress?.student?.avatar || '🧑‍🚀';
    const currentIndex = ASTRONAUT_AVATARS.indexOf(currentAvatar);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % ASTRONAUT_AVATARS.length;
    const nextAvatar = ASTRONAUT_AVATARS[nextIndex];

    selectAvatar(nextAvatar);

    // 2. Play speech
    try {
      fedorTTS.speak(`Nuevo astronauta: ${nextAvatar}`);
    } catch {
      // ignore
    }

    // 3. Show dialog balloon
    const messages = [
      `¡Has cambiado tu astronauta a ${nextAvatar}! 🚀`,
      `¡Genial! Tu nuevo astronauta es ${nextAvatar}. 🐲`,
      `¡Nuevo look cósmico: ${nextAvatar}! ¡A resolver retos! 🌟`,
      `¡Astronauta ${nextAvatar} listo para explorar! 🧑‍🚀`,
      `¡Excelente elección: ${nextAvatar}! 🪙`,
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setBubbleText(randomMsg);
    setTimeout(() => {
      setBubbleText(null);
    }, 4000);
  };

  const handleScrollToUnits = () => {
    if (screen !== 'home') {
      goScreen('home');
    }
    setTimeout(() => {
      const units = document.querySelector('#screen-home .unit-grid, #screen-home .units-container, #unitList, #screen-home .u-cards, .unit-card');
      if (units) {
        units.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  const handleGameSelect = (gameId: 'stats' | 'tablas' | 'conteo' | 'retos') => {
    setShowJuegosPicker(false);
    if (gameId === 'stats') {
      setShowStatsLab(true);
    } else if (gameId === 'tablas') {
      setShowTablas(true);
    } else if (gameId === 'conteo') {
      goScreen('conteo');
    } else if (gameId === 'retos') {
      goScreen('retos');
    }
  };

  return (
    <>
      {/* Inline styles for wave floating animation */}
      <style>{`
        @keyframes floatSmoothWave {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1.5deg);
          }
        }
        .fedor-float-btn {
          animation: floatSmoothWave 3.6s ease-in-out infinite;
        }
        .fedor-float-btn:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Balloon message for mascot */}
      {bubbleText && (
        <div className="fixed top-1/2 -translate-y-1/2 left-20 md:left-40 bg-white border-2 border-amber-400 rounded-2xl p-3.5 shadow-2xl z-[9999] max-w-xs animate-bounce" style={{ animationDuration: '4s' }}>
          <div className="text-sm font-black text-amber-900 leading-snug">{bubbleText}</div>
          {onOpenAiChat && (
            <button
              type="button"
              onClick={() => {
                setBubbleText(null);
                onOpenAiChat();
              }}
              className="mt-2 text-xs bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold px-3 py-1 rounded-full shadow hover:scale-105 transition-transform"
            >
              Hablar con la IA 🤖
            </button>
          )}
        </div>
      )}

      {/* ── BOTONES FLOTANTES IZQUIERDOS: Mascota Fedor y Juegos para Grado 1 ── */}
      {isGrade1Internal && (
        <div className="fixed left-3 md:left-20 top-1/2 -translate-y-1/2 z-[9996] flex flex-col gap-4 select-none">
          {/* 1. Mascota Fedor (Top) - Círculo con borde amarillo y dragón */}
          <div className="relative group fedor-float-btn" style={{ animationDelay: '0s' }}>
            <button
              type="button"
              onClick={handleMascotClick}
              className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #FEF9C3 60%, #FEF08A 100%)',
                border: '3.5px solid #FACC15',
                boxShadow: '0 8px 24px rgba(234, 179, 8, 0.4), 0 0 16px rgba(253, 224, 71, 0.5), inset 0 2px 4px rgba(255,255,255,0.8)',
              }}
              title="Toca tu mascota"
              aria-label="Toca tu mascota"
            >
              <DragonIcon3D />
            </button>
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
              Toca tu mascota
            </span>
          </div>

          {/* 2. Juegos (Bottom) - Círculo con gradiente rojo-naranja y control púrpura */}
          <div className="relative group fedor-float-btn" style={{ animationDelay: '0.4s' }}>
            <button
              type="button"
              onClick={() => setShowJuegosPicker(true)}
              className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #FF6B4A 0%, #FF334B 55%, #E60049 100%)',
                border: '3px solid rgba(255, 255, 255, 0.65)',
                boxShadow: '0 8px 25px rgba(230, 0, 73, 0.45), 0 0 18px rgba(255, 107, 74, 0.4), inset 0 2px 4px rgba(255,255,255,0.5)',
              }}
              title="Juegos de 1°"
              aria-label="Juegos de 1°"
            >
              <GamepadIcon3D />
            </button>
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
              Juegos de 1°
            </span>
          </div>
        </div>
      )}

      {/* ── BOTONES FLOTANTES DERECHOS ── */}
      <div className={`fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-[9996] flex flex-col select-none ${isGrade1Internal ? 'gap-3 md:gap-4' : 'gap-1.5 md:gap-2'}`}>
        {(isGrade1Internal ? [
          // GRADO 1: 4 BOTONES REDONDOS DERECHOS
          {
            key: 'g1-conceptos',
            label: 'Conceptos',
            icon: <BooksIcon3D />,
            onClick: () => setShowConceptos(true),
            s: {
              border: '3.5px solid #FFFFFF',
              background: 'linear-gradient(135deg, #FFC837 0%, #FF8008 100%)',
              boxShadow: '0 8px 24px rgba(255, 140, 0, 0.5), 0 0 16px rgba(255, 200, 55, 0.6)',
            },
            delay: '0s',
            badge: '',
            extraClass: '',
          },
          {
            key: 'g1-tablas',
            label: 'Tablas de multiplicar',
            icon: <NumbersGridIcon3D />,
            onClick: () => setShowTablas(true),
            s: {
              border: '3.5px solid #FFFFFF',
              background: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
              boxShadow: '0 8px 24px rgba(221, 36, 118, 0.5), 0 0 16px rgba(255, 81, 47, 0.6)',
            },
            delay: '0.2s',
            badge: '',
            extraClass: '',
          },
          {
            key: 'g1-stats',
            label: 'Laboratorio de Estadistica',
            icon: <StatsLabIcon3D />,
            onClick: () => setShowStatsLab(true),
            s: {
              border: '3.5px solid #FFFFFF',
              background: 'linear-gradient(135deg, #11998E 0%, #38EF7D 100%)',
              boxShadow: '0 8px 24px rgba(17, 153, 142, 0.5), 0 0 16px rgba(56, 239, 125, 0.6)',
            },
            delay: '0.4s',
            badge: '',
            extraClass: '',
          },
          {
            key: 'g1-stickers',
            label: 'Mi album de stickers',
            icon: <StickerAlbumIcon3D />,
            onClick: () => setShowStickers(true),
            s: {
              border: '3.5px solid #FFFFFF',
              background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #E11D48 100%)',
              boxShadow: '0 8px 24px rgba(236, 72, 153, 0.5), 0 0 16px rgba(225, 29, 72, 0.6)',
            },
            delay: '0.6s',
            badge: '',
            extraClass: 'mt-10 md:mt-14',
          },
        ] : [
          // GRADO 2: 13 BOTONES CUADRADOS (Estilo Imagen 2)
          { key: 'g2-menu', label: 'Menú de unidades', icon: <NumbersGridIcon3D />, onClick: handleScrollToUnits, s: { border: '2px solid rgba(255,255,255,0.4)', background: 'linear-gradient(145deg,#FF9800,#F57C00)', boxShadow: '0 6px 14px rgba(245,124,0,0.4), inset 0 2px 2px rgba(255,255,255,0.4)' }, delay: '0s', badge: '', extraClass: '' },
          { key: 'g2-tablas', label: 'Tablas de multiplicar', icon: <NumbersGridIcon3D />, onClick: () => setShowTablas(true), s: { border: '2px solid rgba(255,255,255,0.3)', background: 'linear-gradient(145deg,#7C3AED,#6D28D9)', boxShadow: '0 6px 14px rgba(109,40,217,0.4), inset 0 2px 2px rgba(255,255,255,0.3)' }, delay: '0.12s', badge: '', extraClass: '' },
          { key: 'g2-vid', label: 'Videos del libro', icon: <ClapperboardIcon3D />, onClick: () => setShowVideos(true), s: { border: '2px solid rgba(255,255,255,0.8)', background: 'linear-gradient(145deg,#FFFFFF,#F1F5F9)', boxShadow: '0 6px 14px rgba(0,0,0,0.15), inset 0 2px 2px rgba(255,255,255,0.9)' }, delay: '0.24s', badge: '222', extraClass: '' },
          { key: 'g2-stats', label: 'Laboratorio estadística', icon: <StatsLabIcon3D />, onClick: () => setShowStatsLab(true), s: { border: '2px solid rgba(255,255,255,0.2)', background: 'linear-gradient(145deg,#0F2B5C,#0A1C3E)', boxShadow: '0 6px 14px rgba(10,28,62,0.5), inset 0 2px 2px rgba(255,255,255,0.2)' }, delay: '0.36s', badge: '', extraClass: '' },
          { key: 'g2-tut', label: 'Tutorial y Guía', icon: <TutorialIcon3D />, onClick: tutorialClick, s: { border: '2px solid rgba(255,255,255,0.4)', background: 'linear-gradient(145deg,#F59E0B,#D97706)', boxShadow: '0 6px 14px rgba(217,119,6,0.4), inset 0 2px 2px rgba(255,255,255,0.4)' }, delay: '0.48s', badge: '', extraClass: '' },
          { key: 'g2-juegos', label: 'Panel de juegos', icon: <GamepadIcon3D />, onClick: () => setShowJuegosPicker(true), s: { border: '2px solid rgba(255,255,255,0.3)', background: 'linear-gradient(145deg,#8B5CF6,#7C3AED)', boxShadow: '0 6px 14px rgba(124,58,237,0.4), inset 0 2px 2px rgba(255,255,255,0.3)' }, delay: '0.6s', badge: '', extraClass: '' },
          { key: 'g2-exp', label: 'Explicación y Fichas', icon: <ExplicacionIcon3D />, onClick: () => setShowExplicacion(true), s: { border: '2px solid rgba(255,255,255,0.8)', background: 'linear-gradient(145deg,#F8FAFC,#E2E8F0)', boxShadow: '0 6px 14px rgba(0,0,0,0.15), inset 0 2px 2px rgba(255,255,255,0.9)' }, delay: '0.72s', badge: '', extraClass: '' },
          { key: 'g2-cont', label: 'Contenidos del libro', icon: <ContenidosIcon3D />, onClick: () => setShowContenidos(true), s: { border: '2px solid rgba(255,255,255,0.2)', background: 'linear-gradient(145deg,#1E3A8A,#172554)', boxShadow: '0 6px 14px rgba(23,37,84,0.5), inset 0 2px 2px rgba(255,255,255,0.2)' }, delay: '0.84s', badge: '', extraClass: '' },
          { key: 'g2-def', label: 'Definiciones FEDOR', icon: <BooksIcon3D />, onClick: () => goScreen('definiciones'), s: { border: '2px solid rgba(255,255,255,0.3)', background: 'linear-gradient(145deg,#4F46E5,#4338CA)', boxShadow: '0 6px 14px rgba(67,56,202,0.4), inset 0 2px 2px rgba(255,255,255,0.3)' }, delay: '0.96s', badge: '', extraClass: '' },
          { key: 'g2-conteo', label: 'Módulo de conteo', icon: <NumbersGridIcon3D />, onClick: () => setShowConteo(true), s: { border: '2px solid rgba(255,255,255,0.3)', background: 'linear-gradient(145deg,#0D9488,#0F766E)', boxShadow: '0 6px 14px rgba(15,118,110,0.4), inset 0 2px 2px rgba(255,255,255,0.3)' }, delay: '1.08s', badge: '', extraClass: '' },
          { key: 'g2-fedor', label: 'Fedor · tu compañero', icon: <DragonIcon3D />, onClick: handleMascotClick, s: { border: '2px solid rgba(255,255,255,0.2)', background: 'linear-gradient(145deg,#1E1B4B,#0F0E2A)', boxShadow: '0 6px 14px rgba(15,14,42,0.5), inset 0 2px 2px rgba(255,255,255,0.2)' }, delay: '1.2s', badge: '', extraClass: '' },
          { key: 'g2-lore', label: 'Historia Fedor', icon: <LoreIcon3D />, onClick: () => setShowLore(true), s: { border: '2px solid rgba(255,255,255,0.3)', background: 'linear-gradient(145deg,#6D28D9,#581C87)', boxShadow: '0 6px 14px rgba(88,28,135,0.4), inset 0 2px 2px rgba(255,255,255,0.3)' }, delay: '1.32s', badge: '', extraClass: '' },
          { key: 'g2-mini', label: 'Mini-juegos adicionales', icon: <GamepadIcon3D />, onClick: () => setShowJuegosPicker(true), s: { border: '2px solid rgba(255,255,255,0.2)', background: 'linear-gradient(145deg,#18181B,#09090B)', boxShadow: '0 6px 14px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.2)' }, delay: '1.44s', badge: '', extraClass: '' },
        ]).map((btn) => (
          <div key={btn.key} className={`relative group fedor-float-btn ${btn.extraClass || ''}`} style={{ animationDelay: btn.delay }}>
            <button
              type="button"
              onClick={btn.onClick}
              className="relative flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
              style={{
                width: isGrade1Internal ? 56 : 46,
                height: isGrade1Internal ? 56 : 46,
                borderRadius: isGrade1Internal ? '50%' : 15,
                ...btn.s,
              }}
              title={btn.label}
              aria-label={btn.label}
            >
              {btn.icon}
              {btn.badge && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-950 font-black text-[10px] px-1.5 py-0.5 rounded-full shadow border border-white">
                  {btn.badge}
                </span>
              )}
            </button>
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
              {btn.label}
            </span>
          </div>
        ))}
      </div>
      {showJuegosPicker && (
        isGrade1Internal ? (
          <Juegos1roModal
            onClose={() => setShowJuegosPicker(false)}
            onSelectOption={handleGameSelect}
          />
        ) : (
          <MinijuegosPickerModal onClose={() => setShowJuegosPicker(false)} />
        )
      )}
      {showStatsLab && <StatsLab onClose={() => setShowStatsLab(false)} />}
      {showTablas && (
        <MultiplicationTables
          onReward={(coins) => grantReward(0, coins)}
          onClose={() => setShowTablas(false)}
        />
      )}
      {showConceptos && (
        <ConceptosFedorModal onClose={() => setShowConceptos(false)} />
      )}
      {showStickers && (
        <StickerAlbumModal onClose={() => setShowStickers(false)} />
      )}
      {showConteo && (
        <ConteoModal
          onClose={() => setShowConteo(false)}
          onSelectOption={(id) => openGameShortcut('conteo')}
        />
      )}
      <HerramientasModal
        isOpen={showHerramientas}
        onClose={() => setShowHerramientas(false)}
        onSelectOption={(option) => {
          if (option === 'home') goScreen('home');
          else if (option === 'videos') setShowVideos(true);
          else if (option === 'definiciones') goScreen('definiciones');
          else if (option === 'conceptos') goScreen('conceptos');
          else if (option === 'tablas') setShowTablas(true);
          else if (option === 'lab') setShowStatsLab(true);
        }}
      />
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
      {showExplicacion && (
        <ExplicacionModal onClose={() => setShowExplicacion(false)} />
      )}
      {showLore && (
        <LoreModal onClose={() => setShowLore(false)} />
      )}
      {showContenidos && (
        <ContenidosModal onClose={() => setShowContenidos(false)} />
      )}
    </>
  );
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function AiChatSidebar({ isOpen, onClose, bookGroup }: { isOpen: boolean; onClose: () => void; bookGroup?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with friendly greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: '¡Hola! Soy tu asistente de matemáticas Fedor 🤖. ¿En qué te puedo ayudar hoy? Puedes preguntarme sobre conceptos, pedirme que te ponga un reto matemático o resolver tus dudas. 🚀',
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend ?? input;
    if (!text.trim() || isLoading) return;

    const token = authService.getToken();
    if (!token) {
      Swal.fire({
        title: 'Inicia sesión',
        text: 'Inicia sesión para conversar con el asistente.',
        icon: 'warning',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const serviceMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp
      }));

      const response = await chatService.sendChatMessages(serviceMessages, token, bookGroup);

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.response || response.message || 'Lo siento, no pude procesar tu solicitud.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Ocurrió un error al conectar con el asistente. Por favor, intenta de nuevo.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const starters = [
    { text: 'Explícame qué son los números primos 🔢', prompt: '¿Puedes explicarme de manera sencilla qué son los números primos y darme algunos ejemplos?' },
    { text: '¿Cómo puedo aprender a multiplicar? ✖️', prompt: '¿Me puedes enseñar algunos trucos o formas fáciles de aprender a multiplicar?' },
    { text: 'Ponme un reto matemático interactivo 🏆', prompt: '¡Hola Fedor! Ponme un reto o ejercicio matemático divertido para resolver ahora mismo.' },
  ];

  return (
    <>
      <div 
        className={`ai-chat-backdrop${isOpen ? ' open' : ''}`} 
        onClick={onClose}
      />

      <div className={`ai-chat-drawer${isOpen ? ' open' : ''}`}>
        <div className="ai-chat-header">
          <h3>
            <span>🤖</span> Asistente IA Fedor
          </h3>
          <button 
            type="button" 
            className="ai-chat-close" 
            onClick={onClose}
            aria-label="Cerrar chat"
          >
            ✕
          </button>
        </div>

        <div className="ai-chat-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`ai-chat-msg ${m.role}`}>
              <div>{m.content}</div>
              <span className="ai-chat-time">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          
          {isLoading && (
            <div className="ai-chat-loading">
              <div className="ai-loading-dot"></div>
              <div className="ai-loading-dot"></div>
              <div className="ai-loading-dot"></div>
            </div>
          )}

          {messages.length === 1 && !isLoading && (
            <div className="ai-chat-starters">
              <div className="ai-chat-starter-title">Preguntas sugeridas:</div>
              {starters.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="ai-starter-chip"
                  onClick={() => handleSend(s.prompt)}
                >
                  {s.text}
                </button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-input-area">
          <div className="ai-chat-input-row">
            <textarea
              className="ai-chat-textarea"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
            />
            <button
              type="button"
              className="ai-chat-send-btn"
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              aria-label="Enviar mensaje"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}