'use client';

import { useEffect, useRef, useState } from 'react';
import { useBook } from '../context/BookContext';
import dynamic from 'next/dynamic';

const CinematicScene = dynamic(() => import('./CinematicScene'), { ssr: false });

export default function LaunchIntro({ onClose }: { onClose: () => void }) {
  const { book } = useBook();
  const containerRef = useRef<HTMLDivElement>(null);

  const isGrade1 = book?.slug === 'libro-1ro';
  const isGrade2 = book?.slug === 'libro-2do' || book?.slug === 'matematicas-fedor-2';

  useEffect(() => {
    if (!isGrade1 && !isGrade2) return;

    const container = containerRef.current;
    if (!container) return;

    // Inject styles and layout structure
    container.innerHTML = `
      <style>
        #fedorIntroBG_2d {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: #000;
          overflow: hidden;
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          user-select: none;
        }
        .intro-skip-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          background: rgba(255, 255, 255, 0.18);
          color: #fff;
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          padding: 10px 18px;
          border-radius: 24px;
          cursor: pointer;
          font-weight: 900;
          font-size: 14px;
          z-index: 100000;
          font-family: 'Nunito', sans-serif;
          transition: background 0.2s, transform 0.1s;
        }
        .intro-skip-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }
        .intro-skip-btn:active {
          transform: scale(0.95);
        }
        .intro-stage-2d {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .intro-cap-2d {
          position: absolute;
          bottom: 7%;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          font-size: 20px;
          font-weight: 900;
          text-shadow: 0 4px 18px rgba(0,0,0,.95), 0 0 30px rgba(245,197,24,.5);
          padding: 14px 28px;
          background: rgba(0, 0, 0, 0.65);
          border-radius: 30px;
          border: 2px solid rgba(245, 197, 24, 0.6);
          text-align: center;
          letter-spacing: .02em;
          max-width: 88%;
          z-index: 99999;
          font-family: 'Baloo 2', sans-serif;
          pointer-events: none;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }

        /* ─── KEYFRAMES GRADE 1 ─── */
        @keyframes f1iWalk {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(380px); }
        }
        @keyframes f1iBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes f1iClimb {
          0% { transform: translate(380px,0); }
          100% { transform: translate(420px,-220px); }
        }
        @keyframes f1iFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes f1iZoom {
          from { transform: scale(.4) translateY(120px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes f1iCount {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          25% { transform: scale(1.6) rotate(0); opacity: 1; }
          80% { transform: scale(1) rotate(0); opacity: 1; }
          100% { transform: scale(.4) rotate(20deg); opacity: 0; }
        }
        @keyframes f1iLiftoff {
          0% { transform: translateY(0); }
          30% { transform: translateY(8px); }
          100% { transform: translateY(-700px); }
        }
        @keyframes f1iShake {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-2px) translateX(-3px); }
          75% { transform: translateY(2px) translateX(3px); }
        }
        @keyframes f1iFlame {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: .95; }
          50% { transform: scaleY(1.35) scaleX(.85); opacity: 1; }
        }
        @keyframes f1iSmoke {
          0% { transform: scale(.6); opacity: 0; }
          40% { opacity: .7; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes f1iStarBlur {
          0% { transform: translateY(120vh) scale(1); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-30vh) scale(1.6); opacity: 0; }
        }
        @keyframes f1iEarthShrink {
          0% { transform: scale(1) translateY(0); opacity: 1; }
          100% { transform: scale(.3) translateY(160px); opacity: .85; }
        }
        @keyframes f1iMoonZoom {
          0% { transform: scale(.2); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes f1iLandBounce {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -15px); }
        }
        @keyframes f1iLabBlink {
          0%, 100% { opacity: .6; }
          50% { opacity: 1; }
        }
        @keyframes f1iWelcomeRain {
          0% { transform: translateY(-30px) rotate(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(60vh) rotate(360deg); opacity: 0; }
        }

        /* ─── KEYFRAMES GRADE 2 ─── */
        @keyframes introBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes introZoom {
          from { transform: scale(.4) translateY(80px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes introCount {
          0% { transform: translate(-50%,-50%) scale(0) rotate(-20deg); opacity: 0; }
          25% { transform: translate(-50%,-50%) scale(1.6) rotate(0); opacity: 1; }
          80% { transform: translate(-50%,-50%) scale(1) rotate(0); opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(.4) rotate(20deg); opacity: 0; }
        }
        @keyframes liftoffMega {
          0% { transform: translateX(-50%) translateY(0) scale(1); }
          10% { transform: translateX(-50%) translateY(-4px) scale(1); }
          100% { transform: translateX(-50%) translateY(-110vh) scale(.3); }
        }
        @keyframes earthShrink {
          0% { transform: translate(-50%,0) scale(1); }
          100% { transform: translate(-50%,0) scale(.15); }
        }
        @keyframes moonZoomIn {
          0% { transform: translate(-50%,-50%) scale(.05); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(2.5); opacity: 1; }
        }
        @keyframes streakStar {
          0% { transform: translateY(-20vh) scale(.4); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(120vh) scale(2); opacity: 0; }
        }
        @keyframes flagWave {
          0%, 100% { transform: skewX(0); }
          50% { transform: skewX(-8deg); }
        }
        @keyframes astroToShip {
          0% { left: 25%; opacity: 1; }
          50% { left: 45%; transform: translateY(-3px); }
          90% { left: 65%; opacity: 1; }
          100% { left: 68%; opacity: 0; transform: scale(.7); }
        }
        @keyframes introSmoke {
          0% { transform: scale(.6); opacity: 0; }
          40% { opacity:.75; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes introFlame {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: .95; }
          50% { transform: scaleY(1.3) scaleX(.85); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      </style>

      <div id="fedorIntroBG_2d">
        <button class="intro-skip-btn" id="fedorIntroSkip">⏭ Saltar</button>
        <div class="intro-stage-2d" id="fedorIntroStage"></div>
        <div class="intro-cap-2d" id="fedorIntroCap" style="display:none"></div>
      </div>
    `;

    const stage = container.querySelector('#fedorIntroStage') as HTMLDivElement;
    const cap = container.querySelector('#fedorIntroCap') as HTMLDivElement;
    const skipBtn = container.querySelector('#fedorIntroSkip') as HTMLButtonElement;

    let timers: any[] = [];
    let audioCtx: AudioContext | null = null;

    const setTimer = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.push(t);
      return t;
    };

    const clearAllTimers = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    const setCap = (txt: string) => {
      if (!txt) {
        cap.style.display = 'none';
        return;
      }
      cap.textContent = txt;
      cap.style.display = 'block';
    };

    const clearStage = () => {
      if (stage) stage.innerHTML = '';
    };

    const getAudioContext = (): AudioContext => {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    };

    const tone = (freq: number, dur?: number, type?: OscillatorType, vol?: number) => {
      try {
        const ctx = getAudioContext();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type || 'sine';
        o.frequency.value = freq;
        g.gain.value = vol || 0.12;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (dur || 0.2));
        o.stop(ctx.currentTime + (dur || 0.2) + 0.02);
      } catch (e) {}
    };

    const chord = (freqs: number[], dur?: number) => {
      (freqs || []).forEach((f, i) => {
        setTimer(() => {
          tone(f, dur || 0.16, 'triangle', 0.13);
        }, i * 50);
      });
    };

    const rumble = () => {
      try {
        const ctx = getAudioContext();
        const buf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) {
          d[i] = (Math.random() * 2 - 1) * 0.45 * (1 - i / d.length);
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.value = 0.5;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 300;
        src.connect(lp);
        lp.connect(g);
        g.connect(ctx.destination);
        src.start();
      } catch (e) {}
    };

    const handleClose = () => {
      clearAllTimers();
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
      onClose();
    };
    skipBtn.onclick = handleClose;

    // ----------------------------------------------------
    // FIRST GRADE MOUNT & SCENES
    // ----------------------------------------------------
    if (isGrade1) {
      const sceneHeader = (n: number, title: string, color?: string) => {
        return `
          <div style="position:absolute;top:14px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.65);color:#5BBFFF;font-family:'Baloo 2',sans-serif;font-size:11px;font-weight:900;padding:5px 14px;border-radius:14px;letter-spacing:.15em;border:1.5px solid ${color || '#5BBFFF'};z-index:10">ESCENA ${n} / 8</div>
          <div style="position:absolute;top:50px;left:50%;transform:translateX(-50%);color:${color || '#5BBFFF'};font-family:'Baloo 2',sans-serif;font-size:24px;font-weight:900;text-shadow:0 4px 18px rgba(0,0,0,.9);text-align:center;width:95%;z-index:10">${title}</div>
        `;
      };

      const sceneLab = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:linear-gradient(180deg,#1A0540 0%,#2A1054 50%,#3D1C66 100%);overflow:hidden">
            ${sceneHeader(1, '🔬 LABORATORIO ESPACIAL')}
            <div style="position:absolute;top:0;left:0;right:0;height:40%;background:repeating-linear-gradient(90deg,rgba(91,191,255,.15) 0 30px,rgba(91,191,255,.05) 30px 60px);border-bottom:3px solid rgba(91,191,255,.4)"></div>
            <div style="position:absolute;bottom:0;left:0;right:0;height:25%;background:linear-gradient(180deg,#1A2A4E,#0A1330);border-top:3px solid #5BBFFF;background-image:repeating-linear-gradient(90deg,rgba(91,191,255,.2) 0 40px,transparent 40px 80px)"></div>
            <div style="position:absolute;top:18%;left:4%;width:140px;height:55%;background:linear-gradient(180deg,#2A3A6E,#0A1B40);border:3px solid #5BBFFF;border-radius:8px;display:flex;flex-direction:column;justify-content:space-around;padding:8px">
              <div style="display:flex;justify-content:space-around;font-size:30px">🧪 🔬 ⚗️</div>
              <div style="display:flex;justify-content:space-around;font-size:30px">📡 💻 🛰️</div>
              <div style="display:flex;justify-content:space-around;font-size:30px">📊 ⚙️ 🔧</div>
            </div>
            <div style="position:absolute;top:18%;right:4%;width:200px;height:62%;background:radial-gradient(ellipse at center,#0A1B40,#020611);border:5px solid #5BBFFF;border-radius:16px;box-shadow:0 0 32px rgba(91,191,255,.5),inset 0 0 30px rgba(91,191,255,.2);overflow:hidden">
              ${Array.from({ length: 20 }).map(() => {
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const sz = Math.random() * 1.6 + 0.5;
                return `<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;background:#fff;border-radius:50%"></div>`;
              }).join('')}
              <div style="position:absolute;bottom:18%;left:50%;transform:translateX(-50%);font-size:48px;filter:drop-shadow(0 0 14px rgba(255,255,255,.6))">🚀</div>
              <div style="position:absolute;bottom:0;left:0;right:0;height:18%;background:linear-gradient(180deg,#3D1C12,#1A0905)"></div>
              <div style="position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:9px;font-weight:900;color:#5BBFFF;letter-spacing:.1em">🛰️ VENTANA</div>
            </div>
            <div style="position:absolute;bottom:25%;left:50%;transform:translateX(-50%);width:36%;max-width:280px;background:linear-gradient(180deg,#2A3A6E,#0A1B40);border:3px solid #5BBFFF;border-radius:14px;padding:14px;animation:f1iLabBlink 1.4s ease-in-out infinite">
              <div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px">
                ${['#FF1D4E', '#F5C518', '#16876A', '#5BBFFF'].map((c) => {
                  return `<div style="width:18px;height:18px;border-radius:50%;background:${c};box-shadow:0 0 12px ${c}"></div>`;
                }).join('')}
              </div>
              <div style="background:rgba(91,191,255,.18);border-radius:8px;padding:8px;text-align:center;color:#5BBFFF;font-weight:900;font-size:14px;font-family:monospace;letter-spacing:.04em">SISTEMA · LISTO ✓</div>
            </div>
            <div id="f1LabAstro" style="position:absolute;bottom:24%;left:50%;transform:translateX(-50%);font-size:96px;filter:drop-shadow(0 8px 16px rgba(0,0,0,.5));animation:f1iBob 1.8s ease-in-out infinite">🧑‍🚀</div>
          </div>
        `;
        setCap('🔬 Fedor prepara su misión en el laboratorio espacial...');
        tone(523, 0.3, 'triangle', 0.10);
        setTimer(() => { tone(659, 0.3, 'triangle', 0.10); }, 700);
        setTimer(() => { tone(784, 0.3, 'triangle', 0.10); }, 1400);
        setTimer(done, 3800);
      };

      const sceneWalk = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:linear-gradient(180deg,#FFB66E 0%,#FF7A50 30%,#9B3E76 70%,#2A1054 100%);overflow:hidden">
            ${sceneHeader(2, '🚶 CAMINO AL COHETE')}
            <div style="position:absolute;top:10%;right:8%;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#FFE6A8,#FF9043);box-shadow:0 0 90px rgba(255,170,80,.85)"></div>
            ${Array.from({ length: 30 }).map(() => {
              const x = Math.random() * 100;
              const y = Math.random() * 40;
              const sz = Math.random() * 2 + 0.5;
              return `<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;background:#fff;border-radius:50%;opacity:${0.4 + Math.random() * 0.5};animation:f1iBob 2s ease-in-out infinite"></div>`;
            }).join('')}
            <svg viewBox="0 0 100 25" preserveAspectRatio="none" style="position:absolute;bottom:25%;left:0;right:0;width:100%;height:30%"><path d="M0 25 L10 12 L20 18 L30 8 L40 14 L50 6 L60 12 L70 4 L80 14 L90 10 L100 18 L100 25 Z" fill="#3D1C66" opacity=".75"/></svg>
            <div style="position:absolute;bottom:0;left:0;right:0;height:25%;background:linear-gradient(180deg,#3D1C12,#1A0905);border-top:3px solid #5A2A1A"></div>
            <div style="position:absolute;bottom:25%;left:3%;width:140px;height:160px;background:linear-gradient(180deg,#5BBFFF,#1A6CB4);border-radius:14px 14px 4px 4px;border:3px solid #2A4080;display:flex;align-items:flex-start;justify-content:center;padding-top:8px">
              <div style="background:#FFE066;color:#3D1468;padding:3px 12px;border-radius:14px;font-size:11px;font-weight:900">🧪 LAB</div>
            </div>
            <div style="position:absolute;bottom:25%;left:60%;width:200px;height:14px;background:linear-gradient(180deg,#888,#444);border-radius:4px"></div>
            <div style="position:absolute;bottom:25%;left:60%;width:8px;height:160px;background:linear-gradient(180deg,#999,#333);border-radius:2px"></div>
            <div style="position:absolute;bottom:65%;left:58%;width:24px;height:14px;background:#FFD66B;border-radius:3px"></div>
            <div style="position:absolute;bottom:27%;left:62%;width:78px;height:220px">
              <svg viewBox="0 0 80 220" width="80" height="220">
                <defs>
                  <linearGradient id="f1RkBody1" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#e0e8ff"/><stop offset="1" stop-color="#a8b8e6"/></linearGradient>
                  <radialGradient id="f1RkWin1" cx=".5" cy=".5"><stop offset="0" stop-color="#5BBFFF"/><stop offset="1" stop-color="#0A4A8C"/></radialGradient>
                </defs>
                <path d="M40 4 L62 70 L62 178 L18 178 L18 70 Z" fill="url(#f1RkBody1)" stroke="#5A6A99" stroke-width="2"/>
                <circle cx="40" cy="92" r="14" fill="url(#f1RkWin1)" stroke="#1A3A6A" stroke-width="2"/>
                <circle cx="40" cy="130" r="9" fill="#5BBFFF" stroke="#1A3A6A" stroke-width="1.5"/>
                <path d="M18 140 L4 200 L18 178 Z" fill="#E8650A" stroke="#9B3500" stroke-width="1.5"/>
                <path d="M62 140 L76 200 L62 178 Z" fill="#E8650A" stroke="#9B3500" stroke-width="1.5"/>
                <path d="M40 4 L34 22 L46 22 Z" fill="#FF1D4E" stroke="#9B0023" stroke-width="1.5"/>
                <rect x="18" y="178" width="44" height="10" fill="#666" stroke="#222" stroke-width="1.5"/>
                <text x="40" y="165" text-anchor="middle" font-size="9" font-weight="900" fill="#1A3A6A" font-family="'Baloo 2',sans-serif">FEDOR</text>
              </svg>
            </div>
            <div id="f1WalkAstro" style="position:absolute;bottom:27%;left:0;width:60px;height:90px;animation:f1iWalk 3.4s linear forwards,f1iBob .5s ease-in-out infinite">
              <div style="font-size:64px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))">🧑‍🚀</div>
            </div>
          </div>
        `;
        setCap('🚶‍♂️ ¡Sale del laboratorio y camina hacia el cohete!');
        tone(440, 0.3, 'sine', 0.08);
        setTimer(() => { tone(523, 0.3, 'sine', 0.08); }, 800);
        setTimer(() => { tone(659, 0.3, 'sine', 0.08); }, 1600);
        setTimer(done, 3800);
      };

      const sceneRamp = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:linear-gradient(180deg,#FFB66E 0%,#FF7A50 30%,#9B3E76 70%,#2A1054 100%);overflow:hidden">
            ${sceneHeader(3, '🪜 SUBIENDO LA RAMPA')}
            <div style="position:absolute;top:10%;right:8%;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#FFE6A8,#FF9043);box-shadow:0 0 90px rgba(255,170,80,.85)"></div>
            <div style="position:absolute;bottom:0;left:0;right:0;height:25%;background:linear-gradient(180deg,#3D1C12,#1A0905);border-top:3px solid #5A2A1A"></div>
            <div style="position:absolute;bottom:25%;left:45%;width:200px;height:8px;background:linear-gradient(90deg,#888,#444);border-radius:4px;transform:rotate(-30deg);transform-origin:left center"></div>
            <div style="position:absolute;bottom:25%;left:62%;width:78px;height:220px">
              <svg viewBox="0 0 80 220" width="80" height="220">
                <path d="M40 4 L62 70 L62 178 L18 178 L18 70 Z" fill="#fff" stroke="#5A6A99" stroke-width="2"/>
                <circle cx="40" cy="92" r="14" fill="#5BBFFF" stroke="#1A3A6A" stroke-width="2"/>
                <circle cx="40" cy="130" r="9" fill="#5BBFFF" stroke="#1A3A6A" stroke-width="1.5"/>
                <path d="M40 4 L34 22 L46 22 Z" fill="#FF1D4E"/>
              </svg>
            </div>
            <div id="f1ClimbAstro" style="position:absolute;bottom:27%;left:0;font-size:64px;animation:f1iClimb 2.5s ease-in-out forwards;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))">🧑‍🚀</div>
          </div>
        `;
        setCap('🪜 ¡Sube por la rampa hasta su cohete!');
        tone(523, 0.25, 'triangle', 0.1);
        setTimer(() => { tone(659, 0.25, 'triangle', 0.1); }, 700);
        setTimer(() => { tone(784, 0.25, 'triangle', 0.1); }, 1400);
        setTimer(done, 2700);
      };

      const sceneCount = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,#1B2A5B 0%,#080A1F 80%);overflow:hidden">
            ${sceneHeader(4, '🚥 CONTEO REGRESIVO', '#F5C518')}
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;max-width:520px;aspect-ratio:1;background:radial-gradient(circle at 50% 50%,rgba(20,40,90,.7),rgba(0,0,0,.95));border:8px solid #3A4A8C;border-radius:50%;box-shadow:inset 0 0 80px rgba(91,191,255,.25),0 0 60px rgba(91,191,255,.4)"></div>
            <div style="position:absolute;bottom:18%;left:50%;transform:translateX(-50%);width:70%;max-width:430px;background:linear-gradient(180deg,#2A3A6E,#0A1B40);border:3px solid #5BBFFF;border-radius:14px;padding:14px;display:flex;gap:10px;justify-content:center">
              ${Array.from({ length: 8 }).map((_, i) => {
                const c = ['#FF1D4E', '#F5C518', '#16876A', '#5BBFFF'][i % 4];
                return `<div style="width:24px;height:24px;border-radius:50%;background:${c};box-shadow:0 0 14px ${c}"></div>`;
              }).join('')}
            </div>
            <div style="position:absolute;top:38%;left:50%;transform:translate(-50%,-50%);font-size:90px;filter:drop-shadow(0 0 18px rgba(91,191,255,.7));animation:f1iBob 1.5s ease-in-out infinite">🧑‍🚀</div>
            <div id="f1Counter" style="position:absolute;top:14%;left:50%;transform:translateX(-50%);font-size:140px;font-weight:900;color:#F5C518;text-shadow:0 6px 30px rgba(245,197,24,.7),0 0 40px rgba(245,197,24,.5);font-family:'Baloo 2',sans-serif"></div>
          </div>
        `;
        setCap('🚦 ¡Está adentro! 3... 2... 1... ¡DESPEGUE!');
        const counter = stage.querySelector('#f1Counter') as HTMLDivElement;
        const seq = ['3', '2', '1', '¡DESPEGUE!'];
        seq.forEach((n, i) => {
          setTimer(() => {
            if (!counter) return;
            counter.style.animation = 'none';
            void counter.offsetHeight;
            counter.textContent = n;
            counter.style.animation = 'f1iCount 1.05s cubic-bezier(.34,1.56,.64,1)';
            if (i < 3) tone(880, 0.22, 'square', 0.14);
            else { tone(1046, 0.45, 'sine', 0.18); rumble(); }
          }, i * 900);
        });
        setTimer(done, 4500);
      };

      const sceneLiftoff = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div id="f1Sky" style="position:absolute;inset:0;background:linear-gradient(180deg,#2A1054 0%,#5B1A6E 50%,#9B3E76 100%);overflow:hidden;animation:f1iShake .15s linear infinite">
            ${sceneHeader(5, '🚀 DESPEGUE!', '#FF1D4E')}
            <div style="position:absolute;top:10%;right:6%;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,#FFE6A8,#FF9043);box-shadow:0 0 50px rgba(255,170,80,.7)"></div>
            <div style="position:absolute;bottom:-100px;left:50%;transform:translateX(-50%);width:600px;height:300px;border-radius:50%;background:radial-gradient(ellipse at 50% 30%,#5BBFFF 0%,#1A6CB4 40%,#0A4A8C 80%);box-shadow:inset 0 -40px 80px rgba(0,0,0,.5),0 0 80px rgba(91,191,255,.5);overflow:hidden">
              <div style="position:absolute;top:30%;left:20%;width:30%;height:25%;background:rgba(124,200,80,.7);border-radius:50%"></div>
              <div style="position:absolute;top:45%;left:55%;width:25%;height:20%;background:rgba(124,200,80,.6);border-radius:50%"></div>
            </div>
            ${Array.from({ length: 30 }).map(() => {
              const x = Math.random() * 100;
              const y = Math.random() * 55;
              const sz = Math.random() * 2 + 0.6;
              return `<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;background:#fff;border-radius:50%"></div>`;
            }).join('')}
            <div style="position:absolute;bottom:5%;left:48%;width:8px;height:60px;background:#666"></div>
            ${Array.from({ length: 6 }).map((_, i) => {
              const dx = (i - 3) * 30;
              const dy = Math.random() * 30;
              return `<div style="position:absolute;bottom:${5 + dy}%;left:calc(50% + ${dx}px);width:80px;height:80px;background:radial-gradient(circle,rgba(220,220,220,.95),rgba(150,150,150,.5),transparent);border-radius:50%;animation:f1iSmoke 2.4s ease-out ${i * 0.15}s forwards"></div>`;
            }).join('')}
            <div id="f1RkLift" style="position:absolute;bottom:8%;left:50%;transform:translateX(-50%);width:78px;height:260px;animation:f1iLiftoff 3.6s cubic-bezier(.5,.05,.4,1) forwards">
              <div style="position:absolute;bottom:-40px;left:50%;transform:translateX(-50%);width:70px;height:120px;animation:f1iFlame .12s ease-in-out infinite">
                <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:50px;height:100px;background:radial-gradient(ellipse at 50% 30%,#FFEE99,#FF8800 40%,#FF1D4E 70%,transparent 100%);border-radius:50% 50% 30% 30%;filter:blur(2px)"></div>
                <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:24px;height:60px;background:radial-gradient(ellipse at 50% 20%,#fff,#FFE99B 50%,transparent 100%);border-radius:50% 50% 30% 30%"></div>
              </div>
              <svg viewBox="0 0 80 220" width="78" height="220" style="position:absolute;top:0;left:0">
                <defs><linearGradient id="f1Rb2" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#a8b8e6"/></linearGradient></defs>
                <path d="M40 4 L62 70 L62 178 L18 178 L18 70 Z" fill="url(#f1Rb2)" stroke="#5A6A99" stroke-width="2"/>
                <circle cx="40" cy="92" r="14" fill="#5BBFFF" stroke="#1A3A6A" stroke-width="2"/>
                <circle cx="40" cy="130" r="9" fill="#5BBFFF" stroke="#1A3A6A" stroke-width="1.5"/>
                <path d="M18 140 L4 200 L18 178 Z" fill="#E8650A"/>
                <path d="M62 140 L76 200 L62 178 Z" fill="#E8650A"/>
                <path d="M40 4 L34 22 L46 22 Z" fill="#FF1D4E"/>
                <text x="40" y="165" text-anchor="middle" font-size="9" font-weight="900" fill="#1A3A6A">FEDOR</text>
              </svg>
            </div>
          </div>
        `;
        setCap('🚀 ¡Despega! El cohete sube desde la Tierra...');
        rumble();
        setTimer(rumble, 400);
        setTimer(rumble, 800);
        setTimer(rumble, 1200);
        setTimer(done, 3700);
      };

      const sceneSpace = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:linear-gradient(180deg,#080A1F 0%,#0A1B40 50%,#1A0540 100%);overflow:hidden">
            ${sceneHeader(6, '🌠 VIAJE ESPACIAL')}
            <div style="position:absolute;bottom:-80px;left:50%;transform:translateX(-50%);width:280px;height:280px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#5BBFFF,#1A6CB4 50%,#0A2E5A);box-shadow:0 0 60px rgba(91,191,255,.6);animation:f1iEarthShrink 4s ease-out forwards;overflow:hidden">
              <div style="position:absolute;top:25%;left:20%;width:35%;height:30%;background:rgba(124,200,80,.65);border-radius:50%"></div>
              <div style="position:absolute;top:50%;left:55%;width:28%;height:22%;background:rgba(124,200,80,.55);border-radius:50%"></div>
            </div>
            ${Array.from({ length: 60 }).map(() => {
              const x = Math.random() * 100;
              const w = Math.random() * 3 + 1;
              const h = Math.random() * 60 + 20;
              const d = Math.random() * 2 + 0.5;
              return `<div style="position:absolute;left:${x}%;top:-10%;width:${w}px;height:${h}px;background:linear-gradient(180deg,transparent,#fff,transparent);border-radius:3px;animation:f1iStarBlur ${d}s linear ${Math.random()}s infinite"></div>`;
            }).join('')}
            <div style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);width:70px;height:200px;animation:f1iBob .6s ease-in-out infinite">
              <div style="position:absolute;bottom:-30px;left:50%;transform:translateX(-50%);width:50px;height:80px;background:radial-gradient(ellipse,#fff,#FFE99B 40%,#FF8800 80%,transparent);border-radius:50% 50% 40% 40%;filter:blur(3px);animation:f1iFlame .1s linear infinite"></div>
              <svg viewBox="0 0 80 220" width="70" height="200">
                <path d="M40 4 L62 70 L62 178 L18 178 L18 70 Z" fill="#fff" stroke="#5A6A99" stroke-width="2"/>
                <circle cx="40" cy="92" r="14" fill="#5BBFFF" stroke="#1A3A6A" stroke-width="2"/>
                <path d="M40 4 L34 22 L46 22 Z" fill="#FF1D4E"/>
              </svg>
            </div>
          </div>
        `;
        setCap('🌠 ¡Vuela por el espacio rumbo a la Luna!');
        setTimer(done, 3500);
      };

      const sceneMoonArrive = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,#1A0540 0%,#020611 80%);overflow:hidden">
            ${sceneHeader(7, '🌕 LLEGANDO A LA LUNA')}
            ${Array.from({ length: 80 }).map(() => {
              const x = Math.random() * 100;
              const y = Math.random() * 100;
              const sz = Math.random() * 2 + 0.6;
              return `<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;background:#fff;border-radius:50%;opacity:${0.5 + Math.random() * 0.5}"></div>`;
            }).join('')}
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:340px;height:340px;animation:f1iMoonZoom 2.4s cubic-bezier(.34,1.56,.64,1) forwards;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF7E6 0%,#E6DEC8 40%,#A89888 75%,#5A4838 100%);box-shadow:0 0 80px rgba(255,247,230,.6),inset -30px -30px 100px rgba(0,0,0,.45);overflow:hidden">
              <div style="position:absolute;top:25%;left:18%;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#8E7A66,#5A4838);box-shadow:inset 0 0 14px rgba(0,0,0,.4)"></div>
              <div style="position:absolute;top:50%;left:45%;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#8E7A66,#5A4838);box-shadow:inset 0 0 10px rgba(0,0,0,.4)"></div>
              <div style="position:absolute;top:65%;left:25%;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#8E7A66,#5A4838);box-shadow:inset 0 0 8px rgba(0,0,0,.4)"></div>
              <div style="position:absolute;top:30%;left:60%;width:50px;height:50px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#8E7A66,#5A4838);box-shadow:inset 0 0 12px rgba(0,0,0,.4)"></div>
              <div style="position:absolute;top:75%;left:60%;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#8E7A66,#5A4838);box-shadow:inset 0 0 8px rgba(0,0,0,.4)"></div>
            </div>
            <div style="position:absolute;top:35%;left:15%;width:50px;height:75px;animation:f1iMoonZoom 2.2s ease-out forwards">
              <svg viewBox="0 0 80 220" width="50" height="75">
                <path d="M40 4 L62 70 L62 178 L18 178 L18 70 Z" fill="#fff" stroke="#5A6A99" stroke-width="2"/>
                <circle cx="40" cy="92" r="14" fill="#5BBFFF"/>
                <path d="M40 4 L34 22 L46 22 Z" fill="#FF1D4E"/>
              </svg>
            </div>
            <div style="position:absolute;top:8%;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#FFE066,#FF8C2A);color:#3D1468;font-weight:900;font-size:18px;padding:8px 24px;border-radius:24px;box-shadow:0 6px 20px rgba(255,224,102,.5);border:3px solid #fff;letter-spacing:.08em">🌙 LA LUNA</div>
          </div>
        `;
        setCap('🌕 ¡Mira! ¡Llegamos a la Luna!');
        tone(659, 0.4, 'sine', 0.12);
        setTimer(() => { tone(784, 0.4, 'sine', 0.12); }, 600);
        setTimer(() => { tone(880, 0.4, 'sine', 0.12); }, 1200);
        setTimer(done, 3200);
      };

      const sceneFinal = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:linear-gradient(180deg,#080A1F 0%,#1A0540 50%,#2A0F60 100%);overflow:hidden">
            ${Array.from({ length: 60 }).map(() => {
              const x = Math.random() * 100;
              const y = Math.random() * 60;
              const sz = Math.random() * 2 + 0.5;
              return `<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;background:#fff;border-radius:50%;opacity:${0.5 + Math.random() * 0.5}"></div>`;
            }).join('')}
            <div style="position:absolute;top:14%;right:8%;width:70px;height:70px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#5BBFFF,#1A6CB4);box-shadow:0 0 24px rgba(91,191,255,.6)"></div>
            <div style="position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(180deg,#A89888 0%,#7E6E5A 50%,#5A4838 100%);border-top:3px solid #C5B19A">
              <div style="position:absolute;top:20%;left:10%;width:60px;height:30px;border-radius:50%;background:radial-gradient(ellipse,#5A4838,#3A2C18)"></div>
              <div style="position:absolute;top:50%;left:60%;width:80px;height:36px;border-radius:50%;background:radial-gradient(ellipse,#5A4838,#3A2C18)"></div>
              <div style="position:absolute;top:35%;left:80%;width:50px;height:24px;border-radius:50%;background:radial-gradient(ellipse,#5A4838,#3A2C18)"></div>
            </div>
            <div style="position:absolute;bottom:38%;left:50%;transform:translate(-50%,0);width:120px;height:140px;animation:f1iLandBounce 1.5s ease-out 1">
              <svg viewBox="0 0 120 140" width="120" height="140">
                <polygon points="60,10 100,50 100,90 20,90 20,50" fill="#fff" stroke="#5A6A99" stroke-width="3"/>
                <circle cx="60" cy="50" r="12" fill="#5BBFFF" stroke="#1A3A6A" stroke-width="2"/>
                <line x1="20" y1="90" x2="0" y2="135" stroke="#888" stroke-width="4"/>
                <line x1="100" y1="90" x2="120" y2="135" stroke="#888" stroke-width="4"/>
                <line x1="60" y1="90" x2="60" y2="135" stroke="#888" stroke-width="4"/>
                <rect x="-6" y="130" width="12" height="6" fill="#444"/>
                <rect x="54" y="130" width="12" height="6" fill="#444"/>
                <rect x="114" y="130" width="12" height="6" fill="#444"/>
                <line x1="100" y1="20" x2="100" y2="50" stroke="#888" stroke-width="2"/>
                <rect x="100" y="20" width="20" height="14" fill="#FF1D4E" stroke="#9B0023"/>
                <text x="60" y="75" text-anchor="middle" font-size="9" font-weight="900" fill="#1A3A6A">FEDOR</text>
              </svg>
            </div>
            <div style="position:absolute;bottom:30%;left:35%;font-size:64px;filter:drop-shadow(0 4px 12px rgba(0,0,0,.5));animation:f1iBob 1.6s ease-in-out infinite">🧑‍🚀</div>
            ${Array.from({ length: 30 }).map((_, i) => {
              const x = Math.random() * 100;
              const c = ['🌟', '⭐', '🎉', '✨'][i % 4];
              const d = 2 + Math.random() * 2;
              return `<div style="position:absolute;left:${x}%;top:-30px;font-size:${20 + Math.random() * 16}px;animation:f1iWelcomeRain ${d}s linear ${Math.random() * 1.5}s infinite;z-index:5">${c}</div>`;
            }).join('')}
            <div style="position:absolute;top:8%;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#F5C518,#FF8C2A,#FF1D4E);color:#fff;font-weight:900;font-size:28px;padding:14px 36px;border-radius:32px;box-shadow:0 12px 36px rgba(255,29,78,.55);border:4px solid #fff;font-family:'Baloo 2',sans-serif;text-shadow:0 2px 6px rgba(0,0,0,.4);animation:f1iZoom .8s cubic-bezier(.34,1.56,.64,1);max-width:90%;text-align:center">🚀 ¡Bienvenido a 1° Grado! 🌙</div>
            <div style="position:absolute;top:24%;left:50%;transform:translateX(-50%);background:rgba(255,255,255,.95);color:#3D1468;font-weight:900;font-size:16px;padding:8px 22px;border-radius:24px;border:2px solid #FFE066;animation:f1iZoom 1s .3s cubic-bezier(.34,1.56,.64,1) both">Tu aventura comienza ahora ✨</div>
          </div>
        `;
        setCap('');
        tone(1046, 0.5, 'sine', 0.15);
        setTimer(() => { tone(1318, 0.5, 'sine', 0.15); }, 300);
        setTimer(() => { tone(1568, 0.7, 'sine', 0.18); }, 600);
        setTimer(done, 3800);
      };

      // Play Grade 1 sequence
      const scenes = [sceneLab, sceneWalk, sceneRamp, sceneCount, sceneLiftoff, sceneSpace, sceneMoonArrive, sceneFinal];
      let i = 0;
      const next = () => {
        if (i >= scenes.length) {
          handleClose();
          return;
        }
        scenes[i++](next);
      };
      next();
    }

    // ----------------------------------------------------
    // SECOND GRADE MOUNT & SCENES
    // ----------------------------------------------------
    if (isGrade2) {
      const sceneHeader = (n: number, title: string, color?: string) => {
        return `
          <div style="position:absolute;top:14px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.65);color:#FFD66B;font-family:'Baloo 2',sans-serif;font-size:11px;font-weight:900;padding:5px 14px;border-radius:14px;letter-spacing:.15em;border:1.5px solid ${color || '#FFD66B'};z-index:10">ESCENA ${n} / 10</div>
          <div style="position:absolute;top:50px;left:50%;transform:translateX(-50%);color:${color || '#FFD66B'};font-family:'Baloo 2',sans-serif;font-size:24px;font-weight:900;text-shadow:0 4px 18px rgba(0,0,0,.9);text-align:center;width:95%;z-index:10">${title}</div>
        `;
      };

      const starField = (n?: number) => {
        const count = n || 80;
        let out = '';
        for (let idx = 0; idx < count; idx++) {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const sz = Math.random() * 1.8 + 0.3;
          out += `<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;background:#fff;border-radius:50%;opacity:${0.3 + Math.random() * 0.6}"></div>`;
        }
        return out;
      };

      const scene1 = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,#1A0540,#000);display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden">
            ${starField(180)}
            <div style="width:180px;height:180px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#F5C518,#FF8C2A 50%,#A30041 85%);box-shadow:0 0 100px rgba(245,197,24,.8);display:flex;align-items:center;justify-content:center;font-size:110px;border:5px solid #FFD66B;animation:introZoom 1.4s cubic-bezier(.34,1.56,.64,1);position:relative;z-index:2">🚀</div>
            <div style="margin-top:1.4rem;color:#FFD66B;font-family:'Baloo 2',sans-serif;font-size:44px;font-weight:900;text-align:center;padding:0 1rem;-webkit-text-stroke:2px #fff;animation:introZoom 1.4s .3s cubic-bezier(.34,1.56,.64,1) both;position:relative;z-index:2">MISIÓN FEDOR</div>
            <div style="color:#fff;font-size:18px;font-weight:900;letter-spacing:.3em;margin-top:.5rem;animation:introZoom 1.4s .6s cubic-bezier(.34,1.56,.64,1) both;position:relative;z-index:2">🌙 LUNA → ☿ MERCURIO</div>
          </div>
        `;
        setCap('');
        tone(523, 0.5, 'sine', 0.15);
        setTimer(() => { tone(659, 0.5, 'sine', 0.15); }, 400);
        setTimer(() => { tone(784, 0.7, 'sine', 0.18); }, 800);
        setTimer(done, 5500);
      };

      const scene2 = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 100%,#1A0A40 0%,#020611 70%);overflow:hidden">
            ${starField(120)}
            ${sceneHeader(2, '🌙 EN LA LUNA', '#FFFAEB')}
            <div style="position:absolute;top:14%;right:8%;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#7DCFFF,#1E6FB8 40%,#0A3A6A 75%);box-shadow:0 0 40px rgba(91,191,255,.5)">
              <div style="position:absolute;top:25%;left:18%;width:38%;height:24%;background:radial-gradient(ellipse,#3D8B3E,transparent 70%);border-radius:50%;opacity:.8"></div>
            </div>
            <div style="position:absolute;bottom:0;left:0;right:0;height:55%;background:linear-gradient(180deg,#9C9078 0%,#5A4A35 70%,#3A2E20 100%)">
              ${Array.from({ length: 15 }).map(() => {
                const x = Math.random() * 100;
                const y = 8 + Math.random() * 70;
                const sz = 15 + Math.random() * 50;
                return `<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz * 0.55}px;background:radial-gradient(ellipse,#3D2D1A,#5A4A30 70%);border-radius:50%;opacity:.7"></div>`;
              }).join('')}
            </div>
            <div style="position:absolute;bottom:28%;right:6%;z-index:4">
              <svg viewBox="0 0 180 140" width="160" height="120">
                <defs>
                  <linearGradient id="domeG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#E0E8F0"/><stop offset="1" stop-color="#7A8A9C"/>
                  </linearGradient>
                </defs>
                <path d="M30 110 Q30 50 90 50 Q150 50 150 110 Z" fill="url(#domeG)" stroke="#3A4A5E" stroke-width="2.5"/>
                <circle cx="70" cy="80" r="9" fill="#FFE066"/><circle cx="110" cy="80" r="9" fill="#FFE066"/>
                <rect x="80" y="95" width="20" height="18" fill="#3A4A5E"/>
                <line x1="90" y1="50" x2="90" y2="14" stroke="#666" stroke-width="2"/>
                <circle cx="90" cy="12" r="6" fill="#FF1D4E"></circle>
                <text x="90" y="135" text-anchor="middle" font-size="10" font-weight="900" fill="#1A0A3C" font-family="'Baloo 2',sans-serif">BASE LUNAR</text>
              </svg>
            </div>
            <div style="position:absolute;bottom:28%;left:18%;width:70px;height:120px;z-index:5">
              <div style="position:absolute;bottom:0;left:0;width:5px;height:120px;background:linear-gradient(180deg,#888,#444)"></div>
              <div style="position:absolute;top:6px;left:5px;width:64px;height:44px;background:linear-gradient(135deg,#FF1D4E,#F5C518);border:2px solid #fff;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-direction:column;animation:flagWave 2.4s ease-in-out infinite;transform-origin:left center">
                <div style="font-size:16px">🚀</div>
                <div style="font-size:7px;font-weight:900;color:#fff;text-align:center;line-height:1.05;padding:1px">MATEMÁTICAS<br/>DE FEDOR</div>
              </div>
            </div>
            <div style="position:absolute;bottom:30%;left:38%;width:100px;height:180px;z-index:6;animation:introBob 2.4s ease-in-out infinite;filter:drop-shadow(0 8px 16px rgba(0,0,0,.7))">
              <svg viewBox="0 0 110 200" width="100" height="180">
                <defs>
                  <radialGradient id="helmG" cx=".4" cy=".4">
                    <stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#A8DFFF"/><stop offset="1" stop-color="#0A2E5A"/>
                  </radialGradient>
                  <linearGradient id="suitG" x1="0" x2="1">
                    <stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#8A9AAE"/>
                  </linearGradient>
                </defs>
                <rect x="20" y="65" width="70" height="60" rx="6" fill="#6A7A8E" stroke="#333" stroke-width="2"/>
                <path d="M30 60 L80 60 Q90 60 90 75 L90 145 Q90 155 80 155 L70 155 L70 195 L55 195 L55 165 L45 165 L45 195 L30 195 L30 155 L25 155 Q15 155 15 145 L15 75 Q15 60 30 60 Z" fill="url(#suitG)" stroke="#333" stroke-width="2.5"/>
                <rect x="40" y="80" width="30" height="22" rx="3" fill="#1A0A3C" stroke="#5BBFFF" stroke-width="1.5"/>
                <circle cx="46" cy="86" r="2.5" fill="#FF1D4E"/><circle cx="55" cy="86" r="2.5" fill="#F5C518"/><circle cx="64" cy="86" r="2.5" fill="#16876A"/>
                <rect x="6" y="78" width="14" height="55" rx="6" fill="url(#suitG)" stroke="#333" stroke-width="2"/>
                <rect x="90" y="78" width="14" height="55" rx="6" fill="url(#suitG)" stroke="#333" stroke-width="2"/>
                <circle cx="13" cy="138" r="9" fill="#666"/><circle cx="97" cy="138" r="9" fill="#666"/>
                <rect x="28" y="190" width="22" height="10" rx="3" fill="#222"/><rect x="60" y="190" width="22" height="10" rx="3" fill="#222"/>
                <circle cx="55" cy="38" r="32" fill="url(#helmG)" stroke="#333" stroke-width="3"/>
                <ellipse cx="45" cy="28" rx="10" ry="14" fill="#fff" opacity=".5"/>
                <circle cx="55" cy="45" r="12" fill="#FDD8B8" opacity=".7"/>
                <circle cx="51" cy="42" r="1.5" fill="#222"/><circle cx="59" cy="42" r="1.5" fill="#222"/>
                <rect x="42" y="106" width="26" height="14" rx="2" fill="#F5C518" stroke="#7A3200"/>
                <text x="55" y="116" text-anchor="middle" font-size="8" font-weight="900" fill="#7A3200" font-family="'Baloo 2',sans-serif">FEDOR</text>
              </svg>
            </div>
          </div>
        `;
        setCap('🌙 Estamos en la Luna, junto a la bandera y la base lunar.');
        chord([440, 523, 659, 784], 0.5);
        setTimer(done, 6500);
      };

      const scene3 = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 100%,#1A0A40 0%,#020611 70%);overflow:hidden">
            ${starField(80)}
            ${sceneHeader(3, '🚶 CAMINO A LA NAVE', '#FFFAEB')}
            <div style="position:absolute;bottom:0;left:0;right:0;height:55%;background:linear-gradient(180deg,#9C9078 0%,#5A4A35 70%,#3A2E20 100%)">
              ${Array.from({ length: 10 }).map(() => {
                const x = Math.random() * 100;
                const y = 8 + Math.random() * 70;
                const sz = 15 + Math.random() * 40;
                return `<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz * 0.55}px;background:radial-gradient(ellipse,#3D2D1A,#5A4A30 70%);border-radius:50%;opacity:.6"></div>`;
              }).join('')}
            </div>
            <div style="position:absolute;bottom:28%;right:6%;width:100px;height:200px;z-index:4">
              <svg viewBox="0 0 110 230" width="100" height="200">
                <defs>
                  <linearGradient id="r3b" x1="0" x2="1">
                    <stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#5A6E9C"/>
                  </linearGradient>
                </defs>
                <path d="M55 6 L92 80 L92 195 L18 195 L18 80 Z" fill="url(#r3b)" stroke="#1A2A4E" stroke-width="2.5"/>
                <circle cx="55" cy="100" r="15" fill="#5BBFFF" stroke="#1A3A6A" stroke-width="2"/>
                <path d="M18 160 L4 220 L18 195 Z" fill="#FF6F8A"/><path d="M92 160 L106 220 L92 195 Z" fill="#FF6F8A"/>
                <path d="M55 6 L46 28 L64 28 Z" fill="#FF1D4E"/>
                <rect x="18" y="195" width="74" height="14" fill="#666"/>
                <line x1="18" y1="209" x2="2" y2="230" stroke="#888" stroke-width="3"/>
                <line x1="92" y1="209" x2="108" y2="230" stroke="#888" stroke-width="3"/>
                <line x1="55" y1="209" x2="55" y2="230" stroke="#888" stroke-width="3"/>
                <text x="55" y="160" text-anchor="middle" font-size="10" font-weight="900" fill="#1A3A6A">FEDOR</text>
              </svg>
            </div>
            <div style="position:absolute;bottom:30%;width:70px;height:130px;z-index:6;animation:astroToShip 5s ease-in-out forwards;filter:drop-shadow(0 8px 14px rgba(0,0,0,.7))">
              <svg viewBox="0 0 110 200" width="70" height="130">
                <rect x="20" y="65" width="70" height="60" rx="6" fill="#6A7A8E" stroke="#333" stroke-width="2"/>
                <path d="M30 60 L80 60 Q90 60 90 75 L90 145 Q90 155 80 155 L70 155 L70 195 L55 195 L55 165 L45 165 L45 195 L30 195 L30 155 L25 155 Q15 155 15 145 L15 75 Q15 60 30 60 Z" fill="#E0E8F0" stroke="#333" stroke-width="2.5"/>
                <circle cx="55" cy="38" r="32" fill="#A8DFFF" stroke="#333" stroke-width="3"/><circle cx="55" cy="45" r="12" fill="#FDD8B8" opacity=".7"/>
              </svg>
            </div>
          </div>
        `;
        setCap('Fedor camina hacia su nave espacial...');
        tone(440, 0.4, 'triangle', 0.1);
        setTimer(() => { tone(523, 0.4, 'triangle', 0.1); }, 700);
        setTimer(done, 5500);
      };

      const scene4 = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,#1B2A5B,#080A1F);overflow:hidden">
            ${sceneHeader(4, '🚦 CONTEO REGRESIVO', '#F5C518')}
            <div style="position:absolute;top:18%;left:50%;transform:translateX(-50%);width:70%;max-width:380px;aspect-ratio:2/1;background:linear-gradient(180deg,#020611 0%,#9C9078 70%,#5A4A35 100%);border-radius:50% 50% 14px 14px;border:5px solid #5BBFFF;box-shadow:0 0 30px rgba(91,191,255,.5)">
              <div style="position:absolute;top:20%;left:20%;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#7DCFFF,#1E6FB8)"></div>
            </div>
            <div id="introCounter" style="position:absolute;top:60%;left:50%;transform:translate(-50%,-50%);font-size:180px;font-weight:900;color:#F5C518;text-shadow:0 8px 50px rgba(245,197,24,.9);font-family:'Baloo 2',sans-serif;-webkit-text-stroke:4px #fff;z-index:5"></div>
          </div>
        `;
        setCap('"5... 4... 3... 2... 1..."');
        const counter = stage.querySelector('#introCounter') as HTMLDivElement;
        const seq = ['5', '4', '3', '2', '1', '¡DESPEGUE!'];
        seq.forEach((n, i) => {
          setTimer(() => {
            if (!counter) return;
            counter.style.animation = 'none';
            void counter.offsetHeight;
            counter.textContent = n;
            counter.style.animation = 'introCount 1s cubic-bezier(.34,1.56,.64,1)';
            counter.style.fontSize = (i === 5 ? '90px' : '180px');
            if (i < 5) tone(880, 0.25, 'square', 0.16);
            else { tone(1046, 0.5, 'sine', 0.2); rumble(); }
          }, i * 900);
        });
        setTimer(done, 6500);
      };

      const scene5 = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 100%,#1A0A40,#020611 80%);overflow:hidden;animation:shake .1s linear infinite">
            ${starField(40)}
            ${sceneHeader(5, '🚀 ¡DESPEGUE DE LA LUNA!', '#FF1D4E')}
            <div style="position:absolute;bottom:0;left:0;right:0;height:30%;background:linear-gradient(180deg,#9C9078,#5A4A35 70%,#3A2E20)">
              ${Array.from({ length: 8 }).map(() => {
                const x = Math.random() * 100;
                const y = 20 + Math.random() * 60;
                const sz = 20 + Math.random() * 40;
                return `<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz * 0.55}px;background:radial-gradient(ellipse,#3D2D1A,#5A4A30 70%);border-radius:50%;opacity:.6"></div>`;
              }).join('')}
            </div>
            ${Array.from({ length: 12 }).map((_, i) => {
              const dx = (i - 6) * 30;
              return `<div style="position:absolute;bottom:${22 + Math.random() * 30}%;left:calc(50% + ${dx}px);width:${80 + Math.random() * 60}px;height:${80 + Math.random() * 60}px;background:radial-gradient(circle,rgba(220,200,180,.95),rgba(180,160,140,.5),transparent);border-radius:50%;animation:introSmoke ${2.8 + Math.random()}s ease-out ${i * 0.1}s forwards"></div>`;
            }).join('')}
            <div style="position:absolute;bottom:28%;left:50%;transform:translateX(-50%);width:100px;height:300px;animation:liftoffMega 4.8s cubic-bezier(.4,.0,.4,1) forwards;z-index:5">
              <div style="position:absolute;bottom:-60px;left:50%;transform:translateX(-50%);width:100px;height:160px;animation:introFlame .08s ease-in-out infinite">
                <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:80px;height:150px;background:radial-gradient(ellipse at 50% 30%,#FFEE99,#FF8800 40%,#FF1D4E 70%,transparent 100%);border-radius:50% 50% 30% 30%;filter:blur(3px)"></div>
              </div>
              <svg viewBox="0 0 100 300" width="100" height="300">
                <path d="M50 6 L80 105 L80 250 L20 250 L20 105 Z" fill="#fff" stroke="#1A2A4E" stroke-width="2.5"/>
                <circle cx="50" cy="125" r="16" fill="#5BBFFF" stroke="#0A2E5A" stroke-width="2"/>
                <path d="M50 6 L40 28 L60 28 Z" fill="#FF1D4E"/>
                <path d="M20 200 L4 270 L20 250 Z" fill="#FF6F8A"/><path d="M80 200 L96 270 L80 250 Z" fill="#FF6F8A"/>
              </svg>
            </div>
          </div>
        `;
        setCap('¡La nave se eleva de la superficie lunar!');
        rumble();
        setTimer(rumble, 400);
        setTimer(rumble, 900);
        setTimer(rumble, 1400);
        chord([130, 165, 196], 0.5);
        setTimer(done, 6000);
      };

      const scene6 = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,#1A0540,#020611);overflow:hidden">
            ${starField(120)}
            ${sceneHeader(6, '🌙 LA LUNA QUEDA ATRÁS', '#FFFAEB')}
            <div style="position:absolute;bottom:5%;left:50%;transform:translate(-50%,0);width:260px;height:260px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFFAEB 0%,#A89880 60%,#5A4A30 90%);box-shadow:0 0 70px rgba(255,250,235,.6),inset -30px -30px 60px rgba(0,0,0,.5);animation:earthShrink 5s ease-in forwards;transform-origin:50% 100%">
              ${Array.from({ length: 12 }).map(() => {
                const x = 10 + Math.random() * 80;
                const y = 10 + Math.random() * 80;
                const sz = 10 + Math.random() * 30;
                return `<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz * 0.7}px;background:radial-gradient(ellipse,#5A4A30,transparent);border-radius:50%;opacity:.5"></div>`;
              }).join('')}
            </div>
            <div style="position:absolute;top:30%;left:50%;transform:translate(-50%,-50%);width:70px;height:190px;animation:introBob .5s ease-in-out infinite;z-index:5">
              <div style="position:absolute;bottom:-25px;left:50%;transform:translateX(-50%);width:50px;height:80px;background:radial-gradient(ellipse,#fff,#FF8800 80%,transparent);border-radius:50% 50% 30% 30%;filter:blur(2px);animation:introFlame .1s linear infinite"></div>
              <svg viewBox="0 0 80 220" width="70" height="190">
                <path d="M40 4 L62 70 L62 178 L18 178 L18 70 Z" fill="#fff" stroke="#5A6A99" stroke-width="2"/>
                <circle cx="40" cy="92" r="14" fill="#5BBFFF" stroke="#1A3A6A" stroke-width="2"/>
                <path d="M40 4 L34 22 L46 22 Z" fill="#FF1D4E"/>
              </svg>
            </div>
          </div>
        `;
        setCap('Próxima parada: ¡Mercurio!');
        chord([392, 494, 587], 0.5);
        setTimer(done, 5500);
      };

      const scene7 = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,#0A1B40,#020611);overflow:hidden">
            ${Array.from({ length: 80 }).map(() => {
              const x = Math.random() * 100;
              const w = Math.random() * 3 + 1;
              const h = Math.random() * 120 + 30;
              const d = Math.random() * 1.6 + 0.5;
              return `<div style="position:absolute;left:${x}%;top:-10%;width:${w}px;height:${h}px;background:linear-gradient(180deg,transparent,#fff,transparent);border-radius:3px;animation:streakStar ${d}s linear ${Math.random() * 2}s infinite"></div>`;
            }).join('')}
            ${sceneHeader(7, '🌠 VIAJE INTERPLANETARIO', '#5BBFFF')}
            <div style="position:absolute;top:55%;left:50%;transform:translate(-50%,-50%);width:90px;height:220px;animation:introBob .4s ease-in-out infinite;z-index:5">
              <div style="position:absolute;bottom:-30px;left:50%;transform:translateX(-50%);width:60px;height:100px;background:radial-gradient(ellipse,#fff,#FF8800 80%,transparent);border-radius:50% 50% 30% 30%;filter:blur(2.5px);animation:introFlame .1s linear infinite"></div>
              <svg viewBox="0 0 80 220" width="90" height="220">
                <path d="M40 4 L62 70 L62 178 L18 178 L18 70 Z" fill="#fff" stroke="#5A6A99" stroke-width="2"/>
                <circle cx="40" cy="92" r="14" fill="#5BBFFF" stroke="#1A3A6A" stroke-width="2"/>
                <path d="M40 4 L34 22 L46 22 Z" fill="#FF1D4E"/>
              </svg>
            </div>
            <div style="position:absolute;bottom:10%;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.7);border:3px solid #5BBFFF;color:#5BBFFF;font-family:monospace;font-weight:900;padding:10px 20px;border-radius:14px;text-align:center">
              <div style="font-size:11px;letter-spacing:.2em">⚡ VELOCIDAD</div>
              <div style="font-size:24px"><span id="introVel">0</span> km/s</div>
            </div>
          </div>
        `;
        const velEl = stage.querySelector('#introVel') as HTMLSpanElement;
        let v = 0;
        const iv = setInterval(() => {
          v += 5;
          if (velEl) velEl.textContent = String(v);
          if (v > 290) clearInterval(iv);
        }, 100);
        setTimer(() => {
          try { clearInterval(iv); } catch (e) {}
        }, 5400);
        setCap('Cruzando el sistema solar...');
        chord([262, 330, 392], 0.5);
        setTimer(done, 5500);
      };

      const scene8 = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 80% 30%,#FF8C2A 0%,#9B3500 25%,#3D1054 60%,#020611 95%);overflow:hidden">
            ${starField(50)}
            ${sceneHeader(8, '☿ ¡MERCURIO A LA VISTA!', '#FFB066')}
            <div style="position:absolute;top:8%;right:5%;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,#FFEE99,#FF9043 40%,#FF1D4E 80%);box-shadow:0 0 120px rgba(255,200,80,1),0 0 200px rgba(255,140,42,.8);z-index:3"></div>
            <div style="position:absolute;top:55%;left:50%;transform:translate(-50%,-50%) scale(.1);width:320px;height:320px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#D4B898 0%,#A89274 25%,#7A5A38 55%,#5A4028 80%,#3A2A1A 100%);box-shadow:0 0 80px rgba(255,180,100,.6),inset -35px -35px 80px rgba(0,0,0,.6);animation:moonZoomIn 5s ease-in forwards;z-index:4">
              ${Array.from({ length: 24 }).map(() => {
                const x = 8 + Math.random() * 84;
                const y = 8 + Math.random() * 84;
                const sz = 8 + Math.random() * 40;
                return `<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz * 0.65}px;background:radial-gradient(ellipse,#2A1A0A,#5A4028 80%);border-radius:50%;opacity:${0.6 + Math.random() * 0.3}"></div>`;
              }).join('')}
            </div>
            <div style="position:absolute;bottom:8%;right:8%;background:rgba(0,0,0,.7);border:2px solid #FFB066;color:#FFB066;font-family:monospace;font-size:11px;font-weight:900;padding:8px 14px;border-radius:10px;z-index:10;line-height:1.5">
              <div style="font-size:13px;color:#FFD66B">☿ MERCURIO</div>
              PLANETA + CERCANO AL SOL<br>TEMP: 430°C ☀️<br>DÍA: 59 días
            </div>
          </div>
        `;
        setCap('☿ Mercurio: el planeta más cercano al Sol.');
        chord([523, 659, 784, 1046], 0.5);
        setTimer(done, 6500);
      };

      const scene9 = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,#FF8C2A 0%,#9B3500 30%,#3D1054 70%,#020611 100%);overflow:hidden">
            ${starField(30)}
            ${sceneHeader(9, '🛬 ATERRIZAJE EN MERCURIO', '#FFD66B')}
            <div style="position:absolute;top:5%;right:6%;width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,#FFEE99,#FF9043);box-shadow:0 0 100px rgba(255,200,80,.95)"></div>
            <div style="position:absolute;bottom:0;left:0;right:0;height:55%;background:linear-gradient(180deg,#A89274 0%,#7A5A38 30%,#5A4028 60%,#3A2A1A 100%)">
              ${Array.from({ length: 14 }).map(() => {
                const x = Math.random() * 100;
                const y = 8 + Math.random() * 75;
                const sz = 15 + Math.random() * 50;
                return `<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz * 0.55}px;background:radial-gradient(ellipse,#2A1A0A,#5A4028 80%);border-radius:50%;opacity:.7"></div>`;
              }).join('')}
            </div>
            <div style="position:absolute;bottom:32%;left:50%;transform:translateX(-50%);width:120px;height:200px;z-index:5;animation:introZoom 1.5s cubic-bezier(.34,1.56,.64,1);filter:drop-shadow(0 8px 16px rgba(0,0,0,.6))">
              <svg viewBox="0 0 120 220" width="120" height="200">
                <path d="M60 8 L96 90 L96 180 L24 180 L24 90 Z" fill="#fff" stroke="#1A2A4E" stroke-width="2.5"/>
                <circle cx="60" cy="110" r="16" fill="#5BBFFF" stroke="#0A2E5A" stroke-width="2.5"/>
                <path d="M60 8 L48 32 L72 32 Z" fill="#FF1D4E"/>
                <path d="M24 145 L4 200 L24 180 Z" fill="#FF6F8A"/><path d="M96 145 L116 200 L96 180 Z" fill="#FF6F8A"/>
                <rect x="24" y="180" width="72" height="14" fill="#666"/>
                <line x1="24" y1="194" x2="4" y2="220" stroke="#888" stroke-width="3.5"/>
                <line x1="96" y1="194" x2="116" y2="220" stroke="#888" stroke-width="3.5"/>
                <line x1="60" y1="194" x2="60" y2="220" stroke="#888" stroke-width="3.5"/>
                <text x="60" y="170" text-anchor="middle" font-size="11" font-weight="900" fill="#1A3A6A">FEDOR</text>
              </svg>
            </div>
          </div>
        `;
        setCap('🛬 ¡La nave aterriza en Mercurio!');
        chord([523, 659, 784, 1046, 1318], 0.6);
        setTimer(done, 6500);
      };

      const sceneFinal2 = (done: () => void) => {
        clearStage();
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,#1B2A5B,#020611);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;overflow:hidden">
            ${starField(140)}
            <div style="font-size:130px;animation:introZoom 1.2s cubic-bezier(.34,1.56,.64,1);filter:drop-shadow(0 0 40px rgba(245,197,24,.9));position:relative;z-index:2">🚀</div>
            <div style="font-size:44px;font-weight:900;color:#FFD66B;text-shadow:0 6px 30px rgba(245,197,24,.7);margin-top:1rem;animation:introZoom 1.2s .25s cubic-bezier(.34,1.56,.64,1) both;font-family:'Baloo 2',sans-serif;-webkit-text-stroke:2.5px #fff;padding:0 1rem;position:relative;z-index:2">¡MATEMÁTICAS DE FEDOR!</div>
            <div style="font-size:20px;font-weight:900;color:#fff;margin-top:.8rem;animation:introZoom 1.2s .5s cubic-bezier(.34,1.56,.64,1) both;position:relative;z-index:2">Libro Completo de Grado 2°</div>
          </div>
        `;
        setCap('');
        chord([1046, 1318, 1568, 2093], 0.6);
        setTimer(done, 5500);
      };

      // Play Grade 2 sequence
      const scenes = [scene1, scene2, scene3, scene4, scene5, scene6, scene7, scene8, scene9, sceneFinal2];
      let i = 0;
      const next = () => {
        if (i >= scenes.length) {
          handleClose();
          return;
        }
        scenes[i++](next);
      };
      next();
    }

    return () => {
      clearAllTimers();
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
  }, [isGrade1, isGrade2, onClose]);

  // For fallback (grades other than 1 and 2), use the 3D cinematic
  if (!isGrade1 && !isGrade2) {
    return <LaunchIntro3D onClose={onClose} />;
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 99999, 
        background: '#000', 
        overflow: 'hidden' 
      }} 
    />
  );
}

// ----------------------------------------------------
// 3D FALLBACK FOR OTHER GRADES
// ----------------------------------------------------
function LaunchIntro3D({ onClose }: { onClose: () => void }) {
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
