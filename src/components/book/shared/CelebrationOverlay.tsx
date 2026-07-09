'use client';

import Starfield from './Starfield';
import ConfettiLayer from './ConfettiLayer';

interface Props {
  pct: number;
  pts: number;
  topicTitle: string;
  levelLabel: string;
  okCount: number;
  total: number;
  unlockText?: string;
  onNext: () => void;
  onAllTopics: () => void;
}

/** Overlay de celebración de fin de nivel (réplica de `showCelebration`). */
export default function CelebrationOverlay({
  pct,
  pts,
  topicTitle,
  levelLabel,
  okCount,
  total,
  unlockText,
  onNext,
  onAllTopics,
}: Props) {
  const { medal, title, subtitle } = resolve(pct, topicTitle, levelLabel, okCount, total);
  const starCount = pct >= 90 ? 3 : pct >= 70 ? 2 : 1;

  return (
    <div className="cel-overlay">
      <ConfettiLayer />
      <div className="cel-card">
        <div className="cel-hero">
          <Starfield count={18} />
          <div className="hero-planet" style={{ opacity: 0.12 }} />
          <span className="cel-medal">{medal}</span>
          <div className="cel-title">{title}</div>
          <div className="cel-subtitle">{subtitle}</div>
          <span className="cel-stars">
            {[0, 1, 2].map((i) => (
              <span key={i} className="cel-star" style={{ opacity: i < starCount ? 1 : 0.15 }}>
                ⭐
              </span>
            ))}
          </span>
          <div className="cel-score-wrap">
            <div className="cel-score-num">{pts}</div>
            <div className="cel-score-lbl">puntos espaciales</div>
          </div>
          {unlockText && <div className="cel-unlock" style={{ display: 'block' }}>{unlockText}</div>}
        </div>
        <div className="cel-body">
          <button className="cel-btn" onClick={onNext}>🚀 ¡Siguiente nivel!</button>
          <button className="cel-btn-sec" onClick={onAllTopics}>📚 Ver todos los temas</button>
        </div>
      </div>
    </div>
  );
}

function getShortLevel(label: string): string {
  if (label.includes('Nivel 1')) return 'N1';
  if (label.includes('Nivel 2')) return 'N2';
  if (label.includes('Nivel 3')) return 'N3';
  if (label.includes('Nivel 4')) return 'N4';
  if (label.toLowerCase().includes('evaluación') || label.toLowerCase().includes('evaluacion')) return 'Evaluación';
  return label;
}

function resolve(pct: number, topicTitle: string, levelLabel: string, okCount: number, total: number) {
  const shortLevel = getShortLevel(levelLabel);
  if (pct >= 95) return { medal: '🥇', title: '¡PERFECTO!', subtitle: `¡Respondiste TODO en ${topicTitle} — ${shortLevel}!` };
  if (pct >= 85) return { medal: '🏅', title: '¡EXCELENTE!', subtitle: `${okCount} de ${total} correctas en ${topicTitle}.` };
  if (pct >= 70) return { medal: '⭐', title: '¡MUY BIEN!', subtitle: `Superaste ${shortLevel} de ${topicTitle}. ¡Sigue así!` };
  return { medal: '💪', title: '¡APROBADO!', subtitle: `Completaste ${topicTitle} — ${shortLevel}.` };
}
