'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fedorSpeak } from './Grade3Speech';
import {
  SHOP_V2_ITEMS_3RO,
  ShopV2Item3ro,
  STICKERS_3RO,
  EST_DATA_3RO,
  DEF_DATA_3RO,
  EXPL_DATA_3RO,
  EXAM_QUESTIONS_3RO,
  DEFAULT_DAILY_MISSIONS_3RO,
  DailyMission3ro,
  ExplStepItem,
  ExplSubcategory,
} from './commandPanelData';

function triggerConfetti() {
  if (typeof window === 'undefined') return;
  const anyWin = window as unknown as { confetti?: () => void; kjConfetti?: (n: number) => void };
  if (typeof anyWin.confetti === 'function') {
    try { anyWin.confetti(); } catch {}
  } else if (typeof anyWin.kjConfetti === 'function') {
    try { anyWin.kjConfetti(40); } catch {}
  }
}

// Simple Web Audio synthesizer for tactile sound feedback
function playSound(type: 'click' | 'correct' | 'wrong' | 'fanfare' | 'coin') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'coin') {
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } else if (type === 'correct') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'fanfare') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        g.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.2);
        o.start(ctx.currentTime + idx * 0.1);
        o.stop(ctx.currentTime + idx * 0.1 + 0.22);
      });
    }
  } catch {
    // Ignore audio failures
  }
}

const CORAZONES_PROBLEMS = [
  { total: 18, kids: 3, cols: 6 }, // 18 / 3 = 6 (Exacto a la imagen: 3 filas de 6 corazones)
  { total: 12, kids: 3, cols: 4 }, // 12 / 3 = 4 (3 filas de 4 corazones)
  { total: 15, kids: 3, cols: 5 }, // 15 / 3 = 5 (3 filas de 5 corazones)
  { total: 20, kids: 4, cols: 5 }, // 20 / 4 = 5 (4 filas de 5 corazones)
  { total: 16, kids: 2, cols: 8 }, // 16 / 2 = 8 (2 filas de 8 corazones)
];

const RELOJ_PROBLEMS = [
  { question: '¿Cuántos segundos hay en 1 minutos?', answer: 60, explanation: '1 minuto = 60 segundos' },
  { question: '¿Cuántos minutos hay en 1 hora?', answer: 60, explanation: '1 hora = 60 minutos' },
  { question: '¿Cuántos segundos hay en 2 minutos?', answer: 120, explanation: '2 × 60 = 120 segundos' },
  { question: '¿Cuántas horas hay en 1 día?', answer: 24, explanation: '1 día = 24 horas' },
  { question: '¿Cuántos minutos hay en 2 horas?', answer: 120, explanation: '2 × 60 = 120 minutos' },
  { question: '¿Cuántos minutos son 180 segundos?', answer: 3, explanation: '180 ÷ 60 = 3 minutos' },
  { question: '¿Cuántas horas son 120 minutos?', answer: 2, explanation: '120 ÷ 60 = 2 horas' },
  { question: '¿Cuántos minutos hay en media hora?', answer: 30, explanation: 'Media hora = 30 minutos' },
];

const TIENDA_MATH_PROBLEMS = [
  { item: 'un borrador', price: 700, paid: 1000, answer: 300 }, // Exacto a la imagen
  { item: 'un cuaderno', price: 1500, paid: 2000, answer: 500 },
  { item: 'una caja de colores', price: 3200, paid: 5000, answer: 1800 },
  { item: 'un lápiz', price: 400, paid: 1000, answer: 600 },
  { item: 'una regla', price: 800, paid: 1000, answer: 200 },
  { item: 'un sacapuntas', price: 1200, paid: 2000, answer: 800 },
  { item: 'un marcador', price: 2500, paid: 5000, answer: 2500 },
];

const BADGES_TERCERO = [
  { id: 'b_decena', icon: '🔟', name: 'Maestro de la Decena', desc: 'Completa Conteo y Secuencias N1' },
  { id: 'b_docena', icon: '🥚', name: 'Cazador de la Docena', desc: 'Cuenta correctamente hasta 12' },
  { id: 'b_pares', icon: '🐲', name: 'Conoce a Negoran', desc: 'Clasifica 5 números pares e impares' },
  { id: 'b_decimal', icon: '💯', name: 'Capitán del Sistema Decimal', desc: 'Domina la descomposición' },
  { id: 'b_millon', icon: '🏆', name: 'Explorador del Millón', desc: 'Lee correctamente un número de 7 cifras' },
  { id: 'b_tienda', icon: '🏪', name: 'Vendedor de la Tienda de Math', desc: 'Resuelve 3 problemas de la tienda' },
  { id: 'b_resta', icon: '➖', name: 'Resta sin Préstamo', desc: 'Completa 10 restas sin pedir' },
  { id: 'b_prestamo', icon: '🔄', name: 'Maestro del Préstamo', desc: 'Hace 5 restas con préstamo seguidas' },
  { id: 'b_reloj', icon: '🕒', name: 'Guardián del Reloj', desc: 'Domina horas, minutos y segundos' },
  { id: 'b_tablas', icon: '📚', name: 'Tabla Mágica Encontrada', desc: 'Aprueba todas las tablas hasta el 9' },
  { id: 'b_repartir', icon: '💗', name: 'Reparte como Math', desc: 'Resuelve 10 divisiones exactas' },
  { id: 'b_residuo', icon: '❓', name: 'Detector de Residuos', desc: 'Halla el residuo en 5 divisiones inexactas' },
  { id: 'b_fiesta', icon: '🎉', name: 'Anfitrión de la Fiesta', desc: 'Reparte el costo entre estudiantes' },
  { id: 'b_saber', icon: '🎯', name: 'Pre-SABER', desc: 'Resuelve 3 problemas tipo prueba SABER' },
  { id: 'b_perfecto', icon: '⭐', name: 'Nivel Perfecto', desc: 'Completa un nivel con todas correctas' },
  { id: 'b_racha7', icon: '🔥', name: 'Racha de 7', desc: '7 días consecutivos jugando' },
  { id: 'b_galaxia', icon: '🌌', name: 'Viajero Galáctico', desc: 'Visita los planetas del libro' },
  { id: 'b_universo', icon: '🚀', name: 'Conquistador del Universo', desc: 'Termina el libro de 3°' },
];

function GalaxyArtSvg({ size = 68 }: { size?: number }) {
  const rx = size > 40 ? 16 : 6;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', borderRadius: `${rx}px` }}
    >
      <defs>
        <radialGradient id={`galBg_${size}`} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#2a1848" />
          <stop offset="100%" stopColor="#130b24" />
        </radialGradient>
        <linearGradient id={`cyanRibbon_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <rect width="68" height="68" rx={rx} fill={`url(#galBg_${size})`} />

      {/* Cyan swirling milky way ribbon */}
      <path
        d="M 12 0 C 22 24 38 42 68 52 L 68 28 C 46 22 30 10 24 0 Z"
        fill={`url(#cyanRibbon_${size})`}
      />
      <path
        d="M 0 32 C 18 36 34 52 46 68 L 30 68 C 18 54 8 42 0 38 Z"
        fill={`url(#cyanRibbon_${size})`}
        opacity="0.85"
      />

      {/* Yellow Sparkle Diamonds */}
      <polygon points="37,20 39,24 43,24 40,26 41,30 38,28 35,30 36,26 33,24 37,24" fill="#facc15" />
      <polygon points="21,37 22,39 25,39 23,41 24,43 22,42 20,43 21,41 19,39 22,39" fill="#fde047" />

      {/* Star dots */}
      <circle cx="16" cy="17" r="1.4" fill="#ffffff" opacity="0.9" />
      <circle cx="51" cy="15" r="1.2" fill="#fde047" opacity="0.85" />
      <circle cx="57" cy="38" r="1.4" fill="#ffffff" opacity="0.9" />
      <circle cx="49" cy="58" r="1.1" fill="#ffffff" opacity="0.8" />
      <circle cx="14" cy="52" r="0.9" fill="#ffffff" opacity="0.75" />
    </svg>
  );
}

interface CommandPanelModals3roProps {
  activeModal: string | null;
  onClose: () => void;
  coins: number;
  totalXP: number;
  streak: number;
  studentName: string;
  onAddCoins?: (amount: number) => void;
  onAddXP?: (amount: number) => void;
}

export default function CommandPanelModals3ro({
  activeModal,
  onClose,
  coins,
  totalXP,
  streak,
  studentName,
  onAddCoins,
  onAddXP,
}: CommandPanelModals3roProps) {
  // ─── LOCAL STORAGE STATES FOR PERSISTENCE ──────────────────────────────
  // 1. Tienda state
  const [shopV2Tab, setShopV2Tab] = useState<'avatar' | 'mascota' | 'fondo' | 'power' | 'access'>('avatar');
  const [ownedShopIds, setOwnedShopIds] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fedor3_shop_owned');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return { av_numerix: false };
  });

  // 2. Reto Espacial state
  const [misionesDone, setMisionesDone] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fedor3_espacial_done');
        if (saved) return parseInt(saved, 10) || 0;
      } catch {}
    }
    return 0;
  });
  const [espacialDoneToday, setEspacialDoneToday] = useState(false);
  const [espacialStep, setEspacialStep] = useState<'info' | 'quiz' | 'done'>('info');
  const [espacialQuizIndex, setEspacialQuizIndex] = useState(0);

  // 3. Examen Final state
  const [examStats, setExamStats] = useState<{ passes: number; bestScore: number; attempts: number }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fedor3_final_stats');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return { passes: 0, bestScore: 0, attempts: 0 };
  });
  const [examStep, setExamStep] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [examIndex, setExamIndex] = useState(0);
  const [examSelectedOpt, setExamSelectedOpt] = useState<number | null>(null);
  const [examScore, setExamScore] = useState(0);

  // 4. Stickers state
  const [unlockedStickers, setUnlockedStickers] = useState<Record<string, boolean>>({
    st_dragon: true,
    st_estrella: true,
    st_cohete: true,
  });

  // 5. Missions state
  const [missions, setMissions] = useState<DailyMission3ro[]>(DEFAULT_DAILY_MISSIONS_3RO);

  // 6. Standards tab
  const [estTab, setEstTab] = useState<string>('num');

  // 7. Definitions tab & search
  const [defTab, setDefTab] = useState<string>('adi');
  const [defSearch, setDefSearch] = useState<string>('');

  // 8. Explain tab & subcategory & example index
  const [explOp, setExplOp] = useState<'adicion' | 'sustraccion' | 'multiplicacion' | 'division'>('adicion');
  const [explSub, setExplSub] = useState<string>('sin-llevar');
  const [explIdx, setExplIdx] = useState<number>(0);

  // 9. Minigame picker state
  const [activeMinigame, setActiveMinigame] = useState<'picker' | 'pizza' | 'reloj' | 'tienda' | 'insignias'>('picker');
  const [earnedInsignias, setEarnedInsignias] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fedor3_insignias');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });
  const [corazonesProbIndex, setCorazonesProbIndex] = useState(0);
  const [corazonesGuess, setCorazonesGuess] = useState<number | null>(null);
  const [corazonesScore, setCorazonesScore] = useState(0);
  const [corazonesFeedback, setCorazonesFeedback] = useState<string | null>(null);
  const [relojProbIndex, setRelojProbIndex] = useState(0);
  const [relojInputGuess, setRelojInputGuess] = useState<number | null>(null);
  const [relojScore, setRelojScore] = useState(0);
  const [relojFeedback, setRelojFeedback] = useState<string | null>(null);
  const [tiendaProbIndex, setTiendaProbIndex] = useState(0);
  const [tiendaInputGuess, setTiendaInputGuess] = useState<number | null>(null);
  const [tiendaScore, setTiendaScore] = useState(0);
  const [tiendaFeedback, setTiendaFeedback] = useState<string | null>(null);
  const [pizzaSlices, setPizzaSlices] = useState<number | null>(null);
  const [relojGuess, setRelojGuess] = useState<string | null>(null);
  const [tiendaChange, setTiendaChange] = useState<number | null>(null);

  const currentCorazones = CORAZONES_PROBLEMS[corazonesProbIndex % CORAZONES_PROBLEMS.length];
  const correctCorazonesVal = currentCorazones.total / currentCorazones.kids;
  const currentReloj = RELOJ_PROBLEMS[relojProbIndex % RELOJ_PROBLEMS.length];
  const currentTienda = TIENDA_MATH_PROBLEMS[tiendaProbIndex % TIENDA_MATH_PROBLEMS.length];

  // 10. Marathon state
  const [maratonState, setMaratonState] = useState<'start' | 'playing' | 'end'>('start');
  const [maratonIdx, setMaratonIdx] = useState(0);
  const [maratonScore, setMaratonScore] = useState(0);
  const [maratonTimer, setMaratonTimer] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset states when opening modal
  useEffect(() => {
    if (!activeModal) return;
    playSound('click');
    if (activeModal === 'examen') {
      setExamStep('intro');
      setExamIndex(0);
      setExamSelectedOpt(null);
      setExamScore(0);
    } else if (activeModal === 'espacial') {
      setEspacialStep('info');
      setEspacialQuizIndex(0);
    } else if (activeModal === 'maraton') {
      setMaratonState('start');
      setMaratonIdx(0);
      setMaratonScore(0);
      setMaratonTimer(60);
      if (timerRef.current) clearInterval(timerRef.current);
    } else if (activeModal === 'juegos' || activeModal === 'minijuegos') {
      setActiveMinigame('picker');
      setCorazonesProbIndex(0);
      setCorazonesGuess(null);
      setCorazonesFeedback(null);
      setRelojProbIndex(0);
      setRelojInputGuess(null);
      setRelojFeedback(null);
      setTiendaProbIndex(0);
      setTiendaInputGuess(null);
      setTiendaFeedback(null);
    } else if (activeModal === 'insignias') {
      setActiveMinigame('insignias');
    }
  }, [activeModal]);

  // Marathon countdown
  useEffect(() => {
    if (activeModal === 'maraton' && maratonState === 'playing') {
      timerRef.current = setInterval(() => {
        setMaratonTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setMaratonState('end');
            playSound('fanfare');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeModal, maratonState]);

  if (!activeModal) return null;

  // Space challenge questions
  const ESPACIAL_QUESTIONS = [
    { q: 'Calcula en los motores de la nave: 450 + 350 =', opts: ['700', '800', '850', '900'], ans: 1 },
    { q: 'Si la velocidad es 120 km/s y sube a 250 km/s, ¿cuánto aumentó?', opts: ['110', '120', '130', '140'], ans: 2 },
    { q: 'Reparte 36 estrellas entre 4 tripulantes:', opts: ['7', '8', '9', '10'], ans: 2 },
  ];

  // Marathon questions pool (15 rapid questions)
  const MARATON_QUESTIONS = EXAM_QUESTIONS_3RO.slice(0, 15);

  // Days list for Diario (last 7 days ending today, exact format from Image 3)
  const DIARIO_DAYS = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayNames = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];
    const wDay = dayNames[d.getDay()];
    const dayNum = String(d.getDate()).padStart(2, '0');
    const monthStr = monthNames[d.getMonth()];
    const str = `${wDay}, ${dayNum} de ${monthStr}`;
    return {
      dateStr: str,
      active: i === 6 && streak > 0,
    };
  });

  // Purchase shop item handler
  const handleBuyV2Item = (item: ShopV2Item3ro) => {
    if (ownedShopIds[item.id]) {
      fedorSpeak(`Ya tienes adquirido a ${item.name}.`);
      return;
    }
    if (coins < item.price) {
      playSound('wrong');
      fedorSpeak('No tienes suficientes monedas para este artículo.');
      return;
    }
    onAddCoins?.(-item.price);
    const updated = { ...ownedShopIds, [item.id]: true };
    setOwnedShopIds(updated);
    try {
      localStorage.setItem('fedor3_shop_owned', JSON.stringify(updated));
    } catch {}
    playSound('coin');
    triggerConfetti();
    fedorSpeak(`¡Felicitaciones! Has desbloqueado ${item.name}.`);
  };

  return (
    <div
      className="fixed inset-0 z-[99990] flex items-center justify-center p-3 md:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn select-none font-['Nunito',sans-serif]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Card Shell */}
      <div
        className={`relative w-full ${
          activeModal === 'espacial'
            ? 'max-w-[540px]'
            : activeModal === 'tienda' || activeModal === 'diario'
            ? 'max-w-[560px]'
            : activeModal === 'examen'
            ? 'max-w-[620px]'
            : activeModal === 'estandares' || activeModal === 'definiciones'
            ? 'max-w-[880px]'
            : activeModal === 'galaxia3d' || activeModal === 'historia' || activeModal === 'misiones'
            ? 'max-w-[660px]'
            : activeModal === 'juegos' || activeModal === 'minijuegos' || activeModal === 'insignias'
            ? activeMinigame === 'insignias' || activeModal === 'insignias'
              ? 'max-w-[540px]'
              : 'max-w-[480px]'
            : 'max-w-[520px]'
        } max-h-[92vh] bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col border border-purple-200/40`}
      >
        {/* ══════════════════════════════════════════════════════════════════
            HEADER CON COLOR ESPECÍFICO DE CADA POPUP
        ══════════════════════════════════════════════════════════════════ */}
        <div
          className="flex items-center justify-between px-6 py-3.5 text-white"
          style={{
            background:
              activeModal === 'tienda'
                ? 'linear-gradient(135deg, #1DBF8B, #14A877)' // Bright emerald/teal green (exact to reference)
                : activeModal === 'espacial'
                ? 'linear-gradient(135deg, #4F1C96, #6B23B0)' // Deep Royal Purple (exact to reference)
                : activeModal === 'diario'
                ? 'linear-gradient(135deg, #0E6BA8, #3AA0FF)' // Exact Blue (Imagen 3)
                : activeModal === 'examen'
                ? 'linear-gradient(135deg, #A30041, #FF1D4E)' // Exact Crimson / Magenta (Imagen 4)
                : activeModal === 'stickers'
                ? 'linear-gradient(135deg, #9B0066, #FF1DAA)'
                : activeModal === 'juegos' || activeModal === 'minijuegos' || activeModal === 'insignias'
                ? '#ffffff'
                : activeModal === 'galaxia3d' || activeModal === 'historia' || activeModal === 'estandares' || activeModal === 'misiones' || activeModal === 'definiciones'
                ? '#ffffff'
                : activeModal === 'maraton'
                ? 'linear-gradient(135deg, #9A3412, #EA580C)'
                : 'linear-gradient(135deg, #E8650A, #F5C518)',
            padding: (activeModal === 'juegos' || activeModal === 'minijuegos' || activeModal === 'insignias')
              ? '16px 20px 0px'
              : (activeModal === 'galaxia3d' || activeModal === 'historia' || activeModal === 'misiones')
              ? '24px 28px 4px 28px'
              : activeModal === 'estandares' || activeModal === 'definiciones'
              ? '24px 30px 4px 30px'
              : undefined,
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl drop-shadow">
              {activeModal === 'tienda' && '🛒'}
              {activeModal === 'espacial' && '🚀'}
              {activeModal === 'diario' && '📓'}
              {activeModal === 'examen' && '📝'}
              {activeModal === 'stickers' && '🎴'}
              {activeModal === 'galaxia3d' && (
                <span style={{ display: 'inline-block', verticalAlign: 'middle', width: '26px', height: '26px', borderRadius: '7px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                  <GalaxyArtSvg size={26} />
                </span>
              )}
              {activeModal === 'historia' && '📖'}
              {activeModal === 'estandares' && '📋'}
              {activeModal === 'misiones' && '🎯'}
              {activeModal === 'definiciones' && '📚'}
              {activeModal === 'maraton' && '🏃'}
              {activeModal === 'explicar' && '💡'}
            </span>
            <h3
              className="text-base md:text-lg font-black tracking-wide drop-shadow"
              style={{
                color: (activeModal === 'galaxia3d' || activeModal === 'historia' || activeModal === 'estandares' || activeModal === 'misiones' || activeModal === 'definiciones') ? '#1e1035' : '#ffffff',
                fontSize: (activeModal === 'galaxia3d' || activeModal === 'historia' || activeModal === 'estandares' || activeModal === 'misiones' || activeModal === 'definiciones') ? '21px' : undefined,
                fontWeight: 900,
                letterSpacing: (activeModal === 'galaxia3d' || activeModal === 'historia' || activeModal === 'estandares' || activeModal === 'misiones' || activeModal === 'definiciones') ? '-0.02em' : undefined,
              }}
            >
              {activeModal === 'tienda' && 'Tienda Espacial 3°'}
              {activeModal === 'espacial' && 'Reto Espacial'}
              {activeModal === 'diario' && 'Diario del Explorador'}
              {activeModal === 'examen' && 'Examen Final del Libro'}
              {activeModal === 'stickers' && 'Álbum de Stickers'}
              {activeModal === 'galaxia3d' && 'Galaxia 3D del Saber'}
              {activeModal === 'historia' && 'Historia de Fedor'}
              {activeModal === 'estandares' && 'Estándares Matemáticos — Grado 3°'}
              {activeModal === 'misiones' && 'Misiones Diarias — 3°'}
              {activeModal === 'definiciones' && 'Definiciones por Unidad — 3°'}
              {activeModal === 'maraton' && 'Prueba Saber — Modo Maratón'}
              {activeModal === 'explicar' && 'Explicación — Método Fedor'}
            </h3>

            {activeModal === 'historia' && (
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  fedorSpeak(
                    'Fedor es un joven explorador espacial que viajó desde una lejana galaxia para aprender las matemáticas del universo. Desde pequeño, Fedor soñaba con las estrellas y descubrió que los números son el idioma del cosmos. En su nave espacial, Fedor recorre planetas resolviendo operaciones matemáticas y ayudando a los habitantes del sistema solar. ¡Tú también puedes acompañarlo! Cada ejercicio que resuelves es un paso más en el viaje de Fedor hacia el conocimiento. Las matemáticas son su superpoder, y el tuyo también.'
                  );
                }}
                className="flex items-center justify-center cursor-pointer transition-all hover:bg-slate-100"
                style={{
                  width: '32px',
                  height: '36px',
                  borderRadius: '6px',
                  border: '1px solid #94a3b8',
                  background: '#f8fafc',
                  marginLeft: '4px',
                  fontSize: '16px',
                }}
                title="Escuchar historia de Fedor"
              >
                🔊
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              if ((activeModal === 'juegos' || activeModal === 'minijuegos') && activeMinigame !== 'picker') {
                setActiveMinigame('picker');
              } else {
                onClose();
              }
            }}
            className="rounded-full font-black flex items-center justify-center transition-all cursor-pointer"
            style={{
              width: (activeModal === 'galaxia3d' || activeModal === 'historia' || activeModal === 'estandares' || activeModal === 'misiones' || activeModal === 'definiciones') ? '32px' : '36px',
              height: (activeModal === 'galaxia3d' || activeModal === 'historia' || activeModal === 'estandares' || activeModal === 'misiones' || activeModal === 'definiciones') ? '32px' : '36px',
              background: (activeModal === 'galaxia3d' || activeModal === 'historia' || activeModal === 'estandares' || activeModal === 'misiones' || activeModal === 'definiciones') ? 'transparent' : (activeModal === 'juegos' || activeModal === 'minijuegos' || activeModal === 'insignias') ? '#ede9fe' : 'rgba(255,255,255,0.30)',
              color: (activeModal === 'galaxia3d' || activeModal === 'historia' || activeModal === 'estandares' || activeModal === 'misiones' || activeModal === 'definiciones') ? '#64748b' : (activeModal === 'juegos' || activeModal === 'minijuegos' || activeModal === 'insignias') ? '#6d28d9' : '#fff',
              fontSize: (activeModal === 'galaxia3d' || activeModal === 'historia' || activeModal === 'estandares' || activeModal === 'misiones' || activeModal === 'definiciones') ? '22px' : '16px',
              border: 'none',
            }}
            title="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            BODY DEL MODAL
        ══════════════════════════════════════════════════════════════════ */}
        <div
          className="overflow-y-auto flex-1 bg-white text-gray-800 text-sm insignias-custom-scroll"
          style={{
            padding: activeModal === 'estandares' || activeModal === 'definiciones'
              ? '14px 30px 28px'
              : (activeModal === 'galaxia3d' || activeModal === 'historia' || activeModal === 'misiones')
              ? '16px 28px 28px'
              : (activeModal === 'juegos' || activeModal === 'minijuegos' || activeModal === 'insignias')
              ? '0px 20px 24px'
              : '20px 24px 28px',
          }}
        >
          {/* ─────────────────────────────────────────────────────────────
              1. TIENDA (EXACTA A IMAGEN)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'tienda' && (
            <div className="w-full max-w-[505px] mx-auto space-y-3">
              {/* Tu saldo bar */}
              <div className="bg-[#F8F7FF] border border-[#ECE7FF] rounded-2xl px-4 py-2.5 flex items-center justify-between font-extrabold text-xs md:text-sm">
                <span className="flex items-center gap-2 text-[#100344]">
                  <span className="text-base">🪙</span>
                  <span>Tu saldo</span>
                </span>
                <span className="text-[#8B5CF6] font-black text-base">{coins}</span>
              </div>

              {/* Category tabs: row of 4 pills */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'avatar', lbl: 'PERSONAJES', ico: '👤' },
                  { id: 'mascota', lbl: 'MASCOTAS', ico: '🐾' },
                  { id: 'fondo', lbl: 'FONDOS', ico: '🌌' },
                  { id: 'power', lbl: 'POWER-UPS', ico: '⚡' },
                ].map((tb) => {
                  const isActive = shopV2Tab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setShopV2Tab(tb.id as typeof shopV2Tab);
                      }}
                      className={`h-10 md:h-11 px-1 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-tight transition-all cursor-pointer text-center flex items-center justify-center gap-1 border-2 ${
                        isActive
                          ? 'bg-[#7C28BE] text-white border-[#7C28BE] shadow-sm'
                          : 'bg-white text-[#6C28B4] border-[#DDD5FC] hover:bg-purple-50/70'
                      }`}
                    >
                      <span className="text-xs leading-none">{tb.ico}</span>
                      <span className="leading-none">{tb.lbl}</span>
                    </button>
                  );
                })}
              </div>

              {/* Accesorios full-width tab */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setShopV2Tab('access');
                  }}
                  className={`w-full h-9 md:h-10 px-4 rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-widest transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 border-2 ${
                    shopV2Tab === 'access'
                      ? 'bg-[#7C28BE] text-white border-[#7C28BE] shadow-sm'
                      : 'bg-white text-[#6C28B4] border-[#DDD5FC] hover:bg-purple-50/70'
                  }`}
                >
                  <span className="text-sm">💎</span>
                  <span>ACCESORIOS</span>
                </button>
              </div>

              {/* Items grid (4 cols exact to Imagen) */}
              <div className="grid grid-cols-4 gap-2.5 md:gap-3 pt-1 pb-3">
                {SHOP_V2_ITEMS_3RO.filter((it) => it.cat === shopV2Tab).map((item) => {
                  const isOwned = !!ownedShopIds[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleBuyV2Item(item)}
                      className={`bg-white border-2 border-[#DDD5FC] rounded-2xl py-3 px-2 text-center flex flex-col items-center justify-between min-h-[138px] max-h-[144px] cursor-pointer hover:shadow-md hover:border-[#8B5CF6] hover:-translate-y-0.5 transition-all ${
                        isOwned ? 'bg-[#FAF8FF] border-[#8B5CF6]/50' : ''
                      }`}
                    >
                      <div className="text-3xl my-0.5 h-10 flex items-center justify-center">
                        {item.emoji}
                      </div>
                      <div className="text-[11px] font-black text-[#100344] text-center leading-tight my-1 px-1 line-clamp-1">
                        {item.name}
                      </div>
                      <div className="w-full flex justify-center mt-auto">
                        {isOwned ? (
                          <span className="bg-[#DCF5EE] text-[#074F3A] border border-[#95DAC4] text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block">
                            ✓ Comprado
                          </span>
                        ) : (
                          <span className="bg-[#FEEDDB] text-[#E06A02] text-[11px] font-black px-3 py-0.5 rounded-full inline-flex items-center gap-1 shadow-xs">
                            <span>{item.price}</span>
                            <span className="text-xs">🪙</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              2. RETO ESPACIAL (EXACTO A IMAGEN)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'espacial' && (
            <div style={{ width: '100%' }}>
              {espacialStep === 'info' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Dark Space Cadete Banner */}
                  <div style={{
                    background: '#100428',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 900,
                      color: '#FFD66B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}>
                      <span>🛰️</span>
                      <span>Cadete Estelar</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#B8B0D8', marginTop: '6px' }}>
                      Misiones espaciales completadas: <b style={{ color: '#fff' }}>{misionesDone}</b> &middot; Racha: <b style={{ color: '#fff' }}>{streak}</b> 🔥
                    </div>
                  </div>

                  {/* Row 1: Reto diario de hoy */}
                  <div style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '14px',
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#1f2937' }}>Reto diario de hoy</span>
                    <span style={{
                      fontWeight: 900,
                      fontSize: '14px',
                      color: espacialDoneToday ? '#059669' : '#7C3AED',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      {espacialDoneToday ? (
                        <><span>✅</span><span>Completado</span></>
                      ) : (
                        <><span>⏳</span><span>Disponible</span></>
                      )}
                    </span>
                  </div>

                  {/* Row 2: Recompensa */}
                  <div style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '14px',
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#1f2937' }}>Recompensa</span>
                    <span style={{
                      fontWeight: 900,
                      fontSize: '14px',
                      color: '#7C3AED',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <span>+50</span>
                      <span>🪙</span>
                      <span>+ 30 XP</span>
                    </span>
                  </div>

                  {/* Big Button: Iniciar misión */}
                  <button
                    type="button"
                    disabled={espacialDoneToday}
                    onClick={() => {
                      playSound('click');
                      setEspacialStep('quiz');
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '14px',
                      fontWeight: 900,
                      fontSize: '15px',
                      color: '#fff',
                      border: 'none',
                      cursor: espacialDoneToday ? 'not-allowed' : 'pointer',
                      background: espacialDoneToday
                        ? '#d1d5db'
                        : 'linear-gradient(90deg, #6C28B4 0%, #C0166E 55%, #F0104A 100%)',
                      boxShadow: espacialDoneToday ? 'none' : '0 4px 20px rgba(108,40,180,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'opacity 0.2s, transform 0.1s',
                    }}
                  >
                    <span>🚀</span>
                    <span>{espacialDoneToday ? 'Misión de hoy completada' : 'Iniciar misión'}</span>
                  </button>
                </div>
              )}

              {espacialStep === 'quiz' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-[#6C28B4]">
                    <span>Pregunta {espacialQuizIndex + 1} de {ESPACIAL_QUESTIONS.length}</span>
                    <span>Reto Espacial</span>
                  </div>

                  <div className="p-4 bg-[#F8F7FF] border border-[#DDD6FE] rounded-2xl text-center">
                    <p className="text-sm md:text-base font-black text-[#1E0A40]">
                      {ESPACIAL_QUESTIONS[espacialQuizIndex].q}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {ESPACIAL_QUESTIONS[espacialQuizIndex].opts.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => {
                          const isOk = oIdx === ESPACIAL_QUESTIONS[espacialQuizIndex].ans;
                          if (isOk) {
                            playSound('correct');
                          } else {
                            playSound('wrong');
                          }

                          if (espacialQuizIndex + 1 >= ESPACIAL_QUESTIONS.length) {
                            setEspacialDoneToday(true);
                            setMisionesDone((prev) => {
                              const updated = prev + 1;
                              try {
                                localStorage.setItem('fedor3_espacial_done', String(updated));
                              } catch {}
                              return updated;
                            });
                            setEspacialStep('done');
                            onAddCoins?.(50);
                            onAddXP?.(30);
                            playSound('fanfare');
                            triggerConfetti();
                          } else {
                            setEspacialQuizIndex((i) => i + 1);
                          }
                        }}
                        className="p-3 bg-white hover:bg-purple-50 border-2 border-[#DDD6FE] hover:border-[#6C28B4] rounded-xl font-black text-[#20084A] text-sm transition-all cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {espacialStep === 'done' && (
                <div className="text-center py-5 space-y-3">
                  <div className="text-5xl animate-bounce">🏆</div>
                  <h4 className="text-lg font-black text-[#16876A]">¡Misión Espacial Completada!</h4>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto">
                    Has completado con éxito el reto del día y acumulado tus recompensas estelares.
                  </p>
                  <div className="inline-flex items-center gap-3 bg-[#DCF5EE] border border-[#95DAC4] px-4 py-1.5 rounded-full text-[#074F3A] font-black text-xs">
                    <span>+50 🪙</span>
                    <span>·</span>
                    <span>+30 XP</span>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setEspacialStep('info')}
                      className="px-5 py-2 rounded-xl bg-[#6C28B4] hover:bg-[#581C87] text-white font-bold text-xs"
                    >
                      Volver al reto
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              3. DIARIO (EXACTO A IMAGEN 3)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'diario' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Stat row 1: Racha actual */}
              <div style={{
                background: '#F0EEFF',
                border: '1px solid #DDD5FC',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, fontSize: '14px', color: '#20084A' }}>
                  <span>🔥</span>
                  <span>Racha actual</span>
                </span>
                <span style={{ color: '#6C28B4', fontWeight: 900, fontSize: '14px' }}>{streak} días</span>
              </div>

              {/* Stat row 2: Total ejercicios */}
              <div style={{
                background: '#F0EEFF',
                border: '1px solid #DDD5FC',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, fontSize: '14px', color: '#20084A' }}>
                  <span>📚</span>
                  <span>Total ejercicios</span>
                </span>
                <span style={{ color: '#6C28B4', fontWeight: 900, fontSize: '14px' }}>{totalXP > 0 ? Math.round(totalXP / 10) : 0}</span>
              </div>

              {/* Stat row 3: Minutos esta semana */}
              <div style={{
                background: '#F0EEFF',
                border: '1px solid #DDD5FC',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, fontSize: '14px', color: '#20084A' }}>
                  <span>⏱️</span>
                  <span>Minutos esta semana</span>
                </span>
                <span style={{ color: '#6C28B4', fontWeight: 900, fontSize: '14px' }}>{totalXP > 0 ? Math.round(totalXP / 15) : 0} min</span>
              </div>

              {/* Section Heading: Últimos 7 días */}
              <div style={{ color: '#0E6BA8', fontWeight: 900, fontSize: '15px', marginTop: '6px' }}>
                Últimos 7 días
              </div>

              {/* 7 Days List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {DIARIO_DAYS.map((day, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#fff',
                      border: '1px solid #E5E0FF',
                      borderRadius: '12px',
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#20084A' }}>{day.dateStr}</span>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#6C28B4' }}>
                      {day.active ? '✓ Actividad registrada' : '— sin actividad'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer text */}
              <p style={{ textAlign: 'center', color: '#9ca3af', fontWeight: 600, fontSize: '11px', marginTop: '4px' }}>
                Practica un poco cada día. ¡Cada 5 días consecutivos hay bonificación!
              </p>
            </div>
          )}


          {/* ─────────────────────────────────────────────────────────────
              4. EXAMEN (EXACTO A IMAGEN 4)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'examen' && (
            <div>
              {examStep === 'intro' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Description Paragraph */}
                  <p style={{ fontSize: '14px', fontWeight: 800, color: '#1E0A40', lineHeight: 1.5, margin: 0 }}>
                    Este examen evalúa todas las unidades del libro: Adición, Sustracción, Multiplicación y División. <b>25 preguntas mezcladas</b>.
                  </p>

                  {/* Stat row 1: Aprobados */}
                  <div style={{
                    background: '#F0EEFF',
                    border: '1px solid #DDD5FC',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#20084A' }}>Aprobados</span>
                    <span style={{ color: '#6C28B4', fontWeight: 900, fontSize: '14px' }}>{examStats.passes}</span>
                  </div>

                  {/* Stat row 2: Mejor puntaje */}
                  <div style={{
                    background: '#F0EEFF',
                    border: '1px solid #DDD5FC',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#20084A' }}>Mejor puntaje</span>
                    <span style={{ color: '#6C28B4', fontWeight: 900, fontSize: '14px' }}>{examStats.bestScore}/25</span>
                  </div>

                  {/* Stat row 3: Intentos */}
                  <div style={{
                    background: '#F0EEFF',
                    border: '1px solid #DDD5FC',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#20084A' }}>Intentos</span>
                    <span style={{ color: '#6C28B4', fontWeight: 900, fontSize: '14px' }}>{examStats.attempts}</span>
                  </div>

                  {/* Alert Banner Recompensa */}
                  <div style={{
                    background: '#FFF7ED',
                    border: '2px solid #F97316',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#7A3200',
                  }}>
                    <span>🏆</span>
                    <span>Recompensa al aprobar (≥18/25): <b>+500 🪙</b> + badge <b>&quot;Graduado de 3°&quot;</b></span>
                  </div>

                  {/* Big Button: Empezar Examen Final */}
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setExamStep('quiz');
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '14px',
                      fontWeight: 900,
                      fontSize: '15px',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      background: 'linear-gradient(90deg, #A30041 0%, #FF1D4E 100%)',
                      boxShadow: '0 4px 20px rgba(163,0,65,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <span>📝</span>
                    <span>Empezar Examen Final</span>
                  </button>
                </div>
              )}


              {examStep === 'quiz' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs font-black text-[#6C28B4]">
                    <span className="bg-purple-100 px-3 py-1 rounded-full text-[#6C28B4]">
                      Pregunta {examIndex + 1} de {EXAM_QUESTIONS_3RO.length}
                    </span>
                    <span className="text-gray-500">{EXAM_QUESTIONS_3RO[examIndex].unit}</span>
                    <span className="text-emerald-700 font-bold">Aciertos: {examScore}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 transition-all duration-300"
                      style={{ width: `${((examIndex + 1) / EXAM_QUESTIONS_3RO.length) * 100}%` }}
                    />
                  </div>

                  {/* Question card */}
                  <div className="p-4 bg-[#F8F7FF] border border-[#DDD6FE] rounded-2xl">
                    <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-1">
                      {EXAM_QUESTIONS_3RO[examIndex].topic}
                    </div>
                    <p className="text-sm md:text-base font-black text-[#1E0A40] leading-relaxed">
                      {EXAM_QUESTIONS_3RO[examIndex].q}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {EXAM_QUESTIONS_3RO[examIndex].opts.map((opt, oIdx) => {
                      const isSelected = examSelectedOpt === oIdx;
                      const isCorrect = oIdx === EXAM_QUESTIONS_3RO[examIndex].ans;
                      let btnStyle = 'bg-white border-gray-200 hover:border-purple-300 text-gray-800';

                      if (examSelectedOpt !== null) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black shadow-sm';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 font-black shadow-sm';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={examSelectedOpt !== null}
                          onClick={() => {
                            setExamSelectedOpt(oIdx);
                            const hit = oIdx === EXAM_QUESTIONS_3RO[examIndex].ans;
                            if (hit) {
                              playSound('correct');
                              setExamScore((s) => s + 1);
                            } else {
                              playSound('wrong');
                            }
                          }}
                          className={`w-full text-left p-3 rounded-xl border-2 font-bold text-xs md:text-sm transition-all flex items-center gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center text-xs font-black flex-shrink-0">
                            {['A', 'B', 'C', 'D'][oIdx]}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation and Next button */}
                  {examSelectedOpt !== null && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-2 animate-fadeIn">
                      <div className="text-xs text-purple-900">
                        <b>Explicación:</b> {EXAM_QUESTIONS_3RO[examIndex].expl}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click');
                          if (examIndex + 1 >= EXAM_QUESTIONS_3RO.length) {
                            const newScore = examScore;
                            const newAttempts = examStats.attempts + 1;
                            const newPasses = examStats.passes + (newScore >= 18 ? 1 : 0);
                            const newBest = Math.max(examStats.bestScore, newScore);
                            const updatedStats = { passes: newPasses, bestScore: newBest, attempts: newAttempts };
                            setExamStats(updatedStats);
                            try {
                              localStorage.setItem('fedor3_final_stats', JSON.stringify(updatedStats));
                            } catch {}

                            setExamStep('results');
                            if (newScore >= 18) {
                              onAddCoins?.(500);
                              onAddXP?.(200);
                              playSound('fanfare');
                              triggerConfetti();
                              fedorSpeak('¡Aprobaste con honores el examen final! Reclama tu recompensa.');
                            } else {
                              fedorSpeak('Has completado el intento. Puedes seguir practicando.');
                            }
                          } else {
                            setExamIndex((i) => i + 1);
                            setExamSelectedOpt(null);
                          }
                        }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-black text-xs text-white shadow cursor-pointer"
                      >
                        {examIndex + 1 >= EXAM_QUESTIONS_3RO.length ? 'Ver Resultados Finales 🏆' : 'Siguiente Pregunta ▶'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {examStep === 'results' && (
                <div className="text-center py-5 space-y-3.5">
                  <div className="text-6xl animate-bounce">
                    {examScore >= 18 ? '🎓' : '📊'}
                  </div>
                  <h4 className="text-xl font-black text-[#1E0A40]">
                    {examScore >= 18 ? '¡APROBADO CON ÉXITO!' : 'Examen Finalizado'}
                  </h4>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto">
                    {examScore >= 18
                      ? '¡Excelente trabajo! Has demostrado dominio en las operaciones matemáticas de 3er grado.'
                      : 'Buen esfuerzo. Repasa los temas y vuelve a intentar el examen para obtener tu insignia.'}
                  </p>

                  <div className="inline-flex items-center justify-center p-3.5 bg-[#F8F7FF] border-2 border-purple-300 rounded-2xl gap-6">
                    <div>
                      <div className="text-2xl font-black text-purple-900">{examScore} / 25</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Puntaje</div>
                    </div>
                    <div className="h-6 w-px bg-gray-300" />
                    <div>
                      <div className="text-2xl font-black text-emerald-600">
                        {Math.round((examScore / 25) * 100)}%
                      </div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Aciertos</div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setExamStep('quiz');
                        setExamIndex(0);
                        setExamSelectedOpt(null);
                        setExamScore(0);
                      }}
                      className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 font-bold text-xs text-white"
                    >
                      Intentar de nuevo 🔄
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-xs text-gray-800"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              5. STICKERS (ÁLBUM)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'stickers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header: contador + botón sobre */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fdf4ff',
                border: '1px solid #e9d5ff',
                borderRadius: '14px',
                padding: '14px 18px',
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#581c87' }}>
                    Mi Álbum de Stickers
                  </div>
                  <div style={{ fontSize: '12px', color: '#9333ea', marginTop: '2px' }}>
                    {Object.values(unlockedStickers).filter(Boolean).length} / {STICKERS_3RO.length} coleccionados
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (coins < 50) {
                      playSound('wrong');
                      fedorSpeak('Necesitas 50 monedas para abrir un sobre misterioso.');
                      return;
                    }
                    const locked = STICKERS_3RO.filter((s) => !unlockedStickers[s.id]);
                    if (locked.length === 0) {
                      fedorSpeak('¡Ya completaste todo el álbum de stickers!');
                      return;
                    }
                    onAddCoins?.(-50);
                    const randomPick = locked[Math.floor(Math.random() * locked.length)];
                    setUnlockedStickers((prev) => ({ ...prev, [randomPick.id]: true }));
                    playSound('fanfare');
                    triggerConfetti();
                    fedorSpeak(`¡Te ha salido el sticker ${randomPick.name}!`);
                  }}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(90deg, #9B0066, #FF1DAA)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(155,0,102,0.35)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🎁 Sobre (50 🪙)
                </button>
              </div>

              {/* Grid de stickers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                maxHeight: '55vh',
                overflowY: 'auto',
                paddingRight: '2px',
              }}>
                {STICKERS_3RO.map((st) => {
                  const isUnlocked = !!unlockedStickers[st.id];
                  return (
                    <div
                      key={st.id}
                      style={{
                        borderRadius: '14px',
                        border: isUnlocked ? '2px solid #fcd34d' : '2px dashed #d1d5db',
                        background: isUnlocked ? '#fffbeb' : '#f9fafb',
                        padding: '14px 8px 12px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        opacity: isUnlocked ? 1 : 0.75,
                      }}
                    >
                      <div style={{ fontSize: '28px', lineHeight: 1 }}>
                        {isUnlocked ? st.e : '❔'}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: isUnlocked ? '#92400e' : '#9ca3af',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {isUnlocked ? st.name : '???'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              6. JUEGOS / MINIJUEGOS / MIS INSIGNIAS
          ───────────────────────────────────────────────────────────── */}
          {(activeModal === 'juegos' || activeModal === 'minijuegos' || activeModal === 'insignias') && (
            <div>
              {activeMinigame === 'picker' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                  {/* Hero centrado */}
                  <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎮</div>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e1b4b', margin: '0 0 6px' }}>Mini-juegos de 3°</h3>
                    <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Practica jugando y gana monedas extra</p>
                  </div>

                  {/* Lista vertical de juegos */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Juego 1 */}
                    <div
                      onClick={() => {
                        playSound('click');
                        setActiveMinigame('pizza');
                        setCorazonesGuess(null);
                        setCorazonesFeedback(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        background: '#f2eeff',
                        border: '1.5px solid #dcd3ff',
                        borderRadius: '20px',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '32px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❤️</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 900, fontSize: '16px', color: '#2e1065' }}>Reparte los Corazones</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '3px', fontWeight: 600 }}>División visual · +10 monedas por acierto</div>
                      </div>
                      <span style={{ color: '#7c3aed', fontSize: '22px', fontWeight: 900, lineHeight: 1 }}>›</span>
                    </div>

                    {/* Juego 2 */}
                    <div
                      onClick={() => {
                        playSound('click');
                        setActiveMinigame('reloj');
                        setRelojInputGuess(null);
                        setRelojFeedback(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        background: '#fff7ed',
                        border: '1.5px solid #fed7aa',
                        borderRadius: '20px',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '32px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🕒</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 900, fontSize: '16px', color: '#7c2d12' }}>Reto del Reloj</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '3px', fontWeight: 600 }}>Horas, minutos, segundos · +15 monedas</div>
                      </div>
                      <span style={{ color: '#ea580c', fontSize: '22px', fontWeight: 900, lineHeight: 1 }}>›</span>
                    </div>

                    {/* Juego 3 */}
                    <div
                      onClick={() => {
                        playSound('click');
                        setActiveMinigame('tienda');
                        setTiendaInputGuess(null);
                        setTiendaFeedback(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        background: '#ecfdf5',
                        border: '1.5px solid #a7f3d0',
                        borderRadius: '20px',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '32px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏪</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 900, fontSize: '16px', color: '#064e3b' }}>Tienda de Math</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '3px', fontWeight: 600 }}>Da el cambio correcto · +20 monedas</div>
                      </div>
                      <span style={{ color: '#059669', fontSize: '22px', fontWeight: 900, lineHeight: 1 }}>›</span>
                    </div>

                    {/* Juego 4: Mis Insignias */}
                    <div
                      onClick={() => {
                        playSound('click');
                        setActiveMinigame('insignias');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        background: '#fff1f2',
                        border: '1.5px solid #fecdd3',
                        borderRadius: '20px',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '32px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏅</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 900, fontSize: '16px', color: '#881337' }}>Mis Insignias</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '3px', fontWeight: 600 }}>18 insignias por ganar</div>
                      </div>
                      <span style={{ color: '#e11d48', fontSize: '22px', fontWeight: 900, lineHeight: 1 }}>›</span>
                    </div>
                  </div>
                </div>
              )}


              {activeMinigame === 'pizza' && (
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
                  {/* Top Heart Icon */}
                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: '8px',
                      lineHeight: 1,
                      filter: 'drop-shadow(0 4px 10px rgba(244,63,94,0.35))',
                    }}
                  >
                    ❤️
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '24px',
                      fontWeight: 900,
                      color: '#1e1035',
                      margin: '0 0 8px',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Reparte los Corazones
                  </h3>

                  {/* Subtitle with bold numbers */}
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: '0 0 20px',
                      lineHeight: 1.45,
                    }}
                  >
                    Math tiene <strong style={{ color: '#1e293b', fontWeight: 900 }}>{currentCorazones.total}</strong> corazones para <strong style={{ color: '#1e293b', fontWeight: 900 }}>{currentCorazones.kids}</strong> niños. ¿Cuántos para cada uno?
                  </p>

                  {/* Peach / Light pink container with grid of hearts */}
                  <div
                    style={{
                      background: '#fef0eb',
                      borderRadius: '24px',
                      padding: '24px 18px',
                      margin: '0 auto 22px',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${currentCorazones.cols}, 1fr)`,
                        gap: '14px 4px',
                        justifyItems: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {Array.from({ length: currentCorazones.total }).map((_, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '28px',
                            lineHeight: 1,
                            filter: 'drop-shadow(0 2px 5px rgba(225,29,72,0.25))',
                            display: 'inline-block',
                          }}
                        >
                          ❤️
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Input Selector (White box with purple border, ? or number, stepper arrows) */}
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 22px' }}>
                    <div
                      style={{
                        width: '124px',
                        height: '46px',
                        borderRadius: '14px',
                        border: '2px solid #c4b5fd',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 10px 0 14px',
                        boxShadow: '0 2px 8px rgba(196,181,253,0.18)',
                      }}
                    >
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="?"
                        value={corazonesGuess === null ? '' : String(corazonesGuess)}
                        onChange={(e) => {
                          setCorazonesFeedback(null);
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val === '') {
                            setCorazonesGuess(null);
                          } else {
                            const num = parseInt(val, 10);
                            if (!isNaN(num) && num >= 0 && num <= 99) {
                              setCorazonesGuess(num);
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const guess = corazonesGuess;
                            if (guess === null) {
                              playSound('wrong');
                              setCorazonesFeedback('Escribe o selecciona una respuesta');
                              return;
                            }
                            if (guess === correctCorazonesVal) {
                              playSound('correct');
                              triggerConfetti();
                              onAddCoins?.(10);
                              setCorazonesScore((s) => s + 10);
                              setCorazonesFeedback(`¡Correcto! ${currentCorazones.total} ÷ ${currentCorazones.kids} = ${correctCorazonesVal} corazones (+10 🪙)`);
                              setTimeout(() => {
                                setCorazonesProbIndex((p) => p + 1);
                                setCorazonesGuess(null);
                                setCorazonesFeedback(null);
                              }, 1800);
                            } else {
                              playSound('wrong');
                              setCorazonesFeedback(`¡Inténtalo de nuevo! ${currentCorazones.total} ÷ ${currentCorazones.kids} no es ${guess}.`);
                            }
                          }
                        }}
                        style={{
                          flex: 1,
                          width: '100%',
                          minWidth: 0,
                          textAlign: 'center',
                          fontSize: '22px',
                          fontWeight: 900,
                          color: '#2e1065',
                          letterSpacing: '-0.02em',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          padding: 0,
                        }}
                      />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginLeft: '6px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            playSound('click');
                            setCorazonesFeedback(null);
                            setCorazonesGuess((prev) => (prev === null ? 1 : Math.min(50, prev + 1)));
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '1px 3px',
                            lineHeight: 1,
                            fontSize: '11px',
                            color: '#6b7280',
                            transition: 'color 0.15s',
                          }}
                          title="Aumentar"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playSound('click');
                            setCorazonesFeedback(null);
                            setCorazonesGuess((prev) => (prev === null ? 1 : Math.max(0, prev - 1)));
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '1px 3px',
                            lineHeight: 1,
                            fontSize: '11px',
                            color: '#6b7280',
                            transition: 'color 0.15s',
                          }}
                          title="Disminuir"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* "Comprobar" Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (corazonesGuess === null) {
                        playSound('wrong');
                        setCorazonesFeedback('Escribe o selecciona una respuesta');
                        return;
                      }
                      if (corazonesGuess === correctCorazonesVal) {
                        playSound('correct');
                        triggerConfetti();
                        onAddCoins?.(10);
                        setCorazonesScore((s) => s + 10);
                        setCorazonesFeedback(`¡Correcto! ${currentCorazones.total} ÷ ${currentCorazones.kids} = ${correctCorazonesVal} corazones (+10 🪙)`);
                        setTimeout(() => {
                          setCorazonesProbIndex((p) => p + 1);
                          setCorazonesGuess(null);
                          setCorazonesFeedback(null);
                        }, 1800);
                      } else {
                        playSound('wrong');
                        setCorazonesFeedback(`¡Inténtalo de nuevo! ${currentCorazones.total} ÷ ${currentCorazones.kids} no es ${corazonesGuess}.`);
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '52px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      color: '#ffffff',
                      fontSize: '17px',
                      fontWeight: 900,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Comprobar
                  </button>

                  {/* Feedback message if any */}
                  {corazonesFeedback && (
                    <div
                      style={{
                        marginTop: '12px',
                        fontSize: '13px',
                        fontWeight: 800,
                        textAlign: 'center',
                        color: corazonesFeedback.startsWith('¡Correcto') ? '#059669' : '#e11d48',
                      }}
                    >
                      {corazonesFeedback}
                    </div>
                  )}

                  {/* Score display */}
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#6b7280',
                      marginTop: '12px',
                    }}
                  >
                    Puntaje: {corazonesScore}
                  </div>
                </div>
              )}

              {activeMinigame === 'reloj' && (
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
                  {/* Top Analog Clock Icon matching exact reference */}
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: '#4b5563',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      padding: '4px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: '#e2e8f0',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Center dot */}
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#1e293b',
                          position: 'absolute',
                          zIndex: 3,
                        }}
                      />
                      {/* Vertical pink/red hand pointing to 12 */}
                      <div
                        style={{
                          width: '3px',
                          height: '18px',
                          background: '#f43f5e',
                          position: 'absolute',
                          top: '4px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          borderRadius: '2px',
                          zIndex: 2,
                        }}
                      />
                      {/* Horizontal dark hand pointing to 3 */}
                      <div
                        style={{
                          width: '14px',
                          height: '3px',
                          background: '#1e293b',
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          borderRadius: '2px',
                          zIndex: 2,
                        }}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '24px',
                      fontWeight: 900,
                      color: '#1e1035',
                      margin: '0 0 8px',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Reto del Reloj
                  </h3>

                  {/* Subtitle */}
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: '0 0 22px',
                      lineHeight: 1.4,
                    }}
                  >
                    Convierte entre horas, minutos y segundos
                  </p>

                  {/* Lavender/Periwinkle Question Card */}
                  <div
                    style={{
                      background: '#f0eeff',
                      borderRadius: '24px',
                      padding: '36px 20px',
                      margin: '0 auto 22px',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '22px',
                        fontWeight: 900,
                        color: '#1e1035',
                        lineHeight: 1.35,
                      }}
                    >
                      {currentReloj.question}
                    </div>
                  </div>

                  {/* Input Selector (White box with purple border, ? or number, stepper arrows) */}
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 22px' }}>
                    <div
                      style={{
                        width: '124px',
                        height: '46px',
                        borderRadius: '14px',
                        border: '2px solid #c4b5fd',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 10px 0 14px',
                        boxShadow: '0 2px 8px rgba(196,181,253,0.18)',
                      }}
                    >
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="?"
                        value={relojInputGuess === null ? '' : String(relojInputGuess)}
                        onChange={(e) => {
                          setRelojFeedback(null);
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val === '') {
                            setRelojInputGuess(null);
                          } else {
                            const num = parseInt(val, 10);
                            if (!isNaN(num) && num >= 0 && num <= 9999) {
                              setRelojInputGuess(num);
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const guess = relojInputGuess;
                            if (guess === null) {
                              playSound('wrong');
                              setRelojFeedback('Escribe o selecciona una respuesta');
                              return;
                            }
                            if (guess === currentReloj.answer) {
                              playSound('correct');
                              triggerConfetti();
                              onAddCoins?.(15);
                              setRelojScore((s) => s + 15);
                              setRelojFeedback(`¡Correcto! ${currentReloj.explanation} (+15 🪙)`);
                              setTimeout(() => {
                                setRelojProbIndex((p) => p + 1);
                                setRelojInputGuess(null);
                                setRelojFeedback(null);
                              }, 1800);
                            } else {
                              playSound('wrong');
                              setRelojFeedback(`¡Inténtalo de nuevo! La respuesta no es ${guess}.`);
                            }
                          }
                        }}
                        style={{
                          flex: 1,
                          width: '100%',
                          minWidth: 0,
                          textAlign: 'center',
                          fontSize: '22px',
                          fontWeight: 900,
                          color: '#2e1065',
                          letterSpacing: '-0.02em',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          padding: 0,
                        }}
                      />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginLeft: '6px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            playSound('click');
                            setRelojFeedback(null);
                            setRelojInputGuess((prev) => (prev === null ? 10 : prev + 10));
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '1px 3px',
                            lineHeight: 1,
                            fontSize: '11px',
                            color: '#6b7280',
                            transition: 'color 0.15s',
                          }}
                          title="Aumentar"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playSound('click');
                            setRelojFeedback(null);
                            setRelojInputGuess((prev) => (prev === null ? 0 : Math.max(0, prev - 10)));
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '1px 3px',
                            lineHeight: 1,
                            fontSize: '11px',
                            color: '#6b7280',
                            transition: 'color 0.15s',
                          }}
                          title="Disminuir"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* "Comprobar" Button (Orange gradient exact to screenshot) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (relojInputGuess === null) {
                        playSound('wrong');
                        setRelojFeedback('Escribe o selecciona una respuesta');
                        return;
                      }
                      if (relojInputGuess === currentReloj.answer) {
                        playSound('correct');
                        triggerConfetti();
                        onAddCoins?.(15);
                        setRelojScore((s) => s + 15);
                        setRelojFeedback(`¡Correcto! ${currentReloj.explanation} (+15 🪙)`);
                        setTimeout(() => {
                          setRelojProbIndex((p) => p + 1);
                          setRelojInputGuess(null);
                          setRelojFeedback(null);
                        }, 1800);
                      } else {
                        playSound('wrong');
                        setRelojFeedback(`¡Inténtalo de nuevo! La respuesta no es ${relojInputGuess}.`);
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '52px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      color: '#ffffff',
                      fontSize: '17px',
                      fontWeight: 900,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(234, 88, 12, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Comprobar
                  </button>

                  {/* Feedback message if any */}
                  {relojFeedback && (
                    <div
                      style={{
                        marginTop: '12px',
                        fontSize: '13px',
                        fontWeight: 800,
                        textAlign: 'center',
                        color: relojFeedback.startsWith('¡Correcto') ? '#059669' : '#e11d48',
                      }}
                    >
                      {relojFeedback}
                    </div>
                  )}

                  {/* Score display */}
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#6b7280',
                      marginTop: '12px',
                    }}
                  >
                    Puntaje: {relojScore}
                  </div>
                </div>
              )}

              {activeMinigame === 'tienda' && (
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
                  {/* Store Icon matching exact reference */}
                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: '10px',
                      lineHeight: 1,
                      filter: 'drop-shadow(0 4px 10px rgba(16, 185, 129, 0.25))',
                    }}
                  >
                    🏪
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '24px',
                      fontWeight: 900,
                      color: '#1e1035',
                      margin: '0 0 24px',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Tienda de Math — Da el cambio
                  </h3>

                  {/* Peach / Warm Cream Question Box */}
                  <div
                    style={{
                      background: '#fdf2e9',
                      borderRadius: '24px',
                      padding: '30px 24px',
                      margin: '0 auto 24px',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '17px',
                        lineHeight: 1.5,
                        color: '#1f2937',
                        margin: 0,
                      }}
                    >
                      Un cliente compra <strong>{currentTienda.item}</strong> que cuesta <strong>${currentTienda.price}</strong> y paga con un billete de <strong>${currentTienda.paid}</strong>.
                      <br />
                      ¿Cuánto cambio le das?
                    </p>
                  </div>

                  {/* Input Selector (White box with purple border, ? or number, stepper arrows) */}
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 22px' }}>
                    <div
                      style={{
                        width: '124px',
                        height: '46px',
                        borderRadius: '14px',
                        border: '2px solid #c4b5fd',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 10px 0 14px',
                        boxShadow: '0 2px 8px rgba(196,181,253,0.18)',
                      }}
                    >
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="?"
                        value={tiendaInputGuess === null ? '' : String(tiendaInputGuess)}
                        onChange={(e) => {
                          setTiendaFeedback(null);
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val === '') {
                            setTiendaInputGuess(null);
                          } else {
                            const num = parseInt(val, 10);
                            if (!isNaN(num) && num >= 0 && num <= 99999) {
                              setTiendaInputGuess(num);
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const guess = tiendaInputGuess;
                            if (guess === null) {
                              playSound('wrong');
                              setTiendaFeedback('Escribe o selecciona una respuesta');
                              return;
                            }
                            if (guess === currentTienda.answer) {
                              playSound('correct');
                              triggerConfetti();
                              onAddCoins?.(20);
                              setTiendaScore((s) => s + 20);
                              setTiendaFeedback(`¡Correcto! $${currentTienda.paid} - $${currentTienda.price} = $${currentTienda.answer} de cambio (+20 🪙)`);
                              setTimeout(() => {
                                setTiendaProbIndex((p) => p + 1);
                                setTiendaInputGuess(null);
                                setTiendaFeedback(null);
                              }, 1800);
                            } else {
                              playSound('wrong');
                              setTiendaFeedback(`¡Casi! Resta $${currentTienda.paid} - $${currentTienda.price}. Intenta de nuevo.`);
                            }
                          }
                        }}
                        style={{
                          flex: 1,
                          width: '100%',
                          minWidth: 0,
                          textAlign: 'center',
                          fontSize: '22px',
                          fontWeight: 900,
                          color: '#2e1065',
                          letterSpacing: '-0.02em',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          padding: 0,
                        }}
                      />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginLeft: '6px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            playSound('click');
                            setTiendaFeedback(null);
                            setTiendaInputGuess((prev) => (prev === null ? 100 : prev + 100));
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '1px 3px',
                            lineHeight: 1,
                            fontSize: '11px',
                            color: '#6b7280',
                            transition: 'color 0.15s',
                          }}
                          title="Aumentar"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playSound('click');
                            setTiendaFeedback(null);
                            setTiendaInputGuess((prev) => (prev === null ? 0 : Math.max(0, prev - 100)));
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '1px 3px',
                            lineHeight: 1,
                            fontSize: '11px',
                            color: '#6b7280',
                            transition: 'color 0.15s',
                          }}
                          title="Disminuir"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* "Cobrar" Button (Emerald / Green gradient exact to screenshot) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (tiendaInputGuess === null) {
                        playSound('wrong');
                        setTiendaFeedback('Escribe o selecciona una respuesta');
                        return;
                      }
                      if (tiendaInputGuess === currentTienda.answer) {
                        playSound('correct');
                        triggerConfetti();
                        onAddCoins?.(20);
                        setTiendaScore((s) => s + 20);
                        setTiendaFeedback(`¡Correcto! $${currentTienda.paid} - $${currentTienda.price} = $${currentTienda.answer} de cambio (+20 🪙)`);
                        setTimeout(() => {
                          setTiendaProbIndex((p) => p + 1);
                          setTiendaInputGuess(null);
                          setTiendaFeedback(null);
                        }, 1800);
                      } else {
                        playSound('wrong');
                        setTiendaFeedback(`¡Casi! Resta $${currentTienda.paid} - $${currentTienda.price}. Intenta de nuevo.`);
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '52px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#ffffff',
                      fontSize: '17px',
                      fontWeight: 900,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Cobrar
                  </button>

                  {/* Feedback message if any */}
                  {tiendaFeedback && (
                    <div
                      style={{
                        marginTop: '12px',
                        fontSize: '13px',
                        fontWeight: 800,
                        textAlign: 'center',
                        color: tiendaFeedback.startsWith('¡Correcto') ? '#059669' : '#e11d48',
                      }}
                    >
                      {tiendaFeedback}
                    </div>
                  )}

                  {/* Score display */}
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#6b7280',
                      marginTop: '12px',
                    }}
                  >
                    Puntaje: {tiendaScore}
                  </div>
                </div>
              )}

              {activeMinigame === 'insignias' && (
                <div>
                  {/* Hero Header centrado */}
                  <div style={{ textAlign: 'center', marginTop: '-24px', marginBottom: '18px' }}>
                    <div
                      style={{
                        fontSize: '48px',
                        marginBottom: '4px',
                        lineHeight: 1,
                        filter: 'drop-shadow(0 4px 10px rgba(245,158,11,0.25))',
                      }}
                    >
                      🏅
                    </div>
                    <h3
                      style={{
                        fontSize: '26px',
                        fontWeight: 900,
                        color: '#2e1065',
                        margin: '0 0 4px',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Mis Insignias
                    </h3>
                    <p
                      style={{
                        fontSize: '13.5px',
                        fontWeight: 700,
                        color: '#6366f1',
                        margin: 0,
                      }}
                    >
                      {earnedInsignias.length} de {BADGES_TERCERO.length} desbloqueadas
                    </p>
                  </div>

                  {/* 3-Column Badges Grid (Idéntico a Imagen 1) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px',
                      padding: '4px 2px 20px',
                    }}
                  >
                    {BADGES_TERCERO.map((badge) => {
                      const isUnlocked = earnedInsignias.includes(badge.id);
                      return (
                        <div
                          key={badge.id}
                          style={{
                            background: isUnlocked ? 'linear-gradient(135deg, #fffbeb, #fef3c7)' : '#ffffff',
                            border: isUnlocked ? '1.5px solid #fcd34d' : '1.5px solid #e2e8f0',
                            borderRadius: '20px',
                            padding: '16px 8px 14px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            boxShadow: isUnlocked
                              ? '0 4px 12px rgba(245,158,11,0.15)'
                              : '0 2px 6px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '36px',
                              height: '42px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '6px',
                              lineHeight: 1,
                              filter: isUnlocked ? 'none' : 'grayscale(0.20)',
                              opacity: isUnlocked ? 1 : 0.95,
                            }}
                          >
                            {badge.icon}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: 900,
                              color: isUnlocked ? '#78350f' : '#475569',
                              lineHeight: 1.25,
                              marginBottom: '4px',
                              minHeight: '30px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {badge.name}
                          </div>
                          <div
                            style={{
                              fontSize: '10.5px',
                              color: isUnlocked ? '#b45309' : '#94a3b8',
                              lineHeight: 1.25,
                              fontWeight: 600,
                              minHeight: '26px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {badge.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              7. GALAXIA 3D (Exacto a Imagen con espaciado generoso)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'galaxia3d' && (
            <div style={{ textAlign: 'center', padding: '10px 4px 16px' }}>
              {/* Central Galaxy Icon (Rounded Box matching Screenshot) */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(22, 17, 41, 0.28)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GalaxyArtSvg size={70} />
                </div>
              </div>

              {/* Subtitle / Description */}
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#475569',
                  margin: '0 0 24px',
                  letterSpacing: '-0.01em',
                }}
              >
                Cada estrella es una unidad de tu viaje matemático.
              </p>

              {/* Pills / Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                {/* Row 1: 4 Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#24125e',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      padding: '9px 18px',
                      fontSize: '14px',
                      fontWeight: 800,
                      boxShadow: '0 3px 10px rgba(36, 18, 94, 0.2)',
                    }}
                  >
                    <span>⭐</span>
                    <span style={{ color: '#c084fc', fontWeight: 900, fontSize: '15px' }}>＋</span>
                    <span>Adición</span>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#24125e',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      padding: '9px 18px',
                      fontSize: '14px',
                      fontWeight: 800,
                      boxShadow: '0 3px 10px rgba(36, 18, 94, 0.2)',
                    }}
                  >
                    <span>⭐</span>
                    <span style={{ color: '#c084fc', fontWeight: 900, fontSize: '15px' }}>—</span>
                    <span>Sustracción</span>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#24125e',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      padding: '9px 18px',
                      fontSize: '14px',
                      fontWeight: 800,
                      boxShadow: '0 3px 10px rgba(36, 18, 94, 0.2)',
                    }}
                  >
                    <span>⭐</span>
                    <span style={{ color: '#c084fc', fontWeight: 900, fontSize: '14px' }}>✕</span>
                    <span>Multiplicación</span>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#24125e',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      padding: '9px 18px',
                      fontSize: '14px',
                      fontWeight: 800,
                      boxShadow: '0 3px 10px rgba(36, 18, 94, 0.2)',
                    }}
                  >
                    <span>⭐</span>
                    <span style={{ color: '#c084fc', fontWeight: 900, fontSize: '16px' }}>÷</span>
                    <span>División</span>
                  </div>
                </div>

                {/* Row 2: 2 Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#24125e',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      padding: '9px 18px',
                      fontSize: '14px',
                      fontWeight: 800,
                      boxShadow: '0 3px 10px rgba(36, 18, 94, 0.2)',
                    }}
                  >
                    <span>⭐</span>
                    <span style={{ fontSize: '14px', lineHeight: 1 }}>🔢</span>
                    <span>Decimal</span>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#24125e',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      padding: '9px 18px',
                      fontSize: '14px',
                      fontWeight: 800,
                      boxShadow: '0 3px 10px rgba(36, 18, 94, 0.2)',
                    }}
                  >
                    <span>⭐</span>
                    <span style={{ fontSize: '14px', lineHeight: 1 }}>📊</span>
                    <span>Estadística</span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <p
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#94a3b8',
                  marginTop: '26px',
                  marginBottom: '4px',
                }}
              >
                ¡Sigue aprendiendo para iluminar tu galaxia!
              </p>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              8. HISTORIA DE FEDOR (Exacto a Imagen de Referencia)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'historia' && (
            <div style={{ color: '#334155', fontSize: '14.5px', lineHeight: 1.65, paddingTop: '4px' }}>
              <p style={{ margin: '0 0 16px', fontWeight: 500 }}>
                Fedor es un joven explorador espacial que viajó desde una lejana galaxia para aprender las matemáticas del universo. Desde pequeño, Fedor soñaba con las estrellas y descubrió que los números son el idioma del cosmos.
              </p>

              <p style={{ margin: '0 0 16px', fontWeight: 500 }}>
                En su nave espacial 🚀, Fedor recorre planetas resolviendo operaciones matemáticas y ayudando a los habitantes del sistema solar. Cada misión cumplida le acerca más a convertirse en el Gran Matemático Estelar.
              </p>

              <p style={{ margin: '0 0 18px', fontWeight: 500 }}>
                <strong style={{ color: '#0f172a', fontWeight: 800 }}>¡Tú también puedes acompañarlo!</strong> Cada ejercicio que resuelves es un paso más en el viaje de Fedor hacia el conocimiento. Las matemáticas son su superpoder — ¡y el tuyo también! 🌟
              </p>

              {/* Logros de Fedor Card */}
              <div
                style={{
                  background: '#f3effc',
                  borderRadius: '18px',
                  padding: '18px 22px',
                  marginTop: '18px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 900,
                    fontSize: '15px',
                    color: '#24125e',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>🏆</span>
                  <span>Logros de Fedor:</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    color: '#475569',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    paddingLeft: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#64748b' }}>•</span>
                    <span>Cadete Estelar — Nivel inicial</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#64748b' }}>•</span>
                    <span>Explorador Numérico — Suma y resta dominadas</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#64748b' }}>•</span>
                    <span>Comandante Matemático — Multiplicación y división</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#64748b' }}>•</span>
                    <span>Gran Maestro Estelar — ¡Todas las unidades completadas!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              9. ESTÁNDARES MATEMÁTICOS MEN (Exacto a Imagen 2)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'estandares' && (
            <div>
              {/* Subtitle / Breadcrumb */}
              <div style={{ textAlign: 'center', margin: '-2px 0 18px' }}>
                <span style={{ color: '#a16207', fontWeight: 700, fontSize: '13px', letterSpacing: '0.01em' }}>
                  MEN Colombia · DBA · Pensamientos Matemáticos · Competencias · Niveles de Desempeño
                </span>
              </div>

              {/* 5 Tabs Horizontales con espaciado amplio */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginBottom: '20px',
                }}
              >
                {[
                  { id: 'num', lbl: 'Numérico', ico: '🔢' },
                  { id: 'geo', lbl: 'Geométrico', ico: '📐' },
                  { id: 'met', lbl: 'Métrico', ico: '📏' },
                  { id: 'est', lbl: 'Estadístico', ico: '📊' },
                  { id: 'var', lbl: 'Variacional', ico: '🔣' },
                ].map((t) => {
                  const isActive = estTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setEstTab(t.id);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '9px 18px',
                        borderRadius: '14px',
                        fontSize: '13.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: 'none',
                        background: isActive ? '#38126e' : '#f3eefa',
                        color: isActive ? '#ffffff' : '#1e1035',
                        boxShadow: isActive ? '0 4px 14px rgba(56, 18, 110, 0.25)' : 'none',
                      }}
                    >
                      <span style={{ fontSize: '14px' }}>{t.ico}</span>
                      <span>{t.lbl}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cards List */}
              {EST_DATA_3RO[estTab] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Banner: Título del pensamiento actual */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#fcfaff',
                      border: '1px solid #f3e8ff',
                      borderLeft: '4px solid #6d28d9',
                      borderRadius: '14px',
                      padding: '12px 18px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    <span style={{ fontSize: '14.5px', fontWeight: 900, color: '#38126e' }}>
                      {EST_DATA_3RO[estTab].title}
                    </span>
                  </div>

                  {/* Las tarjetas (Estándar MEN, Competencias, DBA, Niveles) */}
                  {EST_DATA_3RO[estTab].cards.map((card, cIdx) => (
                    <div
                      key={cIdx}
                      style={{
                        background: '#fcfaff',
                        border: '1px solid #f3e8ff',
                        borderLeft: '4px solid #6d28d9',
                        borderRadius: '16px',
                        padding: '16px 20px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                      }}
                    >
                      {/* Título de la tarjeta */}
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: 900,
                          color: '#38126e',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {card.h}
                      </div>

                      {/* Lista de ítems */}
                      {card.items && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', paddingLeft: '4px' }}>
                          {card.items.map((it, iIdx) => (
                            <div
                              key={iIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                color: '#334155',
                                fontSize: '13.5px',
                                lineHeight: 1.55,
                              }}
                            >
                              <span style={{ color: '#64748b', fontSize: '14px', lineHeight: '21px' }}>•</span>
                              <span dangerouslySetInnerHTML={{ __html: it }} />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Niveles de Desempeño si aplica */}
                      {card.niveles && card.niv && (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                            gap: '12px',
                            paddingTop: '6px',
                          }}
                        >
                          {card.niv.map((nv, nIdx) => (
                            <div
                              key={nIdx}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '12px 14px',
                              }}
                            >
                              <div style={{ fontWeight: 900, fontSize: '13px', color: '#1e1035' }}>
                                {nv.t}
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                                {nv.d}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              10. MISIONES DIARIAS (Exacto a Imagen)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'misiones' && (
            <div>
              {/* Subtitle */}
              <div style={{ textAlign: 'center', margin: '-4px 0 14px' }}>
                <span style={{ color: '#475569', fontWeight: 700, fontSize: '13.5px' }}>
                  ¡Completa las misiones de hoy y gana monedas extra! 🪙
                </span>
              </div>

              {/* Date banner */}
              {(() => {
                const todayFormatted = (() => {
                  try {
                    const d = new Date();
                    const str = d.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    });
                    return str.charAt(0).toUpperCase() + str.slice(1);
                  } catch {
                    return 'Sábado, 12 de septiembre de 2026';
                  }
                })();

                const completedCount = missions.filter((m) => m.done).length;
                const totalCount = missions.length || 5;
                const pct = Math.round((completedCount / totalCount) * 100);

                return (
                  <>
                    <div
                      style={{
                        background: '#581c87',
                        color: '#ffffff',
                        textAlign: 'center',
                        fontWeight: 800,
                        fontSize: '13.5px',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        marginBottom: '14px',
                        letterSpacing: '0.01em',
                        boxShadow: '0 2px 8px rgba(88, 28, 135, 0.2)',
                      }}
                    >
                      🗓️ {todayFormatted}
                    </div>

                    {/* Missions list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {missions.map((m) => {
                        return (
                          <div
                            key={m.id}
                            onClick={() => {
                              if (!m.done) {
                                onAddCoins?.(m.coinsReward);
                                onAddXP?.(m.xpReward);
                                playSound('coin');
                                triggerConfetti();
                                fedorSpeak(`¡Excelente trabajo! Has completado la misión ${m.title} y ganado ${m.coinsReward} monedas.`);
                                setMissions((prev) => {
                                  const updated = prev.map((x) => (x.id === m.id ? { ...x, done: true, current: x.goal } : x));
                                  try {
                                    localStorage.setItem('fedor3_daily_missions_v2', JSON.stringify(updated));
                                  } catch {}
                                  return updated;
                                });
                              }
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: m.done ? '#fcfaff' : '#ffffff',
                              border: m.done ? '1.5px solid #a855f7' : '1px solid #ede9fe',
                              borderRadius: '16px',
                              padding: '13px 20px',
                              cursor: m.done ? 'default' : 'pointer',
                              transition: 'all 0.15s ease',
                              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                            }}
                            className={!m.done ? 'hover:border-purple-300 hover:shadow-sm' : ''}
                          >
                            {/* Left: Circle + Icon & Title + Description */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                              <div
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  border: m.done ? 'none' : '2px solid #581c87',
                                  background: m.done ? '#6d28d9' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#ffffff',
                                  fontSize: '13px',
                                  fontWeight: 900,
                                  flexShrink: 0,
                                }}
                              >
                                {m.done && '✓'}
                              </div>

                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px',
                                    fontWeight: 800,
                                    color: '#1e1035',
                                  }}
                                >
                                  <span style={{ fontSize: '15px' }}>{m.icon}</span>
                                  <span style={{ textDecoration: m.done ? 'line-through' : 'none', opacity: m.done ? 0.8 : 1 }}>
                                    {m.title}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: '#64748b',
                                    marginTop: '2px',
                                  }}
                                >
                                  {m.desc}
                                </div>
                              </div>
                            </div>

                            {/* Right: Coins reward */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '13px',
                                fontWeight: 800,
                                color: '#d97706',
                                flexShrink: 0,
                                marginLeft: '12px',
                              }}
                            >
                              <span>🪙</span>
                              <span>{m.coinsReward} monedas</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Special Mission Card */}
                    <div
                      style={{
                        background: '#fffdf0',
                        border: '1px solid #fef08a',
                        borderLeft: '4px solid #ca8a04',
                        borderRadius: '16px',
                        padding: '14px 20px',
                        marginTop: '12px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 900,
                          color: '#854d0e',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '4px',
                        }}
                      >
                        <span>⭐</span>
                        <span>MISIÓN ESPECIAL</span>
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#713f12', margin: 0, lineHeight: 1.5 }}>
                        Resuelve <strong>5 ejercicios seguidos sin errores</strong> en cualquier tema de 3° y gana <strong>×2 monedas 🪙 🪙</strong>
                      </p>
                    </div>

                    {/* Progreso del día */}
                    <div style={{ marginTop: '16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          color: '#38126e',
                        }}
                      >
                        <span>Progreso del día</span>
                        <span>{completedCount} / {totalCount} misiones</span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '9px',
                          background: '#e2e8f0',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #6d28d9, #9333ea)',
                            borderRadius: '9999px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              11. DEFINICIONES (GLOSARIO)
          ───────────────────────────────────────────────────────────── */}
          {/* ─────────────────────────────────────────────────────────────
              11. DEFINICIONES (GLOSARIO) (Exacto a Imagen)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'definiciones' && (
            <div>
              {/* 8 Unit Filter Tabs */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginBottom: '20px',
                }}
              >
                {[
                  { id: 'adi', lbl: 'Adición', ico: '➕' },
                  { id: 'sus', lbl: 'Sustracción', ico: '➖' },
                  { id: 'mul', lbl: 'Multiplicación', ico: '✖️' },
                  { id: 'div', lbl: 'División', ico: '➗' },
                  { id: 'num', lbl: 'Números', ico: '🔢' },
                  { id: 'geo', lbl: 'Geometría', ico: '📐' },
                  { id: 'med', lbl: 'Medida', ico: '📏' },
                  { id: 'est', lbl: 'Estadística', ico: '📊' },
                ].map((t) => {
                  const isActive = defTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setDefTab(t.id);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: 'none',
                        background: isActive ? '#4c1d95' : '#ede9fe',
                        color: isActive ? '#ffffff' : '#1e1035',
                        boxShadow: isActive ? '0 4px 12px rgba(76, 29, 149, 0.25)' : 'none',
                      }}
                    >
                      <span style={{ fontSize: '13px' }}>{t.ico}</span>
                      <span>{t.lbl}</span>
                    </button>
                  );
                })}
              </div>

              {/* Definition Groups */}
              {DEF_DATA_3RO[defTab] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {DEF_DATA_3RO[defTab].grupos.map((grp, gIdx) => (
                    <div
                      key={gIdx}
                      style={{
                        background: '#fcfaff',
                        border: '1px solid #f3e8ff',
                        borderLeft: '4px solid #6d28d9',
                        borderRadius: '16px',
                        padding: '18px 24px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                      }}
                    >
                      {/* Group Header */}
                      <div
                        style={{
                          fontSize: '14.5px',
                          fontWeight: 900,
                          color: '#15803d',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '14px',
                        }}
                      >
                        <span>📗</span>
                        <span>{grp.name}</span>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {grp.items.map((it, iIdx) => (
                          <div
                            key={iIdx}
                            style={{
                              fontSize: '13px',
                              lineHeight: 1.6,
                              color: '#334155',
                            }}
                          >
                            <strong style={{ fontWeight: 900, color: '#1e1035', fontSize: '13.5px' }}>
                              {it.t}:{' '}
                            </strong>
                            <span>{it.d} </span>
                            {it.ex && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#ede9fe',
                                  color: '#4c1d95',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  padding: '3px 10px',
                                  borderRadius: '8px',
                                  marginLeft: '6px',
                                  verticalAlign: 'baseline',
                                }}
                              >
                                Ej: {it.ex}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              12. MARATÓN (60 SEGUNDOS)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'maraton' && (
            <div>
              {maratonState === 'start' && (
                <div className="text-center py-4 space-y-3">
                  <div className="text-5xl animate-bounce">🏃</div>
                  <h4 className="text-lg font-black text-orange-900">Prueba Saber — Modo Maratón</h4>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto">
                    Responde todas las preguntas posibles en <b>60 segundos</b> sin parar.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setMaratonState('playing');
                      setMaratonTimer(60);
                      setMaratonScore(0);
                    }}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-xs shadow-md cursor-pointer"
                  >
                    🏃 ¡Iniciar Carrera (60s)!
                  </button>
                </div>
              )}

              {maratonState === 'playing' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-orange-50 border border-orange-200 p-2.5 rounded-xl">
                    <span className="font-black text-sm text-orange-800">⏱️ {maratonTimer}s</span>
                    <span className="font-black text-sm text-emerald-700">Puntos: {maratonScore * 10}</span>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center font-black text-sm text-gray-900">
                    {MARATON_QUESTIONS[maratonIdx % MARATON_QUESTIONS.length].q}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {MARATON_QUESTIONS[maratonIdx % MARATON_QUESTIONS.length].opts.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => {
                          const isOk = oIdx === MARATON_QUESTIONS[maratonIdx % MARATON_QUESTIONS.length].ans;
                          if (isOk) {
                            playSound('correct');
                            setMaratonScore((s) => s + 1);
                          } else {
                            playSound('wrong');
                          }
                          setMaratonIdx((i) => i + 1);
                        }}
                        className="p-2.5 bg-white border border-gray-300 hover:border-orange-500 rounded-xl text-xs font-black text-gray-800"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {maratonState === 'end' && (
                <div className="text-center py-4 space-y-2.5">
                  <div className="text-5xl">🏁</div>
                  <h4 className="text-lg font-black text-emerald-800">¡Carrera Finalizada!</h4>
                  <p className="text-xs text-gray-600">Aciertos: {maratonScore} preguntas</p>
                  <button
                    type="button"
                    onClick={() => {
                      onAddCoins?.(maratonScore * 5);
                      setMaratonState('start');
                    }}
                    className="px-5 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs"
                  >
                    Jugar de nuevo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              13. EXPLICAR (MÉTODO FEDOR PASO A PASO)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'explicar' && (
            <div className="space-y-3.5">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-100">
                {(['adicion', 'sustraccion', 'multiplicacion', 'division'] as const).map((op) => {
                  const labels = {
                    adicion: '➕ Adición',
                    sustraccion: '➖ Sustracción',
                    multiplicacion: '✖️ Multiplicación',
                    division: '➗ División',
                  };
                  return (
                    <button
                      key={op}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setExplOp(op);
                        setExplIdx(0);
                        if (op === 'adicion') setExplSub('sin-llevar');
                        else if (op === 'sustraccion') setExplSub('sin-prestar');
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap ${
                        explOp === op ? 'bg-[#D97706] text-white shadow-sm' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {labels[op]}
                    </button>
                  );
                })}
              </div>

              {(explOp === 'adicion' || explOp === 'sustraccion') && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setExplSub(explOp === 'adicion' ? 'sin-llevar' : 'sin-prestar');
                      setExplIdx(0);
                    }}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                      explSub === 'sin-llevar' || explSub === 'sin-prestar'
                        ? 'bg-purple-700 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {explOp === 'adicion' ? 'Sin llevar' : 'Sin prestar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExplSub(explOp === 'adicion' ? 'llevando' : 'prestamo');
                      setExplIdx(0);
                    }}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                      explSub === 'llevando' || explSub === 'prestamo'
                        ? 'bg-purple-700 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {explOp === 'adicion' ? 'Llevando' : 'Prestando'}
                  </button>
                </div>
              )}

              {(() => {
                const catData = EXPL_DATA_3RO[explOp];
                let currentList: ExplStepItem[] = [];
                if (Array.isArray(catData)) {
                  currentList = catData;
                } else if (catData && typeof catData === 'object') {
                  currentList = (catData as ExplSubcategory)[explSub] || Object.values(catData)[0] || [];
                }
                const currentItem = currentList[explIdx] || currentList[0];
                if (!currentItem) return <div className="text-xs text-gray-500">Sin datos.</div>;

                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center font-mono text-xl font-black text-purple-900 whitespace-pre">
                        {currentItem.op}
                      </div>
                      <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-2xl text-xs space-y-1">
                        <div className="font-black text-purple-900 uppercase">Procedimiento:</div>
                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">{currentItem.proc}</div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-2 text-xs">
                      <div className="flex-1 text-gray-700 leading-snug">{currentItem.expl}</div>
                      <button
                        type="button"
                        onClick={() => fedorSpeak(currentItem.speech)}
                        className="px-2.5 py-1 bg-amber-500 text-white rounded-lg font-bold text-xs flex-shrink-0 cursor-pointer"
                      >
                        🔊 Escuchar
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .insignias-custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .insignias-custom-scroll::-webkit-scrollbar-track {
          background: #f5f3ff;
          border-radius: 9999px;
        }
        .insignias-custom-scroll::-webkit-scrollbar-thumb {
          background: #6d28d9;
          border-radius: 9999px;
        }
        .insignias-custom-scroll::-webkit-scrollbar-button:single-button:vertical:decrement {
          height: 12px;
          width: 8px;
          background-position: center 2px;
          background-repeat: no-repeat;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='8' viewBox='0 0 10 8' fill='%236d28d9'><polygon points='5,0 0,8 10,8'/></svg>");
        }
        .insignias-custom-scroll::-webkit-scrollbar-button:single-button:vertical:increment {
          height: 12px;
          width: 8px;
          background-position: center 2px;
          background-repeat: no-repeat;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='8' viewBox='0 0 10 8' fill='%236d28d9'><polygon points='0,0 10,0 5,8'/></svg>");
        }
        .insignias-custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: #6d28d9 #f5f3ff;
        }
      `}} />
    </div>
  );
}
