'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useBook5 } from '../context/Book5Context';
import { bookService } from '@/services/book.service';
import { mockLevelExamples5 } from '@/mocks/book-examples.mock';
import type { LevelExample } from '@/types/book.types';
import Swal from 'sweetalert2';
import FedorVideoModal5to from '../modals/FedorVideoModal5to';
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
    grad: 'linear-gradient(155deg,#0A3D28,#16876A,#0E5240)',
    headerTxt: 'Nivel Básico',
    orb: '🟢',
    sub: 'Construye las bases del concepto',
    accent: '#24C496',
    badgeBg: '#24C496',
    badgeColor: '#FFFFFF',
    light: '#DCF5EE',
    lightTxt: '#054F38',
    short: 'N1',
  },
  {
    grad: 'linear-gradient(155deg,#6A3200,#E8650A,#BA5500)',
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
    grad: 'linear-gradient(155deg,#5A0A28,#C94B22,#8B1A00)',
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
    grad: 'linear-gradient(155deg,#7A3500,#C25400,#9A4200)',
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
    grad: 'linear-gradient(155deg,#3A1060,#6A1B9A,#4A0080)',
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
  { top: '2%', left: '8%', size: 2.2 },
  { top: '20%', left: '61%', size: 2 },
  { top: '22%', left: '30%', size: 2 },
  { top: '32%', left: '67%', size: 2 },
  { top: '38%', left: '56%', size: 2.5 },
  { top: '49%', left: '86%', size: 2 },
  { top: '59%', left: '85%', size: 2.5 },
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

  const fallbackKey = `u${currentUnit}t${currentTopic}-n${currentLevel + 1}`;
  const secondaryKey = topic?.id ? `${topic.id}-n${currentLevel + 1}` : fallbackKey;
  const primaryKey = `u${currentUnit}t${currentTopic}l${currentLevel}`;

  // Helper to remove duplicated step button from explain HTML
  const cleanExplanation = (html: string) => {
    if (!html) return '';
    return html
      .replace(/<(div|button)[^>]*class=["'](?:f4PasoAPaso|f4pasos-btn)["'][^>]*>[\s\S]*?<\/\1>/gi, '')
      .trim();
  };

  // Examples from synchronous or async catalog
  const examples: LevelExample[] = useMemo(() => {
    let list =
      bookService.getExamplesSync(secondaryKey, 'matematicas-fedor-5') ||
      bookService.getExamplesSync(fallbackKey, 'matematicas-fedor-5') ||
      bookService.getExamplesSync(primaryKey, 'matematicas-fedor-5');
    if (!list || list.length === 0) {
      if (currentUnit === 0 && currentTopic === 0 && currentLevel === 0) {
        list = mockLevelExamples5['01a_adicion_t0-n1'] || [];
      }
    }
    return Array.isArray(list) ? list : [];
  }, [primaryKey, secondaryKey, fallbackKey, currentUnit, currentTopic, currentLevel]);

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
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [openLabs, setOpenLabs] = useState<Record<number, boolean>>({});
  const [labHtmls, setLabHtmls] = useState<Record<number, string>>({});

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
    setOpenLabs({});
    setLabHtmls({});
  }, [primaryKey, secondaryKey]);

  // Synchronize globals for FZ engine and audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).FZ = FZ;
      (window as any).curUnit = currentUnit;
      (window as any).curTopicIdx = currentTopic;
      (window as any).curLevelIdx = currentLevel;
      (window as any).UNITS = book?.units || [];
      if (!(window as any).fedor5Tono) {
        (window as any).fedor5Tono = (freq = 520) => {
          try {
            const AudioContextClass =
              window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) return;
            const ctx = new AudioContextClass();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
          } catch (_) {}
        };
      }
    }
  }, [currentUnit, currentTopic, currentLevel, book]);

  // Available laboratories detection for current examples
  const availableLabs = useMemo(() => {
    if (typeof window === 'undefined') return {};
    (window as any).curUnit = currentUnit;
    (window as any).curTopicIdx = currentTopic;
    (window as any).curLevelIdx = currentLevel;
    (window as any).UNITS = book?.units || [];

    const map: Record<number, boolean> = {};
    examples.forEach((e: any, idx: number) => {
      try {
        const d = FZ.detectar ? FZ.detectar(e.q, e.ctx) : null;
        map[idx] = !!d || !!FZ.crear(e, 'ej');
      } catch {
        map[idx] = true;
      }
    });
    return map;
  }, [examples, currentUnit, currentTopic, currentLevel, book]);

  // Visual Laboratory toggle handler
  const toggleLab = (idx: number, e: any) => {
    const isOpening = !openLabs[idx];
    if (isOpening) {
      try {
        if (typeof window !== 'undefined') {
          (window as any).curUnit = currentUnit;
          (window as any).curTopicIdx = currentTopic;
          (window as any).curLevelIdx = currentLevel;
          (window as any).UNITS = book?.units || [];
        }
        const html = FZ.crear(e, 'ej');
        if (html) {
          setLabHtmls((prev) => ({ ...prev, [idx]: html }));
        }
      } catch (err) {
        console.warn('[FZ] Error creating lab:', err);
      }
      try {
        if (typeof window !== 'undefined' && typeof (window as any).fedor5Tono === 'function') {
          (window as any).fedor5Tono(580);
        }
      } catch (_) {}
    }
    setOpenLabs((prev) => ({ ...prev, [idx]: isOpening }));
  };

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
    setIsVideoModalOpen(true);
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
    <div className="w-full max-w-[1008px] mx-auto px-2 sm:px-3 py-2 select-none font-sans">
      <style jsx global>{`
        .f5nube {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 74px;
          height: 62px;
          background: #ffffff;
          border-radius: 40px 44px 36px 40px;
          box-shadow: -18px 6px 0 -6px #ffffff, 18px 6px 0 -6px #ffffff, 0 -12px 0 -4px #ffffff,
            0 6px 16px rgba(0, 0, 0, 0.18);
          margin-bottom: 4px;
        }
        .f5nube > * {
          position: relative;
          z-index: 1;
        }
        .f4vis {
          background: #ffffff !important;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          padding: 14px 12px;
          text-align: center;
          margin: 0.5rem 0;
          color: #1e293b;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .f4vis:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        }
        .f4result {
          font-size: 22px;
          font-weight: 900;
          color: #111;
          margin-top: 8px;
          padding-top: 6px;
          border-top: 2px dashed #ddd;
          font-family: 'Baloo 2', sans-serif;
        }
        .ej-explica-rica {
          margin-top: 0.5rem;
          padding: 0.7rem 0.8rem;
          background: #ffffff;
          color: #243b53;
          border-radius: 10px;
          border-left: 3px solid #f5c518;
          overflow-x: auto;
        }
        .ej-explica-rica .f4PasoAPaso {
          display: inline-block;
          font-size: 13px;
          font-weight: 900;
          color: #5c21a6;
          margin-bottom: 8px;
        }
        .ej-explica-rica .f4pasos-btn {
          display: inline-block;
          background: linear-gradient(135deg, #5c21a6, #7c3aed);
          color: #fff;
          border: 2px solid #f5c518;
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          margin-bottom: 10px;
          font-family: 'Nunito', sans-serif;
          transition: transform 0.15s;
        }
        .ej-explica-rica .f4pasos-btn:hover {
          transform: scale(1.05);
        }
        .f4-paso {
          margin: 2px 0;
          line-height: 1.55;
        }
        .f4-paso b {
          color: #5c21a6;
        }
      `}</style>

      {/* ══ 1. Top Link: Volver a temas ══ */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => goScreen('unit')}
          className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-[#6C28B4] hover:opacity-75 cursor-pointer transition-opacity select-none"
        >
          <span className="text-sm font-black leading-none">←</span>
          <span>Volver a temas</span>
        </button>
      </div>

      {/* ══ 2. Lesson Header & Multimedia Sub-Bar ══ */}
      <div className="mb-3">
        {/* Title with Blue 12 34 badge */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3B82F6] text-white font-black text-xs flex flex-col items-center justify-center leading-none shadow-xs shrink-0 select-none">
            <span className="tracking-tighter text-[10px]">12</span>
            <span className="tracking-tighter text-[10px]">34</span>
          </div>
          <h1
            className="text-xl sm:text-2xl font-black text-[#180D38] tracking-tight leading-snug"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            {topic?.title || 'Números Naturales Conteo y Posición'}
          </h1>
        </div>

        {/* Buttons Sub-Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Level Pill Badge */}
          <span
            className="px-3 py-1 rounded-xl font-black text-xs shrink-0 select-none"
            style={{ backgroundColor: theme.light, color: theme.lightTxt }}
          >
            {theme.short}
          </span>

          {/* Button: Ver video del tema */}
          <button
            type="button"
            onClick={handleOpenVideoTema}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs shadow-xs hover:scale-102 transition-transform cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #5C21A6, #8B3EDB)',
              color: '#FFE066',
              border: '1.5px solid #F5C518',
              fontFamily: "'Nunito', sans-serif",
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white font-black text-xs shadow-xs hover:scale-102 transition-transform cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #D4286A, #F054A0)',
              border: '1.5px solid #FFE066',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            <span>🎙️</span>
            <span>Escuchar</span>
          </button>

          {/* Button: Video del Nivel */}
          <button
            type="button"
            onClick={handleOpenVideoNivel}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white font-black text-xs shadow-xs hover:scale-102 transition-transform cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #0E6BA8, #38BDF8)',
              border: '1.5px solid #FFE066',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            <span>🎦</span>
            <span>Video del Nivel {currentLevel + 1}</span>
          </button>
        </div>
      </div>

      {/* ══ 3. Numbered Exercise Track Dots (#progTrack) ══ */}
      <div className="flex items-center gap-[5px] flex-wrap my-3.5" id="progTrack">
        {exercises.map((_, i) => {
          const isCurrent = !showingExamples && i === curExIndex;
          const isDone = answersLog[i] !== undefined;
          const isCorrect = answersLog[i]?.ok;

          let dotBg = '#E8E4F5';
          let dotBorder = '#DDD8F5';
          let dotColor = '#C5BFEE';

          if (isCurrent) {
            dotBg = '#6C28B4';
            dotBorder = '#6C28B4';
            dotColor = '#FFFFFF';
          } else if (isDone) {
            if (isCorrect) {
              dotBg = '#16876A';
              dotBorder = '#16876A';
              dotColor = '#FFFFFF';
            } else {
              dotBg = '#C94B22';
              dotBorder = '#C94B22';
              dotColor = '#FFFFFF';
            }
          }

          return (
            <div
              key={i}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black transition-all cursor-default select-none"
              style={{
                backgroundColor: dotBg,
                borderColor: dotBorder,
                borderWidth: '1.5px',
                borderStyle: 'solid',
                color: dotColor,
              }}
              title={`Ej.${i + 1}`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* ══ 4. MAIN CONTAINER: EXAMPLES PANEL OR PRACTICE ══ */}
      {showingExamples ? (
        <div
          style={{
            background: theme.grad,
            borderRadius: '22px',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,.3)',
            marginBottom: '1rem',
            position: 'relative',
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

          {/* HEADER */}
          <div style={{ padding: '1.5rem 1.25rem 1rem', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'inline-block',
                fontSize: '10px',
                fontWeight: 900,
                color: 'rgba(245,197,24,.8)',
                textTransform: 'uppercase',
                letterSpacing: '.12em',
                background: 'rgba(245,197,24,.15)',
                border: '1px solid rgba(245,197,24,.35)',
                padding: '3px 12px',
                borderRadius: '20px',
                marginBottom: '.75rem',
              }}
            >
              📖 Panel de Ejemplos · Método Fedor
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    fontSize: '22px',
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: '2px',
                  }}
                >
                  {theme.orb} {theme.headerTxt}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.65)' }}>
                  {theme.sub} · {topic?.title}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.5)', fontWeight: 700 }}>
                  EJERCICIOS
                </div>
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 900,
                    color: '#FF8C2A',
                    fontFamily: "'Baloo 2', sans-serif",
                  }}
                >
                  {exercises.length}
                </div>
              </div>
            </div>
          </div>

          {/* CHARACTERS (Inside .f5nube white clouds) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              padding: '0 1.25rem .75rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div className="f5nube">
                <span style={{ fontSize: '36px', lineHeight: 1 }} role="img" aria-label="Math">
                  🧑‍🚀
                </span>
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'rgba(255,255,255,.7)',
                  marginTop: '4px',
                }}
              >
                Math
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="f5nube">
                <span style={{ fontSize: '36px', lineHeight: 1 }} role="img" aria-label="Sumy">
                  👩‍🚀
                </span>
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'rgba(255,255,255,.7)',
                  marginTop: '4px',
                }}
              >
                Sumy
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="f5nube">
                <span style={{ fontSize: '36px', lineHeight: 1 }} role="img" aria-label="Jack">
                  👦
                </span>
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'rgba(255,255,255,.7)',
                  marginTop: '4px',
                }}
              >
                Jack
              </div>
            </div>
          </div>

          {/* CONCEPT */}
          <div
            style={{
              margin: '0 1.25rem .75rem',
              padding: '.85rem 1rem',
              background: 'rgba(255,255,255,.1)',
              borderRadius: '14px',
              borderLeft: `4px solid ${theme.accent}`,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,.9)',
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              {topic?.std || 'Aplica el método paso a paso.'}
            </div>
            {topic?.teach && (
              <div
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,.95)',
                  fontWeight: 600,
                  lineHeight: 1.6,
                  marginTop: '.5rem',
                }}
                dangerouslySetInnerHTML={{ __html: topic.teach }}
              />
            )}
            {topic?.formula && (
              <div
                style={{
                  display: 'inline-block',
                  marginTop: '.5rem',
                  padding: '.3rem .65rem',
                  background: 'rgba(255,255,255,.18)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '.02em',
                }}
              >
                🧠 {topic.formula}
              </div>
            )}
          </div>

          {/* EXAMPLE CARDS */}
          <div style={{ padding: '0 1.25rem .5rem', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 900,
                color: 'rgba(255,255,255,.6)',
                textTransform: 'uppercase',
                letterSpacing: '.1em',
                marginBottom: '.65rem',
              }}
            >
              ✨ {examples.length} Ejemplos resueltos
            </div>

            {examples.map((e: any, i: number) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,.12)',
                  border: '1px solid rgba(255,255,255,.2)',
                  borderRadius: '16px',
                  padding: '1rem',
                  marginBottom: '.65rem',
                  position: 'relative',
                }}
              >
                {/* Top Row: Icon + Question + Answer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: e.vis ? '.5rem' : '0',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0,
                    }}
                  >
                    {e.icon || '🔁'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: 'rgba(255,255,255,.9)',
                        lineHeight: 1.45,
                      }}
                    >
                      {e.q}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 900,
                      color: '#FFE066',
                      background: 'rgba(245,197,24,.2)',
                      border: '1px solid rgba(245,197,24,.4)',
                      padding: '4px 12px',
                      borderRadius: '10px',
                      flexShrink: 0,
                      fontFamily: "'Baloo 2', sans-serif",
                    }}
                  >
                    {e.a}
                  </div>
                </div>

                {/* Visual */}
                {e.vis && (
                  <div
                    className={e.vis.includes('f4vis') ? '' : 'f4vis'}
                    dangerouslySetInnerHTML={{ __html: e.vis }}
                  />
                )}

                {/* Explain */}
                {e.explain && (
                  <div
                    className="ej-explica-rica"
                    dangerouslySetInnerHTML={{ __html: e.explain }}
                  />
                )}

                {/* Orange Visual Laboratory Button & Unfolded Lab Container */}
                {availableLabs[i] && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => toggleLab(i, e)}
                      className="fz-btn o"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #FF8C2A, #E8650A)',
                        color: '#FFFFFF',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 900,
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        boxShadow: '0 3px 10px rgba(232, 101, 10, 0.35)',
                        transition: 'all 0.18s ease',
                      }}
                      onMouseEnter={(ev) => (ev.currentTarget.style.filter = 'brightness(1.1)')}
                      onMouseLeave={(ev) => (ev.currentTarget.style.filter = 'none')}
                    >
                      <span>{openLabs[i] ? '✖' : '🎮'}</span>
                      <span>{openLabs[i] ? 'Cerrar laboratorio' : 'Explorar con el laboratorio visual'}</span>
                    </button>

                    {/* Interactive Visual Laboratory */}
                    {openLabs[i] && labHtmls[i] && (
                      <div
                        style={{ marginTop: '0.75rem' }}
                        dangerouslySetInnerHTML={{ __html: labHtmls[i] }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* START BUTTON */}
          <div style={{ padding: '.75rem 1.25rem 1.5rem', position: 'relative', zIndex: 1 }}>
            <button
              type="button"
              onClick={() => setShowingExamples(false)}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 900,
                background: 'linear-gradient(135deg,#F5C518,#FF8C2A)',
                color: '#2A0F60',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                letterSpacing: '.03em',
                boxShadow: '0 6px 20px rgba(245,197,24,.45)',
                transition: 'all .2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🚀 ¡Empezar ejercicios!
            </button>
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

      {/* Fedor Video Animated Modal */}
      <FedorVideoModal5to
        isOpen={isVideoModalOpen}
        topicTitle={topic?.title || 'Números Naturales Conteo y Posición'}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {/* Global styles for visual laboratories */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .fz {
              margin: 12px 0 14px;
              border-radius: 20px;
              background: linear-gradient(160deg, #F8F5FF, #EEF7FF);
              border: 2.5px solid #D9CCFF;
              box-shadow: 0 8px 22px rgba(60, 20, 120, 0.10);
              overflow: hidden;
              font-family: 'Nunito', sans-serif;
              color: #1A1033;
              text-align: left;
            }
            .fz-h {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 12px;
              background: linear-gradient(90deg, var(--fz1, #5C21A6), var(--fz2, #8B3EDB));
              color: #fff;
            }
            .fz-h, .fz-h *, .tm-body .fz-h .t, .tm-body .fz-h small {
              color: #FFFFFF !important;
            }
            .fz-h .t {
              flex: 1;
              font-family: 'Baloo 2', 'Nunito', sans-serif;
              font-weight: 900;
              font-size: 15px;
              letter-spacing: 0.01em;
            }
            .fz-h .t small {
              font-family: 'Nunito', sans-serif;
              font-weight: 800;
              font-size: 11px;
              opacity: 0.85;
              margin-left: 6px;
            }
            .fz-h button {
              background: rgba(255, 255, 255, 0.2);
              border: 1.5px solid rgba(255, 255, 255, 0.45);
              color: #fff;
              border-radius: 10px;
              padding: 3px 10px;
              font-weight: 900;
              cursor: pointer;
              font-family: 'Nunito', sans-serif;
              transition: transform 0.15s ease;
            }
            .fz-h button:hover {
              transform: scale(1.08);
            }
            .fz-b {
              padding: 12px;
              overflow-x: auto;
            }
            .fz.min .fz-b, .fz.min .fz-f {
              display: none;
            }
            .fz-f {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              padding: 0 12px 12px;
              align-items: center;
            }
            .fz-btn {
              border: none;
              border-radius: 12px;
              padding: 8px 13px;
              font-weight: 900;
              font-size: 13px;
              cursor: pointer;
              font-family: 'Nunito', sans-serif;
              color: #fff;
              background: linear-gradient(135deg, #5C21A6, #8B3EDB);
              box-shadow: 0 3px 10px rgba(92, 33, 166, 0.3);
              transition: transform 0.12s;
            }
            .fz-btn:hover {
              transform: translateY(-2px);
            }
            .fz-btn.o {
              background: linear-gradient(135deg, #FF8C2A, #E8650A);
            }
            .fz-btn.g {
              background: linear-gradient(135deg, #16876A, #24C496);
            }
            .fz-btn.b {
              background: linear-gradient(135deg, #0E6BA8, #38BDF8);
            }
            .fz-btn.w {
              background: #FFFFFF;
              color: #5C21A6;
              border: 2px solid #C5BFEE;
              box-shadow: none;
            }
            .fz-btn.on {
              outline: 3px solid #FFE066;
            }
            .fz-msg {
              font-weight: 900;
              font-size: 14px;
              color: #3D1468;
              padding: 6px 10px;
              background: #FFFFFF;
              border-radius: 12px;
              border: 2px dashed #C5BFEE;
              min-height: 20px;
              display: inline-flex;
              align-items: center;
            }
            .fz-tip {
              font-size: 12px;
              font-weight: 800;
              color: #6B5E8A;
              margin-top: 8px;
            }
            .fz-svg {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0 auto;
            }
          `,
        }}
      />
    </div>
  );
}

