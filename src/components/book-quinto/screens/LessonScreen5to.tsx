'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useBook5 } from '../context/Book5Context';
import { bookService } from '@/services/book.service';
import type { LevelExample } from '@/types/book.types';
import Swal from 'sweetalert2';

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
}

interface LevelThemeMeta5to {
  grad: string;
  headerTxt: string;
  orb: string;
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
    grad: 'linear-gradient(155deg, #0A3D28 0%, #16876A 50%, #0E5240 100%)',
    headerTxt: 'Nivel Básico',
    orb: '🟢',
    sub: 'Construye las bases del concepto',
    accent: '#24C496',
    badgeBg: '#24C496',
    badgeColor: '#FFFFFF',
    light: '#DCF5EE',
    lightTxt: '#074F3A',
    short: 'N1',
  },
  {
    grad: 'linear-gradient(155deg, #6A3200 0%, #E8650A 50%, #BA5500 100%)',
    headerTxt: 'Nivel Medio',
    orb: '🟡',
    sub: 'Desarrolla el pensamiento matemático',
    accent: '#FF8C2A',
    badgeBg: '#FF8C2A',
    badgeColor: '#FFFFFF',
    light: '#FEF3E8',
    lightTxt: '#7A3200',
    short: 'N2',
  },
  {
    grad: 'linear-gradient(155deg, #5A0A28 0%, #C94B22 50%, #8B1A00 100%)',
    headerTxt: 'Nivel Avanzado',
    orb: '🔴',
    sub: 'Domina la operación con precisión',
    accent: '#FF6B6B',
    badgeBg: '#FF6B6B',
    badgeColor: '#FFFFFF',
    light: '#FAECE7',
    lightTxt: '#7A1800',
    short: 'N3',
  },
  {
    grad: 'linear-gradient(155deg, #7A3500 0%, #C25400 50%, #9A4200 100%)',
    headerTxt: 'Nivel Experto',
    orb: '🟣',
    sub: 'Aplica en retos de alta exigencia',
    accent: '#8B5CF6',
    badgeBg: '#8B5CF6',
    badgeColor: '#FFFFFF',
    light: '#FFF0E4',
    lightTxt: '#7A3000',
    short: 'N4',
  },
  {
    grad: 'linear-gradient(155deg, #3A1060 0%, #6A1B9A 50%, #4A0080 100%)',
    headerTxt: 'Nivel Pruebas SABER',
    orb: '🏆',
    sub: 'Preguntas tipo Saber del MEN',
    accent: '#C084FC',
    badgeBg: '#C084FC',
    badgeColor: '#FFFFFF',
    light: '#EDE0FF',
    lightTxt: '#4A1080',
    short: 'N5',
  },
];

const HERO_STARS = [
  { top: '12%', left: '14%', size: 2 },
  { top: '25%', left: '78%', size: 2.5 },
  { top: '68%', left: '22%', size: 1.5 },
  { top: '55%', left: '88%', size: 2 },
  { top: '35%', left: '50%', size: 1.5 },
  { top: '80%', left: '60%', size: 2 },
];

export default function LessonScreen5to() {
  const {
    book,
    currentUnit,
    currentTopic,
    currentLevel,
    goScreen,
    saveLessonScore,
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
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({});

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
    setOpenSteps({});
  }, [primaryKey, secondaryKey]);

  // Timer per question in practice mode
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

  const toggleStep = (idx: number) => {
    setOpenSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleOpenVideoTema = () => {
    Swal.fire({
      title: '🎬 Video del Tema',
      html: `<div style="font-size:14px;color:#4A1278;line-height:1.6">
        <b>${topic?.title || 'Tema'}</b><br/>
        Observa cómo dominar este concepto paso a paso con los métodos animados de Fedor.
      </div>`,
      icon: 'info',
      confirmButtonText: '¡Comenzar video!',
      confirmButtonColor: '#6C28B4',
    });
  };

  const handleOpenVideoNivel = () => {
    Swal.fire({
      title: `🎞️ Video del Nivel ${currentLevel + 1}`,
      html: `<div style="font-size:14px;color:#0369A1;line-height:1.6">
        <b>${theme.headerTxt}</b><br/>
        Aprende a resolver los ejercicios de este nivel con ejemplos interactivos y visuales.
      </div>`,
      icon: 'info',
      confirmButtonText: '¡Ver tutorial!',
      confirmButtonColor: '#0284C7',
    });
  };

  if (!level) return null;

  return (
    <div className="w-full max-w-[1008px] mx-auto px-3 sm:px-4 py-2 select-none font-sans">
      <style jsx global>{`
        .f4vis {
          background: #ffffff !important;
          border-radius: 16px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          padding: 16px 14px;
          text-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          margin: 0.5rem 0;
        }
        .f4vis:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }
        .f4result {
          font-size: 26px;
          font-weight: 900;
          color: #111;
          margin-top: 10px;
          padding-top: 8px;
          border-top: 2px dashed #e2e8f0;
          font-family: 'Baloo 2', sans-serif;
        }
        .f4pasos-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #5c21a6, #7c3aed);
          color: #fff;
          border: 2px solid #f5c518;
          border-radius: 12px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          margin-bottom: 10px;
          font-family: inherit;
          transition: transform 0.15s ease;
        }
        .f4pasos-btn:hover {
          transform: scale(1.03);
        }
        .ej-explica-rica {
          margin-top: 0.65rem;
          padding: 0.85rem 1rem;
          background: #ffffff;
          color: #1e293b;
          border-radius: 12px;
          border-left: 4px solid #f5c518;
          overflow-x: auto;
        }
      `}</style>

      {/* ══ 1. Top Link: Volver a temas ══ */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => goScreen('unit')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5C21A6] hover:opacity-80 cursor-pointer transition-opacity select-none"
        >
          <span className="text-sm font-black leading-none">←</span>
          <span>Volver a temas</span>
        </button>
      </div>

      {/* ══ 2. Lesson Header & Multimedia Sub-Bar ══ */}
      <div className="mb-4">
        {/* Title */}
        <h1
          className="text-xl sm:text-2xl font-black text-[#1E1B4B] tracking-tight leading-snug flex items-center gap-2 mb-2.5"
          style={{ fontFamily: "'Baloo 2', sans-serif" }}
        >
          <span className="text-xl sm:text-2xl">{topic?.icon || '🔢'}</span>
          <span>{topic?.title || 'Números Naturales Conteo y Posición'}</span>
        </h1>

        {/* Buttons Sub-Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Level Pill Badge */}
          <span
            className="px-3 py-1.5 rounded-xl font-black text-xs shrink-0"
            style={{ backgroundColor: theme.light, color: theme.lightTxt }}
          >
            {theme.short}
          </span>

          {/* Button: Ver video del tema */}
          <button
            type="button"
            onClick={handleOpenVideoTema}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #5C21A6 0%, #8B3EDB 100%)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <span>🎬</span>
            <span>Ver video del tema</span>
          </button>

          {/* Button: Escuchar */}
          <button
            type="button"
            onClick={() =>
              speak(
                `${topic?.title || 'Tema'}. ${theme.headerTxt}. ${
                  topic?.teach || 'Aplica el método paso a paso.'
                }`
              )
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #D4286A 0%, #F054A0 100%)',
              border: '1.5px solid #FFE066',
            }}
          >
            <span>🎙</span>
            <span>Escuchar</span>
          </button>

          {/* Button: Video del Nivel */}
          <button
            type="button"
            onClick={handleOpenVideoNivel}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
              border: '1.5px solid #FFE066',
            }}
          >
            <span>🏙</span>
            <span>Video del Nivel {currentLevel + 1}</span>
          </button>
        </div>
      </div>

      {/* ══ 3. Numbered Exercise Track Dots (#progTrack) ══ */}
      <div className="flex items-center gap-1.5 flex-wrap my-3.5">
        {exercises.map((_, i) => {
          const isCurrent = !showingExamples && i === curExIndex;
          const isDone = answersLog[i] !== undefined;
          const isCorrect = answersLog[i]?.ok;

          let dotBg = '#EFEAF6';
          let dotBorder = '#DDD8F5';
          let dotColor = '#948EA5';

          if (isCurrent) {
            dotBg = '#6C28B4';
            dotBorder = '#6C28B4';
            dotColor = '#FFFFFF';
          } else if (isDone) {
            if (isCorrect) {
              dotBg = '#10B981';
              dotBorder = '#10B981';
              dotColor = '#FFFFFF';
            } else {
              dotBg = '#EF4444';
              dotBorder = '#EF4444';
              dotColor = '#FFFFFF';
            }
          }

          return (
            <div
              key={i}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-black transition-all ${
                isCurrent ? 'scale-115 shadow-sm' : ''
              }`}
              style={{
                backgroundColor: dotBg,
                borderColor: dotBorder,
                borderWidth: '1.5px',
                borderStyle: 'solid',
                color: dotColor,
              }}
              title={`Ejercicio ${i + 1}`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* ══ 4. MAIN CONTAINER: EXAMPLES PANEL OR PRACTICE ══ */}
      {showingExamples ? (
        <div
          className="relative overflow-hidden rounded-[24px] p-5 sm:p-7 md:p-8 text-white shadow-xl mb-8"
          style={{
            background: theme.grad,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Cosmic Stars */}
          {HERO_STARS.map((s, idx) => (
            <span
              key={idx}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                opacity: 0.65,
              }}
            />
          ))}

          <div className="relative z-10">
            {/* Top Badge: PANEL DE EJEMPLOS · MÉTODO FEDOR */}
            <div className="mb-3">
              <span className="inline-block text-[10.5px] sm:text-[11px] font-black text-[#FDE047] uppercase tracking-wider bg-[#F5C518]/15 border border-[#F5C518]/40 px-3.5 py-1 rounded-full">
                📖 PANEL DE EJEMPLOS · MÉTODO FEDOR
              </span>
            </div>

            {/* Header: Level Title & Exercise Count */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2
                  className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight flex items-center gap-2.5"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  <span className="text-xl sm:text-2xl">{theme.orb}</span>
                  <span>{theme.headerTxt}</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/75 font-semibold mt-1">
                  {theme.sub} · {topic?.title}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] font-black uppercase text-white/50 tracking-wider">
                  EJERCICIOS
                </div>
                <div
                  className="text-2xl sm:text-3xl font-black text-[#FF8C2A] leading-none mt-0.5"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  {exercises.length}
                </div>
              </div>
            </div>

            {/* 3 Mascots in Clouds */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 my-6">
              {[
                { icon: '🧑‍🚀', name: 'Math' },
                { icon: '👩‍🚀', name: 'Sumy' },
                { icon: '👦', name: 'Jack' },
              ].map((char, i) => (
                <div key={i} className="text-center group">
                  <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-full bg-white shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
                    <span className="text-2xl sm:text-3xl select-none">{char.icon}</span>
                  </div>
                  <div className="text-[11px] sm:text-xs font-black text-white/90 mt-1.5">
                    {char.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Pedagogical Concept Box */}
            <div className="bg-white/10 border border-white/15 border-l-4 border-l-[#24C496] rounded-2xl p-4 sm:p-5 my-5">
              <div className="text-xs sm:text-sm font-bold text-white/95 leading-relaxed mb-1.5">
                Aplica el método paso a paso.
              </div>
              <div
                className="text-xs sm:text-sm font-normal text-white/85 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    topic?.teach ||
                    'Los números naturales sirven para contar. El valor de cada cifra depende de la posición.',
                }}
              />
              {topic?.formula && (
                <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold text-white">
                  <span>🗨</span>
                  <span>{topic.formula}</span>
                </div>
              )}
            </div>

            {/* Examples Count Header */}
            <div className="flex items-center gap-1.5 text-xs font-black text-white/70 uppercase tracking-wider mb-3">
              <span>✨</span>
              <span>{examples.length} EJEMPLOS RESUELTOS</span>
            </div>

            {/* Examples List */}
            <div className="space-y-4 mb-6">
              {examples.map((e: any, i: number) => {
                const isOpen = !!openSteps[i];

                return (
                  <div
                    key={i}
                    className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-5 backdrop-blur-xs transition-all"
                  >
                    {/* Top Row: Icon + Question + Answer Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/25 border border-blue-400/30 flex items-center justify-center text-lg shrink-0">
                        {e.icon || '🔁'}
                      </div>

                      <div className="flex-1 text-sm sm:text-base font-bold text-white/95 leading-snug">
                        {e.q}
                      </div>

                      <div
                        className="bg-[#6B8E23]/35 border border-[#9ACD32]/50 text-[#FDE047] font-black text-base sm:text-lg px-3 py-1 rounded-xl shrink-0 min-w-[36px] text-center"
                        style={{ fontFamily: "'Baloo 2', sans-serif" }}
                      >
                        {e.a}
                      </div>
                    </div>

                    {/* Visual Card (White box with notebooks/abacus/figures) */}
                    {e.vis && (
                      <div
                        className="f4vis my-3"
                        dangerouslySetInnerHTML={{ __html: e.vis }}
                      />
                    )}

                    {/* Step-by-Step Accordion */}
                    {e.explain && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => toggleStep(i)}
                          className="w-full flex items-center justify-between py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/95 text-xs sm:text-sm font-black transition-colors cursor-pointer select-none"
                        >
                          <span className="flex items-center gap-2">
                            <span>📗</span>
                            <span>Ver paso a paso</span>
                          </span>
                          <span className="text-xs font-bold opacity-80">
                            {isOpen ? '▲ Ocultar' : '▼ Mostrar'}
                          </span>
                        </button>

                        {isOpen && (
                          <div
                            className="mt-2.5 p-4 rounded-xl bg-white text-slate-800 text-xs sm:text-sm font-normal overflow-x-auto shadow-sm"
                            dangerouslySetInnerHTML={{ __html: e.explain }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Button: ¡Empezar ejercicios! */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowingExamples(false)}
                className="w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg text-[#2A0F60] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer select-none"
                style={{
                  background: 'linear-gradient(135deg, #F5C518 0%, #FF8C2A 100%)',
                  boxShadow: '0 8px 24px rgba(245, 197, 24, 0.45)',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                🎮 ¡Empezar {exercises.length} ejercicios!
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════
            B. MODO PRÁCTICA Y EJERCICIOS
        ═════════════════════════════════════════════════════════════ */
        <div>
          {/* Top Bar: Button to return to Examples */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setShowingExamples(true)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#5C21A6] hover:underline cursor-pointer"
            >
              <span>💡</span>
              <span>Volver al panel de ejemplos</span>
            </button>
          </div>

          {curExercise ? (
            <div className="bg-white rounded-[24px] border border-[#DDD8F5] p-5 sm:p-7 shadow-md">
              {/* Top Exercise Header: Progress & Timer */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EEE8FB]">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-[#6C28B4]">
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
                className="text-base sm:text-lg md:text-xl font-black text-[#180D38] mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: curExercise.q }}
              />

              {/* Hint */}
              {curExercise.hint && (
                <div className="text-xs text-[#7A3200] font-bold bg-[#FEF3E8] p-3 rounded-xl mb-4 border border-[#FBBF7A]">
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
                      className={`p-3.5 sm:p-4 rounded-xl border-2 text-left font-bold text-xs sm:text-sm transition-all cursor-pointer ${
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
                  className={`p-3.5 rounded-xl text-xs sm:text-sm font-black text-center animate-bounce ${
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

