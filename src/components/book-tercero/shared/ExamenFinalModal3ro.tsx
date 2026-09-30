'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useBook3 } from '../context/Book3Context';
import { fedorSpeak } from './Grade3Speech';
import { EXAM_QUESTIONS_3RO, ExamQuestion3ro } from './commandPanelData';

interface ExamenFinalModal3roProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExamStats {
  passes: number;
  bestScore: number;
  attempts: number;
}

const STORAGE_KEY_FINAL = 'fedor3_final_stats';
const STORAGE_KEY_FALLBACK = 'fedor2_examenfinal_v1';

function triggerConfetti() {
  if (typeof window === 'undefined') return;
  const anyWin = window as unknown as { confetti?: () => void; kjConfetti?: (n: number) => void };
  if (typeof anyWin.confetti === 'function') {
    try { anyWin.confetti(); } catch {}
  } else if (typeof anyWin.kjConfetti === 'function') {
    try { anyWin.kjConfetti(50); } catch {}
  }
}

function playLocalSound(type: 'click' | 'correct' | 'wrong' | 'fanfare' | 'achievement') {
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
    } else if (type === 'correct') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === 'wrong') {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'achievement' || type === 'fanfare') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    }
  } catch {}
}

export default function ExamenFinalModal3ro({ isOpen, onClose }: ExamenFinalModal3roProps) {
  const { updateStats } = useBook3();

  // Stats from localStorage
  const [stats, setStats] = useState<ExamStats>({
    passes: 0,
    bestScore: 0,
    attempts: 0,
  });

  // Flow: 'intro' | 'quiz' | 'result'
  const [viewMode, setViewMode] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [curQIndex, setCurQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Load stats from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_FINAL) || localStorage.getItem(STORAGE_KEY_FALLBACK);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed) {
            setStats({
              passes: parsed.passes || 0,
              bestScore: parsed.bestScore || 0,
              attempts: parsed.attempts || 0,
            });
          }
        }
      } catch (e) {
        console.warn('Error loading Examen Final stats:', e);
      }
    }

    if (isOpen) {
      setViewMode('intro');
      setCurQIndex(0);
      setScore(0);
      setSelectedOpt(null);
      setIsAnswered(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const questions: ExamQuestion3ro[] = EXAM_QUESTIONS_3RO;
  const curQ = questions[curQIndex];
  const totalQuestions = questions.length;

  const handleStartExam = () => {
    playLocalSound('click');
    fedorSpeak('Iniciando el Examen Final de Tercer Grado. ¡Mucho éxito!');
    setViewMode('quiz');
    setCurQIndex(0);
    setScore(0);
    setSelectedOpt(null);
    setIsAnswered(false);
  };

  const handleAnswer = (optIdx: number) => {
    if (isAnswered || !curQ) return;
    setIsAnswered(true);
    setSelectedOpt(optIdx);

    const isCorrect = optIdx === curQ.ans;
    const nextScore = score + (isCorrect ? 1 : 0);

    if (isCorrect) {
      playLocalSound('correct');
      setScore(nextScore);
    } else {
      playLocalSound('wrong');
    }

    setTimeout(() => {
      if (curQIndex + 1 < totalQuestions) {
        setCurQIndex((prev) => prev + 1);
        setSelectedOpt(null);
        setIsAnswered(false);
      } else {
        // Examen finalizado
        const isPassed = nextScore >= 18;
        const newPasses = stats.passes + (isPassed ? 1 : 0);
        const newBestScore = Math.max(stats.bestScore, nextScore);
        const newAttempts = stats.attempts + 1;

        const nextStats: ExamStats = {
          passes: newPasses,
          bestScore: newBestScore,
          attempts: newAttempts,
        };

        setStats(nextStats);

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_FINAL, JSON.stringify(nextStats));
            localStorage.setItem(STORAGE_KEY_FALLBACK, JSON.stringify(nextStats));
            if (isPassed) {
              localStorage.setItem('fedor3_graduado_badge', 'true');
            }
          } catch {}
        }

        if (isPassed) {
          updateStats(500, 1, 100);
          playLocalSound('achievement');
          triggerConfetti();
          fedorSpeak('¡Felicitaciones! Has aprobado el examen final con honores. Eres graduado de tercer grado.');
        } else {
          playLocalSound('wrong');
          fedorSpeak('Examen finalizado. Sigue practicando para alcanzar la meta de dieciocho aciertos.');
        }

        setViewMode('result');
      }
    }, 850);
  };

  const isPassedResult = score >= 18;
  const pctResult = Math.round((score / totalQuestions) * 100);

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
          maxHeight: '92vh',
          overflowY: 'auto',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ══════════════════════════════════════════════════════
            VISTA 1: INTRO (IDÉNTICO AL SCREENSHOT DEL USUARIO)
        ══════════════════════════════════════════════════════ */}
        {viewMode === 'intro' && (
          <div>
            {/* Header rojo/magenta */}
            <div
              style={{
                background: 'linear-gradient(135deg, #A30041, #FF1D4E)',
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
                <span>📝</span>
                <span>Examen Final del Libro</span>
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

            {/* Contenido del modal */}
            <div style={{ padding: '1.4rem 1.4rem 1.5rem' }}>
              <p
                style={{
                  fontWeight: 800,
                  color: '#1E1B4B',
                  lineHeight: '1.45',
                  fontSize: '14.5px',
                  margin: '0 0 1.1rem 0',
                }}
              >
                Este examen evalúa todas las unidades del libro: Adición, Sustracción, Multiplicación y División. 25 preguntas mezcladas.
              </p>

              {/* Fila: Aprobados */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  background: '#F4F6FF',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                }}
              >
                <span style={{ color: '#1E1B4B' }}>Aprobados</span>
                <span style={{ color: '#7C3AED', fontWeight: 900 }}>{stats.passes}</span>
              </div>

              {/* Fila: Mejor puntaje */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  background: '#F4F6FF',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                }}
              >
                <span style={{ color: '#1E1B4B' }}>Mejor puntaje</span>
                <span style={{ color: '#7C3AED', fontWeight: 900 }}>{stats.bestScore}/25</span>
              </div>

              {/* Fila: Intentos */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  background: '#F4F6FF',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  fontSize: '13.5px',
                  fontWeight: 800,
                }}
              >
                <span style={{ color: '#1E1B4B' }}>Intentos</span>
                <span style={{ color: '#7C3AED', fontWeight: 900 }}>{stats.attempts}</span>
              </div>

              {/* Tarjeta Recompensa dorada */}
              <div
                style={{
                  background: '#FFF4E5',
                  border: '2px solid #FF8C2A',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#7A3200',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  lineHeight: '1.35',
                }}
              >
                <span>🏆</span>
                <span>
                  Recompensa al aprobar (≥18/25): <b>+500 🪙</b> + badge <b>&quot;Graduado de 3°&quot;</b>
                </span>
              </div>

              {/* Botón de Empezar Examen Final */}
              <button
                type="button"
                onClick={handleStartExam}
                style={{
                  width: '100%',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '15px',
                  color: '#FFFFFF',
                  fontFamily: "'Nunito', sans-serif",
                  background: 'linear-gradient(135deg, #A30041, #FF1D4E)',
                  boxShadow: '0 6px 20px rgba(163, 0, 65, 0.35)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.18s ease',
                }}
                className="hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>📝</span>
                <span>Empezar Examen Final</span>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            VISTA 2: QUIZ EN CURSO (25 PREGUNTAS MEZCLADAS)
        ══════════════════════════════════════════════════════ */}
        {viewMode === 'quiz' && curQ && (
          <div>
            {/* Header rojo */}
            <div
              style={{
                background: 'linear-gradient(135deg, #A30041, #FF1D4E)',
                padding: '1.2rem 1.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFFFFF',
              }}
            >
              <div
                style={{
                  fontSize: '17px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Baloo 2', sans-serif",
                }}
              >
                <span>📝</span>
                <span>Pregunta {curQIndex + 1} de {totalQuestions}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.22)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 900,
                  }}
                >
                  Aciertos: {score}
                </span>

                <button
                  type="button"
                  onClick={onClose}
                  title="Cerrar"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.25)',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Barra de progreso superior */}
            <div style={{ height: '6px', background: '#F1F1F8', width: '100%' }}>
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #A30041, #FF1D4E)',
                  width: `${((curQIndex + 1) / totalQuestions) * 100}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Body de la pregunta */}
            <div style={{ padding: '1.3rem 1.4rem 1.5rem' }}>
              {/* Badge Unidad y Tema */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: '#FEE2E2',
                    color: '#991B1B',
                    fontSize: '11px',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {curQ.unit}
                </span>
                <span
                  style={{
                    background: '#F3E8FF',
                    color: '#6B21A8',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {curQ.topic}
                </span>
              </div>

              {/* Enunciado */}
              <div
                style={{
                  background: '#F8F9FE',
                  border: '1.5px solid #DDD6FE',
                  borderRadius: '16px',
                  padding: '1.1rem 1.2rem',
                  marginBottom: '1.2rem',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#1E1B4B',
                  lineHeight: '1.5',
                }}
              >
                {curQ.q}
              </div>

              {/* Opciones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {curQ.opts.map((opt, oIdx) => {
                  const isSelected = selectedOpt === oIdx;
                  const isCorrect = oIdx === curQ.ans;

                  let bg = '#FFFFFF';
                  let border = '1.5px solid #E2E8F0';
                  let color = '#1E1B4B';

                  if (isAnswered) {
                    if (isCorrect) {
                      bg = '#DCFCE7';
                      border = '2px solid #16A34A';
                      color = '#14532D';
                    } else if (isSelected) {
                      bg = '#FEE2E2';
                      border = '2px solid #EF4444';
                      color = '#7F1D1D';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleAnswer(oIdx)}
                      style={{
                        background: bg,
                        border: border,
                        color: color,
                        borderRadius: '14px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: 800,
                        textAlign: 'left',
                        cursor: isAnswered ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                      className={isAnswered ? '' : 'hover:border-[#FF1D4E] hover:bg-[#FFF5F7]'}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrect && <span style={{ color: '#16A34A', fontSize: '18px' }}>✓</span>}
                      {isAnswered && isSelected && !isCorrect && <span style={{ color: '#EF4444', fontSize: '18px' }}>✕</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            VISTA 3: RESULTADO FINAL
        ══════════════════════════════════════════════════════ */}
        {viewMode === 'result' && (
          <div>
            <div
              style={{
                background: isPassedResult
                  ? 'linear-gradient(135deg, #16876A, #24C496)'
                  : 'linear-gradient(135deg, #A30041, #FF1D4E)',
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
                }}
              >
                <span>{isPassedResult ? '🎓' : '📊'}</span>
                <span>{isPassedResult ? '¡Examen Aprobado!' : 'Resultado del Examen'}</span>
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
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '1.8rem 1.4rem', textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: 900,
                  fontFamily: "'Baloo 2', sans-serif",
                  color: isPassedResult ? '#16876A' : '#A30041',
                  lineHeight: '1',
                  marginBottom: '6px',
                }}
              >
                {score}/{totalQuestions}
              </div>

              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#64748B',
                  marginBottom: '1.25rem',
                }}
              >
                {pctResult}% de aciertos {isPassedResult ? '(Aprobado ≥ 18/25)' : '(Mínimo 18/25 para aprobar)'}
              </div>

              {isPassedResult ? (
                <div
                  style={{
                    background: '#DCFCE7',
                    border: '1.5px solid #86EFAC',
                    borderRadius: '14px',
                    padding: '14px',
                    marginBottom: '1.4rem',
                  }}
                >
                  <p style={{ color: '#166534', fontWeight: 900, fontSize: '15px', margin: '0 0 6px 0' }}>
                    🏆 ¡Felicitaciones! Has ganado +500 🪙
                  </p>
                  <span
                    style={{
                      background: '#16A34A',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 900,
                      padding: '4px 14px',
                      borderRadius: '20px',
                      display: 'inline-block',
                    }}
                  >
                    🎖️ Badge: Graduado de 3°
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    background: '#FEE2E2',
                    border: '1.5px solid #FCA5A5',
                    borderRadius: '14px',
                    padding: '14px',
                    marginBottom: '1.4rem',
                  }}
                >
                  <p style={{ color: '#991B1B', fontWeight: 800, fontSize: '14px', margin: 0 }}>
                    ¡No te rindas! Puedes repasar los temas del libro y volver a presentar el examen cuando desees.
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleStartExam}
                  style={{
                    flex: 1,
                    padding: '13px',
                    border: '2px solid #A30041',
                    borderRadius: '14px',
                    fontWeight: 900,
                    fontSize: '14px',
                    color: '#A30041',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  🔄 Intentar de nuevo
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '13px',
                    border: 'none',
                    borderRadius: '14px',
                    fontWeight: 900,
                    fontSize: '14px',
                    color: '#FFFFFF',
                    background: 'linear-gradient(135deg, #6C28B4, #9B5CFF)',
                    cursor: 'pointer',
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
