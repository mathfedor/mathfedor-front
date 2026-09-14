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
import Conteo1roModal from './shared/Conteo1roModal';
import HerramientasModal from './shared/HerramientasModal';
import VideosModal from './shared/VideosModal';
import Videos1roModal from './shared/Videos1roModal';
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
import WelcomeIntroModal2do from './shared/WelcomeIntroModal2do';
import Grade2FloatingButtons from './shared/Grade2FloatingButtons';
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
      <BookShell slugProp={slug} />
    </BookProvider>
  );
}

/** Aplica las preferencias de tema (modo oscuro) al contenedor raíz. */
function BookShell({ slugProp }: { slugProp?: string }) {
  const { book, dark, loading, screen, progress } = useBook();
  const [showIntro, setShowIntro] = useState(false);
  const [showCadeteModal, setShowCadeteModal] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const isGrade1 = slugProp === 'libro-1ro' || book?.slug === 'libro-1ro' || book?.grade === '1' || book?.grade === '1°';
  const isGrade2 = slugProp === 'libro-2do' || slugProp === 'matematicas-fedor-2' || book?.slug === 'libro-2do' || book?.slug === 'matematicas-fedor-2';
  const bookGroup = isGrade1 ? 'Grado1' : 'Grado2';

  const prevScreenRef = useRef(screen);
  useEffect(() => {
    if (prevScreenRef.current === 'setup' && screen === 'home') {
      setShowIntro(true);
    }
    prevScreenRef.current = screen;
  }, [screen]);

  // Al ingresar a 2° grado por primera vez en la sesión, activar la intro de despegue
  useEffect(() => {
    if (isGrade2 && !loading && (screen === 'home' || screen === 'setup')) {
      try {
        const hasSeenIntro = sessionStorage.getItem('fedor2_session_intro_shown');
        if (!hasSeenIntro) {
          sessionStorage.setItem('fedor2_session_intro_shown', '1');
          setShowIntro(true);
        }
      } catch {
        // ignore
      }
    }
  }, [isGrade2, loading, screen]);

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
      {isGrade1 ? (
        <Grade1FloatingButtons
          onOpenAiChat={() => setShowAiChat(true)}
          onOpenIntro={() => setShowIntro(true)}
          bookGroup={bookGroup}
        />
      ) : (
        <Grade2FloatingButtons
          onOpenAiChat={() => setShowAiChat(true)}
          onOpenIntro={() => setShowIntro(true)}
        />
      )}

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
      {showIntro && (
        <LaunchIntro
          onClose={() => {
            setShowIntro(false);
            if (isGrade2) {
              setShowCadeteModal(true);
            }
          }}
        />
      )}
      {showCadeteModal && isGrade2 && (
        <WelcomeIntroModal2do
          onClose={() => setShowCadeteModal(false)}
        />
      )}
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
  <svg viewBox="0 0 64 64" className="w-8 h-8 md:w-9 md:h-9 drop-shadow-sm" fill="none">
    {/* Bar chart grid backing */}
    <rect x="10" y="20" width="22" height="28" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
    <line x1="10" y1="29" x2="32" y2="29" stroke="#E2E8F0" strokeWidth="1" />
    <line x1="10" y1="38" x2="32" y2="38" stroke="#E2E8F0" strokeWidth="1" />
    <line x1="17" y1="20" x2="17" y2="48" stroke="#E2E8F0" strokeWidth="1" />
    <line x1="24" y1="20" x2="24" y2="48" stroke="#E2E8F0" strokeWidth="1" />
    {/* 3 Bars */}
    <rect x="12" y="27" width="5" height="21" rx="1.5" fill="#4ADE80" />
    <rect x="19" y="33" width="5" height="15" rx="1.5" fill="#F43F5E" />
    <rect x="26" y="22" width="5" height="26" rx="1.5" fill="#3B82F6" />
    {/* Angled test tube (45 deg) */}
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

  const isGrade1Internal = true;

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

      {/* ── BOTONERA FLOTANTE IZQUIERDA: 6 Botones Estilo Imagen (Grado 1) ── */}
      <div className="fixed left-3 md:left-20 top-1/2 -translate-y-1/2 z-[9996] flex flex-col gap-2.5 md:gap-3.5 select-none items-center">
        {/* 1. Inicio (House) */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0s' }}>
          <button
            type="button"
            onClick={() => goScreen('home')}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Volver al inicio"
            aria-label="Volver al inicio"
          >
            <HouseIcon3D />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Inicio
          </span>
        </div>

        {/* 2. Maletín / Herramientas */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.2s' }}>
          <button
            type="button"
            onClick={() => setShowHerramientas(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Herramientas del libro"
            aria-label="Herramientas del libro"
          >
            <ToolboxIcon3D />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Herramientas del libro
          </span>
        </div>

        {/* 3. Paleta / Cambiar color de fondo */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.4s' }}>
          <button
            type="button"
            onClick={() => setShowColorPicker(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Cambiar color de fondo"
            aria-label="Cambiar color de fondo"
          >
            <PaletteIcon3D />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Cambiar color de fondo
          </span>
        </div>

        {/* 4. Libros / Definiciones FEDOR */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.6s' }}>
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

        {/* 5. Mando de Consola / Juegos de 1° */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.8s' }}>
          <button
            type="button"
            onClick={() => setShowJuegosPicker(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Juegos de 1°"
            aria-label="Juegos de 1°"
          >
            <GamepadIcon3D />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Juegos Matemáticos
          </span>
        </div>

        {/* 6. Dragón / Mascota Fedor */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '1.0s' }}>
          <button
            type="button"
            onClick={handleMascotClick}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Toca a tu mascota"
            aria-label="Toca a tu mascota"
          >
            <DragonIcon3D />
          </button>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Mascota Fedor
          </span>
        </div>
      </div>

      {/* ── BOTONERA FLOTANTE DERECHA: 6 Botones Estilo Imagen (Grado 1) ── */}
      <div className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-[9996] flex flex-col gap-2.5 md:gap-3.5 select-none items-center">
        {/* 1. Videos explicativos con badge 290 */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.1s' }}>
          <button
            type="button"
            onClick={() => setShowVideos(true)}
            className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Videos por unidad"
            aria-label="Videos por unidad"
          >
            <ClapperboardIcon3D />
            <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 font-black text-[10px] md:text-[11px] px-1.5 py-0.5 rounded-full shadow border border-white">
              290
            </span>
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Videos explicativos (290)
          </span>
        </div>

        {/* 2. Libros apilados / Conceptos */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.3s' }}>
          <button
            type="button"
            onClick={() => setShowConceptos(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Conceptos"
            aria-label="Conceptos"
          >
            <BooksIcon3D />
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Conceptos
          </span>
        </div>

        {/* 3. Multiplicación X / Tablas de multiplicar */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.5s' }}>
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

        {/* 4. Gráfico de Barras / Laboratorio de Estadística */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.7s' }}>
          <button
            type="button"
            onClick={() => setShowStatsLab(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Laboratorio de Estadística"
            aria-label="Laboratorio de Estadística"
          >
            <StatsLabIcon3D />
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Laboratorio de Estadística
          </span>
        </div>

        {/* 5. Libro Morado / Mi álbum de stickers */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '0.9s' }}>
          <button
            type="button"
            onClick={() => setShowStickers(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Álbum Coleccionable"
            aria-label="Álbum Coleccionable"
          >
            <StickerAlbumIcon3D />
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Álbum Coleccionable
          </span>
        </div>

        {/* 6. Cuadrícula 1234 / Conteo */}
        <div className="relative group fedor-float-btn" style={{ animationDelay: '1.1s' }}>
          <button
            type="button"
            onClick={() => setShowConteo(true)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_22px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.06)] border-2 border-white/90 hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer"
            title="Conteo"
            aria-label="Conteo"
          >
            <NumbersGridIcon3D />
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md z-10">
            Conteo
          </span>
        </div>
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
        <Conteo1roModal
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
      <Videos1roModal
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