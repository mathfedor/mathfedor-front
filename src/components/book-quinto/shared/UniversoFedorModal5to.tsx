'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useBook5 } from '../context/Book5Context';
import bookCurriculum5 from '@/mocks/data/book-curriculum-5.data.json';

interface UniversoFedorModal5toProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUnit?: (unitIdx: number) => void;
  initialBodyId?: string;
}

interface CelestialBody {
  id: string;
  type: string;
  category: string;
  name: string;
  icon: string;
  color: string;
  glow: string;
  ring: boolean;
  desc: string;
  facts: string[];
  distance: string;
  missionNum?: number;
  missionTitle?: string;
  unitIdx?: number;
}

const BODIES_5TO: CelestialBody[] = [
  {
    id: 'tierra',
    type: 'mission',
    category: '🪐 PLANETA',
    name: '🌍 La Tierra',
    icon: '🌍',
    color: '#1A6CB4',
    glow: '#4DA6FF',
    ring: false,
    desc: 'Nuestro planeta natal. Aquí iniciamos la travesía de las matemáticas de 5°.',
    facts: [
      '🌊 71% es agua, por eso se ve azul',
      '🌀 Gira una vuelta cada 24 horas',
      '🌡️ Temperatura promedio: 15°C',
      '🌙 Tiene 1 satélite: la Luna',
      '👥 Habitantes: 8 mil millones',
    ],
    distance: '0 km · Tu hogar',
    missionNum: 1,
    missionTitle: 'Adición y Sistema Decimal',
    unitIdx: 0,
  },
  {
    id: 'luna',
    type: 'moon',
    category: '🌙 SATÉLITE NATURAL',
    name: '🌙 La Luna',
    icon: '🌙',
    color: '#9B9B9B',
    glow: '#E5E5E5',
    ring: false,
    desc: 'La Luna te da la bienvenida. Aquí los astronautas descansan antes del gran salto cósmico.',
    facts: [
      '👨‍🚀 12 humanos han caminado en ella',
      '📏 Diámetro: 3.474 km',
      '⏱️ Sin atmósfera ni viento',
      '🌖 Tiene fases: nueva, creciente, llena',
    ],
    distance: '384.400 km de la Tierra',
  },
  {
    id: 'mercurio',
    type: 'planet',
    category: '🪐 PLANETA ROCOSO',
    name: '☿ Mercurio',
    icon: '🟤',
    color: '#9B7A4F',
    glow: '#E0B07A',
    ring: false,
    desc: 'Mercurio es el planeta más pequeño y el más cercano al Sol. Su día dura 59 días terrestres.',
    facts: [
      '🔥 Día: 430°C · Noche: -180°C',
      '⚡ Año dura solo 88 días',
      '🌑 Sin lunas, sin atmósfera',
      '📏 Es el planeta más pequeño',
    ],
    distance: '77 millones km de la Tierra',
    missionNum: 2,
    missionTitle: 'Sustracción',
    unitIdx: 1,
  },
  {
    id: 'venus',
    type: 'planet',
    category: '🪐 PLANETA ROCOSO',
    name: '♀ Venus',
    icon: '🟡',
    color: '#D4AC2A',
    glow: '#FFD96A',
    ring: false,
    desc: 'Venus brilla más que cualquier estrella en el cielo. Es el planeta más caliente del sistema solar.',
    facts: [
      '🌡️ Temperatura: 462°C (¡extremo!)',
      '☁️ Atmósfera de dióxido de carbono',
      '🔄 Gira al revés que los demás',
      '✨ Visible al amanecer y atardecer',
    ],
    distance: '41 millones km de la Tierra',
    missionNum: 3,
    missionTitle: 'Multiplicación',
    unitIdx: 2,
  },
  {
    id: 'marte',
    type: 'mission',
    category: '🪐 PLANETA',
    name: '🔴 Marte',
    icon: '🔴',
    color: '#C94B22',
    glow: '#FF6B3B',
    ring: false,
    desc: 'El planeta rojo guarda secretos sobre agua y antiguas cordilleras volcánicas.',
    facts: [
      '🟥 Color por el óxido de hierro',
      '🏔️ Tiene el volcán más alto: Olimpo',
      '🌪️ Tormentas de polvo gigantes',
      '🛰️ La NASA tiene robots explorando',
      '🌗 Tiene 2 lunas: Fobos y Deimos',
    ],
    distance: '225 millones km de la Tierra',
    missionNum: 4,
    missionTitle: 'División',
    unitIdx: 3,
  },
  {
    id: 'sirio',
    type: 'star',
    category: '⭐ ESTRELLA',
    name: '⭐ Sirio',
    icon: '⭐',
    color: '#FFD700',
    glow: '#FFF4A8',
    ring: false,
    desc: 'Sirio es la estrella más brillante del cielo nocturno desde la Tierra.',
    facts: [
      '✨ La estrella más brillante del cielo',
      '🌟 Es 2 veces más grande que el Sol',
      '👯 En realidad son 2 estrellas juntas',
      '🌡️ Su superficie: 9.940°C',
    ],
    distance: '8,6 años luz de la Tierra',
    missionNum: 5,
    missionTitle: 'Problemas Mixtos',
    unitIdx: 4,
  },
  {
    id: 'asteroides1',
    type: 'asteroid',
    category: '🪨 ASTEROIDE',
    name: '🪨 Ceres',
    icon: '🪨',
    color: '#A0A0A0',
    glow: '#D5D5D5',
    ring: false,
    desc: 'Ceres es el objeto más grande del cinturón de asteroides. Es considerado planeta enano.',
    facts: [
      '💎 Es el asteroide más grande',
      '🧊 Tiene agua congelada en su superficie',
      '📅 Descubierto en 1801',
    ],
    distance: 'Cinturón principal',
    missionNum: 6,
    missionTitle: 'Divisores y Factores',
    unitIdx: 5,
  },
  {
    id: 'asteroides2',
    type: 'asteroid',
    category: '🪨 ASTEROIDE',
    name: '🪨 Vesta',
    icon: '🪨',
    color: '#A0A0A0',
    glow: '#D5D5D5',
    ring: false,
    desc: 'Vesta es el segundo asteroide más grande del cinturón. Es muy brillante.',
    facts: [
      '🌟 Es el asteroide más brillante',
      '🌑 Su superficie tiene cráteres',
      '📐 Diámetro: 525 km',
    ],
    distance: 'Cinturón principal',
  },
  {
    id: 'asteroides3',
    type: 'asteroid',
    category: '🪨 ASTEROIDE',
    name: '🪨 Pallas',
    icon: '🪨',
    color: '#A0A0A0',
    glow: '#D5D5D5',
    ring: false,
    desc: 'Pallas tiene una forma muy irregular. Es el tercer asteroide más grande.',
    facts: [
      '🔶 Forma irregular',
      '🌌 Órbita muy inclinada',
      '📅 Descubierto en 1802',
    ],
    distance: 'Cinturón principal',
    missionNum: 7,
    missionTitle: 'MCD y MCM',
    unitIdx: 6,
  },
  {
    id: 'jupiter',
    type: 'planet',
    category: '🪐 GIGANTE GASEOSO',
    name: '🟠 Júpiter',
    icon: '🟠',
    color: '#D8853A',
    glow: '#FFB870',
    ring: false,
    desc: 'Júpiter es el planeta más grande del sistema solar. Su gran mancha roja es una tormenta de siglos.',
    facts: [
      '👑 El planeta MÁS GRANDE',
      '🌪️ Mancha roja: tormenta de 350 años',
      '🌙 Tiene 95 lunas conocidas',
      '⚡ Cabrían 1300 Tierras dentro',
      '🪐 Sus 4 lunas grandes son visibles con telescopio',
    ],
    distance: '628 millones km de la Tierra',
    missionNum: 8,
    missionTitle: 'Fracciones',
    unitIdx: 7,
  },
  {
    id: 'saturno',
    type: 'mission',
    category: '🪐 GIGANTE',
    name: '🪐 Saturno',
    icon: '🪐',
    color: '#B8860B',
    glow: '#F5C518',
    ring: true,
    desc: 'El rey de los anillos. Sus órbitas doradas reflejan la belleza geométrica del espacio.',
    facts: [
      '💍 Anillos de hielo y rocas',
      '🌙 Tiene 146 lunas (¡muchísimas!)',
      '🎈 Flotaría en agua: es muy ligero',
      '⚡ Vientos de 1.800 km/h',
      '📏 Es el 2° planeta más grande',
    ],
    distance: '1.275 millones km de la Tierra',
    missionNum: 9,
    missionTitle: 'Aplicaciones con Fracciones',
    unitIdx: 8,
  },
  {
    id: 'halley',
    type: 'comet',
    category: '☄️ COMETA',
    name: '☄️ Cometa Halley',
    icon: '☄️',
    color: '#A8E8FF',
    glow: '#E0F4FF',
    ring: false,
    desc: 'El cometa Halley pasa cerca de la Tierra cada 76 años. ¡Es el más famoso de todos!',
    facts: [
      '🔁 Pasa cada 76 años',
      '👀 Próxima visita: 2061',
      '📏 Núcleo de 15 km de largo',
      '🚀 Nombrado por Edmond Halley en 1705',
    ],
    distance: 'Variable según su órbita',
    missionNum: 10,
    missionTitle: 'Sistema Métrico Decimal',
    unitIdx: 9,
  },
  {
    id: 'neptuno',
    type: 'mission',
    category: '🪐 GIGANTE HELADO',
    name: '🔵 Neptuno',
    icon: '🔵',
    color: '#1A4CB4',
    glow: '#4D8AFF',
    ring: false,
    desc: 'El planeta más lejano con vientos supersónicos y un azul intenso cautivador.',
    facts: [
      '💨 Vientos de 2.100 km/h (los más rápidos)',
      '❄️ Temperatura: -218°C',
      '🌑 Tiene 14 lunas',
      '👁️ Se ve azul intenso por el metano',
      '📅 Año dura 165 años terrestres',
    ],
    distance: '4.350 millones km de la Tierra',
    missionNum: 11,
    missionTitle: 'Potenciación',
    unitIdx: 10,
  },
  {
    id: 'urano',
    type: 'planet',
    category: '🪐 GIGANTE HELADO',
    name: '🔷 Urano',
    icon: '🔷',
    color: '#5FBEC8',
    glow: '#A8E8F0',
    ring: false,
    desc: 'Urano rueda de lado como una pelota. Es muy frío y su color azul viene del metano.',
    facts: [
      '🎳 Gira de lado, como rodando',
      '❄️ Temperatura: -225°C',
      '💎 Lluvia de diamantes en su interior',
      '🌙 Tiene 27 lunas',
      '🔵 Color azul por el metano'],
    distance: '2.720 millones km de la Tierra',
    missionNum: 12,
    missionTitle: 'Geometría',
    unitIdx: 11,
  },
  {
    id: 'pluton',
    type: 'planet',
    category: '🪐 PLANETA ENANO',
    name: '🟣 Plutón',
    icon: '🟣',
    color: '#8B5A2B',
    glow: '#C89060',
    ring: false,
    desc: 'Plutón ya no es planeta oficial desde 2006, pero sigue siendo un mundo helado fascinante.',
    facts: [
      '⚠️ Reclasificado como planeta enano en 2006',
      '🧊 Temperatura: -229°C',
      '🌙 Tiene 5 lunas',
      '📅 Año: 248 años terrestres',
      '🚀 La sonda New Horizons lo visitó en 2015',
    ],
    distance: '5.900 millones km de la Tierra',
    missionNum: 13,
    missionTitle: 'Estadística y Probabilidad',
    unitIdx: 12,
  },
  {
    id: 'nebulosa',
    type: 'nebula',
    category: '🌌 NEBULOSA',
    name: '🌌 Nebulosa de Orión',
    icon: '🌌',
    color: '#9B5CFF',
    glow: '#D4A8FF',
    ring: false,
    desc: 'Una nebulosa es donde NACEN las estrellas. Es una nube gigante de polvo y gas cósmico.',
    facts: [
      '⭐ Es la guardería de estrellas más cercana',
      '📏 Mide 24 años luz de ancho',
      '🔭 Visible a simple vista en la constelación de Orión',
      '🎨 Colores naranja, rosa y azul',
    ],
    distance: '1.344 años luz',
    missionNum: 14,
    missionTitle: 'Bonus: Cálculo Mental',
    unitIdx: 13,
  },
  {
    id: 'sol',
    type: 'mission',
    category: '☀️ ESTRELLA',
    name: '☀️ El Sol',
    icon: '☀️',
    color: '#E8650A',
    glow: '#FFD700',
    ring: false,
    desc: 'El corazón ardiente de nuestro sistema solar, meta final de tu viaje de 5°.',
    facts: [
      '🔥 Temperatura superficie: 5.500°C',
      '⚡ Núcleo: 15 millones °C',
      '📏 Cabrían 1.3 millones de Tierras dentro',
      '🌍 Da luz y calor a TODOS los planetas',
      '💫 Es una estrella mediana, hay millones más grandes',
    ],
    distance: '149.600.000 km de la Tierra',
    missionNum: 15,
    missionTitle: 'Bonus: Retos Multiplicativos',
    unitIdx: 14,
  },
];

const POS_4TO: Record<string, { x: number; y: number; size: number }> = {
  tierra: { x: 50, y: 6, size: 110 },
  luna: { x: 74, y: 9, size: 55 },
  mercurio: { x: 14, y: 14, size: 62 },
  venus: { x: 33, y: 19, size: 74 },
  marte: { x: 18, y: 30, size: 100 },
  sirio: { x: 82, y: 30, size: 78 },
  asteroides1: { x: 36, y: 40, size: 52 },
  asteroides2: { x: 52, y: 44, size: 38 },
  asteroides3: { x: 68, y: 40, size: 50 },
  jupiter: { x: 18, y: 52, size: 115 },
  saturno: { x: 52, y: 55, size: 120 },
  halley: { x: 84, y: 55, size: 58 },
  neptuno: { x: 22, y: 68, size: 104 },
  urano: { x: 52, y: 71, size: 80 },
  pluton: { x: 82, y: 72, size: 56 },
  nebulosa: { x: 30, y: 85, size: 130 },
  sol: { x: 68, y: 91, size: 160 },
};

const RUTA_IDS = [
  'tierra',
  'mercurio',
  'venus',
  'marte',
  'sirio',
  'asteroides1',
  'asteroides3',
  'jupiter',
  'saturno',
  'halley',
  'neptuno',
  'urano',
  'pluton',
  'nebulosa',
  'sol',
];

const FILTER_ITEMS = [
  { key: 'all', label: 'Todos', icon: '🌌' },
  { key: 'mission', label: 'Misiones', icon: '⭐' },
  { key: 'planet', label: 'Planetas', icon: '🪐' },
  { key: 'asteroid', label: 'Asteroides', icon: '🪨' },
  { key: 'star', label: 'Estrellas', icon: '⭐' },
  { key: 'comet', label: 'Cometas', icon: '☄️' },
  { key: 'nebula', label: 'Nebulosas', icon: '🌌' },
];

// Pre-generated static star coordinates for pure deterministic rendering
const SCENE_STARS = Array.from({ length: 110 }, (_, i) => ({
  w: ((i * 7 + 13) % 25) / 10 + 0.5,
  left: (i * 17.3 + 5.1) % 100,
  top: (i * 23.7 + 11.3) % 100,
  opacity: (((i * 13) % 7) / 10 + 0.3).toFixed(2),
  delay: ((i * 19) % 30) / 10,
}));

const BG_STARS = Array.from({ length: 60 }, (_, i) => ({
  z: ((i * 9 + 7) % 20) / 10 + 0.8,
  left: (i * 19.1 + 3.7) % 100,
  top: (i * 29.3 + 7.9) % 100,
  opacity: (((i * 11) % 6) / 10 + 0.3).toFixed(2),
  delay: ((i * 17) % 30) / 10,
}));

function shade(hex: string, amt: number): string {
  if (!hex || hex[0] !== '#') return hex;
  let cleanHex = hex.slice(1);
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const r = parseInt(cleanHex.slice(0, 2), 16) || 0;
  const g = parseInt(cleanHex.slice(2, 4), 16) || 0;
  const b = parseInt(cleanHex.slice(4, 6), 16) || 0;
  const newR = Math.max(0, Math.min(255, r + amt));
  const newG = Math.max(0, Math.min(255, g + amt));
  const newB = Math.max(0, Math.min(255, b + amt));
  return '#' + [newR, newG, newB].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function hex2rgba(hex: string, a: number): string {
  let clean = String(hex || '#888888').replace('#', '');
  if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
  const n = parseInt(clean, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function playCosmicTone() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (e) {}
}

function speakPlanet(text: string) {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  } catch (e) {}
}

export default function UniversoFedorModal5to({
  isOpen,
  onClose,
  onSelectUnit,
  initialBodyId,
}: UniversoFedorModal5toProps) {
  const { totalXP, scores, selectUnit } = useBook5();
  const [filter, setFilter] = useState('all');
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const units = bookCurriculum5.UNITS || [];

  // Calculate unit percentage
  const getUnitPct = (uIdx: number) => {
    const u = units[uIdx];
    if (!u || !u.topics || u.topics.length === 0) return 0;
    let totalScore = 0;
    let totalLevels = 0;
    u.topics.forEach((t: any, ti: number) => {
      (t.levels || []).forEach((_: any, li: number) => {
        totalLevels++;
        const key = `${t.id || `u${uIdx}t${ti}`}-n${li + 1}`;
        totalScore += scores[key] || 0;
      });
    });
    return totalLevels > 0 ? Math.round(totalScore / totalLevels) : 0;
  };

  // Find active mission
  const activeMissionIdx = useMemo(() => {
    const idx = units.findIndex((_: any, i: number) => getUnitPct(i) < 100);
    return idx >= 0 ? idx : 0;
  }, [units, scores]);

  // Initial scroll position: automatically centers on active mission (e.g. Tierra at the bottom)
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      const sc = scrollRef.current;
      const aBody = BODIES_5TO.find((b) => b.unitIdx === activeMissionIdx) || BODIES_5TO[0];
      const pos = POS_4TO[aBody.id] || { y: 6 };
      const targetScroll = Math.max(0, 1620 * (1 - pos.y / 100) - sc.clientHeight * 0.55);
      setTimeout(() => {
        sc.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, activeMissionIdx]);

  useEffect(() => {
    if (initialBodyId) {
      const found = BODIES_5TO.find((b) => b.id === initialBodyId);
      if (found) setSelectedBody(found);
    }
  }, [initialBodyId]);

  if (!isOpen) return null;

  // Filter bodies
  const filteredBodies = BODIES_5TO.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'mission') return b.missionNum !== undefined;
    if (filter === 'planet') return b.type === 'planet' || b.type === 'mission' || b.type === 'moon';
    return b.type === filter;
  });

  // Calculate SVG Golden Path
  const pathDAll = RUTA_IDS.map((id, k) => {
    const p = POS_4TO[id];
    if (!p) return '';
    return `${k === 0 ? 'M' : 'L'} ${p.x} ${100 - p.y}`;
  }).join(' ');

  // Calculate SVG Completed (green) Path
  let latestDone = -1;
  RUTA_IDS.forEach((id, k) => {
    const body = BODIES_5TO.find((b) => b.id === id);
    if (body && body.unitIdx !== undefined && getUnitPct(body.unitIdx) >= 100) {
      latestDone = k;
    }
  });

  const pathDDone =
    latestDone >= 0
      ? RUTA_IDS.slice(0, latestDone + 1)
          .map((id, k) => {
            const p = POS_4TO[id];
            if (!p) return '';
            return `${k === 0 ? 'M' : 'L'} ${p.x} ${100 - p.y}`;
          })
          .join(' ')
      : '';

  const handleSelectBody = (b: CelestialBody) => {
    playCosmicTone();
    setSelectedBody(b);
    const uPct = b.unitIdx !== undefined ? getUnitPct(b.unitIdx) : 0;
    const msg = b.missionNum
      ? `${b.name.replace(/^\S+\s/, '')}. Misión ${b.missionNum}: ${b.missionTitle}. Llevas ${uPct} por ciento.`
      : `${b.name.replace(/^\S+\s/, '')}. ${b.desc}`;
    speakPlanet(msg);
  };

  const scrollToBody = (id: string) => {
    if (scrollRef.current) {
      const pos = POS_4TO[id] || { y: 50 };
      const targetScroll = Math.max(0, 1620 * (1 - pos.y / 100) - scrollRef.current.clientHeight * 0.55);
      scrollRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const getBaseType = (b: CelestialBody) => {
    if (b.type === 'mission') return b.id === 'sol' ? 'star' : 'planet';
    return b.type;
  };

  return (
    <div
      id="galaxyModal"
      className="f5u fixed inset-0 z-[99998] flex flex-col text-white overflow-hidden select-none animate-fadeIn"
      style={{
        background: 'radial-gradient(ellipse at top, #1A0A42 0%, #0A0420 50%, #020108 100%)',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ══ Background Stars (#uStars) ══ */}
      <div id="uStars" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {BG_STARS.map((s, idx) => (
          <div
            key={idx}
            className="ustar"
            style={{
              width: `${s.z}px`,
              height: `${s.z}px`,
              left: `${s.left}%`,
              top: `${s.top}%`,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ══ Header ══ */}
      <div
        className="relative z-30 px-4 pt-3 pb-3 flex items-center justify-between gap-3 shadow-lg"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,20,0.95) 75%, rgba(0,0,20,0.6) 95%, transparent)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #FF8C2A, #E8650A)',
            border: '2.5px solid #fff',
            color: '#fff',
            borderRadius: '26px',
            padding: '9px 18px',
            fontSize: '15px',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 6px 22px rgba(232,101,10,0.6)',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <span style={{ fontSize: '20px' }}>🏠</span>
          <span>VOLVER</span>
        </button>

        <div className="flex-1 text-center">
          <div
            style={{
              fontSize: '13px',
              fontWeight: 900,
              color: '#FFE066',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              fontFamily: "'Baloo 2', sans-serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>🌌</span>
            <span>UNIVERSO FEDOR</span>
          </div>
          <div
            id="f5uSub"
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: 'rgba(255,255,255,0.85)',
              marginTop: '2px',
            }}
          >
            Explora 17 cuerpos celestes · 15 misiones
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(245,197,24,0.25), rgba(255,140,42,0.15))',
            borderRadius: '14px',
            padding: '6px 14px',
            border: '2px solid rgba(245,197,24,0.5)',
            minWidth: '60px',
          }}
        >
          <div
            id="gHudXP"
            style={{
              fontSize: '20px',
              fontWeight: 900,
              color: '#FFE066',
              fontFamily: "'Baloo 2', sans-serif",
              lineHeight: 1,
            }}
          >
            {totalXP}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,224,102,0.85)', fontWeight: 800 }}>
            XP
          </div>
        </div>
      </div>

      {/* ══ Filter Chips Bar ══ */}
      <div
        className="relative z-20 px-3 py-1.5 overflow-x-auto no-scrollbar"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(10,4,32,0.45)',
        }}
      >
        <div id="gFilterChips" className="flex items-center justify-center gap-2 min-w-max mx-auto py-1">
          {FILTER_ITEMS.map((f) => {
            const isActive = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`gfilter-chip ${isActive ? 'active' : ''}`}
              >
                <span>{f.icon}</span> <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ Universe Scroll Container (#universeScroll) ══ */}
      <div
        ref={scrollRef}
        id="universeScroll"
        className="flex-1 overflow-y-auto overflow-x-hidden relative z-10"
      >
        {/* Banner Subtitle */}
        <div style={{ textAlign: 'center', color: '#fff', padding: '14px 14px 6px' }}>
          <div
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: '24px',
              color: '#FFE066',
              fontWeight: 900,
              textShadow: '0 0 30px rgba(245,197,24,0.55)',
            }}
          >
            🚀 Tu viaje cósmico · 5°
          </div>
          <div
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 700,
              marginTop: '4px',
            }}
          >
            Toca cualquier planeta · Sigue la ruta dorada: cada misión es una unidad del libro
          </div>
        </div>

        {/* ══ Main Cosmic Canvas Scene (#universeScene) ══ */}
        <div
          id="universeScene"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '780px',
            margin: '16px auto',
            height: '1620px',
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(155,92,255,0.22), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(36,196,150,0.15), transparent 55%), radial-gradient(ellipse at 50% 90%, rgba(26,108,180,0.18), transparent 55%)',
            borderRadius: '32px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.65)',
            border: '1.5px solid rgba(255,255,255,0.15)',
          }}
        >
          {/* Scene Stars (#uSceneStars) */}
          <div id="uSceneStars" className="absolute inset-0 pointer-events-none z-[1]">
            {SCENE_STARS.map((s, idx) => (
              <div
                key={idx}
                className="ss"
                style={{
                  width: `${s.w}px`,
                  height: `${s.w}px`,
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  opacity: s.opacity,
                  animationDelay: `${s.delay}s`,
                }}
              />
            ))}
          </div>

          {/* SVG Golden Path + Completed Path */}
          {(filter === 'all' || filter === 'mission') && (
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 pointer-events-none z-[2]"
              style={{ filter: 'drop-shadow(0 0 6px rgba(255, 224, 102, 0.5))' }}
            >
              <defs>
                <linearGradient id="f5GoldGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#FFE066" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>

              {/* Glowing background halo of the golden line */}
              <path
                d={pathDAll}
                stroke="rgba(255, 224, 102, 0.22)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Golden dashed route line */}
              <path
                id="f5uPathAll"
                d={pathDAll}
                stroke="url(#f5GoldGrad)"
                strokeWidth="0.65"
                strokeDasharray="1.6 1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="animate-gold-path"
              />

              {/* Green completed path */}
              {pathDDone && (
                <path
                  id="f5uPathDone"
                  d={pathDDone}
                  stroke="#34D399"
                  strokeWidth="0.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ filter: 'drop-shadow(0 0 8px #10B981)' }}
                />
              )}
            </svg>
          )}

          {/* Celestial Bodies Layer (#uBodies) */}
          <div id="uBodies" className="absolute inset-0 z-[5]">
            {filteredBodies.map((b, idx) => {
              const pos = POS_4TO[b.id] || { x: 50, y: 50, size: 80 };
              const tb = getBaseType(b);
              const uPct = b.unitIdx !== undefined ? getUnitPct(b.unitIdx) : 0;
              const isCurrentMission =
                b.unitIdx !== undefined && b.unitIdx === activeMissionIdx;

              const orbExtraClass = `${b.type === 'asteroid' ? ' uasteroid' : ''}${
                b.type === 'nebula' ? ' unebula' : ''
              }`;

              // 3 variations of lively floating animation so planets float organically
              const floatClass = `float-${(idx % 3) + 1}`;

              return (
                <div
                  key={b.id}
                  className={`ubody ${floatClass}`}
                  style={
                    {
                      left: `${pos.x}%`,
                      bottom: `${pos.y}%`,
                      animationDelay: `${((idx * 0.41) % 2.5).toFixed(2)}s`,
                      ['--size' as any]: `${pos.size}px`,
                      ['--g-1' as any]: b.glow,
                      ['--g-2' as any]: b.color,
                      ['--g-3' as any]: shade(b.color, -40),
                      ['--g-glow' as any]: b.glow,
                    } as React.CSSProperties
                  }
                  onClick={() => handleSelectBody(b)}
                >
                  {/* Halo pulse aura */}
                  <div className="uhalo" />

                  {/* Rotating dashed yellow orbit ring around mission bodies */}
                  {b.missionNum && !b.ring && (
                    <div className={`uring ${idx % 2 === 0 ? 'reverse' : ''}`} />
                  )}

                  {/* Radiant rotating sun rays for stars */}
                  {tb === 'star' && <div className="ustar-rays" />}

                  {/* Comet glowing tail */}
                  {b.type === 'comet' && <div className="ucomet-tail" />}

                  {/* Sphere Orb */}
                  <div className={`uorb${orbExtraClass}`}>
                    <span className="uemoji">{b.icon}</span>
                  </div>

                  {/* Saturn 3D Rings */}
                  {b.ring && <div className="usaturn-rings" />}

                  {/* Mission Number Badge on top-right */}
                  {b.missionNum && (
                    <div className={`umission-num ${uPct >= 100 ? 'ok' : ''}`}>
                      {uPct >= 100 ? '✓' : b.missionNum}
                    </div>
                  )}

                  {/* Bouncing Astronaut Hint for current active mission */}
                  {isCurrentMission && <div className="uhint-tap">🧑‍🚀</div>}

                  {/* Labels underneath */}
                  <div className="ulabel">
                    <div
                      className="ulabel-name"
                      style={
                        {
                          ['--label-border' as any]: b.missionNum
                            ? '#FF8C2A'
                            : 'rgba(255,255,255,0.25)',
                        } as React.CSSProperties
                      }
                    >
                      {b.name.replace(/^\S+\s/, '')}
                    </div>
                    <div
                      className="ulabel-cat"
                      style={
                        {
                          ['--label-cat-bg' as any]: b.missionNum
                            ? '#FFE066'
                            : '#C5BFEE',
                        } as React.CSSProperties
                      }
                    >
                      {b.missionNum
                        ? `MISIÓN ${b.missionNum} · ${b.missionTitle}`
                        : b.category}
                    </div>
                    {b.missionNum && uPct > 0 && (
                      <div className="ulabel-pct">{uPct}%</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Jump Bar */}
        <div className="sticky bottom-4 left-0 right-0 flex items-center justify-center gap-2 pointer-events-none z-30 px-3">
          <button
            type="button"
            onClick={() => scrollToBody('sol')}
            className="pointer-events-auto px-3.5 py-1.5 rounded-full text-xs font-black bg-[#150738]/90 hover:bg-[#280E65] text-amber-300 border border-amber-400/50 shadow-xl backdrop-blur-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            ☀️ Ir al Sol (Final)
          </button>
          <button
            type="button"
            onClick={() => {
              const aBody = BODIES_5TO.find((b) => b.unitIdx === activeMissionIdx) || BODIES_5TO[0];
              scrollToBody(aBody.id);
            }}
            className="pointer-events-auto px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-orange-500 text-[#2A0F60] border-2 border-white shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-pulse"
          >
            🚀 Mi Misión Actual
          </button>
          <button
            type="button"
            onClick={() => scrollToBody('tierra')}
            className="pointer-events-auto px-3.5 py-1.5 rounded-full text-xs font-black bg-[#150738]/90 hover:bg-[#280E65] text-blue-300 border border-blue-400/50 shadow-xl backdrop-blur-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            🌍 La Tierra (Inicio)
          </button>
        </div>

        <div style={{ height: '100px' }} />
      </div>

      {/* ══ Slide-up Planet Details Panel (#gPlanetPanel) ══ */}
      {selectedBody && (
        <div
          id="gPlanetPanel"
          className="f5p fixed bottom-0 left-0 right-0 z-50 bg-white text-gray-900 rounded-t-3xl shadow-2xl max-w-2xl mx-auto p-5 max-h-[82vh] overflow-y-auto animate-slideUp border-t-4 border-amber-400"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {/* Drag Handle */}
          <div
            style={{
              width: '48px',
              height: '5px',
              background: '#DDD8F5',
              borderRadius: '3px',
              margin: '0 auto 0.9rem',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedBody(null)}
          />

          {/* Header Row */}
          <div className="flex items-center gap-4 mb-4">
            <div
              id="gPpIcon"
              style={{
                fontSize: '66px',
                filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.25))',
                lineHeight: 1,
              }}
            >
              {selectedBody.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div
                id="gPpName"
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#1A1033',
                  lineHeight: 1.15,
                  fontFamily: "'Baloo 2', sans-serif",
                }}
              >
                {selectedBody.name}
              </div>
              <div
                id="gPpSubtitle"
                style={{
                  fontSize: '12px',
                  color: '#6C28B4',
                  fontWeight: 900,
                  marginTop: '3px',
                  letterSpacing: '0.03em',
                }}
              >
                {selectedBody.missionNum
                  ? `MISIÓN ${selectedBody.missionNum} · ${selectedBody.missionTitle}`
                  : selectedBody.category}
              </div>
              <div
                id="gPpDistance"
                style={{
                  fontSize: '11px',
                  color: '#7A7299',
                  fontWeight: 800,
                  marginTop: '5px',
                }}
              >
                🛸 {selectedBody.distance}
              </div>
            </div>

            {/* Progress % Pill */}
            {selectedBody.missionNum && (
              <div
                id="gPpPctBox"
                style={{
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #FEF0E6, #FFE2C8)',
                  border: '2px solid #FBBF7A',
                  borderRadius: '14px',
                  padding: '6px 12px',
                }}
              >
                <div
                  id="gPpPct"
                  style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    color: '#E8650A',
                    fontFamily: "'Baloo 2', sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {selectedBody.unitIdx !== undefined ? getUnitPct(selectedBody.unitIdx) : 0}%
                </div>
                <div style={{ fontSize: '11px', color: '#7A3200', fontWeight: 900 }}>
                  PROGRESO
                </div>
              </div>
            )}
          </div>

          {/* Mission Unit Action Card */}
          {selectedBody.unitIdx !== undefined && (() => {
            const uIdx = selectedBody.unitIdx;
            const uData = units[uIdx] || {};
            const pct = getUnitPct(uIdx);
            const stars =
              pct >= 95 ? 5 : pct >= 80 ? 4 : pct >= 65 ? 3 : pct >= 50 ? 2 : pct > 0 ? 1 : 0;
            const barCol =
              pct >= 70
                ? 'linear-gradient(90deg, #16876A, #24C496)'
                : pct >= 40
                ? 'linear-gradient(90deg, #E8650A, #F5C518)'
                : '#C5BFEE';

            return (
              <div className="mb-4">
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 900,
                    color: '#16876A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '8px',
                  }}
                >
                  🚀 Tu misión en este {getBaseType(selectedBody) === 'star' ? 'lugar' : 'planeta'}
                </div>

                <button
                  type="button"
                  className="f5sub"
                  onClick={() => {
                    setSelectedBody(null);
                    onClose();
                    if (onSelectUnit) onSelectUnit(uIdx);
                    else selectUnit(uIdx);
                  }}
                >
                  <span style={{ fontSize: '26px' }}>{uData.icon || '📘'}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ display: 'block', fontSize: '14px', color: '#1A1033' }}>
                      {uData.name || selectedBody.missionTitle}
                    </b>
                    <span style={{ fontSize: '11px', color: '#6B5E8A', fontWeight: 700 }}>
                      {uData.topics?.length || 5} temas · {'⭐'.repeat(stars) || '¡por empezar!'}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        height: '7px',
                        background: '#E8DBFF',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginTop: '4px',
                      }}
                    >
                      <i
                        style={{
                          display: 'block',
                          height: '7px',
                          width: `${pct}%`,
                          background: barCol,
                        }}
                      />
                    </span>
                  </span>
                  <span
                    style={{
                      fontFamily: "'Baloo 2', sans-serif",
                      fontWeight: 900,
                      color: '#fff',
                      background: 'linear-gradient(135deg, #FF8C2A, #E8650A)',
                      borderRadius: '12px',
                      padding: '6px 12px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {pct >= 100 ? '✅ Repasar' : pct > 0 ? '▶ Seguir' : '🚀 Ir'}
                  </span>
                </button>
              </div>
            );
          })()}

          {/* Description */}
          <div
            id="gPpDesc"
            style={{
              fontSize: '14px',
              color: '#1A1033',
              background: '#F8F5FF',
              borderLeft: '4px solid #6C28B4',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '1rem',
              lineHeight: 1.5,
              fontWeight: 600,
            }}
          >
            {selectedBody.desc}
          </div>

          {/* Curious Facts */}
          <div
            style={{
              fontSize: '12px',
              fontWeight: 900,
              color: '#3D1468',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}
          >
            💡 Datos curiosos
          </div>
          <div id="gPpFacts" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {selectedBody.facts.map((fact, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: `2px solid ${hex2rgba(selectedBody.glow, 0.5)}`,
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#1A1033',
                  lineHeight: 1.4,
                }}
              >
                {fact}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ Embedded CSS matching MatematicasDeFedor_5°.html with enhanced dynamic floating ══ */}
      <style>{`
        #uStars .ustar {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          animation: utwink 2s ease-in-out infinite alternate;
        }
        #uSceneStars .ss {
          position: absolute;
          border-radius: 50%;
          background: #fff;
          animation: utwink 2.5s ease-in-out infinite alternate;
        }
        .gfilter-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.8);
          border-radius: 14px;
          padding: 6px 13px;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
          font-family: 'Nunito', sans-serif;
          transition: all 0.2s;
        }
        .gfilter-chip:hover {
          background: rgba(255,255,255,0.18);
          color: #fff;
          transform: translateY(-1px);
        }
        .gfilter-chip.active {
          background: linear-gradient(135deg, #FFE066, #FF8C2A);
          color: #2A0F60;
          border-color: #FFE066;
          box-shadow: 0 4px 14px rgba(255,140,42,0.45);
        }

        /* ── Dynamic Organic Floating Animations ── */
        .float-1 {
          animation: ubodyFloat1 3.4s ease-in-out infinite;
        }
        .float-2 {
          animation: ubodyFloat2 4.1s ease-in-out infinite;
        }
        .float-3 {
          animation: ubodyFloat3 3.7s ease-in-out infinite;
        }

        @keyframes ubodyFloat1 {
          0%, 100% {
            transform: translate(-50%, 50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, 50%) translateY(-15px);
          }
        }
        @keyframes ubodyFloat2 {
          0%, 100% {
            transform: translate(-50%, 50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, 50%) translateY(-18px);
          }
        }
        @keyframes ubodyFloat3 {
          0%, 100% {
            transform: translate(-50%, 50%) translateY(-8px);
          }
          50% {
            transform: translate(-50%, 50%) translateY(9px);
          }
        }

        /* ── Active Dashed Line Flow Animation ── */
        @keyframes pathFlow {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -29;
          }
        }
        .animate-gold-path {
          animation: pathFlow 16s linear infinite;
        }

        /* ── Rotations & Pulses ── */
        @keyframes uorbRot {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes uorbRotRev {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }
        @keyframes uringPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.96);
            opacity: 0.45;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.85;
          }
        }
        @keyframes utwink {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes ucometTail {
          0%, 100% { opacity: 0.7; transform: rotate(-30deg) scaleX(1); }
          50% { opacity: 1; transform: rotate(-30deg) scaleX(1.25); }
        }
        @keyframes uflashHint {
          0%, 100% {
            opacity: 0.65;
            transform: translate(-50%, 0) translateY(0px) scale(0.95);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, 0) translateY(-8px) scale(1.12);
          }
        }

        /* ── Celestial Body Components ── */
        .ubody {
          position: absolute;
          cursor: pointer;
          z-index: 5;
          transition: filter 0.25s ease;
        }
        .ubody:hover {
          filter: brightness(1.22) drop-shadow(0 0 16px var(--g-glow));
          z-index: 20;
        }
        .uorb {
          width: var(--size, 80px);
          height: var(--size, 80px);
          border-radius: 50%;
          background: radial-gradient(circle at 32% 28%, var(--g-1), var(--g-2) 55%, var(--g-3) 100%);
          box-shadow: 0 0 45px var(--g-glow), inset -8px -10px 24px rgba(0,0,0,0.45), inset 6px 6px 16px rgba(255,255,255,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: calc(var(--size, 80px) * 0.5);
          position: relative;
          overflow: hidden;
          z-index: 3;
        }
        .uorb::before {
          content: "";
          position: absolute;
          top: 8%;
          left: 18%;
          width: 30%;
          height: 22%;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(255,255,255,0.55), transparent 70%);
          transform: rotate(-25deg);
          pointer-events: none;
        }
        .uorb .uemoji {
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
          position: relative;
          z-index: 2;
          user-select: none;
        }
        .uhalo {
          position: absolute;
          left: 50%;
          top: 50%;
          width: calc(var(--size, 80px) * 1.55);
          height: calc(var(--size, 80px) * 1.55);
          border-radius: 50%;
          background: radial-gradient(circle, var(--g-glow) 0%, transparent 60%);
          opacity: 0.55;
          animation: uringPulse 2.4s ease-in-out infinite;
          pointer-events: none;
          z-index: 2;
          transform: translate(-50%, -50%);
        }
        .uring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: calc(var(--size, 80px) * 1.88);
          height: calc(var(--size, 80px) * 1.88);
          border-radius: 50%;
          border: 2.2px dashed #FFE066;
          box-shadow: 0 0 10px rgba(255, 224, 102, 0.35);
          transform: translate(-50%, -50%);
          animation: uorbRot 13s linear infinite;
          pointer-events: none;
          z-index: 1;
        }
        .uring.reverse {
          animation: uorbRotRev 15s linear infinite;
        }
        .usaturn-rings {
          position: absolute;
          left: 50%;
          top: 50%;
          width: calc(var(--size, 80px) * 1.95);
          height: calc(var(--size, 80px) * 0.55);
          background: linear-gradient(180deg, transparent 20%, rgba(245,197,24,0.55) 30%, rgba(245,197,24,0.85) 50%, rgba(245,197,24,0.55) 70%, transparent 80%);
          border-radius: 50%;
          transform: translate(-50%, -50%) rotate(-15deg);
          box-shadow: 0 0 24px rgba(245,197,24,0.55);
          pointer-events: none;
          z-index: 4;
        }
        .ucomet-tail {
          position: absolute;
          left: 50%;
          top: 50%;
          width: calc(var(--size, 80px) * 2.6);
          height: 14px;
          background: linear-gradient(90deg, var(--g-glow), transparent);
          transform-origin: 0 50%;
          transform: rotate(-30deg);
          border-radius: 50% 0 0 50%;
          filter: blur(3px);
          opacity: 0.85;
          animation: ucometTail 2.2s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
        .ustar-rays {
          position: absolute;
          left: 50%;
          top: 50%;
          width: calc(var(--size, 80px) * 2.3);
          height: calc(var(--size, 80px) * 2.3);
          transform: translate(-50%, -50%);
          background: repeating-conic-gradient(from 0deg, rgba(255,224,102,0.45) 0deg 8deg, transparent 8deg 30deg);
          border-radius: 50%;
          animation: uorbRot 15s linear infinite;
          pointer-events: none;
          z-index: 1;
          filter: blur(2px);
        }
        .unebula {
          background: radial-gradient(ellipse, rgba(155,92,255,0.7) 0%, rgba(212,168,255,0.4) 30%, rgba(108,40,180,0.2) 60%, transparent 80%) !important;
          filter: blur(1px);
          box-shadow: none !important;
        }
        .unebula::before {
          display: none;
        }
        .uasteroid {
          border-radius: 42% 58% 50% 50% / 48% 42% 55% 52%;
        }
        .ulabel {
          position: absolute;
          left: 50%;
          top: calc(100% + 12px);
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 6;
        }
        .ulabel-name {
          background: rgba(10,5,30,0.88);
          color: #fff;
          font-weight: 900;
          font-size: 13px;
          padding: 4px 11px;
          border-radius: 11px;
          border: 1.5px solid var(--label-border, rgba(255,255,255,0.25));
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
          font-family: 'Nunito', sans-serif;
        }
        .ulabel-cat {
          background: var(--label-cat-bg, #C5BFEE);
          color: #1A1033;
          font-weight: 900;
          font-size: 9px;
          padding: 2px 8px;
          border-radius: 8px;
          letter-spacing: 0.04em;
          font-family: 'Nunito', sans-serif;
        }
        .ulabel-pct {
          background: #16876A;
          color: #fff;
          font-weight: 900;
          font-size: 10px;
          padding: 1px 8px;
          border-radius: 8px;
          font-family: 'Nunito', sans-serif;
        }
        .umission-num {
          position: absolute;
          top: -16px;
          right: -10px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFE066, #FF8C2A);
          border: 3px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Baloo 2", sans-serif;
          font-size: 17px;
          font-weight: 900;
          color: #3D1468;
          box-shadow: 0 6px 16px rgba(232,101,10,0.55);
          z-index: 9;
        }
        .umission-num.ok {
          background: linear-gradient(135deg, #6EE7B7, #16876A);
          color: #fff;
        }
        .uhint-tap {
          position: absolute;
          left: 50%;
          top: -46px;
          transform: translateX(-50%);
          font-size: 34px;
          pointer-events: none;
          animation: uflashHint 1.2s ease-in-out infinite;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.6));
          z-index: 10;
        }
        #gPlanetPanel.f5p {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .f5sub {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: #F8F5FF;
          border: 2px solid #E8DBFF;
          border-radius: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          width: 100%;
          text-align: left;
          margin-bottom: 6px;
          transition: transform 0.15s;
        }
        .f5sub:hover {
          transform: translateX(4px);
          border-color: #8B3EDB;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
