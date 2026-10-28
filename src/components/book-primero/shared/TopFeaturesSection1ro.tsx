'use client';

import React from 'react';
import { useBook1 } from '../context/Book1Context';

export default function TopFeaturesSection1ro() {
  const { goScreen } = useBook1();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '1.25rem',
        width: '100%',
      }}
    >
      {/* 1. Definiciones FEDOR */}
      <div
        className="feat-btn"
        onClick={() => goScreen('definiciones')}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 22px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #FFFFFF 45%, #F5F0FF 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 24px rgba(0, 40, 80, 0.08), 0 2px 6px rgba(0, 40, 80, 0.04)',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.14), 0 6px 18px rgba(123,47,190,0.35)',
            flexShrink: 0,
          }}
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <rect x="4" y="9" width="13" height="18" rx="3" fill="#00E5FF" />
            <rect x="6.5" y="11" width="8" height="14" rx="1.5" fill="#E0F7FA" />
            <rect x="11" y="6" width="13" height="21" rx="3" fill="#FF2A6D" />
            <rect x="13.5" y="8" width="8" height="17" rx="1.5" fill="#FFE4EC" />
            <rect x="18" y="11" width="13" height="16" rx="3" fill="#FFB703" />
            <rect x="20.5" y="13" width="8" height="12" rx="1.5" fill="#FFF9C4" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 900,
              color: '#0A3A6A',
              fontFamily: "'Baloo 2', sans-serif",
              lineHeight: 1.2,
              marginBottom: '3px',
            }}
          >
            Definiciones FEDOR
          </div>
          <div
            style={{
              fontSize: '13.5px',
              fontWeight: 800,
              color: '#0A1830',
              letterSpacing: '0.01em',
            }}
          >
            Conceptos matemáticos claros para 1°
          </div>
        </div>
      </div>

      {/* 2. Estándares MEN */}
      <div
        className="feat-btn"
        onClick={() => goScreen('estandares')}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 22px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #FFFFFF 45%, #F0FDF9 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 24px rgba(0, 40, 80, 0.08), 0 2px 6px rgba(0, 40, 80, 0.04)',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            background: '#FFFFFF',
            border: '2px solid rgba(0, 40, 80, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '22px',
            color: '#0A1830',
            boxShadow: '0 4px 14px rgba(0, 40, 80, 0.08)',
            flexShrink: 0,
            fontFamily: "'Nunito', sans-serif",
            letterSpacing: '-0.02em',
          }}
        >
          CO
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 900,
              color: '#4A607A',
              fontFamily: "'Baloo 2', sans-serif",
            }}
          >
            Estándares MEN
          </div>
          <div style={{ fontSize: '15px', fontWeight: 900, color: '#0A1830' }}>
            Programa de 1° Colombia
          </div>
        </div>
      </div>

      {/* 3. Problemas Cotidianos */}
      <div
        className="feat-btn"
        onClick={() => goScreen('problemas')}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 22px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #FFFFFF 45%, #E8FAF1 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 24px rgba(0, 40, 80, 0.08), 0 2px 6px rgba(0, 40, 80, 0.04)',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #0E5240, #16876A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.14), 0 6px 18px rgba(14,82,64,0.35)',
            flexShrink: 0,
          }}
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <path
              d="M4 6h4l3.5 13h13.5l3-10H10"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="13" y="10" width="5" height="5" rx="1.5" fill="#38BDF8" />
            <rect x="19" y="8" width="5" height="7" rx="1.5" fill="#A7F3D0" />
            <circle cx="13" cy="24" r="2.2" fill="#FFFFFF" />
            <circle cx="23" cy="24" r="2.2" fill="#FFFFFF" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 900,
              color: '#0A3A6A',
              fontFamily: "'Baloo 2', sans-serif",
              lineHeight: 1.2,
              marginBottom: '3px',
            }}
          >
            Problemas Cotidianos
          </div>
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: 700,
              color: 'rgba(20, 60, 100, 0.72)',
              letterSpacing: '0.01em',
            }}
          >
            Conteo de monedas + compras + 4 operaciones
          </div>
        </div>
        <div
          style={{
            fontSize: '24px',
            color: '#1A6CB4',
            fontWeight: 900,
            marginLeft: 'auto',
            flexShrink: 0,
          }}
        >
          →
        </div>
      </div>
    </div>
  );
}
