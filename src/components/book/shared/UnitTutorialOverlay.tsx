'use client';

import type { UnitTutorial } from '@/types/book.types';
import { UnitOperationIcon3D1ro } from '@/components/book-primero/shared/UnitWelcomeModal1ro';
import { fedorTTS } from '@/services/tts.service';

interface UnitTutorialOverlayProps {
  tut: UnitTutorial;
  onClose: () => void;
  unitIndex?: number;
}

/** Tutorial introductorio de unidad (réplica exacta de showUnitTutorial con estética 3D). */
export default function UnitTutorialOverlay({ tut, onClose, unitIndex }: UnitTutorialOverlayProps) {
  const handleStart = () => {
    try {
      fedorTTS.speak(tut.title);
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div
      className="utut-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutTitle2do"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9995,
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
    >
      <div
        className="utut-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '92%',
          maxWidth: 415,
          background: '#ffffff',
          borderRadius: 28,
          padding: '2rem 1.75rem 1.75rem',
          textAlign: 'center',
          boxShadow: '0 24px 65px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: 'auto',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'tutPopIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Icono matemático 3D con animación flotante continua */}
        <div
          className="utut-icon"
          style={{
            minHeight: 76,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            animation: 'tutIconFloat 2.6s ease-in-out infinite',
            flexShrink: 0,
          }}
        >
          {typeof unitIndex === 'number' ? (
            <UnitOperationIcon3D1ro unitIndex={unitIndex} size={76} />
          ) : (
            <span style={{ fontSize: 56 }}>{tut.icon}</span>
          )}
        </div>

        {/* Título de la Unidad */}
        <h2
          id="tutTitle2do"
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#7B2FBE',
            fontFamily: "'Baloo 2', 'Nunito', sans-serif",
            lineHeight: 1.3,
            marginBottom: '0.65rem',
            letterSpacing: '-0.02em',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {tut.title}
        </h2>

        {/* Subtítulo / Descripción pedagógica */}
        <p
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: '#555555',
            lineHeight: 1.55,
            maxWidth: 320,
            margin: '0 auto 1.35rem auto',
            textAlign: 'center',
          }}
        >
          {tut.text}
        </p>

        {/* Pasos / Destacados numerados con espaciado amplio */}
        <div
          className="utut-steps"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: '1.5rem',
            textAlign: 'left',
            width: '100%',
          }}
        >
          {tut.steps.map((s, i) => (
            <div
              className="utut-step"
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                background: '#F7F4FF',
                borderRadius: 14,
                border: '1px solid #ECE6FA',
                boxShadow: '0 1px 3px rgba(123, 47, 190, 0.04)',
                flexShrink: 0,
              }}
            >
              <div
                className="utut-step-num"
                style={{
                  width: 24,
                  height: 24,
                  minWidth: 24,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 5px rgba(123, 47, 190, 0.3)',
                }}
              >
                {i + 1}
              </div>
              <div
                className="utut-step-txt"
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#333333',
                  lineHeight: 1.45,
                  flex: 1,
                }}
              >
                {s}
              </div>
            </div>
          ))}
        </div>

        {/* Botón Principal: ¡Empezar Aventura! 🚀 */}
        <button
          type="button"
          className="btn-launch"
          onClick={handleStart}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(123, 47, 190, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(123, 47, 190, 0.35)';
          }}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #7B2FBE 0%, #8E3AD5 50%, #A864E8 100%)',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: 15,
            border: 'none',
            boxShadow: '0 6px 20px rgba(123, 47, 190, 0.35)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: '0.85rem',
            fontFamily: "'Nunito', sans-serif",
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            flexShrink: 0,
          }}
        >
          <span>¡Empezar Aventura!</span>
          <span style={{ fontSize: 16 }}>🚀</span>
        </button>

        {/* Enlace secundario: Omitir tutorial */}
        <div style={{ width: '100%', textAlign: 'center', paddingBottom: 2 }}>
          <button
            type="button"
            className="utut-skip"
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#7B2FBE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#aaaaaa';
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 12.5,
              color: '#aaaaaa',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              cursor: 'pointer',
              padding: '4px 8px',
              fontFamily: "'Nunito', sans-serif",
              letterSpacing: '0.01em',
              transition: 'color 0.15s ease',
            }}
          >
            Omitir tutorial
          </button>
        </div>

        <style>{`
          @keyframes tutPopIn {
            0% {
              transform: scale(0.92);
              opacity: 0;
            }
            70% {
              transform: scale(1.02);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes tutIconFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
