'use client';

import React, { useState, useEffect } from 'react';

interface Conteo1roModalProps {
  onClose: () => void;
  onSelectOption?: (optionId: string) => void;
}

const EMOJIS = ['⭐', '🍎', '🐱', '⚽', '🐶', '🌸', '🎈', '🌟', '🚀', '🍪'];

function NumberBadge1234() {
  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        backgroundColor: '#3B82F6',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontWeight: 900,
        fontSize: '11px',
        lineHeight: '1.1',
        boxShadow: '0 2px 5px rgba(59, 130, 246, 0.35)',
        letterSpacing: '1px',
      }}
    >
      <div style={{ display: 'flex', gap: '2px' }}>
        <span>1</span>
        <span>2</span>
      </div>
      <div style={{ display: 'flex', gap: '2px' }}>
        <span>3</span>
        <span>4</span>
      </div>
    </div>
  );
}

function ArrowBadge({ direction }: { direction: 'up' | 'down' }) {
  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        backgroundColor: '#3B82F6',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontWeight: 900,
        fontSize: '18px',
        boxShadow: '0 2px 5px rgba(59, 130, 246, 0.35)',
      }}
    >
      {direction === 'up' ? '⬆' : '⬇'}
    </div>
  );
}

interface PracticeOption {
  id: string;
  title: string;
  type: 'simple' | 'escala' | 'orden';
  from?: number;
  to: number;
  step?: number;
  direction?: 'asc' | 'desc';
}

export default function Conteo1roModal({ onClose, onSelectOption }: Conteo1roModalProps) {
  const [selectedPractice, setSelectedPractice] = useState<PracticeOption | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop TTS on unmount or view change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedPractice]);

  const handleSpeakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES';
    u.rate = 0.9;
    u.pitch = 1.05;
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const handleSelect = (option: PracticeOption) => {
    setSelectedPractice(option);
    onSelectOption?.(option.id);
  };

  // Generate numbers for practice view
  const renderPracticeContent = () => {
    if (!selectedPractice) return null;

    let numbers: number[] = [];
    if (selectedPractice.type === 'simple') {
      for (let i = 1; i <= selectedPractice.to; i++) {
        numbers.push(i);
      }
    } else if (selectedPractice.type === 'escala') {
      const step = selectedPractice.step || 2;
      for (let i = step; i <= selectedPractice.to; i += step) {
        numbers.push(i);
      }
    } else if (selectedPractice.type === 'orden') {
      if (selectedPractice.direction === 'desc') {
        for (let i = 50; i >= 1; i--) {
          numbers.push(i);
        }
      } else {
        for (let i = 1; i <= 50; i++) {
          numbers.push(i);
        }
      }
    }

    const speechSequence = numbers.slice(0, 30).join(', ');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Subheader with Back Button and Audio */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px dashed #C7D2FE',
            paddingBottom: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              window.speechSynthesis?.cancel();
              setIsSpeaking(false);
              setSelectedPractice(null);
            }}
            style={{
              background: '#EEF2FF',
              color: '#312E81',
              border: '2px solid #C7D2FE',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <span>⬅</span>
            <span>Volver a rangos</span>
          </button>

          <button
            type="button"
            onClick={() => handleSpeakText(speechSequence)}
            style={{
              background: isSpeaking ? '#F59E0B' : '#00B4D8',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0, 180, 216, 0.3)',
            }}
          >
            <span>{isSpeaking ? '⏹️' : '🔊'}</span>
            <span>{isSpeaking ? 'Detener audio' : 'Escuchar conteo'}</span>
          </button>
        </div>

        {/* Practice Grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            maxHeight: '52vh',
            overflowY: 'auto',
            padding: '8px 4px',
          }}
        >
          {numbers.map((num, idx) => {
            const emoji = EMOJIS[Math.floor(idx / 5) % EMOJIS.length];
            return (
              <div
                key={num}
                onClick={() => handleSpeakText(String(num))}
                title={`Haz clic para escuchar el número ${num}`}
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #FEF9E7 100%)',
                  border: '2px solid #FDE68A',
                  borderRadius: '14px',
                  padding: '8px 12px',
                  minWidth: '60px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  boxShadow: '0 2px 6px rgba(245, 158, 11, 0.12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 6px 14px rgba(245, 158, 11, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(245, 158, 11, 0.12)';
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1.2 }}>{emoji}</span>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#78350F',
                    fontFamily: "'Baloo 2', sans-serif",
                    marginTop: '2px',
                  }}
                >
                  {num}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="conteo1-bg" onClick={onClose}>
      {/* Scoped CSS immune to .fedor-book * resets */}
      <style>{`
        .conteo1-bg {
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
          animation: conteo1_fadeIn 0.25s ease-out !important;
        }

        @keyframes conteo1_fadeIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .conteo1-modal {
          background: #ffffff !important;
          border-radius: 28px !important;
          max-width: 840px !important;
          width: 100% !important;
          max-height: 92vh !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5) !important;
          border: 1px solid rgba(255, 255, 255, 0.8) !important;
          position: relative !important;
        }

        .conteo1-close {
          position: absolute !important;
          top: 16px !important;
          right: 18px !important;
          width: 38px !important;
          height: 38px !important;
          border-radius: 50% !important;
          background: #FCE7F3 !important;
          border: none !important;
          color: #9D174D !important;
          font-size: 22px !important;
          font-weight: 900 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          z-index: 10 !important;
          box-shadow: 0 2px 6px rgba(157, 23, 77, 0.12) !important;
        }

        .conteo1-close:hover {
          background: #FBCFE8 !important;
          transform: scale(1.08) !important;
        }

        .conteo1-body {
          padding: 24px 28px !important;
          overflow-y: auto !important;
          flex: 1 !important;
        }

        .conteo1-header {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          margin-bottom: 20px !important;
        }

        .conteo1-title-row {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
        }

        .conteo1-title {
          font-size: 26px !important;
          font-weight: 900 !important;
          color: #1E1B4B !important;
          font-family: 'Baloo 2', sans-serif !important;
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1.1 !important;
        }

        .conteo1-sub {
          font-size: 13.5px !important;
          color: #64748B !important;
          font-weight: 700 !important;
          margin: 4px 0 0 0 !important;
          padding: 0 !important;
          text-align: center !important;
        }

        .conteo1-sec-title {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          font-size: 17px !important;
          font-weight: 900 !important;
          color: #1E1B4B !important;
          font-family: 'Baloo 2', sans-serif !important;
          margin: 18px 0 6px 0 !important;
          padding: 0 !important;
        }

        .conteo1-sec-divider {
          border-bottom: 2px dashed #C7D2FE !important;
          margin: 0 0 14px 0 !important;
          width: 100% !important;
        }

        .conteo1-grid {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 12px !important;
          margin-bottom: 10px !important;
        }

        @media (max-width: 768px) {
          .conteo1-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .conteo1-body {
            padding: 20px 16px !important;
          }
        }

        .conteo1-card-btn {
          background: linear-gradient(180deg, #FFFDF2 0%, #FEF8DC 100%) !important;
          border: 2px solid #FDE68A !important;
          border-radius: 20px !important;
          padding: 16px 12px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          min-height: 96px !important;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.16) !important;
          transition: all 0.18s ease-in-out !important;
          cursor: pointer !important;
          user-select: none !important;
          text-decoration: none !important;
        }

        .conteo1-card-btn:hover {
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 8px 22px rgba(245, 158, 11, 0.28) !important;
          border-color: #FACC15 !important;
        }

        .conteo1-card-btn:active {
          transform: scale(0.98) !important;
        }

        .conteo1-card-txt {
          color: #78350F !important;
          font-weight: 800 !important;
          font-size: 13.5px !important;
          line-height: 1.25 !important;
          margin-top: 8px !important;
          font-family: 'Nunito', 'Baloo 2', sans-serif !important;
        }
      `}</style>

      <div className="conteo1-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="conteo1-close"
          aria-label="Cerrar"
        >
          ×
        </button>

        {/* Scrollable Modal Content */}
        <div className="conteo1-body">
          {/* Header */}
          <div className="conteo1-header">
            <div className="conteo1-title-row">
              <NumberBadge1234 />
              <h2 className="conteo1-title">
                {selectedPractice ? selectedPractice.title : 'Conteo'}
              </h2>
            </div>
            <p className="conteo1-sub">
              {selectedPractice
                ? 'Toca cualquier número para escucharlo'
                : 'Elige un rango y practica'}
            </p>
          </div>

          {/* If an option is selected, show detail practice */}
          {selectedPractice ? (
            renderPracticeContent()
          ) : (
            <>
              {/* ── SECCIÓN 1: Rangos simples ── */}
              <div>
                <div className="conteo1-sec-title">
                  <span style={{ fontSize: '18px' }}>🎯</span>
                  <span>Rangos simples</span>
                </div>
                <div className="conteo1-sec-divider" />

                <div className="conteo1-grid">
                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'rango_1_5', title: 'Rango 1 a 5', type: 'simple', to: 5 })}
                  >
                    <NumberBadge1234 />
                    <span className="conteo1-card-txt">Rango 1 a 5</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'rango_1_10', title: 'Rango 1 a 10', type: 'simple', to: 10 })}
                  >
                    <NumberBadge1234 />
                    <span className="conteo1-card-txt">Rango 1 a 10</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'rango_1_20', title: 'Rango 1 a 20', type: 'simple', to: 20 })}
                  >
                    <NumberBadge1234 />
                    <span className="conteo1-card-txt">Rango 1 a 20</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'rango_1_30', title: 'Rango 1 a 30', type: 'simple', to: 30 })}
                  >
                    <NumberBadge1234 />
                    <span className="conteo1-card-txt">Rango 1 a 30</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'rango_1_40', title: 'Rango 1 a 40', type: 'simple', to: 40 })}
                  >
                    <NumberBadge1234 />
                    <span className="conteo1-card-txt">Rango 1 a 40</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'rango_1_50', title: 'Rango 1 a 50', type: 'simple', to: 50 })}
                  >
                    <NumberBadge1234 />
                    <span className="conteo1-card-txt">Rango 1 a 50</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'rango_1_60', title: 'Rango 1 a 60', type: 'simple', to: 60 })}
                  >
                    <NumberBadge1234 />
                    <span className="conteo1-card-txt">Rango 1 a 60</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'rango_1_80', title: 'Rango 1 a 80', type: 'simple', to: 80 })}
                  >
                    <NumberBadge1234 />
                    <span className="conteo1-card-txt">Rango 1 a 80</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'rango_1_100', title: 'Rango 1 a 100', type: 'simple', to: 100 })}
                  >
                    <NumberBadge1234 />
                    <span className="conteo1-card-txt">Rango 1 a 100</span>
                  </button>
                </div>
              </div>

              {/* ── SECCIÓN 2: Rangos con escala ── */}
              <div>
                <div className="conteo1-sec-title">
                  <span style={{ fontSize: '18px' }}>🚀</span>
                  <span>Rangos con escala</span>
                </div>
                <div className="conteo1-sec-divider" />

                <div className="conteo1-grid">
                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'escala_2_20', title: 'De 2 en 2 hasta 20', type: 'escala', to: 20, step: 2 })}
                  >
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>🐸</span>
                    <span className="conteo1-card-txt">Rango de 2 en 2 hasta 20</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'escala_5_50', title: 'De 5 en 5 hasta 50', type: 'escala', to: 50, step: 5 })}
                  >
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>🐸</span>
                    <span className="conteo1-card-txt">Rango de 5 en 5 hasta 50</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'escala_10_100', title: 'De 10 en 10 hasta 100', type: 'escala', to: 100, step: 10 })}
                  >
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>🐸</span>
                    <span className="conteo1-card-txt">Rango de 10 en 10 hasta 100</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'escala_20_200', title: 'De 20 en 20 hasta 200', type: 'escala', to: 200, step: 20 })}
                  >
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>🐸</span>
                    <span className="conteo1-card-txt">Rango de 20 en 20 hasta 200</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'escala_50_500', title: 'De 50 en 50 hasta 500', type: 'escala', to: 500, step: 50 })}
                  >
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>🐸</span>
                    <span className="conteo1-card-txt">Rango de 50 en 50 hasta 500</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'escala_100_1000', title: 'De 100 en 100 hasta 1000', type: 'escala', to: 1000, step: 100 })}
                  >
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>🐸</span>
                    <span className="conteo1-card-txt">Rango de 100 en 100 hasta 1000</span>
                  </button>
                </div>
              </div>

              {/* ── SECCIÓN 3: Conteo Ascendente / Descendente ── */}
              <div>
                <div className="conteo1-sec-title">
                  <span style={{ fontSize: '18px' }}>⬆️ ⬇️</span>
                  <span>Conteo Ascendente / Descendente</span>
                </div>
                <div className="conteo1-sec-divider" />

                <div className="conteo1-grid">
                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'conteo_asc_50', title: 'Conteo Ascendente (1 → 50)', type: 'orden', to: 50, direction: 'asc' })}
                  >
                    <ArrowBadge direction="up" />
                    <span className="conteo1-card-txt">Conteo Ascendente (1 → 50)</span>
                  </button>

                  <button
                    type="button"
                    className="conteo1-card-btn"
                    onClick={() => handleSelect({ id: 'conteo_desc_50', title: 'Conteo Descendente (50 → 1)', type: 'orden', to: 50, direction: 'desc' })}
                  >
                    <ArrowBadge direction="down" />
                    <span className="conteo1-card-txt">Conteo Descendente (50 → 1)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
