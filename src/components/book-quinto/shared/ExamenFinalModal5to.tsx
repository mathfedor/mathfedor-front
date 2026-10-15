'use client';

import React, { useState, useEffect } from 'react';
import { useBook5 } from '../context/Book5Context';
import examDataRaw from './examen5to-data.json';
import { FZ } from './fedor-visual-lab-engine-5to';

interface ExamenFinalModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FinalExamQuestion {
  id: number;
  unit: string;
  cat: string;
  ctx: string;
  q: string;
  opts: string[];
  ans: string;
  hint?: string;
  hasModel?: boolean;
}

const EXAM_POOL_5TO = examDataRaw as FinalExamQuestion[];

export const PERIMETER_HERO_QUESTION: FinalExamQuestion = {
  id: 59246,
  unit: 'Unidad 14 — Geometría y Medición · Perímetro y Área',
  cat: 'Perímetro',
  ctx: 'Jack lleva las cuentas de la tienda. En el tema "Perímetro" resuelve:',
  q: '¿Cuál es el perímetro de un rectángulo de 77 m × 86 m?',
  opts: ['321', '336', '326', '331'],
  ans: '326',
  hint: 'Perímetro = suma de todos los 4 lados: 77 + 86 + 77 + 86 = 326.',
  hasModel: true,
};

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ExamenFinalModal5to({ isOpen, onClose }: ExamenFinalModal5toProps) {
  const { book, updateStats } = useBook5();

  const [inExam, setInExam] = useState<boolean>(false);
  const [examQuestions, setExamQuestions] = useState<FinalExamQuestion[]>([]);
  const [qIndex, setQIndex] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [fzHtml, setFzHtml] = useState<string>('');
  const [showProceso, setShowProceso] = useState<boolean>(false);

  // Estadísticas acumuladas en localStorage (K_FINAL: fedor5_examen_final)
  const [stats, setStats] = useState<{ aprobados: number; mejor: number; intentos: number }>({
    aprobados: 0,
    mejor: 0,
    intentos: 0,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fedor5_examen_final') || localStorage.getItem('fedor5_final_stats');
      if (saved) {
        setStats(JSON.parse(saved));
      }
    } catch {}
  }, [isOpen]);

  // Manejo de la tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (inExam) {
          setInExam(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, inExam, onClose]);

  const playTono = (freq = 520, duration = 0.15) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      }
    } catch {}
  };

  const hablar = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-CO';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    } catch {}
  };

  // Obtener preguntas dinámicas de las unidades de 5° grado
  const getCurriculumQuestions = (): FinalExamQuestion[] => {
    const pool: FinalExamQuestion[] = [];
    if (book && Array.isArray(book.units)) {
      book.units.forEach((u) => {
        if (Array.isArray(u.topics)) {
          u.topics.forEach((t) => {
            if (Array.isArray(t.levels)) {
              t.levels.forEach((l) => {
                if (Array.isArray(l.exercises)) {
                  l.exercises.forEach((ex: any) => {
                    if (
                      ex &&
                      ex.type === 'mcq' &&
                      Array.isArray(ex.opts) &&
                      ex.opts.length === 4 &&
                      ex.ans !== undefined &&
                      ex.q !== PERIMETER_HERO_QUESTION.q
                    ) {
                      pool.push({
                        id: ex.id || Math.random(),
                        unit: u.name || u.short || 'Unidad',
                        cat: t.title ? t.title.replace(/^[^\wáéíóúñÁÉÍÓÚÑ]+/i, '').trim() : 'Matemáticas',
                        ctx: ex.ctx || '',
                        q: ex.q,
                        opts: ex.opts,
                        ans: String(ex.ans).trim(),
                        hint: ex.hint || '',
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }

    if (pool.length < 24) {
      EXAM_POOL_5TO.forEach((q) => {
        if (q.q !== PERIMETER_HERO_QUESTION.q) {
          pool.push(q);
        }
      });
    }

    return pool;
  };

  const handleStartExam = () => {
    const otherPool = shuffleArray(getCurriculumQuestions());
    // Colocamos la pregunta hero en la posición 1 (exacta al screenshot) y completamos a 25 preguntas
    const selected = [PERIMETER_HERO_QUESTION, ...otherPool.slice(0, 24)];
    setExamQuestions(selected);
    setQIndex(0);
    setSelectedOpt(null);
    setShowProceso(false);
    setCorrectCount(0);
    setIsFinished(false);
    setInExam(true);
    playTono(540);
  };

  const currentQ = examQuestions[qIndex];

  // Generar motor visual FZ para la pregunta activa
  useEffect(() => {
    if (!inExam || !currentQ) {
      setFzHtml('');
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        (window as any).FZ = FZ;
        (window as any).fedor5Hablar = hablar;
        (window as any).fedor5Tono = playTono;
        (window as any).hablar = hablar;
        (window as any).tono = playTono;
      }

      if (FZ && FZ.crear) {
        const html = FZ.crear(
          {
            q: currentQ.q,
            ctx: currentQ.ctx,
            opts: currentQ.opts,
            ans: currentQ.ans,
          },
          'ex'
        );
        setFzHtml(html || '');
      }
    } catch (err) {
      console.warn('[FZ en ExamenFinal]', err);
      setFzHtml('');
    }
  }, [inExam, qIndex, currentQ]);

  const handleSelectOption = (opt: string) => {
    if (selectedOpt !== null || !currentQ) return;
    setSelectedOpt(opt);

    const isCorrect = String(opt).trim().toLowerCase() === String(currentQ.ans).trim().toLowerCase();
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      playTono(650);
      hablar('¡Correcto!');
    } else {
      playTono(280);
      hablar('Incorrecto.');
    }
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setShowProceso(false);
    if (qIndex + 1 < examQuestions.length) {
      setQIndex((i) => i + 1);
    } else {
      // Fin del examen
      setIsFinished(true);
      const passed = correctCount >= 18;

      const nextStats = {
        aprobados: passed ? stats.aprobados + 1 : stats.aprobados,
        mejor: Math.max(stats.mejor, correctCount),
        intentos: stats.intentos + 1,
      };
      setStats(nextStats);

      try {
        localStorage.setItem('fedor5_examen_final', JSON.stringify(nextStats));
        localStorage.setItem('fedor5_final_stats', JSON.stringify(nextStats));
      } catch {}

      if (passed) {
        updateStats(500, 3, 250);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="tool-modal-bg animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (inExam) setInExam(false);
          else onClose();
        }
      }}
    >
      <style>{`
        .tool-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 9995;
          background: rgba(18, 8, 42, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          box-sizing: border-box;
        }

        .tool-modal {
          background: #FFFFFF;
          border-radius: 18px;
          max-width: 560px;
          width: 100%;
          max-height: 86vh;
          overflow-y: auto;
          padding: 18px 20px 22px;
          position: relative;
          box-shadow: 0 24px 70px rgba(20, 8, 50, 0.5);
          font-family: 'Nunito', sans-serif;
          color: #180D38;
          box-sizing: border-box;
        }

        .tm-close {
          position: absolute;
          right: 12px;
          top: 10px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1.5px solid #E4DFF5;
          background: #F7F4FF;
          color: #6C28B4;
          font-weight: 900;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: all 0.15s ease;
          padding: 0;
          outline: none;
        }

        .tm-close:hover {
          background: #6C28B4;
          color: #FFFFFF;
        }

        .tm-title {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 19px;
          font-weight: 900;
          color: #3D1468;
          margin: 0 34px 12px 0;
          display: flex;
          align-items: center;
          gap: 6px;
          line-height: 1.2;
        }

        /* ── Estilos completos para el Motor FZ en el Examen Final ── */
        .fz {
          margin: 10px 0 14px;
          border-radius: 16px;
          background: linear-gradient(160deg, #F8F5FF, #EEF7FF);
          border: 2px solid #D9CCFF;
          box-shadow: 0 4px 16px rgba(60, 20, 120, 0.08);
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
          background: linear-gradient(90deg, var(--fz1, #0F766E), var(--fz2, #14B8A6));
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
          border-radius: 8px;
          padding: 2px 8px;
          font-weight: 900;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
        }

        .fz-b {
          padding: 12px;
          overflow-x: auto;
          text-align: center;
        }

        .fz.min .fz-b, .fz.min .fz-f {
          display: none;
        }

        .fz-f {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0 12px 12px;
          align-items: center;
        }

        .fz-btn {
          border: none;
          border-radius: 12px;
          padding: 8px 14px;
          font-weight: 900;
          font-size: 13.5px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #fff;
          background: linear-gradient(135deg, #5C21A6, #8B3EDB);
          box-shadow: 0 3px 10px rgba(92, 33, 166, 0.25);
          transition: transform 0.12s;
        }

        .fz-btn:hover {
          transform: translateY(-1px);
        }

        .fz-btn.o {
          background: linear-gradient(135deg, #FF8C2A, #E8650A);
          box-shadow: 0 3px 10px rgba(232, 101, 10, 0.3);
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

        .fz-msg {
          font-weight: 900;
          font-size: 13.5px;
          color: #3D1468;
          padding: 6px 12px;
          background: #FFFFFF;
          border-radius: 12px;
          border: 2px dashed #C5BFEE;
          min-height: 20px;
          display: inline-block;
          text-align: center;
        }

        .fz-tip {
          font-size: 12px;
          font-weight: 800;
          color: #6B5E8A;
          margin-top: 8px;
          text-align: left;
        }

        .fz-svg {
          display: block;
          margin: 0 auto;
          max-width: 100%;
          height: auto;
        }

        /* ── Opciones de respuesta 2x2 ── */
        .f5opt-btn {
          padding: 12px;
          font-size: 17px;
          font-weight: 900;
          background: #F8F5FF;
          color: #2A0F60;
          border: 2px solid #C5BFEE;
          border-radius: 12px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.12s ease;
          box-sizing: border-box;
          min-height: 48px;
        }

        .f5opt-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          border-color: #7C3AED;
        }

        .f5opt-btn.correct {
          background: #DCF5EE !important;
          border-color: #14B8A6 !important;
          color: #0F5B44 !important;
        }

        .f5opt-btn.wrong {
          background: #FEE2E2 !important;
          border-color: #B91C1C !important;
          color: #7F1D1D !important;
        }
      `}</style>

      <div className="tool-modal animate-popIn">
        {/* Botón Cerrar .tm-close */}
        <button
          type="button"
          onClick={inExam ? () => setInExam(false) : onClose}
          className="tm-close"
          title={inExam ? 'Volver al resumen' : 'Cerrar'}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Título .tm-title */}
        <div className="tm-title">
          <span>🎓</span>
          <span>Examen Final 5°</span>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            VISTA 1: MENÚ INICIAL Y ESTADÍSTICAS (IDÉNTICO A LA IMAGEN)
           ══════════════════════════════════════════════════════════════ */}
        {!inExam ? (
          <div>
            <p
              style={{
                fontWeight: 800,
                color: '#2A0F60',
                fontSize: '14px',
                margin: '0 0 10px 0',
                lineHeight: 1.45,
              }}
            >
              25 preguntas mezcladas de las 20 unidades del libro.
            </p>

            {/* Cuadrícula de 3 estadísticas (Aprobados, Mejor, Intentos) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                margin: '10px 0 12px 0',
              }}
            >
              <div
                style={{
                  background: '#F8F5FF',
                  borderRadius: '10px',
                  padding: '10px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', color: '#7A7299', fontWeight: 800, marginBottom: '2px' }}>
                  Aprobados
                </div>
                <div style={{ fontSize: '19px', fontWeight: 900, color: '#5C21A6' }}>
                  {stats.aprobados}
                </div>
              </div>

              <div
                style={{
                  background: '#F8F5FF',
                  borderRadius: '10px',
                  padding: '10px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', color: '#7A7299', fontWeight: 800, marginBottom: '2px' }}>
                  Mejor
                </div>
                <div style={{ fontSize: '19px', fontWeight: 900, color: '#5C21A6' }}>
                  {stats.mejor}/25
                </div>
              </div>

              <div
                style={{
                  background: '#F8F5FF',
                  borderRadius: '10px',
                  padding: '10px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', color: '#7A7299', fontWeight: 800, marginBottom: '2px' }}>
                  Intentos
                </div>
                <div style={{ fontSize: '19px', fontWeight: 900, color: '#5C21A6' }}>
                  {stats.intentos}
                </div>
              </div>
            </div>

            {/* Aviso de recompensa por aprobación */}
            <div
              style={{
                background: '#FFEDD8',
                border: '2px solid #FF8C2A',
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#7A3200',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>🏆</span>
              <span>
                Apruebas con 18/25 o más: <b>+500 🪙</b>
              </span>
            </div>

            {/* Botón de inicio */}
            <button
              type="button"
              onClick={handleStartExam}
              style={{
                width: '100%',
                padding: '13px',
                background: 'linear-gradient(135deg, #A30041, #FF1D4E)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '15px',
                cursor: 'pointer',
                fontFamily: 'Nunito',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(163, 0, 65, 0.25)',
                transition: 'transform 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>🎓</span>
              <span>Empezar examen final</span>
            </button>
          </div>
        ) : isFinished ? (
          /* ══════════════════════════════════════════════════════════════
              VISTA 2: FIN DEL EXAMEN (RESULTADOS)
             ══════════════════════════════════════════════════════════════ */
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: '48px', lineHeight: 1, marginBottom: '8px' }}>
              {correctCount >= 18 ? '🏆' : correctCount >= 13 ? '👍' : '💪'}
            </div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#A30041', marginBottom: '4px' }}>
              {correctCount}/25
            </div>
            <div style={{ fontWeight: 800, color: '#2A0F60', fontSize: '15px', marginBottom: '10px' }}>
              {Math.round((correctCount / 25) * 100)}% de aciertos
            </div>

            {correctCount >= 18 ? (
              <p style={{ color: '#16876A', fontWeight: 900, fontSize: '14px', marginBottom: '16px' }}>
                🎓 ¡Aprobaste el Examen Final de 5°! +500 🪙 Monedas y +250 XP
              </p>
            ) : (
              <p style={{ color: '#A30041', fontWeight: 800, fontSize: '14px', marginBottom: '16px' }}>
                Necesitas 18/25 para aprobar. ¡Revisa las unidades e inténtalo de nuevo!
              </p>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleStartExam}
                style={{
                  padding: '10px 18px',
                  background: '#A30041',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                }}
              >
                🔁 Reintentar examen
              </button>
              <button
                type="button"
                onClick={() => setInExam(false)}
                style={{
                  padding: '10px 18px',
                  background: '#F3EEFF',
                  color: '#5C21A6',
                  border: '1.5px solid #C5BFEE',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                }}
              >
                ◀ Volver al resumen
              </button>
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════
              VISTA 3: PREGUNTA ACTIVA DEL EXAMEN (IDÉNTICO A LA IMAGEN)
             ══════════════════════════════════════════════════════════════ */
          <div>
            {/* Fila de estado: Pregunta X de 25 y Correctas */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                fontWeight: 900,
                fontSize: '13px',
                color: '#A30041',
              }}
            >
              <span>Pregunta {qIndex + 1} de 25</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>✅</span>
                <span>{correctCount}</span>
              </span>
            </div>

            {/* Barra de progreso de 6px con relleno carmesí */}
            <div
              style={{
                height: '6px',
                background: '#EEE',
                borderRadius: '3px',
                marginBottom: '10px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '6px',
                  width: `${Math.round(((qIndex + 1) / 25) * 100)}%`,
                  background: '#A30041',
                  transition: 'width 0.25s ease',
                }}
              />
            </div>

            {currentQ && (
              <div>
                {/* Categoría / Tema */}
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#7A7299',
                    marginBottom: '4px',
                  }}
                >
                  {currentQ.cat || currentQ.unit}
                </div>

                {/* Contexto del enunciado */}
                {currentQ.ctx && (
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#374151',
                      fontWeight: 700,
                      marginBottom: '6px',
                      lineHeight: 1.45,
                    }}
                  >
                    {currentQ.ctx}
                  </div>
                )}

                {/* Pregunta principal */}
                <div
                  id="f5QuizQ"
                  style={{
                    fontSize: '17px',
                    color: '#111111',
                    fontWeight: 900,
                    marginBottom: '12px',
                    lineHeight: 1.45,
                  }}
                >
                  {currentQ.q}
                </div>

                {/* Motor FZ: Laboratorio visual manipulativo idéntico a la imagen */}
                {fzHtml && (
                  <div
                    dangerouslySetInnerHTML={{ __html: fzHtml }}
                    style={{ marginBottom: '12px' }}
                  />
                )}

                {/* Cuadrícula 2x2 de Opciones (Idéntica a la imagen) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  {currentQ.opts.map((opt, i) => {
                    const isSelected = selectedOpt === opt;
                    const isCorrect = String(opt).trim().toLowerCase() === String(currentQ.ans).trim().toLowerCase();

                    let cls = 'f5opt-btn';
                    if (selectedOpt !== null) {
                      if (isCorrect) cls += ' correct';
                      else if (isSelected) cls += ' wrong';
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        disabled={selectedOpt !== null}
                        className={cls}
                      >
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback y controles interactivos al responder */}
                {selectedOpt !== null && (
                  <div id="f5QuizFb" style={{ marginTop: '12px' }}>
                    {String(selectedOpt).trim().toLowerCase() === String(currentQ.ans).trim().toLowerCase() ? (
                      <div
                        style={{
                          background: '#DCF5EE',
                          border: '2px solid #14B8A6',
                          padding: '10px',
                          borderRadius: '10px',
                          color: '#0D9488',
                          fontWeight: 900,
                          textAlign: 'center',
                          fontSize: '14px',
                        }}
                      >
                        🎉 ¡Correcto!
                      </div>
                    ) : (
                      <div
                        style={{
                          background: '#FEE2E2',
                          border: '2px solid #B91C1C',
                          padding: '10px',
                          borderRadius: '10px',
                          color: '#B91C1C',
                          fontWeight: 900,
                          textAlign: 'center',
                          fontSize: '14px',
                        }}
                      >
                        ❌ Respuesta correcta: <b>{currentQ.ans}</b>
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        marginTop: '10px',
                        justifyContent: 'center',
                      }}
                    >
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        style={{
                          padding: '10px 20px',
                          background: '#A30041',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '10px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          fontFamily: 'Nunito',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{qIndex + 1 < examQuestions.length ? '➡ Seguir' : '🏆 Ver resultados'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProceso((p) => !p)}
                        style={{
                          padding: '10px 18px',
                          background: '#FFFFFF',
                          color: '#5C21A6',
                          border: '2px solid #5C21A6',
                          borderRadius: '10px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          fontFamily: 'Nunito',
                          fontSize: '14px',
                        }}
                      >
                        📖 Proceso
                      </button>
                    </div>

                    {showProceso && (
                      <div
                        id="f5QuizProc"
                        style={{
                          marginTop: '10px',
                          background: '#FFFFFF',
                          border: '2px solid #C5BFEE',
                          borderRadius: '12px',
                          padding: '12px',
                          textAlign: 'left',
                          lineHeight: 1.55,
                        }}
                      >
                        <div style={{ fontSize: '13px', color: '#5C21A6', fontWeight: 800 }}>📊 Enunciado</div>
                        <div style={{ fontSize: '14px', color: '#111', marginBottom: '8px' }}>
                          {(currentQ.ctx ? currentQ.ctx + ' ' : '') + currentQ.q}
                        </div>
                        {currentQ.hint && (
                          <>
                            <div style={{ fontSize: '13px', color: '#B45309', fontWeight: 800 }}>⬆ Instrucciones</div>
                            <div style={{ fontSize: '15px', color: '#111', fontWeight: 700, marginBottom: '8px' }}>
                              {currentQ.hint}
                            </div>
                          </>
                        )}
                        <div style={{ fontSize: '13px', color: '#0F5B44', fontWeight: 800 }}>✅ Resultado</div>
                        <div style={{ fontSize: '18px', color: '#111', fontWeight: 900 }}>{currentQ.ans}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
