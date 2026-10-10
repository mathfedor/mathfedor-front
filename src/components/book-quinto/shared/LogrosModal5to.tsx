'use client';

import React, { useState, useEffect } from 'react';
import { useBook5 } from '../context/Book5Context';

interface LogrosModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubViewType = 'hub' | 'trofeos' | 'stickers' | 'certificados' | 'misiones' | 'diario' | 'tienda';

// Los 10 trofeos oficiales del Libro Fedor de 5°
const TROFEOS_5TO = [
  { id: 't_unidad1', ico: '🥇', name: 'Primera unidad', desc: 'Completa una unidad (o aprueba su examen)' },
  { id: 't_unidad5', ico: '🏅', name: 'Cinco unidades', desc: 'Completa 5 unidades del libro de 5°' },
  { id: 't_todas', ico: '👑', name: 'Libro completo', desc: 'Completa todas las unidades de 5°' },
  { id: 't_racha3', ico: '🔥', name: 'Racha de 3 días', desc: 'Practica 3 días consecutivos' },
  { id: 't_racha7', ico: '☄️', name: 'Racha de 7 días', desc: 'Practica 7 días consecutivos' },
  { id: 't_100', ico: '💯', name: 'Centenario', desc: 'Responde 100 ejercicios con éxito' },
  { id: 't_500', ico: '🚀', name: 'Cohete', desc: 'Responde 500 ejercicios en total' },
  { id: 't_perfecto', ico: '💎', name: 'Nivel perfecto', desc: 'Supera un nivel sin cometer errores' },
  { id: 't_saber', ico: '🏆', name: 'SABER Pro', desc: 'Obtén 7/10 o más en una prueba SABER 5°' },
  { id: 't_gamer', ico: '🎮', name: 'Gamer Fedor', desc: 'Alcanza 300 puntos en un minijuego' },
];

const STICKERS_5TO = [
  { id: 'st_tierra', ico: '🌍', name: 'Planeta Tierra', cat: 'Cosmos' },
  { id: 'st_luna', ico: '🌙', name: 'La Luna', cat: 'Cosmos' },
  { id: 'st_marte', ico: '🔴', name: 'Marte Rojo', cat: 'Planetas' },
  { id: 'st_jupiter', ico: '🟠', name: 'Júpiter Gigante', cat: 'Planetas' },
  { id: 'st_saturno', ico: '🪐', name: 'Saturno Anillado', cat: 'Planetas' },
  { id: 'st_halley', ico: '☄️', name: 'Cometa Halley', cat: 'Cosmos' },
  { id: 'st_sol', ico: '☀️', name: 'El Sol', cat: 'Estrellas' },
  { id: 'st_abaco', ico: '🧮', name: 'Ábaco Espacial', cat: 'Herramientas' },
];

export default function LogrosModal5to({ isOpen, onClose }: LogrosModal5toProps) {
  const { student, coins, streak, totalXP, updateStats } = useBook5();

  const [subView, setSubView] = useState<SubViewType>('hub');
  const [selectedCertIndex, setSelectedCertIndex] = useState<number | null>(null);
  const [ownedTrofeos, setOwnedTrofeos] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const trofRaw = localStorage.getItem('fedor5_trofeos');
      if (trofRaw) {
        const parsed = JSON.parse(trofRaw);
        if (parsed) setOwnedTrofeos(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!isOpen) return null;

  const unlockedTrofeosCount = Object.keys(ownedTrofeos).length;

  // 6 Tarjetas Principales del Hub
  const HUB_ITEMS = [
    {
      key: 'trofeos' as SubViewType,
      ico: '🏆',
      title: 'Vitrina de trofeos',
      subtitle: `${unlockedTrofeosCount}/${TROFEOS_5TO.length}`,
      color: '#F5C518',
    },
    {
      key: 'stickers' as SubViewType,
      ico: '📸',
      title: 'Álbum de stickers',
      subtitle: 'Colecciona',
      color: '#D4286A',
    },
    {
      key: 'certificados' as SubViewType,
      ico: '🎓',
      title: 'Certificados',
      subtitle: 'Imprimibles',
      color: '#5C21A6',
    },
    {
      key: 'misiones' as SubViewType,
      ico: '🎯',
      title: 'Misiones de hoy',
      subtitle: '3 diarias',
      color: '#0E6BA8',
    },
    {
      key: 'diario' as SubViewType,
      ico: '📓',
      title: 'Mi Diario',
      subtitle: `Racha ${streak || 0} día(s)`,
      color: '#16876A',
    },
    {
      key: 'tienda' as SubViewType,
      ico: '🛒',
      title: 'Tienda Fedor',
      subtitle: `${coins || 0} 🪙 disponibles`,
      color: '#E8650A',
    },
  ];

  // Misiones diarias
  const MISIONES_DATA = [
    {
      id: 'mis-1',
      ico: '⚡',
      txt: 'Responde 10 ejercicios rápidos en Contrarreloj 5°',
      meta: 10,
      actual: Math.min(10, Math.floor(totalXP / 50)),
      xp: 80,
      coinsReward: 30,
    },
    {
      id: 'mis-2',
      ico: '🍕',
      txt: 'Responde 5 ejercicios de fracciones o repartición',
      meta: 5,
      actual: Math.min(5, Math.floor(totalXP / 60)),
      xp: 100,
      coinsReward: 50,
    },
    {
      id: 'mis-3',
      ico: '🏆',
      txt: 'Responde 8 ejercicios de Problemas Cotidianos SABER 5°',
      meta: 8,
      actual: Math.min(8, Math.floor(totalXP / 35)),
      xp: 150,
      coinsReward: 50,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[99995] flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      style={{ background: 'rgba(18, 8, 42, 0.72)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-[565px] bg-white rounded-[24px] p-6 sm:p-7 text-[#180D38] relative shadow-2xl overflow-hidden animate-fadeIn"
        style={{
          boxShadow: '0 25px 60px -15px rgba(25, 8, 55, 0.45)',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* ══ CABECERA: TÍTULO Y BOTÓN DE CIERRE ALINEADOS ══ */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl leading-none select-none">
              {subView === 'hub' && '🏆'}
              {subView === 'trofeos' && '🏆'}
              {subView === 'stickers' && '📸'}
              {subView === 'certificados' && '🎓'}
              {subView === 'misiones' && '🎯'}
              {subView === 'diario' && '📓'}
              {subView === 'tienda' && '🛒'}
            </span>
            <h2
              className="text-[22px] sm:text-[24px] font-black text-[#2A0F60] tracking-tight leading-none"
              style={{ fontFamily: "'Baloo 2', cursive, sans-serif" }}
            >
              {subView === 'hub' && 'Mis Logros (5°)'}
              {subView === 'trofeos' && 'Vitrina de Trofeos'}
              {subView === 'stickers' && 'Álbum de Stickers'}
              {subView === 'certificados' && 'Mis Certificados'}
              {subView === 'misiones' && 'Misiones Diarias'}
              {subView === 'diario' && 'Mi Diario'}
              {subView === 'tienda' && 'Tienda Fedor'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border-[1.5px] border-[#E4DFF5] bg-[#F7F4FF] hover:bg-[#E9DCFC] text-[#6C28B4] flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* ══ VISTA PRINCIPAL (HUB: 6 TARJETAS EN GRID DE 2 COLUMNAS) ══ */}
        {subView === 'hub' && (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 animate-fadeIn">
            {HUB_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSubView(item.key)}
                className="group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-[20px] bg-white border border-[#E9E4F7] hover:border-[#D5CBEF] transition-all duration-200 cursor-pointer text-center"
                style={{
                  boxShadow: '0 4px 18px rgba(35, 12, 80, 0.05)',
                }}
              >
                <div
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-[16px] flex items-center justify-center text-2xl sm:text-3xl mb-2.5 transition-transform duration-200 group-hover:scale-108 shrink-0"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  {item.ico}
                </div>

                <div
                  className="font-black text-[14px] sm:text-[15px] text-[#220B50] leading-tight mb-1"
                  style={{ fontFamily: "'Baloo 2', cursive, sans-serif" }}
                >
                  {item.title}
                </div>

                <div className="text-[11px] sm:text-[12px] font-bold text-[#867B9E] leading-tight">
                  {item.subtitle}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ══ SUBVISTA: TROFEOS ══ */}
        {subView === 'trofeos' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSubView('hub')}
                className="text-xs font-black text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Volver al Menú
              </button>
              <span className="text-xs font-bold text-gray-500">
                {unlockedTrofeosCount} de {TROFEOS_5TO.length} desbloqueados
              </span>
            </div>

            <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
              {TROFEOS_5TO.map((t) => {
                const isUnlocked = !!ownedTrofeos[t.id];
                return (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                      isUnlocked
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                        : 'bg-gray-50/80 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="text-3xl shrink-0">{t.ico}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-[#1A1033] leading-tight">
                        {t.name}
                      </div>
                      <div className="text-xs text-gray-500 font-semibold mt-0.5">
                        {t.desc}
                      </div>
                    </div>
                    {isUnlocked ? (
                      <span className="text-xs font-black text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-md">
                        ¡Ganado!
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-gray-400">
                        Bloqueado
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ SUBVISTA: STICKERS ══ */}
        {subView === 'stickers' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSubView('hub')}
                className="text-xs font-black text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Volver al Menú
              </button>
              <span className="text-xs font-bold text-gray-500">
                Colección Cósmica 5°
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
              {STICKERS_5TO.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-purple-50/60 rounded-2xl border border-purple-200 text-center flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform"
                >
                  <span className="text-3xl">{s.ico}</span>
                  <span className="text-[11px] font-black text-[#2A0F60] leading-tight mt-1">
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ SUBVISTA: CERTIFICADOS ══ */}
        {subView === 'certificados' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSubView('hub')}
                className="text-xs font-black text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Volver al Menú
              </button>
              <span className="text-xs font-bold text-gray-500">
                Diploma Oficial 5°
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-100 via-amber-50 to-indigo-100 border-2 border-purple-300 text-center space-y-3">
              <div className="text-4xl">🎓</div>
              <div
                className="text-lg font-black text-[#2A0F60]"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                Certificado de Aventurero Matemático
              </div>
              <p className="text-xs text-gray-700 font-semibold leading-relaxed">
                Otorgado a <strong>{student?.name || 'Estudiante'}</strong> por su dedicación y avances en las 15 misiones cósmicas de 5° de primaria.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md transition-all cursor-pointer"
              >
                🖨️ Imprimir Diploma
              </button>
            </div>
          </div>
        )}

        {/* ══ SUBVISTA: MISIONES DE HOY ══ */}
        {subView === 'misiones' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSubView('hub')}
                className="text-xs font-black text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Volver al Menú
              </button>
              <span className="text-xs font-bold text-gray-500">
                3 Misiones Diarias
              </span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {MISIONES_DATA.map((mis) => {
                const isComplete = mis.actual >= mis.meta;
                const pct = Math.min(100, Math.round((mis.actual / mis.meta) * 100));

                return (
                  <div
                    key={mis.id}
                    className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{mis.ico}</span>
                        <span className="text-xs font-black text-gray-800">
                          {mis.txt}
                        </span>
                      </div>
                      <span className="text-[11px] font-black text-amber-600 shrink-0">
                        +{mis.xp} XP · +{mis.coinsReward} 🪙
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all bg-emerald-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-gray-600">
                        {mis.actual}/{mis.meta}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ SUBVISTA: DIARIO ══ */}
        {subView === 'diario' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSubView('hub')}
                className="text-xs font-black text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Volver al Menú
              </button>
              <span className="text-xs font-bold text-gray-500">
                Bitácora de Vuelo
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
              <div className="text-sm font-black text-purple-900">
                🚀 Estado de la Misión
              </div>
              <p className="text-xs text-purple-950 font-semibold leading-relaxed">
                ¡Has mantenido una racha de <strong>{streak || 0} día(s)</strong> consecutivos de exploración! Continúa practicando diariamente para desbloquear nuevos trofeos y estrellas.
              </p>
            </div>
          </div>
        )}

        {/* ══ SUBVISTA: TIENDA ══ */}
        {subView === 'tienda' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSubView('hub')}
                className="text-xs font-black text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Volver al Menú
              </button>
              <span className="text-xs font-black text-amber-600">
                {coins || 0} 🪙 Monedas Cósmicas
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
              {[
                { name: 'Avatar Robonix', price: 100, ico: '🤖' },
                { name: 'Avatar Astrocat', price: 150, ico: '🐱' },
                { name: 'Traje de Galaxia', price: 200, ico: '🌌' },
                { name: 'Cohete Dorado', price: 300, ico: '🚀' },
              ].map((it, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-center flex flex-col items-center justify-between gap-1.5"
                >
                  <span className="text-3xl">{it.ico}</span>
                  <span className="text-xs font-black text-gray-800">{it.name}</span>
                  <span className="text-[11px] font-bold text-amber-600">{it.price} 🪙</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (coins >= it.price) {
                        updateStats(-it.price, 0, 0);
                        alert(`¡Compraste ${it.name}!`);
                      } else {
                        alert('No tienes suficientes monedas cósmicas.');
                      }
                    }}
                    className="w-full py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-black text-[11px] cursor-pointer"
                  >
                    Comprar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
