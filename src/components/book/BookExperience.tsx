'use client';

import { useMemo } from 'react';
import type { ComponentType } from 'react';
import { BookProvider, useBook, type BookScreen } from './context/BookContext';
import { evaluateMissions } from '@/services/missions.service';
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
import PwaRegister from './shared/PwaRegister';
import InstallPrompt from './shared/InstallPrompt';

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
};

/** Punto de entrada de la experiencia del libro (incluye el proveedor). */
export default function BookExperience() {
  return (
    <BookProvider>
      <BookShell />
    </BookProvider>
  );
}

/** Aplica las preferencias de tema (modo oscuro) al contenedor raíz. */
function BookShell() {
  const { dark } = useBook();
  return (
    <div className={`fedor-book${dark ? ' dark' : ''}`}>
      <PwaRegister />
      <div className="app">
        <BookRouter />
      </div>
      <FloatingQuickActions />
      <InstallPrompt />
    </div>
  );
}

function BookRouter() {
  const { loading, screen } = useBook();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  const ActiveScreen = SCREENS[screen];
  return (
    <>
      <ActiveScreen />
      {screen !== 'setup' && screen !== 'lesson' && screen !== 'galaxy' && <BottomNav />}
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
