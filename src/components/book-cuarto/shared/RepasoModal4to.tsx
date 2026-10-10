'use client';

import React, { useState } from 'react';
import { useBook4 } from '../context/Book4Context';

interface RepasoModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RepasoExercise {
  id: string;
  tema: string;
  ctx: string;
  q: string;
  opts: string[];
  ans: string;
  modelSubtitle: string;
  multiplier: number;
  decomposedParts: number[];
  partialProducts: number[];
  explanation: string;
}

const REPASO_QUESTIONS: RepasoExercise[] = [
  {
    id: 'rep-1',
    tema: 'Problemas Numéricos SABER',
    ctx: 'Leo reparte volantes en el colegio. En el tema "Problemas Numéricos SABER" resuelve:',
    q: '¿Cuál es el triple de 92?',
    opts: ['278', '286', '316', '276'],
    ans: '276',
    modelSubtitle: '92 × 3 por partes',
    multiplier: 3,
    decomposedParts: [90, 2],
    partialProducts: [270, 6],
    explanation: 'Identificamos los datos: 92 y el triple (× 3). Descomponemos 92 en 90 + 2. Multiplicamos cada parte: 90 × 3 = 270 y 2 × 3 = 6. Sumamos: 270 + 6 = 276.',
  },
  {
    id: 'rep-2',
    tema: 'Geometría y Medición',
    ctx: 'En el huerto escolar se delimitó una zona rectangular para cultivar hortalizas:',
    q: 'Un rectángulo mide 18 m de largo por 9 m de ancho. ¿Cuál es su área en m²?',
    opts: ['153', '152', '162', '166'],
    ans: '162',
    modelSubtitle: '18 × 9 por partes',
    multiplier: 9,
    decomposedParts: [10, 8],
    partialProducts: [90, 72],
    explanation: 'El área es largo × ancho (18 × 9). Descomponemos 18 en 10 + 8. Multiplicamos: 10 × 9 = 90 y 8 × 9 = 72. Sumamos: 90 + 72 = 162 m².',
  },
  {
    id: 'rep-3',
    tema: 'Problemas Numéricos SABER',
    ctx: 'Para la biblioteca escolar se organizaron 4 estantes con 125 libros cada uno:',
    q: '¿Cuántos libros se organizaron en total?',
    opts: ['480', '500', '525', '450'],
    ans: '500',
    modelSubtitle: '125 × 4 por partes',
    multiplier: 4,
    decomposedParts: [100, 20, 5],
    partialProducts: [400, 80, 20],
    explanation: 'Multiplicamos 125 × 4. Descomponemos 125 en 100 + 20 + 5. Multiplicamos: 100 × 4 = 400, 20 × 4 = 80 y 5 × 4 = 20. Sumamos: 400 + 80 + 20 = 500 libros.',
  },
];

export default function RepasoModal4to({ isOpen, onClose }: RepasoModal4toProps) {
  const { updateStats } = useBook4();

  const [questions] = useState<RepasoExercise[]>(REPASO_QUESTIONS);
  const [qIndex, setQIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [modelOpen, setModelOpen] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [hasAwardedStats, setHasAwardedStats] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQ = questions[qIndex] || questions[0];
  const isAnswered = selectedOpt !== null;
  const isCorrect = isAnswered && selectedOpt === currentQ.ans;
  const pct = Math.round((correctCount / questions.length) * 100);

  const playSound = (type: 'correct' | 'wrong' | 'pop') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'wrong') {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.setValueAtTime(240, now + 0.15);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch {
      // Audio fallback
    }
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOpt(opt);

    if (opt === currentQ.ans) {
      setCorrectCount((prev) => prev + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const handleNext = () => {
    playSound('pop');
    setSelectedOpt(null);
    setShowExplanation(false);

    if (qIndex + 1 < questions.length) {
      setQIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      if (!hasAwardedStats) {
        setHasAwardedStats(true);
        updateStats(100, 1, 100);
      }
    }
  };

  const handleRestart = () => {
    playSound('pop');
    setQIndex(0);
    setCorrectCount(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setIsFinished(false);
  };

  return (
    <div
      className="fixed inset-0 z-[99995] flex items-center justify-center p-3.5 animate-fadeIn"
      style={{
        background: 'rgba(18, 8, 42, 0.72)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-[560px] max-h-[88vh] overflow-y-auto bg-white rounded-[18px] p-[18px_20px_22px] text-[#180D38]"
        style={{
          boxShadow: '0 24px 70px rgba(20, 8, 50, 0.5)',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* ══ BOTÓN CIRCULAR DE CIERRE (.tm-close) ══ */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-2.5 w-[30px] h-[30px] rounded-full border-[1.5px] border-[#E4DFF5] bg-[#F7F4FF] hover:bg-[#6C28B4] hover:text-white text-[#6C28B4] font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
          style={{ lineHeight: 1 }}
          title="Cerrar"
        >
          ✕
        </button>

        {/* ══ TÍTULO DEL MODAL (.tm-title) ══ */}
        <div
          className="text-[19px] font-black text-[#3D1468] mr-[34px] mb-3 leading-tight"
          style={{ fontFamily: "'Baloo 2', 'Nunito', sans-serif" }}
        >
          🔁 Mi Repaso · 3 ejercicios
        </div>

        {/* ══ PANTALLA FINAL AL TERMINAR EL REPASO ══ */}
        {isFinished ? (
          <div className="py-6 text-center space-y-3 animate-fadeIn">
            <div className="text-[48px] animate-bounce">
              {pct >= 70 ? '🏆' : pct >= 50 ? '👍' : '💪'}
            </div>
            <div
              className="text-[40px] font-black"
              style={{ color: '#0E6BA8', fontFamily: "'Baloo 2', sans-serif" }}
            >
              {correctCount}/{questions.length}
            </div>
            <div className="font-black text-[#2A0F60] text-base mb-1">
              {pct}% de aciertos
            </div>
            <p className="text-sm font-black text-[#0E6BA8] max-w-sm mx-auto mb-4">
              Superaste {correctCount} de {questions.length} ejercicios. ¡Has reforzado conceptos clave de matemáticas!
            </p>

            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl font-black text-xs text-amber-800">
                <span>🪙</span>
                <span>+100 Monedas</span>
              </div>
              <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-xl font-black text-xs text-purple-800">
                <span>⭐</span>
                <span>+100 XP</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleRestart}
                className="py-2.5 px-4.5 rounded-[10px] font-black text-sm bg-[#F0EDF8] text-[#5C21A6] border border-[#C5BFEE] hover:bg-[#E5DFF4] cursor-pointer transition-colors"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                🔄 Repasar otra vez
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 rounded-[10px] font-black text-sm text-white bg-[#0E6BA8] hover:bg-[#0b5382] border-none cursor-pointer shadow-md transition-colors"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                ✔ Cerrar
              </button>
            </div>
          </div>
        ) : (
          /* ══ CONTENIDO DEL QUIZ ACTIVO ══ */
          <div>
            {/* Fila de Estado: Pregunta X de 3 | ✅ N */}
            <div
              className="flex justify-between items-center mb-2 font-black text-[13px]"
              style={{ color: '#0E6BA8' }}
            >
              <span>Pregunta {qIndex + 1} de {questions.length}</span>
              <span>✅ {correctCount}</span>
            </div>

            {/* Barra de Progreso (Gris #EEE con fill según acierto/pregunta) */}
            <div className="h-[6px] bg-[#EEE] rounded-[3px] mb-2.5 overflow-hidden">
              <div
                className="h-[6px] transition-all duration-300"
                style={{
                  width: `${Math.round((qIndex / questions.length) * 100)}%`,
                  background: '#0E6BA8',
                }}
              />
            </div>

            {/* Subtítulo del Tema */}
            <div className="text-[11px] font-extrabold text-[#7A7299] mb-1">
              {currentQ.tema}
            </div>

            {/* Contexto del Ejercicio */}
            <div className="text-[14px] text-[#374151] font-bold mb-1.5 leading-[1.45]">
              {currentQ.ctx}
            </div>

            {/* Enunciado Principal */}
            <div
              id="f5QuizQ"
              className="text-[17px] text-[#111] font-black mb-3 leading-[1.45]"
            >
              {currentQ.q}
            </div>

            {/* ══ CAJA VISUAL: MODELO DE ÁREA (.fz) ══ */}
            <div
              className="my-3 border-[2.5px] border-[#D9CCFF] rounded-[20px] overflow-hidden text-left"
              style={{
                background: 'linear-gradient(160deg, #F8F5FF, #EEF7FF)',
                boxShadow: '0 8px 22px rgba(60, 20, 120, 0.10)',
                fontFamily: "'Nunito', sans-serif",
                color: '#1A1033',
              }}
            >
              {/* Cabecera del Marco (.fz-h) */}
              <div
                className="flex items-center gap-2 p-[8px_12px] text-white"
                style={{
                  background: 'linear-gradient(90deg, #5C21A6, #8B3EDB)',
                }}
              >
                <span
                  className="flex-1 font-black text-[15px] tracking-[0.01em] text-white flex items-center"
                  style={{ fontFamily: "'Baloo 2', 'Nunito', sans-serif" }}
                >
                  <span className="text-white">🧠 Modelo de área</span>
                  <small
                    className="font-extrabold text-[11px] opacity-85 ml-1.5 text-white"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    {currentQ.modelSubtitle}
                  </small>
                </span>

                <button
                  type="button"
                  onClick={() => setModelOpen(!modelOpen)}
                  className="bg-white/20 hover:bg-white/30 border-[1.5px] border-white/45 text-white rounded-[10px] p-[3px_10px] font-black text-xs cursor-pointer transition-colors"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                  title="Mostrar u ocultar"
                >
                  {modelOpen ? '▾' : '▲'}
                </button>
              </div>

              {/* Cuerpo del Marco (.fz-b) */}
              {modelOpen && (
                <div className="p-3 overflow-x-auto">
                  {/* Tabla .fz-col */}
                  <table className="border-separate border-spacing-[5px] mx-auto">
                    <tbody>
                      {/* Fila 1 */}
                      <tr>
                        <td
                          className="bg-transparent border-none text-[#E8650A] font-black text-[22px] text-center w-auto px-2 select-none"
                          style={{ fontFamily: "'Baloo 2', sans-serif" }}
                        >
                          ✖
                        </td>
                        {currentQ.decomposedParts.map((part, idx) => (
                          <td
                            key={`top-${idx}`}
                            className="text-center font-black text-[18px] text-[#1A1033] rounded-[10px] border-2 border-[#EEE8FB] shadow-xs"
                            style={{
                              background: '#EDE3FF',
                              minWidth: '70px',
                              height: '44px',
                              fontFamily: "'Baloo 2', sans-serif",
                            }}
                          >
                            {part}
                          </td>
                        ))}
                      </tr>

                      {/* Fila 2 */}
                      <tr>
                        <td
                          className="text-center font-black text-[18px] text-[#1A1033] rounded-[10px] border-2 border-[#EEE8FB] shadow-xs"
                          style={{
                            background: '#FFE8CC',
                            minWidth: '60px',
                            height: '44px',
                            fontFamily: "'Baloo 2', sans-serif",
                          }}
                        >
                          {currentQ.multiplier}
                        </td>
                        {currentQ.partialProducts.map((prod, idx) => (
                          <td
                            key={`bot-${idx}`}
                            className="text-center rounded-[10px] border-2 border-[#EEE8FB] bg-white shadow-xs"
                            style={{
                              minWidth: '70px',
                              height: '44px',
                            }}
                          >
                            <div
                              className="w-full h-full flex items-center justify-center font-black text-[18px] transition-colors"
                              style={{
                                fontFamily: "'Baloo 2', sans-serif",
                                color: isAnswered ? '#5C21A6' : '#6B7280',
                              }}
                            >
                              {isAnswered ? prod : '?'}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>

                  {/* Tip .fz-tip */}
                  <div className="text-[12px] font-extrabold text-[#6B5E8A] mt-2 text-center">
                    👆 Descompón cada número (ej. 42 = 40 + 2) y multiplica las partes.
                  </div>
                </div>
              )}

              {/* Pie del Marco (.fz-f) */}
              {modelOpen && (
                <div className="flex flex-wrap gap-1.5 p-[0_12px_12px] items-center">
                  <span className="font-black text-[14px] text-[#3D1468] p-[6px_10px] bg-white rounded-[12px] border-2 border-dashed border-[#C5BFEE] min-h-[20px] text-center w-full">
                    Multiplica cada pareja y al final suma todas las casillas
                  </span>
                </div>
              )}
            </div>

            {/* ══ GRILLA 2x2 DE OPCIONES (.f5opt) ══ */}
            <div className="grid grid-cols-2 gap-2">
              {currentQ.opts.map((opt, k) => {
                const isSelected = selectedOpt === opt;
                const isOptCorrect = opt === currentQ.ans;

                let btnBg = '#F8F5FF';
                let btnBorder = '2px solid #C5BFEE';
                let btnColor = '#2A0F60';

                if (isAnswered) {
                  if (isOptCorrect) {
                    btnBg = '#DCF5EE';
                    btnBorder = '2px solid #14B8A6';
                    btnColor = '#0F5B44';
                  } else if (isSelected) {
                    btnBg = '#FEE2E2';
                    btnBorder = '2px solid #B91C1C';
                    btnColor = '#7F1D1D';
                  } else {
                    btnColor = '#8A859E';
                  }
                }

                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    className="p-3 text-[16px] font-black rounded-[12px] cursor-pointer transition-all text-center"
                    style={{
                      background: btnBg,
                      border: btnBorder,
                      color: btnColor,
                      fontFamily: "'Nunito', sans-serif",
                      pointerEvents: isAnswered ? 'none' : 'auto',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* ══ FEEDBACK Y BOTÓN DE CONTINUAR (.f5QuizFb) ══ */}
            {isAnswered && (
              <div className="mt-3 animate-fadeIn">
                <div
                  className="p-2.5 rounded-[10px] font-black text-center text-sm"
                  style={{
                    background: isCorrect ? '#DCF5EE' : '#FEE2E2',
                    border: isCorrect ? '2px solid #14B8A6' : '2px solid #B91C1C',
                    color: isCorrect ? '#0D9488' : '#B91C1C',
                  }}
                >
                  {isCorrect ? '🎉 ¡Correcto!' : `❌ Respuesta correcta: ${currentQ.ans}`}
                </div>

                <div className="flex gap-2 mt-2.5 justify-center">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="py-2.5 px-4.5 rounded-[10px] font-black text-sm text-white border-none cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      background: '#0E6BA8',
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    {qIndex + 1 < questions.length ? '➡ Seguir' : '🏆 Terminar'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="py-2.5 px-4.5 rounded-[10px] font-black text-sm bg-white cursor-pointer hover:bg-purple-50 transition-colors"
                    style={{
                      border: '2px solid #5C21A6',
                      color: '#5C21A6',
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    📖 Proceso
                  </button>
                </div>

                {/* Proceso desplegable (.f5QuizProc) */}
                {showExplanation && (
                  <div className="mt-2.5 bg-white border-2 border-[#C5BFEE] rounded-[12px] p-3 text-left leading-[1.55] animate-fadeIn">
                    <div className="text-[13px] text-[#5C21A6] font-extrabold">📊 Enunciado</div>
                    <div className="text-[14px] text-[#111] mb-2">{currentQ.ctx} {currentQ.q}</div>
                    <div className="text-[13px] text-[#B45309] font-extrabold">⬆ Instrucciones</div>
                    <div className="text-[14px] text-[#111] font-bold mb-2">{currentQ.explanation}</div>
                    <div className="text-[13px] text-[#0F5B44] font-extrabold">✅ Resultado</div>
                    <div className="text-[18px] text-[#111] font-black">{currentQ.ans}</div>
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
