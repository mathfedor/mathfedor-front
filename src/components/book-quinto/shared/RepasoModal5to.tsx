'use client';

import React, { useState, useEffect } from 'react';
import { useBook5 } from '../context/Book5Context';
import { FZ } from './fedor-visual-lab-engine-5to';

interface RepasoModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface RepasoExercise {
  id: string;
  tema: string;
  ctx: string;
  q: string;
  opts: string[];
  ans: string;
  hint?: string;
  formula?: string;
}

export const REPASO_QUESTIONS_5TO: RepasoExercise[] = [
  {
    id: 'rep-5-1',
    tema: 'Proporciones en la vida diaria',
    ctx: 'Mezclas',
    q: 'Un cemento usa 2 kilos de cal por 5 de arena. Con 14 kilos de cal, ¿cuántos kilos de arena?',
    opts: ['37 kilos', '33 kilos', '19 kilos', '35 kilos'],
    ans: '35 kilos',
    hint: 'Compara con una unidad y escala: 2 kilos de cal → 5 de arena. Con 14 kilos (7 veces más), se necesitan 5 × 7 = 35 kilos de arena.',
    formula: 'CM · DM · UM · C · D · U',
  },
  {
    id: 'rep-5-2',
    tema: 'Fracciones y Decimales',
    ctx: 'En el laboratorio de ciencias se combinan soluciones con distinto volumen:',
    q: '¿Cuál es el resultado simplificado de 2/3 + 1/6?',
    opts: ['5/6', '3/9', '4/6', '1/2'],
    ans: '5/6',
    hint: 'Como los denominadores son 3 y 6, el MCM es 6. Convertimos 2/3 a sextos: (2×2)/(3×2) = 4/6. Luego sumamos: 4/6 + 1/6 = 5/6.',
    formula: 'MCM(3, 6) = 6',
  },
  {
    id: 'rep-5-3',
    tema: 'Geometría y Medición',
    ctx: 'En la huerta escolar se delimitó una parcela rectangular:',
    q: 'Un rectángulo mide 25 m de largo por 14 m de ancho. ¿Cuál es su área en m²?',
    opts: ['350 m²', '340 m²', '360 m²', '375 m²'],
    ans: '350 m²',
    hint: 'Área = largo × ancho: 25 × 14 = 350 m².',
    formula: 'Área = largo × ancho',
  },
];

export default function RepasoModal5to({ isOpen, onClose }: RepasoModal5toProps) {
  const { updateStats } = useBook5();

  const [questions, setQuestions] = useState<RepasoExercise[]>(REPASO_QUESTIONS_5TO);
  const [qIndex, setQIndex] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [fzHtml, setFzHtml] = useState<string>('');
  const [showProceso, setShowProceso] = useState<boolean>(false);

  // Cargar ejercicios de repaso (errores guardados en fedor5_repaso)
  useEffect(() => {
    if (!isOpen) return;

    try {
      const raw = localStorage.getItem('fedor5_repaso');
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length > 0) {
          const loaded: RepasoExercise[] = saved
            .filter((item: any) => item && item.ex && item.ex.q && item.ex.ans && Array.isArray(item.ex.opts))
            .map((item: any, idx: number) => ({
              id: `rep-err-${idx}`,
              tema: item.tema || 'Repaso de temas',
              ctx: item.ex.ctx || '',
              q: item.ex.q,
              opts: item.ex.opts,
              ans: String(item.ex.ans).trim(),
              hint: item.ex.hint || '',
              formula: item.ex.formula || 'CM · DM · UM · C · D · U',
            }));

          if (loaded.length > 0) {
            // Aseguramos que la pregunta héroe sea la primera para coincidir fielmente con el diseño
            const combined = [
              REPASO_QUESTIONS_5TO[0],
              ...loaded.filter((q) => q.q !== REPASO_QUESTIONS_5TO[0].q).slice(0, 5),
            ];
            setQuestions(combined);
            setQIndex(0);
            setSelectedOpt(null);
            setShowProceso(false);
            setCorrectCount(0);
            setIsFinished(false);
            return;
          }
        }
      }
    } catch {}

    setQuestions(REPASO_QUESTIONS_5TO);
    setQIndex(0);
    setSelectedOpt(null);
    setShowProceso(false);
    setCorrectCount(0);
    setIsFinished(false);
  }, [isOpen]);

  // Manejo de la tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  const currentQ = questions[qIndex] || questions[0];

  // Sincronizar motor FZ para generar la Pizarra de Apoyo interactiva
  useEffect(() => {
    if (!isOpen || !currentQ || isFinished) {
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
      console.warn('[FZ en Mi Repaso]', err);
      setFzHtml('');
    }
  }, [isOpen, qIndex, currentQ, isFinished]);

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
    if (qIndex + 1 < questions.length) {
      setQIndex((i) => i + 1);
    } else {
      setIsFinished(true);
      if (correctCount >= 2) {
        updateStats(60, 1, 40);
      }
    }
  };

  const handleRestart = () => {
    setQIndex(0);
    setSelectedOpt(null);
    setShowProceso(false);
    setCorrectCount(0);
    setIsFinished(false);
    playTono(540);
  };

  if (!isOpen) return null;

  return (
    <div
      className="tool-modal-bg animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
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

        /* ── Estilos completos para el Motor FZ y la Pizarra de Apoyo ── */
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

        .fz-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
        }

        .fz-chip {
          min-width: 36px;
          padding: 6px 10px;
          border-radius: 12px;
          background: #FFFFFF;
          border: 2px solid #D9CCFF;
          font-weight: 900;
          font-size: 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .fz-chip.on {
          background: #FFE066;
          border-color: #F5A524;
          transform: scale(1.08);
        }

        .fz-f {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 12px 12px;
          align-items: center;
          justify-content: center;
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
          onClick={onClose}
          className="tm-close"
          title="Cerrar"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Título .tm-title */}
        <div className="tm-title">
          <span>🔄</span>
          <span>Mi Repaso · {questions.length} ejercicios</span>
        </div>

        {!isFinished ? (
          <div>
            {/* Fila de estado: Pregunta X de Total y Aciertos */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                fontWeight: 900,
                fontSize: '13px',
                color: '#0E6BA8',
              }}
            >
              <span>Pregunta {qIndex + 1} de {questions.length}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>✅</span>
                <span>{correctCount}</span>
              </span>
            </div>

            {/* Barra de progreso de 6px con relleno azul #0E6BA8 */}
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
                  width: `${Math.round(((qIndex + 1) / questions.length) * 100)}%`,
                  background: '#0E6BA8',
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
                  {currentQ.tema}
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

                {/* Motor FZ: Pizarra de Apoyo interactiva idéntica a la imagen */}
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
                          background: '#0E6BA8',
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
                        <span>{qIndex + 1 < questions.length ? '➡ Seguir' : '🏆 Ver resultados'}</span>
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
        ) : (
          /* ══════════════════════════════════════════════════════════════
              VISTA DE RESULTADOS DEL REPASO
             ══════════════════════════════════════════════════════════════ */
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: '48px', lineHeight: 1, marginBottom: '8px' }}>
              {correctCount >= questions.length ? '🌟' : correctCount > 0 ? '👍' : '💪'}
            </div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#0E6BA8', marginBottom: '4px' }}>
              {correctCount}/{questions.length}
            </div>
            <div style={{ fontWeight: 800, color: '#2A0F60', fontSize: '15px', marginBottom: '10px' }}>
              {Math.round((correctCount / questions.length) * 100)}% de aciertos
            </div>

            <p style={{ color: '#0E6BA8', fontWeight: 800, fontSize: '14px', marginBottom: '16px' }}>
              Superaste {correctCount} ejercicio(s). ¡Excelente repaso!
            </p>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleRestart}
                style={{
                  padding: '10px 18px',
                  background: '#0E6BA8',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                }}
              >
                🔁 Repasar de nuevo
              </button>
              <button
                type="button"
                onClick={onClose}
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
                ◀ Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
