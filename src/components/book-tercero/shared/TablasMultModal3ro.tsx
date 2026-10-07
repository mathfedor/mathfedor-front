'use client';

import React, { useState } from 'react';
import { fedorSpeak, stopFedorSpeak } from './Grade3Speech';

interface TablasMultModal3roProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUnit?: (unitIndex: number) => void;
}

const TABLE_EMOJIS = ['🟡', '🔵', '🟢', '🔴', '🟣', '🟠', '🌟', '💎', '⭐', '🎯', '🚀', '⚡'];

export default function TablasMultModal3ro({
  isOpen,
  onClose,
  onSelectUnit,
}: TablasMultModal3roProps) {
  const [selectedTable, setSelectedTable] = useState<number>(2);
  const [activeMode, setActiveMode] = useState<'visual' | 'quiz'>('visual');

  // Mini quiz state
  const [quizFactor, setQuizFactor] = useState<number>(3);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);

  if (!isOpen) return null;

  const currentEmoji = TABLE_EMOJIS[(selectedTable - 1) % TABLE_EMOJIS.length];

  const handleSpeakTable = () => {
    const lines: string[] = [];
    for (let i = 1; i <= 10; i++) {
      lines.push(`${selectedTable} por ${i}, ${selectedTable * i}`);
    }
    const txt = `Tabla del ${selectedTable}: ${lines.join('. ')}.`;
    fedorSpeak(txt);
  };

  const handleSpeakRow = (n: number, m: number) => {
    fedorSpeak(`${n} por ${m} es igual a ${n * m}`);
  };

  const startQuizQuestion = (tableNum: number) => {
    const randomMultiplier = Math.floor(Math.random() * 10) + 1;
    setQuizFactor(randomMultiplier);
    setQuizAnswer(null);
    setQuizFeedback(null);
  };

  const handleAnswerQuiz = (chosen: number) => {
    const correct = selectedTable * quizFactor;
    setQuizAnswer(chosen);
    if (chosen === correct) {
      setQuizFeedback('correct');
      setQuizScore((prev) => prev + 1);
      fedorSpeak(`¡Excelente! ${selectedTable} por ${quizFactor} es ${correct}.`);
      setTimeout(() => {
        startQuizQuestion(selectedTable);
      }, 1400);
    } else {
      setQuizFeedback('wrong');
      fedorSpeak(`Casi. ${selectedTable} por ${quizFactor} es ${correct}.`);
    }
  };

  const correctVal = selectedTable * quizFactor;
  const quizOptions = Array.from(
    new Set([
      correctVal,
      Math.max(1, correctVal + selectedTable),
      Math.max(1, correctVal - selectedTable),
      correctVal + 2,
    ])
  ).slice(0, 4).sort(() => Math.random() - 0.5);

  return (
    <div
      className="fixed inset-0 z-[99995] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopFedorSpeak();
          onClose();
        }
      }}
    >
      {/* Modal Shell - 640px compacto y perfectamente centrado */}
      <div
        className="w-full max-w-[640px] max-h-[92vh] bg-white rounded-[26px] shadow-2xl p-6 sm:p-8 relative border border-slate-100 flex flex-col overflow-hidden animate-popIn"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-[#9333EA] to-[#6B21A8] flex items-center justify-center shadow-xs border border-white/80 shrink-0">
              <span className="text-white font-black text-sm leading-none">✖</span>
            </div>

            <h2 className="text-xl sm:text-[22px] font-black text-[#2A0F60] tracking-tight">
              Tablas de Multiplicar — 3°
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              stopFedorSpeak();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-[#F0EDFF] hover:bg-[#E4D9F5] text-[#5C21A6] font-black text-lg flex items-center justify-center cursor-pointer transition-colors border-none"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 space-y-5 pr-1">
          {/* Controls: Table Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#5C21A6]">
                SELECCIONA LA TABLA:
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode(activeMode === 'visual' ? 'quiz' : 'visual');
                    if (activeMode === 'visual') startQuizQuestion(selectedTable);
                  }}
                  className={`px-3 py-1 rounded-xl font-black text-xs cursor-pointer transition-all border-none ${
                    activeMode === 'quiz'
                      ? 'bg-amber-400 text-gray-900 shadow-xs'
                      : 'bg-[#F2EDFB] text-[#5C21A6] hover:bg-[#E7DCFA]'
                  }`}
                >
                  {activeMode === 'quiz' ? '📖 Ver Tabla' : '⚡ Mini Reto'}
                </button>

                {activeMode === 'visual' && (
                  <button
                    type="button"
                    onClick={handleSpeakTable}
                    className="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#5C21A6] font-black text-xs cursor-pointer transition-colors flex items-center gap-1 border-none shadow-2xs"
                    title="Escuchar toda la tabla"
                  >
                    <span>🔊</span>
                    <span>Escuchar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Grid of table buttons ×1 to ×12 */}
            <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const num = i + 1;
                const isSelected = selectedTable === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setSelectedTable(num);
                      if (activeMode === 'quiz') startQuizQuestion(num);
                    }}
                    className={`h-10 rounded-xl font-black text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-center border-none shadow-2xs ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#E85D04] to-[#C84800] text-white shadow-md scale-105'
                        : 'bg-[#F7F4FD] text-[#3D1468] hover:bg-purple-100 hover:text-purple-900'
                    }`}
                  >
                    ×{num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode 1: Visual Table */}
          {activeMode === 'visual' ? (
            <div className="bg-[#FAF8FF] border border-purple-100 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-purple-100 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[#2A0F60]">
                    Tabla del {selectedTable}
                  </span>
                  <span className="text-base">{currentEmoji}</span>
                </div>
                <span className="text-[11px] text-purple-700 font-extrabold bg-purple-100 px-2.5 py-0.5 rounded-full">
                  Suma grupos de {selectedTable}
                </span>
              </div>

              {/* Rows List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto p-1">
                {Array.from({ length: 10 }).map((_, i) => {
                  const m = i + 1;
                  const res = selectedTable * m;
                  return (
                    <div
                      key={m}
                      onClick={() => handleSpeakRow(selectedTable, m)}
                      className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-purple-100 hover:border-amber-400 hover:bg-amber-50/20 transition-all cursor-pointer shadow-2xs gap-2"
                    >
                      <div className="flex items-center gap-1.5 min-w-[110px]">
                        <span className="font-extrabold text-sm text-gray-800">
                          {selectedTable} × {m} =
                        </span>
                        <span className="font-black text-base text-[#6C28B4]">
                          {res}
                        </span>
                      </div>

                      {/* Visual Groups */}
                      <div className="flex flex-wrap items-center gap-1 flex-1">
                        {Array.from({ length: m }).map((__, gIdx) => (
                          <div
                            key={gIdx}
                            className="flex items-center gap-0.5 bg-[#F6F2FF] border border-purple-200/50 px-1 py-0.5 rounded-md"
                            title={`Grupo ${gIdx + 1} de ${selectedTable}`}
                          >
                            {Array.from({ length: selectedTable }).map((___, kIdx) => (
                              <span key={kIdx} className="text-[11px] leading-none">
                                {currentEmoji}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeakRow(selectedTable, m);
                        }}
                        className="text-xs text-purple-600 hover:text-purple-900 px-1.5 py-1 rounded hover:bg-purple-100 font-bold border-none"
                        title="Escuchar"
                      >
                        🔊
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Mode 2: Mini Quiz */
            <div className="bg-[#FFFDF7] border-2 border-amber-300 rounded-2xl p-5 text-center space-y-4">
              <div className="flex items-center justify-between text-[11px] font-black uppercase text-gray-500">
                <span>⚡ Mini Reto: Tabla del {selectedTable}</span>
                <span className="text-amber-600 font-extrabold">Aciertos: ⭐ {quizScore}</span>
              </div>

              <div className="py-2">
                <div className="text-3xl font-black text-[#1E0B4B] mb-1 tracking-wide">
                  {selectedTable} × {quizFactor} = ¿ ?
                </div>
                <p className="text-xs text-gray-500 font-bold">
                  Selecciona la respuesta correcta:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                {quizOptions.map((opt) => {
                  const isChosen = quizAnswer === opt;
                  const isCorrect = opt === correctVal;
                  let btnColor = 'bg-white text-purple-900 border-2 border-purple-200 hover:bg-purple-50';

                  if (quizAnswer !== null) {
                    if (isCorrect) {
                      btnColor = 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-md';
                    } else if (isChosen) {
                      btnColor = 'bg-rose-500 text-white border-2 border-rose-600 shadow-md';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={quizAnswer !== null}
                      onClick={() => handleAnswerQuiz(opt)}
                      className={`p-3 rounded-2xl font-black text-lg transition-all cursor-pointer ${btnColor}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizFeedback === 'correct' && (
                <div className="text-emerald-700 font-black text-xs animate-popIn">
                  🎉 ¡Correcto! ¡Puntaje sumado!
                </div>
              )}
              {quizFeedback === 'wrong' && (
                <div className="text-rose-600 font-black text-xs animate-popIn">
                  ❌ Recuerda: {selectedTable} × {quizFactor} = {correctVal}.
                  <button
                    type="button"
                    onClick={() => startQuizQuestion(selectedTable)}
                    className="ml-2 underline font-bold cursor-pointer border-none bg-transparent text-xs"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
