'use client';

import { useBook } from '../context/BookContext';
import { bookAudio } from '@/services/book-audio.service';

interface BookHeaderProps {
  onOpenIntro: () => void;
}

export default function BookHeader({ onOpenIntro }: BookHeaderProps) {
  const { book, progress, goScreen, resetAll } = useBook();

  const handleLogoClick = () => {
    if (progress) {
      goScreen('home');
    }
  };

  const handleResetClick = () => {
    if (window.confirm('¿Borrar TODO el progreso del libro?\n\nSe perderá: nombre, avatar, niveles resueltos, monedas, stickers, intro vista.\n\n¿Continuar?')) {
      bookAudio.click();
      resetAll();
    }
  };

  const handleIntroClick = () => {
    bookAudio.click();
    onOpenIntro();
  };

  const displayGrade = book?.grade 
    ? (book.grade.includes('1°') ? '1° Grado' : '2° Grado') 
    : (book?.slug === 'libro-1ro' ? '1° Grado' : '2° Grado');

  const coins = progress?.gamification?.coins ?? 0;
  const streak = progress?.gamification?.streak ?? 0;

  return (
    <header className="hdr">
      <div className="hdr-left" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div 
          className="logo-area" 
          onClick={handleLogoClick} 
          style={{ cursor: progress ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, boxShadow: '0 0 0 2.5px rgba(245,197,24,.5), 0 4px 16px rgba(123,47,190,.5)' }}>
            <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
              <defs>
                <radialGradient id="sp44" cx="38%" cy="32%">
                  <stop offset="0%" stopColor="#6A20A8" />
                  <stop offset="55%" stopColor="#1A0848" />
                  <stop offset="100%" stopColor="#080E30" />
                </radialGradient>
                <radialGradient id="hb44" cx="40%" cy="30%">
                  <stop offset="0%" stopColor="#F8F8F8" />
                  <stop offset="70%" stopColor="#D0D0D8" />
                  <stop offset="100%" stopColor="#A8A8B8" />
                </radialGradient>
                <radialGradient id="fp44" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="#FF9030" />
                  <stop offset="60%" stopColor="#E86010" />
                  <stop offset="100%" stopColor="#903000" />
                </radialGradient>
                <radialGradient id="vs44" cx="30%" cy="25%">
                  <stop offset="0%" stopColor="#1A3060" />
                  <stop offset="100%" stopColor="#050A18" />
                </radialGradient>
              </defs>
              {/* Space background */}
              <circle cx="22" cy="22" r="22" fill="url(#sp44)" />
              {/* Stars */}
              <circle cx="7" cy="7" r="0.9" fill="white" opacity=".9" />
              <circle cx="37" cy="9" r="0.7" fill="white" opacity=".8" />
              <circle cx="39" cy="30" r="0.5" fill="white" opacity=".7" />
              <circle cx="5" cy="30" r="0.6" fill="white" opacity=".7" />
              <circle cx="18" cy="40" r="0.5" fill="white" opacity=".6" />
              {/* Teal nebula glow at bottom */}
              <ellipse cx="22" cy="40" rx="14" ry="6" fill="#00B4D8" opacity=".2" />
              {/* Helmet body (white/gray rounded) */}
              <ellipse cx="22" cy="23" rx="13" ry="14" fill="url(#hb44)" />
              {/* Orange faceplate border (thick ring) */}
              <ellipse cx="22" cy="23" rx="13" ry="14" fill="none" stroke="#E86010" strokeWidth="2.5" opacity=".9" />
              {/* Dark visor (oval inside) */}
              <ellipse cx="22" cy="22" rx="7.5" ry="6.5" fill="url(#vs44)" />
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
            <div style={{ fontSize: 9, fontWeight: 900, color: '#7B2FBE', letterSpacing: '.06em', textTransform: 'uppercase' }}>Matemáticas de</div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 17, fontWeight: 900, color: '#E8650A', textShadow: '0 1px 0 rgba(245,197,24,.5)' }}>feDOR</div>
          </div>
        </div>
        <span className="grade-pill">{displayGrade}</span>
      </div>
      <div className="hdr-btns">
        {progress && (
          <div className="coin-hdr show" title="Monedas acumuladas">
            <span>🪙</span>
            <span>{coins}</span>
          </div>
        )}
        {progress && streak > 0 && (
          <div className="streak-hdr show" title="Racha de días">
            <span>🔥</span>
            <span>{streak}</span>
          </div>
        )}
        <button 
          id="f1IntroHdrBtn" 
          className="hdr-btn f1-hdr-intro" 
          onClick={handleIntroClick}
          title="Ver introducción animada"
        >
          <span className="f1-hdr-rocket-ico">🚀</span> Ver despegue
        </button>
        <button 
          id="f1ResetBtn" 
          className="hdr-btn f1-hdr-reset" 
          onClick={handleResetClick}
          title="Borrar todo el progreso y empezar de nuevo"
        >
          <span className="f1-hdr-reset-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11 }}>
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
          </span>
          Reiniciar
        </button>
      </div>
    </header>
  );
}
