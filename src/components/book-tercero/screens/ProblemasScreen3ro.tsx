'use client';

import React, { useState } from 'react';
import { useBook3 } from '../context/Book3Context';
import { fedorSpeak } from '../shared/Grade3Speech';
import rawData from '@/mocks/data/problemas-cotidianos-3.json';

interface ProblemaEjercicio {
  num: number;
  enunciado: string;
  opts: string[];
  ans: number;
  pts: number;
  tiempo: number;
  explicacion: string;
  proceso: string;
}

interface ProblemaEjemplo {
  num: number;
  titulo: string;
  enunciado: string;
  operacion: string;
  resultado: number;
  unidad: string;
  proceso: string;
}

interface ProblemaNivel {
  id: number;
  nombre: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  desc: string;
  ejemplos: ProblemaEjemplo[];
  ejercicios: ProblemaEjercicio[];
}

export default function ProblemasScreen3ro() {
  const { goScreen, updateStats, activeProblemasNivel, activeProblemasTab } = useBook3();
  const niveles = (rawData.PC_NIVELES || []) as unknown as ProblemaNivel[];

  const [activeNivelIdx, setActiveNivelIdx] = useState(activeProblemasNivel ?? 0);
  const [activeTab, setActiveTab] = useState<'ejemplos' | 'practica'>(activeProblemasTab ?? 'ejemplos');
  const [practicaIdx, setPracticaIdx] = useState(0);
  const [selectedOptIndex, setSelectedOptIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const curNivel = niveles[activeNivelIdx] || niveles[0];
  const ejemplos = curNivel?.ejemplos || [];
  const ejercicios = curNivel?.ejercicios || [];
  const curEx = ejercicios[practicaIdx];

  const handleSelectOption = (index: number) => {
    if (!curEx || feedback !== null) return;
    setSelectedOptIndex(index);
    const isCorrect = index === curEx.ans;
    const correctVal = curEx.opts[curEx.ans];

    setFeedback({
      ok: isCorrect,
      message: isCorrect
        ? '🎉 ¡Excelente resolución!'
        : `❌ Casi. La respuesta correcta era: ${correctVal}`,
    });

    if (isCorrect) {
      updateStats(5, 1, 30);
    }
  };

  const handleNextEx = () => {
    setSelectedOptIndex(null);
    setFeedback(null);
    if (practicaIdx + 1 < ejercicios.length) {
      setPracticaIdx((p) => p + 1);
    } else {
      setPracticaIdx(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#07091B] text-white font-sans p-4 md:p-6 pb-24 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <button
          type="button"
          onClick={() => goScreen('home')}
          className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 cursor-pointer transition-colors"
        >
          <span>←</span>
          <span>Volver al Inicio</span>
        </button>

        <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Tipo Prueba SABER 3°
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E0942] via-[#2B0E5A] to-[#1E0942] border border-purple-500/40 rounded-3xl p-6 shadow-2xl mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-900/60 border border-purple-400/30 flex items-center justify-center text-4xl shrink-0 shadow-lg">
          🧮
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">
            Problemas Cotidianos
          </h1>
          <p className="text-xs font-bold text-purple-200/80 mt-1">
            Situaciones reales de compras, distancias, tiempo y alimentos · Preparación Pruebas SABER
          </p>
        </div>
      </div>

      {/* Nivel Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {niveles.map((niv, nIdx) => {
          const isActive = activeNivelIdx === nIdx;
          return (
            <button
              key={nIdx}
              type="button"
              onClick={() => {
                setActiveNivelIdx(nIdx);
                setPracticaIdx(0);
                setSelectedOptIndex(null);
                setFeedback(null);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-amber-400 text-purple-950 border-amber-300 shadow-lg shadow-amber-400/30 scale-102'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              {niv.nombre}
            </button>
          );
        })}
      </div>

      {/* Sub tabs: Ejemplos vs Práctica */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('ejemplos')}
          className={`px-6 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
            activeTab === 'ejemplos'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
              : 'bg-white/5 text-purple-200 border-white/10 hover:bg-white/10'
          }`}
        >
          📖 Ejemplos Resueltos ({ejemplos.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('practica')}
          className={`px-6 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
            activeTab === 'practica'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
              : 'bg-white/5 text-purple-200 border-white/10 hover:bg-white/10'
          }`}
        >
          ✏️ Práctica Interactiva ({ejercicios.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'ejemplos' ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          {ejemplos.map((ej, idx) => (
            <div
              key={idx}
              className="bg-[#120926]/90 border border-purple-500/25 rounded-2xl p-5 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                  Ejemplo {ej.num}: {ej.titulo}
                </span>
                <button
                  type="button"
                  onClick={() => fedorSpeak(`${ej.enunciado}. ${ej.proceso}`)}
                  title="Escuchar problema"
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer border border-white/20"
                >
                  🔊
                </button>
              </div>

              <p className="text-sm font-bold text-white mb-3 leading-relaxed">
                {ej.enunciado}
              </p>

              <div className="bg-purple-950/40 rounded-xl p-3 border border-purple-800/30 text-xs font-mono text-purple-200 whitespace-pre-wrap leading-relaxed">
                {ej.proceso}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-black">
                <span className="text-purple-300">Operación: {ej.operacion}</span>
                <span className="text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-lg">
                  Resultado: {ej.resultado} {ej.unidad}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : curEx ? (
        <div className="max-w-xl mx-auto bg-[#120926]/90 border border-purple-500/25 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-xs font-black text-purple-300 mb-4 pb-2 border-b border-purple-800/30">
            <span>Problema {practicaIdx + 1} de {ejercicios.length}</span>
            <span className="text-amber-400">⭐ +{curEx.pts || 10} pts</span>
          </div>

          <div className="flex items-start justify-between gap-3 mb-5">
            <h3 className="text-base font-black text-white leading-relaxed">
              {curEx.enunciado}
            </h3>
            <button
              type="button"
              onClick={() => fedorSpeak(curEx.enunciado)}
              title="Escuchar problema"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer border border-white/20 shrink-0"
            >
              🔊
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
            {curEx.opts.map((opt, oIdx) => {
              const isSelected = selectedOptIndex === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  disabled={feedback !== null}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`p-3.5 rounded-2xl border text-sm font-black text-center transition-all cursor-pointer shadow-md ${
                    isSelected
                      ? 'bg-amber-400 text-purple-950 border-amber-300 scale-102 shadow-amber-400/30'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:border-amber-400/50'
                  } ${feedback !== null ? 'cursor-not-allowed opacity-85' : ''}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-2xl border text-center text-sm font-black animate-popIn ${
                feedback.ok
                  ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
                  : 'bg-red-900/60 border-red-500 text-red-200'
              }`}
            >
              <p>{feedback.message}</p>
              {curEx.explicacion && (
                <p className="text-xs font-mono font-normal opacity-90 mt-1">
                  {curEx.explicacion}
                </p>
              )}
              <button
                type="button"
                onClick={handleNextEx}
                className="mt-3 px-6 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-black rounded-xl cursor-pointer shadow-sm"
              >
                Siguiente Problema →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
          No hay ejercicios de práctica disponibles en este nivel.
        </div>
      )}
    </div>
  );
}
