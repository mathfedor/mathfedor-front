'use client';

import React, { useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface LandingVideoPlayerProps {
  src: string;
  poster: string;
  title?: string;
  variant?: 'emerald' | 'orange';
  badgeText?: string;
  className?: string;
}

export default function LandingVideoPlayer({
  src,
  poster,
  title,
  variant = 'emerald',
  badgeText = 'Toca para ver el video',
  className = '',
}: LandingVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Video play prevented or interrupted:', err);
      });
    }
  };

  const isEmerald = variant === 'emerald';

  return (
    <div
      className={`relative group rounded-2xl overflow-hidden border border-white/20 bg-black aspect-video mb-4 shadow-lg select-none ${className}`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="w-full h-full object-contain bg-black"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Play Overlay */}
      <div
        onClick={handlePlay}
        role="button"
        tabIndex={isPlaying ? -1 : 0}
        aria-label={title ? `Reproducir ${title}` : 'Reproducir video'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePlay();
          }
        }}
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          isPlaying
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100 bg-black/35 hover:bg-black/25 backdrop-blur-[1px]'
        }`}
      >
        {/* Animated pulse halo and play button */}
        <div className="relative flex items-center justify-center">
          <span
            className={`absolute -inset-3 rounded-full opacity-60 animate-ping duration-1000 ${
              isEmerald ? 'bg-emerald-500/40' : 'bg-[#FF6B00]/40'
            }`}
          />
          <div
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white border-2 border-white/80 shadow-2xl transition-all duration-300 transform group-hover:scale-110 active:scale-95 ${
              isEmerald
                ? 'bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 shadow-[0_0_30px_rgba(16,185,129,0.7)]'
                : 'bg-gradient-to-tr from-[#EA580C] via-[#FF6B00] to-amber-500 shadow-[0_0_30px_rgba(255,107,0,0.7)]'
            }`}
          >
            <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-white text-white translate-x-0.5" />
          </div>
        </div>

        {/* Badge below the button */}
        {badgeText && (
          <span className="mt-3.5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg tracking-wide group-hover:bg-slate-900/90 transition-colors">
            <span>▶</span>
            <span>{badgeText}</span>
          </span>
        )}
      </div>
    </div>
  );
}
