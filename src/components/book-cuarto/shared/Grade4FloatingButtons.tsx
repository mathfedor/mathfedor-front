'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook4 } from '../context/Book4Context';
import Swal from 'sweetalert2';
import CommandPanelModals4to from './CommandPanelModals4to';
import CurriculoModal4to from './CurriculoModal4to';

interface Grade4FloatingButtonsProps {
  onOpenAiChat: () => void;
  onOpenIntro: () => void;
  onOpenGalaxy: () => void;
  onOpenProblemas: () => void;
  onOpenToolModal: (title: string, content: React.ReactNode) => void;
}

interface FloatingToolItem {
  id: string;
  icon: string;
  name: string;
}

const FLOATING_TOOLS_4TO: FloatingToolItem[] = [
  // Fila 1
  { id: 'lab-visual', icon: '🧠', name: 'Laboratorio' },
  { id: 'conteo', icon: '🔢', name: 'Conteo' },
  // Fila 2
  { id: 'mult', icon: '✖️', name: 'Multiplicar' },
  { id: 'lab-est', icon: '🔬', name: 'Lab. Est.' },
  // Fila 3
  { id: 'explicar', icon: '💡', name: 'Explicar' },
  { id: 'videos', icon: '🎬', name: 'Videos' },
  // Fila 4
  { id: 'concepto', icon: '📘', name: 'Concepto' },
  { id: 'desafio', icon: '🎯', name: 'Desafio' },
  // Fila 5
  { id: 'historia', icon: '📜', name: 'Historia' },
  { id: 'guia-docente', icon: '👩‍🏫', name: 'Guia Doc.' },
  // Fila 6
  { id: 'color', icon: '🎨', name: 'Color' },
  { id: 'voz-fem', icon: '🎙️', name: 'Voz Fem.' },
  // Fila 7
  { id: 'curriculo', icon: '📚', name: 'Currículo' },
  { id: 'saber', icon: '🏆', name: 'SABER' },
  // Fila 8
  { id: 'examen', icon: '🎓', name: 'Examen final' },
  { id: 'repaso', icon: '🔄', name: 'Mi Repaso' },
  // Fila 9
  { id: 'logros', icon: '🏆', name: 'Logros' },
  { id: 'minijuegos', icon: '🎮', name: 'Minijuegos' },
  // Fila 10
  { id: 'universo', icon: '🌌', name: 'Universo' },
  { id: 'saber-cotidianos', icon: '🛒', name: 'SABER cotidianos' },
];

export default function Grade4FloatingButtons({
  onOpenAiChat,
  onOpenIntro,
  onOpenGalaxy,
  onOpenProblemas,
  onOpenToolModal,
}: Grade4FloatingButtonsProps) {
  const { goScreen, dark, setDark, student, coins, streak } = useBook4();

  // Offset dinámico para evitar sobreponerse al sidebar de navegación
  const [leftOffset, setLeftOffset] = useState<number>(14);

  // Estados de modales y herramientas
  const [showTools, setShowTools] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [zoomToast, setZoomToast] = useState<string | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceType, setVoiceType] = useState<'fem' | 'def'>('fem');
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);
  const [showCurriculoModal, setShowCurriculoModal] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);
  const saveMenuRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Audio Context y síntesis musical espacial tipo Fedor 4°
  const musicRef = useRef<{
    ctx: AudioContext | null;
    interval: any;
    on: boolean;
  }>({ ctx: null, interval: null, on: false });

  // 1. Detección dinámica del sidebar de navegación
  useEffect(() => {
    const updateOffset = () => {
      const sidebarNav = document.querySelector('nav');
      const sidebarContainer = sidebarNav?.closest('.border-r') || document.querySelector('.border-r.min-h-screen');
      if (sidebarContainer) {
        const rect = sidebarContainer.getBoundingClientRect();
        if (rect.right > 0 && rect.right < window.innerWidth / 2) {
          setLeftOffset(Math.round(rect.right + 14));
          return;
        }
      }
      setLeftOffset(14);
    };

    updateOffset();
    const interval = setInterval(updateOffset, 500);
    window.addEventListener('resize', updateOffset);

    let observer: ResizeObserver | null = null;
    const sidebarNav = document.querySelector('nav');
    const sidebarContainer = sidebarNav?.closest('.border-r') || document.querySelector('.border-r.min-h-screen');
    if (sidebarContainer && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => updateOffset());
      observer.observe(sidebarContainer);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateOffset);
      if (observer) observer.disconnect();
    };
  }, []);

  // 2. Cargar preferencia de sonido guardada
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fedor4_sound') || localStorage.getItem('fedor2_sound');
      if (saved) {
        setSoundEnabled(saved === 'on');
      }
    } catch {}
  }, []);

  // 3. Cerrar menús al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        const fab = document.getElementById('p3Fab');
        if (!fab || !fab.contains(event.target as Node)) {
          setShowTools(false);
        }
      }
      if (saveMenuRef.current && !saveMenuRef.current.contains(event.target as Node)) {
        const saveBtn = document.getElementById('f4SaveBtn');
        if (!saveBtn || !saveBtn.contains(event.target as Node)) {
          setShowSaveMenu(false);
        }
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        const gearBtn = document.getElementById('f4GearBtn');
        if (!gearBtn || !gearBtn.contains(event.target as Node)) {
          setShowSettings(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Síntesis musical relajante tipo Fedor espacial
  const toggleMusic = () => {
    if (musicEnabled) {
      if (musicRef.current.interval) {
        clearInterval(musicRef.current.interval);
        musicRef.current.interval = null;
      }
      setMusicEnabled(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!musicRef.current.ctx) {
          musicRef.current.ctx = new AudioCtx();
        }
        const c = musicRef.current.ctx;
        if (c.state === 'suspended') {
          c.resume();
        }
        musicRef.current.on = true;
        setMusicEnabled(true);
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        musicRef.current.interval = setInterval(() => {
          if (!musicRef.current.on || !c) return;
          try {
            const freq = notes[Math.floor(Math.random() * notes.length)] / 2;
            const o = c.createOscillator();
            const g = c.createGain();
            o.type = 'sine';
            o.frequency.value = freq;
            g.gain.value = 0;
            o.connect(g);
            g.connect(c.destination);
            const t = c.currentTime;
            g.gain.linearRampToValueAtTime(0.045, t + 0.4);
            g.gain.linearRampToValueAtTime(0, t + 2.6);
            o.start(t);
            o.stop(t + 2.7);
          } catch (err) {
            console.warn('Audio synth note error:', err);
          }
        }, 1400);
      } catch (err) {
        console.warn('AudioContext no compatible:', err);
      }
    }
  };

  // Toggle de sonido con retroalimentación sonora
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('fedor4_sound', next ? 'on' : 'off');
        localStorage.setItem('fedor2_sound', next ? 'on' : 'off');
      } catch {}
      if (next) {
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 660;
            gain.gain.value = 0.08;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
            osc.stop(ctx.currentTime + 0.16);
          }
        } catch {}
      }
      return next;
    });
  };

  const handleToolClick = (toolId: string) => {
    setShowTools(false);
    if (toolId === 'universo') {
      onOpenGalaxy();
      return;
    }
    setActiveToolModal(toolId);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => {
      const next = Math.max(80, Math.min(130, prev + delta * 10));
      document.documentElement.style.fontSize = `${(next / 100) * 16}px`;
      setZoomToast(`Zoom: ${next}%`);
      setTimeout(() => setZoomToast(null), 1400);
      return next;
    });
  };

  const handleExport = () => {
    try {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.toLowerCase().includes('fedor')) {
          data[k] = localStorage.getItem(k) || '';
        }
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fedor4_progreso_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      Swal.fire({
        icon: 'success',
        title: '¡Progreso Descargado!',
        text: 'Tu archivo de respaldo se guardó con éxito.',
        confirmButtonColor: '#5C21A6',
      });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo exportar el progreso.' });
    }
  };

  const handleImport = () => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json,application/json';
    inp.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          Object.keys(parsed).forEach((k) => {
            localStorage.setItem(k, parsed[k]);
          });
          Swal.fire({
            icon: 'success',
            title: '¡Progreso Restaurado!',
            text: 'Tu información ha sido cargada correctamente.',
            confirmButtonColor: '#5C21A6',
          }).then(() => {
            window.location.reload();
          });
        } catch {
          Swal.fire({ icon: 'error', title: 'Archivo inválido', text: 'No se pudo leer el archivo JSON.' });
        }
      };
      reader.readAsText(file);
    };
    inp.click();
  };

  const speakScreen = () => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const mainEl = document.querySelector('main') || document.body;
        const text = mainEl.innerText.slice(0, 450);
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* ═════════════════════════════════════════════════════════════
          1. BARRA FLOTANTE DE LA IZQUIERDA (8 BOTONES FIELES AL HTML ORIGINAL)
      ═════════════════════════════════════════════════════════════ */}
      <div
        className="f4-toolbar-container"
        style={{ left: `${leftOffset}px` }}
      >
        {/* Botón 1: A+ Aumentar Letra */}
        <button
          type="button"
          className="f4-font-btn"
          onClick={() => handleZoom(1)}
          title="Aumentar tamaño de letra (A+)"
        >
          <span>A+</span>
        </button>

        {/* Botón 2: A- Disminuir Letra */}
        <button
          type="button"
          className="f4-font-btn"
          onClick={() => handleZoom(-1)}
          title="Disminuir tamaño de letra (A-)"
        >
          <span>A−</span>
        </button>

        {/* Botón 3: Modo Noche on/off */}
        <button
          type="button"
          className={`f4-tool-circle-btn ${dark ? 'dark-active' : ''}`}
          onClick={() => setDark(!dark)}
          title={dark ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
        >
          <span className="text-xl">🌙</span>
        </button>

        {/* Botón 4: Música on/off */}
        <button
          type="button"
          className={`f4-tool-circle-btn ${musicEnabled ? 'music-active' : ''}`}
          onClick={toggleMusic}
          title={musicEnabled ? 'Apagar música espacial' : 'Encender música espacial'}
        >
          <span>{musicEnabled ? '🎶' : '🎵'}</span>
        </button>

        {/* Botón 5: Trofeos · Vitrina de trofeos */}
        <button
          type="button"
          className="f4-tool-circle-btn"
          onClick={() => setActiveToolModal('trofeos')}
          title="Vitrina de trofeos"
        >
          <span>🏆</span>
        </button>

        {/* Botón 6: Mi repaso (Ícono azul de flechas circulares) */}
        <button
          type="button"
          className="f4-tool-circle-btn"
          onClick={() => setActiveToolModal('repaso')}
          title="Mi Repaso personalizado"
        >
          <div className="w-5 h-5 rounded-[5px] bg-[#3B82F6] flex items-center justify-center text-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
            >
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </div>
        </button>

        {/* Botón 7: Guardar / Restaurar progreso */}
        <button
          type="button"
          id="f4SaveBtn"
          className="f4-tool-circle-btn"
          onClick={() => {
            setShowSaveMenu((prev) => !prev);
            setShowSettings(false);
          }}
          title="Guardar o restaurar progreso"
        >
          <span className="text-xl">💾</span>
        </button>

        {/* Botón 8: Engrane de Ajustes */}
        <button
          type="button"
          id="f4GearBtn"
          className="f4-gear-btn"
          onClick={() => {
            setShowSettings((prev) => !prev);
            setShowSaveMenu(false);
          }}
          title="Ajustes y configuración"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7 text-[#EDE9FE] drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] transition-transform duration-300"
          >
            <path
              fillRule="evenodd"
              d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.14 5.385a1.875 1.875 0 00-2.282.819l-.986 1.708a1.875 1.875 0 00.41 2.408l1.042.844c.105.085.158.232.13.392a7.484 7.484 0 000 1.144c.028.16-.025.307-.13.392l-1.042.844a1.875 1.875 0 00-.41 2.408l.986 1.708c.53.918 1.637 1.29 2.282.819l1.177-.505c.116-.043.284-.032.45.083.313.217.643.41.986.57.182.088.277.228.297.348l.178 1.072c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.115-.26.297-.348.343-.16.673-.353.986-.57.166-.115.334-.126.45-.083l1.177.505c.645.471 1.752.1 2.282-.819l.986-1.708a1.875 1.875 0 00-.41-2.408l-1.042-.844c-.105-.085-.158-.232-.13-.392a7.484 7.484 0 000-1.144c-.028-.16.025-.307.13-.392l1.042-.844a1.875 1.875 0 00.41-2.408l-.986-1.708a1.875 1.875 0 00-2.282-.819l-1.177.505c-.116.043-.284.032-.45-.083a7.493 7.493 0 00-.986-.57c-.182-.088-.277-.228-.297-.348l-.178-1.072a1.875 1.875 0 00-1.85-1.567h-1.844zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* ══ Menú Desplegable Guardar Progreso (a la derecha de la barra flotante) ══ */}
      {showSaveMenu && (
        <div
          ref={saveMenuRef}
          className="f4-save-menu"
          style={{ left: `${leftOffset + 54}px` }}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-100">
            <span className="text-[11px] font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>💾</span> Progreso de 4°
            </span>
            <button
              type="button"
              onClick={() => setShowSaveMenu(false)}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold leading-none cursor-pointer p-1"
            >
              ✕
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowSaveMenu(false);
              handleExport();
            }}
            className="w-full mb-2 bg-[#5C21A6] hover:bg-[#4D1A8C] text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <span>⬇</span>
            <span>Descargar respaldo (.json)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowSaveMenu(false);
              handleImport();
            }}
            className="w-full mb-2 bg-[#0D9488] hover:bg-[#0B7A70] text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <span>⬆</span>
            <span>Cargar respaldo (.json)</span>
          </button>
          <div className="pt-2 mt-1 border-t border-purple-100 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => {
                setShowSaveMenu(false);
                setShowCurriculoModal(true);
              }}
              className="w-full text-left py-1.5 px-2 rounded-lg text-[11px] font-bold text-purple-900 hover:bg-purple-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>📚</span> Currículo MEN 4°
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSaveMenu(false);
                speakScreen();
              }}
              className="w-full text-left py-1.5 px-2 rounded-lg text-[11px] font-bold text-purple-900 hover:bg-purple-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>🔈</span> Escuchar pantalla
            </button>
          </div>
        </div>
      )}

      {/* ══ Menú Desplegable Ajustes (a la derecha de la barra flotante de la izquierda) ══ */}
      {showSettings && (
        <div
          ref={settingsRef}
          id="f5AjustesMenu"
          className="f4-ajustes-menu"
          style={{ left: `${leftOffset + 54}px` }}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F5C518]/30">
            <button
              type="button"
              onClick={() => {
                setShowSettings(false);
                setShowCurriculoModal(true);
              }}
              className="text-xs font-black text-[#FFE066] hover:text-white uppercase tracking-wider flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0 text-left transition-colors"
              title="Abrir Currículo MEN"
            >
              <span>⚙️</span> AJUSTES 4°
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-gray-300 hover:text-white text-xs font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1 text-xs">
            <button
              type="button"
              className="f5-aj-btn"
              style={{
                background: 'linear-gradient(135deg, #5C21A6, #3D1468)',
                borderColor: '#F5C518',
                color: '#FFE066',
                fontWeight: 800,
              }}
              onClick={() => {
                setShowSettings(false);
                setShowCurriculoModal(true);
              }}
            >
              ⚙️ Ajustes y configuración
            </button>

            <button
              type="button"
              className="f5-aj-btn"
              onClick={() => {
                setShowSettings(false);
                setShowCurriculoModal(true);
              }}
            >
              📚 Currículo MEN · Grado 4°
            </button>

            <div style={{ height: 1, background: 'rgba(245,197,24,.35)', margin: '6px 0' }} />

            <button
              type="button"
              className="f5-aj-btn"
              onClick={() => toggleMusic()}
            >
              {musicEnabled ? '🎶 Música: Encendida' : '🎵 Música: Apagada'}
            </button>

            <button
              type="button"
              className="f5-aj-btn"
              onClick={toggleSound}
            >
              {soundEnabled ? '🔊 Sonidos: Sí' : '🔇 Sonidos: No'}
            </button>

            <button
              type="button"
              className="f5-aj-btn"
              onClick={() => setVoiceType(voiceType === 'fem' ? 'def' : 'fem')}
            >
              {voiceType === 'fem' ? '🎙️ Voz: Femenina' : '🎙️ Voz: Estándar'}
            </button>

            <button
              type="button"
              className="f5-aj-btn"
              onClick={() => {
                setShowSettings(false);
                speakScreen();
              }}
            >
              🔈 Escuchar pantalla
            </button>

            <div style={{ height: 1, background: 'rgba(245,197,24,.35)', margin: '6px 0' }} />

            <button
              type="button"
              className="f5-aj-btn"
              onClick={() => {
                setShowSettings(false);
                handleExport();
              }}
            >
              ⬇ Exportar progreso
            </button>

            <button
              type="button"
              className="f5-aj-btn"
              onClick={() => {
                setShowSettings(false);
                handleImport();
              }}
            >
              ⬆ Importar progreso
            </button>
          </div>
        </div>
      )}

      {/* ══ Toast indicador de Zoom ══ */}
      {zoomToast && (
        <div
          className="f4-zoom-toast"
          style={{ left: `${leftOffset + 54}px` }}
        >
          🔍 {zoomToast}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          2. BOTÓN FLOTANTE DERECHA: #p3Fab con .f4-fab-ancho (Original 4°)
      ═════════════════════════════════════════════════════════════ */}
      <button
        type="button"
        id="p3Fab"
        className="f4-fab-ancho"
        onClick={() => {
          setShowTools((prev) => !prev);
          setShowSaveMenu(false);
          setShowSettings(false);
        }}
        title="Herramientas y recursos"
      >
        <span>🛠️</span>
        <span>Menu</span>
      </button>

      {/* ══ Botón Flotante Sonido (debajo de #p3Fab en la parte superior derecha - Imagen 2) ══ */}
      <button
        type="button"
        id="f4SoundToggleBtn"
        className="f4-sound-toggle-btn"
        onClick={toggleSound}
        title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
        aria-label="Toggle Sonido"
      >
        <span>{soundEnabled ? '🔊' : '🔇'}</span>
      </button>

      {/* ══ Botones Flotantes Inferior Derecha (Álbum de Stickers y Minijuegos - Imagen 1) ══ */}
      <div id="f4BottomRightFabGroup" className="f4-bottom-right-group">
        {/* Botón 1 (Superior): Álbum de Stickers (📔) */}
        <button
          type="button"
          className="f4-action-fab f4-fab-stickers"
          onClick={() => setActiveToolModal('stickers')}
          title="Mi Álbum de Stickers"
          aria-label="Mi Álbum de Stickers"
        >
          <span className="f4-fab-icon">📔</span>
        </button>

        {/* Botón 2 (Inferior): Minijuegos (🎮) */}
        <button
          type="button"
          className="f4-action-fab f4-fab-minijuegos"
          onClick={() => setActiveToolModal('minijuegos')}
          title="Mini-juegos 4°"
          aria-label="Mini-juegos 4°"
        >
          <span className="f4-fab-icon">🎮</span>
        </button>
      </div>

      {/* Menú Flotante #p3Popup fiel a la imagen (20 herramientas en 2 columnas) */}
      {showTools && (
        <div id="p3Popup" ref={toolsRef} className="open">
          <div className="p3-popup-title">HERRAMIENTAS</div>
          <div className="p3-popup-grid">
            {FLOATING_TOOLS_4TO.map((t) => (
              <button
                key={t.id}
                type="button"
                className="btn3d"
                onClick={() => handleToolClick(t.id)}
                title={t.name}
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══ Modal de Herramientas de 4° Grado ══ */}
      {activeToolModal && (
        <CommandPanelModals4to
          activeTool={activeToolModal}
          onClose={() => setActiveToolModal(null)}
          onOpenIntro={onOpenIntro}
          onOpenProblemas={onOpenProblemas}
        />
      )}

      {/* ══ Modal de Currículo MEN · Grado 4° (Popup oficial) ══ */}
      <CurriculoModal4to
        isOpen={showCurriculoModal}
        onClose={() => setShowCurriculoModal(false)}
      />

      {/* ═════════════════════════════════════════════════════════════
          3. SELLO DE VERSIÓN: #f5VerStamp (Original 4°)
      ═════════════════════════════════════════════════════════════ */}
      <div id="f5VerStamp">
        Fedor 4° · v2026.09.27
      </div>

      <style>{`
        /* ══════════════════════════════════════════════════════════════
           TOOLBAR FLOTANTE A LA IZQUIERDA (Original HTML Grado 4°)
        ══════════════════════════════════════════════════════════════ */
        .f4-toolbar-container {
          position: fixed;
          bottom: 16px;
          z-index: 9990;
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: calc(100vh - 32px);
          overflow-y: auto;
          overflow-x: visible;
          scrollbar-width: none;
          padding: 4px;
        }

        .f4-toolbar-container::-webkit-scrollbar {
          display: none;
        }

        /* Botones de tamaño de letra A+ y A- (Squircle) */
        .f4-font-btn {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #ffffff;
          border: 2px solid #C4B5FD;
          color: #1E40AF;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(108, 40, 180, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.05);
          transition: transform 0.15s ease, background 0.15s ease;
          font-family: 'Nunito', sans-serif;
          user-select: none;
        }

        .f4-font-btn:hover {
          transform: scale(1.06);
          background: #f7f4ff;
          border-color: #8b3edb;
        }

        .f4-font-btn:active {
          transform: scale(0.96);
        }

        /* Botones circulares flotantes de la izquierda */
        .f4-tool-circle-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #C4B5FD;
          color: #1E40AF;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(108, 40, 180, 0.16), inset 0 -2px 4px rgba(0, 0, 0, 0.05);
          transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
          user-select: none;
        }

        .f4-tool-circle-btn:hover {
          transform: scale(1.08);
          background: #f7f4ff;
          border-color: #8b3edb;
        }

        .f4-tool-circle-btn:active {
          transform: scale(0.96);
        }

        .f4-tool-circle-btn.music-active {
          border-color: #10B981;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
        }

        .f4-tool-circle-btn.dark-active {
          border-color: #F59E0B;
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
        }

        /* Botón 8: Engrane circular dorado/naranja */
        .f4-gear-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F5A524 0%, #E8650A 100%);
          border: 3px solid #FFE066;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(232, 101, 10, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.4);
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
          user-select: none;
          margin-top: 2px;
        }

        .f4-gear-btn:hover {
          transform: scale(1.1) rotate(25deg);
          box-shadow: 0 8px 24px rgba(232, 101, 10, 0.6), inset 0 2px 6px rgba(255, 255, 255, 0.6);
        }

        .f4-gear-btn:active {
          transform: scale(0.95);
        }

        /* Menú desplegable de Guardar Progreso */
        .f4-save-menu {
          position: fixed;
          bottom: 48px;
          z-index: 9995;
          width: 220px;
          background: #ffffff;
          border: 2px solid #5C21A6;
          border-radius: 16px;
          padding: 12px;
          box-shadow: 0 12px 32px rgba(44, 16, 112, 0.35);
          font-family: 'Nunito', sans-serif;
          animation: fadeIn 0.18s ease-out;
        }

        /* Menú desplegable de Ajustes */
        .f4-ajustes-menu {
          position: fixed;
          bottom: 16px;
          z-index: 9995;
          width: 228px;
          background: linear-gradient(135deg, rgba(42, 15, 96, 0.98), rgba(26, 10, 60, 0.98));
          border: 2px solid #F5C518;
          border-radius: 18px;
          padding: 12px;
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.55);
          font-family: 'Nunito', sans-serif;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.18s ease-out;
        }

        .f5-aj-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 8px 11px;
          background: #2A0F60;
          color: #F0EDFF;
          border: 1px solid #6C28B4;
          border-radius: 10px;
          font-weight: 800;
          font-size: 11.5px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          transition: all 0.15s ease;
        }

        .f5-aj-btn:hover {
          background: #3D1468;
          border-color: #F5C518;
          color: #FFE066;
          transform: translateX(2px);
        }

        /* Toast de Zoom */
        .f4-zoom-toast {
          position: fixed;
          bottom: 240px;
          z-index: 9998;
          background: linear-gradient(135deg, #F5C518, #FF8C2A);
          color: #2A0F60;
          font-size: 13px;
          font-weight: 900;
          padding: 6px 14px;
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(245, 197, 24, 0.45);
          font-family: 'Nunito', sans-serif;
          animation: fadeIn 0.2s ease-out;
          pointer-events: none;
        }

        /* ══════════════════════════════════════════════════════════════
           BOTÓN DERECHA: #p3Fab y Popup #p3Popup (Original 4°)
        ══════════════════════════════════════════════════════════════ */
        #p3Fab.f4-fab-ancho {
          position: fixed;
          right: 14px;
          top: 96px;
          z-index: 9990;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          width: 84px;
          min-height: 56px;
          border-radius: 18px;
          background: #ffffff;
          border: 2px solid #8b3edb;
          color: #3d1468;
          box-shadow: 0 8px 24px rgba(61, 20, 104, 0.22);
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
          font-family: 'Nunito', sans-serif;
        }

        #p3Fab.f4-fab-ancho:hover {
          transform: scale(1.06);
          background: #f7f4ff;
        }

        #p3Fab.f4-fab-ancho span:first-child {
          font-size: 22px;
          line-height: 1;
        }

        #p3Fab.f4-fab-ancho span:last-child {
          font-size: 10px;
          font-weight: 900;
          color: #6c28b4;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* ══════════════════════════════════════════════════════════════
           BOTÓN SUPERIOR DERECHO: Sonido (Debajo de #p3Fab - Imagen 2)
        ══════════════════════════════════════════════════════════════ */
        .f4-sound-toggle-btn {
          position: fixed;
          top: 164px;
          right: 34px;
          z-index: 9989;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #C5BFEE;
          box-shadow: 0 4px 14px rgba(44, 16, 112, 0.18), inset 0 1px 2px rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 19px;
          line-height: 1;
          transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.15s, box-shadow 0.18s;
          user-select: none;
        }

        .f4-sound-toggle-btn:hover {
          transform: scale(1.08);
          background-color: #f7f4ff;
          box-shadow: 0 6px 18px rgba(44, 16, 112, 0.25);
        }

        .f4-sound-toggle-btn:active {
          transform: scale(0.95);
        }

        /* ══════════════════════════════════════════════════════════════
           BOTONES INFERIOR DERECHA: Álbum y Minijuegos (Sobre reCAPTCHA - Imagen 1)
        ══════════════════════════════════════════════════════════════ */
        .f4-bottom-right-group {
          position: fixed;
          right: 18px;
          bottom: 84px;
          z-index: 9980;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .f4-action-fab {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2.5px solid rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s, filter 0.15s;
          user-select: none;
        }

        .f4-action-fab:hover {
          transform: scale(1.08) translateY(-2px);
          filter: brightness(1.06);
        }

        .f4-action-fab:active {
          transform: scale(0.95);
        }

        .f4-fab-stickers {
          background: linear-gradient(135deg, #A855F7, #EC4899);
          box-shadow: 0 6px 18px rgba(236, 72, 153, 0.45), 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .f4-fab-minijuegos {
          background: linear-gradient(135deg, #7C3AED, #6366F1);
          box-shadow: 0 6px 18px rgba(124, 58, 237, 0.45), 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .f4-fab-icon {
          font-size: 25px;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
        }

        /* Popup de Herramientas */
        #p3Popup.open {
          position: fixed;
          right: 84px;
          top: 60px;
          z-index: 9991;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #251347;
          border: 2px solid #5C2B92;
          border-radius: 24px;
          padding: 14px 10px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
          width: 250px;
          max-height: calc(100vh - 80px);
          overflow-y: auto;
          overflow-x: hidden;
          font-family: 'Nunito', sans-serif;
          animation: fadeIn 0.2s ease-out;
        }

        #p3Popup::-webkit-scrollbar {
          width: 4px;
        }
        #p3Popup::-webkit-scrollbar-thumb {
          background: #5C2B92;
          border-radius: 4px;
        }

        .p3-popup-title {
          font-size: 11px;
          font-weight: 900;
          color: #FFE066;
          letter-spacing: 0.14em;
          text-align: center;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .p3-popup-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          width: 100%;
        }

        #p3Popup .btn3d {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 8px 4px;
          background: #ffffff;
          border: 1.5px solid rgba(108, 40, 180, 0.35);
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.12s ease, background 0.12s ease;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
        }

        #p3Popup .btn3d:hover {
          transform: translateY(-2px);
          background: #FAF8FF;
          border-color: #8b3edb;
        }

        #p3Popup .btn3d span:first-child {
          font-size: 24px;
          line-height: 1;
        }

        #p3Popup .btn3d span:last-child {
          font-size: 9.5px;
          font-weight: 800;
          color: #3D1468;
          text-align: center;
          line-height: 1.15;
          font-family: 'Nunito', sans-serif;
        }

        /* Sello de versión #f5VerStamp */
        #f5VerStamp {
          position: fixed;
          right: 8px;
          bottom: 3px;
          z-index: 9980;
          font-size: 10px;
          font-weight: 800;
          color: rgba(92, 33, 166, 0.6);
          background: rgba(255, 255, 255, 0.7);
          padding: 1px 8px;
          border-radius: 8px;
          pointer-events: none;
          font-family: 'Nunito', sans-serif;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          #p3Fab.f4-fab-ancho {
            right: 10px;
            top: auto;
            bottom: 16px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
          #p3Fab.f4-fab-ancho span:last-child {
            display: none;
          }
          .f4-sound-toggle-btn {
            top: 14px;
            right: 14px;
            width: 38px;
            height: 38px;
            font-size: 16px;
          }
          .f4-bottom-right-group {
            right: 12px;
            bottom: 76px;
            gap: 8px;
          }
          .f4-action-fab {
            width: 44px;
            height: 44px;
          }
          #p3Popup.open {
            right: 10px;
            left: 10px;
            top: auto;
            bottom: 78px;
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </>
  );
}
