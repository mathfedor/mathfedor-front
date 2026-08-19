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
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <rect x="14" y="42" width="36" height="10" rx="3" fill="#3B82F6" />
    <rect x="18" y="44" width="32" height="6" rx="1" fill="#EFF6FF" />
    <rect x="12" y="42" width="6" height="10" rx="2" fill="#1D4ED8" />
    <rect x="16" y="30" width="34" height="10" rx="3" fill="#F43F5E" />
    <rect x="20" y="32" width="30" height="6" rx="1" fill="#FFF1F2" />
    <rect x="14" y="30" width="6" height="10" rx="2" fill="#BE123C" />
    <rect x="18" y="18" width="32" height="10" rx="3" fill="#10B981" />
    <rect x="22" y="20" width="28" height="6" rx="1" fill="#ECFDF5" />
    <rect x="16" y="18" width="6" height="10" rx="2" fill="#047857" />
  </svg>
);

const GamepadIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <path d="M 16 22 C 10 22 8 32 12 44 C 14 50 20 50 24 44 L 28 38 L 36 38 L 40 44 C 44 50 50 50 52 44 C 56 32 54 22 48 22 Z" fill="#7C3AED" />
    <rect x="20" y="28" width="4" height="12" rx="1" fill="#374151" />
    <rect x="16" y="32" width="12" height="4" rx="1" fill="#374151" />
    <circle cx="44" cy="28" r="2.5" fill="#EF4444" />
    <circle cx="48" cy="32" r="2.5" fill="#3B82F6" />
    <circle cx="44" cy="36" r="2.5" fill="#10B981" />
    <circle cx="40" cy="32" r="2.5" fill="#FACC15" />
  </svg>
);

const DragonIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm">
    <path d="M 42 16 L 48 10 L 48 22 Z" fill="#EC4899" />
    <path d="M 46 24 L 52 18 L 52 30 Z" fill="#EC4899" />
    <path d="M 16 34 C 16 20 28 16 42 20 C 48 22 50 28 48 34 C 46 42 38 48 28 48 C 20 48 16 42 16 34 Z" fill="#10B981" />
    <path d="M 14 34 C 14 30 20 30 24 34 C 24 38 18 42 14 38 Z" fill="#34D399" />
    <circle cx="18" cy="34" r="1.5" fill="#047857" />
    <circle cx="32" cy="26" r="5" fill="#FFFFFF" />
    <circle cx="31" cy="26" r="2.5" fill="#1E1B4B" />
    <circle cx="32.5" cy="25" r="1" fill="#FFFFFF" />
    <circle cx="28" cy="38" r="3" fill="#F472B6" opacity="0.6" />
    <path d="M 22 20 C 18 16 16 10 20 8 C 24 10 24 16 25 20 Z" fill="#FACC15" />
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

function Grade1FloatingButtons({ onOpenAiChat, onOpenIntro }: { onOpenAiChat?: () => void; onOpenIntro?: () => void }) {
  const { book, screen, goScreen, openGameShortcut, grantReward } = useBook();
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

  const handleMascotClick = () => {
    const messages = [
      "¡Hola! Soy Fedor, tu compañero de aprendizaje. 🐲",
      "¡Intenta resolver los retos para ganar monedas! 🪙",
      "¿Sabías que puedes personalizar tu astronauta en el perfil? 🧑‍🚀",
      "¡Usa la recta numérica para sumar y restar más fácil! 📏",
      "¡No olvides revisar tu reporte diario para ver tu progreso! 📊"
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setBubbleText(randomMsg);
    setTimeout(() => {
      setBubbleText(null);
    }, 5000);
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

  const handleGameSelect = (gameId: 'stats' | 'tablas' | 'conteo' | 'retos1') => {
    setShowJuegosPicker(false);
    if (gameId === 'stats') {
      setShowStatsLab(true);
    } else if (gameId === 'tablas') {
      setShowTablas(true);
    } else if (gameId === 'conteo') {
      setShowConteo(true);
    } else {
      openGameShortcut(gameId);
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
        <div className="fixed bottom-24 left-24 md:left-32 bg-white border-2 border-amber-400 rounded-2xl p-3.5 shadow-2xl z-[9999] max-w-xs animate-bounce" style={{ animationDuration: '4s' }}>
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

      {/* Botones flotantes verticales a la IZQUIERDA (5 botones exactos: Menú de unidades, Fedor tu compañero, Definiciones FEDOR, Panel de juegos, Tutorial) */}
      <div className="fixed left-20 md:left-24 lg:left-28 top-1/2 -translate-y-1/2 z-[9996] flex flex-col gap-3 md:gap-4 select-none">
        {/* 1. Menú de unidades (Clipboard/Menu) */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0s' }}>
          <button
            type="button"
            onClick={handleScrollToUnits}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Menú de unidades"
            aria-label="Menú de unidades"
          >
            <MenuUnitsIcon3D />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Menú de unidades
          </span>
        </div>

        {/* 2. Dragón / Fedor tu compañero */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.4s' }}>
          <button
            type="button"
            onClick={handleMascotClick}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Fedor tu compañero"
            aria-label="Fedor tu compañero"
          >
            <DragonIcon3D />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Fedor · tu compañero
          </span>
        </div>

        {/* 3. Libros / Definiciones FEDOR */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.8s' }}>
          <button
            type="button"
            onClick={() => goScreen('definiciones')}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Definiciones FEDOR"
            aria-label="Definiciones FEDOR"
          >
            <BooksIcon3D />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Definiciones FEDOR
          </span>
        </div>

        {/* 4. Mando de Consola / Panel de juegos */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '1.2s' }}>
          <button
            type="button"
            onClick={() => setShowJuegosPicker(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Panel de juegos"
            aria-label="Panel de juegos"
          >
            <GamepadIcon3D />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Panel de juegos
          </span>
        </div>

        {/* 5. Tutorial / Guía */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '1.6s' }}>
          <button
            type="button"
            onClick={() => {
              if (onOpenIntro) {
                onOpenIntro();
              } else {
                goScreen('setup');
              }
            }}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Tutorial"
            aria-label="Tutorial"
          >
            <TutorialIcon3D />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Tutorial
          </span>
        </div>
      </div>

      {/* Botones flotantes verticales a la DERECHA (7 botones exactos: Tablas de multiplicar, Modulo de conteo, Videos del libro, Laboratorio estadistica, Explicacion, mini-juegos contenidos, historia Fedor) */}
      <div className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-[9996] flex flex-col gap-2.5 md:gap-3 select-none">
        {/* 1. Tablas de multiplicar */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.2s' }}>
          <button
            type="button"
            onClick={() => setShowTablas(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Tablas de multiplicar"
            aria-label="Tablas de multiplicar"
          >
            <MultiplyGridIcon3D />
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Tablas de multiplicar
          </span>
        </div>

        {/* 2. Modulo de conteo */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.6s' }}>
          <button
            type="button"
            onClick={() => setShowConteo(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Modulo de conteo"
            aria-label="Modulo de conteo"
          >
            <NumbersGridIcon3D />
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Modulo de conteo
          </span>
        </div>

        {/* 3. Videos del libro */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '1.0s' }}>
          <button
            type="button"
            onClick={() => setShowVideos(true)}
            className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Videos del libro"
            aria-label="Videos del libro"
          >
            <ClapperboardIcon3D />
            <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 font-black text-[10px] md:text-[11px] px-1.5 py-0.5 rounded-full shadow border border-white">
              222
            </span>
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Videos del libro
          </span>
        </div>

        {/* 4. Laboratorio estadistica */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '1.4s' }}>
          <button
            type="button"
            onClick={() => setShowStatsLab(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Laboratorio estadistica"
            aria-label="Laboratorio estadistica"
          >
            <StatsLabIcon3D />
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Laboratorio estadistica
          </span>
        </div>

        {/* 5. Explicacion */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '1.8s' }}>
          <button
            type="button"
            onClick={() => setShowExplicacion(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Explicacion"
            aria-label="Explicacion"
          >
            <ExplicacionIcon3D />
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Explicacion
          </span>
        </div>

        {/* 6. mini-juegos contenidos */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '2.2s' }}>
          <button
            type="button"
            onClick={() => setShowJuegosPicker(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="mini-juegos contenidos"
            aria-label="mini-juegos contenidos"
          >
            <GamepadIcon3D />
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            mini-juegos contenidos
          </span>
        </div>

        {/* 7. Contenidos */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '2.4s' }}>
          <button
            type="button"
            onClick={() => setShowContenidos(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Contenidos"
            aria-label="Contenidos"
          >
            <ContenidosIcon3D />
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Contenidos
          </span>
        </div>

        {/* 8. historia Fedor */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '2.6s' }}>
          <button
            type="button"
            onClick={() => setShowLore(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="historia Fedor"
            aria-label="historia Fedor"
          >
            <LoreIcon3D />
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            historia Fedor
          </span>
        </div>
      </div>

      {/* Modal Picker Mini-juegos de 2° */}
      {showJuegosPicker && (
        <MinijuegosPickerModal onClose={() => setShowJuegosPicker(false)} />
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
