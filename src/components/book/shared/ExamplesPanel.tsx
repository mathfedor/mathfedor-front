'use client';

import { useState } from 'react';
import Starfield from './Starfield';
import ProcedureModal from './ProcedureModal';
import type { LevelExample } from '@/types/book.types';
import { fedorTTS } from '@/services/tts.service';

import { bookService } from '@/services/book.service';

interface Props {
  examples: LevelExample[];
  exercisesCount: number;
  levelIndex: number;
  topicTitle: string;
  levelDesc: string;
  conceptText: string;
  onStart: () => void;
  firstExerciseQuestion?: string;
  firstExerciseAnswer?: string;
  firstExerciseExplain?: string;
  isGrade1?: boolean;
  levelKey?: string;
  slug?: string;
}

const LEVEL_META_GRADE2 = [
  { grad: 'linear-gradient(155deg,#0A3D28,#16876A,#0E5240)', headerTxt: '🟢 Nivel Básico', sub: 'Construye las bases del concepto', accent: '#24C496', badgeBg: '#16876A' },
  { grad: 'linear-gradient(155deg,#6A3200,#E8650A,#BA5500)', headerTxt: '🟡 Nivel Medio', sub: 'Desarrolla el pensamiento matemático', accent: '#FF8C2A', badgeBg: '#E8650A' },
  { grad: 'linear-gradient(155deg,#5A0A28,#C94B22,#8B1A00)', headerTxt: '🔴 Nivel Avanzado', sub: 'Domina la operación con precisión', accent: '#FF6B6B', badgeBg: '#C94B22' },
  { grad: 'linear-gradient(155deg,#7A3200,#C25400,#FF8C2A)', headerTxt: '🟠 Nivel Experto', sub: 'Reta tus límites con problemas difíciles', accent: '#FF8C2A', badgeBg: '#C25400' },
  { grad: 'linear-gradient(155deg,#3D0A60,#6A1B9A,#9B5CFF)', headerTxt: '🟣 Nivel Pruebas SABER', sub: 'Prepárate para las pruebas oficiales', accent: '#9B5CFF', badgeBg: '#6A1B9A' },
];

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

/** Panel de ejemplos resueltos — réplica fiel de `showExamplesPanel` del HTML. */
export default function ExamplesPanel({
  examples: propExamples,
  exercisesCount,
  levelIndex,
  topicTitle,
  levelDesc,
  conceptText,
  onStart,
  firstExerciseQuestion,
  firstExerciseAnswer,
  firstExerciseExplain,
  isGrade1,
  levelKey,
  slug,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const metaList = isGrade1 ? LEVEL_META_GRADE1 : LEVEL_META_GRADE2;
  const lm = metaList[levelIndex] ?? metaList[0];

  const examples = (propExamples && propExamples.length > 0)
    ? propExamples
    : (levelKey ? bookService.getExamplesSync(levelKey, slug) : []);

  const handleNarrateHeader = () => {
    fedorTTS.speak('Panel de ejemplos del Método Fedor. Observa los ejemplos resueltos antes de comenzar los ejercicios.');
  };

  return (
    <div
      className="exp2"
      style={{
        background: lm.grad,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 16px 45px rgba(0,0,0,0.35)',
        marginBottom: '1.5rem',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.15)',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <Starfield count={22} />

      <style>{`
        .exp2-vis-box svg {
          max-width: 560px !important;
          width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 0.5rem auto !important;
        }
      `}</style>

      {/* HEADER */}
      <div style={{ padding: '1.5rem 1.4rem 1rem', position: 'relative', zIndex: 1 }}>
        {/* Top button: 💻 PANEL DE EJEMPLOS - MÉTODO FEDOR 🔊 */}
        <button
          type="button"
          onClick={handleNarrateHeader}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11.5px',
            fontWeight: 900,
            color: '#FFE066',
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1.5px solid rgba(255, 224, 102, 0.4)',
            padding: '6px 14px',
            borderRadius: '20px',
            marginBottom: '1rem',
            cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif",
            transition: 'transform 0.15s',
          }}
          title="Escuchar introducción"
        >
          <span>💻 PANEL DE EJEMPLOS - MÉTODO FEDOR</span>
          <span style={{ fontSize: '14px' }}>🔊</span>
        </button>

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
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.8)', fontWeight: 700 }}>
              {levelDesc || lm.sub} - {topicTitle}
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
                color: '#FFE066',
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
      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, padding: '0 1.25rem 0.85rem', position: 'relative', zIndex: 1 }}>
        {CHARS.map((ch, i) => (
          <div key={ch.n} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 42, animation: `float ${3 + i * 0.4}s ease-in-out infinite` }}>{ch.e}</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,.85)', marginTop: 2 }}>{ch.n}</div>
          </div>
        ))}
      </div>

      {/* CONCEPT INSTRUCTION BAR */}
      <div
        style={{
          margin: '0 1.25rem 1rem',
          padding: '.85rem 1.2rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 14,
          borderLeft: `4px solid ${lm.accent}`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ fontSize: 14, color: '#ffffff', fontWeight: 800, lineHeight: 1.5, textAlign: 'left' }}>
          {conceptText || 'Aplica el método paso a paso.'}
        </div>
      </div>

      {/* EXAMPLE CARDS SECTION */}
      <div style={{ padding: '0 1.25rem .5rem', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            color: 'rgba(255,255,255,.75)',
            textTransform: 'uppercase',
            letterSpacing: '.1em',
            marginBottom: '.85rem',
            textAlign: 'left',
          }}
        >
          ✨ {examples.length} EJEMPLOS RESUELTOS
        </div>

        {examples.map((e, i) => (
          <ExampleCard key={i} ex={e} index={i + 1} badgeBg={lm.badgeBg} />
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
            background: 'linear-gradient(135deg, #FFE066, #FF8C2A)',
            color: '#1A0A3C',
            fontWeight: 900,
            fontSize: '18px',
            padding: '14px 40px',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(255, 140, 42, 0.4)',
            fontFamily: "'Nunito', sans-serif",
            transition: 'transform 0.15s',
          }}
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

function ExampleCard({ ex, index, badgeBg }: { ex: LevelExample; index: number; badgeBg?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNarrate = () => {
    fedorTTS.speak(
      `Ejemplo ${index}: ${ex.q}. Respuesta: ${ex.a}. ${
        ex.explain ? 'Explicación: ' + ex.explain.replace(/<[^>]+>/g, '') : ''
      }`
    );
  };

  const handleReplay = () => {
    setIsPlaying(true);
    fedorTTS.speak(`Ejemplo ${index}: ${ex.q}. Respuesta: ${ex.a}.`, () => setIsPlaying(false));
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1.5px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '18px',
        padding: '1.2rem',
        marginBottom: '1rem',
        position: 'relative',
        textAlign: 'left',
      }}
    >
      {/* Top row: Icon + Question + Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '20px' }}>{ex.icon || '💡'}</span>
        <div style={{ flex: 1, fontSize: '15px', fontWeight: 900, color: '#ffffff', lineHeight: 1.4 }}>
          {ex.q}
        </div>
        <div
          style={{
            background: badgeBg || '#16876A',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '14px',
            fontFamily: "'Baloo 2', sans-serif",
            padding: '2px 10px',
            borderRadius: '8px',
            flexShrink: 0,
          }}
        >
          {index}
        </div>
      </div>

      {/* Visual representation */}
      {ex.vis && (
        <div
          className="exp2-vis-box"
          style={{
            margin: '0.6rem 0',
            padding: '0.5rem',
            background: ex.vis.includes('<svg') ? 'transparent' : 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          dangerouslySetInnerHTML={{ __html: ex.vis }}
        />
      )}

      {/* Number line */}
      {ex.nl && (
        <div style={{ margin: '0.6rem 0', padding: '0.75rem', background: 'rgba(0,0,0,0.25)', borderRadius: '12px' }}>
          <NumberLine min={ex.nl.min} max={ex.nl.max} ans={ex.nl.ans} />
        </div>
      )}

      {/* Explanation procedure */}
      {ex.explain && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            border: '2px solid #F5C518',
            color: '#1A0A3C',
            marginTop: '0.75rem',
            fontSize: '13.5px',
            lineHeight: 1.55,
            fontWeight: 700,
          }}
          dangerouslySetInnerHTML={{ __html: ex.explain }}
        />
      )}

      {/* Controls Bar: 🔊 Escuchar & ▶ Reproducir */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginTop: '0.85rem',
          paddingTop: '0.6rem',
          borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
        }}
      >
        <button
          type="button"
          onClick={handleNarrate}
          style={{
            background: 'linear-gradient(135deg, #06B6D4, #10B981)',
            color: '#fff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            cursor: 'pointer',
          }}
          title="Escuchar ejemplo"
          aria-label="Escuchar el ejemplo"
        >
          🔊
        </button>

        <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>
          {isPlaying ? '▶ Reproduciendo...' : 'Presiona ▶ para ver el ejemplo'}
        </span>

        <button
          type="button"
          onClick={handleReplay}
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            color: '#fff',
            fontWeight: 900,
            fontSize: '12px',
            padding: '6px 14px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>▶</span>
          <span>Reproducir</span>
        </button>
      </div>
    </div>
  );
}

function NumberLine({ min, max, ans }: { min: number; max: number; ans: number }) {
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', minWidth: 'max-content' }}>
        {ticks.map((n, i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 28 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.9)' }}>{n}</span>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: n === ans ? '#FF8C2A' : 'rgba(255,255,255,0.15)',
                  border: `2px solid ${n === ans ? '#FFE066' : 'rgba(255,255,255,0.25)'}`,
                  boxShadow: n === ans ? '0 0 12px rgba(255,140,42,0.7)' : 'none',
                }}
              />
            </div>
            {i < ticks.length - 1 && (
              <div style={{ height: 2, background: 'rgba(255,255,255,0.2)', flex: 1, minWidth: 10, marginBottom: 10 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
