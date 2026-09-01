import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ConfettiRef {
  lanzar: (n?: number) => void;
}

const ConfettiCanvas = forwardRef<ConfettiRef, {}>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      rot: number;
      vr: number;
      c: string;
    }>
  >([]);
  const animRef = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    lanzar: (n = 100) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cols = ['#FFC94D', '#FF6B5E', '#4FD8CB', '#9B7BFF', '#5BD672', '#F2F6FF'];
      for (let i = 0; i < n; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: -20 - Math.random() * 120,
          vx: (Math.random() - 0.5) * 2.4,
          vy: 2 + Math.random() * 3.2,
          r: 4 + Math.random() * 5,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.25,
          c: cols[Math.floor(Math.random() * cols.length)],
        });
      }
      if (!animRef.current) {
        step();
      }
    },
  }));

  const step = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = particlesRef.current.filter((p) => p.y < canvas.height + 30);
    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
    });

    if (particlesRef.current.length > 0) {
      animRef.current = requestAnimationFrame(step);
    } else {
      animRef.current = null;
    }
  };

  useEffect(() => {
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
});

ConfettiCanvas.displayName = 'ConfettiCanvas';

export default ConfettiCanvas;
