'use client';

import React from 'react';
import { useBook1 } from '../context/Book1Context';

interface BookHeader1roProps {
  onOpenIntro?: () => void;
}

export default function BookHeader1ro({ onOpenIntro }: BookHeader1roProps) {
  const { student, coins, streak, screen, goScreen, resetStudent } = useBook1();

  const handleLogoClick = () => {
    if (student?.name && screen !== 'home') {
      goScreen('home');
    }
  };

  return (
    <header
      className="hdr-1ro"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        background: '#FFFFFF',
        borderBottom: '2px solid #F0C674',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          onClick={handleLogoClick}
          style={{
            cursor: student?.name ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981, #047857)',
              color: '#fff',
              fontSize: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(16,185,129,0.3)',
            }}
          >
            {student?.avatar || '🧑‍🚀'}
          </div>
          <div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 900,
                color: '#074F3A',
                fontFamily: "'Baloo 2', sans-serif",
                lineHeight: 1.1,
              }}
            >
              Matemáticas de Fedor
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#16876A' }}>
              1° Primaria
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Monedas */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#FEF3E8',
            border: '1.5px solid #FF8C2A',
            padding: '4px 10px',
            borderRadius: '99px',
            fontWeight: 900,
            fontSize: '13px',
            color: '#7A3200',
          }}
        >
          <span>🪙</span>
          <span>{coins}</span>
        </div>

        {/* Racha */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#FEE8E4',
            border: '1.5px solid #E24B4A',
            padding: '4px 10px',
            borderRadius: '99px',
            fontWeight: 900,
            fontSize: '13px',
            color: '#7A1B00',
          }}
        >
          <span>🔥</span>
          <span>{streak}</span>
        </div>

        {/* Reset / Perfil button */}
        {student?.name && (
          <button
            type="button"
            onClick={resetStudent}
            title="Cambiar perfil de estudiante"
            style={{
              background: '#F3F4F6',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              color: '#4B5563',
            }}
          >
            👤 {student.name.split(' ')[0]}
          </button>
        )}
      </div>
    </header>
  );
}
