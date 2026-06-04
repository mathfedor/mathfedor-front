'use client';

import type { ComponentType } from 'react';
import { BookProvider, useBook, type BookScreen } from './context/BookContext';
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
