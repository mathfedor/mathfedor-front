'use client';

import { useState } from 'react';

interface Step {
  emoji: string;
  title: string;
  text: string;
}

const STEPS: Step[] = [
  { emoji: '🚀', title: '¡Bienvenido, astronauta!', text: 'Este es tu libro interactivo de matemáticas. Aprenderás explorando planetas.' },
  { emoji: '📦', title: 'Unidades y temas', text: 'Cada unidad es un planeta. Ábrela para ver sus temas y niveles del 1 al 5.' },
  { emoji: '⚡', title: 'Gana XP y monedas', text: 'Responde bien para sumar XP, subir de rango y comprar trajes en la tienda.' },
  { emoji: '🌌', title: 'Galaxia del Saber', text: 'Viaja por el mapa 3D y completa el reto del día para ganar el doble de monedas.' },
  { emoji: '📊', title: 'Informe para tu profe', text: 'Tu progreso genera un informe con gráficas que puedes imprimir o exportar.' },
];

/** Tutorial de primer uso (overlay con pasos). */
export default function TutorialOverlay({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  return (
    <div className="tutorial-overlay" role="dialog" aria-label="Tutorial">
      <div className="tut-card">
        <div className="tut-emoji">{step.emoji}</div>
        <div className="tut-title">{step.title}</div>
        <div className="tut-text">{step.text}</div>

        <div className="tut-dots">
          {STEPS.map((_, di) => (
            <span key={di} className={`tut-dot${di === i ? ' on' : ''}`} />
          ))}
        </div>

        <div className="tut-actions">
          <button className="tut-skip" onClick={onClose}>Saltar</button>
          <div style={{ display: 'flex', gap: 8 }}>
            {i > 0 && (
              <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 14px' }} onClick={() => setI((p) => p - 1)}>
                ← Atrás
              </button>
            )}
            <button
              className="btn-primary"
              style={{ fontSize: 13, padding: '8px 16px' }}
              onClick={() => (last ? onClose() : setI((p) => p + 1))}
            >
              {last ? '¡Empezar! 🚀' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
