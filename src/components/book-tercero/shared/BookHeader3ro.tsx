'use client';

import React from 'react';
import { useBook3 } from '../context/Book3Context';

interface BookHeader3roProps {
  onOpenIntro?: () => void;
}

export default function BookHeader3ro({ onOpenIntro }: BookHeader3roProps) {
  const { student, coins, streak, screen, goScreen, resetStudent } = useBook3();

  const handleLogoClick = () => {
    if (student?.name && screen !== 'home') {
      goScreen('home');
    }
  };

  return (
    <header className="hdr-3ro">
      <div className="hdr-left">
        <div
          className="logo-area"
          onClick={handleLogoClick}
          style={{
            cursor: student?.name ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {/* Circular astronaut helmet icon matching the original HTML */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 0 0 2.5px rgba(245,197,24,.5), 0 4px 16px rgba(123,47,190,.5)',
            }}
          >
            <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
              <defs>
                <radialGradient id="sp44_3" cx="38%" cy="32%">
                  <stop offset="0%" stopColor="#6A20A8" />
                  <stop offset="55%" stopColor="#1A0848" />
                  <stop offset="100%" stopColor="#080E30" />
                </radialGradient>
                <radialGradient id="hb44_3" cx="40%" cy="30%">
                  <stop offset="0%" stopColor="#F8F8F8" />
                  <stop offset="70%" stopColor="#D0D0D8" />
                  <stop offset="100%" stopColor="#A8A8B8" />
                </radialGradient>
                <radialGradient id="fp44_3" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="#FF9030" />
                  <stop offset="60%" stopColor="#E86010" />
                  <stop offset="100%" stopColor="#903000" />
                </radialGradient>
                <radialGradient id="vs44_3" cx="30%" cy="25%">
                  <stop offset="0%" stopColor="#1A3060" />
                  <stop offset="100%" stopColor="#050A18" />
                </radialGradient>
              </defs>
              {/* Space background */}
              <circle cx="22" cy="22" r="22" fill="url(#sp44_3)" />
              {/* Stars */}
              <circle cx="7" cy="7" r="0.9" fill="white" opacity=".9" />
              <circle cx="37" cy="9" r="0.7" fill="white" opacity=".8" />
              <circle cx="39" cy="30" r="0.5" fill="white" opacity=".7" />
              <circle cx="5" cy="30" r="0.6" fill="white" opacity=".7" />
              <circle cx="18" cy="40" r="0.5" fill="white" opacity=".6" />
              {/* Teal nebula glow at bottom */}
              <ellipse cx="22" cy="40" rx="14" ry="6" fill="#00B4D8" opacity=".2" />
              {/* Helmet body (white/gray rounded) */}
              <ellipse cx="22" cy="23" rx="13" ry="14" fill="url(#hb44_3)" />
              {/* Orange faceplate border (thick ring) */}
              <ellipse cx="22" cy="23" rx="13" ry="14" fill="none" stroke="#E86010" strokeWidth="2.5" opacity=".9" />
              {/* Dark visor (oval inside) */}
              <ellipse cx="22" cy="22" rx="7.5" ry="6.5" fill="url(#vs44_3)" />
              {/* Visor sheen (light reflection) */}
              <ellipse cx="19" cy="19" rx="2.8" ry="1.8" fill="rgba(255,255,255,0.28)" transform="rotate(-15,19,19)" />
              <ellipse cx="24" cy="24" rx="1.2" ry="0.8" fill="rgba(255,255,255,0.12)" />
              {/* White rim highlight on top of helmet */}
              <path d="M12,15 Q22,9 32,15" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" />
              {/* Bottom neck connector (white) */}
              <rect x="17" y="35" width="10" height="4" rx="2" fill="#D0D0D8" />
              <rect x="19" y="33" width="6" height="3" rx="1.5" fill="#B8B8C8" />
            </svg>
          </div>

          {/* Logo text: Matemáticas de feDOR */}
          <div style={{ lineHeight: 1 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 900,
                color: '#7B2FBE',
                letterSpacing: '.06em',
                textTransform: 'uppercase',
              }}
            >
              Matemáticas de
            </div>
            <div
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: 18,
                fontWeight: 900,
                color: '#E8650A',
                textShadow: '0 1px 0 rgba(245,197,24,.5)',
              }}
            >
              feDOR
            </div>
          </div>
        </div>

        <span className="grade-pill">3° Grado</span>
      </div>

      <div className="hdr-btns">
        {Boolean(student?.name) && (
          <>
            <div className="coin-hdr" title="Monedas acumuladas">
              <span>🪙</span>
              <span>{coins}</span>
            </div>

            {streak > 0 && (
              <div className="streak-hdr" title="Racha de días">
                <span>🔥</span>
                <span>{streak}</span>
              </div>
            )}

            {screen !== 'home' && (
              <button
                type="button"
                className="hdr-btn"
                onClick={() => goScreen('home')}
                title="Ir al inicio"
              >
                🏠 Inicio
              </button>
            )}
          </>
        )}

        {onOpenIntro && (
          <button
            type="button"
            className="hdr-btn f1-hdr-intro"
            onClick={onOpenIntro}
            title="Ver introducción animada"
          >
            <span>🚀</span> Ver despegue
          </button>
        )}
      </div>

      <style jsx>{`
        .hdr-3ro {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(255, 255, 255, 0.95);
          border: 1.5px solid #DDD8F5;
          border-radius: 22px;
          box-shadow: 0 2px 12px rgba(108, 40, 180, 0.08);
          margin-bottom: 1.25rem;
          width: 100%;
          max-width: 1320px;
          box-sizing: border-box;
          backdrop-filter: blur(16px);
        }

        .hdr-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .grade-pill {
          font-size: 11px;
          font-weight: 900;
          background: linear-gradient(135deg, #FEF0E6, #FFE2C8);
          color: #B84D00;
          padding: 5px 14px;
          border-radius: 20px;
          border: 1.5px solid #FBBF7A;
          letter-spacing: 0.02em;
        }

        .hdr-btns {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .coin-hdr {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          font-weight: 900;
          color: #D4A017;
          background: rgba(212, 160, 23, 0.12);
          border: 1.5px solid rgba(245, 197, 24, 0.35);
          padding: 4px 12px;
          border-radius: 20px;
        }

        .streak-hdr {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          font-weight: 900;
          color: #FF6B6B;
          background: rgba(255, 107, 107, 0.1);
          border: 1.5px solid rgba(255, 107, 107, 0.3);
          padding: 4px 12px;
          border-radius: 20px;
        }

        .hdr-btn {
          font-size: 11px;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 20px;
          cursor: pointer;
          border: 1.5px solid #DDD8F5;
          background: #F0EDFF;
          color: #6C28B4;
          transition: all 0.2s;
          font-family: 'Nunito', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .hdr-btn:hover {
          background: #6C28B4;
          color: #fff;
          border-color: #6C28B4;
        }

        .f1-hdr-intro {
          background: linear-gradient(135deg, #FF1D4E, #FF9F00);
          color: #fff;
          border: 2px solid #FFF7C2;
          font-size: 12px;
          padding: 6px 14px;
          font-weight: 900;
          border-radius: 24px;
          box-shadow: 0 4px 14px rgba(255, 29, 78, 0.35);
        }

        .f1-hdr-intro:hover {
          transform: scale(1.04);
          background: linear-gradient(135deg, #FF1D4E, #FFA726);
          color: #fff;
        }
      `}</style>
    </header>
  );
}
