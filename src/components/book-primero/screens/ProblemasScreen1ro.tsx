'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook1 } from '../context/Book1Context';
import { fedorTTS } from '@/services/tts.service';
import TopFeaturesSection1ro from '../shared/TopFeaturesSection1ro';

interface PcPracticeExercise {
  q: string;
  opts: string[];
  ans: string;
  op: string;
  mascot: string;
  hint: string;
  pts: number;
}

const PC_PRACTICE_EXERCISES: PcPracticeExercise[] = [
  { q: 'Compras un cuaderno de $1.500 y un lápiz de $500. ¿Cuánto pagas en total?', opts: ['$1.800', '$2.000', '$1.500', '$2.500'], ans: '$2.000', op: 'Suma', mascot: '🛒', hint: 'Suma los dos precios: $1.500 + $500.', pts: 80 },
  { q: 'Tienes 4 monedas de $200 y 3 monedas de $100. ¿Cuánto dinero tienes?', opts: ['$1.100', '$700', '$1.000', '$900'], ans: '$1.100', op: 'Suma', mascot: '🪙', hint: 'Multiplica primero: 4×200 + 3×100 luego suma.', pts: 80 },
  { q: 'Una pizza cuesta $8.000 y un refresco $2.000. ¿Cuánto cuesta todo junto?', opts: ['$9.000', '$10.000', '$11.000', '$12.000'], ans: '$10.000', op: 'Suma', mascot: '🍕', hint: 'Pizza + refresco: $8.000 + $2.000.', pts: 80 },
  { q: 'Tus padres te dan $3.000 y tu tía $5.000. ¿Cuánto dinero recibiste?', opts: ['$7.000', '$8.000', '$6.000', '$9.000'], ans: '$8.000', op: 'Suma', mascot: '🎁', hint: 'Recibiste regalos: súmalos juntos.', pts: 80 },
  { q: 'En la tienda compras un jugo $700, galletas $1.500 y un helado $1.800. ¿Cuánto gastaste?', opts: ['$3.500', '$4.000', '$4.500', '$3.800'], ans: '$4.000', op: 'Suma', mascot: '🥤', hint: 'Suma los tres precios.', pts: 80 },
  { q: 'Pagas $2.000 por un dulce que cuesta $1.300. ¿Cuánto te devuelven de vuelto?', opts: ['$300', '$500', '$700', '$900'], ans: '$700', op: 'Resta', mascot: '💵', hint: 'Resta lo que pagaste menos lo que costó.', pts: 95 },
  { q: 'Tenías $5.000 y gastaste $2.400 en la merienda. ¿Cuánto te queda?', opts: ['$2.600', '$2.400', '$3.000', '$2.800'], ans: '$2.600', op: 'Resta', mascot: '💰', hint: 'Resta lo que tenías menos lo que gastaste.', pts: 95 },
  { q: 'Un libro cuesta $9.500 y solo tienes $7.000. ¿Cuánto te falta?', opts: ['$2.000', '$2.500', '$3.000', '$1.500'], ans: '$2.500', op: 'Resta', mascot: '📚', hint: 'Diferencia entre precio y dinero que tienes.', pts: 95 },
  { q: 'Tu mamá te dio $10.000 y compraste útiles por $6.300. ¿Cuánto sobra?', opts: ['$3.700', '$4.000', '$3.500', '$4.300'], ans: '$3.700', op: 'Resta', mascot: '🎀', hint: 'Resta lo gastado al dinero total.', pts: 95 },
  { q: 'Una camiseta cuesta $15.000 con descuento queda en $11.500. ¿Cuánto descontaron?', opts: ['$2.500', '$3.000', '$3.500', '$4.000'], ans: '$3.500', op: 'Resta', mascot: '👕', hint: 'Diferencia entre precio original y precio rebajado.', pts: 95 },
  { q: 'Cada banano cuesta $300. Si compras 5 bananos, ¿cuánto pagas?', opts: ['$1.500', '$1.800', '$1.200', '$2.000'], ans: '$1.500', op: 'Multiplicación', mascot: '🍎', hint: 'Multiplica el precio por la cantidad.', pts: 110 },
  { q: 'Una bolsa de papas cuesta $2.500. Si compras 3 bolsas, ¿cuánto pagas?', opts: ['$6.500', '$7.500', '$5.000', '$8.000'], ans: '$7.500', op: 'Multiplicación', mascot: '🥔', hint: 'Multiplica precio × cantidad.', pts: 110 },
  { q: 'Cada pasaje de bus cuesta $900. ¿Cuánto pagan 4 personas?', opts: ['$3.600', '$2.700', '$4.500', '$3.000'], ans: '$3.600', op: 'Multiplicación', mascot: '🚌', hint: 'Precio del pasaje × número de personas.', pts: 110 },
  { q: 'Una caja de chocolates trae 6 dulces. Si compras 4 cajas, ¿cuántos dulces tienes?', opts: ['10', '24', '12', '20'], ans: '24', op: 'Multiplicación', mascot: '🍫', hint: 'Multiplica chocolates por cajas.', pts: 110 },
  { q: 'Cada lápiz cuesta $400. Compras 7 lápices para el colegio. ¿Cuánto pagas?', opts: ['$2.400', '$3.200', '$2.800', '$3.500'], ans: '$2.800', op: 'Multiplicación', mascot: '✏️', hint: 'Multiplica precio × cantidad de lápices.', pts: 110 },
  { q: 'Tienes $1.200 y los repartes en partes iguales entre 4 amigos. ¿Cuánto recibe cada uno?', opts: ['$300', '$400', '$200', '$500'], ans: '$300', op: 'División', mascot: '🍪', hint: 'Divide el total entre los amigos.', pts: 125 },
  { q: 'Una pizza de $8.000 se paga entre 4 amigos por igual. ¿Cuánto pone cada uno?', opts: ['$1.500', '$2.000', '$2.500', '$1.000'], ans: '$2.000', op: 'División', mascot: '🍕', hint: 'Divide el precio entre el número de personas.', pts: 125 },
  { q: 'Tu mamá te dio $5.000 para repartir entre 5 hermanos. ¿Cuánto le toca a cada uno?', opts: ['$500', '$1.000', '$2.000', '$1.500'], ans: '$1.000', op: 'División', mascot: '👨‍👩‍👧‍👦', hint: 'Divide entre los hermanos.', pts: 125 },
  { q: '15 caramelos se reparten en 3 bolsas iguales. ¿Cuántos caramelos van en cada bolsa?', opts: ['3', '5', '4', '6'], ans: '5', op: 'División', mascot: '🍬', hint: 'Divide caramelos entre bolsas.', pts: 125 },
  { q: 'Vendieron 20 cupcakes y juntaron $10.000. ¿Cuánto costó cada cupcake?', opts: ['$300', '$500', '$700', '$400'], ans: '$500', op: 'División', mascot: '🧁', hint: 'Divide total ganado entre cantidad vendida.', pts: 125 },
];

interface ProblemItem {
  id: string;
  icon: string;
  title: string;
  enun: string;
  op: string;
  viz: string;
  ans: string;
  calc: string;
  bills?: string[];
  coins?: string[];
}

interface LevelData {
  levelNum: number;
  title: string;
  guide: ProblemItem;
  exercises: ProblemItem[];
}

const NIVELES_PROBLEMAS: LevelData[] = [
  {
    levelNum: 1,
    title: 'Nivel 1 — Conteo y Compras ($100 a $1.000)',
    guide: {
      id: 'g1',
      icon: '🛒',
      title: '★ EJEMPLO GUÍA',
      enun: 'Quieres comprar una manzana que cuesta $450. Si pagas con un billete de $1000, ¿cuánto dinero te deben devolver?',
      op: 'Sustracción (1000 − 450)',
      viz: 'Escena Pixar 3D: mostrador brillante. Producto: 1 manzana roja con etiqueta "$450". Dinero: 1 billete azul-dorado "$1000" entregándose en la caja. Solución visual: 1 moneda dorada "$500" + 1 moneda plateada "$50" como vuelto.',
      ans: '$550',
      calc: '(1000 − 450 = 550)',
      bills: ['$1,000'],
      coins: ['$500', '$50'],
    },
    exercises: [
      {
        id: 'n1-e1',
        icon: '🍎',
        title: 'Ejercicio 1',
        enun: 'Compras una manzana $300 y un pan $200. ¿Cuánto pagas en total?',
        op: 'Suma (300 + 200)',
        viz: '1 manzana roja "$300" + 1 pan dorado "$200" sobre mostrador Pixar 3D.',
        ans: '$500',
        calc: '(300 + 200 = 500)',
        coins: ['$300', '$200'],
      },
      {
        id: 'n1-e2',
        icon: '🥛',
        title: 'Ejercicio 2',
        enun: 'Tienes 1 billete de $500 y 2 monedas de $100. ¿Cuánto dinero tienes?',
        op: 'Suma (500 + 100 + 100)',
        viz: '1 billete azul-dorado "$500" + 2 monedas doradas brillantes "$100" cada una.',
        ans: '$700',
        calc: '(500 + 200 = 700)',
        bills: ['$500'],
        coins: ['$100', '$100'],
      },
      {
        id: 'n1-e3',
        icon: '🍫',
        title: 'Ejercicio 3',
        enun: 'Compras un chocolate que cuesta $400 con un billete de $1.000. ¿Cuánto te devuelven?',
        op: 'Sustracción (1000 − 400)',
        viz: '1 chocolate brillante "$400" + 1 billete plateado "$1.000". Vuelto: 1 moneda "$500" + 1 moneda "$100".',
        ans: '$600',
        calc: '(1000 − 400 = 600)',
        bills: ['$1,000'],
        coins: ['$500', '$100'],
      },
      {
        id: 'n1-e4',
        icon: '🍬',
        title: 'Ejercicio 4',
        enun: 'Tienes $800 y gastas $250 en dulces. ¿Cuánto te queda?',
        op: 'Sustracción (800 − 250)',
        viz: 'Dulces vibrantes con etiqueta "$250" + 1 billete plateado "$500" + 3 monedas doradas "$100".',
        ans: '$550',
        calc: '(800 − 250 = 550)',
        bills: ['$500'],
        coins: ['$100', '$100', '$100'],
      },
      {
        id: 'n1-e5',
        icon: '🍭',
        title: 'Ejercicio 5',
        enun: 'Compras 4 paletas a $150 cada una. ¿Cuánto pagas?',
        op: 'Multiplicación (4 × 150)',
        viz: '4 paletas Pixar coloridas con etiqueta "$150 c/u".',
        ans: '$600',
        calc: '(4 × 150 = 600)',
        coins: ['$150', '$150', '$150', '$150'],
      },
      {
        id: 'n1-e6',
        icon: '🪙',
        title: 'Ejercicio 6',
        enun: 'Tienes 5 monedas de $200. ¿Cuánto dinero tienes?',
        op: 'Multiplicación (5 × 200)',
        viz: '5 monedas doradas brillantes en fila perfecta.',
        ans: '$1.000',
        calc: '(5 × 200 = 1000)',
        coins: ['$200', '$200', '$200', '$200', '$200'],
      },
      {
        id: 'n1-e7',
        icon: '🍪',
        title: 'Ejercicio 7',
        enun: 'Repartes $600 entre 3 amigos en partes iguales. ¿Cuánto recibe cada uno?',
        op: 'División (600 ÷ 3)',
        viz: '3 amigos sonrientes Pixar con 1 billete plateado "$200" cada uno.',
        ans: '$200',
        calc: '(600 ÷ 3 = 200)',
        bills: ['$200'],
      },
      {
        id: 'n1-e8',
        icon: '🥖',
        title: 'Ejercicio 8',
        enun: 'Compras 2 panes iguales por $400 en total. ¿Cuánto cuesta cada pan?',
        op: 'División (400 ÷ 2)',
        viz: '2 panes idénticos dorados + 2 monedas "$200" sobre el mostrador.',
        ans: '$200',
        calc: '(400 ÷ 2 = 200)',
        coins: ['$200', '$200'],
      },
      {
        id: 'n1-e9',
        icon: '💰',
        title: 'Ejercicio 9',
        enun: 'Cuenta tu dinero: 3 billetes de $200 y 4 monedas de $100.',
        op: 'Suma (3 × 200 + 4 × 100)',
        viz: '3 billetes azul-dorados "$200" + 4 monedas doradas "$100" en composición Pixar.',
        ans: '$1.000',
        calc: '(600 + 400 = 1000)',
        bills: ['$200', '$200', '$200'],
        coins: ['$100', '$100', '$100', '$100'],
      },
      {
        id: 'n1-e10',
        icon: '🛒',
        title: 'Ejercicio 10',
        enun: 'Compras leche $300 y huevos $400. Pagas con $1.000. ¿Cuánto te dan de vuelto?',
        op: 'Suma + Sustracción (300+400; 1000−700)',
        viz: '1 cartón de leche "$300" + 1 caja huevos "$400" + 1 billete "$1.000". Vuelto: 1 moneda "$200" + 1 moneda "$100".',
        ans: '$300',
        calc: '(1000 − 700 = 300)',
        bills: ['$1,000'],
        coins: ['$200', '$100'],
      },
    ],
  },
  {
    levelNum: 2,
    title: 'Nivel 2 — Conteo y Compras ($100 a $2.000)',
    guide: {
      id: 'g2',
      icon: '📚',
      title: '★ EJEMPLO GUÍA',
      enun: 'Compras un cuaderno que cuesta $1.200 y pagas con 2 billetes de $1000. ¿Cuánto te dan de vuelto?',
      op: 'Suma + Sustracción (1000+1000 = 2000; 2000 − 1200)',
      viz: 'Escena Pixar 3D: librería pulida y amable. Producto: 1 cuaderno con etiqueta "$1.200". Dinero: 2 billetes azul-dorados "$1000" cada uno. Vuelto: 1 billete plateado "$500" + 1 moneda dorada "$200" + 1 moneda "$100".',
      ans: '$800',
      calc: '(2000 − 1200 = 800)',
      bills: ['$1,000', '$1,000', '$500'],
      coins: ['$200', '$100'],
    },
    exercises: [
      {
        id: 'n2-e1',
        icon: '📓',
        title: 'Ejercicio 1',
        enun: 'Tienes 2 billetes de $1.000. ¿Cuánto dinero tienes?',
        op: 'Suma (1000 + 1000)',
        viz: '2 billetes azul-dorados "$1.000" alineados con resplandor Pixar.',
        ans: '$2.000',
        calc: '(1000 + 1000 = 2000)',
        bills: ['$1,000', '$1,000'],
      },
      {
        id: 'n2-e2',
        icon: '🧁',
        title: 'Ejercicio 2',
        enun: 'Pagas $1.500 con un billete de $2.000. ¿Cuánto te devuelven?',
        op: 'Sustracción (2000 − 1500)',
        viz: '1 cupcake brillante "$1.500" + 1 billete plateado "$2.000". Vuelto: 1 billete "$500".',
        ans: '$500',
        calc: '(2000 − 1500 = 500)',
        bills: ['$2,000', '$500'],
      },
      {
        id: 'n2-e3',
        icon: '🎈',
        title: 'Ejercicio 3',
        enun: 'Compras 4 globos a $400 cada uno. ¿Cuánto pagas en total?',
        op: 'Multiplicación (4 × 400)',
        viz: '4 globos vibrantes Pixar elevándose con etiqueta "$400 c/u".',
        ans: '$1.600',
        calc: '(4 × 400 = 1600)',
        coins: ['$400', '$400', '$400', '$400'],
      },
      {
        id: 'n2-e4',
        icon: '🍦',
        title: 'Ejercicio 4',
        enun: 'Repartes $1.800 entre 6 niños en partes iguales. ¿Cuánto recibe cada uno?',
        op: 'División (1800 ÷ 6)',
        viz: '6 niños sonrientes Pixar 3D, cada uno con 1 billete "$300".',
        ans: '$300',
        calc: '(1800 ÷ 6 = 300)',
        bills: ['$300'],
      },
      {
        id: 'n2-e5',
        icon: '🛍️',
        title: 'Ejercicio 5',
        enun: 'Compras dulce $700 y juguete $800. ¿Total a pagar?',
        op: 'Suma (700 + 800)',
        viz: '1 bolsa dulces "$700" + 1 juguete brillante "$800" sobre mostrador.',
        ans: '$1.500',
        calc: '(700 + 800 = 1500)',
        coins: ['$700', '$800'],
      },
    ],
  },
];

/** Componente de Moneda circular */
function SvgCoin({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FFE066, #FFB703)',
        border: '2px solid #B45309',
        boxShadow: '0 3px 8px rgba(180, 83, 9, 0.35)',
        color: '#7A3200',
        fontWeight: 900,
        fontSize: '11px',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {label}
    </div>
  );
}

/** Componente de Billete rectangular */
function SvgBill({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px 12px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #34D399, #059669)',
        border: '2px solid #065F46',
        boxShadow: '0 3px 8px rgba(6, 95, 70, 0.35)',
        color: '#ffffff',
        fontWeight: 900,
        fontSize: '11.5px',
        fontFamily: "'Nunito', sans-serif",
        letterSpacing: '0.02em',
      }}
    >
      💵 {label}
    </div>
  );
}

/** Botón circular cyan de audio con sintetizador TTS */
function CyanAudioBtn({
  text,
  size = 32,
  fontSize = 14,
  title = 'Escuchar',
}: {
  text: string;
  size?: number;
  fontSize?: number;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        fedorTTS.speak(text);
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${fontSize}px`,
        color: '#ffffff',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(6, 182, 212, 0.45)',
        flexShrink: 0,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        lineHeight: 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.12)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(6, 182, 212, 0.45)';
      }}
      title={title}
      aria-label={title}
    >
      🔊
    </button>
  );
}

export default function ProblemasScreen1ro() {
  const { goScreen, grantReward } = useBook1();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showPractice, setShowPractice] = useState(false);

  // Estados del motor interactivo de 20 preguntas
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [tLeft, setTLeft] = useState(30);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Iniciar práctica interactiva de los 20 problemas
  const handleStartPractice = () => {
    setQIdx(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTLeft(30);
    setSelectedOpt(null);
    setAnswered(false);
    setShowHint(false);
    setFinished(false);
    setShowPractice(true);
  };

  const handleClosePractice = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowPractice(false);
  };

  // Temporizador de 30 segundos
  useEffect(() => {
    if (!showPractice || finished || answered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showPractice, qIdx, answered, finished]);

  // Al cambiar de pregunta, narrar automáticamente el enunciado
  useEffect(() => {
    if (showPractice && !finished && PC_PRACTICE_EXERCISES[qIdx]) {
      fedorTTS.speak(PC_PRACTICE_EXERCISES[qIdx].q);
    }
  }, [showPractice, qIdx, finished]);

  const handleTimeExpired = () => {
    setAnswered(true);
    setWrongCount((w) => w + 1);
    fedorTTS.speak('¡Se agotó el tiempo! Veamos la respuesta correcta.');
  };

  const handleSelectOption = (optIdx: number) => {
    if (answered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOpt(optIdx);
    setAnswered(true);

    const currentEx = PC_PRACTICE_EXERCISES[qIdx];
    const isCorrect = currentEx.opts[optIdx] === currentEx.ans;

    if (isCorrect) {
      const earned = Math.max(20, currentEx.pts - (30 - tLeft) * 2);
      setScore((s) => s + earned);
      setCorrectCount((c) => c + 1);
      fedorTTS.speak(`¡Excelente! Respuesta correcta.`);
    } else {
      setWrongCount((w) => w + 1);
      fedorTTS.speak(`Oh no, la respuesta correcta es: ${currentEx.ans}`);
    }
  };

  const handleNextQuestion = () => {
    if (qIdx + 1 >= PC_PRACTICE_EXERCISES.length) {
      setFinished(true);
      grantReward(score, Math.round(score / 5));
    } else {
      setQIdx((prev) => prev + 1);
      setTLeft(30);
      setSelectedOpt(null);
      setAnswered(false);
      setShowHint(false);
    }
  };

  const currentEx = PC_PRACTICE_EXERCISES[qIdx];

  return (
    <div
      style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '1.25rem 1rem 3rem',
        fontFamily: "'Nunito', sans-serif",
        textAlign: 'left',
      }}
    >
      {/* Secciones superiores: Definiciones FEDOR, Estándares MEN, Problemas Cotidianos */}
      <TopFeaturesSection1ro />

      {/* Botón Volver al inicio */}
      <div
        onClick={() => goScreen('home')}
        style={{
          cursor: 'pointer',
          fontWeight: 900,
          color: '#6C28B4',
          fontSize: '14px',
          marginBottom: '1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(-3px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
      >
        ← Volver al inicio
      </div>

      {/* ════ HERO BANNER VERDE ESMERALDA (Imagen Problemas Cotidianos) ════ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0A5C44, #16876A, #24C496)',
          borderRadius: '24px',
          padding: '1.75rem 1.5rem',
          color: '#ffffff',
          marginBottom: '1.25rem',
          boxShadow: '0 10px 30px rgba(22, 135, 106, 0.28)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: '32px',
              fontWeight: 900,
              margin: 0,
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span>🛒</span>
            <span>Problemas Cotidianos</span>
          </h1>
          <CyanAudioBtn text="Problemas Cotidianos. Conteo y compras con billetes, monedas y productos." />
        </div>

        <div
          style={{
            marginTop: '0.4rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 900,
              color: '#FFE066',
              letterSpacing: '0.02em',
            }}
          >
            Conteo y compras con billetes, monedas y productos
          </span>
          <CyanAudioBtn text="Conteo y compras con billetes, monedas y productos." />
        </div>
      </div>

      {/* ════ CARD BANNER PRÁCTICA (20 Ejercicios Interactivos) ════ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0A5C44, #16876A, #24C496)',
          borderRadius: '20px',
          padding: '1.5rem 1.25rem',
          color: '#ffffff',
          marginBottom: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(10, 92, 68, 0.25)',
        }}
      >
        <h2
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '22px',
            fontWeight: 900,
            margin: '0 0 6px',
            color: '#ffffff',
          }}
        >
          📝 Practica 20 ejercicios interactivos
        </h2>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 700,
            margin: '0 0 14px',
            color: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          Selección múltiple · 4 opciones · puntuación · tiempo · sonidos y efectos
        </p>
        <button
          type="button"
          onClick={handleStartPractice}
          style={{
            background: '#ffffff',
            color: '#0A5C44',
            fontWeight: 900,
            fontSize: '15px',
            border: 'none',
            borderRadius: '99px',
            padding: '11px 28px',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.18)',
            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            fontFamily: "'Nunito', sans-serif",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          🚀 ¡Empezar!
        </button>
      </div>

      {/* ════ NIVELES PEDAGÓGICOS (EJEMPLOS GUÍA Y EJERCICIOS) ════ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {NIVELES_PROBLEMAS.map((nivel) => (
          <div key={nivel.levelNum} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Barra de Título del Nivel */}
            <div
              style={{
                background: '#F0FDF4',
                border: '2px solid #16876A',
                borderRadius: '16px',
                padding: '12px 18px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(22, 135, 106, 0.08)',
              }}
            >
              <h2
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#0E5240',
                  margin: 0,
                }}
              >
                {nivel.title}
              </h2>
            </div>

            {/* Tarjeta de Ejemplo Guía */}
            <div
              style={{
                background: '#FFFDF0',
                border: '2px solid #F59E0B',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: '17px',
                  fontWeight: 900,
                  color: '#7A3200',
                  marginBottom: '12px',
                }}
              >
                <span>{nivel.guide.icon}</span>
                <span>{nivel.guide.title}</span>
              </div>

              {/* 1. ENUNCIADO */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: '#7A7299',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    marginBottom: '4px',
                  }}
                >
                  📝 ENUNCIADO
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#1A0A3C',
                    lineHeight: 1.45,
                  }}
                >
                  <span>{nivel.guide.enun}</span>
                  <CyanAudioBtn text={nivel.guide.enun} size={28} fontSize={13} />
                </div>
              </div>

              {/* 2. OPERACIÓN */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: '#7A7299',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    marginBottom: '4px',
                  }}
                >
                  ➗ OPERACIÓN
                </div>
                <div
                  style={{
                    background: '#FEF3C7',
                    borderLeft: '5px solid #F59E0B',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontSize: '14.5px',
                    fontWeight: 800,
                    color: '#7A3200',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span>{nivel.guide.op}</span>
                  <CyanAudioBtn text={nivel.guide.op} size={26} fontSize={12} />
                </div>
              </div>

              {/* 3. REPRESENTACIÓN GRÁFICA */}
              <div style={{ marginBottom: '14px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: '#7A7299',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    marginBottom: '4px',
                  }}
                >
                  🎨 REPRESENTACIÓN GRÁFICA
                </div>
                <div
                  style={{
                    background: '#E0F2FE',
                    border: '1.5px solid #7DD3FC',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '13.5px',
                    lineHeight: 1.45,
                    color: '#0369A1',
                    fontWeight: 600,
                  }}
                >
                  <div style={{ marginBottom: '10px' }}>{nivel.guide.viz}</div>

                  {/* Monedas y Billetes ilustrados */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {nivel.guide.bills?.map((b, i) => (
                      <SvgBill key={i} label={b} />
                    ))}
                    {nivel.guide.coins?.map((c, i) => (
                      <SvgCoin key={i} label={c} />
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. RESPUESTA */}
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: '#7A7299',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    marginBottom: '4px',
                  }}
                >
                  ✅ RESPUESTA
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#DCF5EE',
                    borderLeft: '5px solid #16876A',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    fontSize: '15px',
                    fontWeight: 900,
                    color: '#074F3A',
                  }}
                >
                  <span>{nivel.guide.ans}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#16876A' }}>
                    {nivel.guide.calc}
                  </span>
                  <CyanAudioBtn
                    text={`Respuesta: ${nivel.guide.ans}, cálculo: ${nivel.guide.calc}`}
                    size={26}
                    fontSize={12}
                  />
                </div>
              </div>
            </div>

            {/* Tarjetas de Ejercicios del Nivel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {nivel.exercises.map((ex) => (
                <div
                  key={ex.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1.5px solid #E5E7EB',
                    padding: '1.25rem 1.4rem',
                    boxShadow: '0 3px 12px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Baloo 2', sans-serif",
                        fontSize: '17px',
                        fontWeight: 900,
                        color: '#0E5240',
                      }}
                    >
                      <span>{ex.icon} </span>
                      <span>{ex.title}: </span>
                      <span style={{ color: '#1F2937' }}>{ex.enun}</span>
                    </div>
                    <CyanAudioBtn text={`${ex.title}: ${ex.enun}`} size={28} fontSize={13} />
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#6B7280' }}>
                      Operación sugerida:{' '}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 900,
                        color: '#0E5240',
                        background: '#F0FDF4',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {ex.op}
                    </span>
                  </div>

                  {/* Monedas y Billetes ilustrados si los tiene */}
                  {(ex.bills || ex.coins) && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {ex.bills?.map((b, i) => (
                        <SvgBill key={i} label={b} />
                      ))}
                      {ex.coins?.map((c, i) => (
                        <SvgCoin key={i} label={c} />
                      ))}
                    </div>
                  )}

                  {/* Botón Ver Respuesta */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [ex.id]: !prev[ex.id],
                      }))
                    }
                    style={{
                      padding: '8px 18px',
                      background: 'linear-gradient(135deg, #16876A, #34D399)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: '0 3px 10px rgba(22, 135, 106, 0.35)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: "'Nunito', sans-serif",
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <span>💡</span>
                    <span>{expanded[ex.id] ? 'Ocultar respuesta' : 'Ver respuesta'}</span>
                  </button>

                  {expanded[ex.id] && (
                    <div
                      style={{
                        marginTop: '0.85rem',
                        padding: '0.85rem 1.15rem',
                        background: '#DCF5EE',
                        borderLeft: '5px solid #16876A',
                        borderRadius: '12px',
                        fontSize: '14.5px',
                        fontWeight: 800,
                        color: '#074F3A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <span>✅ Respuesta: </span>
                        <strong>{ex.ans}</strong>
                        <span style={{ marginLeft: '8px', opacity: 0.9 }}>{ex.calc}</span>
                      </div>
                      <CyanAudioBtn
                        text={`Respuesta: ${ex.ans}, ${ex.calc}`}
                        size={26}
                        fontSize={12}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ════ MODAL MOTOR INTERACTIVO: 20 PROBLEMAS (pcpOverlay) ════ */}
      {showPractice && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(14, 8, 48, 0.88)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
          onClick={handleClosePractice}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '560px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)',
              position: 'relative',
              maxHeight: '92vh',
              overflowY: 'auto',
              fontFamily: "'Nunito', sans-serif",
              textAlign: 'left',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar (X) */}
            <button
              type="button"
              onClick={handleClosePractice}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: '#FEE2E8',
                border: 'none',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer',
                fontWeight: 900,
                color: '#A30041',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Cerrar práctica"
            >
              ✕
            </button>

            {!finished ? (
              <div>
                {/* Cabecera del Quiz */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '10px',
                    paddingRight: '36px',
                  }}
                >
                  <span
                    style={{
                      background: '#DCF5EE',
                      color: '#074F3A',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 900,
                    }}
                  >
                    🛒 Ejercicio {qIdx + 1} / {PC_PRACTICE_EXERCISES.length}
                  </span>

                  <span
                    style={{
                      background: tLeft <= 5 ? '#FEE2E8' : '#F3E8FF',
                      color: tLeft <= 5 ? '#DC2626' : '#6C28B4',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    ⏱️ {tLeft}s
                  </span>

                  <span
                    style={{
                      background: '#FEF3C7',
                      color: '#B45309',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 900,
                    }}
                  >
                    ⭐ {score} pts
                  </span>
                </div>

                {/* Barra de progreso */}
                <div
                  style={{
                    height: '8px',
                    background: '#F1EFE8',
                    borderRadius: '99px',
                    overflow: 'hidden',
                    marginBottom: '14px',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #16876A, #34D399)',
                      width: `${Math.round((qIdx / PC_PRACTICE_EXERCISES.length) * 100)}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>

                {/* Badge de Operación */}
                <div style={{ marginBottom: '8px' }}>
                  <span
                    style={{
                      background:
                        currentEx.op === 'Suma'
                          ? '#16876A'
                          : currentEx.op === 'Resta'
                          ? '#C94B22'
                          : currentEx.op === 'Multiplicación'
                          ? '#7B2FBE'
                          : '#0E6BA8',
                      color: '#ffffff',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 900,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{currentEx.mascot}</span>
                    <span>{currentEx.op}</span>
                  </span>
                </div>

                {/* Enunciado de la Pregunta */}
                <div
                  style={{
                    background: '#F0FDF4',
                    borderLeft: '5px solid #16876A',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#0A3D28',
                    lineHeight: 1.4,
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <span>{currentEx.q}</span>
                  <CyanAudioBtn text={currentEx.q} size={30} fontSize={14} />
                </div>

                {/* Grilla 2x2 de Opciones */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '14px',
                  }}
                >
                  {currentEx.opts.map((opt, i) => {
                    const isSelected = selectedOpt === i;
                    const isCorrect = opt === currentEx.ans;

                    let bg = '#FFFFFF';
                    let borderCol = '#C5BFEE';
                    let textCol = '#3D1468';

                    if (answered) {
                      if (isCorrect) {
                        bg = '#16876A';
                        borderCol = '#0E5240';
                        textCol = '#FFFFFF';
                      } else if (isSelected) {
                        bg = '#C94B22';
                        borderCol = '#7A1B00';
                        textCol = '#FFFFFF';
                      }
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={answered}
                        onClick={() => handleSelectOption(i)}
                        style={{
                          background: bg,
                          border: `2px solid ${borderCol}`,
                          color: textCol,
                          padding: '14px 12px',
                          borderRadius: '14px',
                          fontSize: '15px',
                          fontWeight: 900,
                          cursor: answered ? 'default' : 'pointer',
                          fontFamily: "'Nunito', sans-serif",
                          transition: 'all 0.18s ease',
                          textAlign: 'center',
                        }}
                        onMouseEnter={(e) => {
                          if (!answered) {
                            e.currentTarget.style.background = '#EEEDFE';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!answered) {
                            e.currentTarget.style.background = bg;
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Botón Pista */}
                <div style={{ marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowHint((h) => !h)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0E5240',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>💡</span>
                    <span>{showHint ? 'Ocultar pista' : 'Ver pista didáctica'}</span>
                  </button>

                  {showHint && (
                    <div
                      style={{
                        marginTop: '6px',
                        padding: '8px 12px',
                        background: '#FFF8E0',
                        borderLeft: '4px solid #F5C518',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#7A3200',
                      }}
                    >
                      {currentEx.hint}
                    </div>
                  )}
                </div>

                {/* Feedback y Botón Siguiente */}
                {answered && (
                  <div style={{ animation: 'popIn 0.25s ease' }}>
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: 900,
                        marginBottom: '10px',
                        background: selectedOpt !== null && currentEx.opts[selectedOpt] === currentEx.ans
                          ? '#DCF5EE'
                          : '#FEE2E8',
                        color: selectedOpt !== null && currentEx.opts[selectedOpt] === currentEx.ans
                          ? '#074F3A'
                          : '#A30041',
                      }}
                    >
                      {selectedOpt !== null && currentEx.opts[selectedOpt] === currentEx.ans
                        ? '🎉 ¡Muy bien hecho! Respuesta correcta.'
                        : `❌ Respuesta correcta: ${currentEx.ans}`}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0E5240',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '14px',
                        fontSize: '15px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        fontFamily: "'Nunito', sans-serif",
                        boxShadow: '0 4px 12px rgba(14, 82, 64, 0.35)',
                      }}
                    >
                      {qIdx + 1 >= PC_PRACTICE_EXERCISES.length
                        ? '🏆 Ver resultados finales'
                        : 'Siguiente ejercicio →'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Pantalla de Resultados Finales */
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '64px', marginBottom: '8px', lineHeight: 1 }}>
                  {correctCount >= 18
                    ? '🥇'
                    : correctCount >= 14
                    ? '🏅'
                    : correctCount >= 10
                    ? '⭐'
                    : '💪'}
                </div>
                <h3
                  style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    fontSize: '24px',
                    fontWeight: 900,
                    color: '#0E5240',
                    margin: '0 0 4px',
                  }}
                >
                  ¡Completaste los 20 Problemas!
                </h3>
                <p style={{ fontSize: '14px', color: '#16876A', fontWeight: 700, margin: '0 0 14px' }}>
                  Has practicado el cálculo y compra con billetes y monedas.
                </p>

                <div
                  style={{
                    fontSize: '44px',
                    fontWeight: 900,
                    color: '#16876A',
                    fontFamily: "'Baloo 2', sans-serif",
                    marginBottom: '14px',
                  }}
                >
                  {score} pts
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      background: '#DCF5EE',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#074F3A',
                    }}
                  >
                    ✅ Correctas: {correctCount}
                  </div>
                  <div
                    style={{
                      background: '#FEE2E8',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#A30041',
                    }}
                  >
                    ❌ Errores: {wrongCount}
                  </div>
                  <div
                    style={{
                      background: '#FEF3C7',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#B45309',
                    }}
                  >
                    🎯 Precisión: {Math.round((correctCount / PC_PRACTICE_EXERCISES.length) * 100)}%
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleStartPractice}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#16876A',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '14px',
                      fontSize: '14px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(22, 135, 106, 0.35)',
                    }}
                  >
                    🔄 Intentar de nuevo
                  </button>
                  <button
                    type="button"
                    onClick={handleClosePractice}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#0E5240',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '14px',
                      fontSize: '14px',
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    ✅ Finalizar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
