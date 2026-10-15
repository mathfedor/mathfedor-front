'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import videoTopicsData from '@/mocks/data/book-videos-5.data.json';

export interface VideoTopicFrame {
  0: string; // text or DRAW:
  1: string; // subtitle
  2?: string; // mode
}

export interface VideoTopic {
  k: string;
  t: string;
  frames: [string, string, string?][];
  _op?: { a: number; b: number; op: string; r: number };
}

const FEDOR_VIDEO_TOPICS: VideoTopic[] = videoTopicsData as VideoTopic[];

const FV_TOPIC_MAP: [RegExp, string][] = [
  [/sin llevar/i, 'adicion_basica'],
  [/llevadas/i, 'adicion_llevadas'],
  [/pr[eé]stamo/i, 'sustraccion_prestamo'],
  [/resta|sustracci[oó]n/i, 'sustraccion_basica'],
  [/multiplicaci[oó]n y divisi[oó]n/i, 'frac_multi'],
  [/tablas/i, 'multi_1cifra'],
  [/multiplicaci[oó]n/i, 'multi_2cifras'],
  [/divisi[oó]n exacta|partes de la divisi/i, 'division_exacta'],
  [/residuo/i, 'division_residuo'],
  [/divisores/i, 'divisores'],
  [/primos/i, 'primos'],
  [/m[aá]ximo com[uú]n/i, 'mcd'],
  [/m[ií]nimo com[uú]n|mcm/i, 'mcm'],
  [/simplificaci[oó]n/i, 'frac_simpl'],
  [/homog[eé]neas/i, 'frac_homog'],
  [/heterog[eé]neas/i, 'frac_heter'],
  [/fracci/i, 'frac_simpl'],
  [/m[eé]trico|longitud/i, 'sistema_metrico'],
  [/per[ií]metro/i, 'perimetro'],
  [/[aá]rea/i, 'area'],
  [/volumen/i, 'volumen'],
  [/potencia/i, 'potencias'],
  [/radicaci[oó]n|ra[ií]z/i, 'raiz_cuadrada'],
  [/estad[ií]stic/i, 'estadistica'],
  [/probabilidad/i, 'probabilidad'],
  [/adici[oó]n|conteo y posici/i, 'adicion_basica'],
];

export function findVideoForTopic(title: string): number {
  const t = String(title || '');
  for (let i = 0; i < FV_TOPIC_MAP.length; i++) {
    if (FV_TOPIC_MAP[i][0].test(t)) {
      const k = FV_TOPIC_MAP[i][1];
      const idx = FEDOR_VIDEO_TOPICS.findIndex((v) => v.k === k);
      if (idx !== -1) return idx;
    }
  }
  return 0;
}

export function fvPalette(k: string) {
  const key = String(k || '');
  if (/adicion/.test(key)) return { bg1: '#2E1065', bg2: '#5B21B6', acc: '#38D8A5', icon: '➕' };
  if (/sustraccion/.test(key)) return { bg1: '#7A1B00', bg2: '#B45309', acc: '#FCD34D', icon: '➖' };
  if (/multi/.test(key)) return { bg1: '#7A3200', bg2: '#D97706', acc: '#FEF3C7', icon: '✖️' };
  if (/division/.test(key)) return { bg1: '#0A3D6E', bg2: '#1E40AF', acc: '#38D8A5', icon: '➗' };
  if (/frac/.test(key)) return { bg1: '#7A3200', bg2: '#EA580C', acc: '#FDE68A', icon: '🧊' };
  if (/potencia|raiz/.test(key)) return { bg1: '#3D1468', bg2: '#7C3AED', acc: '#FFE066', icon: '⚡' };
  if (/estadistica|probabilidad/.test(key)) return { bg1: '#5A0A28', bg2: '#BE185D', acc: '#FBCFE8', icon: '🎲' };
  if (/metrico|perimetro|area|volumen/.test(key)) return { bg1: '#0A4030', bg2: '#0F766E', acc: '#99F6E4', icon: '📏' };
  if (/divisores|primos|mcd|mcm/.test(key)) return { bg1: '#1E3A8A', bg2: '#3B82F6', acc: '#DBEAFE', icon: '🔢' };
  return { bg1: '#0F172A', bg2: '#1E293B', acc: '#F5C518', icon: '🌟' };
}

interface FedorVideoModal5toProps {
  isOpen: boolean;
  topicTitle: string;
  initialVideoIndex?: number;
  onClose: () => void;
}

export default function FedorVideoModal5to({
  isOpen,
  topicTitle,
  initialVideoIndex,
  onClose,
}: FedorVideoModal5toProps) {
  const [videoIndex, setVideoIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoVoice, setAutoVoice] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const isPlayingRef = useRef(false);
  const frameIndexRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Initialize video index on open or topic change
  useEffect(() => {
    if (isOpen) {
      const idx =
        typeof initialVideoIndex === 'number' && initialVideoIndex >= 0
          ? initialVideoIndex
          : findVideoForTopic(topicTitle);
      setVideoIndex(idx);
      setFrameIndex(0);
      frameIndexRef.current = 0;
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, [isOpen, topicTitle, initialVideoIndex]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  }, []);

  const playBeep = useCallback((freq = 660, dur = 0.09) => {
    try {
      if (typeof window === 'undefined') return;
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current) {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        const o = audioCtxRef.current.createOscillator();
        const g = audioCtxRef.current.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.value = 0.06;
        o.connect(g);
        g.connect(audioCtxRef.current.destination);
        o.start();
        o.stop(audioCtxRef.current.currentTime + dur);
      }
    } catch {}
  }, []);

  const pickVoice = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    try {
      const vs = window.speechSynthesis.getVoices() || [];
      const pref = ['Paulina', 'Mónica', 'Monica', 'Google español', 'es-CO', 'es-ES', 'es-MX', 'es-US'];
      for (let i = 0; i < pref.length; i++) {
        for (let j = 0; j < vs.length; j++) {
          const v = vs[j];
          if ((v.name || '').includes(pref[i]) || (v.lang || '').includes(pref[i])) {
            return v;
          }
        }
      }
      for (let k = 0; k < vs.length; k++) {
        if ((vs[k].lang || '').startsWith('es')) return vs[k];
      }
    } catch {}
    return null;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      voiceRef.current = pickVoice();
      window.speechSynthesis.onvoiceschanged = () => {
        voiceRef.current = pickVoice();
      };
    }
  }, [pickVoice]);

  const fvLeer = (txt: string) => {
    return String(txt || '')
      .replace(/[✅🎉🤔💡📊⬆✏🧮🍎🪙⚽🐬🎬🚀🧑‍🚀👩‍🚀🌍🌌🔥☁️✨📖🟢🟡🔴🟠🟣➗]/g, '')
      .replace(/─+/g, '')
      .replace(/\n+/g, '. ')
      .replace(/(\d)\s*×\s*(\d)/g, '$1 por $2')
      .replace(/×/g, ' por ')
      .replace(/(\d)\s*÷\s*(\d)/g, '$1 entre $2')
      .replace(/÷/g, ' entre ')
      .replace(/(\d|\))\s*[−-]\s*(\d)/g, '$1 menos $2')
      .replace(/(^|\s)[−-]\s*(\d)/g, '$1menos $2')
      .replace(/\+/g, ' más ')
      .replace(/=/g, ' igual a ')
      .replace(/·/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const stopVoice = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speakText = useCallback(
    (txt: string, onDone?: () => void) => {
      const clean = fvLeer(txt);
      let done = false;
      const t0 = Date.now();
      const minDuration = Math.max(1500, clean.split(' ').length * 330 + 600);

      const finish = () => {
        if (done) return;
        const remaining = minDuration - (Date.now() - t0);
        if (remaining > 60) {
          setTimeout(finish, remaining);
          return;
        }
        done = true;
        if (onDone) onDone();
      };

      try {
        stopVoice();
        if (!clean) {
          setTimeout(finish, 400);
          return;
        }
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = 'es-CO';
        u.rate = 0.95;
        u.pitch = 1.05;
        if (voiceRef.current) u.voice = voiceRef.current;
        u.onend = finish;
        u.onerror = finish;
        window.speechSynthesis.speak(u);
        setTimeout(finish, Math.max(2500, clean.split(' ').length * 520 + 1200));
      } catch {
        setTimeout(finish, Math.max(2000, clean.split(' ').length * 450));
      }
    },
    [stopVoice]
  );

  const drawMath = (
    ctx: CanvasRenderingContext2D,
    op: { a: number; b: number; op: string; r: number },
    pal: { bg1: string; bg2: string; acc: string; icon: string },
    W: number,
    H: number
  ) => {
    const { a, b, op: tipo, r } = op;
    ctx.fillStyle = 'rgba(255,255,255,.95)';
    ctx.fillRect(20, 40, W - 40, H - 80);

    const circles = (n: number, x0: number, y0: number, color: string) => {
      const per = Math.min(10, n);
      const gap = 20;
      for (let i = 0; i < n; i++) {
        const cx = x0 + (i % per) * gap;
        const cy = y0 + Math.floor(i / per) * gap;
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const bars = () => {
      const maxV = Math.max(a, b, 1);
      const bw = W - 120;
      ctx.fillStyle = pal.bg2;
      ctx.fillRect(60, 70, bw * (a / maxV), 34);
      ctx.fillStyle = pal.bg1;
      ctx.fillRect(60, 130, bw * (b / maxV), 34);
      ctx.fillStyle = '#111';
      ctx.font = 'bold 16px Nunito, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(String(a), 66 + bw * (a / maxV), 93);
      ctx.fillText(String(b), 66 + bw * (b / maxV), 153);
      ctx.textAlign = 'center';
      ctx.fillText(tipo + ' resultado: ' + r, W / 2, 200);
    };

    ctx.textAlign = 'center';
    if (tipo === '+' && a <= 30 && b <= 30) {
      circles(a, 60, 75, '#7C3AED');
      ctx.fillStyle = '#111';
      ctx.font = 'bold 22px Nunito';
      ctx.fillText('+', W / 2, 120);
      circles(b, 60, 150, '#38D8A5');
      ctx.fillStyle = '#111';
      ctx.font = 'bold 15px Nunito';
      ctx.fillText(`${a} + ${b} = ${r}`, W / 2, H - 52);
    } else if (tipo === '-' && a <= 30) {
      circles(a, 60, 90, '#7C3AED');
      const per = Math.min(10, a);
      const gap = 20;
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 3;
      for (let i = 0; i < Math.min(b, a); i++) {
        const cx = 60 + (i % per) * gap;
        const cy = 90 + Math.floor(i / per) * gap;
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy - 10);
        ctx.lineTo(cx + 10, cy + 10);
        ctx.stroke();
      }
      ctx.fillStyle = '#111';
      ctx.font = 'bold 15px Nunito';
      ctx.fillText(`${a} elementos · tachamos ${b} · quedan ${r}`, W / 2, H - 52);
    } else if (tipo === '×' && a <= 12 && b <= 12) {
      const gap2 = 18;
      const x0 = W / 2 - (a * gap2) / 2 + 9;
      const y0 = 80;
      for (let rr = 0; rr < b; rr++) {
        for (let cc = 0; cc < a; cc++) {
          ctx.beginPath();
          ctx.arc(x0 + cc * gap2, y0 + rr * gap2, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#F97316';
          ctx.fill();
          ctx.strokeStyle = '#7A3200';
          ctx.stroke();
        }
      }
      ctx.fillStyle = '#111';
      ctx.font = 'bold 15px Nunito';
      ctx.fillText(`${b} filas × ${a} columnas = ${r}`, W / 2, H - 52);
    } else if (tipo === '÷' && b <= 8 && r <= 12) {
      const gw = (W - 100) / b;
      for (let g = 0; g < b; g++) {
        const gx = 50 + g * gw + gw / 2;
        ctx.strokeStyle = pal.bg2;
        ctx.lineWidth = 2;
        ctx.strokeRect(50 + g * gw + 4, 70, gw - 8, 110);
        for (let e2 = 0; e2 < r; e2++) {
          ctx.beginPath();
          ctx.arc(gx, 90 + e2 * 14, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#38D8A5';
          ctx.fill();
        }
      }
      ctx.fillStyle = '#111';
      ctx.font = 'bold 15px Nunito';
      ctx.fillText(`${a} ÷ ${b} = ${r} en cada grupo`, W / 2, H - 52);
    } else {
      bars();
    }
  };

  const renderFrame = useCallback(
    (f: number) => {
      const video = FEDOR_VIDEO_TOPICS[videoIndex];
      if (!video || !video.frames || f < 0 || f >= video.frames.length) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const pal = fvPalette(video.k);
      const W = 480;
      const H = 270;
      const pair = video.frames[f];
      const text = String(pair[0] || '');

      // Cosmic background gradient
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, pal.bg1);
      grad.addColorStop(1, pal.bg2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Starfield
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let s = 0; s < 30; s++) {
        ctx.beginPath();
        ctx.arc((s * 47) % W, (s * 61) % H, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Title at top of canvas
      ctx.fillStyle = pal.acc;
      ctx.font = 'bold 13px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(video.t, W / 2, 22);

      // Main drawing or text
      if (text.startsWith('DRAW:') && video._op) {
        drawMath(ctx, video._op, pal, W, H);
      } else {
        ctx.fillStyle = '#FFFFFF';
        const mono = text.includes('\n');
        ctx.font = 'bold ' + (mono ? '20px monospace' : '17px Nunito, sans-serif');
        const lines = text.split('\n');
        const lineH = mono ? 26 : 24;
        const startY = 140 - ((lines.length - 1) * lineH) / 2;

        lines.forEach((line, i) => {
          if (!mono && line.length > 46) {
            const mid = line.lastIndexOf(' ', 46);
            if (mid > 10) {
              ctx.fillText(line.substring(0, mid), W / 2, startY + i * lineH - 12);
              ctx.fillText(line.substring(mid + 1), W / 2, startY + i * lineH + 12);
              return;
            }
          }
          ctx.fillText(line, W / 2, startY + i * lineH);
        });
      }
    },
    [videoIndex]
  );

  // Redraw when frame changes or video changes
  useEffect(() => {
    if (isOpen) {
      renderFrame(frameIndex);
    }
  }, [isOpen, videoIndex, frameIndex, renderFrame]);

  // Handle advancing in playback
  const advance = useCallback(() => {
    if (!isPlayingRef.current) return;
    const video = FEDOR_VIDEO_TOPICS[videoIndex];
    if (!video) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    const currentF = frameIndexRef.current;
    if (currentF >= video.frames.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      playBeep(880, 0.18);
      return;
    }

    playBeep(560, 0.07);
    renderFrame(currentF);

    const pair = video.frames[currentF];
    const text = String(pair[0] || '');
    const sub = String(pair[1] || '');
    const isDraw = text.startsWith('DRAW:');
    const modo = pair[2];

    const visible = isDraw
      ? sub
        ? `Míralo con dibujos. ${sub}`
        : 'Míralo con dibujos'
      : modo === 'sub'
      ? sub
      : modo === 'txt'
      ? text
      : text.includes('\n')
      ? sub
      : text + (sub ? '. ' + sub : '');

    const nextStep = () => {
      if (!isPlayingRef.current || frameIndexRef.current !== currentF) return;
      addTimer(() => {
        if (!isPlayingRef.current || frameIndexRef.current !== currentF) return;
        if (currentF + 1 < video.frames.length) {
          frameIndexRef.current = currentF + 1;
          setFrameIndex(currentF + 1);
          advance();
        } else {
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      }, 500);
    };

    addTimer(() => {
      if (!isPlayingRef.current || frameIndexRef.current !== currentF) return;
      if (autoVoice) {
        speakText(visible, nextStep);
      } else {
        addTimer(nextStep, Math.max(2200, fvLeer(visible).split(' ').length * 420));
      }
    }, 250);
  }, [videoIndex, autoVoice, playBeep, renderFrame, speakText, addTimer]);

  const handlePlay = () => {
    if (isPlayingRef.current) return;
    setIsPlaying(true);
    isPlayingRef.current = true;
    playBeep(720, 0.1);
    advance();
  };

  const handlePause = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    clearTimers();
    stopVoice();
    playBeep(440, 0.1);
  };

  const handleNarrate = () => {
    const video = FEDOR_VIDEO_TOPICS[videoIndex];
    if (!video) return;
    const pair = video.frames[Math.min(frameIndex, video.frames.length - 1)];
    if (pair) {
      const t0 = String(pair[0] || '');
      const s0 = String(pair[1] || '');
      const narrText = (t0.startsWith('DRAW:') ? 'Míralo con dibujos' : t0) + (s0 ? '. ' + s0 : '');
      speakText(narrText);
    }
  };

  const handleToggleVoice = () => {
    const nextVoice = !autoVoice;
    setAutoVoice(nextVoice);
    if (!nextVoice) stopVoice();
    playBeep(nextVoice ? 760 : 420, 0.1);
  };

  const handleNav = (dir: number) => {
    clearTimers();
    stopVoice();
    setIsPlaying(false);
    isPlayingRef.current = false;

    const video = FEDOR_VIDEO_TOPICS[videoIndex];
    if (!video) return;

    const nextFrame = frameIndex + dir;
    if (nextFrame >= 0 && nextFrame < video.frames.length) {
      setFrameIndex(nextFrame);
      frameIndexRef.current = nextFrame;
      playBeep(600, 0.08);
    } else if (nextFrame >= video.frames.length) {
      // Loop or go to next video
      const n = FEDOR_VIDEO_TOPICS.length;
      const nextVid = (videoIndex + 1) % n;
      setVideoIndex(nextVid);
      setFrameIndex(0);
      frameIndexRef.current = 0;
    } else if (nextFrame < 0) {
      const n = FEDOR_VIDEO_TOPICS.length;
      const prevVid = (videoIndex - 1 + n) % n;
      setVideoIndex(prevVid);
      setFrameIndex(0);
      frameIndexRef.current = 0;
    }
  };

  const handleClose = () => {
    handlePause();
    onClose();
  };

  if (!isOpen) return null;

  const currentVideo = FEDOR_VIDEO_TOPICS[videoIndex] || FEDOR_VIDEO_TOPICS[0];
  const pal = fvPalette(currentVideo.k);
  const currentPair = currentVideo.frames[frameIndex] || currentVideo.frames[0];
  const subtext = currentPair ? currentPair[1] : '';
  const totalFrames = currentVideo.frames.length;

  return (
    <div
      className="fixed inset-0 z-[9995] flex items-center justify-center p-3 select-none"
      style={{ backgroundColor: 'rgba(18, 8, 42, 0.72)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="bg-white rounded-[18px] max-w-[560px] w-full max-h-[90vh] overflow-y-auto p-4 sm:p-5 md:p-6 relative shadow-2xl font-sans"
        style={{
          boxShadow: '0 24px 70px rgba(20, 8, 50, 0.5)',
          color: '#180D38',
        }}
      >
        {/* Top Header Row with Title and Close Button */}
        <div className="flex items-center justify-between mb-2">
          <div
            className="text-lg sm:text-xl font-black text-[#3D1468] flex items-center gap-2"
            style={{ fontFamily: "'Baloo 2', 'Nunito', sans-serif" }}
          >
            <span>🎬</span>
            <span>Video Fedor</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-[#6C28B4] bg-[#F7F4FF] border border-[#E4DFF5] hover:bg-[#6C28B4] hover:text-white transition-colors cursor-pointer select-none"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Subtitle with Theme Icon and Title */}
        <div className="text-center font-black text-sm sm:text-base text-[#5C21A6] mb-2.5">
          <span>{pal.icon}</span> <span>{currentVideo.t}</span>
        </div>

        {/* Video Canvas */}
        <div className="flex justify-center mb-2">
          <canvas
            ref={canvasRef}
            width={480}
            height={270}
            className="w-full max-w-[480px] rounded-xl border-[3px] border-[#5C21A6] shadow-md"
            style={{ background: pal.bg1, aspectRatio: '16/9' }}
          />
        </div>

        {/* Progress Bar */}
        <div className="max-w-[480px] mx-auto h-2 bg-[#EEEEEE] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#5C21A6] to-[#8B3EDB] transition-all duration-300"
            style={{ width: `${((frameIndex + 1) / totalFrames) * 100}%` }}
          />
        </div>

        {/* Step Subtext */}
        <div className="text-center text-sm font-extrabold text-[#5C21A6] min-h-[24px] mt-2 px-2">
          {subtext}
        </div>

        {/* Controls - Row 1 */}
        <div className="flex gap-1.5 sm:gap-2 justify-center flex-wrap mt-2.5">
          <button
            type="button"
            onClick={handlePlay}
            disabled={isPlaying}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-white font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer ${
              isPlaying
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:scale-102 hover:shadow-md'
            }`}
            style={{
              background: 'linear-gradient(135deg, #16876A 0%, #24C496 100%)',
            }}
          >
            ▶ Reproducir
          </button>

          <button
            type="button"
            onClick={handlePause}
            className="px-3 sm:px-3.5 py-2 rounded-xl text-white font-black text-xs sm:text-sm bg-[#B45309] shadow-xs hover:scale-102 hover:shadow-md transition-all cursor-pointer"
          >
            ⏸ Pausa
          </button>

          <button
            type="button"
            onClick={handleNarrate}
            className="px-3 sm:px-3.5 py-2 rounded-xl text-white font-black text-xs sm:text-sm bg-[#0E6BA8] shadow-xs hover:scale-102 hover:shadow-md transition-all cursor-pointer"
          >
            🔊 Narrar paso
          </button>

          <button
            type="button"
            onClick={handleToggleVoice}
            className="px-3 sm:px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm shadow-xs hover:scale-102 hover:shadow-md transition-all cursor-pointer"
            style={{
              backgroundColor: '#3D1468',
              color: '#FFE066',
              border: '1px solid #F5C518',
            }}
          >
            {autoVoice ? '🔊 Voz auto: SÍ' : '🔇 Voz auto: NO'}
          </button>
        </div>

        {/* Controls - Row 2 */}
        <div className="flex gap-2 justify-center mt-2">
          <button
            type="button"
            onClick={() => handleNav(-1)}
            className="px-4 py-2 rounded-xl text-white font-black text-xs sm:text-sm bg-[#5C21A6] shadow-xs hover:scale-102 hover:shadow-md transition-all cursor-pointer"
          >
            ◀ Anterior
          </button>

          <button
            type="button"
            onClick={() => handleNav(1)}
            className="px-4 py-2 rounded-xl text-white font-black text-xs sm:text-sm bg-[#5C21A6] shadow-xs hover:scale-102 hover:shadow-md transition-all cursor-pointer"
          >
            Siguiente ▶
          </button>
        </div>

        {/* Step Indicator */}
        <div className="text-center text-[11px] text-[#7A7299] font-bold mt-2">
          Paso {frameIndex + 1} de {totalFrames}
        </div>
      </div>
    </div>
  );
}
