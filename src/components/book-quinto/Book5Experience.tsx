'use client';

import React, { useState, useEffect } from 'react';
import { Book5Provider, useBook5, type StudentProfile5 } from './context/Book5Context';
import SetupScreen5to from './screens/SetupScreen5to';
import HomeScreen5to from './screens/HomeScreen5to';
import UnitScreen5to from './screens/UnitScreen5to';
import LessonScreen5to from './screens/LessonScreen5to';
import ProblemasScreen5to from './screens/ProblemasScreen5to';
import ResultsScreen5to from './screens/ResultsScreen5to';
import EstandaresScreen5to from './screens/EstandaresScreen5to';
import DefinicionesScreen5to from './screens/DefinicionesScreen5to';
import ReportScreen5to from './screens/ReportScreen5to';
import BookHeader5to from './shared/BookHeader5to';
import Grade5FloatingButtons from './shared/Grade5FloatingButtons';
import WelcomeIntroModal5to from './shared/WelcomeIntroModal5to';
import LaunchIntro5to from './shared/LaunchIntro5to';
import AiChatSidebar5to from './shared/AiChatSidebar5to';
import UniversoFedorModal5to from './shared/UniversoFedorModal5to';

function Book5Shell() {
  const {
    screen,
    loading,
    dark,
    book,
    student,
    selectUnit,
    startStudent,
    resetStudent,
    goScreen,
  } = useBook5();

  const [showLaunchIntro, setShowLaunchIntro] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showGalaxyModal, setShowGalaxyModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [customToolModal, setCustomToolModal] = useState<{ title: string; content: React.ReactNode } | null>(null);

  // Al iniciar la sesión por primera vez, si el estudiante ya tiene perfil y va directo a home, mostrar popup de bienvenida
  useEffect(() => {
    if (!loading && screen === 'home') {
      const shown = sessionStorage.getItem('fedor5_welcome_shown');
      if (!shown) {
        setShowWelcomeModal(true);
        sessionStorage.setItem('fedor5_welcome_shown', 'true');
      }
    }
  }, [loading, screen]);

  // Al comenzar la aventura desde el formulario de inicio
  const handleStartAdventure = (studentData: StudentProfile5) => {
    startStudent(studentData);
    setShowWelcomeModal(true);
    sessionStorage.setItem('fedor5_welcome_shown', 'true');
  };

  const handleLaunchIntroClose = () => {
    setShowLaunchIntro(false);
    setShowWelcomeModal(true);
    sessionStorage.setItem('fedor5_welcome_shown', 'true');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#140830] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-black text-amber-300 tracking-wide">
          Cargando Matemáticas de Fedor 5°...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`fedor-book fedor-book-5 ${dark ? 'dark' : ''} ${
        screen === 'setup' || screen === 'home' || screen === 'lesson' || screen === 'unit'
          ? 'bg-[#F0EDFF] text-[#180D38]'
          : 'bg-[#140830] text-white'
      } min-h-screen relative font-sans`}
    >
      <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%', boxSizing: 'border-box', position: 'relative' }}>
        {/* ══ Header Superior de Fedor 5° con Logo Orb y Estado ══ */}
        <div style={{ padding: '5.25rem 1rem 0.5rem' }}>
          <BookHeader5to
            onOpenIntro={() => setShowLaunchIntro(true)}
            onOpenGalaxy={() => setShowGalaxyModal(true)}
          />
        </div>

        {/* ══ Current Screen Router ══ */}
        {screen === 'setup' && (
          <SetupScreen5to onStartAdventure={handleStartAdventure} />
        )}

        {screen === 'home' && (
          <HomeScreen5to onOpenIntro={() => setShowLaunchIntro(true)} />
        )}

        {screen === 'unit' && <UnitScreen5to />}
        {screen === 'lesson' && <LessonScreen5to />}
        {screen === 'problemas' && <ProblemasScreen5to />}
        {screen === 'results' && <ResultsScreen5to />}
        {screen === 'estandares' && <EstandaresScreen5to />}
        {screen === 'definiciones' && <DefinicionesScreen5to />}
        {screen === 'report' && <ReportScreen5to />}
      </div>

      {/* ══ 2 Botones Flotantes del HTML de 5° (visibles excepto en lección y setup) ══ */}
      {screen !== 'lesson' && screen !== 'setup' && (
        <Grade5FloatingButtons
          onOpenAiChat={() => setShowAiChat(true)}
          onOpenIntro={() => setShowLaunchIntro(true)}
          onOpenGalaxy={() => setShowGalaxyModal(true)}
          onOpenProblemas={() => goScreen('problemas')}
          onOpenToolModal={(title, content) => setCustomToolModal({ title, content })}
        />
      )}

      {/* ══ Animación Cinemática de Despegue ══ */}
      {showLaunchIntro && (
        <LaunchIntro5to onClose={handleLaunchIntroClose} />
      )}

      {/* ══ Popup de Bienvenida Inicial (showWelcomeTutorial del HTML) ══ */}
      {showWelcomeModal && (
        <WelcomeIntroModal5to
          isOpen={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}

      {/* ══ Universo Fedor / Galaxia Modal ══ */}
      {showGalaxyModal && (
        <UniversoFedorModal5to
          isOpen={showGalaxyModal}
          onClose={() => setShowGalaxyModal(false)}
        />
      )}

      {/* ══ Asistente IA de Fedor 5° ══ */}
      <AiChatSidebar5to
        isOpen={showAiChat}
        onClose={() => setShowAiChat(false)}
      />

      {/* ══ Modal de Herramientas Dinámico ══ */}
      {customToolModal && (
        <div className="fixed inset-0 z-[99996] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#140830] border border-amber-400/30 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-black text-amber-300">{customToolModal.title}</h3>
              <button
                type="button"
                onClick={() => setCustomToolModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {customToolModal.content}
            </div>
          </div>
        </div>
      )}

      {/* ══ Cajón de Navegación Lateral "CONTENIDO" ══ */}
      {showDrawer && (
        <div className="fixed inset-0 z-[99990] flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-[#140830] border-l border-amber-400/30 p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-purple-800/40 mb-4">
                <h2 className="text-base font-black text-amber-300">
                  📑 Contenido del Libro 5°
                </h2>
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                {(book?.units || []).map((u, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      selectUnit(i);
                      setShowDrawer(false);
                    }}
                    className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-colors cursor-pointer flex items-center gap-3"
                  >
                    <span className="text-xl shrink-0">{u.icon || '📘'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-white truncate">
                        {u.name}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {u.topics?.length || 0} temas · 5 niveles
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-purple-800/40 text-center space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowDrawer(false);
                  setShowLaunchIntro(true);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-md"
              >
                🎬 Ver Intro Cinemática
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowDrawer(false);
                  resetStudent();
                }}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-amber-200 font-black text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                🔄 Reiniciar y ver Formulario de Inicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Book5Experience({ slug = 'matematicas-fedor-5' }: { slug?: string }) {
  return (
    <Book5Provider slug={slug}>
      <Book5Shell />
    </Book5Provider>
  );
}
