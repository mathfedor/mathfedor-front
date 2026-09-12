'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook3 } from '../context/Book3Context';
import { fedorSpeak } from '../shared/Grade3Speech';
import Swal from 'sweetalert2';
import ProblemasModal3ro from '../shared/ProblemasModal3ro';
import UniversoFedorModal3ro, { GALAXY_PLANETS_3RO } from '../shared/UniversoFedorModal3ro';
import MascotaModal3ro from '../shared/MascotaModal3ro';
import GuiaDocenteModal3ro from '../shared/GuiaDocenteModal3ro';
import CommandPanelModals3ro from '../shared/CommandPanelModals3ro';

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

export interface FedorRank3ro {
  id: number;
  emoji: string;
  name: string;
  xp: number;
  color: string;
  desc: string;
}

export const FEDOR_RANKS_3RO: FedorRank3ro[] = [
  { id: 0, emoji: '🌱', name: 'Cadete Estelar', xp: 0, color: '#16876A', desc: '¡Bienvenido a la academia! Empieza tu aventura.' },
  { id: 1, emoji: '🐣', name: 'Aprendiz Lunar', xp: 200, color: '#3AA0FF', desc: 'Ya conoces el camino. Sigue resolviendo bloques.' },
  { id: 2, emoji: '🚀', name: 'Explorador Cósmico', xp: 500, color: '#9B5CFF', desc: 'Tu nave vuela alto. ¡Conquista las galaxias!' },
  { id: 3, emoji: '⭐', name: 'Veterano del Espacio', xp: 1000, color: '#F5C518', desc: 'Brillas como una estrella. Los maestros te admiran.' },
  { id: 4, emoji: '🏆', name: 'Maestro Galáctico', xp: 2000, color: '#FF8C2A', desc: 'Eres un campeón. Pocos llegan hasta aquí.' },
  { id: 5, emoji: '☄️', name: 'Leyenda de Fedor', xp: 3500, color: '#FF1D4E', desc: '¡INCREÍBLE! Tu nombre se escribe en las estrellas.' },
];

export function getFedorRank3ro(xp: number): FedorRank3ro {
  let r = FEDOR_RANKS_3RO[0];
  for (let i = 0; i < FEDOR_RANKS_3RO.length; i++) {
    if (xp >= FEDOR_RANKS_3RO[i].xp) {
      r = FEDOR_RANKS_3RO[i];
    }
  }
  return r;
}

export function getNextFedorRank3ro(xp: number): FedorRank3ro | null {
  for (let i = 0; i < FEDOR_RANKS_3RO.length; i++) {
    if (xp < FEDOR_RANKS_3RO[i].xp) {
      return FEDOR_RANKS_3RO[i];
    }
  }
  return null;
}

const COMMAND_PANEL_ACTIONS = [
  { id: 'tienda', cls: 'tienda', ico: '🛒', lbl: 'Tienda', color: 'linear-gradient(135deg, #16876A, #24C496)', textColor: '#FFFFFF' },
  { id: 'espacial', cls: 'espacial', ico: '🚀', lbl: 'Espacial', color: 'linear-gradient(135deg, #6C28B4, #9B5CFF)', textColor: '#FFFFFF' },
  { id: 'diario', cls: 'diario', ico: '📓', lbl: 'Diario', color: 'linear-gradient(135deg, #0E6BA8, #3AA0FF)', textColor: '#FFFFFF' },
  { id: 'examen', cls: 'examen', ico: '📝', lbl: 'Examen', color: 'linear-gradient(135deg, #A30041, #FF1D4E)', textColor: '#FFFFFF' },
  { id: 'despegue', cls: 'intro', ico: '🎬', lbl: 'Despegue', color: 'linear-gradient(135deg, #FF8C2A, #F5C518)', textColor: '#3A1A00' },
  { id: 'stickers', cls: 'album', ico: '🎴', lbl: 'Stickers', color: 'linear-gradient(135deg, #9B0066, #FF1DAA)', textColor: '#FFFFFF' },
  { id: 'juegos', cls: 'juegos', ico: '🎮', lbl: 'Juegos', color: 'linear-gradient(135deg, #FF1D4E, #FF8C2A)', textColor: '#FFFFFF' },
  { id: 'galaxia3d', cls: 'galaxia3d', ico: '🌌', lbl: 'Galaxia 3D', color: 'rgba(255, 255, 255, 0.08)', textColor: '#FFFFFF', border: '2px solid rgba(255, 255, 255, 0.2)' },
  { id: 'mascota', cls: 'mascota', ico: '🐾', lbl: 'Mascota', color: 'rgba(255, 255, 255, 0.08)', textColor: '#FFFFFF', border: '2px solid rgba(255, 255, 255, 0.2)' },
  { id: 'historia', cls: 'historia', ico: '📖', lbl: 'Historia', color: 'rgba(255, 255, 255, 0.08)', textColor: '#FFFFFF', border: '2px solid rgba(255, 255, 255, 0.2)' },
  { id: 'estandares', cls: 'estandares', ico: '📋', lbl: 'Estándares', color: 'rgba(255, 255, 255, 0.08)', textColor: '#FFFFFF', border: '2px solid rgba(255, 255, 255, 0.2)' },
  { id: 'misiones', cls: 'misiones', ico: '🎯', lbl: 'Misiones', color: 'rgba(255, 255, 255, 0.08)', textColor: '#FFFFFF', border: '2px solid rgba(255, 255, 255, 0.2)' },
  { id: 'definiciones', cls: 'definic', ico: '📚', lbl: 'Definiciones', color: 'rgba(255, 255, 255, 0.08)', textColor: '#FFFFFF', border: '2px solid rgba(255, 255, 255, 0.2)' },
  { id: 'maraton', cls: 'maraton', ico: '🏃', lbl: 'Maratón', color: 'rgba(255, 255, 255, 0.08)', textColor: '#FFFFFF', border: '2px solid rgba(255, 255, 255, 0.2)' },
  { id: 'minijuegos', cls: 'minijuego', ico: '🕹️', lbl: 'Minijuegos', color: 'rgba(255, 255, 255, 0.08)', textColor: '#FFFFFF', border: '2px solid rgba(255, 255, 255, 0.2)' },
  { id: 'explicar', cls: 'explicar', ico: '💡', lbl: 'Explicar', color: 'linear-gradient(135deg, #E8650A, #F5C518)', textColor: '#3A1A00' },
  { id: 'pcotid', cls: 'probcot', ico: '🧮', lbl: 'P.Cotid.', color: 'linear-gradient(135deg, #2A1070, #6C28B4)', textColor: '#FFFFFF' },
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
    updateStats,
  } = useBook3();

  const [claimedDaily, setClaimedDaily] = useState(false);
  const [showProblemasModal, setShowProblemasModal] = useState(false);
  const [showUniversoModal, setShowUniversoModal] = useState(false);
  const [showMascotaModal, setShowMascotaModal] = useState(false);
  const [showGuiaModal, setShowGuiaModal] = useState(false);
  const [activeCommandModal, setActiveCommandModal] = useState<string | null>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);

  // Rangos de Fedor y progreso de XP
  const currentRank = getFedorRank3ro(totalXP);
  const nextRank = getNextFedorRank3ro(totalXP);

  const rankProgressPct = nextRank
    ? Math.min(100, Math.max(0, ((totalXP - currentRank.xp) / (nextRank.xp - currentRank.xp)) * 100))
    : 100;

  const rankLabel = nextRank
    ? `${nextRank.xp - totalXP} XP para ${nextRank.emoji} ${nextRank.name}`
    : '🌟 ¡RANGO MÁXIMO ALCANZADO!';

  // Progreso por unidad para el mapa galáctico y modales
  const unitsProgressMap: Record<number, number> = {};
  (book?.units || []).forEach((u, uIdx) => {
    let uTotal = 0;
    let uPassed = 0;
    (u.topics || []).forEach((t) => {
      (t.levels || []).forEach((lv, li) => {
        uTotal++;
        const key = `${t.id}-n${li + 1}`;
        if ((scores[key] || 0) >= 70) {
          uPassed++;
        }
      });
    });
    unitsProgressMap[uIdx] = uTotal > 0 ? Math.round((uPassed / uTotal) * 100) : 0;
  });

  // Pintar estrellas en el mini canvas del Universo Fedor
  useEffect(() => {
    const cv = miniCanvasRef.current;
    if (!cv) return;
    const parent = cv.parentElement;
    const cw = parent?.offsetWidth || 1100;
    const ch = parent?.offsetHeight || 130;
    cv.width = cw;
    cv.height = ch;
    const ctx2 = cv.getContext('2d');
    if (!ctx2) return;
    ctx2.fillStyle = '#020B18';
    ctx2.fillRect(0, 0, cw, ch);
    for (let i = 0; i < 85; i++) {
      const x = Math.random() * cw;
      const y = Math.random() * ch;
      const r = Math.random() * 1.4 + 0.3;
      ctx2.globalAlpha = Math.random() * 0.7 + 0.3;
      ctx2.fillStyle = i % 4 === 0 ? '#FFE08A' : i % 6 === 0 ? '#8AC8FF' : '#FFF';
      ctx2.beginPath();
      ctx2.arc(x, y, r, 0, Math.PI * 2);
      ctx2.fill();
    }
  }, []);

  const isGalaxyPlanetUnlocked = (idx: number) => {
    const p = GALAXY_PLANETS_3RO[idx];
    if (!p) return false;
    if (idx <= 2) return true; // 🌍 Tierra, 🌙 Luna, 🔴 Marte accesibles inicialmente
    const prev = GALAXY_PLANETS_3RO[idx - 1];
    if (!prev) return true;
    if (prev.unit < 0) return isGalaxyPlanetUnlocked(idx - 1);
    const prevPct = unitsProgressMap[prev.unit] || 0;
    return prevPct >= 50;
  };

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
    if (action.id === 'despegue') {
      onOpenIntro();
    } else if (action.id === 'mascota') {
      setShowMascotaModal(true);
    } else if (action.id === 'pcotid') {
      setShowProblemasModal(true);
    } else {
      setActiveCommandModal(action.id);
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
          3. GALAXY MAP TRACK (UNIVERSO FEDOR - EXACTO A LA IMAGEN)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div
          className="universo-preview-card"
          onClick={() => setShowUniversoModal(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setShowUniversoModal(true);
            }
          }}
          title="Toca para explorar el Universo Fedor"
        >
          {/* Mini Canvas Fondo Estelar */}
          <canvas
            ref={miniCanvasRef}
            className="universo-preview-canvas"
          />

          <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
            {/* Header: Titulo y Mejor Racha */}
            <div className="universo-preview-header">
              <div>
                <div className="universo-subhead">
                  <span className="text-[11px]">🌌</span>
                  <span>UNIVERSO FEDOR - 3ER GRADO</span>
                </div>
                <div className="universo-mainhead">
                  <span className="text-[16px]">🌌</span>
                  <span>Galaxia 3° · Del Saber</span>
                </div>
              </div>
              <div className="universo-streak-wrap">
                <div className="universo-streak-val">
                  {streak} 🔥
                </div>
                <div className="universo-streak-lbl">
                  mejor racha
                </div>
              </div>
            </div>

            {/* Fila de 14 Planetas idéntica a la Imagen */}
            <div className="universo-planets-row">
              {GALAXY_PLANETS_3RO.map((p, i) => {
                const pct = p.unit >= 0 ? (unitsProgressMap[p.unit] || 0) : 100;
                const unlocked = isGalaxyPlanetUnlocked(i);
                const hasStarted = p.unit < 0 || pct > 0;
                const iconSize = hasStarted ? 26 : unlocked ? 22 : 20;
                const opa = hasStarted ? 1 : unlocked ? 0.75 : 0.35;

                return (
                  <React.Fragment key={p.id}>
                    <div
                      className="universo-planet-col"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUniversoModal(true);
                      }}
                    >
                      <div
                        className="universo-planet-icon-wrap"
                        style={{
                          fontSize: `${iconSize}px`,
                          opacity: opa,
                          filter: hasStarted
                            ? `drop-shadow(0 0 7px ${p.glow})`
                            : unlocked
                            ? 'grayscale(0.15)'
                            : 'grayscale(0.75)',
                          animation: hasStarted ? `universoFloat ${2.2 + i * 0.25}s ease-in-out infinite` : 'none',
                        }}
                      >
                        {p.icon}
                        {!unlocked && p.unit >= 0 && (
                          <div className="universo-lock-badge">
                            🔒
                          </div>
                        )}
                      </div>

                      {pct > 0 ? (
                        <div className="universo-pct-badge">
                          {pct}%
                        </div>
                      ) : unlocked ? (
                        <div className="universo-play-badge">
                          ▶
                        </div>
                      ) : (
                        <div className="universo-badge-placeholder" />
                      )}
                    </div>

                    {i < GALAXY_PLANETS_3RO.length - 1 && (
                      <div
                        className="universo-trail-line"
                        style={{
                          borderTopColor: `rgba(245, 197, 24, ${
                            unlocked && hasStarted ? 0.55 : unlocked ? 0.25 : 0.12
                          })`,
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Footer text */}
            <div className="universo-footer-hint">
              👆 Toca para explorar · arrastra para viajar
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          4. BARRA DE NAVEGACIÓN HORIZONTAL (Exacta a la imagen)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div id="c57NavBar" className="c57-nav-bar">
          {/* 1. Inicio */}
          <div className="c57-nav-item">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                goScreen('home');
              }}
              className="c57-nav-btn"
              style={{ background: 'linear-gradient(135deg, #F5A623, #FFB066)' }}
              title="Inicio"
            >
              <span>🏠</span>
            </button>
            <div className="c57-nav-label">
              Inicio
            </div>
          </div>

          {/* 2. Menú */}
          <div className="c57-nav-item">
            <button
              type="button"
              onClick={() => {
                const u = document.querySelector('#screen-home .unit-grid, #unitList, .unit-card, [id="unidades-aprendizaje"]');
                if (u) {
                  u.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  goScreen('unit');
                }
              }}
              className="c57-nav-btn"
              style={{ background: 'linear-gradient(135deg, #06A570, #4DD9A0)' }}
              title="Menú"
            >
              <span>📋</span>
            </button>
            <div className="c57-nav-label">
              Menú
            </div>
          </div>

          {/* 3. Fedor */}
          <div className="c57-nav-item">
            <button
              type="button"
              onClick={() => setShowMascotaModal(true)}
              className="c57-nav-btn"
              style={{ background: 'linear-gradient(135deg, #7B2FBE, #B983FF)' }}
              title="Fedor"
            >
              <span>🐲</span>
            </button>
            <div className="c57-nav-label">
              Fedor
            </div>
          </div>

          {/* 4. Definic. */}
          <div className="c57-nav-item">
            <button
              type="button"
              onClick={() => goScreen('definiciones')}
              className="c57-nav-btn"
              style={{ background: 'linear-gradient(135deg, #3AA0FF, #7BC6FF)' }}
              title="Definic."
            >
              <span>📚</span>
            </button>
            <div className="c57-nav-label">
              Definic.
            </div>
          </div>

          {/* 5. Guía Doc. */}
          <div className="c57-nav-item">
            <button
              type="button"
              onClick={() => setShowGuiaModal(true)}
              className="c57-nav-btn"
              style={{ background: 'linear-gradient(135deg, #16876A, #24C496)' }}
              title="Guía Doc."
            >
              <span>👩‍🏫</span>
            </button>
            <div className="c57-nav-label">
              Guía Doc.
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          5. CADETE ESTELAR / PROGRESO XP (Exacto a la Imagen)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div id="fedorRankCard" className="fedor-rank-card">
          <div className="rank-head">
            <div className="rank-emoji" id="rkEmoji">
              {currentRank.emoji}
            </div>
            <div className="rank-info">
              <div
                className="rank-name"
                id="rkName"
                style={{ color: currentRank.color }}
              >
                {currentRank.name}
              </div>
              <div className="rank-xp" id="rkXP">
                <span>{totalXP}</span> XP totales
              </div>
              <div className="rank-desc" id="rkDesc">
                {currentRank.desc}
              </div>
            </div>
          </div>

          <div className="rank-bar-wrap">
            <div
              className="rank-bar-fill"
              id="rkBarFill"
              style={{ width: `${rankProgressPct}%` }}
            />
          </div>

          <div className="rank-progress-lbl" id="rkLbl">
            {rankLabel}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          6. PANEL DE COMANDO (Exacto a la Imagen de Referencia)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div id="fedorActionBar" className="fedor-action-bar">
          {/* Badge "⚡ PANEL DE COMANDO" */}
          <div className="fedor-action-badge">
            ⚡ PANEL DE COMANDO
          </div>

          {/* Botones Horizontales */}
          <div className="fedor-action-scroll">
            {COMMAND_PANEL_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleCommandAction(action)}
                className={`ab-btn ${action.cls}`}
                style={{
                  background: action.color,
                  color: action.textColor || '#FFFFFF',
                  border: action.border || '2px solid rgba(255,255,255,0.2)',
                }}
                title={action.lbl}
              >
                <span className="ab-ico">{action.ico}</span>
                <span className="ab-lbl">{action.lbl}</span>
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

      {/* ══ Modal de Universo Fedor Interactivo (Animación HTML) ══ */}
      <UniversoFedorModal3ro
        isOpen={showUniversoModal}
        onClose={() => setShowUniversoModal(false)}
        onSelectUnit={(uIdx) => {
          setShowUniversoModal(false);
          selectUnit(uIdx);
        }}
        unitsProgress={unitsProgressMap}
        totalXP={totalXP}
        userAvatar={student?.avatar || '🧑‍🚀'}
      />

      {/* ══ Modal de Mascota Espacial (Astro el perro espacial) ══ */}
      <MascotaModal3ro
        isOpen={showMascotaModal}
        onClose={() => setShowMascotaModal(false)}
      />

      {/* ══ Modal de Guía Docente ══ */}
      <GuiaDocenteModal3ro
        isOpen={showGuiaModal}
        onClose={() => setShowGuiaModal(false)}
      />

      {/* ══ Modales Interactivos del Panel de Comando ══ */}
      <CommandPanelModals3ro
        activeModal={activeCommandModal}
        onClose={() => setActiveCommandModal(null)}
        coins={coins}
        totalXP={totalXP}
        streak={streak}
        studentName={student?.name || 'Astronauta'}
        onAddCoins={(amount) => updateStats(amount, 0, 0)}
        onAddXP={(amount) => updateStats(0, 0, amount)}
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

        .universo-preview-card {
          background: linear-gradient(180deg, #020B18 0%, #050E2A 50%, #0A1840 100%);
          border-radius: 20px;
          padding: 1rem 1.2rem 0.85rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(59, 130, 246, 0.25);
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }

        .universo-preview-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 44px rgba(10, 24, 64, 0.8), 0 0 24px rgba(77, 166, 255, 0.2);
          border-color: rgba(245, 197, 24, 0.5);
        }

        .universo-preview-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .universo-preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.55rem;
        }

        .universo-subhead {
          font-size: 9.5px;
          font-weight: 900;
          color: #F5C518;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .universo-mainhead {
          font-size: 15.5px;
          font-weight: 900;
          color: #FFFFFF;
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 0.01em;
        }

        .universo-streak-wrap {
          text-align: right;
        }

        .universo-streak-val {
          font-size: 18px;
          font-weight: 900;
          color: #FF8C2A;
          line-height: 1;
        }

        .universo-streak-lbl {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 700;
          margin-top: 2px;
        }

        .universo-planets-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.35rem 0;
          width: 100%;
          gap: 2px;
        }

        .universo-planet-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          flex: 1;
          min-width: 0;
          position: relative;
        }

        .universo-planet-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: transform 0.2s ease;
        }

        .universo-planet-col:hover .universo-planet-icon-wrap {
          transform: scale(1.18);
        }

        .universo-lock-badge {
          position: absolute;
          top: -4px;
          right: -5px;
          font-size: 9px;
          background: rgba(0, 0, 0, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .universo-pct-badge {
          font-size: 7.5px;
          font-weight: 900;
          color: #F5C518;
          background: rgba(0, 0, 0, 0.65);
          border: 1px solid rgba(245, 197, 24, 0.3);
          border-radius: 4px;
          padding: 1px 3.5px;
          line-height: 1.1;
          box-shadow: 0 0 6px rgba(245, 197, 24, 0.35);
          white-space: nowrap;
        }

        .universo-play-badge {
          height: 13px;
          font-size: 7.5px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.45);
          line-height: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .universo-badge-placeholder {
          height: 13px;
        }

        .universo-trail-line {
          flex: 1 1 0;
          min-width: 4px;
          max-width: 26px;
          height: 0;
          border-top: 2px dotted rgba(245, 197, 24, 0.25);
          align-self: center;
          margin-bottom: 13px;
        }

        .universo-footer-hint {
          text-align: center;
          font-size: 10.5px;
          color: rgba(255, 255, 255, 0.35);
          font-weight: 700;
          margin-top: 0.4rem;
          letter-spacing: 0.02em;
        }

        @keyframes universoFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .c57-nav-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          border-radius: 16px;
          padding: 0.85rem 1.25rem;
          background: linear-gradient(135deg, #0E1A3C 0%, #1A0A3C 50%, #0A1428 100%);
          box-shadow: 0 8px 28px rgba(14, 8, 48, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-family: 'Nunito', sans-serif;
          width: 100%;
          box-sizing: border-box;
        }

        .c57-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          flex: 1;
          min-width: 0;
        }

        .c57-nav-btn {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          color: #ffffff;
          border: none;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25), inset 0 -3px 0 rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.25);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          font-family: 'Nunito', sans-serif;
          padding: 0;
          outline: none;
        }

        .c57-nav-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35), inset 0 -3px 0 rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.35);
        }

        .c57-nav-btn:active {
          transform: scale(0.95);
        }

        .c57-nav-label {
          font-size: 9.5px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.85);
          text-align: center;
          letter-spacing: 0.01em;
          line-height: 1.1;
          white-space: nowrap;
        }

        .fedor-rank-card {
          position: relative;
          background: linear-gradient(135deg, #1E0848 0%, #3D1468 50%, #6C28B4 100%);
          border-radius: 18px;
          padding: 1rem 1.25rem 0.9rem;
          color: #ffffff;
          box-shadow: 0 12px 36px rgba(60, 20, 104, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(245, 197, 24, 0.5);
          overflow: hidden;
          z-index: 5;
          font-family: 'Nunito', sans-serif;
          width: 100%;
          box-sizing: border-box;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .fedor-rank-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 44px rgba(60, 20, 104, 0.65), inset 0 0 30px rgba(255, 255, 255, 0.12);
          border-color: rgba(245, 197, 24, 0.75);
        }

        .fedor-rank-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 30%, rgba(245, 197, 24, 0.22), transparent 60%),
            radial-gradient(circle at 80% 70%, rgba(91, 191, 255, 0.18), transparent 60%);
          pointer-events: none;
          animation: rankAura 4s ease-in-out infinite;
        }

        @keyframes rankAura {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        .rank-head {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 0.7rem;
        }

        .rank-emoji {
          font-size: 46px;
          line-height: 1;
          filter: drop-shadow(0 0 14px rgba(245, 197, 24, 0.7));
          animation: rankBob 2.5s ease-in-out infinite;
          flex-shrink: 0;
          user-select: none;
        }

        @keyframes rankBob {
          0%, 100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-4px) rotate(2deg);
          }
        }

        .rank-info {
          flex: 1;
          min-width: 0;
        }

        .rank-name {
          font-size: 18px;
          font-weight: 900;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          letter-spacing: -0.01em;
        }

        .rank-xp {
          font-size: 12px;
          color: #C5BFEE;
          font-weight: 800;
          margin-top: 2px;
        }

        .rank-desc {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 700;
          margin-top: 3px;
          font-style: italic;
        }

        .rank-bar-wrap {
          position: relative;
          z-index: 2;
          height: 10px;
          background: rgba(0, 0, 0, 0.45);
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 100%;
        }

        .rank-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #F5C518, #FF8C2A, #FF1D4E);
          border-radius: 6px;
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 12px rgba(245, 197, 24, 0.8);
        }

        .rank-progress-lbl {
          position: relative;
          z-index: 2;
          text-align: center;
          font-size: 11px;
          font-weight: 900;
          color: #FFD66B;
          margin-top: 6px;
          text-shadow: 0 0 8px rgba(245, 197, 24, 0.5);
          letter-spacing: 0.01em;
        }

        /* ── PANEL DE COMANDO (Exacto a la Imagen de Referencia) ── */
        .fedor-action-bar {
          position: relative;
          background: linear-gradient(135deg, #1A0A3C 0%, #2A0F60 50%, #0A1B40 100%);
          border: 2px solid rgba(91, 191, 255, 0.35);
          border-radius: 18px;
          padding: 16px 14px 14px 14px;
          box-shadow: 0 8px 30px rgba(10, 5, 30, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          z-index: 5;
        }

        .fedor-action-badge {
          position: absolute;
          top: -11px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #FF1D4E, #F5C518);
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
          padding: 3px 14px;
          border-radius: 14px;
          letter-spacing: 0.12em;
          box-shadow: 0 4px 12px rgba(255, 29, 78, 0.5);
          white-space: nowrap;
          text-transform: uppercase;
        }

        .fedor-action-scroll {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 2px;
        }

        .fedor-action-scroll::-webkit-scrollbar {
          display: none;
        }

        .ab-btn {
          flex: 0 0 88px;
          max-width: 88px;
          min-width: 88px;
          height: 76px;
          border-radius: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 8px 4px;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, border-color 0.2s ease;
          backdrop-filter: blur(8px);
          user-select: none;
          box-sizing: border-box;
        }

        .ab-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 22px rgba(91, 191, 255, 0.35);
          border-color: rgba(245, 197, 24, 0.8) !important;
        }

        .ab-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        .ab-ico {
          font-size: 26px;
          line-height: 1;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
        }

        .ab-lbl {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.02em;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          white-space: nowrap;
          text-align: center;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
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
