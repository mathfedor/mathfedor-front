'use client';

import React, { useState } from 'react';

interface VideosModal3roProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenIntro?: () => void;
}

interface VideoTopic {
  id: string;
  unit: number;
  title: string;
  duration: string;
  desc: string;
  emoji: string;
}

const VIDEO_LIST: VideoTopic[] = [
  // U1
  {
    id: 'u1-1',
    unit: 1,
    title: 'Adición con Llevadas de 3 Cifras',
    duration: '2:45 min',
    desc: 'Aprende a sumar reagrupando unidades a decenas y centenas paso a paso con Fedor.',
    emoji: '➕',
  },
  {
    id: 'u1-2',
    unit: 1,
    title: 'La Recta Numérica y Saltos de Conteo',
    duration: '2:10 min',
    desc: 'Cómo ubicar números de 3 cifras y dar saltos de 5 en 5 y 10 en 10.',
    emoji: '📏',
  },
  // U2
  {
    id: 'u2-1',
    unit: 2,
    title: 'Sustracción Desagrupando (Prestando)',
    duration: '3:05 min',
    desc: 'El secreto para restar cuando el minuendo tiene ceros o cifras menores.',
    emoji: '➖',
  },
  // U3
  {
    id: 'u3-1',
    unit: 3,
    title: 'El Secreto de las Tablas de Multiplicar',
    duration: '3:20 min',
    desc: 'Comprende la multiplicación como filas, columnas y grupos repetidos sin memorización forzada.',
    emoji: '✖️',
  },
  {
    id: 'u3-2',
    unit: 3,
    title: 'Multiplicación por 1 Cifra con Llevadas',
    duration: '2:50 min',
    desc: 'Resuelve multiplicaciones de 2 y 3 cifras por números del 2 al 9 con facilidad.',
    emoji: '⚡',
  },
  // U4
  {
    id: 'u4-1',
    unit: 4,
    title: 'División Exacta: Repartos Equitativos',
    duration: '3:15 min',
    desc: 'Repartir tesoros cósmicos en partes iguales entre tripulantes espaciales.',
    emoji: '➗',
  },
  // U5
  {
    id: 'u5-1',
    unit: 5,
    title: '¿Qué es una Fracción? Medios y Cuartos',
    duration: '2:30 min',
    desc: 'Descubre el numerador y denominador repartiendo pizzas y tartas lunares.',
    emoji: '🍕',
  },
  // U6
  {
    id: 'u6-1',
    unit: 6,
    title: 'Perímetro y Área de Figuras Planas',
    duration: '2:40 min',
    desc: 'Mide el contorno y la superficie de rectángulos, cuadrados y naves espaciales.',
    emoji: '📐',
  },
  // U7
  {
    id: 'u7-1',
    unit: 7,
    title: 'Lectura de Gráficas de Barras y Encuestas',
    duration: '3:00 min',
    desc: 'Interpreta tablas de frecuencias y descubre la moda en las estadísticas del salón.',
    emoji: '📊',
  },
];

const UNIT_TABS = [
  { unit: 1, label: 'U1: Suma' },
  { unit: 2, label: 'U2: Resta' },
  { unit: 3, label: 'U3: Multiplicar' },
  { unit: 4, label: 'U4: División' },
  { unit: 5, label: 'U5: Fracciones' },
  { unit: 6, label: 'U6: Medición' },
  { unit: 7, label: 'U7: Estadística' },
];

export default function VideosModal3ro({ isOpen, onClose, onOpenIntro }: VideosModal3roProps) {
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [activeVideo, setActiveVideo] = useState<VideoTopic>(VIDEO_LIST[0]);

  if (!isOpen) return null;

  const currentVideos = VIDEO_LIST.filter((v) => v.unit === selectedUnit);

  return (
    <div
      className="fixed inset-0 z-[99995] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Shell - 640px centrado y espacioso */}
      <div
        className="w-full max-w-[640px] max-h-[92vh] bg-white rounded-[26px] shadow-2xl p-6 sm:p-8 relative border border-slate-100 flex flex-col overflow-hidden animate-popIn"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center shadow-xs border border-white/80 shrink-0">
              <span className="text-base leading-none">🎬</span>
            </div>

            <h2 className="text-xl sm:text-[22px] font-black text-[#2A0F60] tracking-tight">
              Videos Educativos — 3°
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F0EDFF] hover:bg-[#E4D9F5] text-[#5C21A6] font-black text-lg flex items-center justify-center cursor-pointer transition-colors border-none"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Unit Tabs */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-3 mb-2 border-b border-gray-100">
          <div className="flex items-center gap-1.5 shrink-0">
            {UNIT_TABS.map((tab) => {
              const isSelected = selectedUnit === tab.unit;
              return (
                <button
                  key={tab.unit}
                  type="button"
                  onClick={() => {
                    setSelectedUnit(tab.unit);
                    const firstOfUnit = VIDEO_LIST.find((v) => v.unit === tab.unit);
                    if (firstOfUnit) setActiveVideo(firstOfUnit);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl font-black text-xs cursor-pointer transition-all border-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-xs'
                      : 'bg-[#F7F4FD] text-[#3D1468] hover:bg-purple-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {onOpenIntro && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenIntro();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-xs cursor-pointer transition-colors shrink-0 shadow-xs border-none"
            >
              🚀 Intro
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          {/* Main Video Box */}
          <div className="bg-[#120A29] rounded-2xl overflow-hidden border border-purple-800 shadow-sm text-white">
            <div className="aspect-video w-full bg-gradient-to-b from-[#1C0D42] to-[#0A041A] flex flex-col items-center justify-center relative p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xl shadow-md shadow-amber-400/30 mb-2 hover:scale-110 transition-transform cursor-pointer">
                ▶
              </div>
              <div className="text-sm sm:text-base font-black text-amber-300 max-w-sm mb-1 z-10">
                {activeVideo.title}
              </div>
              <div className="text-[11px] text-purple-200 max-w-sm z-10 font-bold leading-relaxed line-clamp-2">
                {activeVideo.desc}
              </div>
              <div className="mt-2 px-2.5 py-0.5 rounded-full bg-purple-900/80 border border-purple-700 text-[10px] font-bold text-purple-200">
                ⏱️ {activeVideo.duration} · Video Animado 3°
              </div>
            </div>
          </div>

          {/* Video List */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-[#5C21A6] mb-2">
              VIDEOS DISPONIBLES:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentVideos.map((vid) => {
                const isCur = activeVideo.id === vid.id;
                return (
                  <div
                    key={vid.id}
                    onClick={() => setActiveVideo(vid)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      isCur
                        ? 'bg-purple-50 border-purple-600 shadow-xs scale-[1.01]'
                        : 'bg-[#FAF8FF] border-purple-100 hover:border-purple-300 hover:bg-white shadow-2xs'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-xl shrink-0">
                      {vid.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-xs text-[#2A0F60] truncate">
                        {vid.title}
                      </div>
                      <div className="text-[9.5px] text-gray-500 font-bold flex items-center gap-1.5 mt-0.5">
                        <span>⏱️ {vid.duration}</span>
                        <span>• Fedor Explica</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-black text-purple-700 shrink-0">
                      Ver ▶
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
