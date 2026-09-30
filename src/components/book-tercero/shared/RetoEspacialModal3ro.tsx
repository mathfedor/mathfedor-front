'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useBook3 } from '../context/Book3Context';
import { fedorSpeak } from './Grade3Speech';

interface RetoEspacialModal3roProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EspacialState {
  done: number;
  level: number;
  lastDay: string;
  streak: number;
  total: number;
}

interface SaberQuestion {
  q: string;
  ans: string;
  opts?: string[];
  ctx?: string;
}

const STORAGE_KEY_ESPACIAL = 'fedor3_espacial_v1';

const RANKS = [
  '🛰️ Cadete Estelar',
  '🚀 Piloto Cósmico',
  '🪐 Comandante Lunar',
  '⭐ Almirante Galáctico',
  '🌌 Maestro del Universo',
];

const FALLBACK_SABER_QUESTIONS: SaberQuestion[] = [
  {
    q: 'En una bodega hay 3 cajas con 12 paquetes de galletas cada una. ¿Cuántos paquetes de galletas hay en total?',
    ans: '36',
    opts: ['36', '32', '24', '48'],
    ctx: 'Pensamiento Numérico · Pruebas SABER 3°',
  },
  {
    q: 'Sofía ahorró $450 el lunes y $350 el martes. Si gastó $200 en un helado, ¿cuánto dinero le quedó?',
    ans: '$600',
    opts: ['$600', '$500', '$700', '$800'],
    ctx: 'Problemas de Suma y Resta · Pruebas SABER 3°',
  },
  {
    q: 'Un agricultor tiene 48 naranjas y las reparte por igual en 6 canastas. ¿Cuántas naranjas coloca en cada canasta?',
    ans: '8',
    opts: ['8', '6', '7', '9'],
    ctx: 'Reparto Equitativo · Pruebas SABER 3°',
  },
  {
    q: 'Si un tren sale a las 3:15 p.m. y el viaje dura 45 minutos, ¿a qué hora llega a su destino?',
    ans: '4:00 p.m.',
    opts: ['4:00 p.m.', '3:45 p.m.', '4:15 p.m.', '3:50 p.m.'],
    ctx: 'Medición del Tiempo · Pruebas SABER 3°',
  },
  {
    q: '¿Cuál es el perímetro de un triángulo equilátero cuyos lados miden 7 cm cada uno?',
    ans: '21 cm',
    opts: ['21 cm', '14 cm', '28 cm', '49 cm'],
    ctx: 'Geometría y Medición · Pruebas SABER 3°',
  },
];

function playLocalSound(type: 'click' | 'success' | 'error' | 'achievement') {
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
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === 'error') {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'achievement') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch {}
}

export default function RetoEspacialModal3ro({ isOpen, onClose }: RetoEspacialModal3roProps) {
  const { book, updateStats } = useBook3();

  // State in localStorage
  const [state, setState] = useState<EspacialState>({
    done: 0,
    level: 1,
    lastDay: '',
    streak: 0,
    total: 0,
  });

  // Mission gameplay state: 'intro' | 'playing' | 'result'
  const [viewMode, setViewMode] = useState<'intro' | 'playing' | 'result'>('intro');
  const [missionPicks, setMissionPicks] = useState<SaberQuestion[]>([]);
  const [curMissionIdx, setCurMissionIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_ESPACIAL);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed) {
            setState({
              done: parsed.done || 0,
              level: parsed.level || 1,
              lastDay: parsed.lastDay || '',
              streak: parsed.streak || 0,
              total: parsed.total || 0,
            });
          }
        }
      } catch (e) {
        console.warn('Error loading Reto Espacial state:', e);
      }
    }
    if (isOpen) {
      setViewMode('intro');
      setSelectedOpt(null);
      setIsQuestionAnswered(false);
    }
  }, [isOpen]);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const hoyHecho = state.lastDay === todayStr;

  const currentRank = useMemo(() => {
    const idx = Math.min(RANKS.length - 1, Math.floor((state.done || 0) / 10));
    return RANKS[idx];
  }, [state.done]);

  // Pool of SABER questions from book
  const saberPool: SaberQuestion[] = useMemo(() => {
    const pool: SaberQuestion[] = [];
    if (book?.units) {
      book.units.forEach((u) => {
        u.topics?.forEach((t) => {
          const l5 = t.levels?.[4];
          if (l5?.exercises) {
            l5.exercises.forEach((ex: any) => {
              if (ex && ex.q && ex.ans !== undefined) {
                pool.push({
                  q: String(ex.q),
                  ans: String(ex.ans),
                  opts: ex.opts?.map(String) || [
                    String(ex.ans),
                    String(+ex.ans + 1 || '2'),
                    String(+ex.ans - 1 || '4'),
                    String(+ex.ans + 2 || '6'),
                  ],
                  ctx: ex.ctx || u.name,
                });
              }
            });
          }
        });
      });
    }
    return pool.length >= 3 ? pool : FALLBACK_SABER_QUESTIONS;
  }, [book]);

  if (!isOpen) return null;

  const handleStartMission = () => {
    if (hoyHecho) return;
    playLocalSound('click');
    fedorSpeak('¡Iniciando misión del Reto Espacial! Resuelve 3 problemas para ganar tu recompensa.');

    // Pick 3 random distinct questions
    const shuffled = [...saberPool].sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, 3);
    setMissionPicks(picks);
    setCurMissionIdx(0);
    setCorrectCount(0);
    setSelectedOpt(null);
    setIsQuestionAnswered(false);
    setViewMode('playing');
  };

  const handleSelectOption = (opt: string) => {
    if (isQuestionAnswered) return;
    setIsQuestionAnswered(true);
    setSelectedOpt(opt);

    const curQ = missionPicks[curMissionIdx];
    const isOk = String(opt).trim().toLowerCase() === String(curQ?.ans).trim().toLowerCase();

    if (isOk) {
      playLocalSound('success');
      setCorrectCount((prev) => prev + 1);
    } else {
      playLocalSound('error');
    }

    setTimeout(() => {
      if (curMissionIdx + 1 < missionPicks.length) {
        setCurMissionIdx((prev) => prev + 1);
        setSelectedOpt(null);
        setIsQuestionAnswered(false);
      } else {
        // Finished mission
        const finalCorrect = correctCount + (isOk ? 1 : 0);
        const success = finalCorrect >= 2;

        if (success) {
          const prevDay = state.lastDay;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().slice(0, 10);

          const nextStreak = prevDay === yesterdayStr ? (state.streak || 0) + 1 : 1;
          const nextState: EspacialState = {
            done: (state.done || 0) + 1,
            total: (state.total || 0) + 1,
            level: state.level || 1,
            streak: nextStreak,
            lastDay: todayStr,
          };

          setState(nextState);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(STORAGE_KEY_ESPACIAL, JSON.stringify(nextState));
            } catch (e) {}
          }

          // Award 50 coins and 30 XP
          updateStats(50, 1, 30);
          playLocalSound('achievement');
          fedorSpeak('¡Felicitaciones! Has cumplido la misión espacial y ganado cincuenta monedas.');
        } else {
          playLocalSound('error');
          fedorSpeak('Misión no completada. Vuelve a intentarlo mañana.');
        }

        setViewMode('result');
      }
    }, 850);
  };

  const curQuestion = missionPicks[curMissionIdx];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 4, 30, 0.78)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ══ MODO INTRO: POPUP EXACTO DE LA IMAGEN ══ */}
        {viewMode === 'intro' && (
          <div>
            {/* Header morado */}
            <div
              style={{
                background: 'linear-gradient(135deg, #2A1070, #6C28B4)',
                padding: '1.25rem 1.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFFFFF',
              }}
            >
              <div
                style={{
                  fontSize: '19px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: "'Baloo 2', sans-serif",
                  letterSpacing: '-0.01em',
                }}
              >
                <span>🚀</span>
                <span>Reto Espacial</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                title="Cerrar"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                className="hover:bg-white/40 active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.35rem 1.4rem 1.5rem' }}>
              {/* Tarjeta Galaxia oscura */}
              <div
                style={{
                  background: 'radial-gradient(ellipse at center, #1A0A3C 0%, #0A0420 80%)',
                  border: '1.5px solid #6C28B4',
                  borderRadius: '16px',
                  padding: '1.15rem 1rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  boxShadow: '0 6px 18px rgba(108, 40, 180, 0.25)',
                }}
              >
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 900,
                    color: '#FFD66B',
                    marginBottom: '5px',
                    fontFamily: "'Baloo 2', sans-serif",
                    letterSpacing: '0.02em',
                  }}
                >
                  {currentRank}
                </div>
                <div style={{ fontSize: '13px', color: '#C5BFEE', fontWeight: 600 }}>
                  Misiones espaciales completadas: <b style={{ color: '#FFFFFF' }}>{state.done || 0}</b> · Racha:{' '}
                  <b style={{ color: '#FFFFFF' }}>{state.streak || 0}</b> 🔥
                </div>
              </div>

              {/* Fila: Reto diario de hoy */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  background: '#F8F5FF',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                }}
              >
                <span style={{ color: '#1E1B4B' }}>Reto diario de hoy</span>
                <span style={{ color: hoyHecho ? '#10B981' : '#9333EA', fontWeight: 900 }}>
                  {hoyHecho ? '✅ Completado' : '⏳ Disponible'}
                </span>
              </div>

              {/* Fila: Recompensa */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  background: '#F8F5FF',
                  borderRadius: '12px',
                  marginBottom: '1.25rem',
                  fontSize: '13.5px',
                  fontWeight: 800,
                }}
              >
                <span style={{ color: '#1E1B4B' }}>Recompensa</span>
                <span style={{ color: '#9333EA', fontWeight: 900 }}>+50 🪙 + 30 XP</span>
              </div>

              {/* Botón de acción */}
              <button
                type="button"
                onClick={handleStartMission}
                disabled={hoyHecho}
                style={{
                  width: '100%',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '15px',
                  color: '#FFFFFF',
                  fontFamily: "'Nunito', sans-serif",
                  background: 'linear-gradient(135deg, #6C28B4, #FF1D4E)',
                  boxShadow: '0 6px 20px rgba(108, 40, 180, 0.35)',
                  cursor: hoyHecho ? 'not-allowed' : 'pointer',
                  opacity: hoyHecho ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.18s ease',
                }}
                className={hoyHecho ? '' : 'hover:scale-[1.01] active:scale-[0.99]'}
              >
                <span>{hoyHecho ? '⏰ Vuelve mañana' : '🚀 Iniciar misión'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ══ MODO MISIÓN EN CURSO: 3 PREGUNTAS SABER ══ */}
        {viewMode === 'playing' && curQuestion && (
          <div>
            {/* Header morado */}
            <div
              style={{
                background: 'linear-gradient(135deg, #2A1070, #6C28B4)',
                padding: '1.2rem 1.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFFFFF',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Baloo 2', sans-serif",
                }}
              >
                <span>🚀</span>
                <span>Misión {curMissionIdx + 1}/3</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Pregunta */}
            <div style={{ padding: '1.4rem' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  border: '2.5px solid #FF8A1F',
                  borderRadius: '16px',
                  padding: '1.1rem',
                  marginBottom: '1.2rem',
                  boxShadow: '0 4px 12px rgba(255, 138, 31, 0.15)',
                }}
              >
                {curQuestion.ctx && (
                  <div style={{ color: '#64748B', fontStyle: 'italic', fontSize: '12.5px', marginBottom: '8px', fontWeight: 600 }}>
                    {curQuestion.ctx}
                  </div>
                )}
                <div style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '16px', lineHeight: 1.45, fontFamily: "'Nunito', sans-serif" }}>
                  {curQuestion.q}
                </div>
              </div>

              {/* Opciones 2x2 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {(curQuestion.opts || []).map((opt, oi) => {
                  const isSelected = selectedOpt === opt;
                  const isCorrect = isQuestionAnswered && String(opt).trim().toLowerCase() === String(curQuestion.ans).trim().toLowerCase();
                  const isWrong = isQuestionAnswered && isSelected && !isCorrect;

                  let btnBg = '#FFFFFF';
                  let btnBorder = '#C5BFEE';
                  let btnColor = '#1E1B4B';

                  if (isCorrect) {
                    btnBg = '#DCF5EE';
                    btnBorder = '#16876A';
                    btnColor = '#074F3A';
                  } else if (isWrong) {
                    btnBg = '#FEE8E1';
                    btnBorder = '#EF4444';
                    btnColor = '#7A1800';
                  }

                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={isQuestionAnswered}
                      onClick={() => handleSelectOption(opt)}
                      style={{
                        padding: '13px 10px',
                        border: `2px solid ${btnBorder}`,
                        borderRadius: '12px',
                        background: btnBg,
                        color: btnColor,
                        fontWeight: 800,
                        fontSize: '15px',
                        fontFamily: "'Nunito', sans-serif",
                        cursor: isQuestionAnswered ? 'default' : 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                      }}
                      className={isQuestionAnswered ? '' : 'hover:bg-purple-50 hover:border-purple-500'}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══ MODO RESULTADO FINAL ══ */}
        {viewMode === 'result' && (
          <div>
            {/* Header de resultado */}
            <div
              style={{
                background: correctCount >= 2 ? 'linear-gradient(135deg, #16876A, #24C496)' : 'linear-gradient(135deg, #A30041, #FF1D4E)',
                padding: '1.25rem 1.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFFFFF',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Baloo 2', sans-serif",
                }}
              >
                <span>{correctCount >= 2 ? '🏆' : '❌'}</span>
                <span>{correctCount >= 2 ? 'Misión cumplida' : 'Misión fallida'}</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Cuerpo de resultado */}
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontWeight: 800, fontSize: '16px', color: '#1E1B4B', marginBottom: '8px' }}>
                Acertaste <b style={{ color: '#6C28B4' }}>{correctCount}/3</b> problemas.
              </p>

              {correctCount >= 2 ? (
                <div style={{ background: '#DCF5EE', border: '1.5px solid #24C496', borderRadius: '14px', padding: '12px', marginBottom: '1.25rem' }}>
                  <p style={{ color: '#074F3A', fontWeight: 900, fontSize: '14px', margin: 0 }}>
                    🎉 ¡Has ganado <b>+50 🪙</b> y <b>+30 XP</b>! Avanzas en tu rango espacial.
                  </p>
                </div>
              ) : (
                <div style={{ background: '#FEE8E1', border: '1.5px solid #EF4444', borderRadius: '14px', padding: '12px', marginBottom: '1.25rem' }}>
                  <p style={{ color: '#7A1800', fontWeight: 900, fontSize: '14px', margin: 0 }}>
                    Inténtalo de nuevo mañana, Cadete. ¡La constancia hace al maestro!
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '13px',
                  border: 'none',
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '15px',
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #6C28B4, #9B5CFF)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(108, 40, 180, 0.3)',
                }}
                className="hover:scale-[1.01] active:scale-[0.99]"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
