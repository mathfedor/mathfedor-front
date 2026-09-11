'use client';

import React from 'react';
import { useBook3 } from '../context/Book3Context';

export default function UnitScreen3ro() {
  const { book, currentUnit, currentTopic, scores, goScreen, startLevel, selectTopic } = useBook3();

  const unit = book?.units?.[currentUnit] || book?.units?.[0];
  if (!unit) return null;

  return (
    <div className="min-h-screen bg-[#07091B] text-white font-sans p-4 md:p-6 pb-24 select-none">
      {/* Back button */}
      <button
        type="button"
        onClick={() => goScreen('home')}
        className="inline-flex items-center gap-2 text-xs font-black text-amber-300 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 mb-4 cursor-pointer transition-colors"
      >
        <span>←</span>
        <span>Volver a Unidades</span>
      </button>

      {/* Unit Header Card */}
      <div className="bg-gradient-to-r from-[#1E0942] via-[#2A0E5A] to-[#1E0942] border border-purple-500/40 rounded-3xl p-6 shadow-2xl mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-3xl shrink-0 shadow-lg">
            {unit.icon || '📘'}
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/30">
              Unidad {currentUnit + 1}
            </span>
            <h1 className="text-xl md:text-2xl font-black text-white mt-1">
              {unit.name}
            </h1>
            <p className="text-xs font-bold text-purple-200/80 mt-1">
              {unit.std || 'Pensamiento Numérico · Grado 3° · MEN Colombia'}
            </p>
          </div>
        </div>
      </div>

      {/* Topics & Levels */}
      <div className="space-y-6">
        {(unit.topics || []).map((topic, tIdx) => {
          return (
            <div
              key={tIdx}
              className="bg-[#120926]/90 border border-purple-500/20 rounded-3xl p-5 shadow-xl"
            >
              {/* Topic Header */}
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-purple-800/30">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-purple-950/60 border border-purple-500/20">
                    {topic.icon || '📝'}
                  </span>
                  <div>
                    <h2 className="text-base font-black text-white">
                      {topic.title}
                    </h2>
                    {topic.desc && (
                      <p className="text-xs font-bold text-gray-400 mt-0.5">
                        {topic.desc}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Levels Grid (5 Levels) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {(topic.levels || []).map((lv, lIdx) => {
                  const levelKey = `${topic.id}-n${lIdx + 1}`;
                  const score = scores[levelKey] || 0;
                  const isCompleted = score >= 70;

                  return (
                    <button
                      key={lIdx}
                      type="button"
                      onClick={() => startLevel(currentUnit, tIdx, lIdx)}
                      className="p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 cursor-pointer hover:scale-102 active:scale-98 relative overflow-hidden group shadow-md"
                      style={{
                        background: lv.bg || '#DCF5EE',
                        borderColor: lv.color || '#074F3A',
                        color: lv.color || '#074F3A',
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/70 shadow-xs">
                          {lv.short || `N${lIdx + 1}`}
                        </span>
                        {isCompleted ? (
                          <span className="text-xs font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                            ✓ {score}%
                          </span>
                        ) : score > 0 ? (
                          <span className="text-xs font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                            {score}%
                          </span>
                        ) : (
                          <span className="text-xs opacity-60">▶</span>
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-black leading-tight line-clamp-2 mt-1">
                          {lv.label}
                        </div>
                        <div className="text-[10px] font-bold opacity-80 mt-1">
                          {lv.exercises?.length || 21} ejercicios
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
