'use client';

import React, { useState } from 'react';
import Starfield from '@/components/book/shared/Starfield';
import ProcedureModal from '@/components/book/shared/ProcedureModal';
import type { LevelExample } from '@/types/book.types';
import { fedorTTS } from '@/services/tts.service';
import StoryboardRenderer, { inferSb } from './StoryboardRenderer';

interface Props {
  examples: LevelExample[];
  exercisesCount: number;
  levelIndex: number;
  unitIndex?: number;
  topicTitle: string;
  levelDesc: string;
  conceptText: string;
  onStart: () => void;
  firstExerciseQuestion?: string;
  firstExerciseAnswer?: string;
  firstExerciseExplain?: string;
}

const LEVEL_META_GRADE1 = [
  { grad: 'linear-gradient(155deg,#0A3D28,#16876A,#0E5240)', headerTxt: '🟢 Nivel Básico', sub: 'Construye las bases del concepto', accent: '#24C496', badgeBg: '#16876A' },
  { grad: 'linear-gradient(155deg,#6A3200,#E8650A,#BA5500)', headerTxt: '🟡 Nivel Medio', sub: 'Desarrolla el pensamiento matemático', accent: '#FF8C2A', badgeBg: '#E8650A' },
  { grad: 'linear-gradient(155deg,#5A0A28,#C94B22,#8B1A00)', headerTxt: '🔴 Nivel Avanzado', sub: 'Domina la operación con precisión', accent: '#FF6B6B', badgeBg: '#C94B22' },
  { grad: 'linear-gradient(155deg,#2A0F60,#7B2FBE,#1A0848)', headerTxt: '🟣 Nivel Experto', sub: 'Reta tu mente con problemas más exigentes', accent: '#A864E8', badgeBg: '#7B2FBE' },
  { grad: 'linear-gradient(155deg,#7A4A00,#F5C518,#E8650A)', headerTxt: '🏆 Evaluación Final', sub: '20 preguntas que cubren los 4 niveles', accent: '#F5C518', badgeBg: '#E8650A' },
];

const CHARS = [
  { e: '🧑‍🚀', n: 'Math' },
  { e: '👩‍🚀', n: 'Sumy' },
  { e: '👦', n: 'Jack' },
];

/**
 * Panel de Ejemplos para Grado 1°
 * Réplica exacta de showExamplesPanel y FEDOR_1RO_STORYBOARD_FRAMEWORK de MatematicasDeFedor_1.html.
 */
export default function ExamplesPanel1ro({
  examples,
  exercisesCount,
  levelIndex,
  unitIndex = 0,
  topicTitle,
  levelDesc,
  conceptText,
  onStart,
  firstExerciseQuestion,
  firstExerciseAnswer,
  firstExerciseExplain,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const lm = LEVEL_META_GRADE1[levelIndex] ?? LEVEL_META_GRADE1[0];

  const handleNarrateHeader = () => {
    fedorTTS.speak(
      'Panel de ejemplos del Método Fedor. Observa los ejemplos resueltos antes de comenzar los ejercicios.'
    );
  };

  return (
    <div
      className="exp1-panel"
      style={{
        background: lm.grad,
        borderRadius: 22,
        overflow: 'hidden',
        boxShadow: '0 16px 45px rgba(0,0,0,0.35)',
        marginBottom: '1.5rem',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.15)',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <Starfield count={22} />

      {/* HEADER */}
      <div style={{ padding: '1.5rem 1.4rem 0.85rem', position: 'relative', zIndex: 1 }}>
        {/* Top button: 💻 PANEL DE EJEMPLOS - MÉTODO FEDOR 🔊 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
          <button
            type="button"
            onClick={handleNarrateHeader}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              fontWeight: 900,
              color: '#FFE066',
              textTransform: 'uppercase',
              letterSpacing: '.08em',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1.5px solid rgba(255, 224, 102, 0.4)',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              transition: 'transform 0.15s',
            }}
            title="Escuchar introducción"
          >
            <span>💻 PANEL DE EJEMPLOS - MÉTODO FEDOR</span>
          </button>
          <button
            type="button"
            onClick={handleNarrateHeader}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06B6D4, #10B981)',
              border: 'none',
              color: '#fff',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(6,182,212,0.4)',
            }}
            title="Reproducir audio"
          >
            🔊
          </button>
        </div>

        {/* PASO 1 / PASO 2 INDICATOR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: 0,
            marginBottom: '1rem',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <div
            style={{
              flex: 1,
              padding: '.55rem .85rem',
              background: 'rgba(245, 197, 24, 0.18)',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '9.5px', fontWeight: 900, color: '#FFE066', letterSpacing: '.12em' }}>
              PASO 1 · AHORA
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginTop: '1px' }}>
              👀 Mira los ejemplos
            </div>
          </div>
          <div
            style={{
              flex: 1,
              padding: '.55rem .85rem',
              background: 'rgba(255, 255, 255, 0.04)',
              opacity: 0.7,
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '9.5px', fontWeight: 900, color: 'rgba(255,255,255,.65)', letterSpacing: '.12em' }}>
              PASO 2 · DESPUÉS
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,.85)', marginTop: '1px' }}>
              🎮 Resuelve los ejercicios
            </div>
          </div>
        </div>

        {/* LEVEL TITLE & EXERCISES COUNT */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: 24,
                fontWeight: 900,
                color: '#fff',
                marginBottom: 2,
                letterSpacing: '-0.02em',
              }}
            >
              {lm.headerTxt}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', fontWeight: 700 }}>
              {levelDesc || lm.sub} · {topicTitle}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', fontWeight: 800, letterSpacing: '.05em' }}>
              EJERCICIOS
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: '#FF8C2A',
                fontFamily: "'Baloo 2', sans-serif",
                lineHeight: 1,
              }}
            >
              {exercisesCount}
            </div>
          </div>
        </div>
      </div>

      {/* CHARACTERS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 28,
          padding: '0 1.25rem 0.85rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {CHARS.map((ch, i) => (
          <div key={ch.n} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, animation: `float ${3 + i * 0.4}s ease-in-out infinite` }}>
              {ch.e}
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 900, color: 'rgba(255,255,255,.85)', marginTop: 2 }}>
              {ch.n}
            </div>
          </div>
        ))}
      </div>

      {/* CONCEPT / STANDARD BANNER */}
      <div
        style={{
          margin: '0 1.25rem 1rem',
          padding: '.75rem 1.1rem',
          background: 'rgba(0, 0, 0, 0.22)',
          borderRadius: 14,
          borderLeft: `4px solid ${lm.accent}`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ fontSize: 13.5, color: '#ffffff', fontWeight: 800, lineHeight: 1.5, textAlign: 'left' }}>
          {conceptText || 'Reconoce, lee y escribe números del 1 al 20'}
        </div>
      </div>

      {/* EXAMPLES SECTION */}
      <div style={{ padding: '0 1.25rem .5rem', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            color: 'rgba(255,255,255,.8)',
            textTransform: 'uppercase',
            letterSpacing: '.1em',
            marginBottom: '.85rem',
            textAlign: 'left',
          }}
        >
          ✨ {examples.length} EJEMPLOS RESUELTOS
        </div>

        {examples.map((ex, i) => (
          <ExampleCardClean
            key={i}
            ex={ex}
            index={i + 1}
            unitIndex={unitIndex}
          />
        ))}
      </div>

      {/* START BUTTON */}
      <div
        style={{
          padding: '1rem 1.25rem 1.75rem',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={onStart}
          style={{
            background: 'linear-gradient(135deg, #F5C518, #FF8C2A)',
            color: '#1A0A3C',
            fontWeight: 900,
            fontSize: '18px',
            padding: '14px 40px',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(255, 140, 42, 0.45)',
            fontFamily: "'Nunito', sans-serif",
            transition: 'transform 0.15s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          🚀 ¡Comenzar Ejercicios!
        </button>

        {firstExerciseQuestion && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            style={{
              padding: '8px 18px',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            💡 Ver procedimiento paso a paso
          </button>
        )}
      </div>

      {firstExerciseQuestion && (
        <ProcedureModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          question={firstExerciseQuestion || ''}
          answer={firstExerciseAnswer || ''}
          explainHtml={firstExerciseExplain}
        />
      )}
    </div>
  );
}

/**
 * Tarjeta limpia para cada ejemplo (.examples-card-clean)
 * Fondo blanco, borde naranja, figura en caja centrada y Storyboard interactivo.
 */
function ExampleCardClean({
  ex,
  index,
  unitIndex,
}: {
  ex: LevelExample;
  index: number;
  unitIndex: number;
}) {
  const handleNarrate = () => {
    fedorTTS.speak(
      `Ejemplo ${index}: ${ex.q}. Respuesta: ${ex.a}. ${
        ex.explain ? 'Explicación: ' + ex.explain.replace(/<[^>]+>/g, '') : ''
      }`
    );
  };

  // En las unidades 1 a 4 (aritmética), inferimos el storyboard pedagógico
  // En las unidades 5 (geometría) y 6 (estadística), no aplica storyboard de conteo
  const isArithmeticUnit = unitIndex <= 3;
  const sbConfig = isArithmeticUnit ? inferSb(ex.q, ex.a) : null;

  return (
    <div
      className="examples-card-clean"
      style={{
        background: '#FFFFFF',
        border: '2.5px solid #FF8C2A',
        borderRadius: '18px',
        padding: '1.2rem',
        marginBottom: '1.1rem',
        position: 'relative',
        textAlign: 'left',
        boxShadow: '0 6px 18px rgba(60, 30, 120, 0.12), 0 2px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Top row: Badge [index] + Pregunta + Botón 🔊 + Answer Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.65rem' }}>
        {/* Badge numérico naranja */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: '#FF8C2A',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '15px',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(255, 140, 42, 0.4)',
          }}
        >
          {index}
        </div>

        {/* Pregunta */}
        <div
          className="ex-q-label"
          style={{
            flex: 1,
            fontSize: '16px',
            fontWeight: 900,
            color: '#1A1A1A',
            lineHeight: 1.4,
            fontFamily: "'Baloo 2', sans-serif",
          }}
        >
          {ex.q}
        </div>

        {/* Botón de voz individual */}
        <button
          type="button"
          onClick={handleNarrate}
          style={{
            background: 'linear-gradient(135deg, #06B6D4, #10B981)',
            color: '#fff',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 5px rgba(6,182,212,0.3)',
          }}
          title="Escuchar este ejemplo"
          aria-label="Escuchar este ejemplo"
        >
          🔊
        </button>

        {/* Pill de respuesta */}
        <div
          className="ex-a-pill"
          style={{
            background: '#FF8C2A',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '17px',
            fontFamily: "'Baloo 2', sans-serif",
            padding: '4px 16px',
            borderRadius: '99px',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(255, 140, 42, 0.3)',
          }}
        >
          {ex.a}
        </div>
      </div>

      {/* Caja contenedora de la figura (.ex-vis) */}
      {ex.vis && (
        <div
          className="ex-vis"
          style={{
            background: '#FFFBF2',
            border: '1.5px solid rgba(232, 101, 10, 0.35)',
            color: '#1a1a1a',
            borderRadius: '12px',
            padding: '0.8rem',
            margin: '0.6rem 0',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {ex.vis.includes('<svg') || ex.vis.includes('<div') ? (
            <div
              style={{ width: '100%' }}
              dangerouslySetInnerHTML={{ __html: ex.vis }}
            />
          ) : (
            <div
              style={{
                fontSize: '44px',
                lineHeight: 1.3,
                letterSpacing: '4px',
                textAlign: 'center',
              }}
            >
              {ex.vis}
            </div>
          )}
        </div>
      )}

      {/* Number line si existe */}
      {ex.nl && (
        <div
          style={{
            background: '#FFFBF2',
            border: '1.5px solid rgba(232, 101, 10, 0.35)',
            borderRadius: '12px',
            padding: '0.8rem',
            margin: '0.6rem 0',
          }}
        >
          <NumberLineLight min={ex.nl.min} max={ex.nl.max} ans={ex.nl.ans} />
        </div>
      )}

      {/* MINI-CÓMIC STORYBOARD INTERACTIVO DE 3 PANELES */}
      {sbConfig && <StoryboardRenderer cfg={sbConfig} />}

      {/* Explicación didáctica */}
      {ex.explain && (
        <div
          className="ex-explain"
          style={{
            background: '#FFF8E0',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            border: '1.5px solid #F5C518',
            color: '#3A2000',
            marginTop: '0.75rem',
            fontSize: '13.5px',
            lineHeight: 1.5,
            fontWeight: 800,
          }}
        >
          💡 {ex.explain}
        </div>
      )}
    </div>
  );
}

function NumberLineLight({ min, max, ans }: { min: number; max: number; ans: number }) {
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', minWidth: 'max-content' }}>
        {ticks.map((n, i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 28 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: '#1a1a1a' }}>{n}</span>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: n === ans ? '#FF8C2A' : '#FFE9C8',
                  border: `2px solid ${n === ans ? '#B84D00' : 'rgba(232,101,10,.35)'}`,
                  boxShadow: n === ans ? '0 0 10px rgba(255,140,42,0.6)' : 'none',
                }}
              />
            </div>
            {i < ticks.length - 1 && (
              <div style={{ height: 2, background: 'rgba(232,101,10,.35)', flex: 1, minWidth: 10, marginBottom: 10 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
