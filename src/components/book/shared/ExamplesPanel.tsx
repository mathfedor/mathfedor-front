'use client';

import type { LevelExample } from '@/types/book.types';

interface Props {
  examples: LevelExample[];
  levelLabel: string;
  topicTitle: string;
  topicIcon: string;
  onStart: () => void;
}

/**
 * Panel de ejemplos resueltos que se muestra antes de la práctica.
 * Réplica de `showExamplesPanel` del HTML: cada tarjeta muestra icono,
 * enunciado, visual (HTML/emoji), grupos o recta numérica y la explicación.
 */
export default function ExamplesPanel({ examples, levelLabel, topicTitle, topicIcon, onStart }: Props) {
  return (
    <div className="examples-panel">
      <div className="ex-panel-head">
        <div className="ex-panel-kicker">{topicIcon} {topicTitle}</div>
        <div className="ex-panel-title">📚 Aprende con ejemplos</div>
        <div className="ex-panel-sub">{levelLabel} · Mira cómo se resuelve, luego practica</div>
      </div>

      {examples.length === 0 ? (
        <div className="ex-panel-empty">Este nivel va directo a la práctica. ¡Tú puedes! 💪</div>
      ) : (
        <div className="ex-cards">
          {examples.map((ex, i) => (
            <ExampleCard key={i} ex={ex} index={i} total={examples.length} />
          ))}
        </div>
      )}

      <button className="btn-launch" style={{ marginTop: '1rem' }} onClick={onStart}>
        ✏️ ¡Empezar la práctica!
      </button>
    </div>
  );
}

function ExampleCard({ ex, index, total }: { ex: LevelExample; index: number; total: number }) {
  return (
    <div className="example-card">
      <div className="example-card-top">
        <span className="example-icon">{ex.icon}</span>
        <span className="example-step">Ejemplo {index + 1}/{total}</span>
      </div>

      <div className="example-q">{ex.q}</div>

      {ex.vis && <div className="example-vis" dangerouslySetInnerHTML={{ __html: ex.vis }} />}
      {ex.groups && <GroupsVisual groups={ex.groups} />}
      {ex.nl && <NumberLine min={ex.nl.min} max={ex.nl.max} ans={ex.nl.ans} />}

      {ex.explain && <div className="example-explain" dangerouslySetInnerHTML={{ __html: ex.explain }} />}

      <div className="example-answer">Respuesta: <strong>{ex.a}</strong></div>
    </div>
  );
}

/* ── Visual de grupos (multiplicación / división) ─────────────── */
function GroupsVisual({ groups }: { groups: Record<string, unknown> }) {
  const num = (v: unknown, d = 0) => (typeof v === 'number' ? v : d);
  const str = (v: unknown, d = '') => (typeof v === 'string' ? v : d);
  const a = num(groups.a);
  const b = num(groups.b);
  const op = str(groups.op, '+');
  const e = str(groups.e, '🔵');
  const e2 = str(groups.e2, op === '÷' ? '🙍' : e);
  const r = groups.r;

  if (op === '÷') {
    return (
      <div className="example-groups">
        <div className="eg-items">{Array.from({ length: a }, (_, i) => <span key={i}>{e}</span>)}</div>
        <span className="eg-op">÷</span>
        <div className="eg-people">{Array.from({ length: b }, (_, i) => <span key={i}>{e2}</span>)}</div>
        <span className="eg-res">= {String(r ?? '')}</span>
      </div>
    );
  }
  if (op === '×') {
    return (
      <div className="example-groups eg-mul">
        <div className="eg-grid">
          {Array.from({ length: b }, (_, rr) => (
            <div className="eg-row" key={rr}>{Array.from({ length: a }, (_, cc) => <span key={cc}>{e}</span>)}</div>
          ))}
        </div>
        <div className="eg-caption">{b} grupos de {a} = {String(r ?? a * b)}</div>
      </div>
    );
  }
  // suma
  return (
    <div className="example-groups">
      <div className="eg-items">{Array.from({ length: a }, (_, i) => <span key={i}>{e}</span>)}</div>
      <span className="eg-op">+</span>
      <div className="eg-items">{Array.from({ length: b }, (_, i) => <span key={i}>{e2}</span>)}</div>
      <span className="eg-res">= {String(r ?? a + b)}</span>
    </div>
  );
}

/* ── Recta numérica ───────────────────────────────────────────── */
function NumberLine({ min, max, ans }: { min: number; max: number; ans: number }) {
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div className="example-numline">
      {ticks.map((t) => (
        <div key={t} className={`nl-tick${t === ans ? ' nl-active' : ''}`}>
          <span className="nl-dot" />
          <span className="nl-num">{t}</span>
        </div>
      ))}
    </div>
  );
}
