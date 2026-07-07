'use client';

import Starfield from './Starfield';
import type { LevelExample } from '@/types/book.types';

interface Props {
  examples: LevelExample[];
  levelIndex: number;
  topicTitle: string;
  conceptText: string;
  onStart: () => void;
}

const LEVEL_META = [
  { grad: 'linear-gradient(155deg,#0A3D28,#16876A,#0E5240)', headerTxt: '🟢 Nivel Básico', sub: 'Construye las bases del concepto', accent: '#24C496' },
  { grad: 'linear-gradient(155deg,#6A3200,#E8650A,#BA5500)', headerTxt: '🟡 Nivel Medio', sub: 'Desarrolla el pensamiento matemático', accent: '#FF8C2A' },
  { grad: 'linear-gradient(155deg,#5A0A28,#C94B22,#8B1A00)', headerTxt: '🔴 Nivel Avanzado', sub: 'Domina la operación con precisión', accent: '#FF6B6B' },
  { grad: 'linear-gradient(155deg,#7A3200,#C25400,#FF8C2A)', headerTxt: '🟠 Nivel Experto', sub: 'Reta tus límites con problemas difíciles', accent: '#FF8C2A' },
  { grad: 'linear-gradient(155deg,#3D0A60,#6A1B9A,#9B5CFF)', headerTxt: '🟣 Nivel Pruebas SABER', sub: 'Prepárate para las pruebas oficiales', accent: '#9B5CFF' },
];

const CHARS = [
  { e: '🧑‍🚀', n: 'Math' },
  { e: '👩‍🚀', n: 'Sumy' },
  { e: '👦', n: 'Jack' },
];

/** Panel de ejemplos resueltos — réplica fiel de `showExamplesPanel` del HTML. */
export default function ExamplesPanel({ examples, levelIndex, topicTitle, conceptText, onStart }: Props) {
  const lm = LEVEL_META[levelIndex] ?? LEVEL_META[0];

  return (
    <div className=" exp2" style={{ background: lm.grad, borderRadius: 22, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,.3)', marginBottom: '1rem', position: 'relative' }}>
      <Starfield count={22} />

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
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }}>{lm.sub} · {topicTitle}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 700 }}>EJERCICIOS</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#FF8C2A', fontFamily: "'Baloo 2',sans-serif" }}>{examples.length}</div>
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
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.9)', fontWeight: 700, lineHeight: 1.6 }}>{conceptText || 'Aplica el método paso a paso.'}</div>
      </div>

      {/* EXAMPLE CARDS */}
      <div style={{ padding: '0 1.25rem .5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.65rem' }}>
          ✨ {examples.length} ejemplos resueltos
        </div>
        {examples.map((e, i) => (
          <ExampleCard key={i} ex={e} index={i} />
        ))}
      </div>

      {/* START BUTTON */}
      <div style={{ padding: '.75rem 1.25rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <button
          onClick={onStart}
          style={{ width: '100%', padding: 14, fontSize: 16, fontWeight: 900, background: 'linear-gradient(135deg,#F5C518,#FF8C2A)', color: '#2A0F60', border: 'none', borderRadius: 16, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", boxShadow: '0 8px 24px rgba(245,197,24,.4)' }}
        >
          🎮 ¡Empezar {examples.length} ejercicios!
        </button>
      </div>
    </div>
  );
}

function ExampleCard({ ex, index }: { ex: LevelExample; index: number }) {
  return (
    <div style={{ background: '#fff', border: '2px solid #FF8C2A', borderRadius: 16, padding: '1rem', marginBottom: '.65rem', color: '#333', boxShadow: '0 6px 16px rgba(0,0,0,.08)', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: ex.vis || ex.nl ? '.5rem' : 0, flexWrap: 'wrap' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#FF8C2A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, flexShrink: 0 }}>
          {index + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#2A0F60', lineHeight: 1.45, wordWrap: 'break-word' }}>{ex.q}</div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', background: '#FF8C2A', padding: '4px 12px', borderRadius: 8, flexShrink: 0 }}>
          {ex.a}
        </div>
      </div>

      {ex.vis && <div className="ex2-vis" style={{ color: '#333', margin: '.5rem 0' }} dangerouslySetInnerHTML={{ __html: ex.vis }} />}
      {ex.nl && <NumberLine min={ex.nl.min} max={ex.nl.max} ans={ex.nl.ans} />}

      {ex.explain && (
        <div
          style={{ fontSize: 14, color: '#1A0A3C', marginTop: '.7rem', padding: '.85rem 1rem', background: '#FFF8DC', borderRadius: 10, border: '2px solid rgba(245,197,24,.5)', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: ex.explain }}
        />
      )}
    </div>
  );
}

function NumberLine({ min, max, ans }: { min: number; max: number; ans: number }) {
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div style={{ overflowX: 'auto', margin: '.5rem 0', padding: '.65rem', background: 'rgba(0,0,0,.2)', borderRadius: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        {ticks.map((n, i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 28 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,.85)' }}>{n}</span>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: n === ans ? '#FF8C2A' : 'rgba(255,255,255,.15)', border: `2px solid ${n === ans ? '#FFE066' : 'rgba(255,255,255,.3)'}` }} />
            </div>
            {i < ticks.length - 1 && <div style={{ height: 2, background: 'rgba(255,255,255,.2)', flex: 1, minWidth: 10, marginBottom: 10 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
