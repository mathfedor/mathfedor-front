'use client';

import React, { useState } from 'react';
import { useBook3 } from '../context/Book3Context';
import { fedorSpeak } from '../shared/Grade3Speech';
import Swal from 'sweetalert2';
import ProblemasModal3ro from '../shared/ProblemasModal3ro';

interface HomeScreen3roProps {
  onOpenIntro: () => void;
}

interface CanonicalUnit3ro {
  index: number;
  name: string;
  meta: string;
  icon: string;
  iconBg: string;
  accentClass: string;
  accentGradient: string;
  pills: Array<{ text: string; bg: string; color: string; border: string }>;
}

const CANONICAL_UNITS_3RO: CanonicalUnit3ro[] = [
  {
    index: 0,
    name: 'Unidad 1 — Adición y Números',
    meta: '5 temas · Conteo, Suma, Decena, Recta, Problemas',
    icon: '➕',
    iconBg: '#EEEDFE',
    accentClass: 'uc-purple',
    accentGradient: 'linear-gradient(90deg, #7B2FBE, #A864E8)',
    pills: [
      { text: '🔢 Conteo', bg: '#EEEDFE', color: '#3D1468', border: '#C5BFEE' },
      { text: '➕ Suma', bg: '#DCF5EE', color: '#074F3A', border: '#95DAC4' },
      { text: '🔟 Decena', bg: '#FEF3E8', color: '#7A3200', border: '#FBBF7A' },
      { text: '📏 Recta', bg: '#E8F0FF', color: '#1A3A6A', border: '#8EBBF0' },
    ],
  },
  {
    index: 1,
    name: 'Unidad 2 — Sustracción o Resta',
    meta: '3 temas · Tienda de Math · Vertical · Recta Numérica',
    icon: '➖',
    iconBg: '#DCF5EE',
    accentClass: 'uc-teal',
    accentGradient: 'linear-gradient(90deg, #16876A, #24C496)',
    pills: [
      { text: '🏪 Tienda', bg: '#DCF5EE', color: '#074F3A', border: '#95DAC4' },
      { text: '📐 Vertical', bg: '#FEF3E8', color: '#7A3200', border: '#FBBF7A' },
      { text: '📏 Recta', bg: '#E8F0FF', color: '#1A3A6A', border: '#8EBBF0' },
    ],
  },
  {
    index: 2,
    name: 'Unidad 3 — Multiplicación',
    meta: '2 temas · Tablas del 1 al 9 · Propiedad Conmutativa',
    icon: '✖️',
    iconBg: '#F3E8FF',
    accentClass: 'uc-purple',
    accentGradient: 'linear-gradient(90deg, #7B2FBE, #A864E8)',
    pills: [
      { text: '🔁 Suma repetida', bg: '#F3E8FF', color: '#4A1070', border: '#C5BFEE' },
      { text: '📊 Tablas 1-9', bg: '#FEF3E8', color: '#7A3200', border: '#FBBF7A' },
      { text: '🔄 Conmutativa', bg: '#DCF5EE', color: '#054F38', border: '#8FD9C0' },
    ],
  },
  {
    index: 3,
    name: 'Unidad 4 — División',
    meta: '1 tema · Chocolatinas de Math · Dividendo ÷ Divisor',
    icon: '➗',
    iconBg: '#FAECE7',
    accentClass: 'uc-orange',
    accentGradient: 'linear-gradient(90deg, #E8650A, #FF8C2A)',
    pills: [
      { text: '🍫 Repartir', bg: '#FAECE7', color: '#7A1800', border: '#F5B09A' },
      { text: '✅ Exacta', bg: '#FEF3E8', color: '#7A3200', border: '#FBBF7A' },
      { text: '🔄 Inversa ×', bg: '#EEEDFE', color: '#3D1468', border: '#C5BFEE' },
    ],
  },
  {
    index: 4,
    name: 'Unidad 5 — Problemas SABER',
    meta: '5 temas · Operaciones mixtas · Evaluación estilo SABER',
    icon: '🏆',
    iconBg: '#F3E8FF',
    accentClass: 'uc-purple',
    accentGradient: 'linear-gradient(90deg, #7B2FBE, #A864E8)',
    pills: [
      { text: '📝 Saber 1', bg: '#FEF3E8', color: '#7A3200', border: '#FBBF7A' },
      { text: '🧠 Razonamiento', bg: '#EEEDFE', color: '#3D1468', border: '#C5BFEE' },
      { text: '🏆 Evaluación', bg: '#DCF5EE', color: '#074F3A', border: '#95DAC4' },
    ],
  },
];

const COMMAND_PANEL_ACTIONS = [
  { cls: 'tienda', ico: '🛒', lbl: 'Tienda', color: 'linear-gradient(135deg,#16876A,#24C496)', desc: 'Tienda de trajes y avatares' },
  { cls: 'espacial', ico: '🚀', lbl: 'Espacial', color: 'linear-gradient(135deg,#6C28B4,#9B5CFF)', desc: 'Misiones astronáuticas' },
  { cls: 'diario', ico: '📓', lbl: 'Diario', color: 'linear-gradient(135deg,#0E6BA8,#3AA0FF)', desc: 'Diario de aventuras matemáticas' },
  { cls: 'examen', ico: '📝', lbl: 'Examen', color: 'linear-gradient(135deg,#A30041,#FF1D4E)', desc: 'Evaluación final SABER' },
  { cls: 'despegue', ico: '🎬', lbl: 'Despegue', color: 'linear-gradient(135deg,#FF8C2A,#F5C518)', desc: 'Ver despegue animado' },
  { cls: 'stickers', ico: '🎴', lbl: 'Stickers', color: 'linear-gradient(135deg,#9B0066,#FF1DAA)', desc: 'Álbum espacial de cromos' },
  { cls: 'juegos', ico: '🎮', lbl: 'Juegos', color: 'linear-gradient(135deg,#FF1D4E,#FF8C2A)', desc: 'Zona arcade matemática' },
  { cls: 'galaxia3d', ico: '🌌', lbl: 'Galaxia 3D', color: 'linear-gradient(135deg,#102A70,#2563EB)', desc: 'Vista tridimensional del cosmos' },
  { cls: 'mascota', ico: '🐾', lbl: 'Mascota', color: 'linear-gradient(135deg,#4C1D95,#7C3AED)', desc: 'Interactuar con Fedor' },
  { cls: 'historia', ico: '📖', lbl: 'Historia', color: 'linear-gradient(135deg,#78350F,#B45309)', desc: 'El origen de Fedor y las matemáticas' },
  { cls: 'estandares', ico: '📋', lbl: 'Estándares', color: 'linear-gradient(135deg,#1E293B,#475569)', desc: 'Estándares curriculares MEN' },
  { cls: 'misiones', ico: '🎯', lbl: 'Misiones', color: 'linear-gradient(135deg,#BE185D,#F43F5E)', desc: 'Misiones activas de 3° grado' },
  { cls: 'definic', ico: '📚', lbl: 'Definiciones', color: 'linear-gradient(135deg,#581C87,#9333EA)', desc: 'Glosario matemático interactivo' },
  { cls: 'maraton', ico: '🏃', lbl: 'Maratón', color: 'linear-gradient(135deg,#9A3412,#EA580C)', desc: 'Carrera contra el reloj' },
  { cls: 'minijuegos', ico: '🕹️', lbl: 'Minijuegos', color: 'linear-gradient(135deg,#6D28D9,#A855F7)', desc: 'Minijuegos de cálculo mental' },
  { cls: 'explicar', ico: '💡', lbl: 'Explicar', color: 'linear-gradient(135deg,#D97706,#F59E0B)', desc: 'Explicaciones paso a paso' },
  { cls: 'pcotid', ico: '🧮', lbl: 'P. Cotid.', color: 'linear-gradient(135deg,#831843,#DB2777)', desc: 'Problemas de la vida cotidiana' },
];

export default function HomeScreen3ro({ onOpenIntro }: HomeScreen3roProps) {
  const {
    book,
    student,
    coins,
    stars,
    streak,
    totalXP,
    scores,
    selectUnit,
    goScreen,
    setActiveProblemasNivel,
    setActiveProblemasTab,
  } = useBook3();

  const [claimedDaily, setClaimedDaily] = useState(false);
  const [showProblemasModal, setShowProblemasModal] = useState(false);

  // Calcular progreso total del libro
  const totalUnits = book?.units?.length || 5;
  let totalLevelsCount = 0;
  let passedLevelsCount = 0;

  (book?.units || []).forEach((u) => {
    (u.topics || []).forEach((t) => {
      (t.levels || []).forEach((lv, li) => {
        totalLevelsCount++;
        const key = `${t.id}-n${li + 1}`;
        if ((scores[key] || 0) >= 70) {
          passedLevelsCount++;
        }
      });
    });
  });

  const progressPct = totalLevelsCount > 0
    ? Math.round((passedLevelsCount / totalLevelsCount) * 100)
    : 0;

  const handleClaimDaily = () => {
    if (claimedDaily) {
      Swal.fire({
        title: '¡Ya reclamada!',
        text: 'Ya has reclamado tu recompensa de hoy. ¡Vuelve mañana para más XP!',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    setClaimedDaily(true);
    fedorSpeak('¡Felicidades! Has ganado 50 puntos de experiencia y 25 monedas de recompensa diaria.');
    Swal.fire({
      title: '🎁 ¡Recompensa Diaria!',
      text: '¡Has ganado +50 XP y +25 monedas!',
      icon: 'success',
      confirmButtonText: '¡Genial!',
      confirmButtonColor: '#16876A',
    });
  };

  const handleCommandAction = (action: typeof COMMAND_PANEL_ACTIONS[0]) => {
    if (action.lbl === 'Despegue') {
      onOpenIntro();
    } else if (action.lbl === 'Estándares') {
      goScreen('estandares');
    } else if (action.lbl === 'Definiciones') {
      goScreen('definiciones');
    } else if (action.lbl === 'P. Cotid.' || action.lbl === 'Examen') {
      setShowProblemasModal(true);
    } else if (action.lbl === 'Mascota') {
      fedorSpeak('¡Hola! Soy Fedor, tu amigo en Matemáticas de 3° grado. ¡Vamos a seguir aprendiendo!');
    } else {
      Swal.fire({
        title: `${action.ico} ${action.lbl}`,
        text: action.desc,
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#7B2FBE',
      });
    }
  };

  return (
    <div className="home-screen-shell select-none">
      {/* ══════════════════════════════════════════════════════════
          1. HERO BANNER PRINCIPAL (Idéntico a Imagen 1)
      ══════════════════════════════════════════════════════════ */}
      <div className="hero-banner-main">
        {/* Elementos espaciales decorativos */}
        <div className="absolute top-4 left-6 w-2 h-2 bg-purple-300 rounded-full opacity-60 animate-ping" />
        <div className="absolute top-12 right-12 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-70 animate-pulse" />
        <div className="absolute bottom-6 left-1/4 w-1 h-1 bg-white rounded-full opacity-50" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Círculo del Avatar */}
        <div className="relative z-10 flex justify-center mb-3">
          <div
            id="heroAvatarCircle"
            className="w-22 h-22 rounded-full bg-gradient-to-br from-[#7B2FBE] to-[#A864E8] border-3 border-amber-400/80 shadow-xl shadow-purple-900/60 flex items-center justify-center text-5xl animate-bounce"
            style={{ animationDuration: '3.2s' }}
          >
            {student.avatar || '🧑‍🚀'}
          </div>
        </div>

        {/* Título & Método Fedor */}
        <div className="relative z-10 font-sans mb-1">
          <h2 className="text-sm md:text-base font-black tracking-wide text-white drop-shadow-md uppercase">
            LIBRO DIGITAL DE MATEMÁTICAS · <span className="text-amber-400 font-extrabold">3<sup>er</sup> GRADO</span>
          </h2>
          <div className="text-[11px] font-extrabold text-purple-200/90 tracking-widest uppercase mt-0.5">
            MÉTODO FEDOR
          </div>
        </div>

        {/* Saludo con Botón de Audio */}
        <div className="relative z-10 flex items-center justify-center gap-2 mt-2">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            ¡Hola, <span className="text-amber-400">{student.name || 'Astronauta'}</span>!
          </h1>
          <button
            type="button"
            onClick={() => fedorSpeak(`¡Hola, ${student.name || 'Astronauta'}!`)}
            title="Escuchar saludo"
            className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center text-xs transition-colors cursor-pointer border border-white/25 shadow-sm"
          >
            🔊
          </button>
        </div>

        {/* Rango y XP */}
        <div className="relative z-10 flex items-center justify-center gap-2 mt-1">
          <span className="text-xs md:text-sm font-black text-emerald-400 tracking-wide">
            🌱 Explorador · {totalXP} XP
          </span>
          <button
            type="button"
            onClick={() => fedorSpeak(`Explorador. Tienes ${totalXP} puntos de experiencia.`)}
            title="Escuchar nivel y puntos"
            className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer border border-white/25 shadow-sm"
          >
            🔊
          </button>
        </div>

        {/* Fila de Estadísticas (Monedas, Estrellas, Racha) */}
        <div className="relative z-10 flex items-center justify-center gap-3 md:gap-5 mt-3.5 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-purple-900/50 border border-purple-400/30 px-4 py-1.5 rounded-full text-xs md:text-sm font-black text-amber-300 shadow-sm">
            <span>{coins}</span>
            <span>🪙</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-purple-900/50 border border-purple-400/30 px-4 py-1.5 rounded-full text-xs md:text-sm font-black text-yellow-300 shadow-sm">
            <span>{stars}</span>
            <span>⭐</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-orange-950/50 border border-orange-500/40 px-4 py-1.5 rounded-full text-xs md:text-sm font-black text-orange-400 shadow-sm">
            <span>{streak}</span>
            <span>🔥</span>
          </span>
        </div>

        {/* Badge Grado 3 + Chip Progreso (Espaciado como Imagen 1) */}
        <div className="relative z-10 flex items-center justify-center gap-2.5 my-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-[#F5A623] text-[#200A40] text-xs md:text-sm font-black px-5 py-2 rounded-full shadow-lg shadow-amber-500/30 tracking-wider uppercase">
            <span>👉</span>
            <span>TERCER GRADO · MATEMÁTICAS</span>
          </span>
          <span className="inline-flex items-center bg-[#1A083C] border-2 border-[#F5A623] text-[#F5A623] text-xs md:text-sm font-black px-3.5 py-1.5 rounded-full shadow-md">
            {progressPct}%
          </span>
        </div>

        {/* Botón Intro Cinemática (Espaciado como Imagen 1) */}
        <div className="relative z-10 mt-4 mb-2">
          <button
            type="button"
            onClick={onOpenIntro}
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#FF2E5B] via-[#FF6036] to-[#FFA000] text-white font-black text-sm md:text-base shadow-xl shadow-red-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer tracking-wide"
          >
            <span>🎬</span>
            <span>Intro · Matemáticas 3°</span>
            <span>🚀</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          2. CARD "PROBLEMAS COTIDIANOS" (Idéntico a Imagen 1)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div
          onClick={() => setShowProblemasModal(true)}
          className="pc-home-card"
        >
          {/* Badge "¡NUEVO!" */}
          <div className="pc-nuevo-badge">
            ¡NUEVO!
          </div>

          <div className="pc-icon-wrap">
            <span>🧮</span>
          </div>

          <div className="pc-content-wrap">
            <h3 className="pc-title">
              Problemas Cotidianos
            </h3>
            <p className="pc-subtitle">
              📋 Tipo Prueba SABER · 5 Niveles · Grado 3°
            </p>

            <div className="pc-pills-row">
              <span className="pc-pill pc-pill-add">
                ➕ Adición
              </span>
              <span className="pc-pill pc-pill-sub">
                ➖ Sustracción
              </span>
              <span className="pc-pill pc-pill-mul">
                ✖️ Multiplicación
              </span>
              <span className="pc-pill pc-pill-div">
                ➗ División
              </span>
            </div>
          </div>

          <div className="pc-arrow-wrap">
            ▶
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          3. GALAXY MAP TRACK (Separada como Imagen 2)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div className="bg-gradient-to-r from-[#020B18] via-[#050E2A] to-[#0A1840] border border-blue-800/50 rounded-2xl p-4 md:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                🌌 Universo Fedor · 3er Grado
              </div>
              <div className="text-base font-black text-white mt-0.5">
                🌌 Galaxia 3° · Del Saber
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-orange-400 leading-none">
                {streak}🔥
              </div>
              <div className="text-[10px] font-bold text-gray-400 mt-0.5">
                mejor racha
              </div>
            </div>
          </div>

          {/* Planetary Track (Exactamente como Imagen 2 con todos los planetas) */}
          <div className="flex items-center justify-between py-3 px-2 overflow-x-auto gap-2 md:gap-3 text-center scrollbar-none">
            {/* 1. Tierra (100%) */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-2xl drop-shadow">🌍</span>
              <span className="text-[10px] font-black text-emerald-400 mt-1">100%</span>
            </div>
            <span className="text-gray-500 text-xs tracking-widest shrink-0">·····</span>

            {/* 2. Luna / Sol */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-2xl drop-shadow">🌙</span>
              <span className="text-[10px] font-black text-amber-300 mt-1">100%</span>
            </div>
            <span className="text-gray-500 text-xs tracking-widest shrink-0">·····</span>

            {/* 3. Marte */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-2xl drop-shadow">🔴</span>
              <span className="text-[10px] font-bold text-orange-400 mt-1">▶</span>
            </div>
            <span className="text-gray-600 text-xs tracking-widest shrink-0">·····</span>

            {/* 4. Saturno */}
            <div className="flex flex-col items-center shrink-0 opacity-75">
              <span className="text-2xl">🪐</span>
              <span className="text-[9px] font-bold text-gray-400 mt-1">🔒</span>
            </div>
            <span className="text-gray-700 text-xs tracking-widest shrink-0">·····</span>

            {/* 5. Planeta azul */}
            <div className="flex flex-col items-center shrink-0 opacity-70">
              <span className="text-2xl">🔵</span>
              <span className="text-[9px] font-bold text-gray-400 mt-1">🔒</span>
            </div>
            <span className="text-gray-700 text-xs tracking-widest shrink-0">·····</span>

            {/* 6. Sol / Estrella */}
            <div className="flex flex-col items-center shrink-0 opacity-60">
              <span className="text-2xl">☀️</span>
              <span className="text-[9px] font-bold text-gray-500 mt-1">🔒</span>
            </div>
            <span className="text-gray-800 text-xs tracking-widest shrink-0">·····</span>

            {/* 7. Bloques 1234 */}
            <div className="flex flex-col items-center shrink-0 opacity-55">
              <span className="text-2xl">🔢</span>
              <span className="text-[9px] font-bold text-gray-500 mt-1">🔒</span>
            </div>
            <span className="text-gray-800 text-xs tracking-widest shrink-0">·····</span>

            {/* 8. Estrella saber */}
            <div className="flex flex-col items-center shrink-0 opacity-50">
              <span className="text-2xl">⭐</span>
              <span className="text-[9px] font-bold text-gray-500 mt-1">🔒</span>
            </div>
            <span className="text-gray-800 text-xs tracking-widest shrink-0">·····</span>

            {/* 9. Examen */}
            <div className="flex flex-col items-center shrink-0 opacity-45">
              <span className="text-2xl">📄</span>
              <span className="text-[9px] font-bold text-gray-500 mt-1">🔒</span>
            </div>
            <span className="text-gray-800 text-xs tracking-widest shrink-0">·····</span>

            {/* 10. Rayo */}
            <div className="flex flex-col items-center shrink-0 opacity-45">
              <span className="text-2xl">⚡</span>
              <span className="text-[9px] font-bold text-gray-500 mt-1">🔒</span>
            </div>
            <span className="text-gray-800 text-xs tracking-widest shrink-0">·····</span>

            {/* 11. Escuadra */}
            <div className="flex flex-col items-center shrink-0 opacity-40">
              <span className="text-2xl">📐</span>
              <span className="text-[9px] font-bold text-gray-500 mt-1">🔒</span>
            </div>
            <span className="text-gray-800 text-xs tracking-widest shrink-0">·····</span>

            {/* 12. Regla */}
            <div className="flex flex-col items-center shrink-0 opacity-40">
              <span className="text-2xl">📏</span>
              <span className="text-[9px] font-bold text-gray-500 mt-1">🔒</span>
            </div>
            <span className="text-gray-800 text-xs tracking-widest shrink-0">·····</span>

            {/* 13. Academia */}
            <div className="flex flex-col items-center shrink-0 opacity-40">
              <span className="text-2xl">🏫</span>
              <span className="text-[9px] font-bold text-gray-500 mt-1">🔒</span>
            </div>
            <span className="text-gray-800 text-xs tracking-widest shrink-0">·····</span>

            {/* 14. Balanza */}
            <div className="flex flex-col items-center shrink-0 opacity-40">
              <span className="text-2xl">⚖️</span>
              <span className="text-[9px] font-bold text-gray-500 mt-1">🔒</span>
            </div>
          </div>

          <div className="text-center text-[11px] font-bold text-gray-400 mt-2">
            👆 Toca para explorar · arrastra para viajar
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          4. FILA DE BOTONES DE ACCESO RÁPIDO (Separada como Imagen 2)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap grid grid-cols-5 gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => goScreen('home')}
          className="quick-bar-btn"
          style={{ background: 'linear-gradient(135deg, #FFB020, #E65100)' }}
        >
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] font-black text-white uppercase">Inicio</span>
        </button>

        <button
          type="button"
          onClick={() => goScreen('unit')}
          className="quick-bar-btn"
          style={{ background: 'linear-gradient(135deg, #26A69A, #00796B)' }}
        >
          <span className="text-2xl">📋</span>
          <span className="text-[10px] font-black text-white uppercase">Menú</span>
        </button>

        <button
          type="button"
          onClick={() => fedorSpeak('¡Hola cadete! Soy Fedor, tu amigo astronauta. ¡Vamos con toda en 3°!')}
          className="quick-bar-btn"
          style={{ background: 'linear-gradient(135deg, #8E24AA, #4A148C)' }}
        >
          <span className="text-2xl">🐲</span>
          <span className="text-[10px] font-black text-white uppercase">Fedor</span>
        </button>

        <button
          type="button"
          onClick={() => goScreen('definiciones')}
          className="quick-bar-btn"
          style={{ background: 'linear-gradient(135deg, #0288D1, #01579B)' }}
        >
          <span className="text-2xl">📖</span>
          <span className="text-[10px] font-black text-white uppercase">Definic.</span>
        </button>

        <button
          type="button"
          onClick={() => goScreen('estandares')}
          className="quick-bar-btn"
          style={{ background: 'linear-gradient(135deg, #7CB342, #33691E)' }}
        >
          <span className="text-2xl">🧑‍🏫</span>
          <span className="text-[10px] font-black text-white uppercase">Guía Doc.</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          5. CADETE ESTELAR / PROGRESO XP (Imagen 4 Arriba)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div className="bg-gradient-to-r from-[#200A40] via-[#2D1055] to-[#1E0942] border border-purple-500/30 rounded-2xl p-4 shadow-xl text-white relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-2xl shrink-0">
              🌱
            </div>
            <div>
              <h3 className="font-black text-sm tracking-wide text-amber-300">
                Cadete Estelar
              </h3>
              <p className="text-[11px] font-bold text-purple-200/80">
                {totalXP} XP totales · ¡Bienvenido a la academia! Empieza tu aventura.
              </p>
            </div>
          </div>

          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, (totalXP / 200) * 100))}%` }}
            />
          </div>

          <div className="text-right text-[10px] font-bold text-amber-300/90 mt-1.5">
            200 XP para 🐣 Aprendiz Lunar
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          6. PANEL DE COMANDO (Imagen 4 Medio)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div className="relative bg-gradient-to-r from-[#1A0A3C] via-[#2A0F60] to-[#0A1B40] border-2 border-sky-400/35 rounded-2xl p-4 pt-5 shadow-2xl">
          {/* Badge "⚡ PANEL DE COMANDO" */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF1D4E] to-[#F5C518] text-white text-[10px] font-black px-4 py-0.5 rounded-full tracking-widest shadow-md uppercase">
            ⚡ PANEL DE COMANDO
          </div>

          {/* Botones Horizontales */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {COMMAND_PANEL_ACTIONS.map((action, aIdx) => (
              <button
                key={aIdx}
                type="button"
                onClick={() => handleCommandAction(action)}
                className="flex-shrink-0 w-[78px] md:w-[84px] p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-white border border-white/20 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                style={{ background: action.color }}
              >
                <span className="text-2xl drop-shadow-sm">{action.ico}</span>
                <span className="text-[10px] font-black tracking-tight drop-shadow-sm truncate w-full text-center">
                  {action.lbl}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          7. TRAVESÍA MERCURIO → PLUTÓN (Imagen 4 Medio-Abajo)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div className="bg-gradient-to-b from-[#020611] via-[#0A1840] to-[#1A0D40] border border-blue-900/60 rounded-2xl p-4 shadow-xl text-white relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs md:text-sm font-black text-[#FFD66B] uppercase tracking-wider flex items-center gap-2">
              <span>🚀</span>
              <span>TRAVESÍA MERCURIO → PLUTÓN</span>
            </h3>
            <span className="text-[10px] font-black bg-white/10 border border-amber-300/40 px-2.5 py-0.5 rounded-full text-amber-200">
              {passedLevelsCount} / {totalLevelsCount || 195} bloques
            </span>
          </div>

          {/* Visual Track */}
          <div className="relative py-4 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none px-2">
            {/* Mercurio con INICIA AQUÍ */}
            <div className="flex flex-col items-center shrink-0 relative">
              <span className="absolute -top-4 text-[9px] font-black bg-gradient-to-r from-red-500 to-amber-500 text-white px-2 py-0.5 rounded-full shadow-md animate-pulse whitespace-nowrap">
                INICIA AQUÍ
              </span>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A674] via-[#7E5A30] to-[#3A2410] shadow-lg shadow-amber-900/60 flex items-center justify-center text-xl mt-2 border border-amber-300/40">
                🪐
              </div>
              <span className="text-[9px] font-black text-amber-300 mt-1">Mercurio</span>
            </div>

            {/* Dotted Star Trail */}
            <div className="flex-1 flex items-center justify-around px-2 min-w-[200px]">
              {Array.from({ length: 22 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < passedLevelsCount ? 'bg-amber-400 shadow-sm shadow-amber-300' : 'bg-white/25'}`}
                />
              ))}
            </div>

            {/* Plutón */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A3B69] to-[#1C162E] shadow-md flex items-center justify-center text-lg border border-purple-400/30">
                🌑
              </div>
              <span className="text-[9px] font-bold text-gray-400 mt-1">Plutón</span>
            </div>
          </div>

          {/* Leyenda */}
          <div className="border-t border-white/10 pt-2.5 mt-2 flex items-center justify-between text-[9px] font-bold text-gray-300 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span>☁ = bloque pendiente</span>
              <span>⭐ = bloque dominado</span>
              <span>🚀 = posición actual</span>
            </div>
            <span className="text-amber-300 font-extrabold">
              👩‍🚀 ¡La nave está en Mercurio, lista para empezar!
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          8. CENTRO DE INFORMES (Imagen 4 Abajo & Imagen 5 Arriba)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div className="bg-gradient-to-r from-[#140830] to-[#1E0848] border border-purple-500/35 rounded-2xl p-4 shadow-xl text-white">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-base shrink-0">
                📊
              </div>
              <div>
                <h4 className="font-['Baloo_2',sans-serif] text-sm font-black text-white leading-tight">
                  Centro de Informes
                </h4>
                <p className="text-[9px] font-bold text-purple-200/70">
                  Seguimiento docente y familia
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                Swal.fire({
                  title: '📊 Centro de Informes',
                  html: `
                    <div style="text-align:left;font-size:13px;line-height:1.6">
                      <p><b>Estudiante:</b> ${student.name || 'Astronauta'}</p>
                      <p><b>XP Total:</b> ${totalXP} XP</p>
                      <p><b>Niveles dominados:</b> ${passedLevelsCount} de ${totalLevelsCount || 195}</p>
                      <p><b>Racha activa:</b> ${streak} días</p>
                    </div>
                  `,
                  icon: 'info',
                  confirmButtonText: 'Cerrar',
                  confirmButtonColor: '#7B2FBE',
                });
              }}
              className="bg-gradient-to-r from-[#F5C518] to-[#FF8C2A] text-[#2A0F60] font-black text-xs px-3.5 py-1.5 rounded-lg cursor-pointer hover:opacity-95"
            >
              Ver informe →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white/8 rounded-xl p-2 text-center">
              <div className="text-base font-black text-amber-400 font-['Baloo_2',sans-serif] leading-tight">
                {totalXP}
              </div>
              <div className="text-[8px] font-bold text-gray-300 uppercase mt-0.5">
                XP TOTAL
              </div>
            </div>
            <div className="bg-white/8 rounded-xl p-2 text-center">
              <div className="text-base font-black text-emerald-400 font-['Baloo_2',sans-serif] leading-tight">
                {passedLevelsCount}
              </div>
              <div className="text-[8px] font-bold text-gray-300 uppercase mt-0.5">
                NIVEL FIT
              </div>
            </div>
            <div className="bg-white/8 rounded-xl p-2 text-center">
              <div className="text-base font-black text-orange-400 font-['Baloo_2',sans-serif] leading-tight">
                {streak}🔥
              </div>
              <div className="text-[8px] font-bold text-gray-300 uppercase mt-0.5">
                RACHA
              </div>
            </div>
          </div>

          {/* Mini line indicators */}
          <div className="space-y-1.5 mb-3">
            {CANONICAL_UNITS_3RO.map((u) => (
              <div key={u.index} className="flex items-center gap-2 text-[9px] text-gray-300 font-bold">
                <span className="w-2">{u.icon}</span>
                <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${u.index === 0 ? 10 : 0}%` }} />
                </div>
                <span className="w-5 text-right">{u.index === 0 ? '0%' : '0%'}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              fedorSpeak('Analizando tu progreso con Inteligencia Artificial. ¡Vas por muy buen camino!');
              Swal.fire({
                title: '🤖 Análisis Pedagógico IA',
                html: `
                  <div style="text-align:left;font-size:13px;line-height:1.6">
                    <p><b>Diagnóstico:</b> El estudiante demuestra entusiasmo y ritmo constante.</p>
                    <p><b>Recomendación:</b> Avanzar con los 5 temas de la <b>Unidad 1: Adición y Números</b> para fortalecer el conteo y la recta numérica.</p>
                  </div>
                `,
                icon: 'success',
                confirmButtonText: '¡Continuar!',
                confirmButtonColor: '#7B2FBE',
              });
            }}
            className="w-full py-2 px-3 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 font-black text-xs cursor-pointer hover:bg-amber-400/25 flex items-center justify-center gap-2"
          >
            <span>🤖</span>
            <span>Análisis IA Fedor</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          9. RECOMPENSA DIARIA (Imagen 5 Arriba)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div
          onClick={handleClaimDaily}
          className="bg-gradient-to-r from-[#0E684D] to-[#16876A] border border-emerald-400/35 rounded-2xl p-3.5 shadow-lg flex items-center gap-3 cursor-pointer hover:scale-[1.006] transition-transform text-white"
        >
          <span className="text-3xl">🎁</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-sm tracking-wide text-emerald-100">
              Recompensa diaria
            </h4>
            <p className="text-[11px] font-bold text-emerald-200/90">
              ¡Entra cada día y gana XP extra!
            </p>
          </div>
          <span className={`text-[11px] font-black px-3 py-1 rounded-full shadow-sm ${claimedDaily ? 'bg-emerald-800/80 text-emerald-200' : 'bg-emerald-400 text-emerald-950 animate-pulse'}`}>
            {claimedDaily ? '¡Reclamado!' : '¡Disponible!'}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          10. MATEMÁTICAS DE FEDOR / LIBRO EXCEL (Imagen 5 Medio)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div className="bg-[#FFF4EB] border border-[#FAD0B0] rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-3 text-[#180D38]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-lg text-white">
              🚀
            </div>
            <div>
              <h4 className="font-black text-xs md:text-sm text-[#7A3200]">
                Matemáticas de Fedor
              </h4>
              <p className="text-[10px] font-bold text-gray-500">
                Libro Interactivo · Grado 3° · Colombia
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] font-bold text-gray-500">¿Tienes el libro Excel?</div>
            <div className="text-[10px] font-black text-[#E8650A]">Úsalos juntos 📊</div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          11. MISIÓN DEL DÍA (Imagen 5 Medio)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div className="bg-gradient-to-r from-[#7B2FBE] via-[#9847E0] to-[#E8650A] rounded-2xl p-4 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎯</span>
              <div>
                <span className="text-[9px] font-black tracking-widest text-amber-300 uppercase">
                  MISIÓN DEL DÍA
                </span>
                <h4 className="text-xs md:text-sm font-black leading-tight">
                  Gana 200 XP en el día
                </h4>
              </div>
            </div>
            <span className="text-[10px] font-black bg-white/15 px-2.5 py-0.5 rounded-full border border-white/25">
              🔒 +100 XP · +60 🪙
            </span>
          </div>

          <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-amber-300 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.max(4, (totalXP / 200) * 100))}%` }}
            />
          </div>

          <div className="text-[9px] font-bold text-white/80 mt-1">
            {totalXP} / 200
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          12. DESAFÍO DEL DÍA (Imagen 5 Medio-Abajo)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div className="bg-gradient-to-r from-[#0A3D2E] to-[#125A44] border border-emerald-500/40 rounded-2xl p-3.5 shadow-md flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-amber-300">⚡</span>
            <div>
              <h4 className="font-black text-xs md:text-sm">
                Desafío del día · {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'short' })}
              </h4>
              <p className="text-[10px] font-bold text-emerald-200/90">
                ¡Gana el doble de monedas hoy!
              </p>
            </div>
          </div>
          <span className="bg-amber-400 text-purple-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-sm">
            🏅 x2
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          13. PROGRESO TOTAL (Imagen 5 Abajo)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div className="bg-white border border-[#DDD8F5] rounded-2xl p-3.5 shadow-xs flex items-center gap-4 text-[#180D38]">
          <span className="text-xs font-black text-gray-700 flex items-center gap-1.5 shrink-0">
            <span>📚</span> Progreso total
          </span>
          <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#7B2FBE] to-[#E8650A] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-black text-[#7B2FBE] shrink-0">
            {progressPct}%
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          14. MAPA DE PROGRESO — UNIDAD 1 (Imagen 5 Abajo)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div className="bg-white border border-[#DDD8F5] rounded-2xl p-3.5 shadow-xs text-[#180D38]">
          <div className="text-xs font-black text-gray-800 flex items-center gap-2 mb-2">
            <span>🗺️</span>
            <span>MAPA DE PROGRESO — UNIDAD 1</span>
          </div>
          <div className="flex items-center justify-between px-2 pt-1 gap-1 overflow-x-auto scrollbar-none">
            {['Conteo', 'Suma', 'Decena', 'Recta', 'Problemas'].map((t, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                  {idx + 1}
                </div>
                <span className="text-[9px] font-bold text-gray-500 mt-1">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          15. CARD LABORATORIO DE ESTADÍSTICA (Imagen 5 Pie)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div
          onClick={() => selectUnit(0)}
          className="relative bg-gradient-to-r from-[#0F5C42] via-[#16875E] to-[#0F5C42] rounded-[22px] p-4 md:p-5 flex items-center gap-4 cursor-pointer shadow-xl border-2 border-[#FFE066]/35 overflow-hidden transition-all hover:scale-[1.006] active:scale-[0.99]"
        >
          {/* Badge NUEVO */}
          <div className="absolute top-2.5 right-3 bg-gradient-to-r from-[#FF6B35] to-[#FFD54F] text-[#4A0E00] text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-sm tracking-wider uppercase">
            NUEVO
          </div>

          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl md:text-4xl shrink-0 shadow-inner">
            🧪
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="font-['Baloo_2',sans-serif] text-lg md:text-xl font-black text-[#FFE066] drop-shadow-sm tracking-wide">
              Laboratorio de Estadística
            </div>
            <div className="text-xs md:text-sm font-bold text-white/95 mt-1 leading-snug">
              ¡Crea tus propias encuestas! Mete datos, mira el gráfico cambiar en vivo y genera preguntas para tus amigos.
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                selectUnit(0);
              }}
              className="mt-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFE066] to-[#FFC947] text-[#0A4030] font-black text-xs border-2 border-white shadow-md cursor-pointer hover:opacity-95 transition-opacity inline-flex items-center gap-1"
            >
              🚀 ABRIR LABORATORIO →
            </button>
          </div>

          <div className="hidden sm:block shrink-0 bg-white rounded-xl p-2.5 shadow-md">
            <svg width="70" height="52" viewBox="0 0 70 52" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="24" width="10" height="24" rx="2" fill="#E53935" />
              <rect x="20" y="12" width="10" height="36" rx="2" fill="#FFD54F" />
              <rect x="36" y="4" width="10" height="44" rx="2" fill="#3AA0FF" />
              <rect x="52" y="18" width="10" height="30" rx="2" fill="#7B2FBE" />
            </svg>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          16. UNIDADES DE APRENDIZAJE (Idéntico a Imagen 2)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap mb-8">
        {/* Badge Pill "🎲 UNIDADES DE APRENDIZAJE" */}
        <div className="mb-3.5">
          <span className="inline-flex items-center gap-1.5 bg-[#1A56DB] text-white text-[11px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
            <span>🎲</span> UNIDADES DE APRENDIZAJE
          </span>
        </div>

        {/* Vertical List of Unit Cards */}
        <div className="space-y-3">
          {CANONICAL_UNITS_3RO.map((u) => {
            const unit = book?.units?.[u.index];
            let unitTotalEx = 0;
            let unitPassedEx = 0;

            (unit?.topics || []).forEach((t) => {
              (t.levels || []).forEach((lv, li) => {
                unitTotalEx++;
                const key = `${t.id}-n${li + 1}`;
                if ((scores[key] || 0) >= 70) {
                  unitPassedEx++;
                }
              });
            });

            const unitPct = unitTotalEx > 0 ? Math.round((unitPassedEx / unitTotalEx) * 100) : 0;

            return (
              <div
                key={u.index}
                onClick={() => selectUnit(u.index)}
                className={`unit-card ${u.accentClass}`}
              >
                <div className="uc-row">
                  {/* Icon Box */}
                  <div className="uc-icon-wrap" style={{ background: u.iconBg }}>
                    <span>{u.icon}</span>
                  </div>

                  {/* Info */}
                  <div className="uc-info">
                    <div className="uc-name">{u.name}</div>
                    <div className="uc-meta">{u.meta}</div>
                    <div className="uc-prog-bar">
                      <div
                        className="uc-prog-fill"
                        style={{
                          width: `${unitPct}%`,
                          background: u.accentGradient,
                        }}
                      />
                    </div>
                  </div>

                  {/* Percentage */}
                  <div className="uc-right">
                    <div className="uc-pct">{unitPct}%</div>
                  </div>
                </div>

                {/* Pills / Tags row */}
                <div className="pills">
                  {u.pills.map((pill, pIdx) => (
                    <span
                      key={pIdx}
                      className="pill"
                      style={{
                        background: pill.bg,
                        color: pill.color,
                        borderColor: pill.border,
                      }}
                    >
                      {pill.text}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ Modal de Selección de Nivel de Problemas Cotidianos (Idéntico a Imagen 2) ══ */}
      <ProblemasModal3ro
        isOpen={showProblemasModal}
        onClose={() => setShowProblemasModal(false)}
        onStartNivel={(nIdx, tab) => {
          setShowProblemasModal(false);
          setActiveProblemasNivel(nIdx);
          setActiveProblemasTab(tab);
          goScreen('problemas');
        }}
      />

      <style jsx>{`
        .home-screen-shell {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          box-sizing: border-box;
          padding: 0 16px 5rem;
          font-family: 'Nunito', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .hero-banner-main {
          position: relative;
          padding: 2.2rem 1.75rem 2.6rem;
          border-radius: 28px;
          background: linear-gradient(180deg, #1E0942 0%, #140630 60%, #0D0422 100%);
          border: 1px solid rgba(147, 51, 234, 0.3);
          box-shadow: 0 6px 20px rgba(24, 13, 56, 0.12), 0 2px 6px rgba(24, 13, 56, 0.08);
          overflow: hidden;
          text-align: center;
        }

        .section-card-wrap {
          width: 100%;
          position: relative;
        }

        .pc-home-card {
          cursor: pointer;
          border-radius: 16px;
          padding: 0.95rem 1.25rem;
          background: linear-gradient(135deg, #1A0A3C 0%, #3D1468 50%, #0A2820 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 0.9rem;
          box-shadow: 0 8px 28px rgba(44, 16, 112, 0.4);
          border: 1.5px solid rgba(245, 197, 24, 0.35);
          transition: all 0.22s ease;
          position: relative;
          overflow: hidden;
        }

        .pc-home-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(44, 16, 112, 0.5);
          border-color: rgba(245, 197, 24, 0.65);
        }

        .pc-nuevo-badge {
          position: absolute;
          top: 8px;
          right: 14px;
          z-index: 3;
          background: linear-gradient(135deg, #FF1D4E, #F5C518);
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
          padding: 3px 10px;
          border-radius: 8px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 2px 6px rgba(255, 29, 78, 0.3);
        }

        .pc-icon-wrap {
          font-size: 32px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .pc-content-wrap {
          flex: 1;
          min-width: 0;
          padding-right: 2rem;
        }

        .pc-title {
          font-size: 15.5px;
          font-weight: 900;
          letter-spacing: 0.01em;
          color: #ffffff;
          line-height: 1.2;
          margin: 0;
        }

        .pc-subtitle {
          font-size: 11px;
          opacity: 0.85;
          margin-top: 3px;
          font-weight: 700;
          color: #E9D5FF;
        }

        .pc-pills-row {
          display: flex;
          gap: 0.45rem;
          margin-top: 0.45rem;
          flex-wrap: wrap;
        }

        .pc-pill {
          border-radius: 6px;
          padding: 2px 9px;
          font-size: 10px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          letter-spacing: 0.01em;
        }

        .pc-pill-add {
          background: rgba(22, 135, 106, 0.35);
          border: 1px solid rgba(22, 135, 106, 0.55);
          color: #A7F3D0;
        }

        .pc-pill-sub {
          background: rgba(14, 107, 168, 0.35);
          border: 1px solid rgba(14, 107, 168, 0.55);
          color: #BAE6FD;
        }

        .pc-pill-mul {
          background: rgba(138, 43, 226, 0.35);
          border: 1px solid rgba(138, 43, 226, 0.55);
          color: #E9D5FF;
        }

        .pc-pill-div {
          background: rgba(255, 140, 42, 0.35);
          border: 1px solid rgba(255, 140, 42, 0.55);
          color: #FED7AA;
        }

        .pc-arrow-wrap {
          font-size: 22px;
          opacity: 0.75;
          flex-shrink: 0;
          color: #ffffff;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .pc-home-card:hover .pc-arrow-wrap {
          opacity: 1;
          transform: translateX(3px);
        }

        .quick-bar-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 12px 6px;
          border-radius: 16px;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .quick-bar-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
        }

        .quick-bar-btn:active {
          transform: scale(0.95);
        }

        .unit-card {
          background: #FFFFFF;
          border: 1.5px solid #DDD8F5;
          border-radius: 20px;
          padding: 1.1rem 1.25rem;
          margin-bottom: 0.8rem;
          cursor: pointer;
          transition: all 0.22s;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(108, 40, 180, 0.06);
        }

        .unit-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          border-radius: 20px 0 0 20px;
        }

        .uc-purple::before {
          background: linear-gradient(180deg, #7B2FBE, #A864E8);
        }

        .uc-teal::before {
          background: linear-gradient(180deg, #16876A, #24C496);
        }

        .uc-orange::before {
          background: linear-gradient(180deg, #E8650A, #FF8C2A);
        }

        .unit-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(108, 40, 180, 0.12);
        }

        .uc-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .uc-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          flex-shrink: 0;
        }

        .uc-info {
          flex: 1;
          min-width: 0;
        }

        .uc-name {
          font-size: 15px;
          font-weight: 900;
          color: #180D38;
          margin-bottom: 2px;
        }

        .uc-meta {
          font-size: 11px;
          color: #7A7299;
          font-weight: 700;
        }

        .uc-right {
          text-align: right;
          flex-shrink: 0;
        }

        .uc-pct {
          font-size: 15px;
          font-weight: 900;
          color: #7B2FBE;
        }

        .uc-prog-bar {
          height: 4px;
          background: #EEEBF8;
          border-radius: 2px;
          margin-top: 8px;
          overflow: hidden;
        }

        .uc-prog-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        .pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
          padding-left: 2px;
        }

        .pill {
          font-size: 10.5px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid;
          letter-spacing: 0.01em;
        }
      `}</style>
    </div>
  );
}
