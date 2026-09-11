'use client';

import React, { useState } from 'react';
import { Book3Provider, useBook3, type StudentProfile3 } from './context/Book3Context';
import SetupScreen3ro from './screens/SetupScreen3ro';
import HomeScreen3ro from './screens/HomeScreen3ro';
import UnitScreen3ro from './screens/UnitScreen3ro';
import LessonScreen3ro from './screens/LessonScreen3ro';
import ProblemasScreen3ro from './screens/ProblemasScreen3ro';
import ResultsScreen3ro from './screens/ResultsScreen3ro';
import EstandaresScreen3ro from './screens/EstandaresScreen3ro';
import DefinicionesScreen3ro from './screens/DefinicionesScreen3ro';
import Grade3FloatingButtons from './shared/Grade3FloatingButtons';
import LaunchIntro3ro from './shared/LaunchIntro3ro';
import WelcomeIntroModal3ro from './shared/WelcomeIntroModal3ro';
import AiChatSidebar3ro from './shared/AiChatSidebar3ro';
import BookHeader3ro from './shared/BookHeader3ro';

function Book3Shell() {
  const { screen, loading, dark, book, selectUnit, startStudent, resetStudent } = useBook3();

  const [showLaunchIntro, setShowLaunchIntro] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  // Flow from setup: "¡Comenzar aventura!" -> Launch animation -> Welcome popup -> Home screen
  const handleStartAdventure = (studentData: StudentProfile3) => {
    startStudent(studentData);
    setShowLaunchIntro(true);
  };

  const handleLaunchIntroClose = () => {
    setShowLaunchIntro(false);
    setShowWelcomeModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07091B] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-black text-amber-300 tracking-wide">
          Cargando Matemáticas de Fedor 3°...
        </p>
      </div>
    );
  }

  return (
    <div className={`fedor-book fedor-book-3 ${dark ? 'dark' : ''} ${screen === 'setup' || screen === 'home' ? 'bg-[#F0EDFF] text-[#180D38]' : 'bg-[#07091B] text-white'} min-h-screen relative`}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%', boxSizing: 'border-box', position: 'relative' }}>
        {/* ══ Header Superior de Fedor 3° con Logo de Casco ══ */}
        {screen !== 'lesson' && (
          <div style={{ padding: '3.5rem 1rem 0.5rem' }}>
            <BookHeader3ro onOpenIntro={() => setShowLaunchIntro(true)} />
          </div>
        )}

        {/* ══ Current Screen Router ══ */}
        {screen === 'setup' && (
          <SetupScreen3ro onStartAdventure={handleStartAdventure} />
        )}

        {screen === 'home' && (
          <HomeScreen3ro onOpenIntro={() => setShowLaunchIntro(true)} />
        )}

        {screen === 'unit' && <UnitScreen3ro />}
        {screen === 'lesson' && <LessonScreen3ro />}
        {screen === 'problemas' && <ProblemasScreen3ro />}
        {screen === 'results' && <ResultsScreen3ro />}
        {screen === 'estandares' && <EstandaresScreen3ro />}
        {screen === 'definiciones' && <DefinicionesScreen3ro />}
      </div>

      {/* ══ 4 Botones Flotantes y Tab Contenido (visibles fuera de lección activa y setup) ══ */}
      {screen !== 'lesson' && screen !== 'setup' && (
        <Grade3FloatingButtons
          onOpenAiChat={() => setShowAiChat(true)}
          onOpenIntro={() => setShowLaunchIntro(true)}
          onOpenDrawer={() => setShowDrawer(true)}
        />
      )}

      {/* ══ Animación Cinemática de Despegue ══ */}
      {showLaunchIntro && (
        <LaunchIntro3ro onClose={handleLaunchIntroClose} />
      )}

      {/* ══ Popup de Bienvenida (Idéntico a Imagen 2) ══ */}
      {showWelcomeModal && (
        <WelcomeIntroModal3ro
          isOpen={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}

      {/* ══ Asistente IA de Fedor ══ */}
      <AiChatSidebar3ro
        isOpen={showAiChat}
        onClose={() => setShowAiChat(false)}
      />

      {/* ══ Cajón de Navegación Lateral "CONTENIDO" ══ */}
      {showDrawer && (
        <div className="fixed inset-0 z-[99990] flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-[#130B29] border-l border-purple-500/30 p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-purple-800/40 mb-4">
                <h2 className="text-base font-black text-amber-300">
                  📑 Contenido del Libro 3°
                </h2>
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
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
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs rounded-xl cursor-pointer"
              >
                🎬 Ver Intro Cinemática
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowDrawer(false);
                  resetStudent();
                }}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-purple-200 font-black text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
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

export default function Book3Experience({ slug = 'matematicas-fedor-3' }: { slug?: string }) {
  return (
    <Book3Provider slug={slug}>
      <Book3Shell />
    </Book3Provider>
  );
}
