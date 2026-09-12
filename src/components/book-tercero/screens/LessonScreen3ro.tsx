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

  const [curExIndex, setCurExIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [answersLog, setAnswersLog] = useState<
    Array<{ q: string; user: string; correct: string; ok: boolean }>
  >([]);
  const [timerSeconds, setTimerSeconds] = useState(35);
  const [isAnswered, setIsAnswered] = useState(false);

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
    if (showingExamples || isAnswered || exercises.length === 0) return;

    setTimerSeconds(35);
    const interval = setInterval(() => {
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
  }, [curExIndex, showingExamples, isAnswered]);

  const curExercise = exercises[curExIndex];

  const handleTimeOut = () => {
    if (!curExercise || isAnswered) return;
    setIsAnswered(true);
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
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans p-3 md:p-6 pb-24 select-none">
      {/* ════ MODO 1: PANEL DE EJEMPLOS DIDÁCTICOS (WIZARD - IMAGEN 2) ════ */}
      {showingExamples && examples.length > 0 ? (
        <div className="w-full max-w-5xl mx-auto">
          {/* Top Bar with Return, Topic Title & Level Badge */}
          <div className="mb-3">
            <button
              type="button"
              onClick={() => goScreen('unit')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer transition-colors mb-2"
            >
              <span>←</span>
              <span>Volver a temas</span>
            </button>

            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-lg md:text-xl font-black text-[#1E1B4B] flex items-center gap-2">
                  <span>{topic?.icon || '🔢'}</span>
                  <span>{topic?.title}</span>
                </h1>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-md border shadow-xs"
                    style={{
                      background: theme.badgeBg,
                      color: theme.badgeColor,
                      borderColor: theme.accent,
                    }}
                  >
                    <span>{level.short || `N${currentLevel + 1}`}</span>
                    <button
                      type="button"
                      onClick={() => fedorSpeak(`${topic?.title}, ${theme.headerTxt}`)}
                      title="Escuchar"
                      className="cursor-pointer hover:scale-110 transition-transform"
                    >
                      🔊
                    </button>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-gray-400 font-mono">
                  0/{exercises.length || 21}
                </span>
              </div>
            </div>

            {/* Faint divider line */}
            <div className="w-full h-px bg-purple-200/60 mt-3 mb-4" />
          </div>

          {/* ══ THE BIG COLORED WIZARD CARD (Imagen 2) ══ */}
          <div
            className="w-full rounded-[24px] md:rounded-[28px] p-5 md:p-8 text-white shadow-2xl relative overflow-hidden transition-all duration-300"
            style={{
              background: theme.grad,
            }}
          >
            {/* Top Pill Badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="inline-flex items-center gap-2 bg-black/25 text-[#F5C518] text-[10px] md:text-[11px] font-black uppercase px-3 py-1.5 rounded-lg border border-white/10 shadow-xs">
                <span>■</span>
                <span>EJEMPLOS INTERACTIVOS · MÉTODO FEDOR</span>
                <button
                  type="button"
                  onClick={() => {
                    if (curExample) {
                      fedorSpeak(`${curExample.q}. La respuesta es ${curExample.a}.`);
                    }
                  }}
                  title="Escuchar ejemplo"
                  className="cursor-pointer hover:scale-120 transition-transform ml-0.5 text-xs text-white"
                >
                  🔊
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowingExamples(false)}
                className="inline-flex items-center gap-1.5 text-xs font-black bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-xl border border-white/20 cursor-pointer transition-colors shadow-xs"
              >
                <span>Practicar</span>
                <span>▶</span>
              </button>
            </div>

            {/* Subheader: Level Header (Left) and Topic (Right) */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base md:text-xl font-black text-white leading-tight">
                  {theme.headerTxt}
                </h2>
                <p className="text-xs md:text-sm font-semibold text-white/80 mt-0.5">
                  {theme.sub} - {topic?.title}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  TEMA
                </div>
                <div className="text-xs md:text-sm font-black text-amber-300 max-w-[200px] truncate">
                  {topic?.title}
                </div>
              </div>
            </div>

            {/* Stepper Navigation Bar: [ ◄ ] EJEMPLO X/N [ ► ] */}
            <div className="bg-[#200E4A] border border-purple-800/60 rounded-2xl p-2 md:p-2.5 flex items-center justify-between mb-4 shadow-lg">
              <button
                type="button"
                disabled={exampleIdx === 0}
                onClick={() => {
                  setExampleIdx((prev) => Math.max(0, prev - 1));
                  setExampleStep(0);
                }}
                className="w-12 h-10 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/30 text-white flex items-center justify-center font-black text-lg cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
              >
                ◄
              </button>

              <div className="text-center">
                <div className="text-[9px] uppercase tracking-wider text-purple-200/70 font-black">
                  EJEMPLO
                </div>
                <div className="text-base md:text-xl font-black font-['Baloo_2',sans-serif] leading-tight text-[#F5C518]">
                  {exampleIdx + 1} <span className="text-xs md:text-sm text-white/60">/ {examples.length}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={exampleIdx === examples.length - 1}
                onClick={() => {
                  setExampleIdx((prev) => Math.min(examples.length - 1, prev + 1));
                  setExampleStep(0);
                }}
                className="w-12 h-10 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/30 text-white flex items-center justify-center font-black text-lg cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
              >
                ►
              </button>
            </div>

            {/* Interactive Example Card */}
            {curExample && (
              <div className="bg-black/20 border border-white/15 rounded-2xl p-4 md:p-6 mb-4 backdrop-blur-xs shadow-inner">
                {/* Question */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-xl shrink-0 shadow-sm">
                    {curExample.icon || '🟡'}
                  </div>
                  <h3 className="text-lg md:text-2xl font-black text-white font-['Baloo_2',sans-serif] tracking-wide">
                    {curExample.q}
                  </h3>
                </div>

                {/* Step 1: Visual Representation */}
                {exampleStep >= 1 && curExample.vis && (
                  <div
                    className="my-3.5 p-4 bg-white rounded-xl shadow-inner text-gray-900 overflow-x-auto flex justify-center items-center animate-fadeIn border border-gray-200"
                    dangerouslySetInnerHTML={{ __html: curExample.vis }}
                  />
                )}

                {/* Step 2: Answer Box */}
                {exampleStep >= 2 && (
                  <div className="my-3.5 p-3.5 bg-emerald-950/70 border-2 border-emerald-400/80 rounded-xl flex items-center gap-3.5 text-white animate-fadeIn shadow-md">
                    <span className="text-2xl md:text-3xl">✅</span>
                    <div>
                      <div className="text-[10px] uppercase font-black tracking-wider text-emerald-300">
                        Respuesta Correcta
                      </div>
                      <div className="text-lg md:text-2xl font-black font-['Baloo_2',sans-serif] text-white">
                        {curExample.a}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Explanation Step-by-Step */}
                {exampleStep >= 3 && curExample.explain && (
                  <div className="my-3.5 p-4 bg-amber-950/60 border border-amber-400/60 rounded-xl text-white animate-fadeIn shadow-md">
                    <div className="text-[11px] font-black uppercase tracking-wider text-amber-300 mb-2.5 flex items-center gap-1.5">
                      <span>📖</span>
                      <span>Paso a paso</span>
                    </div>
                    <div className="space-y-1.5 text-xs md:text-sm">
                      {curExample.explain.split('\n').filter(l => l.trim()).map((line, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-2 py-0.5">
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-purple-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {lIdx + 1}
                          </span>
                          <span className="text-amber-100 font-medium leading-relaxed">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progressive Action Button (Pill button) */}
                <div className="mt-4">
                  {exampleStep === 0 && (
                    <button
                      type="button"
                      onClick={() => setExampleStep(curExample.vis ? 1 : 2)}
                      className="w-full py-3 px-6 rounded-xl bg-[#4A1E8A] hover:bg-[#5E27AD] text-white font-black text-xs md:text-sm border border-[#C5BFEE]/40 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <span>👁️</span>
                      <span>{curExample.vis ? 'Ver visual' : 'Ver respuesta'}</span>
                    </button>
                  )}

                  {exampleStep === 1 && (
                    <button
                      type="button"
                      onClick={() => setExampleStep(2)}
                      className="w-full py-3 px-6 rounded-xl bg-[#4A1E8A] hover:bg-[#5E27AD] text-white font-black text-xs md:text-sm border border-[#C5BFEE]/40 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <span>💡</span>
                      <span>Ver respuesta</span>
                    </button>
                  )}

                  {exampleStep === 2 && curExample.explain && (
                    <button
                      type="button"
                      onClick={() => setExampleStep(3)}
                      className="w-full py-3 px-6 rounded-xl bg-[#1A5C2A] hover:bg-[#237A38] text-white font-black text-xs md:text-sm border border-[#90EE90]/40 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <span>📖</span>
                      <span>Ver explicación paso a paso</span>
                    </button>
                  )}

                  {exampleStep >= 3 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExampleStep(0)}
                        className="w-1/2 py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer text-center"
                      >
                        🔄 Repetir ejemplo
                      </button>
                      {exampleIdx < examples.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setExampleIdx(prev => prev + 1);
                            setExampleStep(0);
                          }}
                          className="w-1/2 py-2.5 px-4 rounded-xl bg-[#4A1E8A] hover:bg-[#5E27AD] text-white font-black text-xs border border-[#C5BFEE]/40 transition-all cursor-pointer text-center"
                        >
                          Siguiente ejemplo ▶
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Big Button: ¡Comenzar Ejercicios! */}
                {(exampleIdx === examples.length - 1 || exampleStep >= 2) && (
                  <button
                    type="button"
                    onClick={() => setShowingExamples(false)}
                    className="w-full mt-3 py-3.5 px-6 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-300 hover:to-orange-300 text-purple-950 font-black text-sm md:text-base rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>¡Comenzar Ejercicios!</span>
                    <span>🚀</span>
                    <span className="text-xs opacity-80">({exercises.length} preguntas)</span>
                  </button>
                )}
              </div>
            )}

            {/* Carousel Dots at the bottom */}
            <div className="flex items-center justify-center gap-2 pt-2 pb-1">
              {examples.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => {
                    setExampleIdx(dotIdx);
                    setExampleStep(0);
                  }}
                  className={`cursor-pointer transition-all duration-300 ${
                    dotIdx === exampleIdx
                      ? 'w-6 h-2 rounded-full bg-[#F5C518] shadow-sm'
                      : 'w-2 h-2 rounded-full bg-white/35 hover:bg-white/60'
                  }`}
                  aria-label={`Ir al ejemplo ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ════ MODO 2: EJERCICIOS INTERACTIVOS (QUIZ) ════ */
        <div className="max-w-3xl mx-auto">
          {/* Top Bar with Return & Back to Examples */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <button
              type="button"
              onClick={() => goScreen('unit')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-white px-3.5 py-1.5 rounded-full border border-purple-200 cursor-pointer transition-colors shadow-xs"
            >
              <span>←</span>
              <span>Volver a temas</span>
            </button>

            {examples.length > 0 && (
              <button
                type="button"
                onClick={() => setShowingExamples(true)}
                className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300 cursor-pointer transition-colors shadow-xs"
              >
                <span>💡</span>
                <span>Ver Ejemplos Didácticos</span>
              </button>
            )}
          </div>

          <div className="max-w-2xl mx-auto bg-[#130B29]/95 border border-purple-500/30 rounded-3xl p-5 md:p-7 shadow-2xl animate-fadeIn text-white">
          {/* Progress dots & Timer */}
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-purple-800/30">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-purple-200">
                Pregunta {curExIndex + 1} de {exercises.length}
              </span>
            </div>

            {/* Timer countdown bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">
                ⏱️ {timerSeconds}s
              </span>
              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 rounded-full ${
                    timerSeconds < 10
                      ? 'bg-red-500'
                      : timerSeconds < 20
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${(timerSeconds / 35) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {curExercise ? (
            <div>
              {/* Badges and Points */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {curExercise.badge && (
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-purple-800/60 border border-purple-400/40 text-purple-200">
                      {curExercise.badge}
                    </span>
                  )}
                  {curExercise.mascot && (
                    <span className="text-base">{curExercise.mascot}</span>
                  )}
                </div>
                <span className="text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
                  ⭐ +{curExercise.pts || 25} pts
                </span>
              </div>

              {/* Question Statement with 🔊 Button */}
              <div className="flex items-start justify-between gap-3 mb-4 bg-white/5 p-4 rounded-2xl border border-purple-400/20">
                <h2 className="text-base md:text-lg font-black text-white leading-relaxed">
                  {curExercise.q}
                </h2>
                <button
                  type="button"
                  onClick={() => fedorSpeak(curExercise.q)}
                  title="Escuchar pregunta"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors cursor-pointer border border-white/20 shrink-0"
                >
                  🔊
                </button>
              </div>

              {/* Figure Renderer (SVG geometric shapes, cubes, fractions, counters) */}
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
                className="my-4"
              />

              {/* Hint Box (if any) */}
              {curExercise.hint && (
                <div className="bg-amber-500/15 border border-amber-400/30 rounded-xl p-3 mb-4 text-xs font-bold text-amber-200 flex items-center gap-2">
                  <span>💡</span>
                  <span>{curExercise.hint}</span>
                </div>
              )}

              {/* Multiple Choice Options (MCQ) */}
              {curExercise.type === 'mcq' && curExercise.opts && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                  {curExercise.opts.map((opt, oIdx) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => {
                          setSelectedOption(opt);
                          checkAnswer(opt);
                        }}
                        className={`p-3.5 rounded-2xl border text-sm md:text-base font-black text-center transition-all cursor-pointer shadow-md ${
                          isSelected
                            ? 'bg-amber-400 text-purple-950 border-amber-300 scale-102 shadow-amber-400/40'
                            : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:border-amber-400/50'
                        } ${isAnswered ? 'cursor-not-allowed opacity-80' : ''}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Text / Numeric Input */}
              {curExercise.type === 'input' && (
                <div className="my-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputVal}
                      disabled={isAnswered}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && inputVal.trim() && !isAnswered) {
                          checkAnswer(inputVal.trim());
                        }
                      }}
                      placeholder="Escribe tu respuesta aquí"
                      className="flex-1 bg-white/10 border border-purple-400/40 rounded-2xl px-4 py-3 text-base font-black text-white placeholder-purple-300/40 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      disabled={!inputVal.trim() || isAnswered}
                      onClick={() => checkAnswer(inputVal.trim())}
                      className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-purple-950 font-black text-sm rounded-2xl shadow-lg disabled:opacity-50 cursor-pointer transition-all active:scale-95"
                    >
                      Comprobar
                    </button>
                  </div>
                </div>
              )}

              {/* Feedback box */}
              {feedback && (
                <div
                  className={`mt-4 p-4 rounded-2xl border text-center text-sm font-black animate-popIn ${
                    feedback.ok
                      ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
                      : 'bg-red-900/60 border-red-500 text-red-200'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              {/* Button to review examples */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowingExamples(true)}
                  className="text-xs font-bold text-purple-300 hover:text-white underline cursor-pointer bg-transparent border-none"
                >
                  📖 Ver explicación y ejemplos de este nivel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm font-bold text-gray-400">
                No hay ejercicios configurados para este nivel.
              </p>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);
}
