'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook4 } from '../context/Book4Context';
import Swal from 'sweetalert2';

interface Grade4FloatingButtonsProps {
  onOpenAiChat: () => void;
  onOpenIntro: () => void;
  onOpenGalaxy: () => void;
  onOpenProblemas: () => void;
  onOpenToolModal: (title: string, content: React.ReactNode) => void;
}

const MASCOT_MESSAGES_4TO = [
  '¡Hola cadete de 4°! Soy Fedor, tu amigo astronauta. ¡Vamos a conquistar el cosmos matemático!',
  '¡Excelente! Cada nivel completado te otorga XP para ascender de rango: ¡desde Explorador hasta Leyenda!',
  '¿Sabías que la multiplicación y la división son operaciones inversas? ¡Practícalas a diario!',
  '¡Rumbo a las estrellas! En cada misión descubres un nuevo planeta de nuestro sistema solar.',
  '¡No te rindas! Los problemas de la vida cotidiana son la clave de la prueba SABER 4°.',
];

export default function Grade4FloatingButtons({
  onOpenAiChat,
  onOpenIntro,
  onOpenGalaxy,
  onOpenProblemas,
  onOpenToolModal,
}: Grade4FloatingButtonsProps) {
  const { goScreen, dark, setDark, currentUnit, resetStudent, selectUnit, student, coins, streak } = useBook4();

  const [showTools, setShowTools] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMascotMessage, setShowMascotMessage] = useState(false);
  const [mascotText, setMascotText] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [voiceType, setVoiceType] = useState<'fem' | 'def'>('fem');

  const toolsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        const fab = document.getElementById('p3Fab');
        if (!fab || !fab.contains(event.target as Node)) {
          setShowTools(false);
        }
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        const fab = document.getElementById('f5AjustesBtn');
        if (!fab || !fab.contains(event.target as Node)) {
          setShowSettings(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMascotClick = () => {
    const msg = MASCOT_MESSAGES_4TO[Math.floor(Math.random() * MASCOT_MESSAGES_4TO.length)];
    setMascotText(msg);
    setShowMascotMessage(true);
    setTimeout(() => {
      setShowMascotMessage(false);
    }, 4500);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => {
      const next = Math.max(80, Math.min(130, prev + delta * 10));
      document.documentElement.style.fontSize = `${(next / 100) * 16}px`;
      return next;
    });
  };

  const handleExport = () => {
    try {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.toLowerCase().includes('fedor')) {
          data[k] = localStorage.getItem(k) || '';
        }
      }
      const blob = new Blob(
        [
          JSON.stringify(
            {
              app: 'MatematicasDeFedor4',
              version: '2026.09.27',
              student: student?.name || 'Estudiante',
              coins,
              streak,
              data,
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
        title: 'Progreso Exportado',
        text: 'Se descargó el archivo de respaldo de 4°.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire('Error', 'No se pudo exportar el progreso.', 'error');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (re) => {
        try {
          const parsed = JSON.parse(re.target?.result as string);
          if (parsed && parsed.data) {
            Object.keys(parsed.data).forEach((k) => {
              localStorage.setItem(k, parsed.data[k]);
            });
            Swal.fire({
              title: '¡Progreso Restaurado!',
              text: 'Se importaron los datos con éxito. La página se actualizará.',
              icon: 'success',
            }).then(() => {
              window.location.reload();
            });
          }
        } catch {
          Swal.fire('Error', 'Archivo de respaldo no válido.', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const speakScreen = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const txt = document.body.innerText.slice(0, 500);
      const utter = new SpeechSynthesisUtterance(txt);
      utter.lang = 'es-ES';
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <>
      {/* ═════════════════════════════════════════════════════════════
          1. BOTÓN FLOTANTE DERECHA: #p3Fab con .f4-fab-ancho (Original 4°)
      ═════════════════════════════════════════════════════════════ */}
      <button
        type="button"
        id="p3Fab"
        className="f4-fab-ancho"
        onClick={() => {
          setShowTools((prev) => !prev);
          setShowSettings(false);
        }}
        title="Herramientas y recursos"
      >
        <span>🛠️</span>
        <span>Menu</span>
      </button>

      {/* Menú Flotante #p3Popup */}
      {showTools && (
        <div id="p3Popup" ref={toolsRef} className="open">
          <button
            type="button"
            className="btn3d"
            title="Tablas de conteo"
            onClick={() => {
              setShowTools(false);
              selectUnit(0);
            }}
          >
            <span>🔢</span>
            <span>Conteo</span>
          </button>

          <button
            type="button"
            className="btn3d"
            title="Tablas de multiplicar"
            onClick={() => {
              setShowTools(false);
              selectUnit(2);
            }}
          >
            <span>✖️</span>
            <span>Multiplicar</span>
          </button>

          <button
            type="button"
            className="btn3d"
            title="Problemas Cotidianos SABER 4°"
            onClick={() => {
              setShowTools(false);
              onOpenProblemas();
            }}
          >
            <span>🛒</span>
            <span>SABER 4°</span>
          </button>

          <button
            type="button"
            className="btn3d"
            title="Universo Fedor"
            onClick={() => {
              setShowTools(false);
              onOpenGalaxy();
            }}
          >
            <span>🌌</span>
            <span>Universo</span>
          </button>

          <button
            type="button"
            className="btn3d"
            title="Explicaciones paso a paso"
            onClick={() => {
              setShowTools(false);
              goScreen('definiciones');
            }}
          >
            <span>💡</span>
            <span>Explicar</span>
          </button>

          <button
            type="button"
            className="btn3d"
            title="Currículo MEN 4°"
            onClick={() => {
              setShowTools(false);
              goScreen('estandares');
            }}
          >
            <span>👩‍🏫</span>
            <span>Guía Doc.</span>
          </button>

          <button
            type="button"
            className="btn3d"
            title="Informe de progreso"
            onClick={() => {
              setShowTools(false);
              goScreen('report');
            }}
          >
            <span>📊</span>
            <span>Informe</span>
          </button>

          <button
            type="button"
            className="btn3d"
            title="Asistente IA Fedor"
            onClick={() => {
              setShowTools(false);
              onOpenAiChat();
            }}
          >
            <span>🤖</span>
            <span>IA Tutor</span>
          </button>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          2. BOTÓN FLOTANTE IZQUIERDA: #f5Ajustes (Original 4°)
      ═════════════════════════════════════════════════════════════ */}
      <div id="f5Ajustes">
        {showSettings && (
          <div id="f5AjustesMenu" ref={settingsRef} style={{ display: 'block' }}>
            <div style={{ fontSize: 10, color: '#FFE066', fontWeight: 900, letterSpacing: '.14em', marginBottom: 8 }}>
              ⚙️ AJUSTES 4°
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <button
                type="button"
                className="f5-aj-btn"
                onClick={() => handleZoom(1)}
                style={{ margin: 0, textAlign: 'center' }}
              >
                A+
              </button>
              <button
                type="button"
                className="f5-aj-btn"
                onClick={() => handleZoom(-1)}
                style={{ margin: 0, textAlign: 'center' }}
              >
                A−
              </button>
            </div>
            <div style={{ fontSize: 11, color: '#C5BFEE', fontWeight: 700, margin: '-2px 0 8px', textAlign: 'center' }}>
              Tamaño: {zoomLevel}%
            </div>
            <button
              type="button"
              className="f5-aj-btn"
              onClick={() => setMusicEnabled(!musicEnabled)}
            >
              {musicEnabled ? '🎶 Música: encendida' : '🎵 Música: apagada'}
            </button>
            <button
              type="button"
              className="f5-aj-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? '🔊 Sonidos: sí' : '🔇 Sonidos: no'}
            </button>
            <button
              type="button"
              className="f5-aj-btn"
              onClick={() => setVoiceType(voiceType === 'fem' ? 'def' : 'fem')}
            >
              {voiceType === 'fem' ? '🎙️ Voz: femenina' : '🎙️ Voz: estándar'}
            </button>
            <button
              type="button"
              className="f5-aj-btn"
              onClick={speakScreen}
            >
              🔈 Escuchar esta pantalla
            </button>
            <div style={{ height: 1, background: 'rgba(245,197,24,.35)', margin: '6px 0 10px' }} />
            <button
              type="button"
              className="f5-aj-btn"
              onClick={() => {
                setShowSettings(false);
                goScreen('estandares');
              }}
            >
              📚 Currículo MEN 4°
            </button>
            <button
              type="button"
              className="f5-aj-btn"
              onClick={handleExport}
            >
              ⬇ Exportar progreso
            </button>
            <button
              type="button"
              className="f5-aj-btn"
              onClick={handleImport}
            >
              ⬆ Importar progreso
            </button>
          </div>
        )}

        <button
          type="button"
          id="f5AjustesBtn"
          title="Ajustes"
          onClick={() => {
            setShowSettings((prev) => !prev);
            setShowTools(false);
          }}
        >
          ⚙️
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          3. MASCOTA FEDOR A LA IZQUIERDA
      ═════════════════════════════════════════════════════════════ */}
      <button
        type="button"
        id="mascotFab4to"
        onClick={handleMascotClick}
        title="Toca a Fedor"
      >
        <span>🧑‍🚀</span>
      </button>

      {/* Globo de diálogo de la Mascota */}
      {showMascotMessage && (
        <div className="mascot-balloon-4to">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🧑‍🚀</span>
            <span className="text-purple-800 font-black text-[11px] uppercase tracking-wide">
              Fedor dice:
            </span>
          </div>
          <p className="leading-snug text-gray-700 text-xs font-bold">{mascotText}</p>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          4. SELLO DE VERSIÓN: #f5VerStamp (Original 4°)
      ═════════════════════════════════════════════════════════════ */}
      <div id="f5VerStamp">
        Fedor 4° · v2026.09.27
      </div>

      <style>{`
        /* Botón #p3Fab fiel al HTML 4° */
        #p3Fab.f4-fab-ancho {
          position: fixed;
          right: 14px;
          top: 96px;
          z-index: 9990;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          width: 84px;
          min-height: 56px;
          border-radius: 18px;
          background: #ffffff;
          border: 2px solid #8b3edb;
          color: #3d1468;
          box-shadow: 0 8px 24px rgba(61, 20, 104, 0.22);
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
          font-family: 'Nunito', sans-serif;
        }

        #p3Fab.f4-fab-ancho:hover {
          transform: scale(1.06);
          background: #f7f4ff;
        }

        #p3Fab.f4-fab-ancho span:first-child {
          font-size: 22px;
          line-height: 1;
        }

        #p3Fab.f4-fab-ancho span:last-child {
          font-size: 10px;
          font-weight: 900;
          color: #6c28b4;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Popup #p3Popup fiel al HTML 4° */
        #p3Popup.open {
          position: fixed;
          right: 106px;
          top: 88px;
          z-index: 9991;
          display: grid;
          grid-template-columns: repeat(2, 90px);
          gap: 8px;
          background: #ffffff;
          border: 2px solid #c5bfee;
          border-radius: 20px;
          padding: 12px;
          box-shadow: 0 12px 32px rgba(40, 10, 90, 0.25);
          animation: fadeIn 0.2s ease;
        }

        #p3Popup::before {
          content: 'HERRAMIENTAS';
          grid-column: span 2;
          display: block;
          text-align: center;
          font-size: 9px;
          font-weight: 900;
          color: #7a7299;
          letter-spacing: 0.1em;
          margin-bottom: 2px;
        }

        #p3Popup .btn3d {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 8px 6px;
          border-radius: 14px;
          border: 1.5px solid #eee8fb;
          background: #fbf9ff;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        #p3Popup .btn3d:hover {
          transform: translateY(-2px);
          background: #f3ecff;
          border-color: #8b3edb;
        }

        #p3Popup .btn3d span:first-child {
          font-size: 22px;
          line-height: 1;
        }

        #p3Popup .btn3d span:last-child {
          font-size: 9.5px;
          font-weight: 800;
          color: #3d1468;
          text-align: center;
          line-height: 1.1;
        }

        /* Botón #f5Ajustes y Menú fiel al HTML 4° */
        #f5Ajustes {
          position: fixed;
          left: 14px;
          bottom: 14px;
          z-index: 9990;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          font-family: 'Nunito', sans-serif;
        }

        #f5AjustesBtn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5c518, #e8650a);
          color: #ffffff;
          border: 3px solid #ffe066;
          font-size: 22px;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease;
        }

        #f5AjustesBtn:hover {
          transform: scale(1.08);
        }

        #f5AjustesMenu {
          width: 220px;
          background: linear-gradient(135deg, rgba(42, 15, 96, 0.97), rgba(26, 10, 60, 0.97));
          border: 2px solid #f5c518;
          border-radius: 14px;
          padding: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
        }

        .f5-aj-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 8px 12px;
          margin-bottom: 6px;
          background: #2a0f60;
          color: #f0edff;
          border: 1px solid #6c28b4;
          border-radius: 10px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          transition: background 0.15s;
        }

        .f5-aj-btn:hover {
          background: #3d1468;
          border-color: #f5c518;
        }

        /* Botón Mascota a la izquierda */
        #mascotFab4to {
          position: fixed;
          left: 14px;
          bottom: 74px;
          z-index: 9985;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7b2fbe, #a864e8);
          border: 2.5px solid #ffe066;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(123, 47, 190, 0.4);
          transition: transform 0.15s;
        }

        #mascotFab4to:hover {
          transform: scale(1.08);
        }

        .mascot-balloon-4to {
          position: fixed;
          left: 72px;
          bottom: 70px;
          z-index: 9995;
          background: #ffffff;
          border: 2px solid #8b3edb;
          border-radius: 16px;
          padding: 10px 14px;
          width: 250px;
          box-shadow: 0 10px 24px rgba(40, 10, 90, 0.2);
          animation: fadeIn 0.25s ease;
          font-family: 'Nunito', sans-serif;
        }

        /* Sello de versión #f5VerStamp */
        #f5VerStamp {
          position: fixed;
          right: 8px;
          bottom: 3px;
          z-index: 9980;
          font-size: 10px;
          font-weight: 800;
          color: rgba(92, 33, 166, 0.6);
          background: rgba(255, 255, 255, 0.7);
          padding: 1px 8px;
          border-radius: 8px;
          pointer-events: none;
          font-family: 'Nunito', sans-serif;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          #p3Fab.f4-fab-ancho {
            right: 10px;
            top: auto;
            bottom: 16px;
            width: 54px;
            height: 54px;
            border-radius: 50%;
          }
          #p3Fab.f4-fab-ancho span:last-child {
            display: none;
          }
          #p3Popup.open {
            right: 10px;
            left: 10px;
            top: auto;
            bottom: 78px;
            grid-template-columns: repeat(4, 1fr);
          }
          #p3Popup::before {
            grid-column: span 4;
          }
        }
      `}</style>
    </>
  );
}
