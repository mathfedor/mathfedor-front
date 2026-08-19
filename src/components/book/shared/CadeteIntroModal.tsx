'use client';

import { useEffect } from 'react';
import { fedorTTS } from '../../../services/tts.service';
import Starfield from './Starfield';

interface CadeteIntroModalProps {
  studentName?: string;
  onClose: () => void;
  onWatchTakeoff: () => void;
}

export default function CadeteIntroModal({ studentName, onClose, onWatchTakeoff }: CadeteIntroModalProps) {
  const displayName = (studentName || '').trim() || 'pequeño explorador';

  useEffect(() => {
    // Play welcome harmonic chord using Web Audio API (523Hz, 659Hz, 784Hz, 1046Hz)
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const freqs = [523, 659, 784, 1046];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = f;
          osc.type = 'sine';
          osc.connect(gain);
          gain.connect(ctx.destination);
          gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.15 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 1);
          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + i * 0.15 + 1);
        });
      }
    } catch {
      /* ignore audio context restrictions */
    }

    try {
      localStorage.setItem('fedor_cadete_intro_seen', '1');
    } catch {}
  }, []);

  const handleSpeak = () => {
    fedorTTS.speak(
      `¡Bienvenido cadete estelar ${displayName}! Estás a punto de empezar tu aventura matemática por el espacio. Visitarás 8 planetas y desbloquearás 6 rangos estelares.`
    );
  };

  const handleTakeoff = () => {
    onClose();
    setTimeout(() => {
      onWatchTakeoff();
    }, 300);
  };

  return (
    <div
      id="cadeteIntroBG"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99996,
        background: 'radial-gradient(ellipse at center, #2a1850 0%, #050015 75%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        fontFamily: "'Nunito', sans-serif",
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes cadBadgeBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes cadFadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.9); }
          to { opacity: 1; transform: none; }
        }
      `}</style>

      <Starfield count={40} />

      <div
        className="cad-box"
        style={{
          position: 'relative',
          textAlign: 'center',
          color: '#fff',
          zIndex: 2,
          maxWidth: '560px',
          width: '100%',
          padding: '2rem 1.5rem',
          animation: 'cadFadeIn 0.8s cubic-bezier(.34,1.56,.64,1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bobbing Badge */}
        <div
          className="cad-badge"
          style={{
            fontSize: '120px',
            lineHeight: 1,
            textShadow: '0 0 60px rgba(245,197,24,.8)',
            animation: 'cadBadgeBob 2.2s ease-in-out infinite',
            margin: '0 auto',
            userSelect: 'none',
          }}
        >
          🌱
        </div>

        {/* Rank Title */}
        <div
          className="cad-rank"
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '34px',
            fontWeight: 900,
            color: '#FFD66B',
            textShadow: '0 4px 18px rgba(0,0,0,.8), 0 0 30px rgba(245,197,24,.6)',
            margin: '0.8rem 0 0.2rem',
            letterSpacing: '.05em',
          }}
        >
          CADETE ESTELAR
        </div>

        {/* Welcome */}
        <div
          className="cad-welcome"
          style={{
            fontSize: '20px',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '1rem',
            lineHeight: 1.4,
          }}
        >
          ¡Bienvenid@ a la academia espacial!
          <span
            className="cad-name"
            style={{
              color: '#FFD66B',
              fontSize: '28px',
              display: 'block',
              margin: '.4rem 0',
              textShadow: '0 0 20px rgba(245,197,24,.5)',
            }}
          >
            {displayName}
          </span>
        </div>

        {/* Message */}
        <div
          className="cad-msg"
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#E0DBFF',
            lineHeight: 1.6,
            margin: '.5rem 0 1.2rem',
            background: 'rgba(255,255,255,.08)',
            border: '1.5px solid rgba(255,215,107,.4)',
            borderRadius: '14px',
            padding: '.8rem 1.2rem',
          }}
        >
          🚀 Estás a punto de empezar tu viaje matemático por el espacio.
          <br />
          Visitarás <b>8 planetas</b> y desbloquearás <b>6 rangos estelares</b>:
        </div>

        {/* Checklist of Ranks */}
        <ul
          className="cad-checklist"
          style={{
            textAlign: 'left',
            margin: '.6rem 0 1.2rem',
            fontSize: '13px',
            lineHeight: 1.8,
            color: '#E0DBFF',
            background: 'rgba(0,0,0,.35)',
            padding: '.8rem 1.2rem',
            borderRadius: '12px',
            borderLeft: '4px solid #FFD66B',
            listStyle: 'none',
          }}
        >
          <li style={{ paddingLeft: '1.4rem', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0 }}>⭐</span>
            <b>🌱 Cadete Estelar</b> → 🐣 Aprendiz Lunar
          </li>
          <li style={{ paddingLeft: '1.4rem', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0 }}>⭐</span>
            <b>🚀 Explorador Cósmico</b> → ⭐ Veterano
          </li>
          <li style={{ paddingLeft: '1.4rem', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0 }}>⭐</span>
            <b>🏆 Maestro</b> → ☄️ Leyenda
          </li>
        </ul>

        {/* Action Buttons */}
        <div
          className="cad-btns"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '.65rem',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleSpeak}
            style={{
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 900,
              border: '2px solid rgba(255,215,107,.6)',
              borderRadius: '14px',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              background: 'rgba(255,215,107,.2)',
              color: '#FFE066',
              width: '100%',
              maxWidth: '320px',
              transition: 'transform 0.15s',
            }}
          >
            🔊 Escuchar mensaje
          </button>

          <button
            type="button"
            onClick={handleTakeoff}
            style={{
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: 900,
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              background: 'linear-gradient(135deg,#F5C518,#FF8C2A)',
              color: '#1A0A3C',
              boxShadow: '0 8px 24px rgba(245,197,24,.5)',
              width: '100%',
              maxWidth: '320px',
              transition: 'transform 0.15s',
            }}
          >
            🎬 ¡Ver el despegue! 🚀
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: 800,
              border: '1.5px solid rgba(255,255,255,.3)',
              borderRadius: '14px',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              background: 'rgba(255,255,255,.1)',
              color: '#fff',
              width: '100%',
              maxWidth: '320px',
              transition: 'transform 0.15s',
            }}
          >
            Continuar al libro
          </button>
        </div>
      </div>
    </div>
  );
}
