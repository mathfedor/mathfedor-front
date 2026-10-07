'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useBook4 } from '../context/Book4Context';
import { bookService } from '@/services/book.service';
import type { LevelExample } from '@/types/book.types';
import Swal from 'sweetalert2';
import topicPedagogyData from '../shared/topic-pedagogy-4to.json';
import { FZ } from '../shared/fedor-visual-lab-engine';
import { recordDailyMissionProgress } from '../shared/DailyMissionCard4to';

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
  light: string;
  lightTxt: string;
  short: string;
}

const LEVEL_THEMES_4TO: LevelThemeMeta4to[] = [
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

function getTopicPedagogy(title?: string): { teach?: string; formula?: string } | null {
  if (!title) return null;
  const pedMap = topicPedagogyData as Record<string, { teach?: string; formula?: string }>;
  if (pedMap[title]) return pedMap[title];
  const tNorm = title.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, '');
  for (const [key, val] of Object.entries(pedMap)) {
    const kNorm = key.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, '');
    if (tNorm.includes(kNorm) || kNorm.includes(tNorm) || (tNorm.includes('naturales') && kNorm.includes('naturales'))) {
      return val;
    }
  }
  return null;
}

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

  const primaryKey = `u${currentUnit}t${currentTopic}-n${currentLevel + 1}`;
  const secondaryKey = topic?.id ? `${topic.id}-n${currentLevel + 1}` : primaryKey;
  const theme = LEVEL_THEMES_4TO[currentLevel] || LEVEL_THEMES_4TO[0];

  const pedagogy = getTopicPedagogy(topic?.title);
  const teachText = pedagogy?.teach || topic?.desc;
  const formulaText = pedagogy?.formula;

  // Examples state
  const [examples, setExamples] = useState<LevelExample[]>([]);
  const [showingExamples, setShowingExamples] = useState(true);

  // Visual Labs state
  const [openLabs, setOpenLabs] = useState<Record<number, boolean>>({});
  const [labHtmls, setLabHtmls] = useState<Record<number, string>>({});
  const [zoomLevels, setZoomLevels] = useState<Record<number, number>>({});

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

  // Background twinkling stars
  const stars = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      top: `${(i * 17 + 7) % 92}%`,
      left: `${(i * 29 + 13) % 94}%`,
      size: (i % 3) + 2,
      opacity: 0.35 + (i % 5) * 0.12,
      delay: `${(i * 0.3) % 3}s`,
    }));
  }, []);

  useEffect(() => {
    isAnsweredRef.current = isAnswered;
  }, [isAnswered]);

  // Synchronize globals for FZ engine
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).FZ = FZ;
      (window as any).curUnit = currentUnit;
      (window as any).curTopicIdx = currentTopic;
      (window as any).curLevelIdx = currentLevel;
      (window as any).UNITS = book?.units || [];
    }
    setOpenLabs({});
    setLabHtmls({});
    setZoomLevels({});
  }, [currentUnit, currentTopic, currentLevel, book]);

  // Load level examples
  useEffect(() => {
    let exList = bookService.getExamplesSync(primaryKey, 'matematicas-fedor-4');
    if (!exList || exList.length === 0) {
      exList = bookService.getExamplesSync(secondaryKey, 'matematicas-fedor-4');
    }
    setExamples(exList || []);
    setShowingExamples(true);
    setCurExIndex(0);
    setAnswersLog([]);
    setFeedback(null);
  }, [primaryKey, secondaryKey]);

  // Timer per question in solving mode
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

    if (isCorrect) {
      recordDailyMissionProgress('correct', 1);
    }

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

    saveLessonScore(primaryKey, pct, xp, c, s, {
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
    utter.lang = 'es-ES';
    utter.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) =>
        v.lang.startsWith('es') &&
        (v.name.toLowerCase().includes('sabina') ||
          v.name.toLowerCase().includes('monica') ||
          v.name.toLowerCase().includes('paulina') ||
          v.name.toLowerCase().includes('helena') ||
          v.name.toLowerCase().includes('laura') ||
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('maria'))
    );
    if (femaleVoice) utter.voice = femaleVoice;
    window.speechSynthesis.speak(utter);
  };

  const handleOpenTopicVideo = () => {
    Swal.fire({
      title: `🎬 Video: ${topic?.title}`,
      html: `
        <div style="text-align:center;padding:8px">
          <div style="font-size:46px;margin-bottom:10px">🪐 🚀</div>
          <p style="font-size:14.5px;color:#1E293B;line-height:1.6">
            <b>${topic?.title}</b><br/>
            ${teachText ? teachText.replace(/<[^>]*>/g, '') : 'Aprende los conceptos paso a paso con las animaciones guiadas de Matemáticas de Fedor.'}
          </p>
          <div style="margin-top:14px;display:inline-block;padding:8px 16px;background:#EDE9FE;border-radius:12px;color:#6D28D9;font-weight:800;font-size:12.5px">
            ✨ Reproductor conceptual interactivo en HD
          </div>
        </div>
      `,
      confirmButtonText: '¡Entendido!',
      confirmButtonColor: '#7B2FBE',
    });
  };

  const handleOpenLevelVideo = () => {
    Swal.fire({
      title: `🎞️ Video del Nivel ${currentLevel + 1}: ${theme.headerTxt}`,
      html: `
        <div style="text-align:center;padding:8px">
          <div style="font-size:46px;margin-bottom:10px">⚡ 🎓</div>
          <p style="font-size:14.5px;color:#1E293B;line-height:1.6">
            <b>${theme.headerTxt}</b><br/>
            ${theme.sub} para <b>${topic?.title}</b>.
          </p>
          <div style="margin-top:14px;display:inline-block;padding:8px 16px;background:#E0F2FE;border-radius:12px;color:#0369A1;font-weight:800;font-size:12.5px">
            ✨ Demostración guiada con ${examples.length} ejemplos resueltos
          </div>
        </div>
      `,
      confirmButtonText: '¡Genial!',
      confirmButtonColor: '#0E6BA8',
    });
  };

  // Zoom controls logic
  const handleZoom = (idx: number, delta: number) => {
    setZoomLevels((prev) => {
      const cur = prev[idx] || 100;
      const stepIdx = ZOOM_STEPS.indexOf(cur);
      const nextIdx = Math.max(0, Math.min(ZOOM_STEPS.length - 1, (stepIdx === -1 ? 1 : stepIdx) + delta));
      return { ...prev, [idx]: ZOOM_STEPS[nextIdx] };
    });
  };

  const handleEnlarge = (visHtml: string) => {
    Swal.fire({
      title: '🔍 Figura ampliada',
      html: `
        <div style="zoom: 1.8; display: flex; justify-content: center; overflow: auto; max-height: 60vh; padding: 10px;">
          ${visHtml}
        </div>
        <div style="font-size: 12px; font-weight: 800; color: #6B5E8A; margin-top: 12px; text-align: center;">
          Toca partes de la figura para resaltarlas
        </div>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#5C21A6',
      width: '900px',
    });
  };

  // Visual Laboratory toggle logic
  const toggleLab = (idx: number, e: LevelExample) => {
    if (!labHtmls[idx]) {
      try {
        if (typeof window !== 'undefined') {
          (window as any).curUnit = currentUnit;
          (window as any).curTopicIdx = currentTopic;
          (window as any).curLevelIdx = currentLevel;
        }
        const html = FZ.crear(e, 'ej');
        if (html) {
          setLabHtmls((prev) => ({ ...prev, [idx]: html }));
        }
      } catch (err) {
        console.warn('[FZ] Error creating lab:', err);
      }
    }
    setOpenLabs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const hasLab = (e: LevelExample) => {
    try {
      if (typeof window !== 'undefined') {
        (window as any).curUnit = currentUnit;
        (window as any).curTopicIdx = currentTopic;
        (window as any).curLevelIdx = currentLevel;
      }
      return !!FZ.crear(e, 'ej');
    } catch {
      return false;
    }
  };

  if (!level) return null;

  return (
    <div className="w-full max-w-[1008px] mx-auto px-3 sm:px-4 py-2 select-none font-sans">
      <style>{`
        .f5nube {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 74px;
          height: 62px;
          background: #FFFFFF;
          border-radius: 40px 44px 36px 40px;
          box-shadow: -18px 6px 0 -6px #FFFFFF, 18px 6px 0 -6px #FFFFFF, 0 -12px 0 -4px #FFFFFF, 0 6px 16px rgba(0,0,0,0.18);
          margin-bottom: 4px;
        }
        .f5nube > * {
          position: relative;
          z-index: 1;
        }
        .f4vis {
          transition: transform .25s ease, box-shadow .25s ease;
          background: #FFFFFF !important;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 14px 12px;
          text-align: center;
          color: #180D38;
        }
        .f4vis:hover {
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
        }
        .f4result {
          font-size: 22px;
          font-weight: 900;
          color: #111;
          margin-top: 8px;
          padding-top: 6px;
          border-top: 2px dashed #DDD;
        }
        .pt-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #E8E4F5;
          border: 1.5px solid #DDD8F5;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 900;
          color: #8E87C8;
          cursor: pointer;
          transition: all .2s;
          user-select: none;
        }
        .pt-dot.done {
          background: #24C496;
          border-color: #24C496;
          color: #FFFFFF;
        }
        .pt-dot.wrong {
          background: #EF4444;
          border-color: #EF4444;
          color: #FFFFFF;
        }
        .pt-dot.active {
          background: #8B3EDB;
          border-color: #8B3EDB;
          color: #FFFFFF;
          transform: scale(1.15);
          box-shadow: 0 0 10px rgba(139, 62, 219, 0.45);
        }

        /* ── Laboratorio Visual FZ ── */
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
        .fz.min .fz-b, .fz.min .fz-f {
          display: none !important;
        }
        .fz-h {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: linear-gradient(90deg, var(--fz1, #5C21A6), var(--fz2, #8B3EDB));
          color: #FFFFFF !important;
        }
        .fz-h .t {
          flex: 1;
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 15px;
          letter-spacing: .01em;
          color: #FFFFFF !important;
        }
        .fz-h .t small {
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 11px;
          opacity: .9;
          margin-left: 6px;
          color: #FFFFFF !important;
        }
        .fz-h button {
          background: rgba(255, 255, 255, 0.2);
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          color: #FFFFFF !important;
          border-radius: 10px;
          padding: 3px 10px;
          font-weight: 900;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
        }
        .fz-b {
          padding: 14px;
          overflow-x: auto;
        }
        .fz-f {
          padding: 10px 14px;
          background: #FFFFFF;
          border-top: 1.5px solid #E8E0FB;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .fz-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 12px;
          border: none;
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 13px;
          cursor: pointer;
          transition: all .15s;
          color: #FFFFFF;
        }
        .fz-btn.o {
          background: linear-gradient(135deg, #E8650A, #FF8C2A);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(232, 101, 10, .35);
        }
        .fz-btn.g {
          background: linear-gradient(135deg, #059669, #10B981);
          color: #FFFFFF;
          box-shadow: 0 3px 10px rgba(5, 150, 105, .3);
        }
        .fz-msg {
          font-weight: 900;
          font-size: 13px;
          color: #3D1468;
          padding: 6px 12px;
          background: #FFFFFF;
          border-radius: 12px;
          border: 2px dashed #C5BFEE;
          display: inline-block;
        }
        .fz-tip {
          font-size: 12px;
          font-weight: 800;
          color: #6B5E8A;
          margin-top: 8px;
        }
        .fz-svg {
          display: block;
          margin: 0 auto;
          max-width: 100%;
          height: auto;
        }

        /* ── Barra de Zoom (.fzq-barra) ── */
        .fzq-barra {
          display: flex;
          gap: 4px;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
        }
        .fzq-b {
          border: none;
          border-radius: 9px;
          padding: 4px 10px;
          font-weight: 900;
          font-size: 12px;
          line-height: 1;
          cursor: pointer;
          background: #5C21A6;
          color: #FFFFFF;
          font-family: 'Nunito', sans-serif;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
          transition: background 0.15s;
        }
        .fzq-b:hover {
          background: #7C3FCC;
        }
        .fzq-nivel {
          border: 1.5px solid #C5BFEE;
          cursor: default;
          font-family: 'Nunito', sans-serif;
          font-size: 11px;
          font-weight: 900;
          color: #5C21A6;
          background: #F0EDFF;
          border-radius: 8px;
          padding: 3px 8px;
          min-width: 40px;
          text-align: center;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>

      {/* ══ 1. Back Navigation ══ */}
      <div style={{ marginBottom: '8px' }}>
        <button
          type="button"
          onClick={() => goScreen('unit')}
          style={{
            color: '#7B2FBE',
            fontSize: '13px',
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

      {/* ══ 2. Topic Header & Actions Row (.les-top) ══ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '1rem',
        }}
      >
        <div>
          {/* Topic Title with Icon */}
          <div
            style={{
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontSize: '20px',
              fontWeight: 900,
              color: '#180D38',
              lineHeight: 1.25,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{topic?.icon || '🔢'}</span>
            <span>{topic?.title || 'Tema de 4° Grado'}</span>
          </div>

          {/* Action Pills & Buttons under Title */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
            {/* Level Pill */}
            <span
              style={{
                background: theme.accent,
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 900,
                padding: '4px 10px',
                borderRadius: '12px',
                display: 'inline-block',
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {theme.short || `N${currentLevel + 1}`}
            </span>

            {/* Ver video del tema */}
            <button
              type="button"
              onClick={handleOpenTopicVideo}
              style={{
                background: 'linear-gradient(135deg, #5C21A6, #8B3EDB)',
                color: '#FFE066',
                border: '1.5px solid #FFE066',
                borderRadius: '14px',
                fontWeight: 900,
                fontSize: '12px',
                padding: '6px 14px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(92, 33, 166, 0.2)',
              }}
            >
              <span>🎬</span>
              <span>Ver video del tema</span>
            </button>

            {/* Escuchar */}
            <button
              type="button"
              onClick={() => speak(`Tema: ${topic?.title}. ${teachText || ''}`)}
              style={{
                background: 'linear-gradient(135deg, #D4286A, #F054A0)',
                color: '#FFFFFF',
                border: '1.5px solid #FFE066',
                borderRadius: '14px',
                fontWeight: 900,
                fontSize: '12px',
                padding: '6px 14px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(212, 40, 106, 0.2)',
              }}
            >
              <span>🎙️</span>
              <span>Escuchar</span>
            </button>

            {/* Video del Nivel */}
            <button
              type="button"
              onClick={handleOpenLevelVideo}
              style={{
                background: 'linear-gradient(135deg, #0E6BA8, #38BDF8)',
                color: '#FFFFFF',
                border: '1.5px solid #FFE066',
                borderRadius: '14px',
                fontWeight: 900,
                fontSize: '12px',
                padding: '6px 14px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(14, 107, 168, 0.2)',
              }}
            >
              <span>🎞️</span>
              <span>Video del {theme.short || `Nivel ${currentLevel + 1}`}</span>
            </button>
          </div>
        </div>

        {/* Right side: Voz Femenina button */}
        <button
          type="button"
          onClick={() => speak(`Voz femenina activada. Tema: ${topic?.title}. ${teachText || ''}`)}
          title="Voz Femenina · lee el ejemplo o el ejercicio que está en pantalla"
          style={{
            background: '#FFFFFF',
            border: '2px solid rgba(108, 40, 180, 0.35)',
            borderRadius: '14px',
            color: '#1A5FA5',
            fontWeight: 900,
            fontSize: '12px',
            padding: '7px 14px',
            cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif",
            boxShadow: '0 4px 12px rgba(44, 16, 112, 0.18)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ fontSize: '15px' }}>🎙️</span>
          <span>Voz Femenina</span>
        </button>
      </div>

      {/* ══ 3. Exercise Bubbles Track (#progTrack) ══ */}
      <div
        id="progTrack"
        style={{
          display: 'flex',
          gap: '5px',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: exercises.length || 21 }).map((_, i) => {
          const logItem = answersLog[i];
          let cls = 'pt-dot';
          if (!showingExamples) {
            if (i < curExIndex) {
              cls += logItem?.ok ? ' done' : ' wrong';
            } else if (i === curExIndex) {
              cls += ' active';
            }
          }

          return (
            <div
              key={i}
              className={cls}
              title={`Ejercicio ${i + 1}`}
              onClick={() => {
                if (!showingExamples) {
                  setCurExIndex(i);
                }
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* ══ 4. MAIN PANEL: PANEL DE EJEMPLOS DIDÁCTICOS (4° Grado) ══ */}
      {showingExamples ? (
        <div
          style={{
            background: theme.grad,
            borderRadius: '22px',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
            marginBottom: '1rem',
            position: 'relative',
            color: '#FFFFFF',
          }}
        >
          {/* Starfield background */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {stars.map((s) => (
              <div
                key={s.id}
                style={{
                  position: 'absolute',
                  top: s.top,
                  left: s.left,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  opacity: s.opacity,
                  boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
                  animation: `twinkle 2.5s infinite ease-in-out ${s.delay}`,
                }}
              />
            ))}
          </div>

          {/* Header */}
          <div style={{ padding: '1.5rem 1.25rem 1rem', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'inline-block',
                fontSize: '10px',
                fontWeight: 900,
                color: 'rgba(245, 197, 24, 0.9)',
                textTransform: 'uppercase',
                letterSpacing: '.12em',
                background: 'rgba(245, 197, 24, 0.15)',
                border: '1px solid rgba(245, 197, 24, 0.35)',
                padding: '3px 12px',
                borderRadius: '20px',
                marginBottom: '0.75rem',
              }}
            >
              💻 PANEL DE EJEMPLOS · MÉTODO FEDOR
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
                    color: '#FFFFFF',
                    marginBottom: '2px',
                  }}
                >
                  {theme.headerTxt}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  {theme.sub} · {topic?.title}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 700, letterSpacing: '0.05em' }}>
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
                  {exercises.length || 21}
                </div>
              </div>
            </div>
          </div>

          {/* Characters in Puffy Clouds */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              padding: '0 1.25rem 0.75rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {[
              { e: '🧑‍🚀', n: 'Math' },
              { e: '👩‍🚀', n: 'Sumy' },
              { e: '👦', n: 'Jack' },
            ].map((ch, i) => (
              <div
                key={ch.n}
                style={{
                  textAlign: 'center',
                  animation: `popIn .4s ease ${i * 0.1}s both`,
                }}
              >
                <div className="f5nube">
                  <div style={{ fontSize: '38px', animation: `float ${3 + i * 0.4}s ease-in-out infinite` }}>
                    {ch.e}
                  </div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                  {ch.n}
                </div>
              </div>
            ))}
          </div>

          {/* Concept Box */}
          <div
            style={{
              margin: '0 1.25rem 0.85rem',
              padding: '0.85rem 1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              borderLeft: `4px solid ${theme.accent}`,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700, lineHeight: 1.6 }}>
              Aplica el método paso a paso.
            </div>
            {teachText && (
              <div
                style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 600, lineHeight: 1.6, marginTop: '0.5rem' }}
                dangerouslySetInnerHTML={{ __html: teachText }}
              />
            )}
            {formulaText && (
              <div
                style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  padding: '0.3rem 0.65rem',
                  background: 'rgba(255, 255, 255, 0.18)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '.02em',
                }}
              >
                🧬 <span dangerouslySetInnerHTML={{ __html: formulaText }} />
              </div>
            )}
          </div>

          {/* Example Cards List */}
          <div style={{ padding: '0 1.25rem 0.5rem', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 900,
                color: 'rgba(255, 255, 255, 0.65)',
                textTransform: 'uppercase',
                letterSpacing: '.1em',
                marginBottom: '0.65rem',
              }}
            >
              ✨ {examples.length} EJEMPLOS RESUELTOS
            </div>

            {examples.map((e, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '1rem',
                  marginBottom: '0.65rem',
                  position: 'relative',
                }}
              >
                {/* Header row with question, answer and voice button */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: e.vis ? '0.5rem' : '0' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.2)',
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
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.45 }}>
                      {e.q}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 900,
                        color: '#FFE066',
                        background: 'rgba(245, 197, 24, 0.2)',
                        border: '1px solid rgba(245, 197, 24, 0.4)',
                        padding: '4px 12px',
                        borderRadius: '10px',
                        fontFamily: "'Baloo 2', sans-serif",
                      }}
                    >
                      {e.a}
                    </div>

                    <button
                      type="button"
                      onClick={() => speak(`${e.q}. Respuesta: ${e.a}`)}
                      title="Escuchar este ejemplo"
                      style={{
                        background: '#FFFFFF',
                        border: '1.5px solid rgba(108, 40, 180, 0.3)',
                        borderRadius: '10px',
                        padding: '4px 8px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      🎙️
                    </button>
                  </div>
                </div>

                {/* Visual representation with Zoom Bar */}
                {e.vis && (
                  <div style={{ margin: '0.5rem 0', textAlign: 'center' }}>
                    <div
                      style={{
                        padding: '0.2rem',
                        background: 'transparent',
                        borderRadius: '12px',
                        transform: `scale(${(zoomLevels[idx] || 100) / 100})`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.2s ease',
                      }}
                      dangerouslySetInnerHTML={{ __html: e.vis }}
                    />

                    {/* Zoom bar directly beneath vis */}
                    <div className="fzq-barra">
                      <button
                        type="button"
                        onClick={() => handleZoom(idx, -1)}
                        className="fzq-b"
                        title="Reducir el dibujo"
                      >
                        ➖
                      </button>
                      <span className="fzq-nivel">
                        {zoomLevels[idx] || 100}%
                      </span>
                      <button
                        type="button"
                        onClick={() => handleZoom(idx, 1)}
                        className="fzq-b"
                        title="Agrandar el dibujo"
                      >
                        ➕
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEnlarge(e.vis || '')}
                        className="fzq-b"
                        title="Ampliar la figura"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span>🔍</span>
                        <span>Ampliar</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Explanation ("Ver paso a paso"): directly visible, NOT collapsed! */}
                {e.explain && (
                  <div
                    className="ej-explica-rica f4-explain-wrap"
                    style={{
                      marginTop: '0.65rem',
                      padding: '0.75rem 1rem',
                      background: '#FFFFFF',
                      color: '#1E293B',
                      borderRadius: '12px',
                      borderLeft: '4px solid #F5C518',
                      fontSize: '12.5px',
                      lineHeight: 1.55,
                      overflowX: 'auto',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                    dangerouslySetInnerHTML={{ __html: e.explain }}
                  />
                )}

                {/* Orange Visual Laboratory Button & Unfolded Lab Container */}
                {hasLab(e) && (
                  <div style={{ marginTop: '0.65rem' }}>
                    <button
                      type="button"
                      onClick={() => toggleLab(idx, e)}
                      className="fz-btn o"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #E8650A, #FF8C2A)',
                        color: '#FFFFFF',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 900,
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(232, 101, 10, 0.35)',
                        transition: 'all 0.18s ease',
                      }}
                      onMouseEnter={(ev) => (ev.currentTarget.style.filter = 'brightness(1.1)')}
                      onMouseLeave={(ev) => (ev.currentTarget.style.filter = 'none')}
                    >
                      <span>{openLabs[idx] ? '✖' : '🎮'}</span>
                      <span>{openLabs[idx] ? 'Cerrar laboratorio' : 'Explorar con el laboratorio visual'}</span>
                    </button>

                    {/* Interactive Visual Laboratory */}
                    {openLabs[idx] && labHtmls[idx] && (
                      <div
                        style={{ marginTop: '0.75rem' }}
                        dangerouslySetInnerHTML={{ __html: labHtmls[idx] }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Action CTA Button */}
          <div style={{ padding: '0.75rem 1.25rem 1.5rem', position: 'relative', zIndex: 1 }}>
            <button
              type="button"
              onClick={() => setShowingExamples(false)}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #F5C518, #FF8C2A)',
                color: '#2A0F60',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                letterSpacing: '.03em',
                boxShadow: '0 6px 20px rgba(245, 197, 24, 0.45)',
                transition: 'all .2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
            >
              🎮 ¡Empezar {exercises.length || 21} ejercicios!
            </button>
          </div>
        </div>
      ) : (
        /* ══ 5. EXERCISE PRACTICE MODE CON TEMPORIZADOR ══ */
        <div className="w-full">
          {/* Top Toolbar: Switch to examples & Timer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <button
              type="button"
              onClick={() => setShowingExamples(true)}
              style={{
                padding: '6px 14px',
                borderRadius: '12px',
                background: '#FFFFFF',
                color: '#6C28B4',
                border: '1.5px solid #C5BFEE',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              }}
            >
              <span>📖</span>
              <span>Ver ejemplos explicados</span>
            </button>

            {/* Per-question timer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: timerSeconds <= 10 ? '#FEE2E2' : '#FFFFFF',
                border: timerSeconds <= 10 ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                borderRadius: '12px',
                padding: '5px 14px',
                fontWeight: 900,
                fontSize: '13px',
                color: timerSeconds <= 10 ? '#B91C1C' : '#334155',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
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
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '1.75rem',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span
                  style={{
                    background: theme.badgeBg,
                    color: theme.badgeColor,
                    fontSize: '11px',
                    fontWeight: 900,
                    padding: '4px 10px',
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
                    width: '30px',
                    height: '30px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '10px',
                    marginTop: '12px',
                  }}
                >
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
                      color: '#FFFFFF',
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
  );
}
