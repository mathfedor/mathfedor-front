'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook5 } from '../context/Book5Context';

interface Minijuegos5toModalProps {
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
  contrarreloj: { title: 'Contrarreloj 5°', color: '#7C3AED', icon: '⚡' },
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
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.07);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'bad') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(146.83, now + 0.08);
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
    // Audio no soportado
  }
}

export default function Minijuegos5toModal({
  isOpen = true,
  onClose,
}: Minijuegos5toModalProps) {
  const { updateStats } = useBook5();

  const [view, setView] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [activeGame, setActiveGame] = useState<MinijuegoTipo>('contrarreloj');

  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [correctAttempts, setCorrectAttempts] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);

  const [currentQ, setCurrentQ] = useState<QuestionData | null>(null);
  const [inputA, setInputA] = useState<string>('');
  const [inputB, setInputB] = useState<string>('');
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);

  // Récords guardados en localStorage
  const [records, setRecords] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('fedor5_minijuegos');
      if (saved) setRecords(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const saveRecord = (tipo: MinijuegoTipo, pts: number) => {
    setRecords((prev) => {
      const cur = prev[tipo] || 0;
      if (pts > cur) {
        const next = { ...prev, [tipo]: pts };
        if (typeof window !== 'undefined') {
          localStorage.setItem('fedor5_minijuegos', JSON.stringify(next));
        }
        return next;
      }
      return prev;
    });
  };

  // Generador de preguntas para 5° grado
  const generateQuestion = (tipo: MinijuegoTipo): QuestionData => {
    if (tipo === 'contrarreloj') {
      const mode = rnd(1, 5);
      if (mode === 1) {
        // Multiplicación de 5°
        const a = rnd(6, 15);
        const b = rnd(4, 12);
        return { q: `${a} × ${b} = ?`, r: [a * b] };
      }
      if (mode === 2) {
        // División exacta
        const b = rnd(4, 12);
        const ans = rnd(5, 16);
        return { q: `${b * ans} ÷ ${b} = ?`, r: [ans] };
      }
      if (mode === 3) {
        // Suma con centenas
        const a = rnd(250, 890);
        const b = rnd(150, 750);
        return { q: `${a} + ${b} = ?`, r: [a + b] };
      }
      if (mode === 4) {
        // Resta con préstamo
        const a = rnd(500, 1500);
        const b = rnd(120, a - 20);
        return { q: `${a} − ${b} = ?`, r: [a - b] };
      }
      // Potencias de 5°
      const base = rnd(2, 9);
      return { q: `${base}² = ?`, r: [base * base] };
    }

    if (tipo === 'repartir') {
      const amigos = rnd(3, 9);
      const cadaUno = rnd(4, 15);
      const sobran = rnd(0, amigos - 1);
      const total = amigos * cadaUno + sobran;
      return {
        q: `Repartes ${total} chocolates entre ${amigos} amigos por igual. ¿Cuántos recibe cada uno y cuántos sobran?`,
        r: [cadaUno, sobran],
        dos: true,
      };
    }

    // Tienda Fedor
    const precio = rnd(12, 45) * 100;
    const cant = rnd(2, 5);
    const total = precio * cant;
    const billete = Math.ceil(total / 10000) * 10000 || total + 10000;
    const vuelto = billete - total;
    return {
      q: `Compras ${cant} cuadernos a $${fmt(precio)} cada uno y pagas con $${fmt(billete)}. ¿Cuánto dinero recibes de vuelto?`,
      r: [vuelto],
    };
  };

  // Timer del juego activo
  useEffect(() => {
    if (view !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          playSound('win');
          setView('finished');
          saveRecord(activeGame, score);
          updateStats(Math.floor(score / 5), 0, Math.floor(score / 2));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [view, activeGame, score]);

  const handleStartGame = (tipo: MinijuegoTipo) => {
    setActiveGame(tipo);
    setScore(0);
    setStreak(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setTimeLeft(60);
    setFeedback(null);
    setInputA('');
    setInputB('');
    setCurrentQ(generateQuestion(tipo));
    setView('playing');
    setTimeout(() => {
      inputARef.current?.focus();
    }, 150);
  };

  const handleCheckAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentQ) return;

    let isOk = false;
    const valA = parseInt(inputA.replace(/[^\d-]/g, ''), 10);
    const valB = parseInt(inputB.replace(/[^\d-]/g, ''), 10);

    if (currentQ.dos) {
      isOk = valA === currentQ.r[0] && valB === currentQ.r[1];
    } else {
      isOk = valA === currentQ.r[0];
    }

    setTotalAttempts((prev) => prev + 1);

    if (isOk) {
      playSound('ok');
      const earned = 10 + streak * 2;
      setScore((s) => s + earned);
      setStreak((st) => st + 1);
      setCorrectAttempts((c) => c + 1);
      setFeedback({ text: `¡Correcto! +${earned} pts`, isCorrect: true });
    } else {
      playSound('bad');
      setStreak(0);
      setFeedback({
        text: `Era: ${currentQ.dos ? `${currentQ.r[0]} y sobran ${currentQ.r[1]}` : `$${fmt(currentQ.r[0])}`}`,
        isCorrect: false,
      });
    }

    setInputA('');
    setInputB('');
    setCurrentQ(generateQuestion(activeGame));

    setTimeout(() => {
      inputARef.current?.focus();
    }, 50);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99995] flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      style={{
        background: 'rgba(18, 8, 42, 0.75)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-[560px] bg-white rounded-[26px] p-6 sm:p-7 text-[#180D38] relative shadow-2xl overflow-hidden animate-fadeIn"
        style={{
          boxShadow: '0 25px 60px -15px rgba(25, 8, 55, 0.45)',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* ══ HEADER ══ */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🎮</span>
            <div>
              <h2
                className="text-xl sm:text-2xl font-black text-[#2A0F60] leading-none"
                style={{ fontFamily: "'Baloo 2', cursive, sans-serif" }}
              >
                Minijuegos 5°
              </h2>
              <p className="text-xs text-gray-500 font-bold mt-0.5">
                60 segundos para responder todo lo que puedas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border-[1.5px] border-[#E4DFF5] bg-[#F7F4FF] hover:bg-[#E9DCFC] text-[#6C28B4] flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* ══ VIEW 1: MENU LAUNCHER ══ */}
        {view === 'menu' && (
          <div className="space-y-3 animate-fadeIn">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-2">
              ¡Las rachas consecutivas multiplican tus puntos cósmicos! Elige tu desafío:
            </p>

            {/* Juego 1: Contrarreloj 5° */}
            <button
              type="button"
              onClick={() => handleStartGame('contrarreloj')}
              className="w-full p-4 rounded-2xl bg-white border-2 border-[#7C3AED] hover:bg-purple-50/50 transition-all text-left flex items-center justify-between gap-3 group cursor-pointer shadow-xs hover:shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <div>
                  <div
                    className="text-base sm:text-lg font-black text-[#7C3AED] leading-tight"
                    style={{ fontFamily: "'Baloo 2', sans-serif" }}
                  >
                    Contrarreloj 5°
                  </div>
                  <div className="text-xs text-gray-500 font-bold mt-0.5">
                    Operaciones rápidas: ×, ÷, +, −, potencias
                  </div>
                  {records.contrarreloj ? (
                    <div className="text-[11px] font-black text-amber-600 mt-1">
                      👑 Récord: {records.contrarreloj} pts
                    </div>
                  ) : null}
                </div>
              </div>
              <span className="text-xl text-[#7C3AED] font-black group-hover:translate-x-1 transition-transform">
                ▶
              </span>
            </button>

            {/* Juego 2: Repartir */}
            <button
              type="button"
              onClick={() => handleStartGame('repartir')}
              className="w-full p-4 rounded-2xl bg-white border-2 border-[#0D9488] hover:bg-teal-50/50 transition-all text-left flex items-center justify-between gap-3 group cursor-pointer shadow-xs hover:shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  🍕
                </div>
                <div>
                  <div
                    className="text-base sm:text-lg font-black text-[#0D9488] leading-tight"
                    style={{ fontFamily: "'Baloo 2', sans-serif" }}
                  >
                    Repartir
                  </div>
                  <div className="text-xs text-gray-500 font-bold mt-0.5">
                    División con cociente y residuo
                  </div>
                  {records.repartir ? (
                    <div className="text-[11px] font-black text-amber-600 mt-1">
                      👑 Récord: {records.repartir} pts
                    </div>
                  ) : null}
                </div>
              </div>
              <span className="text-xl text-[#0D9488] font-black group-hover:translate-x-1 transition-transform">
                ▶
              </span>
            </button>

            {/* Juego 3: Tienda Fedor */}
            <button
              type="button"
              onClick={() => handleStartGame('tienda')}
              className="w-full p-4 rounded-2xl bg-white border-2 border-[#E8650A] hover:bg-orange-50/50 transition-all text-left flex items-center justify-between gap-3 group cursor-pointer shadow-xs hover:shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  🛒
                </div>
                <div>
                  <div
                    className="text-base sm:text-lg font-black text-[#E8650A] leading-tight"
                    style={{ fontFamily: "'Baloo 2', sans-serif" }}
                  >
                    Tienda Fedor
                  </div>
                  <div className="text-xs text-gray-500 font-bold mt-0.5">
                    Compras con pesos y cálculo del vuelto
                  </div>
                  {records.tienda ? (
                    <div className="text-[11px] font-black text-amber-600 mt-1">
                      👑 Récord: {records.tienda} pts
                    </div>
                  ) : null}
                </div>
              </div>
              <span className="text-xl text-[#E8650A] font-black group-hover:translate-x-1 transition-transform">
                ▶
              </span>
            </button>
          </div>
        )}

        {/* ══ VIEW 2: GAMEPLAY EN VIVO ══ */}
        {view === 'playing' && currentQ && (
          <div className="space-y-4 animate-fadeIn">
            {/* HUD Bar */}
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-2xl border border-purple-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <span className={`text-xl font-black ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-purple-900'}`}>
                  {timeLeft}s
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-purple-900">Puntos:</span>
                <span className="text-xl font-black text-amber-600">{score}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span>🔥</span>
                <span className="text-sm font-black text-orange-600">{streak}</span>
              </div>
            </div>

            {/* Pregunta */}
            <div className="p-5 bg-gradient-to-r from-purple-50 via-white to-amber-50 rounded-2xl border-2 border-purple-300 text-center min-h-[90px] flex items-center justify-center">
              <p
                className="text-lg sm:text-xl font-black text-[#1A1033] leading-snug"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                {currentQ.q}
              </p>
            </div>

            {/* Feedback breve */}
            {feedback && (
              <div
                className={`py-1.5 px-3 rounded-xl text-center text-xs font-black animate-fadeIn ${
                  feedback.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {feedback.text}
              </div>
            )}

            {/* Formulario de Respuestas */}
            <form onSubmit={handleCheckAnswer} className="space-y-3">
              {currentQ.dos ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-black text-gray-500 uppercase block mb-1">
                      Cada uno recibe:
                    </label>
                    <input
                      ref={inputARef}
                      type="number"
                      value={inputA}
                      onChange={(e) => setInputA(e.target.value)}
                      placeholder="0"
                      className="w-full p-3 rounded-xl border-2 border-purple-300 text-center text-xl font-black text-purple-950 focus:outline-none focus:border-purple-600 bg-purple-50/50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-gray-500 uppercase block mb-1">
                      Sobran:
                    </label>
                    <input
                      ref={inputBRef}
                      type="number"
                      value={inputB}
                      onChange={(e) => setInputB(e.target.value)}
                      placeholder="0"
                      className="w-full p-3 rounded-xl border-2 border-purple-300 text-center text-xl font-black text-purple-950 focus:outline-none focus:border-purple-600 bg-purple-50/50"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    ref={inputARef}
                    type="number"
                    value={inputA}
                    onChange={(e) => setInputA(e.target.value)}
                    placeholder="Escribe tu resultado aquí"
                    className="w-full p-3.5 rounded-xl border-2 border-purple-300 text-center text-2xl font-black text-purple-950 focus:outline-none focus:border-purple-600 bg-purple-50/50 shadow-inner"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
              >
                Responder ↵
              </button>
            </form>
          </div>
        )}

        {/* ══ VIEW 3: FIN DEL JUEGO ══ */}
        {view === 'finished' && (
          <div className="space-y-4 text-center animate-fadeIn py-2">
            <div className="text-5xl">🏆</div>
            <h3
              className="text-2xl font-black text-[#2A0F60]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              ¡Tiempo Agotado!
            </h3>

            <div className="grid grid-cols-2 gap-3 p-4 bg-purple-50 rounded-2xl border border-purple-200">
              <div>
                <div className="text-3xl font-black text-amber-600">{score}</div>
                <div className="text-xs font-bold text-gray-500 uppercase mt-1">Puntos Obtenidos</div>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-600">
                  {correctAttempts}/{totalAttempts}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase mt-1">Aciertos</div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setView('menu')}
                className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-xs cursor-pointer transition-colors"
              >
                Volver al Menú
              </button>
              <button
                type="button"
                onClick={() => handleStartGame(activeGame)}
                className="flex-1 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs cursor-pointer shadow-md transition-all"
              >
                Jugar de Nuevo 🔁
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
