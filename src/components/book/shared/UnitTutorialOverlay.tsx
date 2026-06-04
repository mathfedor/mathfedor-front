'use client';

import type { UnitTutorial } from '@/types/book.types';

/** Tutorial introductorio de unidad (réplica de `showUnitTutorial`). */
export default function UnitTutorialOverlay({ tut, onClose }: { tut: UnitTutorial; onClose: () => void }) {
  return (
    <div className="utut-overlay" role="dialog" aria-label="Tutorial de unidad">
      <div className="utut-card">
        <div className="utut-icon">{tut.icon}</div>
        <div className="utut-title">{tut.title}</div>
        <div className="utut-text">{tut.text}</div>
        <div className="utut-steps">
          {tut.steps.map((s, i) => (
            <div className="utut-step" key={i}>
              <span className="utut-step-num">{i + 1}</span>
              <span className="utut-step-txt">{s}</span>
            </div>
          ))}
        </div>
        <button className="btn-launch" onClick={onClose}>🚀 ¡Vamos!</button>
      </div>
    </div>
  );
}
