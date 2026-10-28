'use client';

import React, { useState } from 'react';
import { useBook1 } from '../context/Book1Context';
import { fedorTTS } from '@/services/tts.service';
import TopFeaturesSection1ro from '../shared/TopFeaturesSection1ro';

type TabType = 'pensamientos' | 'estandares' | 'competencias' | 'dba' | 'desempeno';

interface PensamientoData {
  id: string;
  title: string;
  icon: string;
  desc: string;
  bullets: string[];
}

const PENSAMIENTOS: PensamientoData[] = [
  {
    id: 'numerico',
    icon: '🧮',
    title: 'Pensamiento Numérico',
    desc: 'Comprende los números naturales, sus operaciones y propiedades.',
    bullets: [
      'Reconoce, lee y escribe números del 0 al 99.',
      'Identifica unidades, decenas y centenas.',
      'Resuelve adiciones y sustracciones con números hasta el 100.',
      'Comprende la multiplicación como suma de grupos iguales.',
      'Comprende la división como reparto en partes iguales.',
    ],
  },
  {
    id: 'espacial',
    icon: '📐',
    title: 'Pensamiento Espacial',
    desc: 'Reconoce figuras y relaciones geométricas en el entorno.',
    bullets: [
      'Identifica figuras planas: círculo, cuadrado, triángulo, rectángulo.',
      'Reconoce líneas: rectas, curvas, abiertas, cerradas.',
      'Calcula el perímetro de figuras simples.',
      'Reconoce posiciones: arriba/abajo, dentro/fuera, cerca/lejos.',
    ],
  },
  {
    id: 'metrico',
    icon: '📏',
    title: 'Pensamiento Métrico',
    desc: 'Comprende magnitudes y mediciones.',
    bullets: [
      'Compara longitudes usando unidades no convencionales.',
      'Reconoce el metro como unidad de longitud.',
      'Identifica relaciones de proporcionalidad simple.',
    ],
  },
  {
    id: 'aleatorio',
    icon: '📊',
    title: 'Pensamiento Aleatorio',
    desc: 'Organiza, lee e interpreta datos.',
    bullets: [
      'Recolecta datos a través de encuestas simples.',
      'Construye y lee gráficos de barras y tablas de frecuencia.',
      'Identifica el dato mayor, menor y el total.',
    ],
  },
  {
    id: 'variacional',
    icon: '🔄',
    title: 'Pensamiento Variacional',
    desc: 'Reconoce regularidades, patrones y secuencias.',
    bullets: [
      'Identifica patrones numéricos: pares, impares, secuencias.',
      'Continúa secuencias contando de 1 en 1, 2 en 2, 5 en 5, 10 en 10.',
      'Reconoce el antes y el después de un número.',
    ],
  },
];

const ESTANDARES_LIST = [
  { action: 'Reconoce', text: 'significados del número en diferentes contextos (medición, conteo, comparación, codificación).' },
  { action: 'Describe', text: ', compara y cuantifica situaciones con números, en diferentes contextos y con diversas representaciones.' },
  { action: 'Usa', text: 'los números (en sus diferentes representaciones) y las operaciones para formular y resolver problemas.' },
  { action: 'Identifica', text: ', si a la luz de los datos de un problema, los resultados obtenidos son o no razonables.' },
  { action: 'Reconoce', text: 'figuras congruentes y semejantes.' },
  { action: 'Realiza', text: 'y describe procesos de medición con patrones arbitrarios y convencionales.' },
  { action: 'Interpreta', text: 'cualitativamente datos referidos a situaciones del entorno escolar.' },
  { action: 'Reconoce', text: 'y describe regularidades y patrones en distintos contextos.' },
];

const COMPETENCIAS_LIST = [
  { name: 'Comunicación matemática', desc: 'Expresa, interpreta y representa ideas matemáticas usando lenguaje natural y simbólico.' },
  { name: 'Razonamiento', desc: 'Identifica patrones, formula conjeturas y las justifica con argumentos.' },
  { name: 'Resolución de problemas', desc: 'Aplica estrategias para resolver situaciones del entorno.' },
  { name: 'Modelación', desc: 'Representa situaciones reales mediante modelos matemáticos sencillos.' },
  { name: 'Ejercitación de procedimientos', desc: 'Aplica algoritmos básicos de cálculo.' },
];

const DBA_LIST = [
  { code: 'DBA 1', text: 'Identifica los usos de los números (cardinal, ordinal, código) y las operaciones (suma, resta) en contextos de juego, familiares, económicos, entre otros.' },
  { code: 'DBA 2', text: 'Utiliza diferentes estrategias para contar, realizar operaciones y resolver problemas aditivos.' },
  { code: 'DBA 3', text: 'Compara objetos del entorno y establece semejanzas y diferencias empleando características geométricas de las formas bidimensionales y tridimensionales.' },
  { code: 'DBA 4', text: 'Describe y representa trayectorias y posiciones de objetos y personas para orientar a otros o a sí mismo en el espacio circundante.' },
  { code: 'DBA 5', text: 'Realiza medición de longitudes, capacidades, peso, masa, etc. usando patrones e instrumentos no estandarizados.' },
  { code: 'DBA 6', text: 'Clasifica y organiza datos, los representa utilizando tablas de conteo y pictogramas con escalas, y comunica los resultados obtenidos para responder preguntas sencillas.' },
  { code: 'DBA 7', text: 'Reconoce, describe y representa los desplazamientos y las posiciones de objetos en el plano y en el espacio.' },
];

const NIVELES_DESEMPENO = [
  {
    range: '90 — 100',
    title: '🥇 Superior',
    gradient: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
    desc: 'Los estudiantes pueden aplicar las operaciones básicas para resolver problemas cotidianos y reconocer y describir una variedad de figuras geométricas sin dificultad, mostrando un entendimiento más completo de cómo se relacionan entre sí.',
  },
  {
    range: '75 — 89',
    title: '🏅 Alto',
    gradient: 'linear-gradient(135deg, #16876A, #24C496)',
    desc: 'Ya reconocen varias figuras geométricas y sus características, y manejan sumas y restas con mayor fluidez. También comienzan a resolver multiplicaciones muy sencillas y a entender conceptos de división de forma muy básica.',
  },
  {
    range: '60 — 74',
    title: '⭐ Básico',
    gradient: 'linear-gradient(135deg, #E8650A, #FFB066)',
    desc: 'Los estudiantes ya pueden reconocer más figuras geométricas, como triángulos o rectángulos, y pueden sumar y restar sin tanto apoyo. Tal vez comienzan a explorar la idea de la multiplicación como suma de grupos iguales.',
  },
  {
    range: '0 — 59',
    title: '📚 Bajo',
    gradient: 'linear-gradient(135deg, #64748B, #94A3B8)',
    desc: 'Los estudiantes apenas están reconociendo las formas geométricas más básicas y necesitan mucha guía para identificar figuras como el círculo o el cuadrado. En cuanto a las operaciones, se enfocan en sumar y restar con números muy pequeños, con bastante apoyo visual y concreto.',
  },
];

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

export default function EstandaresScreen1ro() {
  const { goScreen } = useBook1();
  const [activeTab, setActiveTab] = useState<TabType>('pensamientos');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'pensamientos', label: 'Pensamientos', icon: '📍' },
    { id: 'estandares', label: 'Estándares', icon: '📜' },
    { id: 'competencias', label: 'Competencias', icon: '🎯' },
    { id: 'dba', label: 'DBA', icon: '📘' },
    { id: 'desempeno', label: 'Desempeño', icon: '⭐' },
  ];

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

      {/* ════ HERO BANNER VERDE-AMARILLO (Imagen Estándares M.E.N.) ════ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F6E56 0%, #16876A 45%, #E5A823 100%)',
          borderRadius: '22px',
          padding: '1.75rem 1.5rem',
          color: '#ffffff',
          marginBottom: '1.25rem',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(22, 135, 106, 0.28)',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '0.05em',
            marginBottom: '4px',
            opacity: 0.95,
          }}
        >
          CO
        </div>
        <h1
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '28px',
            fontWeight: 900,
            margin: '0 0 6px',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>📐</span>
          <span>Estándares M.E.N. Colombia · 1° Primaria</span>
        </h1>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          Pensamientos Matemáticos · Estándares · Competencias · DBA · Desempeño
        </div>
      </div>

      {/* ════ BARRA DE PESTAÑAS (TABS) ════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '8px',
          marginBottom: '1.5rem',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #16876A, #10B981)'
                  : 'rgba(22, 135, 106, 0.08)',
                border: isActive
                  ? '2px solid #0E5240'
                  : '1.5px solid rgba(22, 135, 106, 0.22)',
                color: isActive ? '#ffffff' : '#0E5240',
                fontWeight: 900,
                fontSize: '13px',
                padding: '10px 14px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: isActive ? '0 4px 14px rgba(22, 135, 106, 0.35)' : 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(22, 135, 106, 0.16)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(22, 135, 106, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ════ CONTENIDO: TAB 1 PENSAMIENTOS MATEMÁTICOS ════ */}
      {activeTab === 'pensamientos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PENSAMIENTOS.map((p) => (
            <div
              key={p.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '2px solid #9333EA',
                padding: '1.4rem 1.6rem',
                boxShadow: '0 4px 16px rgba(147, 51, 234, 0.06)',
              }}
            >
              {/* Título del Pensamiento */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '24px' }}>{p.icon}</span>
                <h3
                  style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    fontSize: '20px',
                    fontWeight: 900,
                    color: '#581C87',
                    margin: 0,
                  }}
                >
                  {p.title}
                </h3>
              </div>

              {/* Descripción con botón de voz */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14.5px',
                  color: '#4B5563',
                  fontWeight: 700,
                  marginBottom: '14px',
                }}
              >
                <span>{p.desc}</span>
                <CyanAudioBtn text={`${p.title}. ${p.desc}`} size={28} fontSize={13} />
              </div>

              {/* Lista de viñetas con líneas punteadas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {p.bullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom:
                        idx < p.bullets.length - 1
                          ? '1px dashed rgba(147, 51, 234, 0.2)'
                          : 'none',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px',
                        color: '#1F2937',
                        fontWeight: 600,
                      }}
                    >
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: '#9333EA',
                          flexShrink: 0,
                        }}
                      />
                      <span>{bullet}</span>
                    </div>

                    <CyanAudioBtn text={bullet} size={28} fontSize={13} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════ CONTENIDO: TAB 2 ESTÁNDARES BÁSICOS ════ */}
      {activeTab === 'estandares' && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '2px solid #16876A',
            padding: '1.5rem 1.75rem',
            boxShadow: '0 4px 16px rgba(22, 135, 106, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>📜</span>
            <h3
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '20px',
                fontWeight: 900,
                color: '#074F3A',
                margin: 0,
              }}
            >
              Estándares Básicos de Competencias
            </h3>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14.5px',
              color: '#4B5563',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            <span>Lo que TODO estudiante de 1° debe saber y saber hacer.</span>
            <CyanAudioBtn
              text="Estándares Básicos de Competencias. Lo que todo estudiante de primero debe saber y saber hacer."
              size={28}
              fontSize={13}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ESTANDARES_LIST.map((est, idx) => {
              const fullText = `${est.action} ${est.text}`;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 0',
                    borderBottom:
                      idx < ESTANDARES_LIST.length - 1
                        ? '1px dashed rgba(22, 135, 106, 0.25)'
                        : 'none',
                    gap: '12px',
                  }}
                >
                  <div style={{ fontSize: '14px', color: '#1F2937', fontWeight: 600 }}>
                    <strong style={{ color: '#074F3A', fontWeight: 900 }}>{est.action}</strong>
                    <span>{est.text}</span>
                  </div>
                  <CyanAudioBtn text={fullText} size={28} fontSize={13} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════ CONTENIDO: TAB 3 COMPETENCIAS ════ */}
      {activeTab === 'competencias' && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '2px solid #C94B22',
            padding: '1.5rem 1.75rem',
            boxShadow: '0 4px 16px rgba(201, 75, 34, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ fontSize: '24px' }}>🎯</span>
            <h3
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '20px',
                fontWeight: 900,
                color: '#7A1B00',
                margin: 0,
              }}
            >
              Competencias Matemáticas
            </h3>
            <CyanAudioBtn
              text="Competencias Matemáticas para grado primero."
              size={28}
              fontSize={13}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {COMPETENCIAS_LIST.map((comp, idx) => {
              const fullText = `${comp.name}: ${comp.desc}`;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: '#FFF5F0',
                    borderLeft: '4px solid #C94B22',
                    gap: '12px',
                  }}
                >
                  <div style={{ fontSize: '14px', color: '#1F2937' }}>
                    <strong style={{ color: '#7A1B00', fontWeight: 900 }}>{comp.name}: </strong>
                    <span style={{ fontWeight: 600 }}>{comp.desc}</span>
                  </div>
                  <CyanAudioBtn text={fullText} size={28} fontSize={13} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════ CONTENIDO: TAB 4 DERECHOS BÁSICOS DE APRENDIZAJE (DBA) ════ */}
      {activeTab === 'dba' && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '2px solid #0070C0',
            padding: '1.5rem 1.75rem',
            boxShadow: '0 4px 16px rgba(0, 112, 192, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>📘</span>
            <h3
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '20px',
                fontWeight: 900,
                color: '#0A3A6A',
                margin: 0,
              }}
            >
              Derechos Básicos de Aprendizaje · 1°
            </h3>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14.5px',
              color: '#4B5563',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            <span>Conjunto de aprendizajes mínimos que el estudiante debe lograr en cada grado.</span>
            <CyanAudioBtn
              text="Derechos Básicos de Aprendizaje para grado primero. Conjunto de aprendizajes mínimos que el estudiante debe lograr en cada grado."
              size={28}
              fontSize={13}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DBA_LIST.map((dba, idx) => {
              const fullText = `${dba.code}: ${dba.text}`;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 0',
                    borderBottom:
                      idx < DBA_LIST.length - 1 ? '1px dashed rgba(0, 112, 192, 0.25)' : 'none',
                    gap: '12px',
                  }}
                >
                  <div style={{ fontSize: '14px', color: '#1F2937', fontWeight: 600 }}>
                    <strong style={{ color: '#0070C0', fontWeight: 900 }}>{dba.code}: </strong>
                    <span>{dba.text}</span>
                  </div>
                  <CyanAudioBtn text={fullText} size={28} fontSize={13} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════ CONTENIDO: TAB 5 NIVELES DE DESEMPEÑO ════ */}
      {activeTab === 'desempeno' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '2px solid #C25400',
              padding: '1.5rem 1.75rem',
              boxShadow: '0 4px 16px rgba(194, 84, 0, 0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '24px' }}>⭐</span>
              <h3
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#7A3200',
                  margin: 0,
                }}
              >
                Niveles de Desempeño
              </h3>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14.5px',
                color: '#4B5563',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              <span>Escala de valoración del aprendizaje del estudiante en Colombia.</span>
              <CyanAudioBtn
                text="Niveles de Desempeño. Escala de valoración del aprendizaje del estudiante en Colombia."
                size={28}
                fontSize={13}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
              }}
            >
              {NIVELES_DESEMPENO.map((nivel) => (
                <div
                  key={nivel.title}
                  style={{
                    background: nivel.gradient,
                    borderRadius: '16px',
                    padding: '1rem 1.15rem',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      fontWeight: 900,
                      letterSpacing: '0.6px',
                      opacity: 0.88,
                    }}
                  >
                    {nivel.range}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Baloo 2', sans-serif",
                      fontSize: '18px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{nivel.title}</span>
                    <CyanAudioBtn
                      text={`${nivel.title}, puntaje de ${nivel.range}. ${nivel.desc}`}
                      size={24}
                      fontSize={11}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      opacity: 0.95,
                    }}
                  >
                    {nivel.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta de Meta del año escolar */}
          <div
            style={{
              background: 'linear-gradient(135deg, #16876A, #24C496)',
              color: '#ffffff',
              padding: '1.25rem 1.5rem',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 6px 18px rgba(22, 135, 106, 0.25)',
            }}
          >
            <span style={{ fontSize: '38px', lineHeight: 1 }}>🎯</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: '17px',
                  fontWeight: 900,
                  marginBottom: '2px',
                }}
              >
                Meta del año escolar
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, opacity: 0.95 }}>
                Que TODOS los estudiantes alcancen al menos el nivel BÁSICO (60+) en cada DBA.
              </div>
            </div>
            <CyanAudioBtn
              text="Meta del año escolar: Que todos los estudiantes alcancen al menos el nivel básico en cada Derecho Básico de Aprendizaje."
              size={32}
              fontSize={14}
            />
          </div>
        </div>
      )}
    </div>
  );
}
