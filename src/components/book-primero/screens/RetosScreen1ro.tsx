'use client';

import React from 'react';
import { useBook1 } from '../context/Book1Context';

export default function RetosScreen1ro() {
  const { goScreen, startLevel } = useBook1();

  return (
    <div
      style={{
        maxWidth: '740px',
        margin: '0 auto',
        padding: '1.25rem 1rem',
        fontFamily: "'Nunito', sans-serif",
        textAlign: 'left',
      }}
    >
      <div
        onClick={() => goScreen('home')}
        style={{
          cursor: 'pointer',
          fontWeight: 800,
          color: '#16876A',
          fontSize: '13px',
          marginBottom: '0.85rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        ← Volver al inicio
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #7A3200, #C25400, #FF8C2A)',
          borderRadius: '20px',
          padding: '1.5rem',
          color: '#ffffff',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ fontSize: '28px' }}>⚡</div>
        <h1
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '24px',
            fontWeight: 900,
            margin: '4px 0',
          }}
        >
          Retos Rápidos de 1°
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          Gana monedas dobles y demuestra tu agilidad matemática.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { title: 'Reto de Conteo Rápido', desc: 'Cuenta del 1 al 10 sin equivocarte.', u: 0, t: 0, l: 0, icon: '🚀' },
          { title: 'Reto de Saltos Numéricos', desc: 'Avanza de 2 en 2 por la recta.', u: 0, t: 1, l: 0, icon: '🐸' },
          { title: 'Reto de Sumas al Instante', desc: 'Resuelve adiciones sencillas sin llevar.', u: 0, t: 4, l: 0, icon: '⚡' },
        ].map((reto) => (
          <div
            key={reto.title}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1.5px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '28px' }}>{reto.icon}</span>
              <div>
                <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '16px', fontWeight: 900, color: '#1A0A3C' }}>
                  {reto.title}
                </div>
                <div style={{ fontSize: '12.5px', color: '#6B7280' }}>
                  {reto.desc}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => startLevel(reto.u, reto.t, reto.l)}
              style={{
                padding: '8px 18px',
                background: 'linear-gradient(135deg, #FF8C2A, #E8650A)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              ¡Jugar!
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
