'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// La escena three.js solo se carga en cliente.
const CinematicScene = dynamic(() => import('./CinematicScene'), { ssr: false });

/**
 * Intro cinemática del despegue (réplica de `playCinematicIntro`):
 * estrellas fugaces + planeta acercándose en 3D, con 3 líneas de texto que
 * aparecen en secuencia y autocierre a los 6.5 s.
 */
export default function LaunchIntro({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 250);
    const t2 = setTimeout(() => setStep(2), 700);
    const t3 = setTimeout(() => setStep(3), 1100);
    const end = setTimeout(onClose, 6500);
    return () => {
      [t1, t2, t3, end].forEach(clearTimeout);
    };
  }, [onClose]);

  return (
    <div className="launch-intro-cin" onClick={onClose} role="dialog" aria-label="Intro del despegue">
      <div className="lic-canvas">
        <CinematicScene />
      </div>
      <div className="lic-text">
        <div className={`lic-l1${step >= 1 ? ' show' : ''}`}>¡BIENVENIDO, CADETE!</div>
        <div className={`lic-l2${step >= 2 ? ' show' : ''}`}>Tu misión: explorar la Galaxia del Saber</div>
        <div className={`lic-l3${step >= 3 ? ' show' : ''}`}>
          Cinco planetas. Tres niveles cada uno. Domina las matemáticas y conviértete en Almirante Estelar 🚀
        </div>
      </div>
      <button className="lic-skip" onClick={onClose}>SALTAR ⏭</button>
    </div>
  );
}
