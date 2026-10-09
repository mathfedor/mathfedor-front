'use client';

import React, { useState, useEffect } from 'react';
import { useBook4 } from '../context/Book4Context';

export interface FinalExamQuestion {
  id: number;
  cat: string;
  ctx: string;
  q: string;
  opts: string[];
  ans: string;
  hasModel?: boolean;
  modelTitle?: string;
  gridTop?: string[];
  gridMultiplier?: string;
}

export const EXAM_POOL_4TO: FinalExamQuestion[] = [
  // Pregunta 1: IDÉNTICA A LA IMAGEN 2
  {
    id: 1,
    cat: 'Problemas Numéricos SABER',
    ctx: 'Leo juega en el parque con sus amigos. En el tema "Problemas Numéricos SABER" resuelve:',
    q: '¿Cuál es el triple de 1194?',
    opts: ['3582', '3579', '3572', '3580'],
    ans: '3582',
    hasModel: true,
    modelTitle: 'Modelo de área 1.194 × 3 por partes',
    gridTop: ['1.000', '100', '90', '4'],
    gridMultiplier: '3',
  },
  {
    id: 2,
    cat: 'Fracciones y Decimales',
    ctx: 'En el laboratorio escolar se combinan reactivos en recipientes graduados:',
    q: '¿Cuál es el resultado de 3/4 + 2/8?',
    opts: ['1', '5/12', '5/8', '6/12'],
    ans: '1',
  },
  {
    id: 3,
    cat: 'Multiplicación y División',
    ctx: 'Una fábrica empaqueta 2.400 lápices en cajas de 12 unidades cada una:',
    q: '¿Cuántas cajas completas se obtienen?',
    opts: ['200', '240', '180', '220'],
    ans: '200',
  },
  {
    id: 4,
    cat: 'Geometría y Medición',
    ctx: 'Un terreno rectangular para huerta escolar mide 15 m de largo por 8 m de ancho:',
    q: '¿Cuál es el perímetro total del terreno?',
    opts: ['46 m', '120 m', '23 m', '60 m'],
    ans: '46 m',
  },
  {
    id: 5,
    cat: 'Pensamiento Aleatorio y Datos',
    ctx: 'En una encuesta de lectura, 15 niños leyeron 2 libros, 10 leyeron 3 y 5 leyeron 4:',
    q: '¿Cuántos niños participaron en total en la encuesta?',
    opts: ['30 niños', '35 niños', '25 niños', '20 niños'],
    ans: '30 niños',
  },
  {
    id: 6,
    cat: 'Problemas Numéricos SABER',
    ctx: 'Sofía ahorra $1.250 cada semana durante 6 semanas seguidas:',
    q: '¿Cuánto dinero ahorró en total?',
    opts: ['$7.500', '$6.250', '$8.000', '$7.200'],
    ans: '$7.500',
  },
  {
    id: 7,
    cat: 'Fracciones Equivalentes',
    ctx: 'Observa la regla fraccionaria dividida en partes iguales:',
    q: '¿Qué fracción es equivalente a 2/3?',
    opts: ['6/9', '4/9', '5/6', '3/6'],
    ans: '6/9',
  },
  {
    id: 8,
    cat: 'Área de Figuras Planas',
    ctx: 'Un jardín cuadrado tiene 9 metros en cada uno de sus lados:',
    q: '¿Cuál es el área de la superficie del jardín?',
    opts: ['81 m²', '36 m²', '72 m²', '18 m²'],
    ans: '81 m²',
  },
  {
    id: 9,
    cat: 'Suma y Resta de Grandes Números',
    ctx: 'La biblioteca escolar recibió 14.580 libros y luego donó 3.250 a otra sede:',
    q: '¿Cuántos libros quedaron en la biblioteca?',
    opts: ['11.330', '11.230', '11.450', '12.330'],
    ans: '11.330',
  },
  {
    id: 10,
    cat: 'División con Residuo',
    ctx: 'Se reparten 95 caramelos entre 8 estudiantes por partes iguales:',
    q: '¿Cuántos caramelos sobran?',
    opts: ['7', '5', '3', '6'],
    ans: '7',
  },
  {
    id: 11,
    cat: 'Tiempo y Reloj',
    ctx: 'Un partido de fútbol inició a las 3:15 p.m. y finalizó a las 4:50 p.m.:',
    q: '¿Cuánto tiempo duró el partido en minutos?',
    opts: ['95 minutos', '85 minutos', '105 minutos', '90 minutos'],
    ans: '95 minutos',
  },
  {
    id: 12,
    cat: 'Múltiplos y Factores',
    ctx: 'Identifica las propiedades de los números naturales:',
    q: '¿Cuál de los siguientes números es múltiplo común de 4 y 6?',
    opts: ['24', '18', '16', '30'],
    ans: '24',
  },
  {
    id: 13,
    cat: 'Números Decimales',
    ctx: 'Camila compró una libreta por $4,75 y un lápiz por $2,50:',
    q: '¿Cuánto pagó en total?',
    opts: ['$7,25', '$6,25', '$7,50', '$6,75'],
    ans: '$7,25',
  },
  {
    id: 14,
    cat: 'Conversión de Medidas',
    ctx: 'Un tanque de agua almacena 3 litros y medio de líquido:',
    q: '¿A cuántos mililitros equivale esta cantidad?',
    opts: ['3.500 ml', '350 ml', '35.000 ml', '3.050 ml'],
    ans: '3.500 ml',
  },
  {
    id: 15,
    cat: 'Ángulos y Triángulos',
    ctx: 'En la clase de geometría se analiza un triángulo rectángulo:',
    q: '¿Cuánto mide exactamente su ángulo recto?',
    opts: ['90°', '45°', '180°', '60°'],
    ans: '90°',
  },
  {
    id: 16,
    cat: 'Estimación y Redondeo',
    ctx: 'Aproxima al millar más cercano:',
    q: '¿Cuál es el valor estimado de 7.840?',
    opts: ['8.000', '7.000', '7.800', '7.900'],
    ans: '8.000',
  },
  {
    id: 17,
    cat: 'Operaciones Combinadas',
    ctx: 'Aplica el orden de operaciones (jerarquía):',
    q: 'Resuelve: 25 + 5 × 4 - 10 = ?',
    opts: ['35', '110', '45', '30'],
    ans: '35',
  },
  {
    id: 18,
    cat: 'Fracciones en la Recta',
    ctx: 'En la recta numérica entre 0 y 1:',
    q: '¿Qué fracción se ubica exactamente en la mitad?',
    opts: ['1/2', '2/3', '1/4', '3/4'],
    ans: '1/2',
  },
  {
    id: 19,
    cat: 'Simetría y Figuras',
    ctx: 'Se traza el eje de simetría en un cuadrado:',
    q: '¿Cuántos ejes de simetría tiene un cuadrado?',
    opts: ['4', '2', '8', '1'],
    ans: '4',
  },
  {
    id: 20,
    cat: 'Probabilidad Básica',
    ctx: 'En una bolsa hay 6 canicas rojas, 3 azules y 1 verde:',
    q: '¿Qué color de canica es más probable sacar al azar?',
    opts: ['Roja', 'Azul', 'Verde', 'Todas igual'],
    ans: 'Roja',
  },
  {
    id: 21,
    cat: 'Multiplicación por 10, 100 y 1.000',
    ctx: 'Calcula rápidamente el producto abreviado:',
    q: '¿Cuánto es 48 × 100?',
    opts: ['4.800', '480', '48.000', '4.080'],
    ans: '4.800',
  },
  {
    id: 22,
    cat: 'Patrones y Secuencias',
    ctx: 'Descubre el patrón en la serie: 7, 14, 21, 28, __:',
    q: '¿Cuál es el siguiente número?',
    opts: ['35', '34', '36', '42'],
    ans: '35',
  },
  {
    id: 23,
    cat: 'Unidades de Masa',
    ctx: 'En una báscula 1 kilogramo equivale a:',
    q: '¿Cuántos gramos son 2,5 kilogramos?',
    opts: ['2.500 g', '250 g', '25.000 g', '2.050 g'],
    ans: '2.500 g',
  },
  {
    id: 24,
    cat: 'Diagrama de Barras',
    ctx: 'En la barra más alta de la gráfica se leen 45 votos:',
    q: 'Si la siguiente barra tiene 30 votos, ¿cuál es la diferencia?',
    opts: ['15 votos', '25 votos', '10 votos', '75 votos'],
    ans: '15 votos',
  },
  {
    id: 25,
    cat: 'Problema de Cierre SABER',
    ctx: 'Un bus escolar realiza 4 viajes diarios transportando 35 estudiantes por viaje:',
    q: '¿Cuántos estudiantes transporta en 5 días de clase?',
    opts: ['700 estudiantes', '650 estudiantes', '750 estudiantes', '800 estudiantes'],
    ans: '700 estudiantes',
  },
];

interface ExamenFinalModal4toProps {
  isOpen?: boolean;
  onClose: () => void;
}

export default function ExamenFinalModal4to({
  isOpen = true,
  onClose,
}: ExamenFinalModal4toProps) {
  const { updateStats } = useBook4();

  // 'intro' (Imagen 1) -> 'exam' (Imagen 2) -> 'result'
  const [step, setStep] = useState<'intro' | 'exam' | 'result'>('intro');

  const [examStats, setExamStats] = useState({
    passes: 0,
    bestScore: 0,
    attempts: 0,
  });

  const [curQIdx, setCurQIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [modelOpen, setModelOpen] = useState(true);

  // Cargar estadísticas del Examen Final desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('fedor4_final');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) setExamStats(parsed);
      }
    } catch {}
  }, []);

  const handleStartExam = () => {
    setCurQIdx(0);
    setCorrectCount(0);
    setSelectedOpt(null);
    setIsAnswering(false);
    setModelOpen(true);
    setStep('exam');
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswering || selectedOpt !== null) return;
    setIsAnswering(true);
    setSelectedOpt(opt);

    const currentQ = EXAM_POOL_4TO[curQIdx];
    const isCorrect = String(opt).trim() === String(currentQ.ans).trim();
    const newCorrect = isCorrect ? correctCount + 1 : correctCount;
    if (isCorrect) {
      setCorrectCount(newCorrect);
    }

    setTimeout(() => {
      if (curQIdx + 1 < EXAM_POOL_4TO.length) {
        setCurQIdx(curQIdx + 1);
        setSelectedOpt(null);
        setIsAnswering(false);
      } else {
        // Fin de las 25 preguntas
        const passed = newCorrect >= 18;
        const newBest = Math.max(examStats.bestScore || 0, newCorrect);
        const updated = {
          passes: (examStats.passes || 0) + (passed ? 1 : 0),
          bestScore: newBest,
          attempts: (examStats.attempts || 0) + 1,
        };
        setExamStats(updated);
        try {
          localStorage.setItem('fedor4_final', JSON.stringify(updated));
        } catch {}

        if (passed) {
          updateStats(500, 0, 100);
        }
        setStep('result');
      }
    }, 850);
  };

  if (!isOpen) return null;

  const currentQ = EXAM_POOL_4TO[curQIdx];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(8, 4, 30, 0.78)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: '#FFFFFF',
          borderRadius: '26px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Nunito', sans-serif",
          boxSizing: 'border-box',
        }}
      >
        {/* ══════════════════════════════════════════════════════════════
            PASO 1: INTRO DEL EXAMEN FINAL (IDÉNTICO A IMAGEN 1)
           ══════════════════════════════════════════════════════════════ */}
        {step === 'intro' && (
          <div
            style={{
              padding: '24px 28px 24px 28px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            {/* Cabecera: Título y Botón de Cierre Circular */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px', lineHeight: 1 }}>🎓</span>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '22px',
                    fontWeight: 900,
                    color: '#1E1B4B',
                    fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                    letterSpacing: '0.01em',
                  }}
                >
                  Examen Final 4°
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#F3EEFF',
                  color: '#5C21A6',
                  fontSize: '16px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            {/* Subtítulo descriptivo */}
            <p
              style={{
                margin: '8px 0 16px 0',
                fontSize: '13px',
                fontWeight: 800,
                color: '#1E1B4B',
                lineHeight: 1.4,
              }}
            >
              25 preguntas mezcladas de las 15 unidades del libro.
            </p>

            {/* 3 Cajas de Estadísticas (Aprobados, Mejor, Intentos) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#F8F5FF',
                  borderRadius: '14px',
                  padding: '12px 10px',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#6B7280',
                    marginBottom: '4px',
                  }}
                >
                  Aprobados
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    color: '#5C21A6',
                  }}
                >
                  {examStats.passes || 0}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#F8F5FF',
                  borderRadius: '14px',
                  padding: '12px 10px',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#6B7280',
                    marginBottom: '4px',
                  }}
                >
                  Mejor
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    color: '#5C21A6',
                  }}
                >
                  {examStats.bestScore || 0}/25
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#F8F5FF',
                  borderRadius: '14px',
                  padding: '12px 10px',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#6B7280',
                    marginBottom: '4px',
                  }}
                >
                  Intentos
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    color: '#5C21A6',
                  }}
                >
                  {examStats.attempts || 0}
                </div>
              </div>
            </div>

            {/* Banner Recompensa Naranja */}
            <div
              style={{
                backgroundColor: '#FFF8EE',
                border: '2px solid #FF8C2A',
                borderRadius: '14px',
                padding: '12px 16px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 800,
                color: '#7A3200',
                boxSizing: 'border-box',
              }}
            >
              <span style={{ fontSize: '16px' }}>🏆</span>
              <span>Apruebas con 18/25 o más: </span>
              <span
                style={{
                  color: '#B45309',
                  fontWeight: 900,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <b>+500</b>
                <span>🪙</span>
              </span>
            </div>

            {/* Botón Rojo Carmesí: Empezar examen final */}
            <button
              type="button"
              onClick={handleStartExam}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '16px',
                backgroundColor: '#E11D48',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(225, 29, 72, 0.35)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#BE123C';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E11D48';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '16px' }}>🎓</span>
              <span>Empezar examen final</span>
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            PASO 2: QUIZ DEL EXAMEN FINAL (IDÉNTICO A IMAGEN 2)
           ══════════════════════════════════════════════════════════════ */}
        {step === 'exam' && currentQ && (
          <div
            style={{
              padding: '22px 28px 24px 28px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            {/* Cabecera: Título y Botón de Cierre */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px', lineHeight: 1 }}>🎓</span>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '22px',
                    fontWeight: 900,
                    color: '#1E1B4B',
                    fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                    letterSpacing: '0.01em',
                  }}
                >
                  Examen Final 4°
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#F3EEFF',
                  color: '#5C21A6',
                  fontSize: '16px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            {/* Línea de Progreso: Pregunta X de 25 y Correctos */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6px',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  color: '#991B1B',
                }}
              >
                Pregunta {curQIdx + 1} de {EXAM_POOL_4TO.length}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  color: '#047857',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>✅</span>
                <span>{correctCount}</span>
              </span>
            </div>

            {/* Barra de Progreso gris suave */}
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: '#F3F4F6',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: `${((curQIdx + 1) / EXAM_POOL_4TO.length) * 100}%`,
                  height: '100%',
                  backgroundColor: '#E11D48',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Tag de Categoría */}
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#6B7280',
                marginBottom: '4px',
              }}
            >
              {currentQ.cat}
            </div>

            {/* Contexto Narrativo */}
            <div
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#374151',
                lineHeight: 1.45,
                marginBottom: '6px',
              }}
            >
              {currentQ.ctx}
            </div>

            {/* Pregunta Principal */}
            <div
              style={{
                fontSize: '17px',
                fontWeight: 900,
                color: '#111827',
                lineHeight: 1.35,
                marginBottom: '14px',
              }}
            >
              {currentQ.q}
            </div>

            {/* ══ CAJA VISUAL: MODELO DE ÁREA (EXACTO A IMAGEN 2) ══ */}
            {currentQ.hasModel && (
              <div
                style={{
                  border: '2px solid #7C3AED',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              >
                {/* Cabecera Morada */}
                <div
                  style={{
                    backgroundColor: '#7C3AED',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#FFFFFF',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      fontWeight: 900,
                    }}
                  >
                    <span>🧠</span>
                    <span>{currentQ.modelTitle}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModelOpen(!modelOpen)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 900,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {modelOpen ? '▲' : '▼'}
                  </button>
                </div>

                {/* Contenido Desplegable */}
                {modelOpen && (
                  <div
                    style={{
                      padding: '14px 16px',
                      backgroundColor: '#F8F7FF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {/* Grilla visual de descomposición */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto repeat(4, 1fr)',
                        gap: '6px',
                        alignItems: 'center',
                        justifyItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      {/* Fila 1 */}
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: 900,
                          color: '#EA580C',
                          padding: '0 6px',
                        }}
                      >
                        ✖
                      </span>
                      {currentQ.gridTop?.map((val, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#EDE9FE',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            fontWeight: 900,
                            fontSize: '13px',
                            color: '#1E1B4B',
                            minWidth: '46px',
                            textAlign: 'center',
                          }}
                        >
                          {val}
                        </div>
                      ))}

                      {/* Fila 2 */}
                      <div
                        style={{
                          backgroundColor: '#FED7AA',
                          borderRadius: '10px',
                          padding: '8px 14px',
                          fontWeight: 900,
                          fontSize: '14px',
                          color: '#1E1B4B',
                          textAlign: 'center',
                        }}
                      >
                        {currentQ.gridMultiplier}
                      </div>
                      {[0, 1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1.5px solid #E5E7EB',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            fontWeight: 800,
                            fontSize: '13px',
                            color: '#9CA3AF',
                            minWidth: '46px',
                            textAlign: 'center',
                          }}
                        >
                          ?
                        </div>
                      ))}
                    </div>

                    {/* Nota explicativa con ícono */}
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#1F2937',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '8px',
                        textAlign: 'center',
                      }}
                    >
                      <span>👆</span>
                      <span>Descompón cada número (ej. 42 = 40 + 2) y multiplica las partes.</span>
                    </div>

                    {/* Píldora punteada */}
                    <div
                      style={{
                        width: '100%',
                        border: '2px dashed #C4B5FD',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        backgroundColor: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#4C1D95',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                      }}
                    >
                      Multiplica cada pareja y al final suma todas las casillas
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Grilla 2x2 de Opciones de Respuesta */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {currentQ.opts.map((opt, i) => {
                const isSelected = selectedOpt === opt;
                const isCorrect = String(opt).trim() === String(currentQ.ans).trim();

                let btnBg = '#FFFFFF';
                let btnBorder = '2px solid #C5BFEE';
                let btnColor = '#1E1B4B';

                if (selectedOpt !== null) {
                  if (isSelected && isCorrect) {
                    btnBg = '#DCF5EE';
                    btnBorder = '2px solid #16876A';
                    btnColor = '#074F3A';
                  } else if (isSelected && !isCorrect) {
                    btnBg = '#FBE4E9';
                    btnBorder = '2px solid #A30041';
                    btnColor = '#7A1B00';
                  } else if (isCorrect) {
                    btnBg = '#DCF5EE';
                    btnBorder = '2px solid #16876A';
                    btnColor = '#074F3A';
                  }
                }

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isAnswering}
                    onClick={() => handleSelectOption(opt)}
                    style={{
                      height: '48px',
                      borderRadius: '14px',
                      border: btnBorder,
                      backgroundColor: btnBg,
                      color: btnColor,
                      fontSize: '16px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isAnswering ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      boxSizing: 'border-box',
                      padding: '0 12px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isAnswering && selectedOpt === null) {
                        e.currentTarget.style.backgroundColor = '#F0EDFF';
                        e.currentTarget.style.borderColor = '#9B5CFF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isAnswering && selectedOpt === null) {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#C5BFEE';
                      }
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            PASO 3: RESULTADO FINAL DEL EXAMEN
           ══════════════════════════════════════════════════════════════ */}
        {step === 'result' && (
          <div
            style={{
              padding: '24px 28px 28px 28px',
              textAlign: 'center',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>
              {correctCount >= 18 ? '🏆' : '📚'}
            </div>

            <h3
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color: correctCount >= 18 ? '#16876A' : '#A30041',
                margin: '0 0 6px 0',
                fontFamily: "'Baloo 2', 'Nunito', sans-serif",
              }}
            >
              {correctCount >= 18 ? '¡Examen Aprobado!' : 'Examen Finalizado'}
            </h3>

            <div
              style={{
                fontSize: '44px',
                fontWeight: 900,
                color: correctCount >= 18 ? '#16876A' : '#A30041',
                marginBottom: '6px',
              }}
            >
              {correctCount}/25
            </div>

            <p
              style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#6B7280',
                margin: '0 0 14px 0',
              }}
            >
              {Math.round((correctCount / 25) * 100)}% de aciertos
            </p>

            {correctCount >= 18 ? (
              <div
                style={{
                  backgroundColor: '#DCF5EE',
                  border: '1.5px solid #16876A',
                  borderRadius: '14px',
                  padding: '12px 18px',
                  color: '#074F3A',
                  fontWeight: 900,
                  fontSize: '13px',
                  marginBottom: '20px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                🎉 ¡Felicidades! Has aprobado el libro de 4° y ganado <b>+500 🪙</b>.
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#FBE4E9',
                  border: '1.5px solid #A30041',
                  borderRadius: '14px',
                  padding: '12px 18px',
                  color: '#7A1B00',
                  fontWeight: 800,
                  fontSize: '13px',
                  marginBottom: '20px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                Necesitas al menos 18/25 para aprobar. ¡Repasa las unidades e inténtalo de nuevo!
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '16px',
                backgroundColor: '#5C21A6',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(92, 33, 166, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
