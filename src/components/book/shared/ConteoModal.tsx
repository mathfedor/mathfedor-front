'use client';

import React, { useState } from 'react';

interface ConteoModalProps {
  onClose: () => void;
  onSelectOption?: (optionId: string) => void;
}

const EMOJIS = ['🍎', '⭐', '🎈', '🐠', '🌼', '🚗', '🍓', '⚽', '🦋', '🌳'];

function formatMil(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function ConteoModal({ onClose }: ConteoModalProps) {
  const [activeView, setActiveView] = useState<string | null>(null);

  // Render detail view content
  const renderViewContent = () => {
    if (!activeView) return null;

    // --- 1. CONJUNTOS ---
    if (activeView.startsWith('c')) {
      const N = parseInt(activeView.replace('c', ''), 10);
      if (N >= 100) {
        return (
          <div style={{ textAlign: 'center' }}>
            {Array.from({ length: 10 }).map((_, g) => {
              const emoji = EMOJIS[g % EMOJIS.length];
              return (
                <div
                  key={g}
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'top',
                    background: '#FFFFFF',
                    border: '2px solid #C5BFEE',
                    borderRadius: '12px',
                    padding: '6px',
                    margin: '5px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '240px', justifyContent: 'center' }}>
                    {Array.from({ length: 10 }).map((_, k) => (
                      <span
                        key={k}
                        style={{
                          display: 'inline-flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '44px',
                          margin: '3px',
                          background: '#FFFFFF',
                          border: '1.5px solid #E8E2F8',
                          borderRadius: '10px',
                          padding: '4px 2px',
                        }}
                      >
                        <span style={{ fontSize: '18px', lineHeight: 1.1 }}>{emoji}</span>
                        <span style={{ fontSize: '11px', fontWeight: 900, color: '#3D1468' }}>{g * 10 + k + 1}</span>
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#0B4C86', marginTop: '4px' }}>
                    {(g + 1) * 10}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: N }).map((_, i) => {
            const emoji = EMOJIS[Math.floor(i / 10) % EMOJIS.length];
            return (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '46px',
                  margin: '4px',
                  background: '#FFFFFF',
                  border: '1.5px solid #E8E2F8',
                  borderRadius: '10px',
                  padding: '6px 2px',
                }}
              >
                <span style={{ fontSize: '20px', lineHeight: 1.1 }}>{emoji}</span>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#3D1468' }}>{i + 1}</span>
              </span>
            );
          })}
        </div>
      );
    }

    // --- 2. TABLAS CON IMÁGENES (1 en 1) ---
    if (activeView.startsWith('t1_')) {
      const tope = parseInt(activeView.replace('t1_', ''), 10);
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: tope }).map((_, i) => {
            const emoji = EMOJIS[Math.floor(i / 10) % EMOJIS.length];
            return (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '46px',
                  margin: '4px',
                  background: '#FFFFFF',
                  border: '1.5px solid #E8E2F8',
                  borderRadius: '10px',
                  padding: '6px 2px',
                }}
              >
                <span style={{ fontSize: '20px', lineHeight: 1.1 }}>{emoji}</span>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#3D1468' }}>{i + 1}</span>
              </span>
            );
          })}
        </div>
      );
    }

    // --- 2B. TABLAS CON IMÁGENES (paso N) ---
    if (activeView.startsWith('t')) {
      const parts = activeView.replace('t', '').split('_');
      const paso = parseInt(parts[0], 10);
      const tope = parseInt(parts[1], 10);

      const groups = [];
      for (let v = paso; v <= tope; v += paso) {
        const emoji = EMOJIS[Math.floor(v / paso - 1) % EMOJIS.length];
        groups.push({ v, emoji });
      }

      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {groups.map((g, idx) => (
            <div
              key={idx}
              style={{
                display: 'inline-block',
                verticalAlign: 'top',
                background: '#FFFFFF',
                border: '2px solid #C5BFEE',
                borderRadius: '12px',
                padding: '8px',
                margin: '5px',
                textAlign: 'center',
                minWidth: '76px',
              }}
            >
              <div style={{ maxWidth: '170px', lineHeight: 1.25, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {Array.from({ length: paso }).map((_, k) => (
                  <span key={k} style={{ fontSize: '16px', margin: '1px' }}>
                    {g.emoji}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#0B4C86', marginTop: '4px' }}>
                {g.v}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // --- 3. TABLAS SIN IMÁGENES ---
    if (activeView.startsWith('n')) {
      const parts = activeView.replace('n', '').split('_');
      const paso = parseInt(parts[0], 10);
      const tope = parseInt(parts[1], 10);

      const nums = [];
      for (let v = paso; v <= tope; v += paso) {
        nums.push(v);
      }

      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
          {nums.map((v) => (
            <span
              key={v}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '64px',
                margin: '4px',
                background: '#F4F0FF',
                border: '2px solid #C5BFEE',
                borderRadius: '12px',
                padding: '8px 12px',
                fontWeight: 900,
                color: '#3D1468',
                fontSize: '15px',
                fontFamily: "'Baloo 2', sans-serif",
              }}
            >
              {formatMil(v)}
            </span>
          ))}
        </div>
      );
    }

    return null;
  };

  const getTitle = () => {
    switch (activeView) {
      case 'c10': return '🧺 Conjunto · De 1 a 10';
      case 'c20': return '🧺 Conjunto · De 1 a 20';
      case 'c30': return '🧺 Conjunto · De 1 a 30';
      case 'c50': return '🧺 Conjunto · De 1 a 50';
      case 'c100': return '🧺 Conjunto · De 1 a 100 (10 grupos de 10)';
      case 't1_10': return '🖼️ De 1 en 1 hasta 10';
      case 't1_20': return '🖼️ De 1 en 1 hasta 20';
      case 't1_30': return '🖼️ De 1 en 1 hasta 30';
      case 't1_50': return '🖼️ De 1 en 1 hasta 50';
      case 't1_100': return '🖼️ De 1 en 1 hasta 100';
      case 't3_30': return '🖼️ De 3 en 3 hasta 30';
      case 't5_50': return '🖼️ De 5 en 5 hasta 50';
      case 't10_100': return '🖼️ De 10 en 10 hasta 100';
      case 'n20_200': return '🔢 De 20 en 20 hasta 200';
      case 'n50_500': return '🔢 De 50 en 50 hasta 500';
      case 'n100_1000': return '🔢 De 100 en 100 hasta 1.000';
      case 'n1000_10000': return '🔢 De 1.000 en 1.000 hasta 10.000';
      case 'n10000_100000': return '🔢 De 10.000 en 10.000 hasta 100.000';
      default: return '';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(14, 8, 48, 0.9)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        fontFamily: "'Nunito', sans-serif",
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <style>{`
        .fc-btn {
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #FFF8DC 60%, #FFE9A8 100%);
          color: #7A4400;
          border: 2.5px solid #FFE9A8;
          border-radius: 16px;
          padding: 12px 8px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Baloo 2', sans-serif;
          transition: transform .12s, box-shadow .12s;
          text-align: center;
        }
        .fc-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 4px 12px rgba(255,233,168,.5);
        }
        .fc-btn.azul {
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #E8F4FF 60%, #BFE0FF 100%);
          border-color: #BFE0FF;
          color: #0B4C86;
        }
        .fc-btn.azul:hover {
          box-shadow: 0 4px 12px rgba(191,224,255,.5);
        }
        .fc-btn.verde {
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #E9FBF2 60%, #BFF0D8 100%);
          border-color: #BFF0D8;
          color: #0A5C3E;
        }
        .fc-btn.verde:hover {
          box-shadow: 0 4px 12px rgba(191,240,216,.5);
        }
      `}</style>

      <div
        style={{
          background: '#fff',
          borderRadius: '22px',
          maxWidth: '840px',
          width: '100%',
          padding: '1.4rem 1.2rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: '#FEE2E8',
            border: 'none',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            fontSize: '20px',
            cursor: 'pointer',
            fontWeight: 900,
            color: '#A30041',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Title & Subtitle */}
        <div
          style={{
            fontSize: '24px',
            fontWeight: 900,
            color: '#3D1468',
            textAlign: 'center',
            margin: '0 0 4px',
            fontFamily: "'Baloo 2', sans-serif",
          }}
        >
          Módulo de Conteo
        </div>
        <div
          style={{
            fontSize: '12.5px',
            color: '#7A7299',
            textAlign: 'center',
            marginBottom: '16px',
            fontWeight: 700,
          }}
        >
          Conjuntos y tablas para aprender a contar
        </div>

        {!activeView ? (
          // Home View with 3 Sections
          <div>
            {/* Section 1: Conjuntos */}
            <div
              style={{
                fontSize: '15px',
                fontWeight: 900,
                color: '#3D1468',
                margin: '14px 0 8px',
                paddingBottom: '4px',
                borderBottom: '2px dashed #C5BFEE',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🧺</span> Conjuntos
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
              <button type="button" className="fc-btn" onClick={() => setActiveView('c10')}>De 1 a 10</button>
              <button type="button" className="fc-btn" onClick={() => setActiveView('c20')}>De 1 a 20</button>
              <button type="button" className="fc-btn" onClick={() => setActiveView('c30')}>De 1 a 30</button>
              <button type="button" className="fc-btn" onClick={() => setActiveView('c50')}>De 1 a 50</button>
              <button type="button" className="fc-btn" onClick={() => setActiveView('c100')}>De 1 a 100</button>
            </div>

            {/* Section 2: Tablas de conteo con imágenes */}
            <div
              style={{
                fontSize: '15px',
                fontWeight: 900,
                color: '#3D1468',
                margin: '16px 0 8px',
                paddingBottom: '4px',
                borderBottom: '2px dashed #C5BFEE',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🖼️</span> Tablas de conteo con imágenes
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
              <button type="button" className="fc-btn azul" onClick={() => setActiveView('t1_10')}>De 1 en 1 hasta 10</button>
              <button type="button" className="fc-btn azul" onClick={() => setActiveView('t1_20')}>De 1 en 1 hasta 20</button>
              <button type="button" className="fc-btn azul" onClick={() => setActiveView('t1_30')}>De 1 en 1 hasta 30</button>
              <button type="button" className="fc-btn azul" onClick={() => setActiveView('t1_50')}>De 1 en 1 hasta 50</button>
              <button type="button" className="fc-btn azul" onClick={() => setActiveView('t1_100')}>De 1 en 1 hasta 100</button>
              <button type="button" className="fc-btn azul" onClick={() => setActiveView('t3_30')}>De 3 en 3 hasta 30</button>
              <button type="button" className="fc-btn azul" onClick={() => setActiveView('t5_50')}>De 5 en 5 hasta 50</button>
              <button type="button" className="fc-btn azul" onClick={() => setActiveView('t10_100')}>De 10 en 10 hasta 100</button>
            </div>

            {/* Section 3: Tablas de conteo sin imágenes */}
            <div
              style={{
                fontSize: '15px',
                fontWeight: 900,
                color: '#3D1468',
                margin: '16px 0 8px',
                paddingBottom: '4px',
                borderBottom: '2px dashed #C5BFEE',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🔢</span> Tablas de conteo sin imágenes
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
              <button type="button" className="fc-btn verde" onClick={() => setActiveView('n20_200')}>De 20 en 20 hasta 200</button>
              <button type="button" className="fc-btn verde" onClick={() => setActiveView('n50_500')}>De 50 en 50 hasta 500</button>
              <button type="button" className="fc-btn verde" onClick={() => setActiveView('n100_1000')}>De 100 en 100 hasta 1.000</button>
              <button type="button" className="fc-btn verde" onClick={() => setActiveView('n1000_10000')}>De 1.000 en 1.000 hasta 10.000</button>
              <button type="button" className="fc-btn verde" onClick={() => setActiveView('n10000_100000')}>De 10.000 en 10.000 hasta 100.000</button>
            </div>
          </div>
        ) : (
          // Detail View with Back Button
          <div>
            <button
              type="button"
              onClick={() => setActiveView(null)}
              style={{
                background: '#EDE7FB',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 16px',
                fontWeight: 900,
                color: '#3D1468',
                cursor: 'pointer',
                marginBottom: '12px',
                fontFamily: "'Nunito', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ⬅ Volver al menú
            </button>

            <div
              style={{
                fontSize: '17px',
                fontWeight: 900,
                color: '#3D1468',
                margin: '0 0 10px',
                paddingBottom: '6px',
                borderBottom: '2px dashed #C5BFEE',
                fontFamily: "'Baloo 2', sans-serif",
              }}
            >
              {getTitle()}
            </div>

            <div
              style={{
                background: '#FFFFFF',
                border: '2px solid #E4DEF7',
                borderRadius: '16px',
                padding: '14px',
                minHeight: '200px',
                overflowX: 'auto',
              }}
            >
              {renderViewContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
