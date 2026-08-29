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
  const fullTextToRead = topic ? `${topic.title}. ${snippets.slice(0, 25).join('. ')}` : '';

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-[#0E0830]/85 backdrop-blur-md animate-in fade-in select-none font-['Nunito',sans-serif]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FFFCEF] rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.55)] max-h-[92vh] overflow-hidden flex flex-col border-[3px] border-[#FFE066]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#D97706] via-[#EAB308] to-[#FACC15] text-white p-4 sm:p-5 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center drop-shadow-sm">
            <svg viewBox="0 0 64 64" className="w-9 h-9" fill="none">
              {/* Green book */}
              <rect x="14" y="18" width="11" height="26" rx="2" fill="#4ADE80" />
              <rect x="14" y="41" width="11" height="3" fill="#E2E8F0" />
              <line x1="16" y1="21" x2="16" y2="41" stroke="#22C55E" strokeWidth="1.5" />
              {/* Red book */}
              <rect x="27" y="14" width="11" height="30" rx="2" fill="#F43F5E" />
              <rect x="27" y="41" width="11" height="3" fill="#E2E8F0" />
              <line x1="29" y1="17" x2="29" y2="41" stroke="#BE123C" strokeWidth="1.5" />
              {/* Blue book */}
              <rect x="40" y="20" width="11" height="24" rx="2" fill="#38BDF8" />
              <rect x="40" y="41" width="11" height="3" fill="#E2E8F0" />
              <line x1="42" y1="23" x2="42" y2="41" stroke="#0284C7" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-black font-['Baloo_2',sans-serif] leading-tight text-white drop-shadow-xs">
              Conceptos Fedor
            </h3>
            <p className="text-xs sm:text-sm font-bold text-white/95 mt-0.5">
              Tomado del libro original de 1° de primaria
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#78350F] font-black text-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
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
                  className={`px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border-2 text-center leading-tight flex items-center justify-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C27803] to-[#E59A18] text-white border-[#9A5A00] shadow-md scale-[1.02]'
                      : 'bg-[#FDF3DE] text-[#7A3200] border-[#E9D5B5] hover:bg-[#FCECD0]'
                  }`}
                >
                  <span className="text-base">{t.emoji}</span>
                  <span className="truncate">{t.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Section Content Card */}
          {topic ? (
            <div className="bg-white border-2 border-[#FED7AA] rounded-2xl p-4 sm:p-6 shadow-sm mb-4">
              {/* Section Header with Audio Speaker Button */}
              <div className="flex items-center justify-between border-b-2 border-dashed border-[#FED7AA] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <h4 className="font-['Baloo_2',sans-serif] text-lg sm:text-xl font-black text-[#7A1B00]">
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
              <div className="flex flex-col gap-2.5">
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
                        className="border-l-4 border-[#F59E0B] pl-3 py-1 font-black text-[#1E1B4B] text-base sm:text-lg mt-2"
                      >
                        {s}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="bg-[#FFFBEB] border-l-4 border-[#EAB308] rounded-xl p-3 text-sm sm:text-base font-bold text-slate-800 leading-relaxed shadow-2xs"
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
