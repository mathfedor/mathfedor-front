'use client';

import React from 'react';
import { useBook } from '../context/BookContext';
import { fedorTTS } from '@/services/tts.service';

export default function ConteoScreen() {
  const { book, goScreen } = useBook();

  const handleSpeak = (text: string) => {
    try {
      fedorTTS.speak(text);
    } catch {
      // ignore
    }
  };

  // Base emojis for 1 to 10
  const BASE_1_10 = [
    { num: 1, emojis: '⭐' },
    { num: 2, emojis: '🍎🍎' },
    { num: 3, emojis: '🐱🐱🐱' },
    { num: 4, emojis: '⚽⚽⚽⚽' },
    { num: 5, emojis: '🐶🐶🐶🐶🐶' },
    { num: 6, emojis: '🌸🌸🌸🌸🌸🌸' },
    { num: 7, emojis: '🎈🎈🎈🎈🎈🎈🎈' },
    { num: 8, emojis: '🌟🌟🌟🌟🌟🌟🌟🌟' },
    { num: 9, emojis: '🚀🚀🚀🚀🚀🚀🚀🚀🚀' },
    { num: 10, emojis: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪' },
  ];

  // Base emojis icons by index
  const EMOJI_BY_INDEX = ['⭐', '🍎', '🐱', '⚽', '🐶', '🌸', '🎈', '🌟', '🚀', '🍪'];

  // Table 1 to 20
  const TABLE_1_20 = [
    ...BASE_1_10,
    { num: 11, emojis: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐+1' },
    { num: 12, emojis: '🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎+2' },
    { num: 13, emojis: '🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱+3' },
    { num: 14, emojis: '⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽+4' },
    { num: 15, emojis: '🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶+5' },
    { num: 16, emojis: '🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸+6' },
    { num: 17, emojis: '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈+7' },
    { num: 18, emojis: '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟+8' },
    { num: 19, emojis: '🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀+9' },
    { num: 20, emojis: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪+10' },
  ];

  // Table 1 to 30
  const TABLE_1_30 = [
    ...TABLE_1_20,
    { num: 21, emojis: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐+11' },
    { num: 22, emojis: '🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎+12' },
    { num: 23, emojis: '🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱+13' },
    { num: 24, emojis: '⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽+14' },
    { num: 25, emojis: '🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶+15' },
    { num: 26, emojis: '🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸+16' },
    { num: 27, emojis: '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈+17' },
    { num: 28, emojis: '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟+18' },
    { num: 29, emojis: '🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀+19' },
    { num: 30, emojis: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪+20' },
  ];

  // Table 1 to 50
  const TABLE_1_50 = [
    { num: 5, emojis: '⭐⭐⭐⭐⭐+' },
    { num: 10, emojis: '🍎🍎🍎🍎🍎+' },
    { num: 15, emojis: '🐱🐱🐱🐱🐱+' },
    { num: 20, emojis: '⚽⚽⚽⚽⚽+' },
    { num: 25, emojis: '🐶🐶🐶🐶🐶+' },
    { num: 30, emojis: '🌸🌸🌸🌸🌸+' },
    { num: 35, emojis: '🎈🎈🎈🎈🎈+' },
    { num: 40, emojis: '🌟🌟🌟🌟🌟+' },
    { num: 45, emojis: '🚀🚀🚀🚀🚀+' },
    { num: 50, emojis: '🍪🍪🍪🍪🍪+' },
  ];

  // Table 1 to 100
  const TABLE_1_100 = Array.from({ length: 10 }, (_, i) => {
    const num = (i + 1) * 10;
    const emoji = EMOJI_BY_INDEX[i];
    return {
      num,
      emojis: emoji.repeat(num),
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-3 px-3 md:px-6 select-none font-['Nunito',sans-serif]">
      {/* Top Banner 1: Estándares MEN */}
      <div
        onClick={() => goScreen('estandares')}
        className="w-full flex items-center gap-3.5 p-3 md:p-4 rounded-2xl bg-gradient-to-r from-[#F0FDF4] to-[#EBF6FB] border border-[#DDD8F5] shadow-xs cursor-pointer hover:shadow-md transition-all mb-2.5"
      >
        <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center font-black text-xs md:text-sm text-slate-800 flex-shrink-0">
          CO
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs md:text-sm font-bold text-slate-500">
            Estándares MEN
          </div>
          <div className="text-sm md:text-base font-black text-[#180D38]">
            Programa de 1° Colombia
          </div>
        </div>
      </div>

      {/* Top Banner 2: Problemas Cotidianos */}
      <div
        onClick={() => goScreen('problemas')}
        className="w-full flex items-center gap-3.5 p-3 md:p-4 rounded-2xl bg-gradient-to-r from-[#F0FDF4] to-[#E6FBF5] border border-[#DDD8F5] shadow-xs cursor-pointer hover:shadow-md transition-all mb-4"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16876A] to-[#24C496] flex items-center justify-center text-xl text-white shadow-xs flex-shrink-0">
          🛒
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm md:text-base font-black text-[#074F3A]">
            Problemas Cotidianos
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Conteo de monedas + compras + 4 operaciones
          </div>
        </div>
        <span className="text-[#16876A] font-black text-lg pr-1">→</span>
      </div>

      {/* Volver al inicio navigation */}
      <button
        type="button"
        onClick={() => goScreen('home')}
        className="text-[#6C28B4] font-bold text-xs md:text-sm hover:underline flex items-center gap-1 mb-3 cursor-pointer bg-transparent border-none p-0"
      >
        ← Volver al inicio
      </button>

      {/* Hero Header Banner */}
      <div className="w-full rounded-2xl md:rounded-3xl p-5 md:p-6 text-center text-white bg-gradient-to-r from-[#0A3A6A] via-[#1A6CB4] to-[#4DA6FF] shadow-md mb-5">
        <h1 className="text-2xl md:text-3xl font-black flex items-center justify-center gap-2 tracking-tight">
          <span>🔢</span>
          <span>Tablas de Conteo</span>
        </h1>
        <p className="text-xs md:text-sm font-extrabold text-[#FFE066] mt-1 tracking-wide">
          Aprende a contar visualmente
        </p>
      </div>

      {/* Table Section 1: Tabla 1 al 10 */}
      <div className="bg-white rounded-2xl p-4 md:p-5 mb-4 shadow-sm border border-[#E2E8F0]">
        <div className="font-black text-[#0A3A6A] text-sm md:text-base mb-3 flex items-center gap-1.5">
          <span>📊</span>
          <span>Tabla 1 al 10</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 md:gap-3">
          {BASE_1_10.map((item) => (
            <div
              key={item.num}
              onClick={() => handleSpeak(String(item.num))}
              className="bg-gradient-to-br from-[#F0F8FF] to-white rounded-xl p-3 text-center border border-[#1A6CB4]/15 flex flex-col items-center justify-between min-h-[90px] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer shadow-xs"
              title={`Número ${item.num}`}
            >
              <div className="flex-1 flex items-center justify-center flex-wrap gap-0.5 text-base md:text-lg min-h-[34px] leading-tight">
                {item.emojis}
              </div>
              <div className="font-black text-[#0A3A6A] text-sm md:text-base mt-1">
                {item.num}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section 2: Tabla 1 al 20 */}
      <div className="bg-white rounded-2xl p-4 md:p-5 mb-4 shadow-sm border border-[#E2E8F0]">
        <div className="font-black text-[#0A3A6A] text-sm md:text-base mb-3 flex items-center gap-1.5">
          <span>📊</span>
          <span>Tabla 1 al 20</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 md:gap-3">
          {TABLE_1_20.map((item) => (
            <div
              key={item.num}
              onClick={() => handleSpeak(String(item.num))}
              className="bg-gradient-to-br from-[#F0F8FF] to-white rounded-xl p-3 text-center border border-[#1A6CB4]/15 flex flex-col items-center justify-between min-h-[90px] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer shadow-xs"
              title={`Número ${item.num}`}
            >
              <div className="flex-1 flex items-center justify-center flex-wrap gap-0.5 text-xs md:text-sm font-bold min-h-[34px] leading-tight break-all text-slate-700">
                {item.emojis}
              </div>
              <div className="font-black text-[#0A3A6A] text-sm md:text-base mt-1">
                {item.num}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section 3: Tabla 1 al 30 */}
      <div className="bg-white rounded-2xl p-4 md:p-5 mb-4 shadow-sm border border-[#E2E8F0]">
        <div className="font-black text-[#0A3A6A] text-sm md:text-base mb-3 flex items-center gap-1.5">
          <span>📊</span>
          <span>Tabla 1 al 30</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 md:gap-3">
          {TABLE_1_30.map((item) => (
            <div
              key={item.num}
              onClick={() => handleSpeak(String(item.num))}
              className="bg-gradient-to-br from-[#F0F8FF] to-white rounded-xl p-3 text-center border border-[#1A6CB4]/15 flex flex-col items-center justify-between min-h-[90px] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer shadow-xs"
              title={`Número ${item.num}`}
            >
              <div className="flex-1 flex items-center justify-center flex-wrap gap-0.5 text-xs font-bold min-h-[34px] leading-tight break-all text-slate-700">
                {item.emojis}
              </div>
              <div className="font-black text-[#0A3A6A] text-sm md:text-base mt-1">
                {item.num}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section 4: Tabla 1 al 50 */}
      <div className="bg-white rounded-2xl p-4 md:p-5 mb-4 shadow-sm border border-[#E2E8F0]">
        <div className="font-black text-[#0A3A6A] text-sm md:text-base mb-3 flex items-center gap-1.5">
          <span>📊</span>
          <span>Tabla 1 al 50</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 md:gap-3">
          {TABLE_1_50.map((item) => (
            <div
              key={item.num}
              onClick={() => handleSpeak(String(item.num))}
              className="bg-gradient-to-br from-[#F0F8FF] to-white rounded-xl p-3 text-center border border-[#1A6CB4]/15 flex flex-col items-center justify-between min-h-[90px] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer shadow-xs"
              title={`Número ${item.num}`}
            >
              <div className="flex-1 flex items-center justify-center flex-wrap gap-0.5 text-xs md:text-sm font-bold min-h-[34px] leading-tight break-all text-slate-700">
                {item.emojis}
              </div>
              <div className="font-black text-[#0A3A6A] text-sm md:text-base mt-1">
                {item.num}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section 5: Tabla 1 al 100 */}
      <div className="bg-white rounded-2xl p-4 md:p-5 mb-8 shadow-sm border border-[#E2E8F0]">
        <div className="font-black text-[#0A3A6A] text-sm md:text-base mb-3 flex items-center gap-1.5">
          <span>📊</span>
          <span>Tabla 1 al 100</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 md:gap-3">
          {TABLE_1_100.map((item) => (
            <div
              key={item.num}
              onClick={() => handleSpeak(String(item.num))}
              className="bg-gradient-to-br from-[#F0F8FF] to-white rounded-xl p-3 text-center border border-[#1A6CB4]/15 flex flex-col items-center justify-between min-h-[90px] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer shadow-xs"
              title={`Número ${item.num}`}
            >
              <div className="flex-1 flex items-center justify-center flex-wrap gap-0.5 text-[10px] md:text-xs min-h-[34px] leading-snug break-all max-h-[70px] overflow-hidden">
                {item.emojis}
              </div>
              <div className="font-black text-[#0A3A6A] text-sm md:text-base mt-1">
                {item.num}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
