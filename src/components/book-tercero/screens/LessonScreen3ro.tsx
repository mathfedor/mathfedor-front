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

  // Examples state
  const [examples, setExamples] = useState<LevelExample[]>([]);
  const [showingExamples, setShowingExamples] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#07091B] text-white font-sans p-3 md:p-6 pb-24 select-none">
      {/* Top Bar with Return Button & Breadcrumbs */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={() => goScreen('unit')}
          className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full border border-white/20 cursor-pointer transition-colors"
        >
          <span>←</span>
          <span>Volver al Tema</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-md uppercase">
            {level.label}
          </span>
        </div>
      </div>

      {/* ════ MODO 1: PANEL DE EJEMPLOS DIDÁCTICOS ════ */}
      {showingExamples ? (
        <div className="max-w-3xl mx-auto bg-[#130B29]/95 border border-purple-500/30 rounded-3xl p-5 md:p-7 shadow-2xl animate-fadeIn">
          {/* Header of examples */}
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-4 mb-5">
            <div>
              <div className="inline-block bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-emerald-500/40 mb-1">
                💡 Paso a paso · Ejemplos Explicados
              </div>
              <h1 className="text-lg md:text-xl font-black text-white">
                {topic?.title} — {level.label}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setShowingExamples(false)}
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-purple-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              ¡Ir a Practicar! 🚀
            </button>
          </div>

          {/* Examples list */}
          <div className="space-y-6">
            {examples.map((ex, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-purple-400/20 rounded-2xl p-5 hover:border-purple-400/40 transition-all shadow-md"
              >
                {/* Example Top Info */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{ex.icon || '📌'}</span>
                    <span className="text-sm md:text-base font-black text-amber-300">
                      Ejemplo {idx + 1}: {ex.q}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fedorSpeak(`${ex.q}. La respuesta es ${ex.a}`)}
                    title="Escuchar ejemplo"
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer border border-white/20"
                  >
                    🔊
                  </button>
                </div>

                {/* Visual rendering (vis) */}
                {ex.vis && (
                  <div
                    className="my-3 p-4 bg-white rounded-xl shadow-inner text-gray-900 overflow-x-auto flex justify-center items-center"
                    dangerouslySetInnerHTML={{ __html: ex.vis }}
                  />
                )}

                {/* Procedural Explanation text */}
                {ex.explain && (
                  <div className="mt-3 bg-purple-950/40 rounded-xl p-3.5 border border-purple-800/40 text-xs text-purple-100 font-mono whitespace-pre-wrap leading-relaxed">
                    {ex.explain}
                  </div>
                )}

                {/* Final answer highlight */}
                <div className="mt-3 flex items-center justify-end gap-2 text-xs font-black text-emerald-400">
                  <span>Respuesta correcta:</span>
                  <span className="bg-emerald-950/60 border border-emerald-500/50 px-2.5 py-1 rounded-lg text-emerald-200">
                    {ex.a}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Start Practice Button */}
          <div className="mt-7 text-center">
            <button
              type="button"
              onClick={() => setShowingExamples(false)}
              className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-purple-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/30 hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              ¡Comenzar Ejercicios! 🚀 ({exercises.length} preguntas)
            </button>
          </div>
        </div>
      ) : (
        /* ════ MODO 2: EJERCICIOS INTERACTIVOS ════ */
        <div className="max-w-2xl mx-auto bg-[#130B29]/95 border border-purple-500/30 rounded-3xl p-5 md:p-7 shadow-2xl animate-fadeIn">
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
      )}
    </div>
  );
}
