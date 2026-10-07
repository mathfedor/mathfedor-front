'use client';

import React, { useState } from 'react';
import { fedorSpeak, stopFedorSpeak } from './Grade3Speech';

interface TablasConteoModal3roProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUnit?: (unitIndex: number) => void;
}

interface ConteoItem {
  id: string;
  label: string;
  step: number;
  max: number;
  isImage: boolean;
}

const CONTEOS_IMG: ConteoItem[] = [
  { id: 'img-1', label: 'De 1 en 1 hasta 10', step: 1, max: 10, isImage: true },
  { id: 'img-2', label: 'De 1 en 1 hasta 20', step: 1, max: 20, isImage: true },
  { id: 'img-3', label: 'De 1 en 1 hasta 30', step: 1, max: 30, isImage: true },
  { id: 'img-4', label: 'De 1 en 1 hasta 50', step: 1, max: 50, isImage: true },
  { id: 'img-5', label: 'De 1 en 1 hasta 100', step: 1, max: 100, isImage: true },
  { id: 'img-6', label: 'De 3 en 3 hasta 30', step: 3, max: 30, isImage: true },
  { id: 'img-7', label: 'De 5 en 5 hasta 50', step: 5, max: 50, isImage: true },
  { id: 'img-8', label: 'De 10 en 10 hasta 100', step: 10, max: 100, isImage: true },
];

const CONTEOS_NO_IMG: ConteoItem[] = [
  { id: 'noimg-1', label: 'De 20 en 20 hasta 200', step: 20, max: 200, isImage: false },
  { id: 'noimg-2', label: 'De 50 en 50 hasta 500', step: 50, max: 500, isImage: false },
  { id: 'noimg-3', label: 'De 100 en 100 hasta 1.000', step: 100, max: 1000, isImage: false },
  { id: 'noimg-4', label: 'De 1.000 en 1.000 hasta 10.000', step: 1000, max: 10000, isImage: false },
  { id: 'noimg-5', label: 'De 10.000 en 10.000 hasta 100.000', step: 10000, max: 100000, isImage: false },
];

const EMOJIS = ['🍎', '⭐', '🌟', '🎈', '🐟', '🦋', '🌸', '🎁', '🍭', '🎨', '🐶', '🐱', '🦊'];

export default function TablasConteoModal3ro({
  isOpen,
  onClose,
  onSelectUnit,
}: TablasConteoModal3roProps) {
  const [selectedConteo, setSelectedConteo] = useState<ConteoItem | null>(null);

  if (!isOpen) return null;

  const count = selectedConteo ? Math.floor(selectedConteo.max / selectedConteo.step) : 0;
  const emoji = selectedConteo ? EMOJIS[selectedConteo.step % EMOJIS.length] : '⭐';

  const handleSelect = (item: ConteoItem) => {
    if (selectedConteo?.id === item.id) {
      setSelectedConteo(null);
      stopFedorSpeak();
    } else {
      setSelectedConteo(item);
      const steps: number[] = [];
      const totalSteps = Math.floor(item.max / item.step);
      for (let i = 1; i <= Math.min(totalSteps, 10); i++) {
        steps.push(item.step * i);
      }
      fedorSpeak(`Tabla: ${item.label}. Conteo: ${steps.join(', ')}.`);
    }
  };

  const handleSpeakFull = () => {
    if (!selectedConteo) return;
    const steps: number[] = [];
    const totalSteps = Math.floor(selectedConteo.max / selectedConteo.step);
    for (let i = 1; i <= Math.min(totalSteps, 20); i++) {
      steps.push(selectedConteo.step * i);
    }
    fedorSpeak(`Conteo ${selectedConteo.label}: ${steps.join(', ')}.`);
  };

  return (
    <div
      className="fixed inset-0 z-[99995] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopFedorSpeak();
          setSelectedConteo(null);
          onClose();
        }
      }}
    >
      {/* ══ Modal Card - Replica idéntica a Imagen 2 ══ */}
      <div
        className="w-full max-w-[640px] bg-white rounded-[26px] shadow-2xl p-6 sm:p-8 relative border border-slate-100 animate-popIn"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header (Izquierda: Icono 12/34 y Título | Derecha: Botón cerrar circular lila) */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Blue 1 2 / 3 4 Tile Icon */}
            <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-[#4EA6FF] to-[#2075E8] flex flex-col items-center justify-center p-0.5 shadow-xs border border-white/80 shrink-0">
              <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-[8.5px] font-black text-white leading-none">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-[22px] font-black text-[#2A0F60] tracking-tight">
              Tablas de Conteo — 3°
            </h2>
          </div>

          {/* Close button - Circular Lila */}
          <button
            type="button"
            onClick={() => {
              stopFedorSpeak();
              setSelectedConteo(null);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-[#F0EDFF] hover:bg-[#E4D9F5] text-[#5C21A6] font-black text-lg flex items-center justify-center cursor-pointer transition-colors border-none"
            title="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {/* ══ SECCIÓN 1: CON IMÁGENES ══ */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-sm">🖼️</span>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#5C21A6]">
              CON IMÁGENES:
            </span>
          </div>

          {/* 3 Columnas fijas con los 8 botones naranja idénticos a la imagen 2 */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {CONTEOS_IMG.map((item) => {
              const isSelected = selectedConteo?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`h-11 sm:h-[44px] px-2 rounded-xl font-black text-[11px] sm:text-[11.5px] text-white flex items-center justify-center text-center cursor-pointer transition-all border-none leading-tight shadow-xs ${
                    isSelected
                      ? 'bg-[#C04200] ring-3 ring-orange-300 scale-[1.02] shadow-md'
                      : 'bg-[#F25C05] hover:bg-[#E45300] hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ SECCIÓN 2: SIN IMÁGENES ══ */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="w-[18px] h-[18px] rounded bg-gradient-to-br from-[#4EA6FF] to-[#2075E8] flex flex-col items-center justify-center p-0.5 leading-none shrink-0">
              <div className="grid grid-cols-2 gap-0.5 text-[5px] font-black text-white leading-none">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
              </div>
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#5C21A6]">
              SIN IMÁGENES:
            </span>
          </div>

          {/* 3 Columnas fijas con los 5 botones violeta idénticos a la imagen 2 */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {CONTEOS_NO_IMG.map((item) => {
              const isSelected = selectedConteo?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`h-11 sm:h-[44px] px-2 rounded-xl font-black text-[10.5px] sm:text-[11px] text-white flex items-center justify-center text-center cursor-pointer transition-all border-none leading-tight shadow-xs ${
                    isSelected
                      ? 'bg-[#43107C] ring-3 ring-purple-300 scale-[1.02] shadow-md'
                      : 'bg-[#6624B5] hover:bg-[#591DA2] hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  <span className="max-w-[160px] line-clamp-2">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ DETALLE DESPLEGABLE CUANDO SE SELECCIONA UNA TABLA ══ */}
        {selectedConteo && (
          <div className="mt-4 p-4 bg-[#FFF9EE] border-2 border-[#F97316] rounded-2xl shadow-sm animate-popIn">
            <div className="flex items-center justify-between pb-2.5 border-b border-orange-200 mb-3">
              <div>
                <div className="text-sm font-black text-[#A04000]">
                  {selectedConteo.label} — <span className="text-orange-600 font-extrabold">{count} pasos</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSpeakFull}
                  className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-black text-xs cursor-pointer transition-colors flex items-center gap-1 shadow-xs border-none"
                  title="Escuchar secuencia"
                >
                  <span>🔊</span>
                  <span>Escuchar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedConteo(null)}
                  className="px-2 py-1 rounded-lg bg-white hover:bg-gray-100 text-gray-600 font-bold text-xs cursor-pointer border border-gray-200 transition-colors"
                >
                  Ocultar ✕
                </button>
              </div>
            </div>

            {/* Display grid */}
            {selectedConteo.isImage && selectedConteo.step <= 10 && selectedConteo.max <= 100 ? (
              <div className="flex flex-wrap gap-2 max-h-[240px] overflow-y-auto p-1">
                {Array.from({ length: count }).map((_, i) => {
                  const val = selectedConteo.step * (i + 1);
                  const cols = selectedConteo.step === 1 ? 1 : selectedConteo.step <= 3 ? selectedConteo.step : 5;
                  return (
                    <div
                      key={val}
                      onClick={() => fedorSpeak(`Número ${val}`)}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-orange-200 hover:border-orange-500 hover:scale-105 transition-all shadow-2xs cursor-pointer"
                      style={{ minWidth: '66px' }}
                    >
                      <div
                        className="grid gap-0.5 justify-items-center mb-1"
                        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                      >
                        {Array.from({ length: selectedConteo.step }).map((__, eIdx) => (
                          <span key={eIdx} className="text-xs leading-none">
                            {emoji}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs font-black text-[#A03000]">{val}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto p-1">
                {Array.from({ length: count }).map((_, i) => {
                  const val = selectedConteo.step * (i + 1);
                  const fmt = val >= 1000 ? val.toLocaleString('es-CO') : val;
                  return (
                    <div
                      key={val}
                      onClick={() => fedorSpeak(`Número ${val}`)}
                      className="px-3 py-1.5 rounded-xl bg-[#5C21A6] hover:bg-[#722BC9] text-white font-black text-xs cursor-pointer shadow-2xs hover:scale-105 transition-all"
                    >
                      {fmt}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
