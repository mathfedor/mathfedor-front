'use client';

import { useState, useEffect } from 'react';
import { FEDOR_EXCEL_REFERENCE, ConceptTopic } from '../data/fedorConceptsData';

interface ConceptosFedorModalProps {
  onClose: () => void;
}

function classifyChunks(snippets: string[]) {
  const defs: string[] = [];
  const exs: string[] = [];
  const act: string[] = [];

  snippets.forEach((s) => {
    const low = s.toLowerCase().trim();
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

function getShortTitle(key: string, title: string): string {
  if (key === 'addition') return 'Adición o';
  if (key === 'subtraction') return 'Sustracción o';
  if (key === 'multiplication') return 'Multiplicación';
  if (key === 'division') return 'División';
  if (key === 'problems') return 'Problemas';
  if (key === 'magnitudes_direct') return 'Magnitudes Directamente';
  if (key === 'magnitudes_inverse') return 'Magnitudes Inversamente';
  if (key === 'geometry_points') return 'Geometría ·';
  if (key === 'geometry_perimeter') return 'Perímetro y';
  return title.split(' ').slice(0, 2).join(' ');
}

export default function ConceptosFedorModal({ onClose }: ConceptosFedorModalProps) {
  const keys = Object.keys(FEDOR_EXCEL_REFERENCE);
  const [activeKey, setActiveKey] = useState<string>(keys[0] || 'addition');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const topic: ConceptTopic | undefined = FEDOR_EXCEL_REFERENCE[activeKey];
  const { defs, exs, act } = topic
    ? classifyChunks(topic.snippets)
    : { defs: [], exs: [], act: [] };

  // Cancel speech on unmount or tab change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeKey]);

  const handleSpeak = (textToRead: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(textToRead);
      u.lang = 'es-ES';
      u.rate = 0.92;
      u.pitch = 1.0;
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(u);
    }
  };

  const fullTextToRead = topic
    ? `${topic.title}. ${defs.slice(0, 15).join('. ')}`
    : '';

  return (
    <div className="f1cp-bg" onClick={onClose}>
      {/* Scoped CSS ensuring styles are immune to any external resets like .fedor-book * */}
      <style>{`
        .f1cp-bg {
          position: fixed !important;
          inset: 0 !important;
          z-index: 99999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 16px !important;
          background: rgba(14, 8, 48, 0.85) !important;
          backdrop-filter: blur(8px) !important;
          user-select: none !important;
          font-family: 'Nunito', sans-serif !important;
          animation: f1cp_slideUp 0.25s ease-out !important;
        }

        @keyframes f1cp_slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .f1cp-card {
          background: #FFFCEF !important;
          border-radius: 28px !important;
          max-width: 860px !important;
          width: 100% !important;
          max-height: 92vh !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6) !important;
          border: 3px solid #FFE066 !important;
        }

        .f1cp-head {
          background: linear-gradient(135deg, #D97706 0%, #EAB308 50%, #FACC15 100%) !important;
          color: #ffffff !important;
          padding: 14px 20px !important;
          display: flex !important;
          align-items: center !important;
          gap: 14px !important;
          font-family: 'Baloo 2', sans-serif !important;
          text-align: left !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          flex-shrink: 0 !important;
        }

        .f1cp-head-ic {
          width: 40px !important;
          height: 40px !important;
          flex-shrink: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25)) !important;
        }

        .f1cp-head-info {
          flex: 1 !important;
        }

        .f1cp-head-title {
          font-size: 22px !important;
          font-weight: 900 !important;
          line-height: 1.15 !important;
          color: #ffffff !important;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25) !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .f1cp-head-sub {
          font-size: 13px !important;
          font-weight: 700 !important;
          color: rgba(255, 255, 255, 0.95) !important;
          margin: 2px 0 0 0 !important;
          padding: 0 !important;
        }

        .f1cp-close {
          background: #FDF0C2 !important;
          border: none !important;
          color: #92400E !important;
          font-size: 26px !important;
          width: 38px !important;
          height: 38px !important;
          border-radius: 50% !important;
          cursor: pointer !important;
          font-weight: 900 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.2s !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) !important;
          flex-shrink: 0 !important;
        }

        .f1cp-close:hover {
          background: #ffffff !important;
          transform: scale(1.08) !important;
        }

        .f1cp-body {
          padding: 16px 20px 24px 20px !important;
          overflow-y: auto !important;
          flex: 1 !important;
          background: linear-gradient(180deg, #FFF8E0 0%, #FFFCEF 100%) !important;
        }

        .f1cp-tabs {
          display: grid !important;
          grid-template-columns: repeat(5, 1fr) !important;
          gap: 8px !important;
          margin: 0 0 16px 0 !important;
          padding: 0 !important;
        }

        @media (max-width: 768px) {
          .f1cp-tabs {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .f1cp-tabs {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        .f1cp-tab {
          min-width: 0 !important;
          background: #FDF3DE !important;
          border: 2px solid #E9D5B5 !important;
          color: #7A3200 !important;
          font-weight: 900 !important;
          font-size: 12px !important;
          padding: 9px 8px !important;
          border-radius: 14px !important;
          cursor: pointer !important;
          font-family: 'Nunito', sans-serif !important;
          text-align: center !important;
          line-height: 1.2 !important;
          transition: all 0.15s !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
          margin: 0 !important;
        }

        .f1cp-tab:hover {
          background: #FCECD0 !important;
          transform: translateY(-1px) !important;
        }

        .f1cp-tab.on {
          background: linear-gradient(135deg, #C27803 0%, #E59A18 100%) !important;
          color: #ffffff !important;
          border-color: #9A5A00 !important;
          box-shadow: 0 4px 12px rgba(186, 117, 23, 0.35) !important;
          transform: scale(1.02) !important;
        }

        .f1cp-section {
          background: #ffffff !important;
          border: 2px solid #FED7AA !important;
          border-radius: 18px !important;
          padding: 18px 20px !important;
          margin: 0 0 16px 0 !important;
          box-shadow: 0 4px 16px rgba(255, 150, 50, 0.08) !important;
          text-align: left !important;
        }

        .f1cp-section-title {
          font-family: 'Baloo 2', sans-serif !important;
          font-size: 20px !important;
          font-weight: 900 !important;
          color: #7A1B00 !important;
          margin: 0 0 14px 0 !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          border-bottom: 2px dashed #FED7AA !important;
          padding: 0 0 10px 0 !important;
        }

        .f1cp-speaker-btn {
          width: 36px !important;
          height: 36px !important;
          border-radius: 50% !important;
          border: none !important;
          background: #00B4D8 !important;
          color: #ffffff !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          box-shadow: 0 0 0 4px rgba(0, 180, 216, 0.25), 0 2px 6px rgba(0, 0, 0, 0.12) !important;
          font-size: 16px !important;
          flex-shrink: 0 !important;
        }

        .f1cp-speaker-btn:hover {
          background: #0096C7 !important;
          transform: scale(1.08) !important;
        }

        .f1cp-speaker-btn.speaking {
          background: #F59E0B !important;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.35) !important;
          animation: f1cp_pulse 0.9s infinite alternate !important;
        }

        @keyframes f1cp_pulse {
          from { transform: scale(1); }
          to { transform: scale(1.12); }
        }

        .f1cp-snippet-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Definition and example card pill */
        .f1cp-snippet {
          background: #FEF9E7 !important;
          border-left: 5px solid #F5C518 !important;
          border-radius: 12px !important;
          padding: 10px 16px !important;
          margin: 0 !important;
          font-size: 14.5px !important;
          font-weight: 700 !important;
          color: #1E293B !important;
          line-height: 1.45 !important;
          display: block !important;
          box-sizing: border-box !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03) !important;
        }

        /* Heading snippet (like Operaciones Básicas, La Adición o Suma, etc.) */
        .f1cp-snippet.big {
          font-size: 17px !important;
          font-weight: 900 !important;
          color: #0F172A !important;
          background: #ffffff !important;
          border-left: 5px solid #FF8A1F !important;
          border-radius: 4px !important;
          padding: 6px 14px !important;
          margin: 4px 0 2px 0 !important;
          line-height: 1.35 !important;
          box-shadow: none !important;
        }

        .f1cp-empty {
          text-align: center !important;
          color: #7A3200 !important;
          font-weight: 800 !important;
          padding: 36px 16px !important;
        }
      `}</style>

      <div className="f1cp-card" onClick={(e) => e.stopPropagation()}>
        {/* Header Banner */}
        <div className="f1cp-head">
          <div className="f1cp-head-ic">
            <svg viewBox="0 0 64 64" className="w-9 h-9" fill="none">
              {/* Green book */}
              <rect x="14" y="18" width="11" height="26" rx="2" fill="#4ADE80" />
              <rect x="14" y="41" width="11" height="3" fill="#E2E8F0" />
              <line x1="16" y1="21" x2="16" y2="41" stroke="#22C55E" strokeWidth="1.5" />
              {/* Red book */}
              <rect x="27" y="14" width="11" height="30" rx="2" fill="#F43F5E" />
              <rect x="27" y="41" width="11" height="3" fill="#E2E8F0" />
              <line x1="29" y1="17" x2="29" y2="41" stroke="#BE123C" strokeWidth="1.5" />
              {/* Blue book */}
              <rect x="40" y="20" width="11" height="24" rx="2" fill="#38BDF8" />
              <rect x="40" y="41" width="11" height="3" fill="#E2E8F0" />
              <line x1="42" y1="23" x2="42" y2="41" stroke="#0284C7" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="f1cp-head-info">
            <h3 className="f1cp-head-title">Conceptos Fedor</h3>
            <p className="f1cp-head-sub">Tomado del libro original de 1° de primaria</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="f1cp-close"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="f1cp-body">
          {/* Topic Tabs Grid (arranged in 2 rows of 5 & 4 buttons) */}
          <div className="f1cp-tabs">
            {keys.map((k) => {
              const t = FEDOR_EXCEL_REFERENCE[k];
              const isActive = activeKey === k;
              const shortTitle = getShortTitle(k, t.title);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setActiveKey(k);
                    setIsSpeaking(false);
                  }}
                  className={`f1cp-tab ${isActive ? 'on' : ''}`}
                >
                  <span style={{ fontSize: '15px' }}>{t.emoji}</span>
                  <span>{shortTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Active Section Content Card */}
          {topic ? (
            <div id="f1cpContent">
              {/* 1. Conceptos clave */}
              {defs.length > 0 && (
                <div className="f1cp-section">
                  <div className="f1cp-section-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '22px' }}>📖</span>
                      <span>Conceptos clave</span>
                    </div>

                    {/* Speaker TTS Button */}
                    <button
                      type="button"
                      onClick={() => handleSpeak(fullTextToRead)}
                      className={`f1cp-speaker-btn ${isSpeaking ? 'speaking' : ''}`}
                      title={isSpeaking ? 'Detener lectura en voz alta' : 'Escuchar conceptos en voz alta'}
                      aria-label="Escuchar en voz alta"
                    >
                      <span>{isSpeaking ? '⏹️' : '🔊'}</span>
                    </button>
                  </div>

                  {/* List of Concepts */}
                  <div className="f1cp-snippet-list">
                    {defs.map((s, idx) => {
                      const isTitleHeading =
                        idx < 3 &&
                        (s.length < 35 ||
                          s === 'Operaciones Básicas' ||
                          s === 'La Adición o Suma' ||
                          s === 'Los Números Cardinales');

                      return (
                        <div
                          key={idx}
                          className={`f1cp-snippet ${isTitleHeading ? 'big' : ''}`}
                        >
                          {s}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Ejemplos del libro */}
              {exs.length > 0 && (
                <div className="f1cp-section">
                  <div className="f1cp-section-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '22px' }}>🧮</span>
                      <span>Ejemplos del libro</span>
                    </div>
                  </div>

                  <div className="f1cp-snippet-list">
                    {exs.map((s, idx) => (
                      <div key={idx} className="f1cp-snippet">
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Actividades */}
              {act.length > 0 && (
                <div className="f1cp-section">
                  <div className="f1cp-section-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '22px' }}>🎯</span>
                      <span>Actividades</span>
                    </div>
                  </div>

                  <div className="f1cp-snippet-list">
                    {act.map((s, idx) => (
                      <div key={idx} className="f1cp-snippet">
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="f1cp-empty">
              No hay contenido disponible.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

