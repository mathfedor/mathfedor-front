'use client';

import { useState, type ReactNode } from 'react';
import { bookAudio } from '@/services/book-audio.service';

export interface MiniRound {
  prompt: ReactNode;
  answer: number;
  hint?: string;
}

interface Props {
  emoji: string;
  title: string;
  instruction: string;
  reward: number;
  accent: string;
  placeholder?: string;
  generate: () => MiniRound;
  onReward: (coins: number) => void;
  onClose: () => void;
}

/**
 * Marco común de los mini-juegos numéricos (Corazones, Reloj, Tienda).
 * Réplica del patrón `openMiniGame*` / `checkMg*` del HTML.
 */
export default function NumberMiniGame({
  emoji,
  title,
  instruction,
  reward,
  accent,
  placeholder = 'Tu respuesta',
  generate,
  onReward,
  onClose,
}: Props) {
  const [round, setRound] = useState<MiniRound>(generate);
  const [val, setVal] = useState('');
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [score, setScore] = useState(0);

  const check = () => {
    const v = parseInt(val, 10);
    if (Number.isNaN(v)) {
      setFeedback({ msg: '¡Escribe un número!', ok: false });
      return;
    }
    if (v === round.answer) {
      setScore((s) => s + reward);
      onReward(reward);
      bookAudio.correct();
      setFeedback({ msg: `¡Correcto! 🎉 +${reward} monedas`, ok: true });
      setTimeout(() => {
        setRound(generate());
        setVal('');
        setFeedback(null);
      }, 900);
    } else {
      bookAudio.wrong();
      setFeedback({ msg: round.hint ? `¡Inténtalo otra vez! Pista: ${round.hint}` : '¡Inténtalo de nuevo!', ok: false });
    }
  };

  return (
    <div className="mg-overlay" onClick={onClose}>
      <div className="mg-card" onClick={(e) => e.stopPropagation()}>
        <button className="mg-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="mg-head">
          <div style={{ fontSize: 42 }}>{emoji}</div>
          <div className="mg-title">{title}</div>
          <div className="mg-inst">{instruction}</div>
        </div>

        <div className="mg-prompt">{round.prompt}</div>

        <input
          className="finput mg-input"
          inputMode="numeric"
          value={val}
          onChange={(e) => setVal(e.target.value.replace(/[^0-9]/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          placeholder={placeholder}
          autoComplete="off"
        />
        <div className="mg-feedback" style={{ color: feedback ? (feedback.ok ? 'var(--teal-d)' : 'var(--red)') : 'transparent' }}>
          {feedback?.msg ?? '·'}
        </div>
        <button className="btn-primary" style={{ width: '100%', background: accent }} onClick={check}>
          Comprobar
        </button>
        <div className="mg-score">Puntaje: {score}</div>
      </div>
    </div>
  );
}
