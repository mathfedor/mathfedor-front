'use client';

import { useState } from 'react';
import { FEDOR_EXCEL_REFERENCE, ConceptTopic } from '../data/fedorConceptsData';

interface ConceptosFedorModalProps {
  onClose: () => void;
}

function classifyChunks(snippets: string[]) {
  const defs: string[] = [];
  const exs: string[] = [];
  const act: string[] = [];

  snippets.forEach((s) => {
    const low = s.toLowerCase();
    if (low.startsWith('ejemplo') || low.includes('ejemplo')) {
      exs.push(s);
    } else if (
      low.includes('digita') ||
      low.includes('contemos') ||
      low.includes('activid') ||
      low.includes('cuenta')
    ) {
      act.push(s);
    } else {
      defs.push(s);
    }
  });

  return { defs, exs, act };
}

export default function ConceptosFedorModal({ onClose }: ConceptosFedorModalProps) {
  const keys = Object.keys(FEDOR_EXCEL_REFERENCE);
  const [activeKey, setActiveKey] = useState<string>(keys[0] || 'addition');

  const topic: ConceptTopic | undefined = FEDOR_EXCEL_REFERENCE[activeKey];
  const { defs, exs, act } = topic ? classifyChunks(topic.snippets) : { defs: [], exs: [], act: [] };

  return (
    <div className="f1cp-bg" onClick={onClose}>
      <div className="f1cp-card" onClick={(e) => e.stopPropagation()}>
        <div className="f1cp-head">
          <span className="f1cp-head-ic">📚</span>
          <div className="f1cp-head-info">
            <div className="f1cp-head-title">Conceptos Fedor</div>
            <div className="f1cp-head-sub">Tomado del libro original de 1° de primaria</div>
          </div>
          <button className="f1cp-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="f1cp-body">
          <div className="f1cp-tabs">
            {keys.map((k) => {
              const t = FEDOR_EXCEL_REFERENCE[k];
              const shortTitle = t.title.split(' ').slice(0, 2).join(' ');
              return (
                <button
                  key={k}
                  className={`f1cp-tab ${activeKey === k ? 'on' : ''}`}
                  onClick={() => setActiveKey(k)}
                >
                  {t.emoji} {shortTitle}
                </button>
              );
            })}
          </div>

          <div id="f1cpContent">
            {!topic ? (
              <div className="f1cp-empty">No hay contenido.</div>
            ) : (
              <>
                {defs.length > 0 && (
                  <div className="f1cp-section">
                    <div className="f1cp-section-title">📖 Conceptos clave</div>
                    {defs.slice(0, 18).map((s, idx) => (
                      <div
                        key={idx}
                        className={`f1cp-snippet ${idx < 3 ? 'big' : ''}`}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}

                {exs.length > 0 && (
                  <div className="f1cp-section">
                    <div className="f1cp-section-title">🧮 Ejemplos del libro</div>
                    {exs.slice(0, 15).map((s, idx) => (
                      <div key={idx} className="f1cp-snippet">
                        {s}
                      </div>
                    ))}
                  </div>
                )}

                {act.length > 0 && (
                  <div className="f1cp-section">
                    <div className="f1cp-section-title">🎯 Actividades</div>
                    {act.slice(0, 12).map((s, idx) => (
                      <div key={idx} className="f1cp-snippet">
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
