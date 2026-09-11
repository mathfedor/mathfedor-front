'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fedorSpeak, stopFedorSpeak } from './Grade3Speech';

export interface GalaxyPlanet3ro {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  color: string;
  glow: string;
  ring: boolean;
  unit: number;
  desc: string;
  vy: number;
  r: number;
  cx: number;
}

export const GALAXY_PLANETS_3RO: GalaxyPlanet3ro[] = [
  { id: 'tierra', name: '🌍 La Tierra', icon: '🌍', subtitle: 'Base — Adición de 3 cifras', color: '#1A6CB4', glow: '#4DA6FF', ring: false, unit: 0, desc: '¡Aquí empieza todo! Domina la adición y el conteo para despegar.', vy: 4580, r: 42, cx: 0.50 },
  { id: 'luna', name: '🌙 La Luna', icon: '🌙', subtitle: 'Primera parada • ¡Casi en el espacio!', color: '#888888', glow: '#DDDDDD', ring: false, unit: -1, desc: 'La Luna te da la bienvenida. ¡Sigue avanzando hacia las estrellas!', vy: 4200, r: 26, cx: 0.76 },
  { id: 'marte', name: '🔴 Marte', icon: '🔴', subtitle: 'Marte — Sustracción de 3 cifras', color: '#C94B22', glow: '#FF6B3B', ring: false, unit: 1, desc: 'El planeta rojo. La Tienda de Math abre aquí. ¡Aprende a restar!', vy: 3800, r: 34, cx: 0.24 },
  { id: 'saturno', name: '🪐 Saturno', icon: '🪐', subtitle: 'Saturno — Multiplicación y Tablas', color: '#B8860B', glow: '#F5C518', ring: true, unit: 2, desc: 'Los anillos de Saturno son tu tabla mágica. ¡Multiplica para avanzar!', vy: 3400, r: 38, cx: 0.74 },
  { id: 'neptuno', name: '🔵 Neptuno', icon: '🔵', subtitle: 'Neptuno — División con Residuo', color: '#1A4CB4', glow: '#4D8AFF', ring: false, unit: 3, desc: 'Aguas profundas. Divide las chocolatinas entre los astronautas.', vy: 3000, r: 32, cx: 0.25 },
  { id: 'sol', name: '☀️ El Sol', icon: '☀️', subtitle: 'El Sol — Problemas SABER', color: '#E8650A', glow: '#FFD700', ring: false, unit: 4, desc: '¡Nivel avanzado! Resuelve los grandes problemas del cosmos SABER.', vy: 2650, r: 50, cx: 0.50 },
  { id: 'eridanus', name: '🔢 Eridanus', icon: '🔢', subtitle: 'Eridanus — Factores y Múltiplos', color: '#6A1B9A', glow: '#CE93D8', ring: false, unit: 5, desc: 'Factores, divisores y el ritmo de los múltiplos.', vy: 2300, r: 32, cx: 0.72 },
  { id: 'orion', name: '🌟 Orión', icon: '🌟', subtitle: 'Orión — Fracciones', color: '#00695C', glow: '#80CBC4', ring: false, unit: 6, desc: 'Las fracciones son partes del universo. ¡Simplifica y opera!', vy: 1980, r: 30, cx: 0.26 },
  { id: 'cygnus', name: '📝 Cygnus', icon: '📝', subtitle: 'Cygnus — Aplicaciones con Fracciones', color: '#1565C0', glow: '#90CAF9', ring: false, unit: 7, desc: 'Problemas reales con fracciones, MCD y MCM.', vy: 1660, r: 28, cx: 0.70 },
  { id: 'lyra', name: '⚡ Lyra', icon: '⚡', subtitle: 'Lyra — Potenciación y Raíces', color: '#F57F17', glow: '#FFE082', ring: false, unit: 8, desc: 'Las potencias amplifican tus poderes matemáticos.', vy: 1350, r: 30, cx: 0.28 },
  { id: 'aquila', name: '📏 Águila', icon: '📏', subtitle: 'Águila — Sistema Métrico', color: '#2E7D32', glow: '#A5D6A7', ring: false, unit: 9, desc: 'Convierte metros, kilómetros y centímetros con precisión.', vy: 1050, r: 28, cx: 0.70 },
  { id: 'centauri', name: '📐 Centauro', icon: '📐', subtitle: 'Centauro — Geometría', color: '#880E4F', glow: '#F48FB1', ring: false, unit: 10, desc: 'Perímetros, áreas y volúmenes del cosmos geométrico.', vy: 750, r: 32, cx: 0.28 },
  { id: 'sirius', name: '📊 Sirius', icon: '📊', subtitle: 'Sirius — Estadística y Probabilidad', color: '#0D47A1', glow: '#82B1FF', ring: false, unit: 11, desc: 'Lee los datos del universo y calcula probabilidades.', vy: 460, r: 30, cx: 0.68 },
  { id: 'andromeda', name: '⚖️ Andrómeda', icon: '⚖️', subtitle: 'Andrómeda — Magnitudes Proporcionales', color: '#4A148C', glow: '#E040FB', ring: true, unit: 12, desc: '¡Destino final! Domina la proporcionalidad y conquista la galaxia.', vy: 150, r: 42, cx: 0.50 },
];

const MINI_GAMES_3RO: Record<number, string> = {
  0: '🌍 Desafío Tierra: ¡Suma 3 números mentalmente sin equivocarte!',
  1: '🌙 Desafío Luna: ¿Cuántos km hay de la Tierra a la Luna? (384,400 km)',
  2: '🔴 Desafío Marte: ¡Resta 100 - 37 en menos de 10 segundos!',
  3: '🪐 Desafío Saturno: ¿Cuántos anillos tiene Saturno? (7 grupos)',
  4: '🔵 Desafío Neptuno: 81 ÷ 9 = ? ¡El océano azul te da la respuesta!',
  5: '☀️ Desafío Sol: ¿Cuántos planetas orbitan el Sol? (8 planetas)',
};

interface UniversoFedorModal3roProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUnit?: (unitIndex: number) => void;
  unitsProgress?: Record<number, number>;
  totalXP?: number;
  userAvatar?: string;
}

export default function UniversoFedorModal3ro({
  isOpen,
  onClose,
  onSelectUnit,
  unitsProgress = {},
  totalXP = 0,
  userAvatar = '🧑‍🚀',
}: UniversoFedorModal3roProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPlanetIdx, setSelectedPlanetIdx] = useState<number | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);

  // Web Audio Sounds
  const playSound = (type: 'click' | 'whoosh' | 'open') => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);
        g.gain.setValueAtTime(0.25, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'whoosh') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.18);
        g.gain.setValueAtTime(0.2, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.15);
        g.gain.setValueAtTime(0.3, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {}
  };

  const isPlanetUnlocked = (idx: number) => {
    const p = GALAXY_PLANETS_3RO[idx];
    if (!p) return false;
    if (p.unit < 0) return true;
    if (idx === 0) return true;
    const prev = GALAXY_PLANETS_3RO[idx - 1];
    if (!prev) return true;
    if (prev.unit < 0) return isPlanetUnlocked(idx - 1);
    const prevPct = unitsProgress[prev.unit] || 0;
    return prevPct >= 50;
  };

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const virtualH = 4900;
    let scrollY = Math.max(0, GALAXY_PLANETS_3RO[0].vy - H + 120);
    let scrollVY = 0;
    let gTime = 0;
    let flamePhase = 0;

    // Ship position & target
    let shipX = GALAXY_PLANETS_3RO[0].cx * W;
    let shipY = GALAXY_PLANETS_3RO[0].vy - scrollY + 30;
    let shipTargetX = shipX;
    let shipTargetY = shipY;

    // Shooting stars
    const shootingStars: Array<{ x: number; y: number; vx: number; vy: number; len: number; life: number }> = [];

    // Stars
    interface Star {
      x: number;
      y: number;
      r: number;
      a: number;
      twinkle: number;
      speed: number;
      color: string;
    }
    const stars: Star[] = [];
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.5 + 0.4,
        a: Math.random() * 0.7 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.05 + 0.015,
        color: i % 5 === 0 ? '#FFE08A' : i % 7 === 0 ? '#8AC8FF' : '#FFFFFF',
      });
    }

    // Touch & Mouse handlers
    let isDragging = false;
    let lastClientY = 0;
    let startClientY = 0;
    let hasMovedSignificantly = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollVY += e.deltaY * 0.45;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startClientY = e.clientY;
      lastClientY = e.clientY;
      hasMovedSignificantly = false;
      scrollVY = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dy = lastClientY - e.clientY;
      if (Math.abs(startClientY - e.clientY) > 5) {
        hasMovedSignificantly = true;
      }
      scrollY += dy;
      scrollVY = dy * 0.7;
      lastClientY = e.clientY;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging && !hasMovedSignificantly) {
        checkClickPlanet(e.clientX, e.clientY);
      }
      isDragging = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      isDragging = true;
      startClientY = e.touches[0].clientY;
      lastClientY = startClientY;
      hasMovedSignificantly = false;
      scrollVY = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const cy = e.touches[0].clientY;
      const dy = lastClientY - cy;
      if (Math.abs(startClientY - cy) > 6) {
        hasMovedSignificantly = true;
      }
      scrollY += dy;
      scrollVY = dy * 0.75;
      lastClientY = cy;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!hasMovedSignificantly && e.changedTouches.length > 0) {
        const t = e.changedTouches[0];
        checkClickPlanet(t.clientX, t.clientY);
      }
      isDragging = false;
    };

    const checkClickPlanet = (cx: number, cy: number) => {
      let hit = false;
      GALAXY_PLANETS_3RO.forEach((p, i) => {
        const pscale = 0.55 + 0.45 * (p.vy / virtualH);
        const px = p.cx * W;
        const py = p.vy - scrollY;
        const r = (p.r + 20) * pscale;
        const dx = cx - px;
        const dy = cy - py;

        if (dx * dx + dy * dy <= r * r) {
          hit = true;
          setSelectedPlanetIdx(i);
          shipTargetX = px;
          shipTargetY = py + r + 24;
          playSound('open');
          fedorSpeak(`${p.name}. ${p.desc}`);
        }
      });

      if (!hit && !isDragging) {
        setSelectedPlanetIdx(null);
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      gTime++;
      flamePhase += 0.2;

      // Scroll physics
      scrollY += scrollVY;
      scrollVY *= 0.88;
      if (Math.abs(scrollVY) < 0.15) scrollVY = 0;

      const minSY = 0;
      const maxSY = virtualH - H + 90;
      if (scrollY < minSY) {
        scrollY = minSY;
        scrollVY *= -0.25;
      }
      if (scrollY > maxSY) {
        scrollY = maxSY;
        scrollVY *= -0.25;
      }

      // Smooth ship animation towards target
      shipX += (shipTargetX - shipX) * 0.08;
      shipY += (shipTargetY - shipY) * 0.08;

      ctx.clearRect(0, 0, W, H);

      // Deep space radial background
      const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.85);
      bgGrad.addColorStop(0, '#0D0830');
      bgGrad.addColorStop(0.45, '#05091C');
      bgGrad.addColorStop(1, '#010408');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Nebula clouds
      const nebulae = [
        { cx: 0.2, cy: 0.3, r: 0.4, c: 'rgba(123, 47, 190, 0.12)' },
        { cx: 0.8, cy: 0.65, r: 0.35, c: 'rgba(22, 135, 106, 0.09)' },
        { cx: 0.45, cy: 0.5, r: 0.45, c: 'rgba(26, 108, 180, 0.08)' },
        { cx: 0.75, cy: 0.2, r: 0.3, c: 'rgba(232, 101, 10, 0.07)' },
      ];
      nebulae.forEach((n) => {
        const ng = ctx.createRadialGradient(n.cx * W, n.cy * H, 0, n.cx * W, n.cy * H, n.r * W);
        ng.addColorStop(0, n.c);
        ng.addColorStop(1, 'transparent');
        ctx.fillStyle = ng;
        ctx.fillRect(0, 0, W, H);
      });

      // Twinkling stars
      stars.forEach((st) => {
        st.twinkle += st.speed;
        const alpha = st.a * (0.65 + 0.35 * Math.sin(st.twinkle));
        const py = ((st.y * H - (scrollY * st.speed * 4) % H) + H) % H;

        ctx.beginPath();
        ctx.arc(st.x * W, py, st.r, 0, Math.PI * 2);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = st.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Random shooting stars
      if (Math.random() < 0.03 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * W,
          y: Math.random() * (H * 0.6),
          vx: -(Math.random() * 8 + 6),
          vy: Math.random() * 4 + 3,
          len: Math.random() * 60 + 40,
          life: 1,
        });
      }
      for (let sIdx = shootingStars.length - 1; sIdx >= 0; sIdx--) {
        const ss = shootingStars[sIdx];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= 0.035;

        if (ss.life <= 0) {
          shootingStars.splice(sIdx, 1);
          continue;
        }

        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 3, ss.y - ss.vy * 3);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.life})`);
        grad.addColorStop(0.4, `rgba(245, 197, 24, ${ss.life * 0.7})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 3, ss.y - ss.vy * 3);
        ctx.stroke();
      }

      // Cosmic Journey Path
      ctx.save();
      ctx.setLineDash([7, 6]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(245, 197, 24, 0.22)';
      ctx.beginPath();
      GALAXY_PLANETS_3RO.forEach((p, i) => {
        const px = p.cx * W;
        const py = p.vy - scrollY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Golden trail on unlocked sections
      ctx.setLineDash([]);
      for (let i = 0; i < GALAXY_PLANETS_3RO.length - 1; i++) {
        const pa = GALAXY_PLANETS_3RO[i];
        const pb = GALAXY_PLANETS_3RO[i + 1];
        const pct = pa.unit >= 0 ? unitsProgress[pa.unit] || 0 : 100;
        if (pct >= 50) {
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(245, 197, 24, 0.65)';
          ctx.beginPath();
          ctx.moveTo(pa.cx * W, pa.vy - scrollY);
          ctx.lineTo(pb.cx * W, pb.vy - scrollY);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Draw Planets
      GALAXY_PLANETS_3RO.forEach((p, i) => {
        const px = p.cx * W;
        const pscale = 0.55 + 0.45 * (p.vy / virtualH);
        const r = p.r * pscale;
        const py = p.vy - scrollY;

        // Skip off-screen
        if (py < -r * 3 || py > H + r * 3) return;

        const pct = p.unit >= 0 ? unitsProgress[p.unit] || 0 : 100;
        const unlocked = isPlanetUnlocked(i);
        const hasProgress = p.unit < 0 || pct > 0;
        const selected = i === selectedPlanetIdx;

        // Pulsing glow halo
        if (hasProgress) {
          const pulseR = r + 8 + 4 * Math.sin(gTime * 0.05 + i);
          const pg = ctx.createRadialGradient(px, py, r, px, py, pulseR + 14);
          pg.addColorStop(0, p.glow + '44');
          pg.addColorStop(1, 'transparent');
          ctx.fillStyle = pg;
          ctx.beginPath();
          ctx.arc(px, py, pulseR + 14, 0, Math.PI * 2);
          ctx.fill();
        }

        // Selection ring
        if (selected) {
          ctx.save();
          ctx.strokeStyle = 'rgba(245, 197, 24, 0.9)';
          ctx.lineWidth = 3.5;
          ctx.setLineDash([8, 4]);
          ctx.beginPath();
          ctx.arc(px, py, r + 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Planet sphere body
        const grad = ctx.createRadialGradient(px - r * 0.3, py - r * 0.35, r * 0.05, px, py, r);
        grad.addColorStop(0, p.glow);
        grad.addColorStop(0.65, p.color);
        grad.addColorStop(1, p.color + 'aa');
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Saturn Rings
        if (p.ring) {
          ctx.save();
          ctx.translate(px, py);
          ctx.scale(1, 0.32);
          ctx.rotate(0.25);
          ctx.strokeStyle = 'rgba(245, 197, 24, 0.55)';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(0, 0, r + 12, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Planet Emoji
        ctx.font = `${Math.round(r * 0.95)}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = unlocked ? (hasProgress ? 1 : 0.8) : 0.35;
        ctx.fillText(p.icon, px, py);
        ctx.globalAlpha = 1;

        // Lock Badge
        if (!unlocked && p.unit >= 0) {
          ctx.save();
          const lx = px + r * 0.55;
          const ly = py - r * 0.55;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.beginPath();
          ctx.arc(lx, ly, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = '11px sans-serif';
          ctx.fillText('🔒', lx, ly);
          ctx.restore();
        }

        // Progress badge below planet
        if (pct > 0 || p.unit < 0) {
          ctx.save();
          const badgeY = py + r + 14;
          const badgeTxt = (p.unit < 0 ? 100 : pct) + '%';
          ctx.font = '900 10px Nunito, sans-serif';
          const tw = ctx.measureText(badgeTxt).width;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
          ctx.beginPath();
          ctx.roundRect(px - tw / 2 - 5, badgeY - 7, tw + 10, 15, 6);
          ctx.fill();

          ctx.fillStyle = '#F5C518';
          ctx.fillText(badgeTxt, px, badgeY);
          ctx.restore();
        }

        // Planet Name Label
        ctx.save();
        ctx.font = '900 11.5px Nunito, sans-serif';
        ctx.fillStyle = unlocked ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(p.name, px, py - r - 12);
        ctx.restore();
      });

      // Spaceship / Flying Astronaut
      ctx.save();
      const bob = Math.sin(gTime * 0.08) * 3;
      const curShipY = shipY + bob;

      // Thruster Flame
      const flameH = 14 + Math.sin(flamePhase) * 6;
      const flameGrad = ctx.createLinearGradient(shipX, curShipY + 12, shipX, curShipY + 12 + flameH);
      flameGrad.addColorStop(0, '#FFFFFF');
      flameGrad.addColorStop(0.3, '#FFD700');
      flameGrad.addColorStop(0.7, '#FF4500');
      flameGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(shipX - 6, curShipY + 12);
      ctx.lineTo(shipX + 6, curShipY + 12);
      ctx.lineTo(shipX, curShipY + 12 + flameH);
      ctx.closePath();
      ctx.fill();

      // Glowing aura around avatar
      const shipGlow = ctx.createRadialGradient(shipX, curShipY, 6, shipX, curShipY, 26);
      shipGlow.addColorStop(0, 'rgba(245, 197, 24, 0.7)');
      shipGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = shipGlow;
      ctx.beginPath();
      ctx.arc(shipX, curShipY, 26, 0, Math.PI * 2);
      ctx.fill();

      // Avatar circle
      ctx.fillStyle = '#7B2FBE';
      ctx.beginPath();
      ctx.arc(shipX, curShipY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F5C518';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(userAvatar, shipX, curShipY);
      ctx.restore();

      // Scroll hint at bottom
      if (scrollY < virtualH - H - 60) {
        ctx.save();
        ctx.globalAlpha = 0.45 + 0.3 * Math.sin(gTime * 0.06);
        ctx.fillStyle = '#FFE066';
        ctx.font = 'bold 12px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('↑  Desliza hacia arriba para viajar  ↑', W * 0.5, H - 28);
        ctx.restore();
      }

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, unitsProgress, selectedPlanetIdx, userAvatar]);

  if (!isOpen) return null;

  const selectedPlanet = selectedPlanetIdx !== null ? GALAXY_PLANETS_3RO[selectedPlanetIdx] : null;
  const selectedPct = selectedPlanet ? (selectedPlanet.unit < 0 ? 100 : unitsProgress[selectedPlanet.unit] || 0) : 0;
  const miniGameTxt = selectedPlanetIdx !== null ? MINI_GAMES_3RO[selectedPlanetIdx] : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        background: '#010408',
        overflow: 'hidden',
        fontFamily: "'Nunito', sans-serif",
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Canvas Interactivo */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />

      {/* ══ TUTORIAL OVERLAY INICIAL ══ */}
      {showTutorial && (
        <div
          onClick={() => {
            playSound('click');
            setShowTutorial(false);
          }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 40,
            background: 'rgba(2, 4, 28, 0.92)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '54px', marginBottom: '0.6rem', animation: 'float 2.5s ease-in-out infinite' }}>
            🌌
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 900,
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: '0.3rem',
            }}
          >
            ¡Universo Fedor!
          </div>
          <div
            style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.65)',
              textAlign: 'center',
              marginBottom: '1.5rem',
              lineHeight: 1.5,
              maxWidth: '320px',
            }}
          >
            Tu nave espacial te espera. Explora los planetas y practica tus matemáticas 🚀
          </div>

          {/* Tips */}
          <div style={{ display: 'grid', gap: '10px', width: '100%', maxWidth: '310px', marginBottom: '1.5rem' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '14px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '26px' }}>👆</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#F5C518' }}>Desliza hacia arriba</div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>para volar por el universo</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '14px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '26px' }}>🪐</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#F5C518' }}>Toca un planeta</div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>para ir a sus lecciones</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '14px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '26px' }}>🏠</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#F5C518' }}>Botón Inicio (arriba)</div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>para volver cuando quieras</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playSound('whoosh');
              setShowTutorial(false);
            }}
            style={{
              background: 'linear-gradient(135deg, #F5C518, #FF8C2A)',
              color: '#2A0F60',
              border: 'none',
              borderRadius: '26px',
              padding: '13px 44px',
              fontSize: '16px',
              fontWeight: 900,
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              boxShadow: '0 6px 22px rgba(245, 197, 24, 0.45)',
              letterSpacing: '0.03em',
            }}
          >
            🚀 ¡A explorar!
          </button>
        </div>
      )}

      {/* ══ TOP HUD BAR ══ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          background: 'linear-gradient(180deg, rgba(0, 0, 20, 0.92) 60%, transparent)',
          padding: '12px 16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 900,
              color: 'rgba(245, 197, 24, 0.85)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            🌌 Universo Fedor
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: '1px',
            }}
          >
            {selectedPlanet ? `Destino: ${selectedPlanet.name} 🚀` : '🚀 Nave lista para explorar'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '4px 12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#F5C518', lineHeight: 1.1 }}>
              {totalXP}
            </div>
            <div style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 700 }}>
              XP
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              stopFedorSpeak();
              onClose();
            }}
            style={{
              background: 'linear-gradient(135deg, #F5C518, #FF8C2A)',
              border: 'none',
              color: '#2A0F60',
              borderRadius: '22px',
              padding: '9px 18px',
              fontSize: '13.5px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Nunito', sans-serif",
              boxShadow: '0 4px 16px rgba(245, 197, 24, 0.4)',
              letterSpacing: '0.02em',
            }}
          >
            🏠 Inicio
          </button>
        </div>
      </div>

      {/* ══ PANEL INFORMATIVO DEL PLANETA (Desliza desde abajo) ══ */}
      {selectedPlanet && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 35,
            background: 'linear-gradient(0deg, #060520 90%, rgba(6, 5, 32, 0.7))',
            borderTop: `2px solid ${selectedPlanet.glow}`,
            borderRadius: '24px 24px 0 0',
            padding: '1.25rem 1.4rem 2rem',
            maxWidth: '560px',
            margin: '0 auto',
            boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.75)',
            animation: 'slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Header con botón cerrar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '42px', filter: `drop-shadow(0 0 12px ${selectedPlanet.glow})` }}>
                {selectedPlanet.icon}
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2 }}>
                  {selectedPlanet.name}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                  {selectedPlanet.subtitle}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPlanetIdx(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1.5px solid rgba(255, 255, 255, 0.22)',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ fontSize: '12px', color: '#D4CDE6', marginBottom: '1rem', lineHeight: 1.5 }}>
            {selectedPlanet.desc}
          </div>

          {/* Mini Desafío */}
          {miniGameTxt && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(245, 197, 24, 0.12), rgba(255, 140, 42, 0.08))',
                border: '1.5px solid rgba(245, 197, 24, 0.3)',
                borderRadius: '12px',
                padding: '0.75rem',
                marginBottom: '1rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#F5C518', marginBottom: '3px' }}>
                🎮 Mini desafío estelar
              </div>
              <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 700 }}>
                {miniGameTxt}
              </div>
            </div>
          )}

          {/* Botón Principal para ir al planeta */}
          {selectedPlanet.unit >= 0 ? (
            <button
              type="button"
              onClick={() => {
                playSound('whoosh');
                stopFedorSpeak();
                onClose();
                if (onSelectUnit) {
                  onSelectUnit(selectedPlanet.unit);
                }
              }}
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '15px',
                fontWeight: 900,
                background:
                  selectedPct >= 50
                    ? 'linear-gradient(135deg, #24C496, #16876A)'
                    : 'linear-gradient(135deg, #F5C518, #FF8C2A)',
                color: '#2A0F60',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                boxShadow: '0 5px 18px rgba(245, 197, 24, 0.35)',
                marginBottom: '8px',
              }}
            >
              {selectedPct >= 50 ? '🚀 ¡Continuar en este planeta!' : '🚀 ¡Ir a este planeta!'}
            </button>
          ) : (
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#F5C518', fontWeight: 800, marginBottom: '8px' }}>
              ✨ ¡Planeta explorado al 100%!
            </div>
          )}

          <button
            type="button"
            onClick={() => setSelectedPlanetIdx(null)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '13px',
              fontWeight: 800,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1.5px solid rgba(255, 255, 255, 0.18)',
              color: 'rgba(255, 255, 255, 0.75)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            ← Seguir viajando por el espacio
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
