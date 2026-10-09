'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook5 } from '../context/Book5Context';
import probData from '@/mocks/data/problemas-cotidianos-5.json';

interface ProblemaItem {
  q: string;
  ans: string;
  opts: string[];
  proc: string[];
  datos: number[];
  pts: number;
  t: number;
}

interface ProblemaLevel {
  nombre: string;
  ejemplos: ProblemaItem[];
  ejercicios: ProblemaItem[];
}

const NIVELES: ProblemaLevel[] = (probData as any).PC_NIVELES || [];

export default function ProblemasScreen5to() {
  const { goScreen, updateStats } = useBook5();

  const [activeLevelIdx, setActiveLevelIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'ejemplos' | 'practica'>('ejemplos');

  // Practica session
  const [exIdx, setExIdx] = useState(0);
  const [timer, setTimer] = useState(60);
  const [answered, setAnswered] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFinished, setShowFinished] = useState(false);
  const [showProc, setShowProc] = useState(false);

  const answeredRef = useRef(false);
  useEffect(() => {
    answeredRef.current = answered;
  }, [answered]);

  const currentLevel = NIVELES[activeLevelIdx] || NIVELES[0];
  const curEx = currentLevel?.ejercicios?.[exIdx];

  // Timer for exercises
  useEffect(() => {
    if (activeTab !== 'practica' || !curEx || showFinished) return;

    setTimer(curEx.t || 60);
    setAnswered(false);
    answeredRef.current = false;
    setSelectedOpt(null);
    setShowProc(false);

    const intv = setInterval(() => {
      if (answeredRef.current) return;
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intv);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exIdx, activeTab, activeLevelIdx, showFinished]);

  const handleTimeOut = () => {
    if (answeredRef.current || !curEx) return;
    setAnswered(true);
    answeredRef.current = true;
  };

  const handleAnswer = (opt: string) => {
    if (answered || !curEx) return;
    setAnswered(true);
    answeredRef.current = true;
    setSelectedOpt(opt);

    const isOk = opt === curEx.ans;
    if (isOk) {
      setCorrectCount((c) => c + 1);
      setScore((s) => s + (curEx.pts || 10));
    }
  };

  const handleNext = () => {
    if (exIdx + 1 < (currentLevel.ejercicios?.length || 20)) {
      setExIdx((p) => p + 1);
    } else {
      setShowFinished(true);
      updateStats(score, 1, score * 2);
    }
  };

  const handleRestart = () => {
    setExIdx(0);
    setScore(0);
    setCorrectCount(0);
    setShowFinished(false);
    setAnswered(false);
    setSelectedOpt(null);
  };

  const speak = (txt: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(txt.replace(/<[^>]*>/g, ' '));
    utterance.lang = 'es-CO';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-[1008px] mx-auto px-3 sm:px-4 py-4 select-none font-sans">
      {/* ══ Top Navigation ══ */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => goScreen('home')}
          className="inline-flex items-center gap-1.5 text-xs md:text-sm font-black text-[#E8650A] hover:underline cursor-pointer"
        >
          <span>←</span>
          <span>Volver al inicio</span>
        </button>
      </div>

      {/* ══ Header Banner ══ */}
      <div className="rounded-2xl md:rounded-3xl p-5 md:p-7 text-white mb-6 shadow-lg bg-gradient-to-r from-[#D97706] via-[#E8650A] to-[#B45309]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider mb-2">
              <span>🛒</span>
              <span>Matemáticas de la Vida Cotidiana · 5° Grado</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black font-['Baloo_2',sans-serif] leading-tight">
              Problemas Cotidianos — Tipo Prueba SABER
            </h1>
            <p className="text-xs md:text-sm text-white/90 font-bold mt-1 max-w-2xl">
              5 niveles de retos matemáticos aplicados a compras, presupuestos, tiendas y situaciones del día a día.
            </p>
          </div>
        </div>
      </div>

      {/* ══ Niveles Tabs ══ */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        {NIVELES.map((niv, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setActiveLevelIdx(i);
              handleRestart();
            }}
            className={`py-3 px-2 rounded-xl text-xs md:text-sm font-black text-center transition-all cursor-pointer border-2 ${
              activeLevelIdx === i
                ? 'bg-[#E8650A] text-white border-[#E8650A] shadow-md'
                : 'bg-white text-[#7A3200] border-[#DDD8F5] hover:bg-orange-50'
            }`}
          >
            Nivel {i + 1}: {niv.nombre}
          </button>
        ))}
      </div>

      {/* ══ Tab Navigation: Ejemplos vs Práctica ══ */}
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('ejemplos')}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs md:text-sm transition-all cursor-pointer border-2 ${
            activeTab === 'ejemplos'
              ? 'bg-[#6C28B4] text-white border-[#6C28B4] shadow-md'
              : 'bg-white text-[#6C28B4] border-[#DDD8F5] hover:bg-purple-50'
          }`}
        >
          💡 10 Ejemplos Resueltos
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('practica');
            handleRestart();
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs md:text-sm transition-all cursor-pointer border-2 ${
            activeTab === 'practica'
              ? 'bg-[#E8650A] text-white border-[#E8650A] shadow-md'
              : 'bg-white text-[#E8650A] border-[#DDD8F5] hover:bg-orange-50'
          }`}
        >
          🎯 Evaluación: 20 Ejercicios
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          TAB 1: EJEMPLOS RESUELTOS
      ═════════════════════════════════════════════════════════════ */}
      {activeTab === 'ejemplos' && (
        <div className="space-y-4">
          {(currentLevel?.ejemplos || []).map((ej, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border-2 border-[#DDD8F5] p-5 md:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EEE8FB]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  <span className="font-black text-sm text-[#180D38]">
                    Ejemplo {idx + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => speak(ej.q)}
                  className="text-xs font-bold text-[#E8650A] hover:underline"
                >
                  🔊 Escuchar
                </button>
              </div>

              <div
                className="text-sm md:text-base font-black text-[#180D38] mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: ej.q }}
              />

              <div className="bg-[#FAF8FF] border border-[#DDD8F5] rounded-xl p-4 mb-3">
                <div className="text-xs font-black text-[#6C28B4] uppercase tracking-wider mb-2">
                  Procedimiento:
                </div>
                <ul className="space-y-2 text-xs md:text-sm text-[#180D38] font-bold">
                  {(ej.proc || []).map((p, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-[#6C28B4] font-black">{pIdx + 1}.</span>
                      <span dangerouslySetInnerHTML={{ __html: p }} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-right">
                <span className="inline-block px-4 py-1.5 bg-[#DCF5EE] text-[#074F3A] font-black text-xs md:text-sm rounded-full border border-[#16876A]">
                  Respuesta correcta: {ej.ans}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          TAB 2: PRÁCTICA DE EVALUACIÓN
      ═════════════════════════════════════════════════════════════ */}
      {activeTab === 'practica' && (
        <div>
          {showFinished ? (
            <div className="bg-white rounded-2xl border-2 border-[#DDD8F5] p-8 text-center max-w-lg mx-auto shadow-xl">
              <span className="text-6xl block mb-3">🏆</span>
              <h2 className="text-2xl font-black text-[#180D38] mb-2 font-['Baloo_2',sans-serif]">
                ¡Completaste el Nivel {activeLevelIdx + 1}!
              </h2>
              <p className="text-sm text-[#7A7299] font-bold mb-6">
                Acertaste {correctCount} de {currentLevel.ejercicios?.length || 20} ejercicios cotidianos.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-xl bg-[#6C28B4] text-white font-black text-sm shadow-md hover:bg-[#581c99]"
                >
                  Intentar de nuevo
                </button>
                <button
                  type="button"
                  onClick={() => goScreen('home')}
                  className="px-6 py-3 rounded-xl bg-[#E8650A] text-white font-black text-sm shadow-md hover:bg-[#d05706]"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          ) : curEx ? (
            <div className="bg-white rounded-2xl border-2 border-[#DDD8F5] p-5 md:p-7 shadow-md">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EEE8FB]">
                <div className="flex items-center gap-3">
                  <span className="text-xs md:text-sm font-black text-[#E8650A]">
                    Pregunta {exIdx + 1} de {currentLevel.ejercicios?.length || 20}
                  </span>
                  <span className="text-xs font-black text-[#16876A] bg-[#DCF5EE] px-2.5 py-0.5 rounded-full">
                    +{curEx.pts || 10} pts
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`text-xs md:text-sm font-black px-3 py-1 rounded-full ${
                      timer <= 15 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-orange-100 text-[#7A3200]'
                    }`}
                  >
                    ⏱️ {timer}s
                  </div>
                  <button
                    type="button"
                    onClick={() => speak(curEx.q)}
                    className="w-8 h-8 rounded-full bg-orange-100 text-[#7A3200] flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-orange-200"
                    title="Escuchar"
                  >
                    🔊
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div
                className="text-base md:text-xl font-black text-[#180D38] mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: curEx.q }}
              />

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {(curEx.opts || []).map((opt, oIdx) => {
                  const isSelected = selectedOpt === opt;
                  const isCorrect = opt === curEx.ans;

                  let optClass = 'bg-[#FBF9FF] border-[#DDD8F5] hover:border-[#E8650A] text-[#180D38]';
                  if (answered) {
                    if (isCorrect) {
                      optClass = 'bg-[#DCF5EE] border-[#16876A] text-[#074F3A]';
                    } else if (isSelected) {
                      optClass = 'bg-[#FAECE7] border-[#C94B22] text-[#C94B22]';
                    } else {
                      optClass = 'bg-gray-50 border-gray-200 text-gray-400';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={answered}
                      onClick={() => handleAnswer(opt)}
                      className={`p-4 rounded-xl border-2 text-left font-bold text-xs md:text-sm transition-all cursor-pointer ${optClass}`}
                    >
                      <span className="font-black text-[#E8650A] mr-2">
                        {String.fromCharCode(65 + oIdx)})
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Action and Next */}
              {answered && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#EEE8FB]">
                  <button
                    type="button"
                    onClick={() => setShowProc(!showProc)}
                    className="text-xs font-black text-[#6C28B4] hover:underline cursor-pointer"
                  >
                    {showProc ? 'Ocultar explicación' : '💡 Ver cómo se resuelve'}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#E8650A] text-white font-black text-sm shadow-md hover:bg-[#d05706] transition-all cursor-pointer"
                  >
                    Siguiente Pregunta ➔
                  </button>
                </div>
              )}

              {/* Procedure toggle */}
              {showProc && curEx.proc && (
                <div className="mt-4 bg-[#FAF8FF] border border-[#DDD8F5] rounded-xl p-4">
                  <div className="text-xs font-black text-[#6C28B4] uppercase tracking-wider mb-2">
                    Resolución paso a paso:
                  </div>
                  <ul className="space-y-1.5 text-xs md:text-sm text-[#180D38] font-bold">
                    {curEx.proc.map((p, pIdx) => (
                      <li key={pIdx}>
                        {pIdx + 1}. {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
