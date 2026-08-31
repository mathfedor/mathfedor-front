'use client';

import { useEffect } from 'react';

interface WelcomeIntroModal2doProps {
  onClose: () => void;
}

const STEPS = [
  { num: '1', text: 'Explora la Galaxia Fedor — 5 planetas te esperan', icon: '🌌' },
  { num: '2', text: 'Gana XP, medallas y avatares espaciales', icon: '⭐' },
  { num: '3', text: 'El docente ve el reporte en tiempo real', icon: '📊' },
  { num: '4', text: 'IA Fedor analiza tu desempeño pedagógico', icon: '🤖' },
];

/**
 * Modal emergente de bienvenida que aparece tras finalizar la animación de despegue en Grado 2°.
 */
export default function WelcomeIntroModal2do({ onClose }: WelcomeIntroModal2doProps) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleClose = () => {
    try {
      sessionStorage.setItem('fedor2_welcome_seen', '1');
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        userSelect: 'none',
        fontFamily: "'Nunito', sans-serif",
      }}
      onClick={handleClose}
    >
      <style>{`
        @keyframes welcomePopUp {
          0% { opacity: 0; transform: scale(0.88) translateY(16px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes astronautFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        .welcome-2do-card {
          animation: welcomePopUp 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .welcome-2do-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.06);
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.45);
        }
        .welcome-2do-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div
        className="welcome-2do-card"
        style={{
          background: '#ffffff',
          borderRadius: '26px',
          maxWidth: '390px',
          width: '100%',
          padding: '1.8rem 1.5rem 1.3rem',
          textAlign: 'center',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
          color: '#333333',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícono de astronauta flotante */}
        <div
          style={{
            fontSize: '56px',
            marginBottom: '0.4rem',
            animation: 'astronautFloat 3s ease-in-out infinite',
            lineHeight: 1,
          }}
        >
          🧑‍🚀
        </div>

        {/* Título Principal */}
        <h2
          style={{
            fontFamily: "'Baloo 2', 'Nunito', sans-serif",
            fontSize: '22px',
            fontWeight: 900,
            color: '#7C3AED',
            margin: '0 0 0.4rem',
            lineHeight: 1.2,
          }}
        >
          ¡Bienvenido a Matemáticas de Fedor!
        </h2>

        {/* Subtítulo */}
        <p
          style={{
            fontSize: '12.5px',
            color: '#4B5563',
            fontWeight: 700,
            lineHeight: 1.4,
            margin: '0 0 1.2rem',
          }}
        >
          ¡Libro completo de 2° grado! 8 unidades · 5 niveles · gamificación + IA Fedor
        </p>

        {/* 4 Pasos / Características */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.4rem' }}>
          {STEPS.map((step) => (
            <div
              key={step.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#F5F3FF',
                borderRadius: '14px',
                padding: '9px 12px',
                textAlign: 'left',
                border: '1px solid #EDE9FE',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#7C3AED',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {step.num}
              </div>
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: '#374151',
                  lineHeight: 1.3,
                }}
              >
                <span style={{ marginRight: '5px' }}>{step.icon}</span>
                {step.text}
              </div>
            </div>
          ))}
        </div>

        {/* Botón ¡Empezar Aventura! */}
        <button
          type="button"
          onClick={handleClose}
          className="welcome-2do-btn"
          style={{
            width: '100%',
            padding: '13px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            fontSize: '16px',
            fontWeight: 900,
            fontFamily: "'Nunito', sans-serif",
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(124, 58, 237, 0.35)',
            transition: 'all 0.15s ease',
          }}
        >
          ¡Empezar Aventura! 🚀
        </button>

        {/* Enlace Omitir tutorial */}
        <div style={{ marginTop: '10px' }}>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#8B5CF6',
              textDecoration: 'underline',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              padding: '4px 8px',
            }}
          >
            Omitir tutorial
          </button>
        </div>
      </div>
    </div>
  );
}
