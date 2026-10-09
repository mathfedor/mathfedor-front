'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useBook4 } from '../context/Book4Context';
import Swal from 'sweetalert2';
import { FZ } from './fedor-visual-lab-engine';
import ShopModal4to from './ShopModal4to';
import RetoEspacialModal4to from './RetoEspacialModal4to';
import DiarioModal4to from './DiarioModal4to';
import ExamenFinalModal4to from './ExamenFinalModal4to';
import StickerAlbumModal4to from './StickerAlbumModal4to';
import MinijuegosModal4to from './MinijuegosModal4to';
import LaboratorioVisualModal4to from './LaboratorioVisualModal4to';

interface CommandPanelModals4toProps {
  activeTool: string | null;
  onClose: () => void;
  onOpenIntro?: () => void;
}

// ── 1. LABORATORIO VISUAL (18 manipulativos del HTML) ──
interface LabConfig {
  icon: string;
  name: string;
  color: string;
  labels: string[];
  defaults: (string | number)[];
  genText: (v: (string | number)[]) => string;
}

const LABS_CONFIG: LabConfig[] = [
  { icon: '➕', name: 'Sumar', color: '#5C21A6', labels: ['a', 'b'], defaults: [47, 35], genText: (v) => `${v[0]} + ${v[1]} = ?` },
  { icon: '➖', name: 'Restar', color: '#7C3AED', labels: ['a', 'b'], defaults: [82, 47], genText: (v) => `${v[0]} - ${v[1]} = ?` },
  { icon: '✖️', name: 'Multiplicar', color: '#E8650A', labels: ['a', 'b'], defaults: [6, 7], genText: (v) => `${v[0]} × ${v[1]} = ?` },
  { icon: '🍬', name: 'Repartir', color: '#16876A', labels: ['total', 'entre'], defaults: [23, 4], genText: (v) => `Se reparten ${v[0]} dulces entre ${v[1]} niños` },
  { icon: '🍕', name: 'Fracción', color: '#F59E0B', labels: ['arriba', 'abajo'], defaults: [6, 8], genText: (v) => `Simplifica la fracción ${v[0]}/${v[1]} a su mínima expresión.` },
  { icon: '➕', name: 'Sumar fracciones', color: '#D97706', labels: ['a/b', 'c/d'], defaults: ['1/2', '1/3'], genText: (v) => `${v[0]} + ${v[1]} = ?` },
  { icon: '🔎', name: 'Divisores', color: '#0F766E', labels: ['número'], defaults: [24], genText: (v) => `¿Cuáles son los divisores de ${v[0]}? divisor` },
  { icon: '🔗', name: 'MCD', color: '#0E7490', labels: ['a', 'b'], defaults: [12, 18], genText: (v) => `¿Cuál es el MCD de ${v[0]} y ${v[1]}?` },
  { icon: '🔁', name: 'MCM', color: '#0369A1', labels: ['a', 'b'], defaults: [4, 6], genText: (v) => `¿Cuál es el MCM de ${v[0]} y ${v[1]}?` },
  { icon: '⚡', name: 'Potencia', color: '#7C3AED', labels: ['base', 'exp.'], defaults: [3, 2], genText: (v) => `Calcula: ${v[0]}^${v[1]} = ?` },
  { icon: '√', name: 'Raíz', color: '#9333EA', labels: ['número'], defaults: [36], genText: (v) => `Calcula: √${v[0]} = ?` },
  { icon: '📏', name: 'Unidades', color: '#0891B2', labels: ['valor', 'de', 'a'], defaults: [3, 'm', 'cm'], genText: (v) => `¿A cuántos ${v[2]} equivalen ${v[0]} ${v[1]}?` },
  { icon: '🟩', name: 'Área', color: '#059669', labels: ['largo', 'ancho'], defaults: [6, 4], genText: (v) => `Calcula el área (en m²) de un rectángulo de ${v[0]} m × ${v[1]} m.` },
  { icon: '🧊', name: 'Volumen', color: '#0D9488', labels: ['l', 'a', 'h'], defaults: [3, 2, 4], genText: (v) => `Calcula el volumen (en m³) de un prisma de ${v[0]} m × ${v[1]} m × ${v[2]} m.` },
  { icon: '％', name: 'Porcentaje', color: '#BE185D', labels: ['%', 'de'], defaults: [25, 200], genText: (v) => `Halla el ${v[0]} % de ${v[1]}.` },
  { icon: '⚖️', name: 'Balanza', color: '#3D1468', labels: ['x +', '='], defaults: [7, 15], genText: (v) => `Resuelve la ecuación: x + ${v[0]} = ${v[1]}` },
  { icon: '🎲', name: 'Dado', color: '#B45309', labels: [], defaults: [], genText: () => '¿Cuál es la probabilidad al lanzar un dado de 6 caras?' },
  { icon: '👜', name: 'Bolsa', color: '#92400E', labels: ['rojas', 'total'], defaults: [3, 10], genText: (v) => `En una bolsa hay ${v[1]} bolas y ${v[0]} son rojas.` }
];

// ── 2. DESAFÍOS DEL DÍA DEL HTML ──
const DESAFIOS_DATA = [
  { t: 'Suma rápida', q: '234 + 567 = ?', a: 801, hint: 'Suma columna por columna' },
  { t: 'Resta rápida', q: '800 - 235 = ?', a: 565, hint: 'Presta 1 de la centena' },
  { t: 'Multiplicación', q: '45 × 6 = ?', a: 270, hint: '6×5=30 y 6×4=24, luego suma con llevada' },
  { t: 'División', q: '96 ÷ 8 = ?', a: 12, hint: '8 × 12 = 96' },
  { t: 'MCD', q: 'MCD(18, 24) = ?', a: 6, hint: 'Divisores comunes: 1, 2, 3, 6' },
  { t: 'MCM', q: 'MCM(4, 6) = ?', a: 12, hint: 'Múltiplos comunes: 12, 24...' },
  { t: 'Fracción', q: '1/2 + 1/3 (simplificado) = ?', a: '5/6', hint: 'MCM(2,3)=6' },
  { t: 'Simplificar', q: '12/16 simplificada = ?', a: '3/4', hint: 'MCD(12,16)=4' },
  { t: 'Perímetro', q: 'Cuadrado L=8 → P = ?', a: 32, hint: '4 × 8' },
  { t: 'Área', q: 'Rectángulo 5×7 → A = ?', a: 35, hint: 'base × altura' },
  { t: 'Volumen', q: 'Cubo L=4 → V = ?', a: 64, hint: '4×4×4' },
  { t: 'Potencia', q: '3^4 = ?', a: 81, hint: '3×3×3×3' },
  { t: 'Raíz', q: '√49 = ?', a: 7, hint: '7 × 7 = 49' },
];

// ── 3. EXPLICACIONES DEL HTML ──
const EXPLICACIONES_DATA = [
  { t: 'Suma con llevada', txt: 'Cuando sumas y una columna pasa de 10, escribes las unidades y llevas 1 a la siguiente columna.' },
  { t: 'Resta con préstamo', txt: 'Si el número de arriba es menor que el de abajo, pides prestado 10 a la columna izquierda.' },
  { t: 'Tabla del 9', txt: 'Truco: en la tabla del 9, los dígitos siempre suman 9. Ejemplo: 9×3=27, 2+7=9.' },
  { t: 'Divisores', txt: 'Los divisores de un número son los que lo dividen exactamente sin dejar residuo.' },
  { t: 'Números primos', txt: 'Un número primo tiene solo 2 divisores: el 1 y él mismo. Ejemplo: 2, 3, 5, 7, 11.' },
  { t: 'MCD', txt: 'El Máximo Común Divisor es el mayor número que divide a dos o más de forma exacta.' },
  { t: 'MCM', txt: 'El Mínimo Común Múltiplo es el menor múltiplo común de dos o más números.' },
  { t: 'Fracción propia', txt: 'Es aquella cuyo numerador es menor que el denominador. Ejemplo: 3/4.' },
  { t: 'Simplificar fracciones', txt: 'Divide numerador y denominador entre su MCD. 6/8 = 3/4.' },
];

// ── 4. CURRÍCULO BLOQUES DEL HTML ──
const CURRICULO_BLOQUES = [
  {
    id: 'mat',
    icono: '🔢',
    nombre: 'Matemáticas y Numérico',
    color: '#5C21A6',
    claro: '#F1EAFE',
    items: [
      'Números hasta millones: lectura, escritura y orden posicional.',
      'Operaciones básicas: adición, sustracción, multiplicación y división con problemas contextualizados.',
      'Teoría de números: múltiplos, divisores, números primos y compuestos, MCD y MCM.',
      'Fracciones y decimales: representación visual, suma, resta, equivalencias y proporcionalidad.'
    ]
  },
  {
    id: 'geo',
    icono: '📐',
    nombre: 'Geometría y Medición',
    color: '#0D9488',
    claro: '#DCF5EE',
    items: [
      'Figuras bidimensionales y tridimensionales: polígonos, primas, pirámides.',
      'Perímetro y área de polígonos regulares e irregulares.',
      'Unidades métricas de longitud, masa, capacidad y tiempo con conversión de escalas.',
      'Coordenadas en el plano cartesiano y transformaciones en el plano (rotación, traslación, reflexión).'
    ]
  },
  {
    id: 'est',
    icono: '📊',
    nombre: 'Estadística y Probabilidad',
    color: '#1E3A8A',
    claro: '#DBEAFE',
    items: [
      'Tablas de frecuencia absoluta y relativa.',
      'Gráficas de barras, líneas y pictogramas.',
      'Medidas de tendencia central: Media (promedio), Mediana y Moda.',
      'Nociones de probabilidad y azar en eventos cotidianos.'
    ]
  }
];

// ── 5. PROBLEMAS SABER NIVELES DEL HTML ──
const SABER_NIVELES = [
  {
    n: 1,
    t: '🌱 Nivel 1 — Solo Suma',
    color: '#14B8A6',
    q: 'Ana tiene $500 y su papá le da $300 más. En la papelería compra un lápiz de $200 y luego encuentra $100 en su bolsillo. ¿Cuánto dinero tiene en total?',
    opts: ['$700', '$800', '$900', '$600'],
    ans: '$700',
    proc: '500 + 300 = 800. Gasta 200: 800 - 200 = 600. Encuentra 100: 600 + 100 = 700.'
  },
  {
    n: 2,
    t: '📘 Nivel 2 — Solo Resta',
    color: '#3B82F6',
    q: 'En una panadería hornearon 1.250 panes por la mañana. A mediodía vendieron 680 panes y por la tarde se dañaron 45 panes. ¿Cuántos panes quedan para la venta nocturna?',
    opts: ['525 panes', '570 panes', '615 panes', '535 panes'],
    ans: '525 panes',
    proc: '1.250 - 680 = 570 panes. Luego: 570 - 45 = 525 panes.'
  },
  {
    n: 3,
    t: '📗 Nivel 3 — Solo Multiplicación',
    color: '#F97316',
    q: 'Un camión transporta 24 cajas de cuadernos. Cada caja contiene 15 paquetes y cada paquete tiene 6 cuadernos. ¿Cuántos cuadernos transporta en total?',
    opts: ['2.160 cuadernos', '1.800 cuadernos', '2.400 cuadernos', '1.920 cuadernos'],
    ans: '2.160 cuadernos',
    proc: '24 × 15 = 360 paquetes. Luego: 360 × 6 = 2.160 cuadernos.'
  },
  {
    n: 4,
    t: '📙 Nivel 4 — Solo División',
    color: '#7C3FCC',
    q: 'Un agricultor cosechó 1.560 naranjas y las empacará en bolsas de 12 naranjas cada una. ¿Cuántas bolsas completas obtendrá?',
    opts: ['130 bolsas', '125 bolsas', '140 bolsas', '115 bolsas'],
    ans: '130 bolsas',
    proc: '1.560 ÷ 12 = 130 bolsas exactas sin residuo.'
  },
  {
    n: 5,
    t: '🏆 Nivel 5 — Operaciones Combinadas',
    color: '#EC4899',
    q: 'Carlos compra 4 cuadernos a $3.500 cada uno y 3 cajas de colores a $6.200 cada una. Si paga con dos billetes de $20.000, ¿cuánto dinero le devuelven?',
    opts: ['$7.400', '$6.600', '$8.200', '$5.400'],
    ans: '$7.400',
    proc: 'Gasto: (4 × 3.500) + (3 × 6.200) = 14.000 + 18.600 = 32.600. Pago: 40.000. Vuelto: 40.000 - 32.600 = 7.400.'
  }
];

export default function CommandPanelModals4to({
  activeTool,
  onClose,
  onOpenIntro,
}: CommandPanelModals4toProps) {
  const { totalXP, coins, scores, updateStats } = useBook4();

  // Lab Visual State
  const [selectedLabIdx, setSelectedLabIdx] = useState<number>(0);
  const [labInputs, setLabInputs] = useState<(string | number)[]>(LABS_CONFIG[0].defaults);
  const [labHtml, setLabHtml] = useState<string>('');

  // Conteo State
  const [conteoStep, setConteoStep] = useState<number>(10);

  // Mult State
  const [multNum, setMultNum] = useState<number>(4);

  // Lab Estadística State
  const [estInput, setEstInput] = useState<string>('5, 3, 8, 5, 2, 8, 5');
  const [estResult, setEstResult] = useState<{ media: number; mediana: number; moda: string; rango: number; freq: Record<string, number> } | null>(null);

  // Explicación State
  const [explicaIdx, setExplicaIdx] = useState<number>(0);

  // Desafío State
  const [desafioAns, setDesafioAns] = useState<string>('');
  const [desafioDone, setDesafioDone] = useState<boolean>(false);

  // Minijuegos State
  const [gameType, setGameType] = useState<'menu' | 'contrarreloj' | 'repartir' | 'tienda'>('menu');
  const [gameTime, setGameTime] = useState<number>(60);
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameStreak, setGameStreak] = useState<number>(0);
  const [gameCurQ, setGameCurQ] = useState<{ q: string; r: number[]; dos?: boolean } | null>(null);
  const [gameInpA, setGameInpA] = useState<string>('');
  const [gameInpB, setGameInpB] = useState<string>('');

  // SABER State
  const [saberNivelIdx, setSaberNivelIdx] = useState<number>(0);
  const [saberSelectedOpt, setSaberSelectedOpt] = useState<string | null>(null);

  // Examen Final State
  const [examenCurQ, setExamenCurQ] = useState<number>(0);
  const [examenScore, setExamenScore] = useState<number>(0);
  const [examenFinished, setExamenFinished] = useState<boolean>(false);

  // Curriculo State
  const [curriculoBloq, setCurriculoBloq] = useState<string | null>(null);

  // Initialize Lab Visual when active
  useEffect(() => {
    if (activeTool === 'lab-visual') {
      const lab = LABS_CONFIG[selectedLabIdx];
      try {
        const text = lab.genText(labInputs);
        const html = FZ.crear ? FZ.crear(text, 'ej') : '';
        setLabHtml(html);
      } catch {
        setLabHtml('');
      }
    }
  }, [activeTool, selectedLabIdx, labInputs]);

  // Handle Lab Select
  const handleSelectLab = (idx: number) => {
    setSelectedLabIdx(idx);
    setLabInputs(LABS_CONFIG[idx].defaults);
    try {
      const text = LABS_CONFIG[idx].genText(LABS_CONFIG[idx].defaults);
      const html = FZ.crear ? FZ.crear(text, 'ej') : '';
      setLabHtml(html);
    } catch {
      setLabHtml('');
    }
  };

  const handleUpdateLab = () => {
    const lab = LABS_CONFIG[selectedLabIdx];
    try {
      const text = lab.genText(labInputs);
      const html = FZ.crear ? FZ.crear(text, 'ej') : '';
      setLabHtml(html);
    } catch {
      setLabHtml('');
    }
  };

  // Lab Estadística Calculation
  const handleCalcEstadistica = () => {
    const vals = estInput
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));

    if (vals.length === 0) return;

    vals.sort((a, b) => a - b);
    const sum = vals.reduce((a, b) => a + b, 0);
    const media = Math.round((sum / vals.length) * 100) / 100;

    const mid = Math.floor(vals.length / 2);
    const mediana = vals.length % 2 === 0 ? (vals[mid - 1] + vals[mid]) / 2 : vals[mid];

    const freq: Record<string, number> = {};
    let maxFreq = 0;
    vals.forEach((v) => {
      freq[v] = (freq[v] || 0) + 1;
      if (freq[v] > maxFreq) maxFreq = freq[v];
    });

    const modas = Object.keys(freq).filter((k) => freq[k] === maxFreq);
    const moda = modas.join(', ');
    const rango = vals[vals.length - 1] - vals[0];

    setEstResult({ media, mediana, moda, rango, freq });
  };

  // Text to speech helper
  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/<[^>]*>/g, ' ');
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = 'es-ES';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  // Minijuegos Question Generator
  const generateGameQ = (tipo: 'contrarreloj' | 'repartir' | 'tienda') => {
    const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    if (tipo === 'contrarreloj') {
      const op = rnd(0, 3);
      if (op === 0) {
        const a = rnd(2, 12), b = rnd(2, 12);
        return { q: `${a} × ${b} = ?`, r: [a * b] };
      }
      if (op === 1) {
        const b = rnd(2, 12), c = rnd(2, 12);
        return { q: `${b * c} ÷ ${b} = ?`, r: [c] };
      }
      if (op === 2) {
        const a = rnd(120, 890), b = rnd(100, 890);
        return { q: `${a} + ${b} = ?`, r: [a + b] };
      }
      const a = rnd(250, 990), b = rnd(100, a - 1);
      return { q: `${a} − ${b} = ?`, r: [a - b] };
    }
    if (tipo === 'repartir') {
      const amigos = rnd(3, 8), cadaUno = rnd(4, 12), sobran = rnd(0, amigos - 1);
      const total = amigos * cadaUno + sobran;
      return {
        q: `Reparte ${total} chocolates entre ${amigos} amigos por igual. ¿Cuántos recibe cada uno y cuántos sobran?`,
        r: [cadaUno, sobran],
        dos: true
      };
    }
    // Tienda
    const precio = rnd(15, 45) * 100;
    const cant = rnd(2, 4);
    const total = precio * cant;
    const billete = Math.ceil(total / 10000) * 10000 || total + 10000;
    const vuelto = billete - total;
    return {
      q: `Compras ${cant} productos de $${precio.toLocaleString()} cada uno y pagas con un billete de $${billete.toLocaleString()}. ¿Cuánto es el vuelto?`,
      r: [vuelto]
    };
  };

  // Minijuegos Timer Effect
  useEffect(() => {
    if (gameType === 'menu') return;
    const timer = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          Swal.fire({
            title: '⏰ ¡Tiempo agotado!',
            html: `<div style="font-size:16px;font-weight:900;color:#5C21A6">
              Puntos logrados: <b>${gameScore}</b> ⭐<br/>
              Mejor racha: <b>${gameStreak}</b> 🔥
            </div>`,
            icon: 'info',
            confirmButtonColor: '#7C3AED'
          });
          setGameType('menu');
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameType, gameScore, gameStreak]);

  const handleStartGame = (t: 'contrarreloj' | 'repartir' | 'tienda') => {
    setGameType(t);
    setGameTime(60);
    setGameScore(0);
    setGameStreak(0);
    setGameInpA('');
    setGameInpB('');
    setGameCurQ(generateGameQ(t));
  };

  const handleCheckGameAnswer = () => {
    if (!gameCurQ) return;
    let ok = false;
    if (gameCurQ.dos) {
      ok = parseInt(gameInpA) === gameCurQ.r[0] && parseInt(gameInpB) === gameCurQ.r[1];
    } else {
      ok = parseInt(gameInpA) === gameCurQ.r[0];
    }

    if (ok) {
      setGameScore((s) => s + 10 + gameStreak * 2);
      setGameStreak((r) => r + 1);
    } else {
      setGameStreak(0);
    }

    setGameInpA('');
    setGameInpB('');
    if (gameType !== 'menu') {
      setGameCurQ(generateGameQ(gameType));
    }
  };

  // Desafío Del Día Selector
  const curDesafio = useMemo(() => {
    const d = new Date();
    const idx = (d.getDate() * 7 + d.getMonth()) % DESAFIOS_DATA.length;
    return DESAFIOS_DATA[idx];
  }, []);

  const handleCheckDesafio = () => {
    const isCorrect = String(desafioAns).trim().toLowerCase() === String(curDesafio.a).toLowerCase();
    if (isCorrect) {
      setDesafioDone(true);
      updateStats(30, 1, 50);
      Swal.fire({
        icon: 'success',
        title: '¡Desafío Acertado! 🎯',
        html: '<div style="font-size:15px;font-weight:bold;color:#3D1468">¡Ganaste <b>+50 XP</b> y <b>+30 🪙</b>!</div>',
        confirmButtonColor: '#E8650A'
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: '¡Casi lo logras!',
        text: `Pista: ${curDesafio.hint}`,
        confirmButtonColor: '#E8650A'
      });
    }
  };

  if (!activeTool) return null;

  if (activeTool === 'lab-visual' || activeTool === 'lab' || activeTool === 'laboratorio') {
    return <LaboratorioVisualModal4to isOpen={true} onClose={onClose} />;
  }

  if (activeTool === 'tienda') {
    return <ShopModal4to isOpen={true} onClose={onClose} />;
  }

  if (activeTool === 'espacial') {
    return <RetoEspacialModal4to isOpen={true} onClose={onClose} />;
  }

  if (activeTool === 'diario') {
    return <DiarioModal4to isOpen={true} onClose={onClose} />;
  }

  if (activeTool === 'examen' || activeTool === 'examen-final') {
    return <ExamenFinalModal4to isOpen={true} onClose={onClose} />;
  }

  if (activeTool === 'stickers') {
    return <StickerAlbumModal4to isOpen={true} onClose={onClose} />;
  }

  if (activeTool === 'juegos' || activeTool === 'minijuegos') {
    return <MinijuegosModal4to isOpen={true} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-purple-600 relative overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {activeTool === 'lab-visual' && '🧠'}
              {activeTool === 'conteo' && '🔢'}
              {activeTool === 'mult' && '✖️'}
              {activeTool === 'lab-est' && '🔬'}
              {activeTool === 'explicar' && '💡'}
              {activeTool === 'videos' && '🎬'}
              {activeTool === 'concepto' && '📘'}
              {activeTool === 'historia' && '📜'}
              {activeTool === 'desafio' && '🎯'}
              {activeTool === 'logros' && '🏆'}
              {activeTool === 'minijuegos' && '🎮'}
              {activeTool === 'saber' && '🏆'}
              {activeTool === 'examen-final' && '🎓'}
              {activeTool === 'repaso' && '🔄'}
              {activeTool === 'guia-docente' && '👩‍🏫'}
              {activeTool === 'color' && '🎨'}
              {activeTool === 'curriculo' && '📑'}
            </span>
            <h2 className="text-xl font-black text-[#1A1033]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              {activeTool === 'lab-visual' && 'Laboratorio Visual Interactivo'}
              {activeTool === 'conteo' && 'Tablas de Conteo (4°)'}
              {activeTool === 'mult' && 'Tablas de Multiplicar del 1 al 12'}
              {activeTool === 'lab-est' && 'Laboratorio de Estadística y Datos'}
              {activeTool === 'explicar' && 'Explicaciones Paso a Paso'}
              {activeTool === 'videos' && 'Videos Animados Fedor'}
              {activeTool === 'concepto' && 'Concepto Matemático del Día'}
              {activeTool === 'historia' && 'Historia y Método Fedor'}
              {activeTool === 'desafio' && 'Desafío Matemático del Día'}
              {activeTool === 'logros' && 'Vitrina de Trofeos y Medallas'}
              {activeTool === 'minijuegos' && 'Minijuegos de Agilidad Mental'}
              {activeTool === 'saber' && 'Problemas Tipo Prueba SABER 4°'}
              {activeTool === 'examen-final' && 'Examen Final Integrador del Libro'}
              {activeTool === 'repaso' && 'Mi Repaso Personalizado'}
              {activeTool === 'guia-docente' && 'Guía Pedagógica del Docente (MEN 4°)'}
              {activeTool === 'color' && 'Selector de Color del Libro'}
              {activeTool === 'curriculo' && 'Currículo MEN · Grado 4°'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 font-black flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ══ 1. LABORATORIO VISUAL ══ */}
        {activeTool === 'lab-visual' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white shadow-md">
              <h3 className="text-lg font-black" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                🧠 Laboratorio visual interactivo
              </h3>
              <p className="text-xs font-semibold opacity-90">
                Elige una herramienta pedagógica, ajusta los números y experimenta de forma visual sin límite.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {LABS_CONFIG.map((L, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectLab(i)}
                  className={`p-2.5 rounded-xl text-center text-white font-black text-xs transition-transform cursor-pointer ${
                    selectedLabIdx === i ? 'scale-105 ring-4 ring-yellow-400 shadow-lg' : 'hover:scale-102 opacity-90'
                  }`}
                  style={{ background: L.color }}
                >
                  <span className="text-xl block mb-0.5">{L.icon}</span>
                  <span className="truncate block">{L.name}</span>
                </button>
              ))}
            </div>

            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-2xl">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="font-black text-sm text-purple-900">
                  {LABS_CONFIG[selectedLabIdx].icon} {LABS_CONFIG[selectedLabIdx].name}:
                </span>
                {LABS_CONFIG[selectedLabIdx].labels.map((lbl, k) => (
                  <label key={k} className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                    <span>{lbl}:</span>
                    <input
                      type="text"
                      value={labInputs[k] ?? ''}
                      onChange={(e) => {
                        const next = [...labInputs];
                        next[k] = e.target.value;
                        setLabInputs(next);
                      }}
                      className="w-16 p-1.5 border border-purple-300 rounded-lg bg-white text-center font-bold text-purple-900"
                    />
                  </label>
                ))}
                <button
                  type="button"
                  onClick={handleUpdateLab}
                  className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-xs rounded-xl shadow cursor-pointer hover:brightness-110"
                >
                  ✨ Actualizar figura
                </button>
              </div>

              {labHtml ? (
                <div
                  className="bg-white p-3 rounded-xl border border-purple-200 shadow-inner overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: labHtml }}
                />
              ) : (
                <div className="p-6 text-center text-gray-500 font-bold text-xs">
                  Ajusta los valores y pulsa "Actualizar figura" para desplegar la visualización matemática.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ 2. CONTEO ══ */}
        {activeTool === 'conteo' && (
          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3">
              Toca un intervalo para ver la tabla de conteo de 4° grado:
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
              {[1, 2, 3, 5, 10, 20, 50, 100].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setConteoStep(step)}
                  className={`p-2.5 rounded-xl font-black text-xs cursor-pointer transition-transform ${
                    conteoStep === step
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white scale-105 shadow-md'
                      : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  De {step} en {step}
                </button>
              ))}
            </div>

            <div className="bg-[#F8F5FF] border-2 border-[#C5BFEE] rounded-2xl p-4">
              <div className="text-sm font-black text-purple-900 mb-3">
                Conteo de {conteoStep} en {conteoStep} hasta {conteoStep * 24}:
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-white rounded-xl border border-purple-100 text-center font-black text-xs text-[#2A0F60] shadow-xs"
                  >
                    {(i + 1) * conteoStep}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ 3. MULTIPLICAR ══ */}
        {activeTool === 'mult' && (
          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3">
              Selecciona una tabla del 1 al 12 para repasar:
            </p>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 mb-4">
              {Array.from({ length: 12 }).map((_, i) => {
                const n = i + 1;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setMultNum(n)}
                    className={`p-2 rounded-xl font-black text-xs cursor-pointer transition-transform ${
                      multNum === n
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white scale-105 shadow-md'
                        : 'bg-orange-50 text-orange-900 border border-orange-200 hover:bg-orange-100'
                    }`}
                  >
                    ×{n}
                  </button>
                );
              })}
            </div>

            <div className="bg-[#FFF8F0] border-2 border-[#FBD38D] rounded-2xl p-4">
              <div className="text-sm font-black text-orange-900 mb-3">
                Tabla del {multNum} (1 al 12):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const m = i + 1;
                  return (
                    <div
                      key={m}
                      className="p-2.5 bg-white rounded-xl border border-orange-100 text-center font-bold text-xs text-[#7A3200] shadow-xs"
                    >
                      {multNum} × {m} = <b className="text-orange-600 text-sm">{multNum * m}</b>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══ 4. LAB ESTADÍSTICA ══ */}
        {activeTool === 'lab-est' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm font-bold text-gray-700">
              Escribe hasta 15 números separados por coma para calcular Media, Mediana, Moda y Gráfica:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={estInput}
                onChange={(e) => setEstInput(e.target.value)}
                placeholder="Ej: 5, 3, 8, 5, 2, 8, 5"
                className="flex-1 p-3 border-2 border-teal-300 rounded-xl font-bold text-sm text-teal-950 bg-teal-50/40"
              />
              <button
                type="button"
                onClick={handleCalcEstadistica}
                className="px-5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-xs rounded-xl shadow cursor-pointer hover:brightness-110"
              >
                🔬 Analizar datos
              </button>
            </div>

            {estResult && (
              <div className="p-4 bg-teal-50 border-2 border-teal-200 rounded-2xl space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100">
                    <div className="text-[10px] font-black uppercase text-teal-600">Promedio (Media)</div>
                    <div className="text-base font-black text-teal-900">{estResult.media}</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100">
                    <div className="text-[10px] font-black uppercase text-teal-600">Mediana</div>
                    <div className="text-base font-black text-teal-900">{estResult.mediana}</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100">
                    <div className="text-[10px] font-black uppercase text-teal-600">Moda</div>
                    <div className="text-base font-black text-teal-900">{estResult.moda}</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100">
                    <div className="text-[10px] font-black uppercase text-teal-600">Rango</div>
                    <div className="text-base font-black text-teal-900">{estResult.rango}</div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-teal-100">
                  <div className="text-xs font-black text-teal-900 mb-2">📊 Frecuencia de cada valor:</div>
                  <div className="space-y-1.5">
                    {Object.entries(estResult.freq).map(([val, count]) => {
                      const maxC = Math.max(...Object.values(estResult.freq));
                      const pct = Math.round((count / maxC) * 100);
                      return (
                        <div key={val} className="flex items-center gap-3 text-xs font-bold text-gray-700">
                          <span className="w-12 text-right">Valor {val}:</span>
                          <div className="flex-1 h-5 bg-teal-100 rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-teal-600 rounded-lg flex items-center justify-end pr-2 text-[10px] text-white font-black"
                              style={{ width: `${Math.max(15, pct)}%` }}
                            >
                              {count} veces
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ 5. EXPLICAR ══ */}
        {activeTool === 'explicar' && (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-tr from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-2xl text-center">
              <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-2">
                Explicación {explicaIdx + 1} de {EXPLICACIONES_DATA.length}
              </div>
              <h3 className="text-lg font-black text-purple-950 mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                {EXPLICACIONES_DATA[explicaIdx].t}
              </h3>
              <p className="text-sm font-semibold text-gray-800 leading-relaxed max-w-lg mx-auto mb-4">
                {EXPLICACIONES_DATA[explicaIdx].txt}
              </p>
              <button
                type="button"
                onClick={() => handleSpeak(EXPLICACIONES_DATA[explicaIdx].txt)}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-black rounded-xl shadow cursor-pointer transition-colors"
              >
                🗣️ Escuchar Explicación
              </button>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                disabled={explicaIdx === 0}
                onClick={() => setExplicaIdx((i) => Math.max(0, i - 1))}
                className="px-4 py-2 rounded-xl border border-purple-200 font-black text-xs text-purple-900 bg-purple-50 disabled:opacity-40 cursor-pointer"
              >
                ◀ Anterior
              </button>
              <button
                type="button"
                disabled={explicaIdx === EXPLICACIONES_DATA.length - 1}
                onClick={() => setExplicaIdx((i) => Math.min(EXPLICACIONES_DATA.length - 1, i + 1))}
                className="px-4 py-2 rounded-xl border border-purple-200 font-black text-xs text-purple-900 bg-purple-50 disabled:opacity-40 cursor-pointer"
              >
                Siguiente ▶
              </button>
            </div>
          </div>
        )}

        {/* ══ 6. VIDEOS ══ */}
        {activeTool === 'videos' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                if (onOpenIntro) onOpenIntro();
                else Swal.fire('🚀 Despegue Fedor', 'Iniciando introducción cinematográfica de 4° grado.', 'info');
              }}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 text-white font-black text-sm shadow-md cursor-pointer hover:brightness-110 flex items-center justify-center gap-2"
            >
              <span>🚀</span> Ver Despegue Cinemático Fedor (Intro Completa)
            </button>

            <div className="space-y-2.5">
              {[
                { title: '🎬 1. Las Fracciones en la Vida Diaria', desc: 'Aprende qué es el numerador y denominador con pizzas y chocolates.', dur: '3:45' },
                { title: '🎬 2. Matrices y el Área de la Multiplicación', desc: 'Visualiza la multiplicación como cuadrículas rectangulares de área.', dur: '4:10' },
                { title: '🎬 3. Misiones de MCD y MCM con Fedor', desc: 'Encuentra múltiplos y divisores comunes en viajes estelares.', dur: '3:20' },
                { title: '🎬 4. Decimales y Manejo de Moneda Colombiana', desc: 'Aprende a sumar décimas, centésimas y pagar con billetes de pesos.', dur: '5:00' },
              ].map((v, idx) => (
                <div key={idx} className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-purple-950">{v.title}</div>
                    <div className="text-[11px] text-gray-600 font-semibold">{v.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => Swal.fire('🎬 Reproductor Fedor', `Reproduciendo: ${v.title}`, 'info')}
                    className="px-3 py-1.5 bg-purple-700 text-white font-black text-xs rounded-lg cursor-pointer hover:bg-purple-800 shrink-0"
                  >
                    Ver ▶
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ 7. CONCEPTO ══ */}
        {activeTool === 'concepto' && (
          <div className="p-6 bg-gradient-to-tr from-purple-50 to-amber-50 rounded-2xl border-2 border-purple-300 text-center">
            <span className="text-4xl mb-2 block">🌟</span>
            <div className="text-xs font-black uppercase tracking-wider text-amber-700 mb-1">
              CONCEPTO DEL DÍA
            </div>
            <h3 className="text-xl font-black text-[#2A0F60] mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              ¿Qué es la Propiedad Distributiva?
            </h3>
            <p className="text-xs sm:text-sm text-gray-800 font-semibold leading-relaxed max-w-md mx-auto mb-4">
              La multiplicación se distribuye sobre la suma: multiplicar un número por una suma da el mismo resultado que multiplicar cada sumando y luego sumarlos.<br/>
              <b>Ejemplo:</b> 4 × (10 + 5) = (4 × 10) + (4 × 5) = 40 + 20 = <b>60</b>.
            </p>
            <div className="inline-block px-4 py-1.5 bg-amber-200 text-amber-900 rounded-full text-xs font-black">
              💡 Tip Fedor: Esta propiedad es la clave para multiplicar mentalmente números grandes.
            </div>
          </div>
        )}

        {/* ══ 8. HISTORIA ══ */}
        {activeTool === 'historia' && (
          <div className="space-y-3 text-xs sm:text-sm font-semibold text-gray-800 leading-relaxed">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
              <h4 className="font-black text-purple-900 mb-1 text-base" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                🚀 Origen del Método Fedor (Fernando Bastidas Parra)
              </h4>
              <p>
                El método matemático Fedor fue desarrollado en Colombia para superar la enseñanza tradicional abstracta. Cada niño avanza como comandante de su propia expedición espacial por el Sistema Solar y el cosmos.
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <h4 className="font-black text-amber-900 mb-1 text-base" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                🧩 Los 4 Pasos Pedagógicos del Método
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><b>1. VERTICAL (Visualización):</b> El problema se representa mediante ábacos, barras, bloques o modelos visuales.</li>
                <li><b>2. Instrucción:</b> Guía explícita paso a paso de lo que se debe operar.</li>
                <li><b>3. Procedimiento:</b> Ejecución activa de la operación sin atajos memorísticos.</li>
                <li><b>4. Resultado:</b> Verificación y transferencia a situaciones cotidianas.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ══ 9. DESAFÍO ══ */}
        {activeTool === 'desafio' && (
          <div className="p-6 bg-gradient-to-tr from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-300 text-center space-y-4">
            <span className="text-4xl block">🎯</span>
            <div className="text-xs font-black uppercase tracking-wider text-orange-700">
              DESAFÍO DEL DÍA · {curDesafio.t}
            </div>
            <div className="text-2xl font-black text-orange-950" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              {curDesafio.q}
            </div>

            <div className="max-w-xs mx-auto space-y-3">
              <input
                type="text"
                value={desafioAns}
                disabled={desafioDone}
                onChange={(e) => setDesafioAns(e.target.value)}
                placeholder="Escribe tu respuesta"
                className="w-full p-3 border-2 border-orange-300 rounded-xl text-center font-black text-lg text-orange-950 bg-white"
              />
              {!desafioDone ? (
                <button
                  type="button"
                  onClick={handleCheckDesafio}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs rounded-xl shadow cursor-pointer hover:brightness-110"
                >
                  Comprobar Respuesta
                </button>
              ) : (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 font-black rounded-xl text-xs">
                  ✅ ¡Completado exitosamente hoy!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ 10. LOGROS ══ */}
        {activeTool === 'logros' && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-gray-700">
              Total XP acumulado: <strong>{totalXP} XP</strong> · <strong>{coins} 🪙</strong> monedas.
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: '🚀', name: 'Primer Despegue', desc: 'Comienza tu viaje en 4°', ok: true },
                { icon: '🔟', name: 'Sistema Decimal', desc: 'Domina los números hasta 100.000', ok: totalXP >= 100 },
                { icon: '✖️', name: 'Gran Multiplicador', desc: 'Supera 50 multiplicaciones', ok: totalXP >= 250 },
                { icon: '🛒', name: 'Experto SABER', desc: 'Resuelve compras y vueltos', ok: totalXP >= 500 },
                { icon: '🪐', name: 'Conquistador Solar', desc: 'Explora los 15 mundos de 4°', ok: totalXP >= 1000 },
                { icon: '👑', name: 'Almirante Cósmico', desc: 'Alcanza el rango de honor Fedor', ok: totalXP >= 2000 },
              ].map((t, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border flex items-center gap-3 ${
                    t.ok ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <div className="text-xs font-black text-gray-900">{t.name}</div>
                    <div className="text-[10px] text-gray-600 font-semibold">{t.desc}</div>
                    <div className="text-[9px] font-black text-amber-600 mt-0.5">
                      {t.ok ? '✅ Desbloqueado' : '🔒 Bloqueado'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ 11. MINIJUEGOS ══ */}
        {activeTool === 'minijuegos' && (
          <div className="space-y-4">
            {gameType === 'menu' ? (
              <>
                <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3">
                  60 segundos para responder todo lo que puedas. ¡Las rachas dan puntos extra!
                </p>
                <div className="space-y-2.5">
                  {[
                    { id: 'contrarreloj' as const, title: '⚡ Contrarreloj', desc: 'Operaciones rápidas: ×, ÷, +, −', color: '#7C3AED' },
                    { id: 'repartir' as const, title: '🍬 Repartir', desc: 'División con cociente y residuo', color: '#0D9488' },
                    { id: 'tienda' as const, title: '🏪 Tienda', desc: 'Compras con pesos y cálculo del vuelto', color: '#E8650A' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleStartGame(g.id)}
                      className="w-full p-4 rounded-2xl bg-white border-2 text-left transition-transform cursor-pointer hover:scale-101 flex items-center justify-between"
                      style={{ borderColor: g.color }}
                    >
                      <div>
                        <div className="text-sm font-black" style={{ color: g.color }}>
                          {g.title}
                        </div>
                        <div className="text-xs text-gray-600 font-semibold">{g.desc}</div>
                      </div>
                      <span className="px-3 py-1 rounded-lg text-white font-black text-xs" style={{ background: g.color }}>
                        Jugar ▶
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-2xl space-y-4 text-center">
                <div className="flex justify-between items-center font-black text-xs text-purple-900 border-b border-purple-200 pb-2">
                  <span>⏱ Tiempo: {gameTime}s</span>
                  <span>⭐ Puntos: {gameScore}</span>
                  <span>🔥 Racha: x{gameStreak}</span>
                </div>

                <div className="text-xl sm:text-2xl font-black text-purple-950 py-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {gameCurQ?.q}
                </div>

                <div className="max-w-xs mx-auto space-y-2">
                  {gameCurQ?.dos ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Cada uno"
                        value={gameInpA}
                        onChange={(e) => setGameInpA(e.target.value)}
                        className="flex-1 p-2.5 border-2 border-purple-300 rounded-xl text-center font-bold text-sm bg-white"
                      />
                      <input
                        type="number"
                        placeholder="Sobran"
                        value={gameInpB}
                        onChange={(e) => setGameInpB(e.target.value)}
                        className="flex-1 p-2.5 border-2 border-purple-300 rounded-xl text-center font-bold text-sm bg-white"
                      />
                    </div>
                  ) : (
                    <input
                      type="number"
                      placeholder="Tu respuesta"
                      value={gameInpA}
                      onChange={(e) => setGameInpA(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheckGameAnswer()}
                      className="w-full p-2.5 border-2 border-purple-300 rounded-xl text-center font-black text-lg bg-white"
                    />
                  )}

                  <button
                    type="button"
                    onClick={handleCheckGameAnswer}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-black text-xs rounded-xl shadow cursor-pointer"
                  >
                    Responder
                  </button>
                  <button
                    type="button"
                    onClick={() => setGameType('menu')}
                    className="text-xs font-bold text-purple-700 underline cursor-pointer"
                  >
                    Salir del juego
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ 12. SABER ══ */}
        {activeTool === 'saber' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm font-bold text-gray-700">
              Elige un nivel de progresión matemática tipo Prueba SABER:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SABER_NIVELES.map((nv, i) => (
                <button
                  key={nv.n}
                  type="button"
                  onClick={() => {
                    setSaberNivelIdx(i);
                    setSaberSelectedOpt(null);
                  }}
                  className={`p-2.5 rounded-xl text-white font-black text-xs cursor-pointer transition-transform ${
                    saberNivelIdx === i ? 'scale-105 ring-2 ring-yellow-400' : 'opacity-85'
                  }`}
                  style={{ background: nv.color }}
                >
                  {nv.t}
                </button>
              ))}
            </div>

            <div className="p-4 bg-white border-2 border-gray-200 rounded-2xl space-y-3">
              <div className="text-xs font-black uppercase text-purple-700">
                Situación Problema (Nivel {SABER_NIVELES[saberNivelIdx].n}):
              </div>
              <p className="text-sm font-bold text-gray-800 leading-relaxed">
                {SABER_NIVELES[saberNivelIdx].q}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {SABER_NIVELES[saberNivelIdx].opts.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSaberSelectedOpt(opt)}
                    className={`p-3 rounded-xl border-2 font-black text-xs cursor-pointer transition-colors ${
                      saberSelectedOpt === opt
                        ? opt === SABER_NIVELES[saberNivelIdx].ans
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                          : 'bg-rose-100 border-rose-500 text-rose-900'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {saberSelectedOpt && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-950">
                  <b>Proceso matemático:</b> {SABER_NIVELES[saberNivelIdx].proc}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ 13. EXAMEN FINAL ══ */}
        {activeTool === 'examen-final' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-700 to-pink-600 text-white text-center">
              <h3 className="text-lg font-black" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                📝 Examen Final Integrador de 4° Grado
              </h3>
              <p className="text-xs font-semibold opacity-90 max-w-md mx-auto">
                Evalúa todas las 15 unidades del año escolar: grandes números, operaciones, fracciones, geometría y estadística.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-amber-950">
                <span>Pregunta {examenCurQ + 1} de 5</span>
                <span>Aciertos: {examenScore}/5</span>
              </div>

              {!examenFinished ? (
                <>
                  <div className="text-sm font-black text-amber-950">
                    {examenCurQ === 0 && '1. En una biblioteca hay 24 estantes con 15 libros cada uno. ¿Cuántos libros hay en total?'}
                    {examenCurQ === 1 && '2. Si sumas 3/4 + 1/4 de pizza, ¿cuánta pizza tienes?'}
                    {examenCurQ === 2 && '3. ¿Cuál es el perímetro de un triángulo equilátero cuyos lados miden 12 cm cada uno?'}
                    {examenCurQ === 3 && '4. Si el promedio de calificaciones de 3 tareas es 4.0, ¿cuánto sumaron las 3 tareas?'}
                    {examenCurQ === 4 && '5. En un almacén empacan 720 pelotas en cajas de 8. ¿Cuántas cajas completas se obtienen?'}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      examenCurQ === 0 ? ['360', '320', '300', '400'] :
                      examenCurQ === 1 ? ['1 pizza entera', '2/4 de pizza', '4/8 de pizza', '1/2 pizza'] :
                      examenCurQ === 2 ? ['36 cm', '24 cm', '48 cm', '18 cm'] :
                      examenCurQ === 3 ? ['12.0', '10.0', '8.0', '15.0'] :
                      ['90 cajas', '80 cajas', '75 cajas', '95 cajas']
                    ][0].map((ansOpt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (idx === 0) setExamenScore((s) => s + 1);
                          if (examenCurQ + 1 < 5) {
                            setExamenCurQ((q) => q + 1);
                          } else {
                            setExamenFinished(true);
                            updateStats(100, 2, 200);
                          }
                        }}
                        className="p-3 bg-white border border-amber-200 rounded-xl font-black text-xs text-amber-900 hover:bg-amber-100 cursor-pointer"
                      >
                        {ansOpt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <span className="text-4xl block">🎓</span>
                  <div className="text-lg font-black text-amber-950">
                    ¡Examen Final Finalizado!
                  </div>
                  <div className="text-sm font-bold text-gray-700">
                    Puntaje obtenido: <b>{examenScore} de 5</b> aciertos. Recompensa otorgada: <b>+200 XP</b> y <b>+100 🪙</b>.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setExamenFinished(false);
                      setExamenCurQ(0);
                      setExamenScore(0);
                    }}
                    className="px-5 py-2.5 bg-amber-600 text-white font-black text-xs rounded-xl shadow cursor-pointer"
                  >
                    Presentar nuevamente
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ 14. MI REPASO ══ */}
        {activeTool === 'repaso' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl space-y-2">
              <h3 className="text-sm font-black text-blue-950">
                🔄 Repaso Inteligente y Adaptativo
              </h3>
              <p className="text-xs text-blue-800 leading-relaxed font-semibold">
                Este módulo reúne preguntas de repaso de las 15 unidades para reforzar conceptos antes de las evaluaciones de periodo.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { u: 'Unidad 1', tema: 'Multiplicación de dos y tres cifras', ok: true },
                { u: 'Unidad 2', tema: 'División exacta e inexacta', ok: true },
                { u: 'Unidad 3', tema: 'Múltiplos, Divisores, MCD y MCM', ok: false },
                { u: 'Unidad 4', tema: 'Fracciones equivalentes y operaciones', ok: false },
                { u: 'Unidad 5', tema: 'Perímetros y Áreas de cuadriláteros', ok: true },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-700">{item.u}</span>
                    <div className="text-xs font-bold text-gray-900">{item.tema}</div>
                  </div>
                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${item.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {item.ok ? 'Dominado' : 'Por repasar'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ 15. GUÍA DOCENTE ══ */}
        {activeTool === 'guia-docente' && (
          <div className="space-y-3 text-xs sm:text-sm font-semibold text-gray-800 leading-relaxed">
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl">
              <h4 className="font-black text-emerald-950 mb-1 text-base" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                👩‍🏫 Orientaciones Pedagógicas MEN (4° de Primaria)
              </h4>
              <p>
                El texto interactivo de 4° grado se alinea con los <b>Estándares Básicos de Competencias (EBC)</b> y los <b>Derechos Básicos de Aprendizaje (DBA)</b> expedidos por el Ministerio de Educación Nacional de Colombia.
              </p>
            </div>
            <div className="p-3.5 bg-white border border-gray-200 rounded-xl space-y-1">
              <div className="font-black text-gray-900 text-xs">Competencias Clave Desarrolladas:</div>
              <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                <li><b>Comunicación y modelación:</b> Capacidad de traducir situaciones verbales a expresiones aritméticas.</li>
                <li><b>Razonamiento y argumentación:</b> Justificación del procedimiento mediante propiedades numéricas.</li>
                <li><b>Resolución de problemas:</b> Aplicación en compras, presupuestos familiares y mediciones de entorno.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ══ 16. COLOR DEL LIBRO ══ */}
        {activeTool === 'color' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm font-bold text-gray-700">
              Elige el color de fondo para la experiencia de lectura e interacción:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'Galaxia Cósmica (Default)', bg: 'linear-gradient(135deg, #12082A 0%, #1E0F4A 40%, #0A1B40 100%)', text: '#fff' },
                { name: 'Blanco Puro', bg: '#FFFFFF', text: '#000', border: true },
                { name: 'Azul Espacial Claro', bg: '#E8F4FD', text: '#0369A1' },
                { name: 'Verde Menta Suave', bg: '#E8F5E9', text: '#15803D' },
                { name: 'Noche Oscura', bg: '#0A051B', text: '#fff' },
              ].map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (typeof document !== 'undefined') {
                      document.body.style.background = c.bg;
                    }
                    Swal.fire('Tema aplicado', `Fondo configurado a ${c.name}`, 'success');
                  }}
                  className="p-3.5 rounded-xl text-center font-black text-xs shadow-xs cursor-pointer border transition-transform hover:scale-102"
                  style={{
                    background: c.bg,
                    color: c.text,
                    borderColor: c.border ? '#ccc' : 'transparent'
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ 17. CURRÍCULO ══ */}
        {activeTool === 'curriculo' && (
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2">
              Referentes de calidad del Ministerio de Educación Nacional (Colombia) para el ciclo de 4° Grado:
            </p>
            <div className="space-y-2.5">
              {CURRICULO_BLOQUES.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border-2 transition-all"
                  style={{ background: b.claro, borderColor: b.color }}
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setCurriculoBloq(curriculoBloq === b.id ? null : b.id)}
                  >
                    <div className="font-black text-sm" style={{ color: b.color }}>
                      {b.icono} {b.nombre}
                    </div>
                    <span className="text-xs font-black" style={{ color: b.color }}>
                      {curriculoBloq === b.id ? '▲ Ocultar' : '▼ Ver estándares'}
                    </span>
                  </div>

                  {curriculoBloq === b.id && (
                    <ul className="mt-3 pl-4 list-disc space-y-1.5 text-xs text-gray-800 font-semibold border-t border-purple-200/60 pt-2.5">
                      {b.items.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
