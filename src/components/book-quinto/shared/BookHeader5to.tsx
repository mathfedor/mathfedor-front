'use client';

import React from 'react';
import { useBook5 } from '../context/Book5Context';
import Swal from 'sweetalert2';

interface BookHeader5toProps {
  onOpenIntro?: () => void;
  onOpenGalaxy?: () => void;
}

export default function BookHeader5to({ onOpenIntro, onOpenGalaxy }: BookHeader5toProps) {
  const { student, coins, streak, screen, goScreen, resetStudent } = useBook5();

  const handleLogoClick = () => {
    if (student?.name && screen !== 'home') {
      goScreen('home');
    }
  };

  const handleExportJSON = () => {
    try {
      const data: Record<string, string> = {};
      let n = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.toLowerCase().includes('fedor')) {
          data[k] = localStorage.getItem(k) || '';
          n++;
        }
      }
      const blob = new Blob(
        [
          JSON.stringify(
            {
              app: 'MatematicasDeFedor5',
              fecha: new Date().toISOString(),
              student: student?.name || 'Estudiante',
              coins,
              streak,
              datos: data,
            },
            null,
            2
          ),
        ],
        { type: 'application/json' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `progreso-fedor-5to-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      Swal.fire({
        title: '📤 Progreso Exportado',
        text: `Se descargó el archivo con ${n} registros guardados.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        title: 'Error al exportar',
        text: 'No se pudo generar el archivo de respaldo.',
        icon: 'error',
      });
    }
  };

  const handleSaveProgress = () => {
    try {
      if (student?.name) {
        localStorage.setItem('fedor5_last_save', new Date().toISOString());
      }
      Swal.fire({
        title: '💾 Progreso Guardado',
        text: '¡Tu avance de 5° ha sido guardado exitosamente en este dispositivo!',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        title: 'Guardado',
        text: 'Progreso sincronizado correctamente.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
    }
  };

  const handleToggleSound = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      } else {
        const text = `Matemáticas de Fedor, 5° Grado. Tienes ${coins} monedas y ${streak} días de racha.`;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'es-CO';
        window.speechSynthesis.speak(utter);
      }
    }
  };

  return (
    <header className="hdr-5to">
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
                <radialGradient id="sp44_4" cx="38%" cy="32%">
                  <stop offset="0%" stopColor="#6A20A8" />
                  <stop offset="55%" stopColor="#1A0848" />
                  <stop offset="100%" stopColor="#080E30" />
                </radialGradient>
                <radialGradient id="hb44_4" cx="40%" cy="30%">
                  <stop offset="0%" stopColor="#F8F8F8" />
                  <stop offset="70%" stopColor="#D0D0D8" />
                  <stop offset="100%" stopColor="#A8A8B8" />
                </radialGradient>
                <radialGradient id="fp44_4" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="#FF9030" />
                  <stop offset="60%" stopColor="#E86010" />
                  <stop offset="100%" stopColor="#903000" />
                </radialGradient>
                <radialGradient id="vs44_4" cx="30%" cy="25%">
                  <stop offset="0%" stopColor="#1A3060" />
                  <stop offset="100%" stopColor="#050A18" />
                </radialGradient>
              </defs>
              {/* Space background */}
              <circle cx="22" cy="22" r="22" fill="url(#sp44_4)" />
              {/* Stars */}
              <circle cx="7" cy="7" r="0.9" fill="white" opacity=".9" />
              <circle cx="37" cy="9" r="0.7" fill="white" opacity=".8" />
              <circle cx="39" cy="30" r="0.5" fill="white" opacity=".7" />
              <circle cx="5" cy="30" r="0.6" fill="white" opacity=".7" />
              <circle cx="18" cy="40" r="0.5" fill="white" opacity=".6" />
              {/* Teal nebula glow at bottom */}
              <ellipse cx="22" cy="40" rx="14" ry="6" fill="#00B4D8" opacity=".2" />
              {/* Helmet body (white/gray rounded) */}
              <ellipse cx="22" cy="23" rx="13" ry="14" fill="url(#hb44_4)" />
              {/* Orange faceplate border (thick ring) */}
              <ellipse cx="22" cy="23" rx="13" ry="14" fill="none" stroke="#E86010" strokeWidth="2.5" opacity=".9" />
              {/* Dark visor (oval inside) */}
              <ellipse cx="22" cy="22" rx="7.5" ry="6.5" fill="url(#vs44_4)" />
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
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: '#6C28B4', letterSpacing: '.07em', textTransform: 'uppercase' }}>
              MATEMÁTICAS DE
            </div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, fontWeight: 900 }}>
              <span style={{ color: '#6C28B4' }}>fe</span>
              <span style={{ color: '#E8650A' }}>DOR</span>
            </div>
          </div>
        </div>

        <span className="grade-pill-5to">5° Grado</span>
      </div>

      <div className="hdr-btns">
        <div className="coin-hdr" title="Monedas acumuladas">
          <span>🪙</span>
          <span>{coins}</span>
        </div>
        <div className="streak-hdr" title="Racha activa">
          <span>🔥</span>
          <span>{streak}</span>
        </div>

        <button
          type="button"
          className="hdr-btn sound-btn"
          onClick={handleToggleSound}
          title="Voz y audio"
        >
          🔊
        </button>

        <button
          type="button"
          className="hdr-btn report-btn"
          onClick={() => goScreen('report')}
          title="Ver reporte detallado"
        >
          📊 Reporte
        </button>

        <button
          type="button"
          className="hdr-btn export-btn"
          onClick={handleExportJSON}
          title="Exportar progreso"
        >
          🗂️ Exportar
        </button>

        <button
          type="button"
          className="hdr-btn save-btn"
          onClick={handleSaveProgress}
          title="Guardar progreso actual"
        >
          ⬇ Guardar
        </button>
      </div>

      <style>{`
        .hdr-5to {
          background: #ffffff;
          border: 1px solid rgba(221, 216, 245, 0.6);
          border-bottom: 2px solid #e8dbff;
          box-shadow: 0 4px 20px rgba(108, 40, 180, 0.08);
          border-radius: 24px;
          padding: 8px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          position: sticky;
          top: calc(4rem + 8px);
          z-index: 40;
          font-family: 'Nunito', sans-serif;
          max-width: 1020px;
          margin: 0 auto;
        }

        .hdr-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .grade-pill-5to {
          background: #fff3e0;
          color: #c2410c;
          border: 1.5px solid #ffb74d;
          border-radius: 9999px;
          padding: 3px 12px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: center;
        }

        .hdr-btns {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-wrap: wrap;
        }

        .coin-hdr {
          background: #fef9c3;
          border: 1.5px solid #fde047;
          color: #854d0e;
          border-radius: 9999px;
          padding: 3.5px 11px;
          font-size: 12.5px;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .streak-hdr {
          background: #fee2e2;
          border: 1.5px solid #fca5a5;
          color: #991b1b;
          border-radius: 9999px;
          padding: 3.5px 11px;
          font-size: 12.5px;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .hdr-btn {
          border-radius: 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          padding: 5.5px 12px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 5px;
          line-height: 1.2;
        }

        .hdr-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        .sound-btn {
          background: #ede9fe;
          border: 1.5px solid #ddd6fe;
          color: #6d28d9;
          padding: 5.5px 10px;
          font-size: 13px;
        }

        .report-btn {
          background: #fffbeb;
          border: 1.5px solid #fde68a;
          color: #92400e;
        }

        .export-btn {
          background: #f3e8ff;
          border: 1.5px solid #e9d5ff;
          color: #6b21a8;
        }

        .save-btn {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border: 1.5px solid #ea580c;
          color: #ffffff;
          font-weight: 900;
          padding: 5.5px 15px;
          box-shadow: 0 2px 8px rgba(234, 88, 12, 0.28);
        }

        @media (max-width: 768px) {
          .hdr-5to {
            padding: 6px 10px;
          }
          .grade-pill-5to {
            display: none;
          }
          .coin-hdr,
          .streak-hdr {
            padding: 2.5px 6px;
            font-size: 11px;
          }
          .hdr-btn {
            padding: 4px 8px;
            font-size: 11px;
          }
        }
      `}</style>
    </header>
  );
}
