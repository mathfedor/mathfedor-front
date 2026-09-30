'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useBook3 } from '../context/Book3Context';
import { bookService } from '@/services/book.service';
import FigureRenderer3ro from '../shared/FigureRenderer3ro';
import { fedorSpeak } from '../shared/Grade3Speech';
import type { LevelExample, Exercise } from '@/types/book.types';

interface Grade3Exercise {
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
  pA?: number;
  pB?: number;
  pOp?: string;
  pIco?: string;
  pIco2?: string;
  pNameA?: string;
  pNameB?: string;
  countEmoji?: string;
  countN?: number;
  visObjs?: Array<{ e: string; n: number; label?: string }>;
}

interface LevelThemeMeta {
  grad: string;
  headerTxt: string;
  sub: string;
  accent: string;
  badgeBg: string;
  badgeColor: string;
}

const LEVEL_THEMES_3RO: LevelThemeMeta[] = [
  {
    grad: 'linear-gradient(155deg, #0A3D28, #16876A, #0E5240)',
    headerTxt: '🟢 Nivel Básico',
    sub: 'Construye las bases del concepto',
    accent: '#24C496',
    badgeBg: '#DCF5EE',
    badgeColor: '#074F3A',
  },
  {
    grad: 'linear-gradient(155deg, #6A3200, #E8650A, #BA5500)',
    headerTxt: '🟡 Nivel Medio',
    sub: 'Desarrolla el pensamiento matemático',
    accent: '#FF8C2A',
    badgeBg: '#FEF3E8',
    badgeColor: '#7A3200',
  },
  {
    grad: 'linear-gradient(155deg, #5A0A28, #C94B22, #8B1A00)',
    headerTxt: '🔴 Nivel Avanzado',
    sub: 'Domina la operación con precisión',
    accent: '#FF6B6B',
    badgeBg: '#FAECE7',
    badgeColor: '#7A1800',
  },
  {
    grad: 'linear-gradient(155deg, #7A3500, #C25400, #9A4200)',
    headerTxt: '🟠 Nivel Experto',
    sub: 'Aplica la operación en contextos reales',
    accent: '#FF8C00',
    badgeBg: '#FFE4CC',
    badgeColor: '#7A3000',
  },
  {
    grad: 'linear-gradient(155deg, #3A1060, #6A1B9A, #4A0080)',
    headerTxt: '🔵 Pruebas SABER · 3°',
    sub: 'Tipo prueba oficial — máximo nivel',
    accent: '#C084FC',
    badgeBg: '#EDE0FF',
    badgeColor: '#4A1080',
  },
];

export default function LessonScreen3ro() {
  const {
    book,
    currentUnit,
    currentTopic,
    currentLevel,
    saveLessonScore,
    goScreen,
  } = useBook3();

  const unit = book?.units?.[currentUnit];
  const topic = unit?.topics?.[currentTopic];
  const level = topic?.levels?.[currentLevel];

  const levelKey = topic ? `${topic.id}-n${currentLevel + 1}` : `u${currentUnit}t${currentTopic}-n${currentLevel + 1}`;
  const theme = LEVEL_THEMES_3RO[currentLevel] || LEVEL_THEMES_3RO[0];

  // Examples state
  const [examples, setExamples] = useState<LevelExample[]>([]);
  const [showingExamples, setShowingExamples] = useState(true);
  const [exampleIdx, setExampleIdx] = useState(0);
  const [exampleStep, setExampleStep] = useState(0);

  // Exercises state
  const exercises: Grade3Exercise[] = useMemo(() => {
    return (level?.exercises || []) as unknown as Grade3Exercise[];
  }, [level]);

  const maxTimer = useMemo(() => {
    return (currentUnit === 10 && currentTopic === 0 && currentLevel >= 3) ? 70 : 35;
  }, [currentUnit, currentTopic, currentLevel]);

  const [curExIndex, setCurExIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [answersLog, setAnswersLog] = useState<
    Array<{ q: string; user: string; correct: string; ok: boolean }>
  >([]);
  const [timerSeconds, setTimerSeconds] = useState(35);
  const [isAnswered, setIsAnswered] = useState(false);
  const isAnsweredRef = React.useRef(false);

  useEffect(() => {
    isAnsweredRef.current = isAnswered;
  }, [isAnswered]);

  // Load level examples
  useEffect(() => {
    const exList = bookService.getExamplesSync(levelKey, 'matematicas-fedor-3');
    setExamples(exList);
    setExampleIdx(0);
    setExampleStep(0);
    setShowingExamples(exList.length > 0);
  }, [levelKey]);

  // Timer for current exercise
  useEffect(() => {
    if (showingExamples || exercises.length === 0) return;

    setTimerSeconds(maxTimer);
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
  }, [curExIndex, showingExamples, maxTimer]);

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
            className="hover:opacity-80 transition-opacity"
          >
            <span>←</span> Volver a temas
          </button>
        </div>

        {/* Title and Progress Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Baloo 2', sans-serif" }}>
              <span>{topic?.icon || '🔢'}</span>
              <span>{topic?.title || 'Adición y Conteo'}</span>
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
                {level?.short || `N${currentLevel + 1}`}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', fontFamily: 'monospace' }}>
              {answersLog.filter((a) => a.ok).length}/{exercises.length || 21}
            </span>
            {!showingExamples && (
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', marginTop: '2px' }}>
                Ejercicio {curExIndex + 1} de {exercises.length || 21}
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

        {/* ════ MODO 1: PANEL DE EJEMPLOS DIDÁCTICOS (Idéntico a Imagen 2) ════ */}
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
                  ▪ EJEMPLOS INTERACTIVOS · MÉTODO FEDOR
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (curExample) {
                      fedorSpeak(`${curExample.q}. ${curExample.a ? `La respuesta es ${curExample.a}.` : ''}`);
                    }
                  }}
                  title="Escuchar"
                  style={{
                    background: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '3px 10px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563EB',
                  }}
                  className="hover:scale-110 active:scale-95 transition-transform"
                >
                  🔊
                </button>
              </div>
            </div>

            {/* Subheader: Level Header (Left) and Topic (Right) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', fontFamily: "'Baloo 2', sans-serif", lineHeight: 1.2 }}>
                  {theme.headerTxt}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600, marginTop: '3px' }}>
                  {theme.sub} - {topic?.title}
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: '#FF8C2A', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                  TEMA
                </div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#FF8C2A', fontFamily: "'Baloo 2', sans-serif" }}>
                  {topic?.title}
                </div>
              </div>
            </div>

            {/* Navigation Bar: [ ◀ ]  EJEMPLO X/N  [ ▶ ] */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '1.15rem', width: '100%' }}>
              <button
                type="button"
                disabled={exampleIdx === 0}
                onClick={() => {
                  setExampleIdx((prev) => Math.max(0, prev - 1));
                  setExampleStep(0);
                }}
                style={{
                  flex: 1,
                  background: '#241355',
                  border: '1.5px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: '12px',
                  height: '46px',
                  color: '#ffffff',
                  fontSize: '18px',
                  cursor: exampleIdx === 0 ? 'not-allowed' : 'pointer',
                  opacity: exampleIdx === 0 ? 0.35 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 4px 12px rgba(36, 19, 85, 0.35)',
                }}
                className="hover:scale-[1.01] active:scale-[0.99]"
              >
                ◀
              </button>

              <div style={{ textAlign: 'center', minWidth: '100px', flexShrink: 0 }}>
                <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  EJEMPLO
                </div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#F5C518', fontFamily: "'Baloo 2', sans-serif", lineHeight: 1.1 }}>
                  {exampleIdx + 1} <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 700 }}>/ {examples.length || 10}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={exampleIdx >= (examples.length || 10) - 1}
                onClick={() => {
                  setExampleIdx((prev) => Math.min((examples.length || 10) - 1, prev + 1));
                  setExampleStep(0);
                }}
                style={{
                  flex: 1,
                  background: '#241355',
                  border: '1.5px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: '12px',
                  height: '46px',
                  color: '#ffffff',
                  fontSize: '18px',
                  cursor: exampleIdx >= (examples.length || 10) - 1 ? 'not-allowed' : 'pointer',
                  opacity: exampleIdx >= (examples.length || 10) - 1 ? 0.35 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 4px 12px rgba(36, 19, 85, 0.35)',
                }}
                className="hover:scale-[1.01] active:scale-[0.99]"
              >
                ▶
              </button>
            </div>

            {/* Example Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '18px',
                padding: '1.25rem',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Question */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: exampleStep > 0 ? '1rem' : '1.1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '2px solid rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0,
                  }}
                >
                  {curExample?.icon || '🟡'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', fontFamily: "'Baloo 2', sans-serif" }}>
                  {curExample?.q || '1 + 2 = ?'}
                </div>
              </div>

              {/* Step 1: Visual Representation */}
              {exampleStep >= 1 && curExample?.vis && (
                <div
                  className="my-3 p-4 bg-white rounded-xl shadow-inner text-gray-900 overflow-x-auto flex justify-center items-center border border-gray-200"
                  dangerouslySetInnerHTML={{ __html: curExample.vis }}
                />
              )}

              {/* Step 2: Answer Box */}
              {exampleStep >= 2 && curExample?.a && (
                <div
                  style={{
                    background: 'rgba(36, 196, 150, 0.20)',
                    border: '2px solid #24C496',
                    borderRadius: '14px',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '28px' }}>✅</span>
                  <div>
                    <div style={{ fontSize: '11px', color: '#90EE90', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                      Respuesta
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', fontFamily: "'Baloo 2', sans-serif" }}>
                      {curExample.a}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Explanation Step-by-Step */}
              {exampleStep >= 3 && curExample?.explain && (
                <div
                  style={{
                    background: 'rgba(245, 197, 24, 0.14)',
                    border: '2px solid rgba(245, 197, 24, 0.5)',
                    borderRadius: '14px',
                    padding: '0.85rem 1rem',
                    marginBottom: '0.8rem',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#F5C518', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.5rem' }}>
                    📖 Paso a paso
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {curExample.explain.split('\n').filter((l: string) => l.trim()).map((line: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                        <span style={{ background: '#F5C518', color: '#2A0F60', borderRadius: '6px', padding: '1px 7px', fontSize: '11px', fontWeight: 900 }}>
                          {idx + 1}
                        </span>
                        <span style={{ color: '#ffffff', lineHeight: 1.4 }}>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button: 👁️ Ver visual / 💡 Ver respuesta / 📖 Ver explicación paso a paso */}
              <div>
                {exampleStep === 0 && (
                  <button
                    type="button"
                    onClick={() => setExampleStep(curExample?.vis ? 1 : 2)}
                    style={{
                      width: '100%',
                      background: '#4A1E8A',
                      border: '2px solid #C5BFEE',
                      color: '#ffffff',
                      padding: '11px 18px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '13.5px',
                      fontWeight: 900,
                      fontFamily: "'Nunito', sans-serif",
                      boxShadow: '0 4px 14px rgba(74, 30, 138, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                    className="hover:scale-[1.008] active:scale-[0.99] transition-transform"
                  >
                    <span>👁️ Ver visual</span>
                  </button>
                )}

                {exampleStep === 1 && (
                  <button
                    type="button"
                    onClick={() => setExampleStep(2)}
                    style={{
                      width: '100%',
                      background: '#4A1E8A',
                      border: '2px solid #C5BFEE',
                      color: '#ffffff',
                      padding: '11px 18px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '13.5px',
                      fontWeight: 900,
                      fontFamily: "'Nunito', sans-serif",
                      boxShadow: '0 4px 14px rgba(74, 30, 138, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                    className="hover:scale-[1.008] active:scale-[0.99] transition-transform"
                  >
                    <span>💡 Ver respuesta</span>
                  </button>
                )}

                {exampleStep === 2 && curExample?.explain && (
                  <button
                    type="button"
                    onClick={() => setExampleStep(3)}
                    style={{
                      width: '100%',
                      background: '#1A5C2A',
                      border: '2px solid #90EE90',
                      color: '#ffffff',
                      padding: '11px 18px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '13.5px',
                      fontWeight: 900,
                      fontFamily: "'Nunito', sans-serif",
                      boxShadow: '0 4px 14px rgba(26, 92, 42, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                    className="hover:scale-[1.008] active:scale-[0.99] transition-transform"
                  >
                    <span>📖 Ver explicación paso a paso</span>
                  </button>
                )}

                {/* Start exercises button */}
                {(exampleIdx === (examples.length || 10) - 1 || exampleStep >= 2) && (
                  <button
                    type="button"
                    onClick={() => setShowingExamples(false)}
                    style={{
                      width: '100%',
                      marginTop: '0.85rem',
                      padding: '13px',
                      fontSize: '15px',
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #F5C518, #FF8C2A)',
                      color: '#2A0F60',
                      border: 'none',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      fontFamily: "'Nunito', sans-serif",
                      letterSpacing: '.03em',
                      boxShadow: '0 6px 20px rgba(245, 197, 24, 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                    className="hover:scale-[1.01] active:scale-[0.99] transition-transform"
                  >
                    <span>🎮 ¡Empezar {exercises.length || 20} ejercicios!</span>
                  </button>
                )}
              </div>
            </div>

            {/* Dots Indicator (pequeños círculos horizontales, píldora amarilla activa) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
                marginTop: '1rem',
                height: '10px',
                maxHeight: '10px',
                lineHeight: 1,
              }}
            >
              {(examples.length > 0 ? examples : Array.from({ length: 10 })).map((_, dotIdx) => {
                const isActive = dotIdx === exampleIdx;
                return (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => {
                      setExampleIdx(dotIdx);
                      setExampleStep(0);
                    }}
                    style={{
                      width: isActive ? '22px' : '8px',
                      minWidth: isActive ? '22px' : '8px',
                      maxWidth: isActive ? '22px' : '8px',
                      height: '8px',
                      minHeight: '8px',
                      maxHeight: '8px',
                      padding: 0,
                      margin: 0,
                      border: 'none',
                      borderRadius: '4px',
                      background: isActive ? '#F5C518' : 'rgba(255, 255, 255, 0.35)',
                      cursor: 'pointer',
                      flexShrink: 0,
                      display: 'inline-block',
                      transition: 'all 0.25s ease',
                    }}
                    title={`Ir al ejemplo ${dotIdx + 1}`}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          /* ════ MODO 2: EJERCICIOS INTERACTIVOS (Idéntico a Imagen de Usuario) ════ */
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #E9D5FF',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Top Bar: Badge (Conteo) | Counter (1/21) | Pts (⭐ 27 pts) */}
            <div
              style={{
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #F8F5FF, #F0EDFF)',
                borderBottom: '1px solid #F0EDF8',
              }}
            >
              {/* Left Badge */}
              <div>
                <span
                  style={{
                    background: curExercise?.bst ? curExercise.bst.split('background:')[1]?.split(';')[0] || '#DCF5EE' : '#DCF5EE',
                    color: curExercise?.bst ? curExercise.bst.split('color:')[1]?.split(';')[0] || '#074F3A' : '#074F3A',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    display: 'inline-block',
                  }}
                >
                  {curExercise?.badge || 'Conteo'}
                </span>
              </div>

              {/* Center Counter */}
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748B', fontFamily: 'monospace' }}>
                {curExIndex + 1} / {exercises.length || 21}
              </div>

              {/* Right Points */}
              <div>
                <span
                  style={{
                    background: '#FEF3D6',
                    color: '#B45309',
                    fontSize: '11px',
                    fontWeight: 900,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(245, 197, 24, 0.3)',
                    display: 'inline-block',
                  }}
                >
                  ⭐ {curExercise?.pts || 27} pts
                </span>
              </div>
            </div>

            {/* Timer Bar (Purple fill countdown) */}
            <div style={{ height: '5px', background: '#F3E8FF', width: '100%', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.max(0, Math.min(100, (timerSeconds / maxTimer) * 100))}%`,
                  background: timerSeconds < 10 ? '#EF4444' : timerSeconds < 20 ? '#F59E0B' : '#7B2FBE',
                  transition: 'width 1s linear, background 0.4s ease',
                  borderRadius: '0 3px 3px 0',
                }}
              />
            </div>

            {/* Exercise Body */}
            <div style={{ padding: '2.5rem 1.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Mascot / Icon (e.g. 1 2 / 3 4 blue squircle) */}
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
                  marginBottom: '10px',
                }}
              >
                {curExercise?.mascot === '🔢' || !curExercise?.mascot ? (
                  <div style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1.15, textAlign: 'center', fontFamily: "'Baloo 2', sans-serif" }}>
                    <div>1 2</div>
                    <div>3 4</div>
                  </div>
                ) : (
                  <span style={{ fontSize: '24px' }}>{curExercise.mascot}</span>
                )}
              </div>

              {/* Context visual (e.g. 🔵 + 🟡 🟡) */}
              {curExercise?.ctx && (
                <div style={{ fontSize: '22px', letterSpacing: '4px', marginBottom: '10px', textAlign: 'center', lineHeight: 1.4 }}>
                  {curExercise.ctx}
                </div>
              )}

              {/* Figure renderer for SVG / Objects if needed */}
              {(curExercise?.countEmoji || curExercise?.visObjs || curExercise?.pA) && (
                <FigureRenderer3ro
                  ctx={curExercise.ctx}
                  countEmoji={curExercise.countEmoji}
                  countN={curExercise.countN}
                  visObjs={curExercise.visObjs}
                  pA={curExercise.pA}
                  pB={curExercise.pB}
                  pOp={curExercise.pOp}
                  pIco={curExercise.pIco}
                  pIco2={curExercise.pIco2}
                  pNameA={curExercise.pNameA}
                  pNameB={curExercise.pNameB}
                  className="my-3"
                />
              )}

              {/* Question Statement with 🔊 button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '32px', fontWeight: 900, color: '#1E1B4B', fontFamily: "'Baloo 2', sans-serif" }}>
                  {curExercise?.q}
                </span>
                <button
                  type="button"
                  onClick={() => fedorSpeak(`${curExercise?.q}.`)}
                  title="Escuchar enunciado"
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '3px 8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748B',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                  className="hover:scale-105 active:scale-95 transition-transform"
                >
                  🔊
                </button>
              </div>

              {/* Hint (if any) */}
              {curExercise?.hint && (
                <div
                  style={{
                    background: '#FFFBEB',
                    border: '1px solid #FCD34D',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    marginBottom: '1.25rem',
                    color: '#92400E',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>💡</span>
                  <span>{curExercise.hint}</span>
                </div>
              )}

              {/* Multiple Choice Options (2-column grid, matching screenshot) */}
              {curExercise?.type === 'mcq' && curExercise.opts && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', width: '100%', maxWidth: '850px', marginBottom: '1rem' }}>
                  {curExercise.opts.map((opt, oIdx) => {
                    const isSelected = selectedOption === opt;
                    const isCorrectOpt = isAnswered && String(opt).trim().toLowerCase() === String(curExercise.ans).trim().toLowerCase();
                    const isWrongSelected = isAnswered && isSelected && !isCorrectOpt;

                    let btnBg = '#FFFFFF';
                    let btnBorder = '#E2E8F0';
                    let btnColor = '#1E1B4B';

                    if (isCorrectOpt) {
                      btnBg = '#DCF5EE';
                      btnBorder = '#24C496';
                      btnColor = '#074F3A';
                    } else if (isWrongSelected) {
                      btnBg = '#FEE8E1';
                      btnBorder = '#EF4444';
                      btnColor = '#7A1800';
                    } else if (isSelected) {
                      btnBg = '#EEEDFE';
                      btnBorder = '#7B2FBE';
                      btnColor = '#7B2FBE';
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
                          borderRadius: '16px',
                          padding: '16px 12px',
                          minHeight: '68px',
                          fontSize: '22px',
                          fontWeight: 900,
                          color: btnColor,
                          fontFamily: "'Baloo 2', sans-serif",
                          cursor: isAnswered ? 'default' : 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.18s ease',
                        }}
                        className="hover:scale-[1.01] active:scale-[0.99]"
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Numeric / Text Input */}
              {curExercise?.type === 'input' && (
                <div style={{ margin: '1rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%', maxWidth: '360px' }}>
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={inputVal}
                    disabled={isAnswered}
                    autoFocus
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputVal.trim() && !isAnswered) {
                        checkAnswer(inputVal.trim());
                      }
                    }}
                    placeholder="?"
                    style={{
                      width: '180px',
                      fontSize: '34px',
                      fontWeight: 900,
                      textAlign: 'center',
                      border: '2.5px solid #C5BFEE',
                      borderRadius: '16px',
                      padding: '12px',
                      background: '#F7F5FF',
                      color: '#1E1B4B',
                      outline: 'none',
                      fontFamily: "'Baloo 2', sans-serif",
                    }}
                  />
                  <button
                    type="button"
                    disabled={!inputVal.trim() || isAnswered}
                    onClick={() => checkAnswer(inputVal.trim())}
                    style={{
                      width: '100%',
                      padding: '13px',
                      fontSize: '15px',
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #7B2FBE, #9B5CE5)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '14px',
                      cursor: isAnswered || !inputVal.trim() ? 'not-allowed' : 'pointer',
                      opacity: isAnswered || !inputVal.trim() ? 0.6 : 1,
                      fontFamily: "'Nunito', sans-serif",
                      boxShadow: '0 6px 18px rgba(108, 40, 180, 0.35)',
                    }}
                    className="hover:scale-[1.01] active:scale-[0.99] transition-transform"
                  >
                    ✅ Confirmar
                  </button>
                </div>
              )}

              {/* Sequence Type */}
              {curExercise?.type === 'seq' && (
                <div style={{ margin: '1rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%', maxWidth: '360px' }}>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={inputVal}
                    disabled={isAnswered}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputVal.trim() && !isAnswered) {
                        checkAnswer(inputVal.trim());
                      }
                    }}
                    placeholder="?"
                    style={{
                      width: '140px',
                      fontSize: '28px',
                      fontWeight: 900,
                      textAlign: 'center',
                      border: '2.5px solid #C5BFEE',
                      borderRadius: '14px',
                      padding: '10px',
                      background: '#F7F5FF',
                      color: '#1E1B4B',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    disabled={!inputVal.trim() || isAnswered}
                    onClick={() => checkAnswer(inputVal.trim())}
                    style={{
                      width: '100%',
                      padding: '13px',
                      fontSize: '15px',
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #7B2FBE, #9B5CE5)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '14px',
                      cursor: isAnswered || !inputVal.trim() ? 'not-allowed' : 'pointer',
                      opacity: isAnswered || !inputVal.trim() ? 0.6 : 1,
                    }}
                  >
                    ✅ Confirmar
                  </button>
                </div>
              )}

              {/* Feedback Banner */}
              {feedback && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '12px 20px',
                    borderRadius: '14px',
                    textAlign: 'center',
                    fontSize: '15px',
                    fontWeight: 900,
                    background: feedback.ok ? '#DCF5EE' : '#FEE8E1',
                    border: `2px solid ${feedback.ok ? '#24C496' : '#EF4444'}`,
                    color: feedback.ok ? '#074F3A' : '#7A1800',
                    width: '100%',
                    maxWidth: '650px',
                    animation: 'popIn 0.3s ease',
                  }}
                >
                  {feedback.message}
                </div>
              )}

              {/* Button to review didactic examples */}
              <div style={{ marginTop: '1.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowingExamples(true)}
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#7B2FBE',
                    background: 'none',
                    border: 'none',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  className="hover:opacity-80"
                >
                  📖 Ver explicación y ejemplos de este nivel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
