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
  const [ownedTrofeos, setOwnedTrofeos] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
  }, [isOpen]);

  if (!isOpen) return null;

  const unlockedTrofeosCount = Object.keys(ownedTrofeos).length;

  // 6 Tarjetas Principales del Hub idénticas a la imagen
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
      title: 'Tienda',
      subtitle: `🪙 ${coins || 0}`,
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
      className="fixed inset-0 z-[99995] flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      style={{
        background: 'rgba(18, 8, 42, 0.72)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        .logros-modal-card {
          background: #ffffff;
          border-radius: 24px;
          max-width: 580px;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          padding: 22px 24px;
          position: relative;
          box-shadow: 0 25px 60px -15px rgba(25, 8, 55, 0.45);
          font-family: 'Nunito', sans-serif;
          color: #180D38;
          box-sizing: border-box;
          animation: popIn 0.18s ease-out;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .logros-modal-card::-webkit-scrollbar {
          width: 6px;
        }
        .logros-modal-card::-webkit-scrollbar-track {
          background: rgba(243, 238, 255, 0.5);
          border-radius: 8px;
        }
        .logros-modal-card::-webkit-scrollbar-thumb {
          background: #C5BFEE;
          border-radius: 8px;
        }
        .logros-modal-card::-webkit-scrollbar-thumb:hover {
          background: #8B3EDB;
        }

        .logros-close-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid #E4DFF5;
          background: #F7F4FF;
          color: #6C28B4;
          font-weight: 900;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .logros-close-circle:hover {
          background: #6C28B4;
          color: #ffffff;
          transform: scale(1.05);
        }

        .logros-hub-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          box-sizing: border-box;
        }

        .logros-card-btn {
          background: #FFFFFF;
          border-width: 2px;
          border-style: solid;
          border-radius: 18px;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          text-align: center;
          box-shadow: 0 2px 10px rgba(35, 12, 80, 0.03);
          transition: transform 0.14s ease, box-shadow 0.14s ease;
          min-height: 104px;
          box-sizing: border-box;
        }
        .logros-card-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(35, 12, 80, 0.08);
        }

        .logros-card-ico {
          font-size: 32px;
          line-height: 1;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logros-card-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 15px;
          color: #1A1033;
          line-height: 1.2;
          margin-bottom: 3px;
        }

        .logros-card-subtitle {
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.2;
        }
      `}</style>

      <div className="logros-modal-card">
        {/* ══ CABECERA: TÍTULO Y BOTÓN DE CIERRE IDÉNTICOS A LA IMAGEN ══ */}
        <div className="flex items-center justify-between mb-4">
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
              {subView === 'hub' && 'Mis Logros'}
              {subView === 'trofeos' && 'Vitrina de Trofeos'}
              {subView === 'stickers' && 'Álbum de Stickers'}
              {subView === 'certificados' && 'Mis Certificados'}
              {subView === 'misiones' && 'Misiones Diarias'}
              {subView === 'diario' && 'Mi Diario'}
              {subView === 'tienda' && 'Tienda'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="logros-close-circle"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* ══ VISTA PRINCIPAL (HUB: 6 TARJETAS EN GRID DE 2 COLUMNAS) ══ */}
        {subView === 'hub' && (
          <div className="logros-hub-grid animate-fadeIn">
            {HUB_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSubView(item.key)}
                className="logros-card-btn"
                style={{
                  borderColor: item.color,
                }}
              >
                <div className="logros-card-ico">{item.ico}</div>
                <div className="logros-card-title">{item.title}</div>
                <div className="logros-card-subtitle" style={{ color: item.color }}>
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
                ← Volver a Logros
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
                ← Volver a Logros
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
                ← Volver a Logros
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
                ← Volver a Logros
              </button>
              <span className="text-xs font-bold text-gray-500">
                3 Misiones Diarias
              </span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {MISIONES_DATA.map((mis) => {
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
                ← Volver a Logros
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
                ← Volver a Logros
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
