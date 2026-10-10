'use client';

import React, { useState, useEffect } from 'react';
import { useBook4 } from '../context/Book4Context';
import { STICKERS_4TO } from './StickerAlbumModal4to';
import { SHOP_ITEMS_4TO } from './ShopModal4to';

interface LogrosModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubViewType = 'hub' | 'trofeos' | 'stickers' | 'certificados' | 'misiones' | 'diario' | 'tienda';

// Los 10 trofeos oficiales del Libro Fedor de 4°
const TROFEOS_4TO = [
  { id: 't_unidad5', ico: '🏅', name: 'Cinco unidades', desc: 'Completa 5 unidades del libro' },
  { id: 't_todas', ico: '👑', name: 'Libro completo', desc: 'Completa las 15 unidades de 4°' },
  { id: 't_racha3', ico: '🔥', name: 'Racha de 3 días', desc: 'Practica 3 días consecutivos' },
  { id: 't_racha7', ico: '☄️', name: 'Racha de 7 días', desc: 'Practica 7 días consecutivos' },
  { id: 't_100', ico: '💯', name: 'Centenario', desc: 'Responde 100 ejercicios con éxito' },
  { id: 't_500', ico: '🚀', name: 'Cohete', desc: 'Responde 500 ejercicios en total' },
  { id: 't_perfecto', ico: '💎', name: 'Nivel perfecto', desc: 'Supera un nivel sin cometer errores' },
  { id: 't_saber', ico: '🏆', name: 'SABER Pro', desc: 'Obtén 7/10 o más en una prueba SABER' },
  { id: 't_gamer', ico: '🎮', name: 'Gamer Fedor', desc: 'Alcanza 300 puntos en un minijuego' },
  { id: 't_campeon', ico: '🌟', name: 'Gran Campeón', desc: 'Domina los desafíos de 4° de primaria' },
];

export default function LogrosModal4to({ isOpen, onClose }: LogrosModal4toProps) {
  const { student, coins, streak, totalXP, book, updateStats } = useBook4();

  const [subView, setSubView] = useState<SubViewType>('hub');
  const [selectedCertIndex, setSelectedCertIndex] = useState<number | null>(null);
  const [ownedTrofeos, setOwnedTrofeos] = useState<Record<string, string>>({});
  const [equippedAvatar, setEquippedAvatar] = useState<string>('av_numerix');
  const [purchasedItems, setPurchasedItems] = useState<Record<string, boolean>>({ av_numerix: true });

  // Cargar trofeos y progreso guardados
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const trofRaw = localStorage.getItem('fedor5_trofeos') || localStorage.getItem('fedor4_trofeos');
      if (trofRaw) {
        const parsed = JSON.parse(trofRaw);
        if (parsed) setOwnedTrofeos(parsed);
      }

      const eqRaw = localStorage.getItem('fedor5_avatar_eq');
      if (eqRaw) setEquippedAvatar(eqRaw);

      const shopRaw = localStorage.getItem('fedor5_tienda');
      if (shopRaw) {
        const parsed = JSON.parse(shopRaw);
        if (parsed) setPurchasedItems((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
  }, []);

  if (!isOpen) return null;

  const unlockedTrofeosCount = Object.keys(ownedTrofeos).length;

  // 6 Tarjetas Principales del Hub (Idénticas a Imagen 2 con espacio y márgenes limpios)
  const HUB_ITEMS = [
    {
      key: 'trofeos' as SubViewType,
      ico: '🏆',
      title: 'Vitrina de trofeos',
      subtitle: `${unlockedTrofeosCount}/${TROFEOS_4TO.length}`,
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

  const misiones = [
    {
      id: 'mis-1',
      ico: '🔢',
      txt: 'Responde 5 ejercicios de Operaciones y Algoritmos',
      meta: 5,
      actual: Math.min(5, Math.floor(totalXP / 40)),
      xp: 100,
      coinsReward: 50,
    },
    {
      id: 'mis-2',
      ico: '📐',
      txt: 'Responde 5 ejercicios de Geometría y Medición',
      meta: 5,
      actual: Math.min(5, Math.floor(totalXP / 60)),
      xp: 100,
      coinsReward: 50,
    },
    {
      id: 'mis-3',
      ico: '🏆',
      txt: 'Responde 8 ejercicios de Problemas Cotidianos SABER',
      meta: 8,
      actual: Math.min(8, Math.floor(totalXP / 35)),
      xp: 150,
      coinsReward: 50,
    },
  ];

  const handlePrintCertificate = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleBuyOrEquip = (itemId: string, price: number) => {
    if (purchasedItems[itemId]) {
      setEquippedAvatar(itemId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fedor5_avatar_eq', itemId);
      }
      return;
    }

    if (coins < price) {
      alert('¡No tienes suficientes monedas! Gana más resolviendo ejercicios.');
      return;
    }

    updateStats(-price, 0, 0);
    const updated = { ...purchasedItems, [itemId]: true };
    setPurchasedItems(updated);
    setEquippedAvatar(itemId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fedor5_tienda', JSON.stringify(updated));
      localStorage.setItem('fedor5_avatar_eq', itemId);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99995] flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      style={{
        background: 'rgba(18, 8, 42, 0.72)',
      }}
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
              {subView === 'hub' && 'Mis Logros'}
              {subView === 'trofeos' && 'Vitrina de Trofeos'}
              {subView === 'stickers' && 'Álbum de Stickers'}
              {subView === 'certificados' && 'Mis Certificados'}
              {subView === 'misiones' && 'Misiones Diarias'}
              {subView === 'diario' && 'Mi Diario'}
              {subView === 'tienda' && 'Tienda Fedor'}
            </h2>
          </div>

          {/* Botón Circular Cerrar (✕) - Con margen y sin sobreponerse */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border-[1.5px] border-[#E4DFF5] bg-[#F7F4FF] hover:bg-[#E9DCFC] text-[#6C28B4] flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
            title="Cerrar"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════
            1. VISTA PRINCIPAL: HUB DE 6 TARJETAS (EXACTA A IMAGEN 2)
            ══════════════════════════════════════════════════════════ */}
        {subView === 'hub' && (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            {HUB_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSubView(item.key)}
                className="bg-white rounded-[18px] py-4 px-3 text-center cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md flex flex-col items-center justify-center"
                style={{
                  border: `2px solid ${item.color}`,
                }}
              >
                {/* Ícono grande */}
                <div className="text-3xl sm:text-4xl leading-none mb-1.5 select-none">
                  {item.ico}
                </div>

                {/* Título de la tarjeta */}
                <div
                  className="font-black text-[14.5px] sm:text-[15.5px] text-[#1A1033] mb-0.5 leading-tight"
                  style={{ fontFamily: "'Baloo 2', 'Nunito', sans-serif" }}
                >
                  {item.title}
                </div>

                {/* Subtítulo coloreado */}
                <div
                  className="text-[11.5px] sm:text-[12px] font-extrabold leading-none"
                  style={{
                    color: item.color,
                  }}
                >
                  {item.subtitle}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            2. SUB-VISTA: VITRINA DE TROFEOS
            ══════════════════════════════════════════════════════════ */}
        {subView === 'trofeos' && (
          <div className="space-y-3.5 animate-fadeIn">
            <p className="font-black text-[#5C21A6] text-xs sm:text-sm">
              {unlockedTrofeosCount} de {TROFEOS_4TO.length} trofeos desbloqueados
            </p>

            <div className="grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {TROFEOS_4TO.map((t) => {
                const has = !!ownedTrofeos[t.id];
                return (
                  <div
                    key={t.id}
                    className="rounded-[16px] p-3 text-center transition-all"
                    style={{
                      background: has
                        ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)'
                        : '#F3F4F6',
                      border: `2px solid ${has ? '#F5C518' : '#D1D5DB'}`,
                      opacity: has ? 1 : 0.65,
                    }}
                  >
                    <div className="text-3xl leading-none mb-1">
                      {has ? t.ico : '🔒'}
                    </div>
                    <div className="text-[13px] font-black text-[#1A1033] leading-tight">
                      {t.name}
                    </div>
                    <div className="text-[11px] font-bold text-[#4B5563] leading-tight mt-0.5">
                      {t.desc}
                    </div>
                    {has && (
                      <div className="text-[10px] text-[#92400E] font-black mt-1">
                        ✔ Desbloqueado
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setSubView('hub')}
              className="w-full py-2.5 px-4 rounded-[14px] font-black text-sm text-white bg-[#5C21A6] hover:bg-[#4C188A] transition-colors cursor-pointer border-none mt-2 shadow-sm"
            >
              ◀ Volver a Logros
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            3. SUB-VISTA: ÁLBUM DE STICKERS
            ══════════════════════════════════════════════════════════ */}
        {subView === 'stickers' && (
          <div className="space-y-3.5 animate-fadeIn">
            <p className="text-xs font-bold text-gray-600">
              Desbloquea stickers especiales por cada 150 XP y trofeos que acumules en tus lecciones.
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[50vh] overflow-y-auto p-1">
              {STICKERS_4TO.map((stk, idx) => {
                const unlocked = idx < Math.min(STICKERS_4TO.length, Math.floor(totalXP / 150) + unlockedTrofeosCount);
                return (
                  <div
                    key={stk.id}
                    className="p-2 rounded-[14px] text-center border-2 transition-all flex flex-col items-center justify-center min-h-[70px]"
                    style={{
                      background: unlocked ? '#FDF2F8' : '#F3F4F6',
                      borderColor: unlocked ? '#D4286A' : '#E5E7EB',
                      opacity: unlocked ? 1 : 0.5,
                    }}
                  >
                    <span className="text-2xl">{unlocked ? stk.e : '🔒'}</span>
                    <span className="text-[9.5px] font-black text-gray-800 line-clamp-1 mt-1">
                      {unlocked ? stk.name : 'Bloqueado'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setSubView('hub')}
              className="w-full py-2.5 px-4 rounded-[14px] font-black text-sm text-white bg-[#D4286A] hover:bg-[#B31D56] transition-colors cursor-pointer border-none mt-2 shadow-sm"
            >
              ◀ Volver a Logros
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            4. SUB-VISTA: CERTIFICADOS IMPRIMIBLES
            ══════════════════════════════════════════════════════════ */}
        {subView === 'certificados' && (
          <div className="space-y-3.5 animate-fadeIn">
            {selectedCertIndex !== null ? (
              <div className="space-y-3">
                <div
                  id="f5CertPrintable"
                  className="bg-white border-8 border-double border-[#C9A227] rounded-[18px] p-5 sm:p-6 text-center text-[#1A1033]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  <div className="text-4xl mb-1">🎓</div>
                  <div className="text-xs tracking-[0.2em] text-[#8B6914] font-bold">
                    CERTIFICADO DE LOGRO
                  </div>
                  <div className="text-xs text-gray-600 mt-2">Se otorga con orgullo a</div>
                  <div className="text-xl font-bold text-[#5C21A6] my-1 border-b-2 border-[#C9A227] inline-block px-4">
                    {student?.name || 'Estudiante Fedor'}
                  </div>
                  <div className="text-xs text-gray-500">{student?.school || 'Colegio de Primaria'}</div>
                  <div className="text-xs text-gray-600 mt-2">por culminar exitosamente</div>
                  <div className="text-base font-bold my-1 text-[#1A1033]">
                    {selectedCertIndex === -1
                      ? 'Matemáticas de Fedor · Grado 4° de Primaria'
                      : book?.units[selectedCertIndex]?.name || `Unidad ${selectedCertIndex + 1}`}
                  </div>
                  <div className="text-xl my-1">⭐⭐⭐⭐⭐</div>
                  <div className="text-[11px] text-gray-500 mt-3">
                    Fecha: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrintCertificate}
                    className="flex-1 py-2.5 px-3.5 rounded-[12px] font-black text-sm text-white bg-[#0E6BA8] hover:bg-[#0b5382] cursor-pointer border-none shadow-sm"
                  >
                    🖨️ Imprimir Certificado
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCertIndex(null)}
                    className="py-2.5 px-4 rounded-[12px] font-black text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer border-none"
                  >
                    Volver a lista
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold text-gray-600 mb-2.5">
                  Completa unidades al 100% o aprueba evaluaciones para desbloquear tus diplomas:
                </p>

                <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCertIndex(-1)}
                    className="w-full text-left p-3 rounded-[14px] border-2 border-[#F5C518] bg-gradient-to-r from-amber-50 to-yellow-100 font-black text-xs text-[#78350F] cursor-pointer hover:shadow-xs flex items-center justify-between"
                  >
                    <span>👑 Certificado Final · Grado 4° Completo</span>
                    <span>Ver diploma ➔</span>
                  </button>

                  {(book?.units || []).map((u, ui) => (
                    <button
                      key={ui}
                      type="button"
                      onClick={() => setSelectedCertIndex(ui)}
                      className="w-full text-left p-2.5 rounded-[14px] border-2 border-[#C5BFEE] bg-[#F8F5FF] font-black text-xs text-[#2A0F60] cursor-pointer hover:bg-purple-100 flex items-center justify-between"
                    >
                      <span className="truncate">🎓 {u.name}</span>
                      <span className="text-[11px] text-purple-700 shrink-0">Ver diploma ➔</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSubView('hub')}
                  className="w-full py-2.5 px-4 rounded-[14px] font-black text-sm text-white bg-[#5C21A6] hover:bg-[#4C188A] transition-colors cursor-pointer border-none mt-3 shadow-sm"
                >
                  ◀ Volver a Logros
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            5. SUB-VISTA: MISIONES DE HOY
            ══════════════════════════════════════════════════════════ */}
        {subView === 'misiones' && (
          <div className="space-y-3.5 animate-fadeIn">
            <p className="text-xs font-bold text-gray-600">
              Se renuevan diariamente y se completan de forma automática al practicar en las lecciones.
            </p>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {misiones.map((m) => {
                const done = m.actual >= m.meta;
                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-[14px] border-2"
                    style={{
                      background: done ? '#DCF5EE' : '#F8F5FF',
                      borderColor: done ? '#14B8A6' : '#C5BFEE',
                    }}
                  >
                    <div className="font-black text-xs sm:text-sm text-[#1A1033] flex items-center gap-1.5">
                      <span>{m.ico}</span>
                      <span>{m.txt}</span>
                    </div>

                    <div className="h-2 bg-gray-200 rounded-full my-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.round((m.actual / m.meta) * 100)}%`,
                          background: done ? '#14B8A6' : '#0E6BA8',
                        }}
                      />
                    </div>

                    <div className="text-[11px] font-black text-gray-600 flex items-center justify-between">
                      <span>
                        Progreso: {m.actual}/{m.meta}
                      </span>
                      <span className="text-[#0E6BA8]">
                        Premio: +{m.xp} XP y +{m.coinsReward} 🪙 {done ? '· ✅ Cumplida' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setSubView('hub')}
              className="w-full py-2.5 px-4 rounded-[14px] font-black text-sm text-white bg-[#0E6BA8] hover:bg-[#0b5382] transition-colors cursor-pointer border-none mt-2 shadow-sm"
            >
              ◀ Volver a Logros
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            6. SUB-VISTA: MI DIARIO DE PRÁCTICA
            ══════════════════════════════════════════════════════════ */}
        {subView === 'diario' && (
          <div className="space-y-3.5 animate-fadeIn">
            <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-[16px] flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-emerald-900">Racha Actual</div>
                <div className="text-lg font-black text-emerald-700">🔥 {streak || 0} día(s) seguidos</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-emerald-900">Total XP</div>
                <div className="text-lg font-black text-emerald-700">⭐ {totalXP} XP</div>
              </div>
            </div>

            <p className="text-xs font-bold text-gray-600">
              Tu constancia diaria es el secreto para dominar las matemáticas. ¡Mantén encendida tu llama de racha!
            </p>

            <button
              type="button"
              onClick={() => setSubView('hub')}
              className="w-full py-2.5 px-4 rounded-[14px] font-black text-sm text-white bg-[#16876A] hover:bg-[#126d56] transition-colors cursor-pointer border-none mt-2 shadow-sm"
            >
              ◀ Volver a Logros
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            7. SUB-VISTA: TIENDA FEDOR
            ══════════════════════════════════════════════════════════ */}
        {subView === 'tienda' && (
          <div className="space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between p-3 bg-amber-50 border-2 border-amber-300 rounded-[14px]">
              <span className="font-black text-xs text-amber-900">Monedas disponibles:</span>
              <span className="font-black text-sm text-amber-800">🪙 {coins || 0}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {SHOP_ITEMS_4TO.slice(0, 10).map((item) => {
                const isOwned = !!purchasedItems[item.id];
                const isEquipped = equippedAvatar === item.id;
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-[14px] border-2 bg-white flex flex-col items-center justify-between text-center"
                    style={{
                      borderColor: isEquipped ? '#10B981' : isOwned ? '#3B82F6' : '#E8650A',
                    }}
                  >
                    <span className="text-3xl leading-none">{item.emoji}</span>
                    <span className="text-xs font-black text-[#1A1033] line-clamp-1 mt-1">
                      {item.name}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 my-1">
                      {isOwned ? (isEquipped ? '✅ Equipado' : 'Comprado') : `🪙 ${item.price}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleBuyOrEquip(item.id, item.price)}
                      className="w-full py-1.5 px-2 rounded-[10px] font-black text-[11px] text-white cursor-pointer border-none"
                      style={{
                        background: isEquipped ? '#10B981' : isOwned ? '#3B82F6' : '#E8650A',
                      }}
                    >
                      {isEquipped ? 'En uso' : isOwned ? 'Equipar' : 'Comprar'}
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setSubView('hub')}
              className="w-full py-2.5 px-4 rounded-[14px] font-black text-sm text-white bg-[#E8650A] hover:bg-[#c95305] transition-colors cursor-pointer border-none mt-2 shadow-sm"
            >
              ◀ Volver a Logros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
