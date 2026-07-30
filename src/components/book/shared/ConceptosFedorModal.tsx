'use client';

import { useState, useEffect } from 'react';
import { FEDOR_EXCEL_REFERENCE, ConceptTopic } from '../data/fedorConceptsData';

interface ConceptosFedorModalProps {
  onClose: () => void;
}

export default function ConceptosFedorModal({ onClose }: ConceptosFedorModalProps) {
  const keys = Object.keys(FEDOR_EXCEL_REFERENCE);
  const [activeKey, setActiveKey] = useState<string>(keys[0] || 'addition');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const topic: ConceptTopic | undefined = FEDOR_EXCEL_REFERENCE[activeKey];

  // Cancel speech on unmount or tab change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeKey]);

  const handleSpeak = (textToRead: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(textToRead);
      u.lang = 'es-ES';
      u.rate = 0.92;
      u.pitch = 1.0;
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(u);
    }
  };

  const snippets = topic?.snippets || [];

  // Combine text for TTS
  const fullTextToRead = topic ? `${topic.title}. ${snippets.join('. ')}` : '';

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-[#0E0830]/85 backdrop-blur-md animate-fade-in select-none font-nunito"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FFFCEF] rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.55)] max-h-[92vh] overflow-hidden flex flex-col border-[3px] border-[#FFE066]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#BA7517] via-[#D97706] to-[#F5C518] text-white p-4 sm:p-5 flex items-center gap-3.5 shadow-md">
          <span className="text-3xl sm:text-4xl filter drop-shadow">📚</span>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-black font-baloo leading-tight">
              Conceptos Fedor
            </h3>
            <p className="text-xs sm:text-sm font-bold text-white/90">
              Tomado del libro original de 1° de primaria
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/25 hover:bg-white/40 text-white font-black text-xl flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gradient-to-b from-[#FFF8E0] to-[#FFFCEF]">
          {/* Topic Tabs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-5">
            {keys.map((k) => {
              const t = FEDOR_EXCEL_REFERENCE[k];
              const isActive = activeKey === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setActiveKey(k);
                    setIsSpeaking(false);
                  }}
                  className={`px-3 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border-2 text-center leading-tight flex items-center justify-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#BA7517] to-[#F5C518] text-white border-[#BA7517] shadow-md scale-[1.02]'
                      : 'bg-white/90 text-[#7A3200] border-[#E5C384] hover:bg-[#FFE4A8]'
                  }`}
                >
                  <span className="text-base">{t.emoji}</span>
                  <span>{t.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Section Content Card */}
          {topic ? (
            <div className="bg-white border-2 border-[#FFB066] rounded-2xl p-4 sm:p-6 shadow-sm mb-4">
              {/* Section Header with Audio Speaker Button */}
              <div className="flex items-center justify-between border-b-2 border-dashed border-[#FFC58A] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <h4 className="font-baloo text-lg sm:text-xl font-black text-[#7A1B00]">
                    Conceptos clave
                  </h4>
                </div>

                {/* Speaker TTS Button */}
                <button
                  type="button"
                  onClick={() => handleSpeak(fullTextToRead)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-amber-500 text-white animate-pulse scale-110'
                      : 'bg-[#00B4D8] hover:bg-[#0284C7] text-white hover:scale-105 active:scale-95'
                  }`}
                  title={isSpeaking ? 'Detener lectura en voz alta' : 'Escuchar conceptos en voz alta'}
                  aria-label="Escuchar en voz alta"
                >
                  <span className="text-lg">{isSpeaking ? '⏹️' : '🔊'}</span>
                </button>
              </div>

              {/* Snippets List */}
              <div className="flex flex-col gap-3">
                {snippets.map((s, idx) => {
                  const isTitleHeading =
                    idx < 3 ||
                    s === 'Operaciones Básicas' ||
                    s === 'La Adición o Suma' ||
                    s === 'Los Números Cardinales' ||
                    s.startsWith('La ') ||
                    s.startsWith('Los ') ||
                    s.startsWith('Concepto');

                  if (isTitleHeading && s.length < 35) {
                    return (
                      <div
                        key={idx}
                        className="border-l-4 border-[#F59E0B] pl-3 py-1 font-black text-[#3D1468] text-base sm:text-lg mt-2"
                      >
                        {s}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="bg-[#FFFDF0] border-l-4 border-[#F59E0B] border-t border-b border-r border-[#FDE68A] rounded-xl p-3.5 shadow-xs text-sm sm:text-base font-bold text-slate-800 leading-relaxed"
                    >
                      {s}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-[#7A3200] font-bold">
              No hay contenido disponible.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
