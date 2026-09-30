'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook4 } from '../context/Book4Context';
import probData from '@/mocks/data/problemas-cotidianos-4.json';

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

export default function ProblemasScreen4to() {
  const { goScreen, updateStats } = useBook4();

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

  return (
    <div className="w-full max-w-full mx-auto py-2 md:py-4 px-2 select-none font-sans">
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-orange-200">
        {/* Top Back Nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => goScreen('home')}
            className="text-xs sm:text-sm font-black text-purple-700 hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span> Volver al Inicio
          </button>

          <span className="text-xs font-black px-3 py-1 bg-orange-100 text-orange-800 rounded-full border border-orange-300">
            🛒 Problemas Cotidianos SABER 4°
          </span>
        </div>

        {/* Level selector tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {NIVELES.map((lvl, lIdx) => (
            <button
              key={lIdx}
              type="button"
              onClick={() => {
                setActiveLevelIdx(lIdx);
                setExIdx(0);
                setShowFinished(false);
              }}
              className={`px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeLevelIdx === lIdx
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-105'
                  : 'bg-orange-50 text-orange-900 border border-orange-200 hover:bg-orange-100'
              }`}
            >
              {lvl.nombre}
            </button>
          ))}
        </div>

        {/* Mode switch: Ejemplos vs Práctica */}
        <div className="flex gap-2 mb-6 border-b border-gray-100 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('ejemplos')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${
              activeTab === 'ejemplos'
                ? 'bg-purple-700 text-white'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
            }`}
          >
            📖 Ver Ejemplos con Proceso ({currentLevel.ejemplos?.length || 10})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('practica');
              setExIdx(0);
              setShowFinished(false);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${
              activeTab === 'practica'
                ? 'bg-orange-600 text-white'
                : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
            }`}
          >
            🎯 Práctica Interactiva ({currentLevel.ejercicios?.length || 20})
          </button>
        </div>

        {/* ══ MODO 1: EJEMPLOS EXPLICADOS CON PROCESO ══ */}
        {activeTab === 'ejemplos' && (
          <div className="space-y-4">
            {currentLevel.ejemplos?.map((ej, i) => (
              <div
                key={i}
                className="p-4 bg-[#FBF9FF] border border-[#E9D5FF] rounded-2xl shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-purple-700">
                    Ejemplo #{i + 1}
                  </span>
                  <span className="text-[11px] font-bold text-gray-500">
                    Vale {ej.pts} pts · ⏱ {ej.t} s
                  </span>
                </div>
                <h4
                  className="text-base sm:text-lg font-black text-gray-900 mb-3"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  {ej.q}
                </h4>

                {/* Proceso paso a paso */}
                <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-1 text-xs sm:text-sm font-semibold text-gray-800 mb-3">
                  <div className="text-[11px] font-black uppercase text-purple-800 tracking-wider mb-1">
                    🧠 Proceso de Solución:
                  </div>
                  {ej.proc?.map((p, pi) => (
                    <div key={pi} className="text-gray-700">
                      • {p}
                    </div>
                  ))}
                </div>

                <div className="text-xs sm:text-sm font-black text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-xl inline-block">
                  Respuesta correcta: <b>{ej.ans}</b>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ MODO 2: PRÁCTICA CON TIMER Y RETOS ══ */}
        {activeTab === 'practica' && (
          <div>
            {!showFinished && curEx ? (
              <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200">
                {/* Header with timer */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-orange-900">
                    Pregunta {exIdx + 1} de {currentLevel.ejercicios.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-600">Puntos: {score}</span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        timer <= 10 ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-white text-gray-800 border'
                      }`}
                    >
                      ⏱ {timer} s
                    </span>
                  </div>
                </div>

                {/* Enunciado */}
                <h3
                  className="text-lg sm:text-xl font-black text-gray-900 mb-4"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  {curEx.q}
                </h3>

                {/* Opciones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                  {curEx.opts.map((opt, oi) => {
                    const isCorrect = opt === curEx.ans;
                    const isChosen = selectedOpt === opt;
                    let style = 'bg-white border-gray-200 text-gray-800 hover:border-orange-400';

                    if (answered) {
                      if (isCorrect) style = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black';
                      else if (isChosen) style = 'bg-red-100 border-red-500 text-red-900 font-black';
                    }

                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={answered}
                        onClick={() => handleAnswer(opt)}
                        className={`p-3.5 rounded-xl border-2 text-left font-bold text-sm cursor-pointer transition-all ${style}`}
                      >
                        <span className="text-purple-700 mr-2">{String.fromCharCode(65 + oi)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Next */}
                {answered && (
                  <div className="mt-4 pt-3 border-t border-orange-200">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div className="text-sm font-black">
                        {selectedOpt === curEx.ans ? (
                          <span className="text-emerald-700">🎉 ¡Correcto! +{curEx.pts} puntos</span>
                        ) : (
                          <span className="text-red-700">❌ La respuesta correcta era: {curEx.ans}</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowProc(!showProc)}
                          className="px-3 py-1.5 bg-purple-100 text-purple-900 text-xs font-black rounded-lg cursor-pointer hover:bg-purple-200"
                        >
                          🧠 {showProc ? 'Ocultar Proceso' : 'Ver Proceso'}
                        </button>

                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-md hover:scale-105 transition-transform"
                        >
                          Siguiente ▶
                        </button>
                      </div>
                    </div>

                    {showProc && (
                      <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs font-semibold text-gray-700 space-y-1">
                        <div className="font-black text-purple-900 mb-1">🧠 Proceso explicado:</div>
                        {curEx.proc?.map((p, pi) => (
                          <div key={pi}>• {p}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Finished screen */
              <div className="text-center p-8 bg-purple-50 rounded-2xl border-2 border-purple-300">
                <span className="text-5xl block mb-2">🏁</span>
                <h3 className="text-2xl font-black text-[#2A0F60] mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  ¡Nivel Completado!
                </h3>
                <p className="text-sm text-gray-700 font-bold mb-4">
                  Acertaste {correctCount} de {currentLevel.ejercicios.length} problemas cotidianos. Ganaste +{score} puntos XP.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setExIdx(0);
                    setShowFinished(false);
                    setCorrectCount(0);
                    setScore(0);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm rounded-xl cursor-pointer"
                >
                  🔄 Volver a practicar este nivel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
