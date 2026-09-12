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
  const [activeMinigame, setActiveMinigame] = useState<'picker' | 'pizza' | 'reloj' | 'tienda'>('picker');
  const [pizzaSlices, setPizzaSlices] = useState<number | null>(null);
  const [relojGuess, setRelojGuess] = useState<string | null>(null);
  const [tiendaChange, setTiendaChange] = useState<number | null>(null);

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
          activeModal === 'tienda' ? 'max-w-[560px]' : 'max-w-[500px]'
        } max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-purple-200/40`}
      >
        {/* ══════════════════════════════════════════════════════════════════
            HEADER CON COLOR ESPECÍFICO DE CADA POPUP
        ══════════════════════════════════════════════════════════════════ */}
        <div
          className="flex items-center justify-between px-5 py-3.5 text-white"
          style={{
            background:
              activeModal === 'tienda'
                ? 'linear-gradient(135deg, #10B981, #059669)' // Exact Emerald Green (Imagen 1)
                : activeModal === 'espacial'
                ? 'linear-gradient(135deg, #4C1D95, #6D28B4)' // Exact Deep Purple (Imagen 2)
                : activeModal === 'diario'
                ? 'linear-gradient(135deg, #0E6BA8, #3AA0FF)' // Exact Blue (Imagen 3)
                : activeModal === 'examen'
                ? 'linear-gradient(135deg, #A30041, #FF1D4E)' // Exact Crimson / Magenta (Imagen 4)
                : activeModal === 'stickers'
                ? 'linear-gradient(135deg, #9B0066, #FF1DAA)'
                : activeModal === 'juegos' || activeModal === 'minijuegos'
                ? 'linear-gradient(135deg, #FF1D4E, #FF8C2A)'
                : activeModal === 'galaxia3d'
                ? 'linear-gradient(135deg, #102A70, #2563EB)'
                : activeModal === 'historia'
                ? 'linear-gradient(135deg, #78350F, #B45309)'
                : activeModal === 'estandares'
                ? 'linear-gradient(135deg, #1E293B, #475569)'
                : activeModal === 'misiones'
                ? 'linear-gradient(135deg, #BE185D, #F43F5E)'
                : activeModal === 'definiciones'
                ? 'linear-gradient(135deg, #581C87, #9333EA)'
                : activeModal === 'maraton'
                ? 'linear-gradient(135deg, #9A3412, #EA580C)'
                : 'linear-gradient(135deg, #E8650A, #F5C518)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl drop-shadow">
              {activeModal === 'tienda' && '🛒'}
              {activeModal === 'espacial' && '🚀'}
              {activeModal === 'diario' && '📓'}
              {activeModal === 'examen' && '📝'}
              {activeModal === 'stickers' && '🎴'}
              {(activeModal === 'juegos' || activeModal === 'minijuegos') && '🎮'}
              {activeModal === 'galaxia3d' && '🌌'}
              {activeModal === 'historia' && '📖'}
              {activeModal === 'estandares' && '📋'}
              {activeModal === 'misiones' && '🎯'}
              {activeModal === 'definiciones' && '📚'}
              {activeModal === 'maraton' && '🏃'}
              {activeModal === 'explicar' && '💡'}
            </span>
            <h3 className="text-base md:text-lg font-black tracking-wide text-white drop-shadow">
              {activeModal === 'tienda' && 'Tienda Espacial 3°'}
              {activeModal === 'espacial' && 'Reto Espacial'}
              {activeModal === 'diario' && 'Diario del Explorador'}
              {activeModal === 'examen' && 'Examen Final del Libro'}
              {activeModal === 'stickers' && 'Álbum de Stickers'}
              {(activeModal === 'juegos' || activeModal === 'minijuegos') && 'Minijuegos de Fedor'}
              {activeModal === 'galaxia3d' && 'Galaxia 3D del Saber'}
              {activeModal === 'historia' && 'Historia de Fedor'}
              {activeModal === 'estandares' && 'Estándares Matemáticos — Grado 3°'}
              {activeModal === 'misiones' && 'Misiones Diarias del Cadete'}
              {activeModal === 'definiciones' && 'Definiciones por Unidad — 3°'}
              {activeModal === 'maraton' && 'Prueba Saber — Modo Maratón'}
              {activeModal === 'explicar' && 'Explicación — Método Fedor'}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/25 hover:bg-white/40 text-white font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            BODY DEL MODAL
        ══════════════════════════════════════════════════════════════════ */}
        <div className="p-4 md:p-5 overflow-y-auto flex-1 bg-white text-gray-800 text-sm">
          {/* ─────────────────────────────────────────────────────────────
              1. TIENDA (EXACTA A IMAGEN 1)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'tienda' && (
            <div className="space-y-3.5">
              {/* Tu saldo bar */}
              <div className="bg-[#F8F7FF] border border-[#ECE7FF] rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs md:text-sm font-extrabold">
                <span className="flex items-center gap-1.5 text-[#20084A]">
                  <span>🪙</span>
                  <span>Tu saldo</span>
                </span>
                <span className="text-[#6C28B4] font-black text-base">{coins}</span>
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
                      className={`py-2 px-1 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-tight transition-all cursor-pointer text-center flex flex-col sm:flex-row items-center justify-center gap-1 border ${
                        isActive
                          ? 'bg-[#7B2FBE] text-white border-[#7B2FBE] shadow-md shadow-purple-900/20'
                          : 'bg-white text-[#6C28B4] border-[#DDD6FE] hover:bg-purple-50'
                      }`}
                    >
                      <span className="text-xs">{tb.ico}</span>
                      <span>{tb.lbl}</span>
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
                  className={`w-full py-2 px-3 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 border ${
                    shopV2Tab === 'access'
                      ? 'bg-[#7B2FBE] text-white border-[#7B2FBE] shadow-md'
                      : 'bg-white text-[#6C28B4] border-[#DDD6FE] hover:bg-purple-50'
                  }`}
                >
                  <span>💎</span>
                  <span>ACCESORIOS</span>
                </button>
              </div>

              {/* Items grid (4 cols exact to Imagen 1) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {SHOP_V2_ITEMS_3RO.filter((it) => it.cat === shopV2Tab).map((item) => {
                  const isOwned = !!ownedShopIds[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleBuyV2Item(item)}
                      className={`bg-white border border-[#E4DEFF] rounded-2xl p-3 text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:shadow-md hover:border-[#9B5CFF] hover:-translate-y-0.5 transition-all ${
                        isOwned ? 'bg-[#F9F7FF] border-[#6C28B4]/40' : ''
                      }`}
                    >
                      <div className="text-3xl drop-shadow-sm my-0.5">{item.emoji}</div>
                      <div className="text-[11px] font-black text-[#1E0A40] line-clamp-1 leading-tight">
                        {item.name}
                      </div>
                      <div>
                        {isOwned ? (
                          <span className="bg-[#DCF5EE] text-[#074F3A] border border-[#95DAC4] text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block">
                            ✓ Comprado
                          </span>
                        ) : (
                          <span className="bg-[#FFF7ED] text-[#D97706] border border-[#FFEDD5] text-[10px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                            <span>{item.price}</span>
                            <span>🪙</span>
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
              2. RETO ESPACIAL (EXACTO A IMAGEN 2)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'espacial' && (
            <div>
              {espacialStep === 'info' && (
                <div className="space-y-3.5">
                  {/* Dark Space Cadete Banner */}
                  <div className="bg-[#0E0524] rounded-2xl p-4 text-center border border-[#3D1468]/60 shadow-inner">
                    <div className="text-xs md:text-sm font-black text-[#F5C518] flex items-center justify-center gap-1.5 tracking-wide">
                      <span>🛰️</span>
                      <span>Cadete Estelar</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#DDD6FE] mt-1">
                      Misiones espaciales completadas: <b>{misionesDone}</b> · Racha: <b>{streak} 🔥</b>
                    </div>
                  </div>

                  {/* Row 1: Reto diario de hoy */}
                  <div className="bg-[#F8F7FF] border border-[#ECE7FF] rounded-xl px-4 py-3 flex items-center justify-between text-xs md:text-sm font-extrabold">
                    <span className="text-[#20084A]">Reto diario de hoy</span>
                    <span className={`font-black flex items-center gap-1 ${espacialDoneToday ? 'text-[#16876A]' : 'text-[#7C3AED]'}`}>
                      {espacialDoneToday ? (
                        <>
                          <span>✅</span>
                          <span>Completado</span>
                        </>
                      ) : (
                        <>
                          <span>⏳</span>
                          <span>Disponible</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Row 2: Recompensa */}
                  <div className="bg-[#F8F7FF] border border-[#ECE7FF] rounded-xl px-4 py-3 flex items-center justify-between text-xs md:text-sm font-extrabold">
                    <span className="text-[#20084A]">Recompensa</span>
                    <span className="text-[#6D28B4] font-black text-sm flex items-center gap-1">
                      <span>+50 🪙</span>
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
                    className={`w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                      espacialDoneToday
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-[#6C28B4] via-[#9B5CFF] to-[#FF1D4E] hover:scale-102 active:scale-98 cursor-pointer shadow-purple-900/30'
                    }`}
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
            <div className="space-y-3">
              {/* Stat row 1: Racha actual */}
              <div className="bg-[#F8F7FF] border border-[#ECE7FF] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs md:text-sm font-extrabold">
                <span className="flex items-center gap-2 text-[#20084A]">
                  <span>🔥</span>
                  <span>Racha actual</span>
                </span>
                <span className="text-[#6C28B4] font-black">{streak} días</span>
              </div>

              {/* Stat row 2: Total ejercicios */}
              <div className="bg-[#F8F7FF] border border-[#ECE7FF] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs md:text-sm font-extrabold">
                <span className="flex items-center gap-2 text-[#20084A]">
                  <span>📚</span>
                  <span>Total ejercicios</span>
                </span>
                <span className="text-[#6C28B4] font-black">{totalXP > 0 ? Math.round(totalXP / 10) : 0}</span>
              </div>

              {/* Stat row 3: Minutos esta semana */}
              <div className="bg-[#F8F7FF] border border-[#ECE7FF] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs md:text-sm font-extrabold">
                <span className="flex items-center gap-2 text-[#20084A]">
                  <span>⏱️</span>
                  <span>Minutos esta semana</span>
                </span>
                <span className="text-[#6C28B4] font-black">{totalXP > 0 ? Math.round(totalXP / 15) : 0} min</span>
              </div>

              {/* Section Heading: Últimos 7 días */}
              <div className="text-[#0E6BA8] font-black text-sm pt-1">
                Últimos 7 días
              </div>

              {/* 7 Days List (Idéntico a Imagen 3) */}
              <div className="space-y-2">
                {DIARIO_DAYS.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#EAE5FF] rounded-2xl px-4 py-2 flex items-center justify-between text-xs font-extrabold"
                  >
                    <span className="text-[#20084A] font-black">{day.dateStr}</span>
                    <span className="text-[#6C28B4] font-bold">
                      {day.active ? '✓ Actividad registrada' : '— sin actividad'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer text */}
              <p className="text-center text-gray-500 font-bold text-[11px] pt-1">
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
                <div className="space-y-3">
                  {/* Description Paragraph */}
                  <p className="text-xs md:text-sm font-extrabold text-[#1E0A40] leading-snug">
                    Este examen evalúa todas las unidades del libro: Adición, Sustracción, Multiplicación y División. <b>25 preguntas mezcladas</b>.
                  </p>

                  {/* Stat row 1: Aprobados */}
                  <div className="bg-[#F8F7FF] border border-[#ECE7FF] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs md:text-sm font-extrabold">
                    <span className="text-[#20084A]">Aprobados</span>
                    <span className="text-[#6C28B4] font-black">{examStats.passes}</span>
                  </div>

                  {/* Stat row 2: Mejor puntaje */}
                  <div className="bg-[#F8F7FF] border border-[#ECE7FF] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs md:text-sm font-extrabold">
                    <span className="text-[#20084A]">Mejor puntaje</span>
                    <span className="text-[#6C28B4] font-black">{examStats.bestScore}/25</span>
                  </div>

                  {/* Stat row 3: Intentos */}
                  <div className="bg-[#F8F7FF] border border-[#ECE7FF] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs md:text-sm font-extrabold">
                    <span className="text-[#20084A]">Intentos</span>
                    <span className="text-[#6C28B4] font-black">{examStats.attempts}</span>
                  </div>

                  {/* Alert Banner Recompensa */}
                  <div className="bg-[#FFF7ED] border-2 border-[#F97316] rounded-xl px-4 py-3 text-xs font-black text-[#7A3200] flex items-center gap-2">
                    <span>🏆</span>
                    <span>Recompensa al aprobar (≥18/25): <b>+500 🪙</b> + badge <b>"Graduado de 3°"</b></span>
                  </div>

                  {/* Big Button: Empezar Examen Final */}
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setExamStep('quiz');
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#A30041] to-[#FF1D4E] hover:from-[#8A0037] hover:to-[#E6003E] font-black text-sm text-white shadow-lg shadow-red-900/20 hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
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
            <div className="space-y-3.5">
              <div className="flex items-center justify-between bg-purple-50 border border-purple-200 p-3 rounded-2xl">
                <div>
                  <div className="text-xs font-black text-purple-900">
                    Coleccionados: {Object.values(unlockedStickers).filter(Boolean).length} / {STICKERS_3RO.length}
                  </div>
                  <div className="text-[11px] text-purple-700">
                    Abre sobres misteriosos para completar tu álbum
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
                  className="px-3.5 py-1.5 bg-gradient-to-r from-[#9B0066] to-[#FF1DAA] text-white font-black text-xs rounded-xl shadow cursor-pointer"
                >
                  🎁 Sobre (50 🪙)
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[55vh] overflow-y-auto pr-1">
                {STICKERS_3RO.map((st) => {
                  const isUnlocked = !!unlockedStickers[st.id];
                  return (
                    <div
                      key={st.id}
                      className={`p-2 rounded-2xl border text-center ${
                        isUnlocked
                          ? 'bg-amber-50 border-amber-300 shadow-sm'
                          : 'bg-gray-100 border-dashed border-gray-300 opacity-40'
                      }`}
                    >
                      <div className="text-2xl">{isUnlocked ? st.e : '❔'}</div>
                      <div className="text-[10px] font-black text-gray-800 truncate mt-1">
                        {isUnlocked ? st.name : '???'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              6. JUEGOS / MINIJUEGOS
          ───────────────────────────────────────────────────────────── */}
          {(activeModal === 'juegos' || activeModal === 'minijuegos') && (
            <div>
              {activeMinigame === 'picker' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      playSound('click');
                      setActiveMinigame('pizza');
                    }}
                    className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 hover:border-amber-400 cursor-pointer space-y-1"
                  >
                    <div className="text-2xl">🍕</div>
                    <h4 className="font-black text-xs text-amber-900">Repartir Pizza</h4>
                    <p className="text-[11px] text-gray-600">Divide porciones iguales entre tus amigos.</p>
                  </div>

                  <div
                    onClick={() => {
                      playSound('click');
                      setActiveMinigame('reloj');
                    }}
                    className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-400 cursor-pointer space-y-1"
                  >
                    <div className="text-2xl">🕐</div>
                    <h4 className="font-black text-xs text-emerald-900">Reloj Matemático</h4>
                    <p className="text-[11px] text-gray-600">Calcula horas y tiempos de vuelo.</p>
                  </div>

                  <div
                    onClick={() => {
                      playSound('click');
                      setActiveMinigame('tienda');
                    }}
                    className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 hover:border-purple-400 cursor-pointer space-y-1"
                  >
                    <div className="text-2xl">🛒</div>
                    <h4 className="font-black text-xs text-purple-900">Caja de Math</h4>
                    <p className="text-[11px] text-gray-600">Entrega el cambio exacto de las compras.</p>
                  </div>

                  <div
                    onClick={() => {
                      playSound('click');
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 hover:border-rose-400 cursor-pointer space-y-1"
                  >
                    <div className="text-2xl">🏃</div>
                    <h4 className="font-black text-xs text-rose-900">Modo Maratón</h4>
                    <p className="text-[11px] text-gray-600">Carrera contra el reloj de 60 segundos.</p>
                  </div>
                </div>
              )}

              {activeMinigame === 'pizza' && (
                <div className="space-y-3 text-center py-2">
                  <div className="text-4xl">🍕</div>
                  <h4 className="text-base font-black text-amber-900">Repartir Porciones de Pizza</h4>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto">
                    Hay <b>15 porciones</b> y queremos repartirlas entre <b>3 amigos</b>. ¿Cuántas porciones recibe cada uno?
                  </p>
                  <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                    {[3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setPizzaSlices(num);
                          if (num === 5) {
                            playSound('correct');
                            onAddCoins?.(20);
                            triggerConfetti();
                          } else {
                            playSound('wrong');
                          }
                        }}
                        className={`py-2 rounded-xl font-black text-sm border ${
                          pizzaSlices === num
                            ? num === 5
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {pizzaSlices === 5 && (
                    <div className="text-xs text-emerald-700 font-bold">✓ ¡Correcto! 15 ÷ 3 = 5 porciones (+20 🪙)</div>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveMinigame('picker')}
                    className="text-xs text-purple-700 hover:underline pt-1"
                  >
                    ← Volver a minijuegos
                  </button>
                </div>
              )}

              {activeMinigame === 'reloj' && (
                <div className="space-y-3 text-center py-2">
                  <div className="text-4xl">🕐</div>
                  <h4 className="text-base font-black text-emerald-900">Reloj Espacial</h4>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto">
                    La nave despega a las <b>8:15</b> y viaja <b>45 minutos</b>. ¿A qué hora llega?
                  </p>
                  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                    {['8:50', '9:00', '9:15'].map((hora) => (
                      <button
                        key={hora}
                        type="button"
                        onClick={() => {
                          setRelojGuess(hora);
                          if (hora === '9:00') {
                            playSound('correct');
                            onAddCoins?.(20);
                            triggerConfetti();
                          } else {
                            playSound('wrong');
                          }
                        }}
                        className={`py-2 rounded-xl font-black text-xs border ${
                          relojGuess === hora
                            ? hora === '9:00'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {hora}
                      </button>
                    ))}
                  </div>
                  {relojGuess === '9:00' && (
                    <div className="text-xs text-emerald-700 font-bold">✓ ¡Exacto! 8:15 + 45 min = 9:00 (+20 🪙)</div>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveMinigame('picker')}
                    className="text-xs text-purple-700 hover:underline pt-1"
                  >
                    ← Volver a minijuegos
                  </button>
                </div>
              )}

              {activeMinigame === 'tienda' && (
                <div className="space-y-3 text-center py-2">
                  <div className="text-4xl">🛒</div>
                  <h4 className="text-base font-black text-purple-900">Caja Registradora</h4>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto">
                    Un producto cuesta <b>65 monedas</b> y pagas con <b>100 monedas</b>. ¿Cuánto cambio recibes?
                  </p>
                  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                    {[25, 35, 45].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setTiendaChange(val);
                          if (val === 35) {
                            playSound('correct');
                            onAddCoins?.(20);
                            triggerConfetti();
                          } else {
                            playSound('wrong');
                          }
                        }}
                        className={`py-2 rounded-xl font-black text-xs border ${
                          tiendaChange === val
                            ? val === 35
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {val} 🪙
                      </button>
                    ))}
                  </div>
                  {tiendaChange === 35 && (
                    <div className="text-xs text-emerald-700 font-bold">✓ ¡Correcto! 100 - 65 = 35 monedas (+20 🪙)</div>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveMinigame('picker')}
                    className="text-xs text-purple-700 hover:underline pt-1"
                  >
                    ← Volver a minijuegos
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              7. GALAXIA 3D
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'galaxia3d' && (
            <div className="space-y-3 text-center py-2">
              <div className="text-5xl animate-pulse">🌌</div>
              <h4 className="text-base font-black text-blue-900">Galaxia 3D del Saber</h4>
              <p className="text-xs text-gray-600 max-w-xs mx-auto">
                Cada estrella representa una unidad de tu viaje matemático:
              </p>
              <div className="grid grid-cols-2 gap-2 text-left max-w-sm mx-auto">
                {[
                  '➕ Constelación Adición',
                  '➖ Constelación Sustracción',
                  '✖️ Constelación Multiplicación',
                  '➗ Nebulosa División',
                  '📐 Cinturón Geometría',
                  '📊 Núcleo SABER',
                ].map((n, i) => (
                  <div key={i} className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl font-bold text-xs text-blue-900">
                    ⭐ {n}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              8. HISTORIA DE FEDOR
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'historia' && (
            <div className="space-y-3 text-xs md:text-sm leading-relaxed text-gray-700">
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-3 rounded-2xl">
                <span className="text-4xl">🐲</span>
                <div>
                  <h4 className="font-black text-amber-900">Capitán Fedor</h4>
                  <p className="text-xs text-amber-700">Explorador estelar y maestro de las matemáticas</p>
                </div>
              </div>
              <p>
                Fedor es un joven explorador espacial que viajó desde una lejana galaxia para aprender las matemáticas del cosmos. Desde pequeño descubrió que los números son el idioma secreto que hace funcionar a los planetas y las estrellas.
              </p>
              <p>
                En su nave estelar 🚀, recorre mundos resolviendo retos junto a su perro espacial Astro 🐾. Cada ejercicio resuelto recarga su energía estelar.
              </p>
              <button
                type="button"
                onClick={() => fedorSpeak('Fedor es un explorador espacial que viaja por el cosmos aprendiendo matemáticas.')}
                className="px-3.5 py-1.5 bg-amber-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>🔊</span>
                <span>Escuchar narración</span>
              </button>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              9. ESTÁNDARES MATEMÁTICOS MEN (CON TABS)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'estandares' && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-b border-gray-100">
                {[
                  { id: 'num', lbl: '🔢 Numérico' },
                  { id: 'geo', lbl: '📐 Geométrico' },
                  { id: 'met', lbl: '📏 Métrico' },
                  { id: 'est', lbl: '📊 Estadístico' },
                  { id: 'var', lbl: '🔣 Variacional' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setEstTab(t.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                      estTab === t.id
                        ? 'bg-[#3D1468] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t.lbl}
                  </button>
                ))}
              </div>

              {EST_DATA_3RO[estTab] && (
                <div className="space-y-2.5 max-h-[56vh] overflow-y-auto pr-1">
                  <h4 className="font-black text-xs text-purple-900">{EST_DATA_3RO[estTab].title}</h4>
                  {EST_DATA_3RO[estTab].cards.map((card, cIdx) => (
                    <div key={cIdx} className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1.5">
                      <div className="font-black text-xs text-purple-800">{card.h}</div>
                      {card.items && (
                        <ul className="space-y-1 text-xs text-gray-700 list-disc list-inside">
                          {card.items.map((it, iIdx) => (
                            <li key={iIdx} dangerouslySetInnerHTML={{ __html: it }} />
                          ))}
                        </ul>
                      )}
                      {card.niveles && card.niv && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          {card.niv.map((nv, nIdx) => (
                            <div key={nIdx} className="p-2 rounded-lg bg-white border border-gray-200 text-xs">
                              <div className="font-black text-gray-900">{nv.t}</div>
                              <div className="text-[10px] text-gray-600 mt-0.5">{nv.d}</div>
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
              10. MISIONES DIARIAS
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'misiones' && (
            <div className="space-y-2.5">
              {missions.map((m) => {
                const canClaim = !m.done && m.current >= m.goal;
                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border flex items-center gap-3 ${
                      m.done ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-gray-900 truncate">{m.title}</span>
                        <span className="text-[10px] text-amber-700 font-bold">+{m.coinsReward} 🪙</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">{m.desc}</p>
                    </div>
                    <button
                      type="button"
                      disabled={m.done || !canClaim}
                      onClick={() => {
                        onAddCoins?.(m.coinsReward);
                        onAddXP?.(m.xpReward);
                        playSound('coin');
                        triggerConfetti();
                        setMissions((prev) => prev.map((x) => (x.id === m.id ? { ...x, done: true } : x)));
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        m.done
                          ? 'bg-gray-200 text-gray-500'
                          : canClaim
                          ? 'bg-emerald-600 text-white cursor-pointer'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {m.done ? '✓ Listo' : canClaim ? 'Reclamar' : `${m.current}/${m.goal}`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              11. DEFINICIONES (GLOSARIO)
          ───────────────────────────────────────────────────────────── */}
          {activeModal === 'definiciones' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Buscar término..."
                value={defSearch}
                onChange={(e) => setDefSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-purple-500"
              />
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'adi', lbl: '➕ Adición' },
                  { id: 'sus', lbl: '➖ Sustracción' },
                  { id: 'mul', lbl: '✖️ Multiplicación' },
                  { id: 'div', lbl: '➗ División' },
                  { id: 'num', lbl: '🔢 Números' },
                  { id: 'geo', lbl: '📐 Geometría' },
                  { id: 'med', lbl: '📏 Medida' },
                  { id: 'est', lbl: '📊 Estadística' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setDefTab(t.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${
                      defTab === t.id ? 'bg-[#3D1468] text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {t.lbl}
                  </button>
                ))}
              </div>

              {DEF_DATA_3RO[defTab] && (
                <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                  {DEF_DATA_3RO[defTab].grupos.map((grp, gIdx) => {
                    const filtered = grp.items.filter(
                      (it) =>
                        it.t.toLowerCase().includes(defSearch.toLowerCase()) ||
                        it.d.toLowerCase().includes(defSearch.toLowerCase())
                    );
                    if (defSearch && filtered.length === 0) return null;
                    return (
                      <div key={gIdx} className="space-y-1.5">
                        <div className="text-[11px] font-black text-purple-900">{grp.name}</div>
                        {filtered.map((it, iIdx) => (
                          <div key={iIdx} className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                            <div className="font-black text-xs text-[#2A0F60]">{it.t}</div>
                            <p className="text-xs text-gray-700 leading-snug">{it.d}</p>
                            {it.ex && (
                              <span className="inline-block bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded">
                                Ej: {it.ex}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
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
    </div>
  );
}
