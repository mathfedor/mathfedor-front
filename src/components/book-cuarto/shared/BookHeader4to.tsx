'use client';

import React from 'react';
import { useBook4 } from '../context/Book4Context';
import Swal from 'sweetalert2';

interface BookHeader4toProps {
  onOpenIntro?: () => void;
  onOpenGalaxy?: () => void;
}

export default function BookHeader4to({ onOpenIntro, onOpenGalaxy }: BookHeader4toProps) {
  const { student, coins, streak, screen, goScreen, resetStudent } = useBook4();

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
              app: 'MatematicasDeFedor4',
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
      a.download = `progreso-fedor-4to-${new Date().toISOString().slice(0, 10)}.json`;
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
        localStorage.setItem('fedor4_last_save', new Date().toISOString());
      }
      Swal.fire({
        title: '💾 Progreso Guardado',
        text: '¡Tu avance de 4° ha sido guardado exitosamente en este dispositivo!',
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

  return (
    <header className="hdr-4to">
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
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: '#7B2FBE', letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Matemáticas de
            </div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, fontWeight: 900, color: '#E8650A', textShadow: '0 1px 0 rgba(245,197,24,.5)' }}>
              feDOR
            </div>
          </div>
        </div>
      </div>

      <div className="hdr-mid">
        <span className="grade-pill-4to">4° Grado</span>
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

        {screen !== 'home' && screen !== 'setup' && (
          <button
            type="button"
            className="hdr-btn student"
            onClick={() => goScreen('home')}
          >
            🏠 Inicio
          </button>
        )}

        {screen === 'home' && onOpenIntro && (
          <button
            type="button"
            className="hdr-btn"
            style={{
              background: 'linear-gradient(135deg, rgba(232,101,10,0.15), rgba(245,197,24,0.15))',
              borderColor: '#F5C518',
              color: '#B45309',
            }}
            onClick={onOpenIntro}
            title="Ver intro cinemática de despegue"
          >
            🎬 Intro
          </button>
        )}

        <button
          type="button"
          className="hdr-btn report-btn"
          onClick={() => goScreen('report')}
        >
          📊 Reporte
        </button>

        <button
          type="button"
          className="hdr-btn"
          style={{
            background: 'linear-gradient(135deg, #E8650A, #FF8C2A)',
            color: '#fff',
            borderColor: '#E8650A',
          }}
          onClick={handleSaveProgress}
          title="Guardar progreso actual"
        >
          ⬇ Guardar
        </button>

        {student?.name && (
          <button
            type="button"
            className="hdr-btn"
            style={{
              background: '#FEE2E2',
              borderColor: '#FCA5A5',
              color: '#991B1B',
              padding: '6px 10px',
            }}
            onClick={() => {
              Swal.fire({
                title: '¿Reiniciar sesión?',
                text: 'Volverás al formulario inicial con tus datos de estudiante.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#E8650A',
                cancelButtonColor: '#6B7280',
                confirmButtonText: 'Sí, reiniciar',
                cancelButtonText: 'Cancelar',
              }).then((result) => {
                if (result.isConfirmed) {
                  resetStudent();
                }
              });
            }}
            title="Cambiar de estudiante / Reiniciar formulario"
          >
            🔄
          </button>
        )}
      </div>

      <style>{`
        .hdr-4to {
          background: #ffffff;
          border-bottom: 2px solid #e8dbff;
          box-shadow: 0 4px 18px rgba(42, 15, 96, 0.08);
          border-radius: 20px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          position: sticky;
          top: 12px;
          z-index: 1000;
          font-family: 'Nunito', sans-serif;
        }

        .hdr-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hdr-mid {
          display: flex;
          align-items: center;
        }

        .grade-pill-4to {
          background: linear-gradient(135deg, #fef0e6, #ffe2c8);
          color: #9a3412;
          border: 1.5px solid #f97316;
          border-radius: 14px;
          padding: 3px 12px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.03em;
        }

        .hdr-btns {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .coin-hdr,
        .streak-hdr {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #f7f4ff;
          border: 1.5px solid #c5bfee;
          border-radius: 12px;
          padding: 4px 10px;
          font-size: 13px;
          font-weight: 900;
          color: #3d1468;
        }

        .hdr-btn {
          border-radius: 12px;
          border: 1.5px solid #c5bfee;
          background: #f7f4ff;
          color: #3d1468;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 900;
          padding: 6px 12px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hdr-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        .hdr-btn.student {
          background: #eeedfe;
          border-color: #a78bfa;
          color: #4338ca;
        }

        .hdr-btn.report-btn {
          background: #e0f2fe;
          border-color: #38bdf8;
          color: #0369a1;
        }

        @media (max-width: 768px) {
          .hdr-4to {
            padding: 6px 10px;
          }
          .grade-pill-4to {
            display: none;
          }
          .coin-hdr,
          .streak-hdr {
            padding: 3px 6px;
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
