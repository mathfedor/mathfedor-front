'use client';

import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  answer: string;
  explainHtml?: string;
}

function deriveTitle(q: string): string {
  const l = (q || '').toLowerCase();
  if (/mayor|menor|compara|m.s grande|m.s peque/.test(l)) return 'Comparemos los números';
  if (/despu.s|siguiente|sigue/.test(l)) return 'Número posterior';
  if (/antes|anterior/.test(l)) return 'Número anterior';
  if (/entre/.test(l)) return 'Número intermedio';
  if (/cuenta|cu.ntos elementos|cu.ntos|cu.ntas/.test(l)) return '¡Vamos a contar!';
  if (/decena/.test(l)) return 'La Decena';
  if (/docena/.test(l)) return 'La Docena';
  if (/centena/.test(l)) return 'La Centena';
  if (/\+|suma/.test(l)) return 'Vamos a sumar';
  if (/\-|−|resta/.test(l)) return 'Vamos a restar';
  if (/×|veces/.test(l)) return 'Vamos a multiplicar';
  if (/÷|repart|divid/.test(l)) return 'Vamos a repartir';
  if (/per.metro/.test(l)) return 'Perímetro';
  if (/punto|l.nea|recta/.test(l)) return 'Geometría';
  return 'Resolvamos paso a paso';
}

function deriveInstr(q: string): string {
  const l = (q || '').toLowerCase();
  if (/cu.ntos elementos|cuenta/.test(l)) return 'Lee con atención y cuenta cada elemento.';
  if (/despu.s|antes|siguiente|sigue/.test(l)) return 'Seguimos la secuencia de los números.';
  if (/entre/.test(l)) return 'Busca el número que está en medio.';
  if (/mayor|menor|compara/.test(l)) return 'Compara las cantidades para escoger la correcta.';
  if (/decena|docena|centena/.test(l)) return 'Recuerda el valor posicional.';
  if (/\+|suma/.test(l)) return 'Suma con cuidado las cantidades.';
  if (/\-|−|resta/.test(l)) return 'Resta con cuidado las cantidades.';
  if (/×|veces/.test(l)) return 'Multiplica con orden, paso a paso.';
  if (/÷|repart|divid/.test(l)) return 'Reparte en partes iguales.';
  return 'Lee la pregunta y piensa paso a paso.';
}

function deriveProcedure(q: string, a: string): string {
  const l = (q || '').toLowerCase();
  let m = (q || '').match(/(\d+)\s*([\+\-−×÷xX])\s*(\d+)/);
  if (m) {
    const n1 = parseInt(m[1], 10), n2 = parseInt(m[3], 10);
    const sym = m[2];
    if (sym === '+') return `Sumamos: ${n1} + ${n2} = ${a}.`;
    if (sym === '-' || sym === '−') return `Restamos: ${n1} − ${n2} = ${a}.`;
    if (sym === '×' || sym === 'x' || sym === 'X') return `Multiplicamos: ${n1} × ${n2} = ${a}.`;
    if (sym === '÷') return `Repartimos: ${n1} ÷ ${n2} = ${a}.`;
  }
  m = (q || '').match(/mayor.*?(\d+)\s*[ou]\s*(\d+)/i);
  if (m) {
    const a1 = parseInt(m[1], 10), a2 = parseInt(m[2], 10);
    return `Comparamos ${a1} y ${a2}. El mayor es ${Math.max(a1, a2)}.`;
  }
  m = (q || '').match(/menor.*?(\d+)\s*[ou]\s*(\d+)/i);
  if (m) {
    const b1 = parseInt(m[1], 10), b2 = parseInt(m[2], 10);
    return `Comparamos ${b1} y ${b2}. El menor es ${Math.min(b1, b2)}.`;
  }
  m = (q || '').match(/despu.s.*?(\d+)/i);
  if (m) {
    const n = parseInt(m[1], 10);
    return `El número que va después de ${n} es ${n} + 1 = ${n + 1}.`;
  }
  m = (q || '').match(/antes.*?(\d+)/i);
  if (m) {
    const n = parseInt(m[1], 10);
    return `El número que va antes de ${n} es ${n} − 1 = ${n - 1}.`;
  }
  m = (q || '').match(/entre.*?(\d+).*?(\d+)/i);
  if (m) {
    const c1 = parseInt(m[1], 10), c2 = parseInt(m[2], 10);
    const mid = Math.floor((c1 + c2) / 2);
    return `Los números en orden son ${c1}, ${c1 + 1}, ${c1 + 2}. El que está entre ${c1} y ${c2} es ${mid}.`;
  }
  if (/decena/.test(l)) return `Una decena son 10 unidades. Por eso la respuesta es ${a}.`;
  if (/docena/.test(l)) return `Una docena son 12 unidades. Por eso la respuesta es ${a}.`;
  if (/centena/.test(l)) return `Una centena son 100 unidades. Por eso la respuesta es ${a}.`;
  if (/cu.ntos elementos|cuenta/.test(l)) {
    const total = parseInt(a, 10) || 5;
    const seq = Array.from({ length: Math.min(total, 15) }, (_, i) => i + 1).join(', ');
    return `Contamos uno a uno: ${seq}. Total: ${a}.`;
  }
  return `Resolvamos con calma. La respuesta correcta es ${a}.`;
}

export default function ProcedureModal({ isOpen, onClose, question, answer, explainHtml }: Props) {
  const [showAnswer, setShowAnswer] = useState(false);

  if (!isOpen) return null;

  const derivedTitle = deriveTitle(question);
  const derivedInstr = deriveInstr(question);
  const derivedProc = deriveProcedure(question, answer);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: '#FFFDF0',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '500px',
        border: '3px solid #FFB84D',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
        position: 'relative'
      }}>
        {/* HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #FFB84D, #FF8C2A)',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '3px solid #FFB84D',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px' }}>💡</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', fontFamily: "'Baloo 2', sans-serif", lineHeight: 1.2 }}>Procedimiento</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Resolvamos juntos paso a paso</div>
            </div>
          </div>
          <button
            onClick={() => {
              setShowAnswer(false);
              onClose();
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#fff',
              border: '2px solid #FF8C2A',
              color: '#FF8C2A',
              fontSize: '18px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            ×
          </button>
        </div>

        {/* CONTENT */}
        <div style={{ padding: '1.25rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Question box */}
          <div style={{
            background: '#EEEDFE',
            border: '2px solid #D5C9FF',
            borderRadius: '16px',
            padding: '.85rem 1.25rem',
            marginBottom: '1rem',
            fontSize: '16px',
            fontWeight: 900,
            color: '#2A0F60',
            textAlign: 'center',
            fontFamily: "'Baloo 2', sans-serif",
          }}>
            {question}
          </div>

          {/* Explain content (HTML or derived) */}
          {explainHtml ? (
            <div
              className={`explain-container ${showAnswer ? 'show-answer' : ''}`}
              dangerouslySetInnerHTML={{ __html: explainHtml }}
              style={{ textAlign: 'left' }}
            />
          ) : (
            <div style={{ textAlign: 'left' }}>
              {/* Derived blocks */}
              <div style={{ background: '#E0F7FF', borderLeft: '5px solid #1A6CB4', padding: '.55rem .85rem', borderRadius: '10px', marginBottom: '.55rem', fontWeight: 900, color: '#0A3A6A', fontSize: '15px', lineHeight: 1.35 }}>
                👋 {derivedTitle}
              </div>
              <div style={{ background: '#FFF8DC', borderLeft: '5px solid #F5C518', padding: '.55rem .85rem', borderRadius: '10px', marginBottom: '.55rem', fontWeight: 800, color: '#7A3200', fontSize: '14px', lineHeight: 1.4 }}>
                📖 Instrucción: {derivedInstr}
              </div>
              <div style={{ background: '#FFFFFF', border: '2px solid #FFB066', padding: '.65rem .85rem', borderRadius: '10px', marginBottom: '.55rem', fontWeight: 800, color: '#1a1a1a', fontSize: '15px', lineHeight: 1.5 }}>
                🧮 Procedimiento: {derivedProc}
              </div>
              {showAnswer && (
                <div style={{ background: '#FFE9C4', borderLeft: '5px solid #FF8A1F', padding: '.55rem .85rem', borderRadius: '10px', fontWeight: 900, color: '#7A1B00', fontSize: '15px', lineHeight: 1.4, marginTop: '1rem', animation: 'slideDown 0.3s ease-out' }}>
                  ✅ Respuesta: <strong>{answer}</strong>
                </div>
              )}
            </div>
          )}

          {/* CSS to control the last child (answer block) visibility when explainHtml is used */}
          <style>{`
            .explain-container > div {
              border-radius: 12px !important;
              padding: .75rem 1rem !important;
              font-size: 14px !important;
              line-height: 1.5 !important;
              margin-bottom: .75rem !important;
              box-shadow: 0 4px 10px rgba(0,0,0,0.03) !important;
            }
            .explain-container > div:last-child {
              display: none !important;
              margin-top: 1rem !important;
              border: 2.5px solid #24C496 !important;
              background: #DCF5EE !important;
              color: #054F38 !important;
            }
            .explain-container.show-answer > div:last-child {
              display: block !important;
              animation: slideDown 0.3s ease-out;
            }
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* SHOW ANSWER BUTTON */}
          {!showAnswer && (
            <button
              onClick={() => setShowAnswer(true)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#24C496',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(36,196,150,0.3)',
                marginTop: '1rem',
                transition: 'all 0.2s',
              }}
            >
              👁️ Mostrar respuesta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
