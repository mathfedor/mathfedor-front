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
import ConceptosFedorModal from './shared/ConceptosFedorModal';
import StickerAlbumModal from './shared/StickerAlbumModal';
import PwaRegister from './shared/PwaRegister';
import InstallPrompt from './shared/InstallPrompt';
import BookHeader from './shared/BookHeader';
import LaunchIntro from './shared/LaunchIntro';
import StatsLab from './games/StatsLab';
import MultiplicationTables from './games/MultiplicationTables';

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

  // Hide AI floating button when inside active lesson and galaxy map screens
  const showFloatingChatButton = !loading && screen !== 'lesson' && screen !== 'galaxy';

  return (
    <div className={`fedor-book${dark ? ' dark' : ''}`}>
      <PwaRegister />
      <div className="app">
        {!loading && <BookHeader onOpenIntro={() => setShowIntro(true)} />}
        <BookRouter />
      </div>
      {isGrade1 ? <Grade1FloatingButtons /> : <FloatingQuickActions />}

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
function Grade1FloatingButtons() {
  const { screen, goScreen, openGameShortcut, grantReward } = useBook();
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [showJuegosPicker, setShowJuegosPicker] = useState(false);
  const [showStatsLab, setShowStatsLab] = useState(false);
  const [showTablas, setShowTablas] = useState(false);
  const [showConceptos, setShowConceptos] = useState(false);
  const [showStickers, setShowStickers] = useState(false);

  const hidden = screen === 'lesson' || screen === 'galaxy';
  if (hidden) return null;

  const handleMascotClick = () => {
    const messages = [
      "¡Hola! Soy Fedor. ¡Bienvenido a tu viaje matemático! 🚀",
      "¡Intenta resolver los retos para ganar monedas! 🪙",
      "¿Sabías que puedes personalizar tu astronauta en el perfil? 🧑‍🚀",
      "¡Usa la recta numérica para sumar y restar más fácil! 📏",
      "¡No olvides revisar tu reporte diario para ver tu progreso! 📊"
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setBubbleText(randomMsg);
    setTimeout(() => {
      setBubbleText(null);
    }, 4500);
  };

  const handleGameSelect = (gameId: 'stats' | 'tablas' | 'conteo' | 'retos1') => {
    setShowJuegosPicker(false);
    if (gameId === 'stats') {
      setShowStatsLab(true);
    } else if (gameId === 'tablas') {
      setShowTablas(true);
    } else {
      openGameShortcut(gameId);
    }
  };

  return (
    <>
      {/* Botón Mascota (Dinosaurio) */}
      <button 
        type="button"
        className="kj1-mascot" 
        onClick={handleMascotClick}
        title="Hablar con Fedor"
      >
        🐉
      </button>

      {/* Globo de texto de la Mascota */}
      {bubbleText && (
        <div className="kj1-bubble">
          {bubbleText}
        </div>
      )}

      {/* Botón Gamepad */}
      <button
        type="button"
        className="f1-gamepad-btn"
        onClick={() => setShowJuegosPicker(true)}
        title="Juegos de Fedor"
      >
        🎮
      </button>

      {/* Botón Mi Álbum de stickers */}
      <button
        type="button"
        className="kj1-stickerbook-btn"
        onClick={() => setShowStickers(true)}
        title="Mi Álbum de stickers"
      >
        📔
      </button>

      {/* Botón Conceptos (Libros) */}
      <button
        type="button"
        className="f1-concept-btn"
        onClick={() => setShowConceptos(true)}
        title="Conceptos Fedor"
      >
        📚
      </button>

      {/* Botón Tablas */}
      <button
        type="button"
        className="f1-tablas-btn"
        onClick={() => setShowTablas(true)}
        title="Tablas de Multiplicar"
      >
        🔢
      </button>

      {/* Botón Lab */}
      <button
        type="button"
        className="f1-lab-btn"
        onClick={() => setShowStatsLab(true)}
        title="Laboratorio de Estadística"
      >
        🧪
      </button>

      {/* Modal Picker Juegos de 1° */}
      {showJuegosPicker && (
        <div className="jg-picker-overlay" onClick={() => setShowJuegosPicker(false)}>
          <div className="jg-picker-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button"
              className="jg-picker-close" 
              onClick={() => setShowJuegosPicker(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>
            <div className="jg-picker-header">
              <div className="jg-picker-emoji">🎮</div>
              <div className="jg-picker-title">Juegos de 1°</div>
              <div className="jg-picker-subtitle">Practica jugando y aprende más</div>
            </div>
            <div className="jg-picker-grid">
              {/* Laboratorio de Estadística */}
              <button
                type="button"
                className="jg-picker-item"
                style={{ background: 'linear-gradient(135deg,#F8F5FF,#EEEDFE)', borderColor: '#C5BFEE', color: '#3D1468' }}
                onClick={() => handleGameSelect('stats')}
              >
                <span className="jg-picker-item-icon">🧪</span>
                <div className="jg-picker-item-body">
                  <div className="jg-picker-item-title">Laboratorio de Estadística</div>
                  <div className="jg-picker-item-desc">Mete datos y crea gráficos</div>
                </div>
                <span className="jg-picker-item-arrow">›</span>
              </button>

              {/* Tablas Mágicas */}
              <button
                type="button"
                className="jg-picker-item"
                style={{ background: 'linear-gradient(135deg,#FEF0E6,#FFE2C8)', borderColor: '#FBBF7A', color: '#7A3200' }}
                onClick={() => handleGameSelect('tablas')}
              >
                <span className="jg-picker-item-icon">📊</span>
                <div className="jg-picker-item-body">
                  <div className="jg-picker-item-title">Tablas Mágicas</div>
                  <div className="jg-picker-item-desc">Practica las tablas del 1 al 10</div>
                </div>
                <span className="jg-picker-item-arrow">›</span>
              </button>

              {/* Tablas de Conteo */}
              <button
                type="button"
                className="jg-picker-item"
                style={{ background: 'linear-gradient(135deg,#DCF5EE,#B8F0DE)', borderColor: '#8FD9C0', color: '#074F3A' }}
                onClick={() => handleGameSelect('conteo')}
              >
                <span className="jg-picker-item-icon">🔢</span>
                <div className="jg-picker-item-body">
                  <div className="jg-picker-item-title">Tablas de Conteo</div>
                  <div className="jg-picker-item-desc">Conteo 1-10, 1-20, 1-50, 1-100</div>
                </div>
                <span className="jg-picker-item-arrow">›</span>
              </button>

              {/* Retos Matemáticos */}
              <button
                type="button"
                className="jg-picker-item"
                style={{ background: 'linear-gradient(135deg,#FAECE7,#F5C7B8)', borderColor: '#F5B09A', color: '#7A1B00' }}
                onClick={() => handleGameSelect('retos1')}
              >
                <span className="jg-picker-item-icon">🎯</span>
                <div className="jg-picker-item-body">
                  <div className="jg-picker-item-title">Retos Matemáticos</div>
                  <div className="jg-picker-item-desc">Pon a prueba tu velocidad</div>
                </div>
                <span className="jg-picker-item-arrow">›</span>
              </button>
            </div>
          </div>
        </div>
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
