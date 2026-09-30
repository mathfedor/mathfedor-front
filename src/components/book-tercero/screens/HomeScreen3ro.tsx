'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useBook3 } from '../context/Book3Context';
import bookCurriculum3 from '@/mocks/data/book-curriculum-3.data.json';
import { fedorSpeak } from '../shared/Grade3Speech';
import Swal from 'sweetalert2';
import ProblemasModal3ro from '../shared/ProblemasModal3ro';
import UniversoFedorModal3ro, { GALAXY_PLANETS_3RO } from '../shared/UniversoFedorModal3ro';
import MascotaModal3ro from '../shared/MascotaModal3ro';
import GuiaDocenteModal3ro from '../shared/GuiaDocenteModal3ro';
import CommandPanelModals3ro from '../shared/CommandPanelModals3ro';
import StatsLabModal3ro from '../shared/StatsLabModal3ro';
import RetoEspacialModal3ro from '../shared/RetoEspacialModal3ro';
import ExamenFinalModal3ro from '../shared/ExamenFinalModal3ro';

interface HomeScreen3roProps {
  onOpenIntro: () => void;
}

function playSound(type: 'click' | 'coin') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'click') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch {}
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
    meta: '6 temas · Conteo, Suma, Decena, Recta, Problemas',
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
    meta: '4 temas · Tablas del 1 al 9 · Propiedad Conmutativa',
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
    meta: '3 temas · Chocolatinas de Math · Dividendo ÷ Divisor',
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
    icon: '📝',
    iconBg: '#F3E8FF',
    accentClass: 'uc-purple',
    accentGradient: 'linear-gradient(90deg, #F5C518, #FF8C2A)',
    pills: [
      { text: '➕➖ Mixtos', bg: '#FEF9E0', color: '#7A5000', border: '#F5C518' },
      { text: '📝 SABER', bg: '#FEF9E0', color: '#7A5000', border: '#F5C518' },
      { text: '🏆 Evaluación', bg: '#FEF9E0', color: '#7A5000', border: '#F5C518' },
    ],
  },
  {
    index: 5,
    name: 'Unidad 6 — Factores y Múltiplos',
    meta: '2 temas · Divisores · MCD · Múltiplos · MCM',
    icon: '🔢',
    iconBg: '#F3E5F5',
    accentClass: 'uc-purple',
    accentGradient: 'linear-gradient(90deg, #CE93D8, #9C27B0)',
    pills: [
      { text: '÷ Divisores', bg: '#F3E5F5', color: '#4A1070', border: '#C5BFEE' },
      { text: '× Múltiplos', bg: '#F3E5F5', color: '#4A1070', border: '#C5BFEE' },
      { text: '🔗 MCD · MCM', bg: '#F3E5F5', color: '#4A1070', border: '#C5BFEE' },
    ],
  },
  {
    index: 6,
    name: 'Unidad 7 — Fracciones',
    meta: '4 temas · Simplificar · Sumar · Multiplicar · Dividir',
    icon: '½',
    iconBg: '#E0F2F1',
    accentClass: 'uc-teal',
    accentGradient: 'linear-gradient(90deg, #80CBC4, #009688)',
    pills: [
      { text: '= Simplificar', bg: '#DCF5EE', color: '#074F3A', border: '#95DAC4' },
      { text: '+/- Sumar/Restar', bg: '#DCF5EE', color: '#074F3A', border: '#95DAC4' },
      { text: '×÷ Operar', bg: '#DCF5EE', color: '#074F3A', border: '#95DAC4' },
    ],
  },
  {
    index: 7,
    name: 'Unidad 8 — Aplicaciones con Fracciones',
    meta: '2 temas · Problemas reales · MCD y MCM aplicados',
    icon: '📝',
    iconBg: '#E3F2FD',
    accentClass: 'uc-blue',
    accentGradient: 'linear-gradient(90deg, #90CAF9, #1976D2)',
    pills: [
      { text: '🧮 Problemas', bg: '#E8F0FF', color: '#1A3A6A', border: '#8EBBF0' },
      { text: '🔗 MCD · MCM', bg: '#E8F0FF', color: '#1A3A6A', border: '#8EBBF0' },
    ],
  },
  {
    index: 8,
    name: 'Unidad 9 — Potenciación y Raíces',
    meta: '2 temas · Potencias · Propiedades · Raíces cuadradas',
    icon: '⚡',
    iconBg: '#FFF3E0',
    accentClass: 'uc-orange',
    accentGradient: 'linear-gradient(90deg, #FFE082, #FF6F00)',
    pills: [
      { text: '2² Potencias', bg: '#FAECE7', color: '#7A1800', border: '#F5B09A' },
      { text: '√ Raíces', bg: '#FAECE7', color: '#7A1800', border: '#F5B09A' },
      { text: '📐 Propiedades', bg: '#FAECE7', color: '#7A1800', border: '#F5B09A' },
    ],
  },
  {
    index: 9,
    name: 'Unidad 10 — Sistema Métrico',
    meta: '2 temas · Longitud · Área · Volumen · Capacidad',
    icon: '📏',
    iconBg: '#E8F5E9',
    accentClass: 'uc-teal',
    accentGradient: 'linear-gradient(90deg, #A5D6A7, #2E7D32)',
    pills: [
      { text: 'm km cm Longitud', bg: '#DCF5EE', color: '#074F3A', border: '#95DAC4' },
      { text: 'm² Área', bg: '#DCF5EE', color: '#074F3A', border: '#95DAC4' },
      { text: 'm³ L Volumen', bg: '#DCF5EE', color: '#074F3A', border: '#95DAC4' },
    ],
  },
  {
    index: 10,
    name: 'Unidad 11 — Geometría',
    meta: '3 temas · Perímetro · Área de figuras · Volumen',
    icon: '📐',
    iconBg: '#FCE4EC',
    accentClass: 'uc-pink',
    accentGradient: 'linear-gradient(90deg, #F48FB1, #C62828)',
    pills: [
      { text: 'P Perímetro', bg: '#FCE4EC', color: '#880E4F', border: '#F48FB1' },
      { text: 'A Área', bg: '#FCE4EC', color: '#880E4F', border: '#F48FB1' },
      { text: 'V Volumen', bg: '#FCE4EC', color: '#880E4F', border: '#F48FB1' },
    ],
  },
  {
    index: 11,
    name: 'Unidad 12 — Estadística y Probabilidad',
    meta: '2 temas · Datos · Gráficas · Probabilidad',
    icon: '📊',
    iconBg: '#E8EAF6',
    accentClass: 'uc-blue',
    accentGradient: 'linear-gradient(90deg, #9FA8DA, #3949AB)',
    pills: [
      { text: '📈 Datos', bg: '#E8F0FF', color: '#1A3A6A', border: '#8EBBF0' },
      { text: '📊 Gráficas', bg: '#E8F0FF', color: '#1A3A6A', border: '#8EBBF0' },
      { text: '🎲 Probabilidad', bg: '#E8F0FF', color: '#1A3A6A', border: '#8EBBF0' },
    ],
  },
  {
    index: 12,
    name: 'Unidad 13 — Magnitudes Proporcionales',
    meta: '1 tema · Proporcionalidad directa e inversa',
    icon: '⚖️',
    iconBg: '#EDE7F6',
    accentClass: 'uc-purple',
    accentGradient: 'linear-gradient(90deg, #CE93D8, #7B1FA2)',
    pills: [
      { text: '∝ Directa', bg: '#EEEDFE', color: '#3D1468', border: '#C5BFEE' },
      { text: '↔ Inversa', bg: '#EEEDFE', color: '#3D1468', border: '#C5BFEE' },
      { text: '🏆 Nivel Final', bg: '#EEEDFE', color: '#3D1468', border: '#C5BFEE' },
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

export interface ConceptoDia3ro {
  t: string;
  tx: string;
  ej: string;
}

export const CONCEPTOS_DEL_DIA_3RO: ConceptoDia3ro[] = [
  {
    t: 'Sustracción',
    tx: 'La sustracción encuentra la diferencia entre dos números.',
    ej: 'Ejemplo: 7 + 5 = 12',
  },
  {
    t: 'Adición',
    tx: 'La adición une dos cantidades para obtener un total.',
    ej: 'Ejemplo: 7 + 5 = 12',
  },
  {
    t: 'Multiplicación',
    tx: 'La multiplicación es una suma repetida de igual valor.',
    ej: 'Ejemplo: 4 × 3 = 12',
  },
  {
    t: 'División',
    tx: 'La división reparte en partes iguales.',
    ej: 'Ejemplo: 12 ÷ 4 = 3',
  },
  {
    t: 'Sistema Decimal',
    tx: 'Nuestro sistema usa Unidades, Decenas, Centenas y Miles.',
    ej: 'Ejemplo: 253 = 200 + 50 + 3',
  },
  {
    t: 'Fracción',
    tx: 'Una fracción expresa parte de un todo.',
    ej: 'Ejemplo: ½ es la mitad',
  },
  {
    t: 'Estadística',
    tx: 'La estadística organiza y analiza datos.',
    ej: 'Ejemplo: Tabla de frecuencias',
  },
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
    setReportAutoRunAI,
    startLevel,
  } = useBook3();

  const [claimedDaily, setClaimedDaily] = useState(false);
  const [showProblemasModal, setShowProblemasModal] = useState(false);
  const [showUniversoModal, setShowUniversoModal] = useState(false);
  const [showMascotaModal, setShowMascotaModal] = useState(false);
  const [showGuiaModal, setShowGuiaModal] = useState(false);
  const [activeCommandModal, setActiveCommandModal] = useState<string | null>(null);
  const [showStatsLabModal, setShowStatsLabModal] = useState(false);
  const [showRetoEspacialModal, setShowRetoEspacialModal] = useState(false);
  const [showExamenFinalModal, setShowExamenFinalModal] = useState(false);
  const [conceptIndex, setConceptIndex] = useState(0);
  const activeConcept = CONCEPTOS_DEL_DIA_3RO[conceptIndex];
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

  // Garantizar acceso a las 13 unidades canónicas y sus 195 bloques
  const sourceUnits = useMemo(() => {
    if (book?.units && Array.isArray(book.units) && book.units.length >= 13) {
      return book.units;
    }
    return ((bookCurriculum3 as any).UNITS || []) as any[];
  }, [book]);

  const allBlocks = useMemo(() => {
    const blocks: Array<{
      ui: number;
      ti: number;
      li: number;
      label: string;
      topicId: string;
      isDone: boolean;
    }> = [];

    sourceUnits.forEach((u: any, ui: number) => {
      (u.topics || []).forEach((t: any, ti: number) => {
        (t.levels || []).forEach((lv: any, li: number) => {
          const key1 = `${t.id}-n${li + 1}`;
          const key2 = `u${ui}t${ti}-n${li + 1}`;
          const key3 = `u${ui}_t${ti}_l${li}`;
          const score = Math.max(scores[key1] || 0, scores[key2] || 0, scores[key3] || 0);
          const isDone = score >= 70;
          blocks.push({
            ui,
            ti,
            li,
            label: `${u.short || u.name} · ${t.title || t.name} · Nivel ${li + 1}`,
            topicId: t.id,
            isDone,
          });
        });
      });
    });

    return blocks;
  }, [sourceUnits, scores]);

  const totalLevelsCount = allBlocks.length || 195;
  const passedLevelsCount = allBlocks.filter((b) => b.isDone).length;
  const currentBlockIndex = allBlocks.findIndex((b) => !b.isDone);
  const currentPos = currentBlockIndex === -1 ? allBlocks.length : currentBlockIndex;
  const shipPct =
    totalLevelsCount <= 1
      ? 0
      : Math.max(0, Math.min(100, (currentPos / (totalLevelsCount - 1)) * 100));

  let journeyMessage = '✨ Resuelve bloques para avanzar tu nave';
  if (currentPos === 0) {
    journeyMessage = '🌅 ¡La nave está en Mercurio, lista para empezar!';
  } else if (currentPos >= totalLevelsCount) {
    journeyMessage = '🏆 ¡Llegaste a Plutón! ¡Misión cumplida!';
  } else if (passedLevelsCount / totalLevelsCount >= 0.75) {
    journeyMessage = `🛰️ ¡Casi llegas a Plutón! ${Math.round((100 * passedLevelsCount) / totalLevelsCount)}% del viaje completado`;
  } else if (passedLevelsCount / totalLevelsCount >= 0.5) {
    journeyMessage = '🌠 ¡Mitad del camino! Sigue resolviendo bloques';
  } else if (passedLevelsCount / totalLevelsCount >= 0.25) {
    journeyMessage = `🚀 ¡La nave avanza! ${passedLevelsCount} bloques superados`;
  }

  const progressPct =
    totalLevelsCount > 0
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
    } else if (action.id === 'espacial') {
      setShowRetoEspacialModal(true);
    } else if (action.id === 'examen') {
      setShowExamenFinalModal(true);
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
          7. TRAVESÍA MERCURIO → PLUTÓN (Idéntico a HTML / Imagen)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div className="bg-gradient-to-b from-[#020611] via-[#0A1840] to-[#1A0D40] border border-blue-900/60 rounded-2xl p-4 md:p-5 shadow-2xl text-white relative overflow-hidden">
          {/* Fondo estrellado cósmico */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage: `
                radial-gradient(circle at 15% 30%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
                radial-gradient(circle at 45% 70%, rgba(255,255,255,0.6) 1px, transparent 1.5px),
                radial-gradient(circle at 75% 20%, rgba(255,255,255,0.5) 1px, transparent 1.5px),
                radial-gradient(circle at 90% 80%, rgba(255,255,255,0.8) 1px, transparent 1.5px),
                radial-gradient(circle at 25% 90%, rgba(255,255,255,0.5) 1px, transparent 1.5px)
              `,
              backgroundSize: '240px 240px, 200px 200px, 300px 300px, 160px 160px, 250px 250px',
            }}
          />

          {/* Cabecera */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-black text-[#FFD66B] uppercase tracking-wider flex items-center gap-2 drop-shadow-[0_0_12px_rgba(255,214,107,0.5)]">
              <span>🚀</span>
              <span>TRAVESÍA MERCURIO → PLUTÓN</span>
            </h3>
            <span className="text-[11px] md:text-xs font-black bg-white/10 border border-amber-300/40 px-3 py-1 rounded-full text-white tracking-wide">
              {passedLevelsCount} / {totalLevelsCount} bloques
            </span>
          </div>

          {/* Visual Track Area */}
          <div className="relative z-10 py-4 px-2 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
            {/* Mercurio con INICIA AQUÍ */}
            <div className="flex flex-col items-center shrink-0 relative">
              {passedLevelsCount === 0 && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30">
                  <div className="bg-gradient-to-r from-[#FF1D4E] to-[#F5C518] text-white font-black text-[9px] md:text-[10px] px-2.5 py-0.5 rounded-full border border-white shadow-[0_4px_14px_rgba(255,29,78,0.7)] whitespace-nowrap animate-bounce uppercase tracking-wider">
                    INICIA AQUÍ
                  </div>
                </div>
              )}
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center relative cursor-pointer hover:scale-105 transition-transform"
                style={{
                  background: 'radial-gradient(circle at 35% 30%, #FFE484 0%, #F5C518 25%, #D48B28 50%, #7E4A15 80%, #3A200A 100%)',
                  boxShadow: '0 0 30px rgba(245,197,24,0.6), inset -6px -6px 14px rgba(0,0,0,0.6)',
                }}
                onClick={() => selectUnit(0)}
                title="Mercurio · Iniciar Unidad 1"
              />
              <span className="text-[10px] md:text-[11px] font-black text-[#FFD66B] mt-1.5 whitespace-nowrap drop-shadow">
                ☿ Mercurio
              </span>
            </div>

            {/* Densa hilera orbital continua de 195 bloques/asteroides */}
            <div className="flex-1 relative mx-2 h-14 flex items-center min-w-[280px]">
              {/* Línea central guía */}
              <div
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] pointer-events-none opacity-40"
                style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,214,107,0.8) 0 8px, transparent 8px 14px)',
                }}
              />

              {/* 195 Asteroides */}
              <div className="relative w-full flex items-center justify-between gap-[1px] md:gap-[2px] z-10">
                {allBlocks.map((b, idx) => {
                  const isDone = b.isDone;
                  const isCurrent = idx === currentPos;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => startLevel(b.ui, b.ti, b.li)}
                      title={b.label}
                      className={`rounded-full transition-all duration-300 p-0 border-0 focus:outline-none shrink-0 ${
                        isDone
                          ? 'w-2 h-2 md:w-2.5 md:h-2.5 bg-gradient-to-r from-[#FFEE99] to-[#F5C518] shadow-[0_0_6px_rgba(245,197,24,0.9)] scale-110'
                          : isCurrent
                          ? 'w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-[#FF89A8] to-[#FF1D4E] shadow-[0_0_8px_rgba(255,29,78,1)] animate-pulse'
                          : 'w-1 h-1 md:w-1.5 md:h-1.5 bg-[#A89684]/60 hover:bg-[#F5C518] hover:scale-150'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Nave espacial con llama propulsora sobre la órbita */}
              <div
                className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-1000 ease-out flex items-center"
                style={{
                  left: `clamp(0%, ${shipPct}%, calc(100% - 42px))`,
                }}
              >
                {/* Llama */}
                <div
                  className="w-3.5 h-4.5 rounded-l-full -mr-1 animate-pulse"
                  style={{
                    background: 'radial-gradient(ellipse, #FFEE99, #FF8800 60%, transparent)',
                  }}
                />
                {/* Cohete SVG original de MatematicasDeFedor_3° */}
                <svg
                  viewBox="0 0 48 48"
                  width="42"
                  height="42"
                  className="drop-shadow-[0_0_10px_rgba(91,191,255,0.8)]"
                >
                  <defs>
                    <linearGradient id="fjShipGrad" x1="0" x2="1">
                      <stop offset="0" stopColor="#FFFFFF" />
                      <stop offset="1" stopColor="#A8B8E6" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M44 24 L18 12 L18 22 L8 22 L8 26 L18 26 L18 36 Z"
                    fill="url(#fjShipGrad)"
                    stroke="#1A3A6A"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle cx="26" cy="24" r="4" fill="#5BBFFF" stroke="#1A3A6A" strokeWidth="1.5" />
                  <path d="M18 22 L14 18 L18 18 Z" fill="#FF1D4E" />
                  <path d="M18 26 L14 30 L18 30 Z" fill="#FF1D4E" />
                </svg>
              </div>
            </div>

            {/* Plutón */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className="w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                style={{
                  background: 'radial-gradient(circle at 35% 30%, #E0D6B8 0%, #8C7E62 50%, #3D3424 100%)',
                  boxShadow: '0 0 20px rgba(224,214,184,0.4), inset -5px -5px 12px rgba(0,0,0,0.6)',
                }}
                onClick={() => selectUnit(12)}
                title="Plutón · Unidad 13 Final"
              />
              <span className="text-[10px] md:text-[11px] font-bold text-gray-300 mt-1.5 whitespace-nowrap">
                ♇ Plutón
              </span>
            </div>
          </div>

          {/* Leyenda y Mensaje */}
          <div className="relative z-10 border-t border-white/10 pt-3 mt-1">
            <div className="flex items-center justify-center gap-2 text-[10px] text-[#C5BFEE] font-extrabold flex-wrap">
              <span className="bg-black/50 px-3 py-1 rounded-full border border-amber-300/30">
                ⚪ = bloque pendiente
              </span>
              <span className="bg-black/50 px-3 py-1 rounded-full border border-amber-300/30">
                ⭐ = bloque dominado
              </span>
              <span className="bg-black/50 px-3 py-1 rounded-full border border-amber-300/30">
                🚀 = posición actual
              </span>
            </div>
            <div className="text-center text-xs md:text-sm font-black text-[#FFD66B] mt-2.5 drop-shadow-[0_0_12px_rgba(255,214,107,0.5)]">
              {journeyMessage}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          8. CENTRO DE INFORMES (Exacto a HTML MatematicasDeFedor_3° / Imagen)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div
          style={{
            background: 'linear-gradient(135deg, #140830, #1E0848)',
            borderRadius: '18px',
            padding: '1rem 1.1rem',
            marginBottom: '.85rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle striped pattern overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.06,
              background: 'repeating-linear-gradient(45deg, #7B2FBE 0, #7B2FBE 1px, transparent 1px, transparent 8px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Cabecera */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '.65rem',
                flexWrap: 'wrap',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #F5C518, #FF8C2A)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  📊
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Baloo 2', sans-serif",
                      fontSize: '14px',
                      fontWeight: 900,
                      color: '#ffffff',
                      lineHeight: '1.2',
                    }}
                  >
                    Centro de Informes
                  </div>
                  <div
                    style={{
                      fontSize: '9px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontWeight: 700,
                    }}
                  >
                    Seguimiento docente y familia
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => goScreen('report')}
                style={{
                  background: 'linear-gradient(135deg, #F5C518, #FF8C2A)',
                  color: '#2A0F60',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                Ver informe →
              </button>
            </div>

            {/* 3 Tarjetas de Resumen (XP Total, Niveles ✅, Racha) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '6px',
                marginBottom: '.65rem',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '.5rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#FF8C2A',
                    fontFamily: "'Baloo 2', sans-serif",
                    lineHeight: '1.2',
                  }}
                >
                  {totalXP}
                </div>
                <div
                  style={{
                    fontSize: '8px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  XP Total
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '.5rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#24C496',
                    fontFamily: "'Baloo 2', sans-serif",
                    lineHeight: '1.2',
                  }}
                >
                  {passedLevelsCount}
                </div>
                <div
                  style={{
                    fontSize: '8px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Niveles ✅
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '.5rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#FF8C2A',
                    fontFamily: "'Baloo 2', sans-serif",
                    lineHeight: '1.2',
                  }}
                >
                  {streak}🔥
                </div>
                <div
                  style={{
                    fontSize: '8px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Racha
                </div>
              </div>
            </div>

            {/* 13 Barras de Unidades (Idénticas al script de MatematicasDeFedor_3°) */}
            <div
              style={{
                display: 'grid',
                gap: '4px',
                marginBottom: '.65rem',
              }}
            >
              {CANONICAL_UNITS_3RO.map((u) => {
                const unitData = ((book?.units && book.units[u.index]) ||
                  (bookCurriculum3 as any).UNITS?.[u.index]) as any;

                let uTot = 0;
                let uPassed = 0;

                (unitData?.topics || []).forEach((t: any, ti: number) => {
                  (t.levels || []).forEach((lv: any, li: number) => {
                    uTot++;
                    const k1 = `${t.id}-n${li + 1}`;
                    const k2 = `u${u.index}t${ti}-n${li + 1}`;
                    const k3 = `u${u.index}_t${ti}_l${li}`;
                    const sc = Math.max(scores[k1] || 0, scores[k2] || 0, scores[k3] || 0);
                    if (sc >= 70) uPassed++;
                  });
                });

                const pct = uTot > 0 ? Math.round((uPassed / uTot) * 100) : 0;
                const col = pct >= 70 ? '#24C496' : pct >= 50 ? '#F5C518' : '#7B2FBE';

                return (
                  <div
                    key={u.index}
                    onClick={() => selectUnit(u.index)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      cursor: 'pointer',
                    }}
                    title={`${u.name}: ${pct}% completado (${uPassed}/${uTot} niveles)`}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        width: '18px',
                        textAlign: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {u.icon}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: '5px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '5px',
                          background: col,
                          width: `${pct}%`,
                          borderRadius: '3px',
                          transition: 'width 1.2s',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 900,
                        color: col,
                        minWidth: '28px',
                        textAlign: 'right',
                        fontFamily: "'Nunito', sans-serif",
                        flexShrink: 0,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Botón inferior: Análisis IA Fedor */}
            <button
              type="button"
              onClick={() => {
                setReportAutoRunAI(true);
                goScreen('report');
              }}
              style={{
                width: '100%',
                padding: '9px',
                fontSize: '12px',
                fontWeight: 900,
                background: 'rgba(245, 197, 24, 0.12)',
                color: '#F5C518',
                border: '1.5px solid rgba(245, 197, 24, 0.25)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>🤖</span>
              <span>Análisis IA Fedor</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          9. RECOMPENSA DIARIA (Imagen 5 Arriba)
      ══════════════════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════════════════
          9. RECOMPENSA DIARIA (Imagen 5 Arriba / HTML)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div
          onClick={handleClaimDaily}
          style={{
            background: 'linear-gradient(135deg, #1A4030, #16876A)',
            borderRadius: '16px',
            padding: '12px 18px',
            marginBottom: '.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all .2s ease',
            boxShadow: '0 4px 16px rgba(22, 135, 106, .3)',
          }}
          className="hover:scale-[1.006]"
        >
          <span style={{ fontSize: '30px' }} className="animate-bounce">🎁</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '13px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: '1.2',
              }}
            >
              Recompensa diaria
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.65)',
                fontWeight: 700,
              }}
            >
              ¡Entra cada día y gana XP extra!
            </div>
          </div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 900,
              background: 'rgba(245, 197, 24, 0.22)',
              color: '#FFE066',
              border: '1px solid rgba(245, 197, 24, 0.4)',
              padding: '3px 12px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
            }}
          >
            {claimedDaily ? '¡Reclamado!' : '¡Disponible!'}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          10. MATEMÁTICAS DE FEDOR / LIBRO EXCEL (Imagen 5 Medio / HTML)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '.85rem',
            background: 'linear-gradient(135deg, #FEF0E6, #FFE2C8)',
            border: '1.5px solid #FBBF7A',
            borderRadius: '16px',
            padding: '10px 18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #3D1468, #6C28B4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(61, 20, 104, 0.35)',
              }}
            >
              <span style={{ fontSize: '20px' }}>🚀</span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: '15px',
                  fontWeight: 900,
                  color: '#E8650A',
                  lineHeight: '1.2',
                }}
              >
                Matemáticas de Fedor
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: '#888888',
                  fontWeight: 700,
                }}
              >
                Libro Interactivo · Grado 3° · Colombia
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#888888',
              }}
            >
              ¿Tienes el libro Excel?
            </div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 900,
                color: '#E8650A',
              }}
            >
              Úsalos juntos 📊
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          11. MISIÓN DEL DÍA (Imagen 5 Medio / HTML)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div
          style={{
            background: 'linear-gradient(135deg, #1E0848, #7B2FBE 45%, #E8650A 100%)',
            borderRadius: '18px',
            padding: '1rem 1.15rem',
            marginBottom: '.85rem',
            color: '#fff',
            boxShadow: '0 8px 30px rgba(123, 47, 190, 0.4)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(0, 0, 0, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                flexShrink: 0,
                border: '1.5px solid rgba(255, 224, 102, 0.4)',
              }}
            >
              🎯
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  color: 'rgba(255, 224, 102, 0.85)',
                  letterSpacing: '.15em',
                  textTransform: 'uppercase',
                }}
              >
                MISIÓN DEL DÍA
              </div>
              <div
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: '15px',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: '1.2',
                  marginTop: '2px',
                }}
              >
                Logra una racha de 5 correctas
              </div>
              <div
                style={{
                  height: '8px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '.5rem',
                }}
              >
                <div
                  style={{
                    height: '8px',
                    background: 'linear-gradient(90deg, #F5C518, #FF8C2A)',
                    borderRadius: '4px',
                    width: `${Math.min(100, Math.round((Math.min(5, streak) / 5) * 100))}%`,
                    transition: 'width .8s cubic-bezier(.34, 1.56, .64, 1)',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  fontWeight: 800,
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginTop: '4px',
                }}
              >
                <span>{Math.min(5, streak)} / 5</span>
                <span style={{ color: '#F5C518' }}>+140 XP · +90 🪙</span>
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              {streak >= 5 ? (
                <button
                  type="button"
                  onClick={() => {
                    updateStats(90, 0, 140);
                    Swal.fire({
                      title: '🎉 ¡Misión completada!',
                      text: 'Has ganado +140 XP y +90 🪙',
                      icon: 'success',
                      confirmButtonText: '¡Genial!',
                      confirmButtonColor: '#7B2FBE',
                    });
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #F5C518, #FF8C2A)',
                    color: '#2A0F60',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    fontFamily: "'Nunito', sans-serif",
                    boxShadow: '0 4px 14px rgba(245, 197, 24, 0.5)',
                  }}
                  className="animate-pulse"
                >
                  🎁 RECLAMAR
                </button>
              ) : (
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                  title="Bloqueado hasta alcanzar racha de 5"
                >
                  🔒
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          12. DESAFÍO DEL DÍA (Imagen 5 Medio-Abajo / HTML)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div
          onClick={() => {
            selectUnit(0);
            fedorSpeak('¡Desafío del día! Resuelve ejercicios hoy para ganar el doble de monedas.');
          }}
          style={{
            background: 'linear-gradient(135deg, #1A4030, #16876A)',
            borderRadius: '16px',
            padding: '12px 18px',
            marginBottom: '.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all .2s ease',
            boxShadow: '0 4px 16px rgba(22, 135, 106, .25)',
          }}
          className="hover:scale-[1.006]"
        >
          <span style={{ fontSize: '32px', color: '#FF8C2A' }} className="animate-pulse">⚡</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '13px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: '1.2',
              }}
            >
              Desafío del día · {new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date())}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.65)',
                fontWeight: 700,
              }}
            >
              ¡Gana el doble de monedas hoy!
            </div>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 900,
              background: 'rgba(245, 197, 24, 0.25)',
              color: '#FFE066',
              border: '1px solid rgba(245, 197, 24, 0.4)',
              padding: '3px 12px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
            }}
          >
            🏅 x2
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          13. PROGRESO TOTAL (Imagen 5 Abajo / HTML)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap">
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #E5E7EB',
            borderRadius: '16px',
            padding: '14px 18px',
            marginBottom: '.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: '#2D3748',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '16px' }}>📚</span>
            <span>Progreso total</span>
          </div>
          <div
            style={{
              flex: 1,
              height: '10px',
              background: '#EEEEEE',
              borderRadius: '5px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '10px',
                background: 'linear-gradient(90deg, #7B2FBE, #A864E8)',
                borderRadius: '5px',
                width: `${progressPct}%`,
                transition: 'width .8s cubic-bezier(.34, 1.56, .64, 1)',
              }}
            />
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 900,
              color: '#7B2FBE',
              minWidth: '38px',
              textAlign: 'right',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {progressPct}%
          </div>
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
          15. CARD LABORATORIO DE ESTADÍSTICA (Imagen 1)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap flex justify-end my-1">
        <div
          onClick={() => {
            playSound('click');
            setShowStatsLabModal(true);
          }}
          className="relative w-full max-w-[650px] bg-gradient-to-r from-[#0d6b49] via-[#0f7652] to-[#0d6b49] rounded-[26px] p-4 sm:p-5 flex items-center gap-4 cursor-pointer shadow-xl border-2 border-[#FFE066]/30 overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {/* Badge NUEVO */}
          <div className="absolute top-3 right-4 bg-gradient-to-r from-[#FF6B35] to-[#FFAB00] text-[#3D1200] text-[10px] font-black px-3 py-0.5 rounded-full shadow-sm tracking-wider uppercase">
            NUEVO
          </div>

          {/* Left glowing container with test tube */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#147953]/80 flex items-center justify-center text-4xl shrink-0 shadow-inner border border-emerald-400/20">
            🧪
          </div>

          {/* Center Info */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="font-['Baloo_2',sans-serif] text-lg sm:text-xl font-black text-[#FFE066] drop-shadow-sm tracking-wide">
              Laboratorio de Estadística
            </div>
            <div className="text-xs sm:text-[13px] font-bold text-white/95 mt-1 leading-snug">
              ¡Crea tus propias encuestas! Mete datos, mira el gráfico cambiar en vivo y genera preguntas para tus amigos.
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playSound('click');
                setShowStatsLabModal(true);
              }}
              className="mt-3 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#FFE066] to-[#FFB703] text-[#0A4030] font-black text-xs border-2 border-white shadow-md cursor-pointer hover:opacity-95 transition-all inline-flex items-center gap-1.5"
            >
              🚀 ABRIR LABORATORIO →
            </button>
          </div>

          {/* Right White Preview Card with 4 bars */}
          <div className="hidden sm:flex shrink-0 bg-white rounded-2xl p-3 shadow-md w-20 h-20 sm:w-22 sm:h-22 items-center justify-center">
            <svg width="60" height="46" viewBox="0 0 60 46" fill="none">
              <rect x="4" y="24" width="9" height="22" rx="2.5" fill="#EF4444" />
              <rect x="18" y="14" width="9" height="32" rx="2.5" fill="#F59E0B" />
              <rect x="32" y="4" width="9" height="42" rx="2.5" fill="#3B82F6" />
              <rect x="46" y="16" width="9" height="30" rx="2.5" fill="#8B5CF6" />
            </svg>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          16. UNIDADES DE APRENDIZAJE (Idéntico a Imagen 1)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap mb-8">
        {/* Badge "📦 UNIDADES DE APRENDIZAJE" */}
        <div className="mb-3.5">
          <span className="inline-flex items-center gap-2 text-[#581c87] text-[12px] font-black uppercase tracking-wider">
            <span>📦</span> UNIDADES DE APRENDIZAJE
          </span>
        </div>

        {/* Vertical List of Unit Cards */}
        <div className="space-y-3">
          {CANONICAL_UNITS_3RO.map((u) => {
            const unit = ((book?.units && book.units[u.index]) ||
              (bookCurriculum3 as any).UNITS?.[u.index]) as any;
            let unitTotalEx = 0;
            let unitPassedEx = 0;

            (unit?.topics || []).forEach((t: any) => {
              (t.levels || []).forEach((lv: any, li: number) => {
                unitTotalEx++;
                const key = `${t.id}-n${li + 1}`;
                if ((scores[key] || 0) >= 70) {
                  unitPassedEx++;
                }
              });
            });

            const unitPct = unitTotalEx > 0 ? Math.round((unitPassedEx / unitTotalEx) * 100) : 0;

            return (
              <React.Fragment key={u.index}>
                {u.index === 5 && (
                  <div className="pt-5 pb-2">
                    <span className="inline-flex items-center gap-2 text-[#581c87] text-[12px] font-black uppercase tracking-wider">
                      <span>🚀</span> PARTE 2 — PENSAMIENTO AVANZADO
                    </span>
                  </div>
                )}
                <div
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
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          17. SECCIÓN: TRAVESÍA PLUTÓN — VENUS (HTML / Imagen)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap mb-6" id="seccionViajeVenus">
        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 text-[#581c87] text-[12px] font-black uppercase tracking-wider">
            <span>🪐</span> TRAVESÍA PLUTÓN — VENUS
          </span>
        </div>
        <div
          style={{
            background: 'linear-gradient(135deg, #1A0A3C, #2A0F60)',
            borderRadius: '18px',
            padding: '1.4rem 1.2rem',
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(26, 10, 60, 0.4)',
          }}
        >
          <div
            style={{
              fontSize: '44px',
              marginBottom: '.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              userSelect: 'none',
            }}
          >
            <span>🚀</span>
            <span style={{ fontSize: '24px', opacity: 0.85 }}>→</span>
            <span>🪐</span>
            <span style={{ fontSize: '24px', opacity: 0.85 }}>→</span>
            <span>☄️</span>
            <span style={{ fontSize: '24px', opacity: 0.85 }}>→</span>
            <span>🌕</span>
            <span style={{ fontSize: '24px', opacity: 0.85 }}>→</span>
            <span>🌟</span>
            <span style={{ fontSize: '24px', opacity: 0.85 }}>→</span>
            <span>🪐</span>
            <span style={{ fontSize: '24px', opacity: 0.85 }}>→</span>
            <span>☁️</span>
            <span style={{ fontSize: '24px', opacity: 0.85 }}>→</span>
            <span>🟡</span>
          </div>
          <p
            style={{
              fontSize: '14px',
              opacity: 0.9,
              margin: '0 auto',
              maxWidth: '650px',
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            La nave de Fedor viaja desde <strong style={{ color: '#FFE066' }}>Plutón</strong> hasta <strong style={{ color: '#FFE066' }}>Venus</strong> resolviendo operaciones matemáticas en cada planeta.
          </p>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              fedorSpeak('¡Reto Espacial! Completa misiones diarias para ganar monedas y experiencia.');
              setShowRetoEspacialModal(true);
            }}
            style={{
              marginTop: '1.2rem',
              background: 'linear-gradient(135deg, #FF1D4E, #FF6B35)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 16px rgba(255, 29, 78, 0.45)',
              transition: 'all 0.2s ease',
            }}
            className="hover:scale-105 active:scale-95"
          >
            🚀 ¡Iniciar Travesía!
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          18. SECCIÓN: DESAFÍO DEL DÍA (HTML / Imagen)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap mb-6" id="seccionDesafioDia">
        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 text-[#581c87] text-[12px] font-black uppercase tracking-wider">
            <span>⚡</span> DESAFÍO DEL DÍA
          </span>
        </div>
        <div
          style={{
            background: 'linear-gradient(135deg, #C62828, #FF8A80)',
            borderRadius: '18px',
            padding: '1.4rem 1.2rem',
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(198, 40, 40, 0.35)',
          }}
        >
          <div style={{ fontSize: '42px', marginBottom: '.4rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span>
            <span>🧮</span>
          </div>
          <p
            id="desafioTitulo"
            style={{
              fontSize: '18px',
              fontWeight: 800,
              margin: '0 0 .3rem 0',
              fontFamily: "'Baloo 2', sans-serif",
            }}
          >
            ¡El desafío de hoy está listo!
          </p>
          <p
            style={{
              fontSize: '14px',
              opacity: 0.9,
              margin: '0 auto',
              maxWidth: '600px',
              fontWeight: 500,
            }}
          >
            Resuelve 10 ejercicios sin errores para ganar la medalla del día.
          </p>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              fedorSpeak('¡Desafío del Día! Examen Final del Libro.');
              setShowExamenFinalModal(true);
            }}
            style={{
              marginTop: '1.2rem',
              background: '#ffffff',
              color: '#C62828',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 900,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
            }}
            className="hover:scale-105 active:scale-95"
          >
            ⚡ ¡Aceptar Desafío!
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          19. SECCIÓN: CONCEPTO DEL DÍA (HTML / Imagen)
      ══════════════════════════════════════════════════════════ */}
      <div className="section-card-wrap mb-8" id="seccionConceptoDia">
        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 text-[#581c87] text-[12px] font-black uppercase tracking-wider">
            <span>💡</span> CONCEPTO DEL DÍA
          </span>
        </div>
        <div
          id="conceptoDiaContent"
          onClick={() => {
            playSound('click');
            const nextIdx = (conceptIndex + 1) % CONCEPTOS_DEL_DIA_3RO.length;
            setConceptIndex(nextIdx);
            const nextConcept = CONCEPTOS_DEL_DIA_3RO[nextIdx];
            fedorSpeak(`${nextConcept.t}: ${nextConcept.tx}`);
          }}
          title="Toca para explorar otro concepto"
          style={{
            background: 'linear-gradient(135deg, #11998E, #38EF7D)',
            borderRadius: '18px',
            padding: '1.4rem',
            color: '#000',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(17, 153, 142, 0.3)',
            transition: 'transform 0.2s ease',
          }}
          className="hover:scale-[1.008] active:scale-[0.99]"
        >
          <div style={{ fontSize: '36px', marginBottom: '.4rem' }}>💡</div>
          <p
            id="conceptoTitulo"
            style={{
              fontSize: '18px',
              fontWeight: 900,
              margin: '0 0 .25rem 0',
              fontFamily: "'Baloo 2', sans-serif",
              color: '#074F3A',
            }}
          >
            {activeConcept.t}
          </p>
          <p
            id="conceptoTexto"
            style={{
              fontSize: '14px',
              margin: '0 0 .8rem 0',
              fontWeight: 600,
              color: '#0f382c',
            }}
          >
            {activeConcept.tx}
          </p>
          <div
            id="conceptoEjemplo"
            style={{
              background: 'rgba(255, 255, 255, 0.55)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '15px',
              fontWeight: 800,
              color: '#074F3A',
              display: 'inline-block',
              backdropFilter: 'blur(4px)',
            }}
          >
            {activeConcept.ej}
          </div>
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

      {/* ══ Modal Laboratorio de Estadística 3° (Imagen 2) ══ */}
      <StatsLabModal3ro
        isOpen={showStatsLabModal}
        onClose={() => setShowStatsLabModal(false)}
      />

      {/* ══ Modal Reto Espacial (Popup exacto de la imagen) ══ */}
      <RetoEspacialModal3ro
        isOpen={showRetoEspacialModal}
        onClose={() => setShowRetoEspacialModal(false)}
      />

      {/* ══ Modal Examen Final del Libro (Exacto a la imagen del usuario) ══ */}
      <ExamenFinalModal3ro
        isOpen={showExamenFinalModal}
        onClose={() => setShowExamenFinalModal(false)}
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
