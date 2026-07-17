'use client';

import { useState } from 'react';
import Starfield from './Starfield';
import ProcedureModal from './ProcedureModal';
import type { LevelExample } from '@/types/book.types';

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
}

const LEVEL_META_GRADE2 = [
  { grad: 'linear-gradient(155deg,#0A3D28,#16876A,#0E5240)', headerTxt: '🟢 Nivel Básico', sub: 'Construye las bases del concepto', accent: '#24C496' },
  { grad: 'linear-gradient(155deg,#6A3200,#E8650A,#BA5500)', headerTxt: '🟡 Nivel Medio', sub: 'Desarrolla el pensamiento matemático', accent: '#FF8C2A' },
  { grad: 'linear-gradient(155deg,#5A0A28,#C94B22,#8B1A00)', headerTxt: '🔴 Nivel Avanzado', sub: 'Domina la operación con precisión', accent: '#FF6B6B' },
  { grad: 'linear-gradient(155deg,#7A3200,#C25400,#FF8C2A)', headerTxt: '🟠 Nivel Experto', sub: 'Reta tus límites con problemas difíciles', accent: '#FF8C2A' },
  { grad: 'linear-gradient(155deg,#3D0A60,#6A1B9A,#9B5CFF)', headerTxt: '🟣 Nivel Pruebas SABER', sub: 'Prepárate para las pruebas oficiales', accent: '#9B5CFF' },
];

const LEVEL_META_GRADE1 = [
  { grad: 'linear-gradient(155deg,#0A3D28,#16876A,#0E5240)', headerTxt: '🟢 Nivel Básico', sub: 'Construye las bases del concepto', accent: '#24C496' },
  { grad: 'linear-gradient(155deg,#6A3200,#E8650A,#BA5500)', headerTxt: '🟡 Nivel Medio', sub: 'Desarrolla el pensamiento matemático', accent: '#FF8C2A' },
  { grad: 'linear-gradient(155deg,#5A0A28,#C94B22,#8B1A00)', headerTxt: '🔴 Nivel Avanzado', sub: 'Domina la operación con precisión', accent: '#FF6B6B' },
  { grad: 'linear-gradient(155deg,#2A0F60,#7B2FBE,#1A0848)', headerTxt: '🟣 Nivel Experto', sub: 'Reta tu mente con problemas más exigentes', accent: '#A864E8' },
  { grad: 'linear-gradient(155deg,#7A4A00,#F5C518,#E8650A)', headerTxt: '🏆 Evaluación Final', sub: '20 preguntas que cubren los 4 niveles', accent: '#F5C518' },
];

const CHARS = [
  { e: '🧑‍🚀', n: 'Math' },
  { e: '👩‍🚀', n: 'Sumy' },
  { e: '👦', n: 'Jack' },
];

/** Panel de ejemplos resueltos — réplica fiel de `showExamplesPanel` del HTML. */
export default function ExamplesPanel({ examples, exercisesCount, levelIndex, topicTitle, levelDesc, conceptText, onStart, firstExerciseQuestion, firstExerciseAnswer, firstExerciseExplain, isGrade1 }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const metaList = isGrade1 ? LEVEL_META_GRADE1 : LEVEL_META_GRADE2;
  const lm = metaList[levelIndex] ?? metaList[0];

  return (
    <div className="exp2" style={{ background: lm.grad, borderRadius: 22, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,.3)', marginBottom: '1rem', position: 'relative' }}>
      <Starfield count={22} />

      {/* STYLES OVERRIDES */}
      <style>{`
        .examples-card-clean {
          background: #fff !important;
          border: 2.5px solid #FF8C2A !important;
          color: #1a1a1a !important;
          border-radius: 16px !important;
          padding: 1rem !important;
          margin-bottom: .75rem !important;
          box-shadow: 0 4px 14px rgba(232,101,10,.18) !important;
          text-align: left;
        }
        .examples-card-clean * {
          color: inherit;
        }
        .examples-card-clean .ex-q-label {
          font-size: 14px !important;
          font-weight: 900 !important;
          color: #1a1a1a !important;
          line-height: 1.45 !important;
        }
        .examples-card-clean .ex-a-pill {
          background: linear-gradient(135deg,#FFD699,#FF8C2A) !important;
          color: #3d1d00 !important;
          border: 1.5px solid #B84D00 !important;
          font-weight: 900 !important;
          font-family: 'Baloo 2', sans-serif !important;
          padding: 4px 14px !important;
          border-radius: 10px !important;
          font-size: 20px !important;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .examples-card-clean .ex-explain {
          background: #FFF6E8 !important;
          border-left: 4px solid #FF8C2A !important;
          color: #3d1d00 !important;
          font-size: 12px !important;
          padding: .5rem .65rem !important;
          border-radius: 8px !important;
          margin-top: .5rem !important;
          text-align: left;
        }
        .examples-card-clean .ex-explain * {
          color: inherit;
        }
        .examples-card-clean .ex-vis {
          background: #FFFBF2 !important;
          border: 1.5px solid rgba(232,101,10,.35) !important;
          color: #1a1a1a !important;
          border-radius: 12px !important;
          padding: .6rem !important;
          margin: .5rem 0 !important;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          font-size: 42px !important;
          line-height: 1.3 !important;
        }
        .examples-card-clean .ex-vis svg, .examples-card-clean .ex-vis img {
          max-width: 100% !important;
          height: auto !important;
        }
      `}</style>

      {/* HEADER */}
      <div style={{ padding: '1.5rem 1.25rem 1rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 900, color: 'rgba(245,197,24,.9)', textTransform: 'uppercase', letterSpacing: '.12em', background: 'rgba(245,197,24,.15)', border: '1px solid rgba(245,197,24,.35)', padding: '4px 12px', borderRadius: 20, marginBottom: '0.85rem' }}>
          📖 PANEL DE EJEMPLOS · MÉTODO FEDOR
        </div>
        
        {/* Paso 1 / Paso 2 indicator */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, marginBottom: '1rem', background: 'rgba(255,255,255,.06)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,.12)' }}>
          <div style={{ flex: 1, padding: '.55rem .65rem', background: 'rgba(245,197,24,.18)', borderRight: '1px solid rgba(255,255,255,.1)' }}>
            <div style={{ fontSize: '9px', fontWeight: 900, color: '#FFE066', letterSpacing: '.12em' }}>PASO 1 · AHORA</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginTop: '1px' }}>👀 Mira los ejemplos</div>
          </div>
          <div style={{ flex: 1, padding: '.55rem .65rem', background: 'rgba(255,255,255,.04)', opacity: 0.7 }}>
            <div style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(255,255,255,.65)', letterSpacing: '.12em' }}>PASO 2 · DESPUÉS</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,.85)', marginTop: '1px' }}>🎮 Resuelve los ejercicios</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 2 }}>{lm.headerTxt}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }}>{(levelDesc || lm.sub)} - {topicTitle}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 700 }}>EJERCICIOS</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#FF8C2A', fontFamily: "'Baloo 2',sans-serif" }}>{exercisesCount}</div>
          </div>
        </div>
      </div>

      {/* CHARACTERS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, padding: '0 1.25rem .75rem', position: 'relative', zIndex: 1 }}>
        {CHARS.map((ch, i) => (
          <div key={ch.n} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, animation: `float ${3 + i * 0.4}s ease-in-out infinite` }}>{ch.e}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,.7)', marginTop: 4 }}>{ch.n}</div>
          </div>
        ))}
      </div>

      {/* CONCEPT */}
      <div style={{ margin: '0 1.25rem .75rem', padding: '.85rem 1rem', background: 'rgba(255,255,255,.1)', borderRadius: 14, borderLeft: `4px solid ${lm.accent}`, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.9)', fontWeight: 700, lineHeight: 1.6, textAlign: 'left' }}>{conceptText || 'Aplica el método paso a paso.'}</div>
      </div>

      {/* EXAMPLE CARDS */}
      <div style={{ padding: '0 1.25rem .5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.65rem', textAlign: 'left' }}>
          ✨ {examples.length} ejemplos resueltos
        </div>
        {examples.map((e, i) => (
          <ExampleCard key={i} ex={e} />
        ))}
      </div>

      {/* START BUTTON */}
      <div style={{ padding: '.75rem 1.25rem 1.5rem', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <button
          onClick={onStart}
          style={{ width: '100%', padding: 14, fontSize: 16, fontWeight: 900, background: 'linear-gradient(135deg,#F5C518,#FF8C2A)', color: '#2A0F60', border: 'none', borderRadius: 16, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", boxShadow: '0 8px 24px rgba(245,197,24,.4)' }}
        >
          🎮 ¡Empezar {exercisesCount} ejercicios!
        </button>

        {firstExerciseQuestion && (
          <button
            onClick={() => setModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #6C28B4, #9B5CFF)',
              color: '#fff',
              border: '2px solid #fff',
              borderRadius: '22px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(108,40,180,0.3)',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            💡 Ver procedimiento
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

function ExampleCard({ ex }: { ex: LevelExample }) {
  return (
    <div className="examples-card-clean">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: ex.vis || ex.nl ? '.5rem' : '0' }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: '#FF8C2A',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(232,101,10,.4)'
        }}>
          {ex.icon || '⭐'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="ex-q-label">{ex.q}</div>
        </div>
        <div className="ex-a-pill">
          {ex.a}
        </div>
      </div>

      {ex.vis && (
        <div
          className="ex-vis"
          dangerouslySetInnerHTML={{ __html: ex.vis }}
        />
      )}

      {ex.nl && (
        <div className="ex-vis">
          <NumberLine min={ex.nl.min} max={ex.nl.max} ans={ex.nl.ans} />
        </div>
      )}

      {ex.explain && (() => {
        const isHtml = ex.explain.trim().startsWith('<');
        return (
          <div
            className={isHtml ? "" : "ex-explain"}
            style={isHtml ? { marginTop: '0.5rem' } : undefined}
            dangerouslySetInnerHTML={{ __html: isHtml ? ex.explain : `💡 ${ex.explain}` }}
          />
        );
      })()}
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
              <span style={{ fontSize: 11, fontWeight: 900, color: '#1a1a1a' }}>{n}</span>
              <div style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: n === ans ? '#FF8C2A' : '#FFE9C8',
                border: `2px solid ${n === ans ? '#B84D00' : 'rgba(232,101,10,.35)'}`,
                boxShadow: n === ans ? '0 0 12px rgba(232,101,10,.55)' : 'none'
              }} />
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
