'use client';

import React, { useState, useEffect } from 'react';
import { Book4Provider, useBook4, type StudentProfile4 } from './context/Book4Context';
import SetupScreen4to from './screens/SetupScreen4to';
import HomeScreen4to from './screens/HomeScreen4to';
import UnitScreen4to from './screens/UnitScreen4to';
import LessonScreen4to from './screens/LessonScreen4to';
import ProblemasScreen4to from './screens/ProblemasScreen4to';
import ResultsScreen4to from './screens/ResultsScreen4to';
import EstandaresScreen4to from './screens/EstandaresScreen4to';
import DefinicionesScreen4to from './screens/DefinicionesScreen4to';
import ReportScreen4to from './screens/ReportScreen4to';
import BookHeader4to from './shared/BookHeader4to';
import Grade4FloatingButtons from './shared/Grade4FloatingButtons';
import WelcomeIntroModal4to from './shared/WelcomeIntroModal4to';
import LaunchIntro4to from './shared/LaunchIntro4to';
import AiChatSidebar4to from './shared/AiChatSidebar4to';
import UniversoFedorModal4to from './shared/UniversoFedorModal4to';

function Book4Shell() {
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
  } = useBook4();

  const [showLaunchIntro, setShowLaunchIntro] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showGalaxyModal, setShowGalaxyModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [customToolModal, setCustomToolModal] = useState<{ title: string; content: React.ReactNode } | null>(null);

  // Al iniciar la sesión por primera vez, si el estudiante ya tiene perfil y va directo a home, mostrar popup de bienvenida
  useEffect(() => {
    if (!loading && screen === 'home') {
      const shown = sessionStorage.getItem('fedor4_welcome_shown');
      if (!shown) {
        setShowWelcomeModal(true);
        sessionStorage.setItem('fedor4_welcome_shown', 'true');
      }
    }
  }, [loading, screen]);

  // Al comenzar la aventura desde el formulario de inicio
  const handleStartAdventure = (studentData: StudentProfile4) => {
    startStudent(studentData);
    setShowWelcomeModal(true);
    sessionStorage.setItem('fedor4_welcome_shown', 'true');
  };

  const handleLaunchIntroClose = () => {
    setShowLaunchIntro(false);
    setShowWelcomeModal(true);
    sessionStorage.setItem('fedor4_welcome_shown', 'true');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07091B] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-black text-amber-300 tracking-wide">
          Cargando Matemáticas de Fedor 4°...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`fedor-book fedor-book-4 ${dark ? 'dark' : ''} ${
        screen === 'setup' || screen === 'home' || screen === 'lesson' || screen === 'unit'
          ? 'bg-[#F0EDFF] text-[#180D38]'
          : 'bg-[#07091B] text-white'
      } min-h-screen relative font-sans`}
    >
      <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%', boxSizing: 'border-box', position: 'relative' }}>
        {/* ══ Header Superior de Fedor 4° con Escudo y Casco Dorado ══ */}
        <div style={{ padding: '2.5rem 1rem 0.5rem' }}>
          <BookHeader4to
            onOpenIntro={() => setShowLaunchIntro(true)}
            onOpenGalaxy={() => setShowGalaxyModal(true)}
          />
        </div>

        {/* ══ Current Screen Router ══ */}
        {screen === 'setup' && (
          <SetupScreen4to onStartAdventure={handleStartAdventure} />
        )}

        {screen === 'home' && (
          <HomeScreen4to onOpenIntro={() => setShowLaunchIntro(true)} />
        )}

        {screen === 'unit' && <UnitScreen4to />}
        {screen === 'lesson' && <LessonScreen4to />}
        {screen === 'problemas' && <ProblemasScreen4to />}
        {screen === 'results' && <ResultsScreen4to />}
        {screen === 'estandares' && <EstandaresScreen4to />}
        {screen === 'definiciones' && <DefinicionesScreen4to />}
        {screen === 'report' && <ReportScreen4to />}
      </div>

      {/* ══ Botones Flotantes del HTML de 4° (visibles excepto en lección y setup) ══ */}
      {screen !== 'lesson' && screen !== 'setup' && (
        <Grade4FloatingButtons
          onOpenAiChat={() => setShowAiChat(true)}
          onOpenIntro={() => setShowLaunchIntro(true)}
          onOpenGalaxy={() => setShowGalaxyModal(true)}
          onOpenProblemas={() => goScreen('problemas')}
          onOpenToolModal={(title, content) => setCustomToolModal({ title, content })}
        />
      )}

      {/* ══ Animación Cinemática de Despegue ══ */}
      {showLaunchIntro && (
        <LaunchIntro4to onClose={handleLaunchIntroClose} />
      )}

      {/* ══ Popup de Bienvenida Inicial (showWelcomeTutorial del HTML) ══ */}
      {showWelcomeModal && (
        <WelcomeIntroModal4to
          isOpen={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}

      {/* ══ Universo Fedor / Galaxia Modal ══ */}
      {showGalaxyModal && (
        <UniversoFedorModal4to
          isOpen={showGalaxyModal}
          onClose={() => setShowGalaxyModal(false)}
        />
      )}

      {/* ══ Asistente IA de Fedor 4° ══ */}
      <AiChatSidebar4to
        isOpen={showAiChat}
        onClose={() => setShowAiChat(false)}
      />

      {/* ══ Modal de Herramientas Dinámico ══ */}
      {customToolModal && (
        <div className="fixed inset-0 z-[99996] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#110D27] border border-amber-400/30 rounded-3xl p-6 shadow-2xl text-white">
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
          <div className="w-full max-w-sm bg-[#130B29] border-l border-amber-400/30 p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-purple-800/40 mb-4">
                <h2 className="text-base font-black text-amber-300">
                  📑 Contenido del Libro 4°
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

export default function Book4Experience({ slug = 'matematicas-fedor-4' }: { slug?: string }) {
  return (
    <Book4Provider slug={slug}>
      <Book4Shell />
    </Book4Provider>
  );
}
