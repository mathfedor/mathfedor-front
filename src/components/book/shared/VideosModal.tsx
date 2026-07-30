'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UNITS } from '../data/unitsData';
import narrationsData from '../data/narrationsData.json';

interface VideosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type NarrationsType = Record<string, Array<{ t: number; text: string }>>;
const NARRATIONS: NarrationsType = narrationsData as NarrationsType;

export default function VideosModal({ isOpen, onClose }: VideosModalProps) {
  const [unitIdx, setUnitIdx] = useState(0);
  const [topicIdx, setTopicIdx] = useState(0);
  const [level, setLevel] = useState(1);

  const [videosMap, setVideosMap] = useState<Record<string, string> | null>(null);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const conceptVideoRef = useRef<HTMLVideoElement>(null);
  const exampleVideoRef = useRef<HTMLVideoElement>(null);

  // Dynamic video dictionary lazy loader
  useEffect(() => {
    if (isOpen && !videosMap && !loadingVideos) {
      setLoadingVideos(true);
      import('../data/videosData.json')
        .then((mod) => {
          setVideosMap((mod.default || mod) as Record<string, string>);
        })
        .catch((err) => {
          console.error('Error loading videosData.json:', err);
        })
        .finally(() => {
          setLoadingVideos(false);
        });
    }
  }, [isOpen, videosMap, loadingVideos]);

  const currentUnit = UNITS[unitIdx] || UNITS[0];
  const currentTopics = currentUnit.topics;
  const currentTopic = currentTopics[topicIdx] || currentTopics[0];

  const topicId = currentTopic ? currentTopic[0] : 'add_conteo';
  const topicName = currentTopic ? currentTopic[1] : 'Conteo';
  const topicIcon = currentTopic ? currentTopic[2] : '🔢';

  const videoKeyConcept = `${topicId}_n${level}_v1`;
  const videoKeyExample = `${topicId}_n${level}_v2`;

  const video1Base64 = videosMap ? videosMap[videoKeyConcept] : null;
  const video2Base64 = videosMap ? videosMap[videoKeyExample] : null;

  // Total videos count for active unit
  const totalVideosUnit = currentTopics.length * 5 * 2;

  // TTS Speech Helper for narration
  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES';
      u.rate = 0.95;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    } catch (e) {
      // ignore TTS error
    }
  }, []);

  // Synchronize narration with video playback
  const setupVideoNarration = useCallback(
    (videoEl: HTMLVideoElement | null, narrationKey: string) => {
      if (!videoEl) return;
      const narr = NARRATIONS[narrationKey];
      if (!narr || narr.length === 0) return;

      let timers: NodeJS.Timeout[] = [];

      const handlePlay = () => {
        timers.forEach(clearTimeout);
        timers = [];
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        narr.forEach((seg) => {
          const t = setTimeout(() => {
            if (!videoEl.paused) speakText(seg.text);
          }, seg.t * 1000);
          timers.push(t);
        });
      };

      const handlePauseOrEnd = () => {
        timers.forEach(clearTimeout);
        timers = [];
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };

      videoEl.addEventListener('play', handlePlay);
      videoEl.addEventListener('pause', handlePauseOrEnd);
      videoEl.addEventListener('ended', handlePauseOrEnd);

      return () => {
        videoEl.removeEventListener('play', handlePlay);
        videoEl.removeEventListener('pause', handlePauseOrEnd);
        videoEl.removeEventListener('ended', handlePauseOrEnd);
        timers.forEach(clearTimeout);
      };
    },
    [speakText]
  );

  useEffect(() => {
    const cleanup1 = setupVideoNarration(conceptVideoRef.current, videoKeyConcept);
    const cleanup2 = setupVideoNarration(exampleVideoRef.current, videoKeyExample);
    return () => {
      if (cleanup1) cleanup1();
      if (cleanup2) cleanup2();
    };
  }, [setupVideoNarration, videoKeyConcept, videoKeyExample, video1Base64, video2Base64]);

  // Prev / Next Navigation Handlers
  const handlePrev = useCallback(() => {
    if (level > 1) {
      setLevel((prev) => prev - 1);
    } else if (topicIdx > 0) {
      setTopicIdx((prev) => prev - 1);
      setLevel(5);
    }
  }, [level, topicIdx]);

  const handleNext = useCallback(() => {
    if (level < 5) {
      setLevel((prev) => prev + 1);
    } else if (topicIdx < currentTopics.length - 1) {
      setTopicIdx((prev) => prev + 1);
      setLevel(1);
    }
  }, [level, topicIdx, currentTopics.length]);

  // Keyboard Shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setLevel((prev) => Math.max(1, prev - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setLevel((prev) => Math.min(5, prev + 1));
      } else if (e.key === ' ') {
        e.preventDefault();
        const v1 = conceptVideoRef.current;
        if (v1) {
          if (v1.paused) v1.play();
          else v1.pause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen) return null;

  const isPrevDisabled = topicIdx === 0 && level === 1;
  const isNextDisabled = topicIdx === currentTopics.length - 1 && level === 5;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#0E0830]/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-[32px] p-5 sm:p-7 md:p-9 shadow-[0_24px_64px_rgba(0,0,0,0.5)] min-h-[85vh] max-h-[96vh] flex flex-col justify-between overflow-y-auto select-none font-nunito border-2 border-[#C5BFEE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#FEE2E8] hover:bg-pink-200 text-[#A30041] font-black text-xl transition-transform active:scale-95 cursor-pointer z-10 shadow-sm"
          aria-label="Cerrar"
        >
          ×
        </button>

        {/* Title & Subtitle */}
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-[#3D1468] font-baloo flex items-center justify-center gap-2">
            <span>🎬</span> Videos del Libro
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#7A7299] mt-0.5">
            {currentTopics.length} temas × 5 niveles × 2 videos = {totalVideosUnit} videos
          </p>
        </div>

        {/* Unit Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {UNITS.map((u, i) => {
            const isActive = i === unitIdx;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  setUnitIdx(i);
                  setTopicIdx(0);
                  setLevel(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border-2 ${
                  isActive
                    ? 'bg-[#7B2FBE] text-white border-[#7B2FBE] shadow-md scale-105'
                    : 'bg-white text-[#3D1468] border-[#C5BFEE] hover:bg-[#F0F4FF]'
                }`}
              >
                {u.name}
              </button>
            );
          })}
        </div>

        {/* Topic Selector Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mb-4">
          {currentTopics.map((t, i) => {
            const isActive = i === topicIdx;
            const hasAudioIcon = t[0].includes('probs');
            return (
              <button
                key={t[0]}
                type="button"
                onClick={() => setTopicIdx(i)}
                className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-2xl border-2 transition-all cursor-pointer min-h-[82px] ${
                  isActive
                    ? 'bg-[#7B2FBE] text-white border-[#7B2FBE] shadow-md scale-[1.02]'
                    : 'bg-[#F0F4FF] text-[#3D1468] border-[#C5BFEE] hover:border-[#7B2FBE] hover:-translate-y-0.5'
                }`}
              >
                <span className="text-2xl mb-1">{t[2]}</span>
                <span
                  className={`text-xs font-black text-center leading-snug ${
                    isActive ? 'text-white' : 'text-[#3D1468]'
                  }`}
                >
                  {t[1]}
                </span>
                {hasAudioIcon && (
                  <span className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-[#00B4D8] text-white text-[11px] flex items-center justify-center shadow">
                    🔊
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Level Selector Pills */}
        <div className="grid grid-cols-5 gap-2.5 mb-4">
          {[1, 2, 3, 4, 5].map((lvlNum) => {
            const isActive = lvlNum === level;
            return (
              <button
                key={lvlNum}
                type="button"
                onClick={() => setLevel(lvlNum)}
                className={`py-1.5 rounded-full text-xs sm:text-sm font-black border-2 transition-all cursor-pointer text-center ${
                  isActive
                    ? 'bg-[#7B2FBE] text-white border-[#7B2FBE] shadow-sm'
                    : 'bg-white text-[#3D1468] border-[#C5BFEE] hover:bg-[#F0F4FF]'
                }`}
              >
                N{lvlNum}
              </button>
            );
          })}
        </div>

        {/* Video Cards Grid */}
        {loadingVideos ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#7B2FBE] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-bold text-[#3D1468]">Cargando videos de la lección...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Video 1: Concepto */}
            <div className="bg-[#FFF5D6] border-2 border-[#F0D58C] rounded-2xl p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-black text-[#7A4400] flex items-center gap-1.5">
                  <span className="text-base">ℹ️</span> Concepto
                </h4>
                <span className="bg-[#7B2FBE] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black">
                  Video 1
                </span>
              </div>
              {video1Base64 ? (
                <video
                  ref={conceptVideoRef}
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full rounded-xl bg-black aspect-video object-contain shadow-inner"
                  src={`data:video/mp4;base64,${video1Base64}`}
                />
              ) : (
                <div className="w-full aspect-video bg-amber-200/50 rounded-xl flex items-center justify-center text-xs font-bold text-amber-900">
                  Video 1 no disponible
                </div>
              )}
            </div>

            {/* Video 2: Ejemplo */}
            <div className="bg-[#FFF5D6] border-2 border-[#F0D58C] rounded-2xl p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-black text-[#7A4400] flex items-center gap-1.5">
                  <span className="text-base">💡</span> Ejemplo
                </h4>
                <span className="bg-[#7B2FBE] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black">
                  Video 2
                </span>
              </div>
              {video2Base64 ? (
                <video
                  ref={exampleVideoRef}
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full rounded-xl bg-black aspect-video object-contain shadow-inner"
                  src={`data:video/mp4;base64,${video2Base64}`}
                />
              ) : (
                <div className="w-full aspect-video bg-amber-200/50 rounded-xl flex items-center justify-center text-xs font-bold text-amber-900">
                  Video 2 no disponible
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Navigation Bar */}
        <div className="pt-3.5 border-t-2 border-dashed border-[#C5BFEE] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={isPrevDisabled}
              onClick={handlePrev}
              className="px-5 py-2 rounded-full text-xs sm:text-sm font-black bg-[#E9D5FF] text-[#6B21A8] hover:bg-[#D8B4FE] shadow-sm active:scale-95 disabled:opacity-40 disabled:hover:bg-[#E9D5FF] cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              ◀ Anterior
            </button>
            <div className="text-xs sm:text-sm font-black text-[#3D1468] text-center">
              Tema {topicIdx + 1}/{currentTopics.length} · N{level}
            </div>
            <button
              type="button"
              disabled={isNextDisabled}
              onClick={handleNext}
              className="px-5 py-2 rounded-full text-xs sm:text-sm font-black bg-[#7B2FBE] hover:bg-[#6B21A8] text-white shadow-md active:scale-95 disabled:opacity-40 disabled:hover:bg-[#7B2FBE] cursor-pointer disabled:cursor-not-allowed transition-all flex items-center gap-1"
            >
              Siguiente ▶
            </button>
          </div>

          {/* Keyboard Legend */}
          <div className="text-[10px] sm:text-xs font-semibold text-[#7A7299] text-center">
            <kbd className="bg-[#EEF0FF] border border-[#C5BFEE] px-1.5 py-0.5 rounded text-[10px] text-[#3D1468] font-mono">←</kbd>{' '}
            <kbd className="bg-[#EEF0FF] border border-[#C5BFEE] px-1.5 py-0.5 rounded text-[10px] text-[#3D1468] font-mono">→</kbd>{' '}
            tema ·{' '}
            <kbd className="bg-[#EEF0FF] border border-[#C5BFEE] px-1.5 py-0.5 rounded text-[10px] text-[#3D1468] font-mono">↑</kbd>{' '}
            <kbd className="bg-[#EEF0FF] border border-[#C5BFEE] px-1.5 py-0.5 rounded text-[10px] text-[#3D1468] font-mono">↓</kbd>{' '}
            nivel ·{' '}
            <kbd className="bg-[#EEF0FF] border border-[#C5BFEE] px-1.5 py-0.5 rounded text-[10px] text-[#3D1468] font-mono">Esc</kbd>{' '}
            cerrar ·{' '}
            <kbd className="bg-[#EEF0FF] border border-[#C5BFEE] px-1.5 py-0.5 rounded text-[10px] text-[#3D1468] font-mono">Espacio</kbd>{' '}
            reproducir
          </div>
        </div>
      </div>
    </div>
  );
}
