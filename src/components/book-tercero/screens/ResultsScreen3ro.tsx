'use client';

import React from 'react';
import { useBook3 } from '../context/Book3Context';

export default function ResultsScreen3ro() {
  const { lastResults, goScreen, startLevel, selectUnit } = useBook3();

  if (!lastResults) {
    return (
      <div className="min-h-screen bg-[#07091B] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-4">No hay resultados recientes</h2>
        <button
          type="button"
          onClick={() => goScreen('home')}
          className="px-6 py-2.5 bg-amber-400 text-purple-950 font-black rounded-xl"
        >
          Ir al Inicio
        </button>
      </div>
    );
  }

  const { pct, total, correct, xpEarned, coinsEarned, starsEarned, answers, unitIndex, topicIndex, levelIndex } = lastResults;
  const isPassed = pct >= 70;

  return (
    <div className="min-h-screen bg-[#07091B] text-white font-sans p-4 md:p-6 pb-24 select-none">
      <div className="max-w-xl mx-auto bg-[#130B29]/95 border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-2xl animate-fadeIn">
        {/* Header result */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2 animate-bounce" style={{ animationDuration: '2s' }}>
            {isPassed ? '🏆' : '💪'}
          </div>

          <h1 className="text-2xl font-black text-white">
            {isPassed ? '¡Felicitaciones!' : '¡Buen Intento!'}
          </h1>
          <p className="text-xs font-bold text-purple-200 mt-1">
            {isPassed
              ? 'Has completado con éxito este nivel matemático.'
              : 'Sigue practicando para alcanzar el 70% de aciertos.'}
          </p>

          {/* Percentage badge */}
          <div className="my-4">
            <span
              className={`text-4xl md:text-5xl font-black px-6 py-2 rounded-2xl inline-block shadow-lg ${
                isPassed
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-amber-500 text-purple-950 shadow-amber-500/30'
              }`}
            >
              {pct}%
            </span>
          </div>

          <p className="text-xs font-bold text-gray-400">
            {correct} de {total} respuestas correctas
          </p>
        </div>

        {/* Rewards earned */}
        <div className="grid grid-cols-3 gap-3 bg-purple-950/40 p-4 rounded-2xl border border-purple-800/40 mb-6 text-center">
          <div>
            <div className="text-xl font-black text-amber-400">+{coinsEarned} 🪙</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Monedas</div>
          </div>
          <div>
            <div className="text-xl font-black text-yellow-300">+{starsEarned} ⭐</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Estrellas</div>
          </div>
          <div>
            <div className="text-xl font-black text-emerald-400">+{xpEarned} 🌱</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Puntos XP</div>
          </div>
        </div>

        {/* Answers Review */}
        <div className="mb-6">
          <h2 className="text-xs font-black text-purple-300 uppercase tracking-wider mb-3">
            Revisión de respuestas ({answers.length}):
          </h2>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {answers.map((ans, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 ${
                  ans.ok
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                    : 'bg-red-950/30 border-red-500/30 text-red-200'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="truncate text-white">{ans.q}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    Tu respuesta: <span className="font-mono">{ans.user}</span>
                    {!ans.ok && (
                      <span className="text-emerald-400 ml-2">
                        (Correcta: {ans.correct})
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-base shrink-0">{ans.ok ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => startLevel(unitIndex, topicIndex, levelIndex)}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-black text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
          >
            🔄 Repetir Nivel
          </button>
          <button
            type="button"
            onClick={() => selectUnit(unitIndex)}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-purple-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/30 hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            Continuar en Unidad 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
