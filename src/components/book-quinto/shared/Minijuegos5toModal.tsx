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

const NOMBRES_JUEGOS: Record<MinijuegoTipo, string> = {
  contrarreloj: '⚡ Contrarreloj 5°',
  repartir: '🍕 Repartir',
  tienda: '🛒 Tienda Fedor',
};

function fmt(n: number): string {
  return Number(n).toLocaleString('es-CO');
}

function rnd(a: number, b: number): number {
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

  // Manejo de la tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view !== 'menu') {
          setView('menu');
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, view, onClose]);

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

  // Generador de preguntas para 5° grado exacto de MatematicasDeFedor_5.html
  const generateQuestion = (tipo: MinijuegoTipo): QuestionData => {
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
      const cosa = ['chocolates', 'canicas', 'láminas', 'galletas', 'lápices', 'stickers'][rnd(0, 5)];
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
    if (billete <= total) billete = Math.ceil(total / 10000) * 10000 + 10000;
    return {
      q: `Compras ${ca} ${ca > 1 ? a[1] : a[0]} a $${fmt(a[2])} c/u y 1 ${b[0]} a $${fmt(b[2])}. Pagas con $${fmt(billete)}. ¿Cuánto te devuelven?`,
      r: [billete - total],
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
          const coinsEarned = Math.floor(score / 20);
          if (coinsEarned > 0) {
            updateStats(coinsEarned, 0, Math.floor(score / 2));
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [view, activeGame, score, updateStats]);

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
    }, 120);
  };

  const handleCheckAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentQ) return;

    let isOk = false;
    const valA = parseInt(String(inputA).replace(/[^\d-]/g, ''), 10);
    const valB = parseInt(String(inputB).replace(/[^\d-]/g, ''), 10);

    if (isNaN(valA) || (currentQ.dos && isNaN(valB))) return;

    if (currentQ.dos) {
      isOk = valA === currentQ.r[0] && valB === currentQ.r[1];
    } else {
      isOk = valA === currentQ.r[0];
    }

    setTotalAttempts((prev) => prev + 1);

    if (isOk) {
      playSound('ok');
      const earned = 10 + Math.min(streak, 5) * 2;
      setScore((s) => s + earned);
      setStreak((st) => st + 1);
      setCorrectAttempts((c) => c + 1);
      setFeedback({ text: '✅ ¡Bien!', isCorrect: true });
    } else {
      playSound('bad');
      setStreak(0);
      setFeedback({
        text: currentQ.dos
          ? `❌ Era ${currentQ.r[0]} cada uno, sobran ${currentQ.r[1]}`
          : `❌ Era $${fmt(currentQ.r[0])}`,
        isCorrect: false,
      });
    }

    setInputA('');
    setInputB('');
    setCurrentQ(generateQuestion(activeGame));

    setTimeout(() => {
      inputARef.current?.focus();
    }, 40);
  };

  if (!isOpen) return null;

  return (
    <div
      className="tool-modal-bg animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (view !== 'menu') setView('menu');
          else onClose();
        }
      }}
    >
      <style>{`
        .tool-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 9995;
          background: rgba(18, 8, 42, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          box-sizing: border-box;
        }

        .tool-modal {
          background: #FFFFFF;
          border-radius: 18px;
          max-width: 560px;
          width: 100%;
          max-height: 86vh;
          overflow-y: auto;
          padding: 18px 20px 22px;
          position: relative;
          box-shadow: 0 24px 70px rgba(20, 8, 50, 0.5);
          font-family: 'Nunito', sans-serif;
          color: #180D38;
          box-sizing: border-box;
        }

        .tm-close {
          position: absolute;
          right: 12px;
          top: 10px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1.5px solid #E4DFF5;
          background: #F7F4FF;
          color: #6C28B4;
          font-weight: 900;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: all 0.15s ease;
          padding: 0;
          outline: none;
        }

        .tm-close:hover {
          background: #6C28B4;
          color: #FFFFFF;
        }

        .tm-title {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 19px;
          font-weight: 900;
          color: #3D1468;
          margin: 0 34px 12px 0;
          display: flex;
          align-items: center;
          gap: 6px;
          line-height: 1.2;
        }

        .f5mg-btn {
          display: block;
          width: 100%;
          text-align: left;
          margin-bottom: 8px;
          padding: 12px 14px;
          background: #FFFFFF;
          border-radius: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          transition: transform 0.12s ease, filter 0.15s ease;
          box-sizing: border-box;
          outline: none;
        }

        .f5mg-btn:hover {
          transform: translateY(-1px);
          filter: brightness(0.98);
        }

        .f5mg-btn:active {
          transform: scale(0.99);
        }
      `}</style>

      <div className="tool-modal animate-popIn">
        {/* Botón Cerrar exacto de .tm-close */}
        <button
          type="button"
          onClick={view === 'menu' ? onClose : () => setView('menu')}
          className="tm-close"
          title={view === 'menu' ? 'Cerrar' : 'Volver al menú'}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Título exacto de .tm-title */}
        <div className="tm-title">
          {view === 'menu' ? '🎮 Minijuegos 5°' : NOMBRES_JUEGOS[activeGame]}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            VISTA 1: MENÚ LAUNCHER EXACTO DE MatematicasDeFedor_5.html
           ══════════════════════════════════════════════════════════════ */}
        {view === 'menu' && (
          <div>
            <p
              style={{
                fontSize: '13px',
                color: '#374151',
                fontWeight: 700,
                marginBottom: '10px',
                lineHeight: 1.45,
                margin: '0 0 10px 0',
              }}
            >
              60 segundos para responder todo lo que puedas. ¡Las rachas dan puntos extra!
            </p>

            {/* 1. Contrarreloj 5° */}
            <button
              type="button"
              onClick={() => handleStartGame('contrarreloj')}
              className="f5mg-btn"
              style={{ border: '2px solid #7C3AED' }}
            >
              <div style={{ fontWeight: 900, color: '#7C3AED', fontSize: '15px' }}>
                {NOMBRES_JUEGOS.contrarreloj}
              </div>
              <div style={{ fontSize: '12px', color: '#374151', fontWeight: 700, marginTop: '2px' }}>
                Operaciones rápidas: ×, ÷, +, −, cuadrados
                {records.contrarreloj ? ` · Récord: ${records.contrarreloj}` : ''}
              </div>
            </button>

            {/* 2. Repartir */}
            <button
              type="button"
              onClick={() => handleStartGame('repartir')}
              className="f5mg-btn"
              style={{ border: '2px solid #0D9488' }}
            >
              <div style={{ fontWeight: 900, color: '#0D9488', fontSize: '15px' }}>
                {NOMBRES_JUEGOS.repartir}
              </div>
              <div style={{ fontSize: '12px', color: '#374151', fontWeight: 700, marginTop: '2px' }}>
                División con cociente y residuo
                {records.repartir ? ` · Récord: ${records.repartir}` : ''}
              </div>
            </button>

            {/* 3. Tienda Fedor */}
            <button
              type="button"
              onClick={() => handleStartGame('tienda')}
              className="f5mg-btn"
              style={{ border: '2px solid #E8650A' }}
            >
              <div style={{ fontWeight: 900, color: '#E8650A', fontSize: '15px' }}>
                {NOMBRES_JUEGOS.tienda}
              </div>
              <div style={{ fontSize: '12px', color: '#374151', fontWeight: 700, marginTop: '2px' }}>
                Compras con pesos y cálculo del vuelto
                {records.tienda ? ` · Récord: ${records.tienda}` : ''}
              </div>
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 2: PARTIDA EN VIVO (sigMG)
           ══════════════════════════════════════════════════════════════ */}
        {view === 'playing' && currentQ && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 900,
                color: '#5C21A6',
                marginBottom: '8px',
                fontSize: '14px',
              }}
            >
              <span>⏱ {timeLeft}s</span>
              <span>⭐ {score}</span>
              <span>🔥 x{streak}</span>
            </div>

            <div
              style={{
                fontSize: currentQ.q.length > 40 ? '16px' : '28px',
                fontWeight: 900,
                color: '#111111',
                textAlign: 'center',
                margin: '12px 0',
                lineHeight: 1.4,
              }}
            >
              {currentQ.q}
              {currentQ.q.length > 40 ? '' : ' = ?'}
            </div>

            <form onSubmit={handleCheckAnswer}>
              {currentQ.dos ? (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    ref={inputARef}
                    type="number"
                    placeholder="Cada uno"
                    value={inputA}
                    onChange={(e) => setInputA(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      fontSize: '17px',
                      fontWeight: 800,
                      border: '2px solid #C5BFEE',
                      borderRadius: '12px',
                      textAlign: 'center',
                      outline: 'none',
                    }}
                  />
                  <input
                    ref={inputBRef}
                    type="number"
                    placeholder="Sobran"
                    value={inputB}
                    onChange={(e) => setInputB(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      fontSize: '17px',
                      fontWeight: 800,
                      border: '2px solid #C5BFEE',
                      borderRadius: '12px',
                      textAlign: 'center',
                      outline: 'none',
                    }}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: '8px' }}>
                  <input
                    ref={inputARef}
                    type="number"
                    placeholder="Tu respuesta"
                    value={inputA}
                    onChange={(e) => setInputA(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '20px',
                      fontWeight: 900,
                      border: '2px solid #C5BFEE',
                      borderRadius: '12px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #16876A, #24C496)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                }}
              >
                ✔ Responder
              </button>
            </form>

            <div
              style={{
                textAlign: 'center',
                fontWeight: 900,
                marginTop: '10px',
                minHeight: '22px',
                fontSize: '14px',
                color: feedback?.isCorrect ? '#0D9488' : '#B91C1C',
              }}
            >
              {feedback?.text || ''}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 3: RESUMEN FINAL (finMG)
           ══════════════════════════════════════════════════════════════ */}
        {view === 'finished' && (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: '46px', lineHeight: 1, marginBottom: '6px' }}>
              {score >= 300 ? '🏆' : score >= 150 ? '🎉' : '💪'}
            </div>
            <div style={{ fontSize: '34px', fontWeight: 900, color: '#5C21A6', marginBottom: '4px' }}>
              {score} pts
            </div>
            <div style={{ fontWeight: 800, color: '#374151', fontSize: '14px', marginBottom: '14px' }}>
              {correctAttempts} de {totalAttempts} correctas
              {Math.floor(score / 20) > 0 ? ` · +${Math.floor(score / 20)} 🪙` : ''}
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => handleStartGame(activeGame)}
                style={{
                  padding: '10px 18px',
                  background: '#16876A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                }}
              >
                🔁 Otra vez
              </button>
              <button
                type="button"
                onClick={() => setView('menu')}
                style={{
                  padding: '10px 18px',
                  background: '#5C21A6',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                }}
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
