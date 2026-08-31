'use client';

import React from 'react';

interface Juegos2doModalProps {
  onClose: () => void;
  onSelectOption: (optionId: 'stats' | 'tablas' | 'conteo' | 'retos') => void;
}

export default function Juegos2doModal({ onClose, onSelectOption }: Juegos2doModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(14, 8, 48, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: "'Nunito', sans-serif",
        userSelect: 'none',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '28px',
          maxWidth: '380px',
          width: '100%',
          padding: '1.5rem',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
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
            background: '#FDE8ED',
            border: 'none',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 900,
            color: '#9D174D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label="Cerrar"
        >
          ×
        </button>

        {/* Top Gamepad Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
            <svg viewBox="0 0 64 64" style={{ width: '48px', height: '42px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }} fill="none">
              <path
                d="M 19 23 C 15 23 11 26 11 32 C 11 37 13 45 17 47 C 20 48 24 45 26 41 L 29 36 L 35 36 L 38 41 C 40 45 44 48 47 47 C 51 45 53 37 53 32 C 53 26 49 23 45 23 L 19 23 Z"
                fill="#4338CA"
              />
              <path
                d="M 20 24 C 17 24 13 27 13 32 C 13 37 14 44 18 45 C 20 46 23 43 25 40 L 28 35 L 36 35 L 39 40 C 41 43 44 46 46 45 C 50 44 51 37 51 32 C 51 27 47 24 44 24 L 20 24 Z"
                fill="#4F46E5"
              />
              <path
                d="M 14 31 C 14 35 15 41 17 43 C 18 44 20 42 22 40"
                stroke="#818CF8"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <rect x="18.5" y="28" width="3" height="8" rx="1" fill="#C7D2FE" />
              <rect x="16" y="30.5" width="8" height="3" rx="1" fill="#C7D2FE" />
              <ellipse cx="28" cy="33" rx="1.5" ry="1.2" fill="#1E1B4B" />
              <ellipse cx="36" cy="33" rx="1.5" ry="1.2" fill="#1E1B4B" />
              <circle cx="44" cy="28" r="1.6" fill="#EF4444" />
              <circle cx="47.5" cy="31.5" r="1.6" fill="#38BDF8" />
              <circle cx="44" cy="35" r="1.6" fill="#22C55E" />
              <circle cx="40.5" cy="31.5" r="1.6" fill="#FACC15" />
            </svg>
          </div>
          <div
            style={{
              fontFamily: "'Baloo 2', 'Nunito', sans-serif",
              fontSize: '24px',
              fontWeight: 900,
              color: '#9D174D',
              lineHeight: 1.1,
            }}
          >
            Juegos de 2°
          </div>
          <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, marginTop: '4px' }}>
            Practica jugando y aprende más
          </div>
        </div>

        {/* 4 Games Options */}
        <div style={{ display: 'grid', gap: '11px' }}>
          {/* 1. Laboratorio de Estadística */}
          <button
            type="button"
            onClick={() => onSelectOption('stats')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'linear-gradient(135deg, #F5F3FF, #EEF2FF)',
              border: '2px solid #C7D2FE',
              borderRadius: '18px',
              padding: '13px 14px',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: "'Nunito', sans-serif",
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ flexShrink: 0, width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 48 48" style={{ width: '36px', height: '36px', filter: 'drop-shadow(0 2px 4px rgba(74, 222, 128, 0.35))' }} fill="none">
                <rect x="20" y="4" width="8" height="3" rx="1.5" fill="#38BDF8" />
                <path d="M 22 7 L 22 20 L 14 34 C 12 37 14 41 18 41 L 30 41 C 34 41 36 37 34 34 L 26 20 L 26 7 Z" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 16 32 L 32 32 C 33.5 35 32 39 29 39 L 19 39 C 16 39 14.5 35 16 32 Z" fill="#4ADE80" />
                <circle cx="21" cy="35" r="1.5" fill="#DCFCE7" />
                <circle cx="27" cy="36" r="1" fill="#DCFCE7" />
                <circle cx="24" cy="33" r="1.2" fill="#DCFCE7" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#312E81', lineHeight: 1.2 }}>
                Laboratorio de Estadística
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700, marginTop: '2px' }}>
                Mete datos y crea gráficos
              </div>
            </div>
            <span style={{ color: '#6366F1', fontWeight: 900, fontSize: '18px' }}>›</span>
          </button>

          {/* 2. Tablas Mágicas */}
          <button
            type="button"
            onClick={() => onSelectOption('tablas')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
              border: '2px solid #FED7AA',
              borderRadius: '18px',
              padding: '13px 14px',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: "'Nunito', sans-serif",
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(234, 88, 12, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ flexShrink: 0, width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 48 48" style={{ width: '36px', height: '36px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} fill="none">
                <rect x="6" y="8" width="36" height="32" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="6" y1="24" x2="42" y2="24" stroke="#E2E8F0" strokeWidth="1.5" />
                <line x1="18" y1="8" x2="18" y2="40" stroke="#E2E8F0" strokeWidth="1.5" />
                <line x1="30" y1="8" x2="30" y2="40" stroke="#E2E8F0" strokeWidth="1.5" />
                <rect x="10" y="20" width="5" height="16" rx="1.5" fill="#A855F7" />
                <rect x="22" y="14" width="5" height="22" rx="1.5" fill="#EC4899" />
                <rect x="33" y="10" width="5" height="26" rx="1.5" fill="#3B82F6" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#7C2D12', lineHeight: 1.2 }}>
                Tablas Mágicas
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700, marginTop: '2px' }}>
                Practica las tablas del 1 al 10
              </div>
            </div>
            <span style={{ color: '#EA580C', fontWeight: 900, fontSize: '18px' }}>›</span>
          </button>

          {/* 3. Tablas de Conteo */}
          <button
            type="button"
            onClick={() => onSelectOption('conteo')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
              border: '2px solid #A7F3D0',
              borderRadius: '18px',
              padding: '13px 14px',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: "'Nunito', sans-serif",
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ flexShrink: 0, width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 48 48" style={{ width: '36px', height: '36px', filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }} fill="none">
                <rect x="6" y="6" width="36" height="36" rx="8" fill="#3B82F6" />
                <text x="13" y="21" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="'Baloo 2', sans-serif">1</text>
                <text x="26" y="21" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="'Baloo 2', sans-serif">2</text>
                <text x="13" y="35" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="'Baloo 2', sans-serif">3</text>
                <text x="26" y="35" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="'Baloo 2', sans-serif">4</text>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#064E3B', lineHeight: 1.2 }}>
                Tablas de Conteo
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700, marginTop: '2px' }}>
                Conteo 1-10, 1-20, 1-50, 1-100
              </div>
            </div>
            <span style={{ color: '#059669', fontWeight: 900, fontSize: '18px' }}>›</span>
          </button>

          {/* 4. Retos Matemáticos */}
          <button
            type="button"
            onClick={() => onSelectOption('retos')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'linear-gradient(135deg, #FFF1F2, #FFE4E6)',
              border: '2px solid #FECDD3',
              borderRadius: '18px',
              padding: '13px 14px',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: "'Nunito', sans-serif",
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(225, 29, 72, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ flexShrink: 0, width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 48 48" style={{ width: '36px', height: '36px', filter: 'drop-shadow(0 2px 4px rgba(244, 63, 94, 0.35))' }} fill="none">
                <circle cx="22" cy="26" r="16" fill="#FDA4AF" />
                <circle cx="22" cy="26" r="12" fill="#FFFFFF" />
                <circle cx="22" cy="26" r="8" fill="#F43F5E" />
                <circle cx="22" cy="26" r="4" fill="#FFFFFF" />
                <path d="M 38 10 L 25 23" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
                <polygon points="38,10 34,7 41,7 41,14" fill="#38BDF8" />
                <polygon points="38,10 41,14 44,11 41,7" fill="#0284C7" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#881337', lineHeight: 1.2 }}>
                Retos Matemáticos
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700, marginTop: '2px' }}>
                Pon a prueba tu velocidad
              </div>
            </div>
            <span style={{ color: '#E11D48', fontWeight: 900, fontSize: '18px' }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
