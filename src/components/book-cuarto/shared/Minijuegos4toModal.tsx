'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook4 } from '../context/Book4Context';

interface Minijuegos4toModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

type MinijuegoTipo = 'contrarreloj' | 'repartir' | 'tienda';

interface QuestionData {
  q: string;
  r: number[];
  dos?: boolean;
}

const NOMBRES_JUEGOS: Record<MinijuegoTipo, { title: string; color: string; icon: string }> = {
  contrarreloj: { title: 'Contrarreloj 4°', color: '#7C3AED', icon: '⚡' },
  repartir: { title: 'Repartir', color: '#0D9488', icon: '🍕' },
  tienda: { title: 'Tienda Fedor', color: '#E8650A', icon: '🛒' },
};

function fmt(n: number) {
  return Number(n).toLocaleString('es-CO');
}

function rnd(a: number, b: number) {
  return a + Math.floor(Math.random() * (b - a + 1));
}

function playSound(type: 'ok' | 'bad' | 'win') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'ok') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.07); // A5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'bad') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.setValueAtTime(146.83, now + 0.08); // D3
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.09);
      osc.frequency.setValueAtTime(783.99, now + 0.18);
      osc.frequency.setValueAtTime(1046.5, now + 0.27);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.55);
    }
  } catch {
    // Audio no soportado o bloqueado por el navegador
  }
}

export default function Minijuegos4toModal({
  isOpen = true,
  onClose,
}: Minijuegos4toModalProps) {
  const { updateStats } = useBook4();

  // Mode: 'menu' (Launcher del screenshot) | 'playing' | 'finished'
  const [view, setView] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [activeGame, setActiveGame] = useState<MinijuegoTipo>('contrarreloj');

  // Game session stats
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [correctAttempts, setCorrectAttempts] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);

  // Question & Inputs
  const [currentQ, setCurrentQ] = useState<QuestionData | null>(null);
  const [inputA, setInputA] = useState<string>('');
  const [inputB, setInputB] = useState<string>('');
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);

  // Highscores
  const [records, setRecords] = useState<Record<string, number>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('fedor4_minijuegos_rec');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isNewRecord, setIsNewRecord] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

  // GENERADOR DE PREGUNTAS (100% fiel al motor original HTML 4°)
  const generateQ = (tipo: MinijuegoTipo): QuestionData => {
    if (tipo === 'contrarreloj') {
      const t = rnd(0, 4);
      if (t === 0) {
        const a = rnd(2, 12);
        const b = rnd(2, 12);
        return { q: `${a} × ${b}`, r: [a * b] };
      }
      if (t === 1) {
        const b = rnd(2, 12);
        const c = rnd(2, 12);
        return { q: `${b * c} ÷ ${b}`, r: [c] };
      }
      if (t === 2) {
        const a = rnd(120, 899);
        const b = rnd(100, 899);
        return { q: `${a} + ${b}`, r: [a + b] };
      }
      if (t === 3) {
        const a = rnd(300, 999);
        const b = rnd(100, a - 1);
        return { q: `${a} − ${b}`, r: [a - b] };
      }
      const a = rnd(2, 15);
      return { q: `${a}²`, r: [a * a] };
    }

    if (tipo === 'repartir') {
      const k = rnd(3, 9);
      const c = rnd(4, 15);
      const s = rnd(0, k - 1);
      const n = k * c + s;
      const cosas = ['chocolates', 'canicas', 'láminas', 'galletas', 'lápices', 'stickers'];
      const cosa = cosas[rnd(0, cosas.length - 1)];
      return {
        q: `Reparte ${n} ${cosa} entre ${k} amigos por igual. ¿Cuántos recibe cada uno y cuántos sobran?`,
        r: [c, s],
        dos: true,
      };
    }

    // Tienda Fedor
    const prod: [string, string, number][] = [
      ['cuaderno', 'cuadernos', rnd(25, 60) * 100],
      ['lápiz', 'lápices', rnd(8, 20) * 100],
      ['borrador', 'borradores', rnd(5, 15) * 100],
      ['jugo', 'jugos', rnd(20, 45) * 100],
      ['paquete de galletas', 'paquetes de galletas', rnd(15, 35) * 100],
    ];
    const a = prod[rnd(0, 4)];
    const b = prod[rnd(0, 4)];
    const ca = rnd(1, 3);
    const total = a[2] * ca + b[2];
    let billete = [10000, 20000, 50000].filter((x) => x > total)[0] || 50000;
    if (billete <= total) {
      billete = Math.ceil(total / 10000) * 10000 + 10000;
    }
    return {
      q: `Compras ${ca} ${ca > 1 ? a[1] : a[0]} a $${fmt(a[2])} c/u y 1 ${b[0]} a $${fmt(b[2])}. Pagas con $${fmt(billete)}. ¿Cuánto te devuelven?`,
      r: [billete - total],
    };
  };

  // INICIAR MINIJUEGO
  const startGame = (tipo: MinijuegoTipo) => {
    setActiveGame(tipo);
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setFeedback(null);
    setInputA('');
    setInputB('');
    setIsNewRecord(false);
    setCoinsEarned(0);

    const firstQ = generateQ(tipo);
    setCurrentQ(firstQ);
    setView('playing');
  };

  // ENFOCAR INPUT AL CAMBIAR PREGUNTA
  useEffect(() => {
    if (view === 'playing') {
      const timer = setTimeout(() => {
        inputARef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [view, currentQ]);

  // TEMPORIZADOR DE 60 SEGUNDOS
  useEffect(() => {
    if (view !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [view, score, correctAttempts, totalAttempts]);

  // FINALIZAR MINIJUEGO
  const finishGame = () => {
    setView('finished');
    playSound('win');

    // Revisar récord
    const prevRec = records[activeGame] || 0;
    const newBest = score > prevRec;
    if (newBest) {
      setIsNewRecord(true);
      const updated = { ...records, [activeGame]: score };
      setRecords(updated);
      try {
        localStorage.setItem('fedor4_minijuegos_rec', JSON.stringify(updated));
      } catch {}
    }

    // Monedas y stats
    const earned = Math.floor(score / 20);
    setCoinsEarned(earned);
    if (earned > 0) {
      updateStats(earned, 0, score);
    }
  };

  // RESPONDER PREGUNTA
  const handleAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentQ || timeLeft <= 0 || view !== 'playing') return;

    const valA = parseInt(inputA.replace(/\./g, ''), 10);
    const valB = parseInt(inputB.replace(/\./g, ''), 10);

    if (isNaN(valA) || (currentQ.dos && isNaN(valB))) return;

    const isOk = currentQ.dos
      ? valA === currentQ.r[0] && valB === currentQ.r[1]
      : valA === currentQ.r[0];

    setTotalAttempts((prev) => prev + 1);

    if (isOk) {
      const bonusStreak = Math.min(streak, 5) * 2;
      const ptsEarned = 10 + bonusStreak;
      setScore((s) => s + ptsEarned);
      setStreak((st) => st + 1);
      setCorrectAttempts((c) => c + 1);
      setFeedback({ text: '✅ ¡Bien!', isCorrect: true });
      playSound('ok');
    } else {
      setStreak(0);
      const rightAns = currentQ.dos
        ? `${currentQ.r[0]} cada uno, sobran ${currentQ.r[1]}`
        : fmt(currentQ.r[0]);
      setFeedback({ text: `❌ Era ${rightAns}`, isCorrect: false });
      playSound('bad');
    }

    // Preparar siguiente pregunta
    setInputA('');
    setInputB('');
    const nextQ = generateQ(activeGame);
    setCurrentQ(nextQ);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: 'rgba(14, 8, 48, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="w-full max-w-[565px] bg-white rounded-[24px] relative flex flex-col overflow-hidden animate-fadeIn"
        style={{
          fontFamily: "'Nunito', sans-serif",
          boxShadow: '0 25px 60px -12px rgba(20, 6, 45, 0.45)',
          padding: '24px 24px 26px 24px',
        }}
      >
        {/* ══════════════════════════════════════════════════════════════
            VISTA 1: LAUNCHER DE MINIJUEGOS 4° (IDÉNTICO A LA IMAGEN)
           ══════════════════════════════════════════════════════════════ */}
        {view === 'menu' && (
          <div>
            {/* Header: 🎮 Minijuegos 4° + Botón Cerrar Circular */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-[28px] leading-none">🎮</span>
                <h2
                  className="text-2xl sm:text-[26px] font-black leading-none m-0"
                  style={{
                    fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                    color: '#2A0F60',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Minijuegos 4°
                </h2>
              </div>

              {/* Botón Circular ✕ */}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: '#F7F4FF',
                  border: '1.5px solid #E4DFF5',
                  color: '#6C28B4',
                  fontSize: '17px',
                  fontWeight: 900,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#EDE6FD';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F7F4FF';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            {/* Subtítulo explicativo */}
            <p
              className="text-[13.5px] sm:text-[14px] font-bold mt-3.5 mb-4 leading-snug"
              style={{ color: '#374151' }}
            >
              60 segundos para responder todo lo que puedas. ¡Las rachas dan puntos extra!
            </p>

            {/* Lista de Tarjetas de Minijuegos */}
            <div className="flex flex-col gap-3 sm:gap-3.5">
              {/* 1. Contrarreloj 4° */}
              <button
                type="button"
                onClick={() => startGame('contrarreloj')}
                className="w-full text-left p-3.5 sm:p-4 rounded-[18px] bg-white transition-all duration-150 cursor-pointer group"
                style={{
                  border: '2px solid #7C3AED',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(124, 58, 237, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[17px] leading-none">⚡</span>
                  <span
                    className="text-[16px] sm:text-[17px] font-black"
                    style={{ color: '#7C3AED' }}
                  >
                    Contrarreloj 4°
                  </span>
                </div>
                <div
                  className="text-[12.5px] sm:text-[13px] font-bold mt-1"
                  style={{ color: '#374151' }}
                >
                  Operaciones rápidas: ×, ÷, +, −, cuadrados
                </div>
              </button>

              {/* 2. Repartir */}
              <button
                type="button"
                onClick={() => startGame('repartir')}
                className="w-full text-left p-3.5 sm:p-4 rounded-[18px] bg-white transition-all duration-150 cursor-pointer group"
                style={{
                  border: '2px solid #0D9488',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(13, 148, 136, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[17px] leading-none">🍕</span>
                  <span
                    className="text-[16px] sm:text-[17px] font-black"
                    style={{ color: '#0D9488' }}
                  >
                    Repartir
                  </span>
                </div>
                <div
                  className="text-[12.5px] sm:text-[13px] font-bold mt-1"
                  style={{ color: '#374151' }}
                >
                  División con cociente y residuo
                </div>
              </button>

              {/* 3. Tienda Fedor */}
              <button
                type="button"
                onClick={() => startGame('tienda')}
                className="w-full text-left p-3.5 sm:p-4 rounded-[18px] bg-white transition-all duration-150 cursor-pointer group"
                style={{
                  border: '2px solid #E8650A',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(232, 101, 10, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[17px] leading-none">🛒</span>
                  <span
                    className="text-[16px] sm:text-[17px] font-black"
                    style={{ color: '#E8650A' }}
                  >
                    Tienda Fedor
                  </span>
                </div>
                <div
                  className="text-[12.5px] sm:text-[13px] font-bold mt-1"
                  style={{ color: '#374151' }}
                >
                  Compras con pesos y cálculo del vuelto
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 2: JUEGO EN VIVO (60 SEGUNDOS ACTIVOS)
           ══════════════════════════════════════════════════════════════ */}
        {view === 'playing' && currentQ && (
          <div>
            {/* Header del Juego */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{NOMBRES_JUEGOS[activeGame].icon}</span>
                <h3
                  className="text-xl sm:text-2xl font-black m-0"
                  style={{
                    fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                    color: NOMBRES_JUEGOS[activeGame].color,
                  }}
                >
                  {NOMBRES_JUEGOS[activeGame].title}
                </h3>
              </div>

              {/* Botón para volver al menú */}
              <button
                type="button"
                onClick={() => setView('menu')}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                style={{
                  backgroundColor: '#F7F4FF',
                  border: '1.5px solid #E4DFF5',
                  color: '#6C28B4',
                  fontSize: '15px',
                  fontWeight: 900,
                }}
                title="Volver a Minijuegos"
              >
                ✕
              </button>
            </div>

            {/* Barra de Estadísticas y Timer */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-black text-purple-900 mt-3 mb-2 px-1">
              <span
                className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: timeLeft <= 10 ? '#FEE2E2' : '#F3E8FF',
                  color: timeLeft <= 10 ? '#DC2626' : '#6B21A8',
                }}
              >
                ⏱ {timeLeft}s
              </span>
              <span className="flex items-center gap-1">⭐ {score} pts</span>
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: streak >= 2 ? '#FEF3C7' : 'transparent',
                  color: streak >= 2 ? '#B45309' : '#6B21A8',
                }}
              >
                🔥 x{streak}
              </span>
            </div>

            {/* Barra de Progreso Visual */}
            <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full transition-all duration-1000 ease-linear rounded-full"
                style={{
                  width: `${(timeLeft / 60) * 100}%`,
                  backgroundColor:
                    timeLeft <= 10
                      ? '#EF4444'
                      : NOMBRES_JUEGOS[activeGame].color,
                }}
              />
            </div>

            {/* Contenedor del Problema */}
            <form onSubmit={handleAnswer} className="space-y-4">
              <div
                className="min-h-[90px] flex items-center justify-center text-center p-3 sm:p-4 rounded-2xl bg-purple-50/60 border-2"
                style={{ borderColor: `${NOMBRES_JUEGOS[activeGame].color}40` }}
              >
                <div
                  className="font-black text-slate-900"
                  style={{
                    fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                    fontSize: currentQ.q.length > 45 ? '16px' : '26px',
                    lineHeight: 1.35,
                  }}
                >
                  {currentQ.q}
                  {currentQ.q.length <= 45 && !currentQ.dos ? ' = ?' : ''}
                </div>
              </div>

              {/* Inputs */}
              {currentQ.dos ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-purple-900 mb-1 ml-1">
                      Cada uno
                    </label>
                    <input
                      ref={inputARef}
                      type="number"
                      placeholder="Cada uno"
                      value={inputA}
                      onChange={(e) => setInputA(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          inputBRef.current?.focus();
                        }
                      }}
                      className="w-full p-3 rounded-xl border-2 border-purple-200 text-center font-black text-lg focus:outline-none focus:border-teal-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-purple-900 mb-1 ml-1">
                      Sobran
                    </label>
                    <input
                      ref={inputBRef}
                      type="number"
                      placeholder="Sobran"
                      value={inputB}
                      onChange={(e) => setInputB(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-purple-200 text-center font-black text-lg focus:outline-none focus:border-teal-500 bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    ref={inputARef}
                    type="number"
                    placeholder="Tu respuesta"
                    value={inputA}
                    onChange={(e) => setInputA(e.target.value)}
                    className="w-full p-3.5 rounded-xl border-2 border-purple-200 text-center font-black text-2xl focus:outline-none focus:border-purple-600 bg-white"
                  />
                </div>
              )}

              {/* Botón Responder */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-black text-base shadow-md transition-all cursor-pointer hover:brightness-105 active:scale-[0.99]"
                style={{
                  background:
                    activeGame === 'repartir'
                      ? 'linear-gradient(135deg, #0D9488, #14B8A6)'
                      : activeGame === 'tienda'
                      ? 'linear-gradient(135deg, #E8650A, #F97316)'
                      : 'linear-gradient(135deg, #7C3AED, #9333EA)',
                }}
              >
                ✔ Responder
              </button>

              {/* Feedback rápido */}
              <div className="h-6 text-center font-black text-xs sm:text-sm">
                {feedback && (
                  <span style={{ color: feedback.isCorrect ? '#0D9488' : '#DC2626' }}>
                    {feedback.text}
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 3: RESUMEN / FIN DEL JUEGO
           ══════════════════════════════════════════════════════════════ */}
        {view === 'finished' && (
          <div className="text-center py-2 sm:py-4">
            <div className="text-5xl sm:text-6xl mb-2">
              {score >= 300 ? '🏆' : score >= 150 ? '🎉' : '💪'}
            </div>

            <h3
              className="text-3xl font-black mb-1"
              style={{
                fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                color: '#2A0F60',
              }}
            >
              {score} pts
            </h3>

            <p className="text-sm font-bold text-gray-700 mb-4">
              {correctAttempts} de {totalAttempts} correctas
              {isNewRecord && (
                <span className="block text-purple-700 font-extrabold mt-1">
                  🥇 ¡Nuevo récord personal en este modo!
                </span>
              )}
              {coinsEarned > 0 && (
                <span className="block text-amber-600 font-extrabold mt-0.5">
                  +{coinsEarned} monedas ganadas 🪙
                </span>
              )}
            </p>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center mt-5">
              <button
                type="button"
                onClick={() => startGame(activeGame)}
                className="px-5 py-2.5 rounded-xl font-black text-white text-sm transition-all cursor-pointer hover:brightness-105"
                style={{ backgroundColor: '#0D9488' }}
              >
                🔁 Otra vez
              </button>
              <button
                type="button"
                onClick={() => setView('menu')}
                className="px-5 py-2.5 rounded-xl font-black text-white text-sm transition-all cursor-pointer hover:brightness-105"
                style={{ backgroundColor: '#7C3AED' }}
              >
                🎮 Minijuegos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
