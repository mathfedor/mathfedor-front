'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useBook4, type LessonResultsSummary4 } from '../context/Book4Context';
import { bookService } from '@/services/book.service';
import type { LevelExample, Exercise } from '@/types/book.types';

interface Grade4Exercise {
  type: 'mcq' | 'input' | 'seq';
  q: string;
  ans?: string;
  opts?: string[];
  pts?: number;
  hint?: string;
  badge?: string;
  bst?: string;
  mascot?: string;
  ctx?: string;
  vis?: string;
  explain?: string;
  proc?: string[];
  __figHTML?: string;
  __proceso?: string[];
}

interface LevelThemeMeta4to {
  grad: string;
  headerTxt: string;
  sub: string;
  accent: string;
  badgeBg: string;
  badgeColor: string;
}

const LEVEL_THEMES_4TO: LevelThemeMeta4to[] = [
  {
    grad: 'linear-gradient(155deg, #0A3D28, #16876A, #0E5240)',
    headerTxt: '🟢 Nivel 1 — Básico',
    sub: 'Construye las bases del concepto de 4°',
    accent: '#24C496',
    badgeBg: '#DCF5EE',
    badgeColor: '#074F3A',
  },
  {
    grad: 'linear-gradient(155deg, #6A3200, #E8650A, #BA5500)',
    headerTxt: '🟡 Nivel 2 — Medio',
    sub: 'Desarrolla el pensamiento matemático',
    accent: '#FF8C2A',
    badgeBg: '#FEF3E8',
    badgeColor: '#7A3200',
  },
  {
    grad: 'linear-gradient(155deg, #5A0A28, #C94B22, #8B1A00)',
    headerTxt: '🔴 Nivel 3 — Avanzado',
    sub: 'Domina las operaciones con exactitud',
    accent: '#FF6B6B',
    badgeBg: '#FAECE7',
    badgeColor: '#7A1800',
  },
  {
    grad: 'linear-gradient(155deg, #7A3500, #C25400, #9A4200)',
    headerTxt: '🟠 Nivel 4 — Reto Experto',
    sub: 'Aplica en contextos reales y combinados',
    accent: '#FF8C00',
    badgeBg: '#FFE4CC',
    badgeColor: '#7A3000',
  },
  {
    grad: 'linear-gradient(155deg, #3A1060, #6A1B9A, #4A0080)',
    headerTxt: '🟣 Nivel 5 — Pruebas SABER 4°',
    sub: 'Tipo prueba oficial del MEN — máximo nivel',
    accent: '#C084FC',
    badgeBg: '#EDE0FF',
    badgeColor: '#4A1080',
  },
];

export default function LessonScreen4to() {
  const {
    book,
    currentUnit,
    currentTopic,
    currentLevel,
    saveLessonScore,
    goScreen,
  } = useBook4();

  const unit = book?.units?.[currentUnit];
  const topic = unit?.topics?.[currentTopic];
  const level = topic?.levels?.[currentLevel];

  const levelKey = topic
    ? `${topic.id}-n${currentLevel + 1}`
    : `u${currentUnit}t${currentTopic}-n${currentLevel + 1}`;
  const theme = LEVEL_THEMES_4TO[currentLevel] || LEVEL_THEMES_4TO[0];

  // Examples state
  const [examples, setExamples] = useState<LevelExample[]>([]);
  const [showingExamples, setShowingExamples] = useState(true);
  const [exampleIdx, setExampleIdx] = useState(0);
  const [exampleStep, setExampleStep] = useState(0);

  // Exercises state
  const exercises: Grade4Exercise[] = useMemo(() => {
    return (level?.exercises || []) as unknown as Grade4Exercise[];
  }, [level]);

  const [curExIndex, setCurExIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [answersLog, setAnswersLog] = useState<
    Array<{ q: string; user: string; correct: string; ok: boolean }>
  >([]);
  const [timerSeconds, setTimerSeconds] = useState(35);
  const [isAnswered, setIsAnswered] = useState(false);
  const isAnsweredRef = useRef(false);

  useEffect(() => {
    isAnsweredRef.current = isAnswered;
  }, [isAnswered]);

  // Load level examples
  useEffect(() => {
    const exList = bookService.getExamplesSync(levelKey, 'matematicas-fedor-4');
    setExamples(exList);
    setExampleIdx(0);
    setExampleStep(0);
    setShowingExamples(exList.length > 0);
  }, [levelKey]);

  // Timer per question
  useEffect(() => {
    if (showingExamples || exercises.length === 0) return;

    setTimerSeconds(35);
    setIsAnswered(false);
    isAnsweredRef.current = false;

    const interval = setInterval(() => {
      if (isAnsweredRef.current) return;
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curExIndex, showingExamples]);

  const curExercise = exercises[curExIndex];

  const handleTimeOut = () => {
    if (!curExercise || isAnsweredRef.current) return;
    setIsAnswered(true);
    isAnsweredRef.current = true;
    setFeedback({
      ok: false,
      message: `⏰ ¡Tiempo agotado! La respuesta correcta era: ${curExercise.ans}`,
    });

    const newLog = [
      ...answersLog,
      {
        q: curExercise.q,
        user: 'Tiempo agotado',
        correct: String(curExercise.ans),
        ok: false,
      },
    ];
    setAnswersLog(newLog);

    setTimeout(() => {
      moveToNext(newLog);
    }, 2200);
  };

  const checkAnswer = (userAns: string) => {
    if (isAnswered || !curExercise) return;
    setIsAnswered(true);
    isAnsweredRef.current = true;

    const isCorrect =
      String(userAns).trim().toLowerCase() === String(curExercise.ans).trim().toLowerCase();

    setFeedback({
      ok: isCorrect,
      message: isCorrect
        ? '🎉 ¡Excelente! ¡Respuesta correcta!'
        : `❌ ¡Casi! La respuesta correcta era: ${curExercise.ans}`,
    });

    const newLog = [
      ...answersLog,
      {
        q: curExercise.q,
        user: String(userAns),
        correct: String(curExercise.ans),
        ok: isCorrect,
      },
    ];
    setAnswersLog(newLog);

    setTimeout(() => {
      moveToNext(newLog);
    }, 1800);
  };

  const moveToNext = (currentLog: typeof answersLog) => {
    setIsAnswered(false);
    isAnsweredRef.current = false;
    setSelectedOption(null);
    setInputVal('');
    setFeedback(null);

    if (curExIndex + 1 < exercises.length) {
      setCurExIndex((prev) => prev + 1);
    } else {
      finishLessonSession(currentLog);
    }
  };

  const finishLessonSession = (finalLog: typeof answersLog) => {
    const total = finalLog.length;
    const correct = finalLog.filter((a) => a.ok).length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const xp = correct * 25;
    const c = correct * 5;
    const s = pct >= 80 ? 3 : pct >= 60 ? 2 : 1;

    saveLessonScore(levelKey, pct, xp, c, s, {
      unitIndex: currentUnit,
      topicIndex: currentTopic,
      levelIndex: currentLevel,
      total,
      correct,
      pct,
      xpEarned: xp,
      coinsEarned: c,
      starsEarned: s,
      answers: finalLog,
    });
  };

  const speak = (txt: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(txt);
      utter.lang = 'es-ES';
      window.speechSynthesis.speak(utter);
    }
  };

  if (!level) return null;

  const curExample = examples[exampleIdx] || examples[0];

  return (
    <div className="w-full max-w-full mx-auto py-2 md:py-4 px-2 md:px-0 select-none font-sans">
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '1.5rem 2rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
          border: '1.5px solid rgba(226, 232, 240, 0.8)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Back button */}
        <div style={{ marginBottom: '12px' }}>
          <button
            type="button"
            onClick={() => goScreen('unit')}
            style={{
              color: '#7B2FBE',
              fontSize: '12px',
              fontWeight: 800,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: 0,
            }}
          >
            <span>←</span> Volver a temas
          </button>
        </div>

        {/* Title and Progress Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Baloo 2', sans-serif" }}>
              <span>{topic?.icon || '🔢'}</span>
              <span>{topic?.title || 'Tema de 4° Grado'}</span>
            </div>
            <div style={{ marginTop: '4px' }}>
              <span
                style={{
                  background: theme.badgeBg || '#DCF5EE',
                  color: theme.badgeColor || '#074F3A',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'inline-block',
                }}
              >
                {level?.short || `N${currentLevel + 1}`} · {level?.label || theme.headerTxt}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', fontFamily: 'monospace' }}>
              {answersLog.filter((a) => a.ok).length}/{exercises.length || 20}
            </span>
            {!showingExamples && (
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', marginTop: '2px' }}>
                Ejercicio {curExIndex + 1} de {exercises.length || 20}
              </div>
            )}
          </div>
        </div>

        {/* Full-width Divider / Track Bar */}
        <div style={{ height: '3px', background: '#F1F5F9', borderRadius: '2px', width: '100%', margin: '8px 0 16px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: showingExamples ? '0%' : `${((curExIndex) / (exercises.length || 1)) * 100}%`,
              background: '#24C496',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* ════ MODO 1: PANEL DE EJEMPLOS DIDÁCTICOS (4° Grado) ════ */}
        {showingExamples && examples.length > 0 ? (
          <div
            style={{
              background: theme.grad,
              borderRadius: '24px',
              padding: '1.4rem 1.75rem',
              color: '#ffffff',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Top Badge with 🔊 button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '1.1rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.28)',
                  border: '1px solid rgba(245, 197, 24, 0.4)',
                  borderRadius: '24px',
                  padding: '3px 4px 3px 12px',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#F5C518', fontSize: '10.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.12em' }}>
                  ▪ EJEMPLOS DIDÁCTICOS · MÉTODO FEDOR 4°
                </span>
                <button
                  type="button"
                  onClick={() => speak(curExample?.q || '')}
                  title="Escuchar enunciado del ejemplo"
                  style={{
                    background: '#F5C518',
                    color: '#2A0F60',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  🔊
                </button>
              </div>
            </div>

            {/* Example Enunciation Header */}
            <div style={{ fontSize: '19px', fontWeight: 900, lineHeight: 1.45, marginBottom: '1.25rem', color: '#FFFFFF', fontFamily: "'Baloo 2', sans-serif" }}>
              {curExample?.q || 'Ejemplo demostrativo'}
            </div>

            {/* Step-by-step procedure box */}
            {curExample?.steps && curExample.steps.length > 0 && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '18px',
                  padding: '1.25rem',
                  color: '#1A1033',
                  marginBottom: '1.4rem',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#6C28B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>
                  🧠 Proceso paso a paso:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {curExample.steps.map((st, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: sIdx === exampleStep ? '#F3ECFF' : '#FAFAFA',
                        borderLeft: sIdx === exampleStep ? '4px solid #8B3EDB' : '4px solid #CBD5E1',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: sIdx === exampleStep ? '#2A0F60' : '#475569',
                      }}
                    >
                      <b>Paso {sIdx + 1}:</b> {st}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Example Bottom Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  disabled={exampleIdx === 0}
                  onClick={() => {
                    setExampleIdx((p) => Math.max(0, p - 1));
                    setExampleStep(0);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: exampleIdx === 0 ? 'not-allowed' : 'pointer',
                    opacity: exampleIdx === 0 ? 0.4 : 1,
                  }}
                >
                  ◀ Anterior
                </button>
                <button
                  type="button"
                  disabled={exampleIdx >= examples.length - 1}
                  onClick={() => {
                    setExampleIdx((p) => Math.min(examples.length - 1, p + 1));
                    setExampleStep(0);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: exampleIdx >= examples.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: exampleIdx >= examples.length - 1 ? 0.4 : 1,
                  }}
                >
                  Siguiente ▶
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowingExamples(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FFE066, #FF8C2A)',
                  color: '#2A0F60',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '14px',
                  fontFamily: "'Baloo 2', sans-serif",
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(255, 140, 42, 0.4)',
                }}
              >
                🚀 ¡Ir a la práctica de ejercicios!
              </button>
            </div>
          </div>
        ) : (
          /* ════ MODO 2: PRÁCTICA DE EJERCICIOS CON TEMPORIZADOR ════ */
          <div className="w-full">
            {/* Top Toolbar: Switch to examples & Timer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              {examples.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowingExamples(true)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '10px',
                    background: '#F3ECFF',
                    color: '#6C28B4',
                    border: '1px solid #C5BFEE',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  📖 Ver ejemplos explicados
                </button>
              )}

              {/* Per-question timer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: timerSeconds <= 10 ? '#FEE2E2' : '#F1F5F9',
                  border: timerSeconds <= 10 ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '4px 12px',
                  fontWeight: 900,
                  fontSize: '13px',
                  color: timerSeconds <= 10 ? '#B91C1C' : '#334155',
                }}
              >
                <span>⏱</span>
                <span>{timerSeconds} s</span>
              </div>
            </div>

            {/* Exercise Card */}
            {curExercise ? (
              <div
                style={{
                  background: '#F8FAFC',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  border: '2px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span
                    style={{
                      background: theme.badgeBg,
                      color: theme.badgeColor,
                      fontSize: '11px',
                      fontWeight: 900,
                      padding: '3px 10px',
                      borderRadius: '8px',
                    }}
                  >
                    Vale {curExercise.pts || 20} puntos XP
                  </span>

                  <button
                    type="button"
                    onClick={() => speak(curExercise.q)}
                    style={{
                      background: '#EEEDFE',
                      color: '#6C28B4',
                      border: '1px solid #C5BFEE',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    🔊
                  </button>
                </div>

                {/* Enunciado */}
                <h3
                  style={{
                    fontSize: '19px',
                    fontWeight: 900,
                    color: '#1E1B4B',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                    fontFamily: "'Baloo 2', sans-serif",
                  }}
                >
                  {curExercise.q}
                </h3>

                {/* Optional Hint / Context */}
                {curExercise.hint && (
                  <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, marginBottom: '1rem' }}>
                    💡 Pista: {curExercise.hint}
                  </div>
                )}

                {/* MCQ Options */}
                {curExercise.opts && curExercise.opts.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '12px' }}>
                    {curExercise.opts.map((opt, oIdx) => {
                      const isCorrect = String(opt) === String(curExercise.ans);
                      const isChosen = selectedOption === opt;
                      let btnBg = '#FFFFFF';
                      let btnBorder = '#CBD5E1';
                      let btnColor = '#1E1B4B';

                      if (isAnswered) {
                        if (isCorrect) {
                          btnBg = '#DCFCE7';
                          btnBorder = '#16A34A';
                          btnColor = '#14532D';
                        } else if (isChosen) {
                          btnBg = '#FEE2E2';
                          btnBorder = '#DC2626';
                          btnColor = '#7F1D1D';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => {
                            setSelectedOption(opt);
                            checkAnswer(opt);
                          }}
                          style={{
                            background: btnBg,
                            border: `2px solid ${btnBorder}`,
                            borderRadius: '14px',
                            padding: '12px 16px',
                            fontSize: '15px',
                            fontWeight: 800,
                            color: btnColor,
                            textAlign: 'left',
                            cursor: isAnswered ? 'default' : 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ color: '#8B3EDB', marginRight: '8px' }}>
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Input answer */
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', maxWidth: '340px' }}>
                    <input
                      type="text"
                      disabled={isAnswered}
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '2px solid #CBD5E1',
                        fontSize: '15px',
                        fontWeight: 800,
                        outline: 'none',
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && inputVal.trim()) {
                          checkAnswer(inputVal.trim());
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={isAnswered || !inputVal.trim()}
                      onClick={() => checkAnswer(inputVal.trim())}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '12px',
                        background: '#8B3EDB',
                        color: '#fff',
                        fontWeight: 900,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Enviar
                    </button>
                  </div>
                )}

                {/* Feedback Notification */}
                {feedback && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: feedback.ok ? '#DCFCE7' : '#FEE2E2',
                      border: `1.5px solid ${feedback.ok ? '#86EFAC' : '#FCA5A5'}`,
                      fontSize: '14px',
                      fontWeight: 900,
                      color: feedback.ok ? '#14532D' : '#7F1D1D',
                    }}
                  >
                    {feedback.message}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                No hay ejercicios disponibles para este nivel.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
