'use client';

import React from 'react';
import { useBook } from '../context/BookContext';

interface ContenidosModalProps {
  onClose: () => void;
}

export default function ContenidosModal({ onClose }: ContenidosModalProps) {
  const { book, goScreen } = useBook();

  const handleMenuClick = () => {
    onClose();
    if (goScreen) {
      goScreen('home');
    }
  };

  const units = book?.units || [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 4, 30, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        fontFamily: "'Nunito', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1A0A3C 0%, #3D1054 100%)',
          color: '#FFF',
          borderRadius: '22px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.2rem 1.4rem',
            background: 'linear-gradient(135deg, #FF1D4E, #A30041)',
            borderRadius: '22px 22px 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 900,
            fontSize: '20px',
          }}
        >
          <span>📑 Contenidos del Libro</span>

          <button
            type="button"
            onClick={handleMenuClick}
            style={{
              marginLeft: 'auto',
              background: 'rgba(255,255,255,0.95)',
              color: '#A30041',
              border: 'none',
              borderRadius: '14px',
              padding: '8px 14px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: "'Nunito', sans-serif",
              transition: 'transform 0.15s',
            }}
          >
            🏠 Menú
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.3)',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '20px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Units Body */}
        <div style={{ padding: '1.2rem 1.4rem' }}>
          {units.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#E0DBFF' }}>
              Cargando contenidos...
            </div>
          ) : (
            units.map((u, ui) => (
              <div
                key={u.id || ui}
                style={{
                  marginBottom: '1.4rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '1rem',
                  borderRadius: '16px',
                  borderLeft: '5px solid #FFE066',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    fontWeight: 900,
                    fontSize: '18px',
                    margin: '0 0 0.8rem 0',
                    color: '#FFE066',
                  }}
                >
                  Unidad {ui + 1} — {u.name}
                </h3>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(u.topics || []).map((t, ti) => {
                    const lvlCount = (t.levels || []).length;
                    const exCount = (t.levels || []).reduce((acc, lv) => acc + ((lv.exercises || []).length), 0);

                    return (
                      <li
                        key={t.id || ti}
                        style={{
                          margin: 0,
                          padding: '8px 12px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          borderLeft: '3px solid #FFE066',
                          borderRadius: '8px',
                        }}
                      >
                        <div style={{ fontWeight: 900, fontSize: '14.5px', color: '#FFFFFF' }}>
                          {t.icon || '•'} {t.title}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#C5BFEE', fontWeight: 700, marginTop: '3px' }}>
                          {t.desc ? `${t.desc} · ` : ''}{lvlCount} niveles · {exCount} ejercicios
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
