'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useBook5 } from '../context/Book5Context';
import { bookService } from '@/services/book.service';
import type { LevelExample } from '@/types/book.types';
import Swal from 'sweetalert2';
import { FZ } from '../shared/fedor-visual-lab-engine-5to';

interface Grade5Exercise {
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

interface LevelThemeMeta5to {
  grad: string;
  headerTxt: string;
  sub: string;
  accent: string;
  badgeBg: string;
  badgeColor: string;
  light: string;
  lightTxt: string;
  short: string;
}

const LEVEL_THEMES_5TO: LevelThemeMeta5to[] = [
  {
    grad: 'linear-gradient(155deg, #0A3D28, #16876A, #0E5240)',
    headerTxt: '🟢 Nivel Básico',
    sub: 'Construye las bases del concepto',
    accent: '#24C496',
    badgeBg: '#24C496',
    badgeColor: '#FFFFFF',
    light: '#DCF5EE',
    lightTxt: '#054F38',
    short: 'N1',
  },
  {
    grad: 'linear-gradient(155deg, #6A3200, #E8650A, #BA5500)',
    headerTxt: '🟡 Nivel Medio',
    sub: 'Desarrolla el pensamiento matemático',
    accent: '#FF8C2A',
    badgeBg: '#FF8C2A',
    badgeColor: '#FFFFFF',
    light: '#FEF3E8',
    lightTxt: '#7A3200',
    short: 'N2',
  },
  {
    grad: 'linear-gradient(155deg, #5A0A28, #C94B22, #8B1A00)',
    headerTxt: '🔴 Nivel Avanzado',
    sub: 'Domina la operación con precisión',
    accent: '#FF6B6B',
    badgeBg: '#FF6B6B',
    badgeColor: '#FFFFFF',
    light: '#FAECE7',
    lightTxt: '#7A1800',
    short: 'N3',
  },
  {
    grad: 'linear-gradient(155deg, #7A3500, #C25400, #9A4200)',
    headerTxt: '🟠 Nivel Experto',
    sub: 'Aplica en retos de alta exigencia',
    accent: '#FF8C00',
    badgeBg: '#FF8C00',
    badgeColor: '#FFFFFF',
    light: '#FFE4CC',
    lightTxt: '#7A3000',
    short: 'N4',
  },
  {
    grad: 'linear-gradient(155deg, #3A1060, #6A1B9A, #4A0080)',
    headerTxt: '🟣 Nivel Pruebas SABER',
    sub: 'Preguntas tipo Saber del MEN',
    accent: '#C084FC',
    badgeBg: '#C084FC',
    badgeColor: '#FFFFFF',
    light: '#EDE0FF',
    lightTxt: '#4A1080',
    short: 'N5',
  },
];

const ZOOM_STEPS = [80, 100, 125, 150, 180];

export default function LessonScreen5to() {
  const {
    book,
    currentUnit,
    currentTopic,
    currentLevel,
    goScreen,
    saveLessonScore,
    updateStats,
  } = useBook5();

  const unit = book?.units?.[currentUnit];
  const topic = unit?.topics?.[currentTopic];
  const level = topic?.levels?.[currentLevel];

  const theme = LEVEL_THEMES_5TO[currentLevel] || LEVEL_THEMES_5TO[0];

  const primaryKey = `u${currentUnit}t${currentTopic}l${currentLevel}`;
  const secondaryKey = topic?.id ? `${topic.id}-n${currentLevel + 1}` : primaryKey;

  // Examples from synchronous or async catalog
  const examples: LevelExample[] = useMemo(() => {
    const list =
      bookService.getExamplesSync(secondaryKey, 'matematicas-fedor-5') ||
      bookService.getExamplesSync(primaryKey, 'matematicas-fedor-5');
    return Array.isArray(list) ? list : [];
  }, [primaryKey, secondaryKey]);

  // Mode: Showing Examples vs Solving Exercises
  const [showingExamples, setShowingExamples] = useState(true);
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
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeStepTab, setActiveStepTab] = useState(0);

  // Parse exercises from book curriculum
  const exercises: Grade5Exercise[] = useMemo(() => {
    if (!level || !level.exercises) return [];
    return (level.exercises as any[]).map((ex) => ({
      type: ex.type || 'mcq',
      q: ex.q || ex.question || '',
      ans: ex.ans || ex.answer || '',
      opts: ex.opts || ex.options || [],
      pts: ex.pts || 10,
      hint: ex.hint || '',
      badge: ex.badge || '',
      vis: ex.vis || ex.svgFig || '',
      explain: ex.explain || '',
      proc: ex.proc || ex.__proceso || [],
    }));
  }, [level]);

  // Reset when lesson changes
  useEffect(() => {
    setShowingExamples(true);
    setCurExIndex(0);
    setAnswersLog([]);
    setFeedback(null);
  }, [primaryKey, secondaryKey]);

  // Timer per question in practice mode
  useEffect(() => {
    if (showingExamples || exercises.length === 0) return;

    setTimerSeconds(40);
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
      finishLesson(currentLog);
    }
  };

  const finishLesson = (finalLog: typeof answersLog) => {
    const total = finalLog.length || 1;
    const correct = finalLog.filter((a) => a.ok).length;
    const pct = Math.round((correct / total) * 100);

    const xp = correct * 15 + (pct === 100 ? 50 : 20);
    const c = correct * 2 + (pct >= 80 ? 10 : 0);
    const s = pct >= 95 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;

    saveLessonScore(secondaryKey, pct, xp, c, s, {
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

  // TTS with female Spanish voice preference
  const speak = (txt: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    const cleanTxt = txt.replace(/<[^>]*>/g, ' ');
    const utter = new SpeechSynthesisUtterance(cleanTxt);
    utter.lang = 'es-CO';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => {
      const idx = ZOOM_STEPS.indexOf(prev);
      const nextIdx = Math.max(0, Math.min(ZOOM_STEPS.length - 1, (idx === -1 ? 1 : idx) + delta));
      return ZOOM_STEPS[nextIdx];
    });
  };

  if (!level) return null;

  return (
    <div
      className="w-full max-w-[1008px] mx-auto px-3 sm:px-4 py-2 select-none font-sans"
      style={{ fontSize: `${(zoomLevel / 100) * 16}px` }}
    >
      {/* ══ Top Navigation & Zoom ══ */}
      <div className="flex items-center justify-between mb-3 text-xs md:text-sm font-black text-[#6C28B4]">
        <button
          type="button"
          onClick={() => goScreen('unit')}
          className="inline-flex items-center gap-1.5 hover:underline cursor-pointer"
        >
          <span>←</span>
          <span>Volver a la unidad</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#7A7299] font-bold">Zoom: {zoomLevel}%</span>
          <button
            type="button"
            onClick={() => handleZoom(-1)}
            className="w-7 h-7 rounded-lg border border-[#DDD8F5] bg-white hover:bg-purple-50 flex items-center justify-center font-black cursor-pointer"
          >
            A−
          </button>
          <button
            type="button"
            onClick={() => handleZoom(1)}
            className="w-7 h-7 rounded-lg border border-[#DDD8F5] bg-white hover:bg-purple-50 flex items-center justify-center font-black cursor-pointer"
          >
            A+
          </button>
        </div>
      </div>

      {/* ══ Header Banner ══ */}
      <div
        className="rounded-2xl md:rounded-3xl p-4 md:p-6 text-white mb-4 shadow-lg"
        style={{ background: theme.grad }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider mb-2">
              <span>{theme.short}</span>
              <span>
                Unidad {currentUnit + 1} · Tema {currentTopic + 1}
              </span>
            </div>
            <h1 className="text-xl md:text-3xl font-black font-['Baloo_2',sans-serif] leading-tight">
              {topic?.title} — {theme.headerTxt}
            </h1>
            <p className="text-xs md:text-sm text-white/90 font-bold mt-1">{theme.sub}</p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => speak(`${topic?.title}. ${theme.headerTxt}. ${theme.sub}`)}
              className="w-10 h-10 rounded-full bg-white/25 hover:bg-white/35 flex items-center justify-center text-lg cursor-pointer shadow-sm"
              title="Escuchar"
            >
              🔊
            </button>
          </div>
        </div>
      </div>

      {/* ══ Tab Navigation: Ejemplos vs Práctica ══ */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setShowingExamples(true)}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs md:text-sm transition-all cursor-pointer border-2 ${
            showingExamples
              ? 'bg-[#6C28B4] text-white border-[#6C28B4] shadow-md'
              : 'bg-white text-[#6C28B4] border-[#DDD8F5] hover:bg-purple-50'
          }`}
        >
          💡 Ejemplos Guiados ({examples.length})
        </button>
        <button
          type="button"
          onClick={() => setShowingExamples(false)}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs md:text-sm transition-all cursor-pointer border-2 ${
            !showingExamples
              ? 'bg-[#E8650A] text-white border-[#E8650A] shadow-md'
              : 'bg-white text-[#E8650A] border-[#DDD8F5] hover:bg-orange-50'
          }`}
        >
          🎯 Práctica y Evaluación ({exercises.length})
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          A. MODO EJEMPLOS GUIADOS
      ═════════════════════════════════════════════════════════════ */}
      {showingExamples ? (
        <div className="space-y-4">
          {examples.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-[#DDD8F5] p-8 text-center text-[#7A7299]">
              <span className="text-4xl block mb-2">🚀</span>
              <p className="font-bold text-sm">
                No hay ejemplos teóricos adicionales para este nivel. ¡Pasa directamente a la práctica!
              </p>
              <button
                type="button"
                onClick={() => setShowingExamples(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#E8650A] text-white font-black text-xs md:text-sm shadow-md cursor-pointer hover:bg-[#d05706]"
              >
                Comenzar Práctica ➔
              </button>
            </div>
          ) : (
            examples.map((ex, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-[#DDD8F5] p-4 md:p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EEE8FB]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    <span className="font-black text-sm text-[#180D38]">
                      Ejemplo {idx + 1}: {ex.titulo || ex.pregunta || 'Procedimiento'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => speak(`${ex.pregunta || ''}. ${ex.explicacion || ''}`)}
                    className="text-xs font-bold text-[#6C28B4] hover:underline"
                  >
                    🔊 Escuchar
                  </button>
                </div>

                {ex.pregunta && (
                  <div className="text-sm md:text-base font-black text-[#3D1468] mb-3">
                    {ex.pregunta}
                  </div>
                )}

                {/* Pasos de resolución */}
                {ex.pasos && ex.pasos.length > 0 && (
                  <div className="bg-[#FAF8FF] border border-[#DDD8F5] rounded-xl p-3 mb-3">
                    <div className="text-xs font-black text-[#6C28B4] uppercase tracking-wider mb-2">
                      Paso a paso:
                    </div>
                    <ul className="space-y-1.5 text-xs md:text-sm text-[#180D38] font-bold">
                      {ex.pasos.map((paso: string, pIdx: number) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="text-[#6C28B4] font-black">{pIdx + 1}.</span>
                          <span dangerouslySetInnerHTML={{ __html: paso }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Explicación pedagógica */}
                {ex.explicacion && (
                  <div className="text-xs md:text-sm text-[#7A7299] font-bold bg-[#F0EDFF] p-3 rounded-xl">
                    <span className="font-black text-[#6C28B4]">Conclusión: </span>
                    <span dangerouslySetInnerHTML={{ __html: ex.explicacion }} />
                  </div>
                )}

                {/* Respuesta */}
                {ex.respuesta && (
                  <div className="mt-3 text-right">
                    <span className="inline-block px-3 py-1 bg-[#DCF5EE] text-[#074F3A] font-black text-xs rounded-full border border-[#16876A]">
                      Respuesta: {ex.respuesta}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setShowingExamples(false)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#E8650A] to-[#FF8C2A] text-white font-black text-base shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              ¡Estoy listo! Ir a la práctica 🎯
            </button>
          </div>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════
            B. MODO PRÁCTICA Y EJERCICIOS
        ═════════════════════════════════════════════════════════════ */
        <div>
          {curExercise ? (
            <div className="bg-white rounded-2xl border-2 border-[#DDD8F5] p-4 md:p-6 shadow-md">
              {/* Top Exercise Header: Progress & Timer */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EEE8FB]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#6C28B4]">
                    Ejercicio {curExIndex + 1} de {exercises.length}
                  </span>
                  <div className="w-24 sm:w-36 h-2 bg-[#EEE8FB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6C28B4] to-[#9B5CE5] transition-all"
                      style={{
                        width: `${((curExIndex + 1) / exercises.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`text-xs md:text-sm font-black px-2.5 py-1 rounded-full ${
                      timerSeconds <= 10
                        ? 'bg-red-100 text-red-600 animate-pulse'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    ⏱️ {timerSeconds}s
                  </div>
                  <button
                    type="button"
                    onClick={() => speak(curExercise.q)}
                    className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-purple-200"
                    title="Escuchar pregunta"
                  >
                    🔊
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div
                className="text-base md:text-xl font-black text-[#180D38] mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: curExercise.q }}
              />

              {/* Hint */}
              {curExercise.hint && (
                <div className="text-xs text-[#7A7299] font-bold bg-[#FEF3E8] text-[#7A3200] p-2.5 rounded-xl mb-4 border border-[#FBBF7A]">
                  💡 Pista: {curExercise.hint}
                </div>
              )}

              {/* Options or Input */}
              {curExercise.type === 'mcq' && curExercise.opts && curExercise.opts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {curExercise.opts.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => checkAnswer(opt)}
                      className={`p-3.5 rounded-xl border-2 text-left font-bold text-xs md:text-sm transition-all cursor-pointer ${
                        isAnswered
                          ? String(opt).trim() === String(curExercise.ans).trim()
                            ? 'bg-[#DCF5EE] border-[#16876A] text-[#074F3A]'
                            : 'bg-gray-50 border-gray-200 text-gray-400'
                          : 'bg-[#FBF9FF] border-[#DDD8F5] hover:border-[#6C28B4] hover:bg-purple-50 text-[#180D38]'
                      }`}
                    >
                      <span className="font-black text-[#6C28B4] mr-2">
                        {String.fromCharCode(65 + oIdx)})
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 max-w-md mb-4">
                  <input
                    type="text"
                    value={inputVal}
                    disabled={isAnswered}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputVal.trim()) {
                        checkAnswer(inputVal);
                      }
                    }}
                    placeholder="Escribe tu respuesta..."
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-[#DDD8F5] font-bold text-sm outline-none focus:border-[#6C28B4]"
                  />
                  <button
                    type="button"
                    disabled={isAnswered || !inputVal.trim()}
                    onClick={() => checkAnswer(inputVal)}
                    className="px-6 py-3 rounded-xl bg-[#6C28B4] text-white font-black text-sm shadow-md hover:bg-[#581c99] transition-all cursor-pointer disabled:opacity-50"
                  >
                    Responder
                  </button>
                </div>
              )}

              {/* Feedback Alert */}
              {feedback && (
                <div
                  className={`p-3 rounded-xl text-xs md:text-sm font-black text-center animate-bounce ${
                    feedback.ok
                      ? 'bg-[#DCF5EE] text-[#074F3A] border border-[#16876A]'
                      : 'bg-[#FAECE7] text-[#C94B22] border border-[#C94B22]'
                  }`}
                >
                  {feedback.message}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 font-black text-purple-900">
              Cargando ejercicios...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
