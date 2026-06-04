'use client';

import type { MiniRound } from './NumberMiniGame';

const PRODUCTS = ['lápiz', 'borrador', 'regla', 'colores', 'sacapuntas', 'cuaderno', 'marcador', 'tijeras'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Reparte los Corazones — división exacta (réplica de `renderMgRound`). */
export function genHearts(): MiniRound {
  const t = 6 + Math.floor(Math.random() * 5) * 2; // 6,8,10,12,14
  const k = pick([2, 3, 4]);
  const total = t * k;
  return {
    answer: t,
    hint: `${total} ÷ ${k}`,
    prompt: (
      <div>
        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>
          Math tiene <b>{total}</b> corazones para repartir entre <b>{k}</b> niños en partes iguales. ¿Cuántos le toca a cada uno?
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', background: 'linear-gradient(135deg,#FFEAEA,#FAECE7)', padding: '12px', borderRadius: 12, fontSize: 22 }}>
          {Array.from({ length: total }, (_, i) => (
            <span key={i}>❤️</span>
          ))}
        </div>
      </div>
    ),
  };
}

/** Reto del Reloj — conversiones de tiempo (réplica de `renderMgRelojRound`). */
export function genClock(): MiniRound {
  const kind = Math.floor(Math.random() * 3);
  if (kind === 0) {
    const h = 1 + Math.floor(Math.random() * 6);
    return { answer: 60 * h, prompt: <ClockQ text={`¿Cuántos minutos hay en ${h} horas?`} /> };
  }
  if (kind === 1) {
    const m = 1 + Math.floor(Math.random() * 5);
    return { answer: 60 * m, prompt: <ClockQ text={`¿Cuántos segundos hay en ${m} minutos?`} /> };
  }
  const h = 1 + Math.floor(Math.random() * 2);
  return { answer: 3600 * h, prompt: <ClockQ text={`¿Cuántos segundos hay en ${h} hora${h > 1 ? 's' : ''}?`} /> };
}

function ClockQ({ text }: { text: string }) {
  return (
    <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 900, color: 'var(--text)', background: 'var(--bg)', padding: '1rem', borderRadius: 14 }}>
      {text}
    </div>
  );
}

/** Tienda de Math — dar el cambio (réplica de `renderMgTiendaRound`). */
export function genStore(): MiniRound {
  const prod = pick(PRODUCTS);
  const precio = 100 * (2 + Math.floor(Math.random() * 8)); // 200..900
  const billetes = [1000, 2000, 5000].filter((b) => b > precio);
  const billete = pick(billetes);
  const cambio = billete - precio;
  return {
    answer: cambio,
    hint: `${billete} − ${precio}`,
    prompt: (
      <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text)', background: '#FEF0E6', padding: '1rem', borderRadius: 14 }}>
        Un cliente compra un <b>{prod}</b> que cuesta <b>${precio}</b> y paga con un billete de <b>${billete}</b>. ¿Cuánto cambio recibe?
      </div>
    ),
  };
}
