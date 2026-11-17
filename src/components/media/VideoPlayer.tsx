'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  CheckCircle2,
} from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  duration?: string;
  thumbnailUrl?: string;
  initialProgressPercent?: number;
  onProgressUpdate?: (percent: number) => void;
  onEnded?: () => void;
  className?: string;
}

export function VideoPlayer({
  title,
  duration = '18:24',
  thumbnailUrl = '/images/course-thumbnail.png',
  initialProgressPercent = 68,
  onProgressUpdate,
  onEnded,
  className = '',
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(initialProgressPercent);
  const [currentTime, setCurrentTime] = useState('12:30');
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  // Simulate progress when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (onEnded) onEnded();
            return 100;
          }
          const next = Math.min(100, prev + 0.5);
          if (onProgressUpdate) onProgressUpdate(Math.round(next));
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onEnded, onProgressUpdate]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newPercent = Math.round(Math.max(0, Math.min(100, pos * 100)));
    setProgress(newPercent);
    if (onProgressUpdate) onProgressUpdate(newPercent);
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={playerRef}
      className={`relative w-full aspect-video rounded-3xl overflow-hidden bg-stone-950 shadow-lg group select-none ${className}`}
    >
      {/* Video Poster Thumbnail & Animated Stage */}
      <div className="absolute inset-0">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className={`object-cover transition-transform duration-500 ${
            isPlaying ? 'scale-105 filter brightness-90' : 'brightness-75'
          }`}
          priority
        />
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Large Center Play/Pause Trigger */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
        className={`absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-white cursor-pointer ${
          isPlaying ? 'opacity-0 group-hover:opacity-90' : 'opacity-100 scale-100'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
        ) : (
          <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
        )}
      </button>

      {/* Top Bar inside Player: Title & HD badge */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-5 flex items-center justify-between text-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
        <h3 className="font-bold text-sm sm:text-base drop-shadow-md truncate max-w-lg">
          {title}
        </h3>
        <div className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[11px] font-bold border border-white/10">
          HD 1080p
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 flex flex-col gap-2.5 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity opacity-90 group-hover:opacity-100">
        {/* Progress Bar Scrubber */}
        <div
          onClick={handleSeek}
          className="relative w-full h-2 rounded-full bg-white/30 hover:h-3 transition-all cursor-pointer overflow-hidden group/bar"
        >
          <div
            className="h-full bg-[#E75A24] rounded-full relative transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Buttons and Time */}
        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setProgress((p) => Math.max(0, p - 5))}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
              title="Reculer de 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setProgress((p) => Math.min(100, p + 5))}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
              title="Avancer de 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
              aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Time Indicator */}
            <span className="text-[11px] sm:text-xs font-semibold text-white/90">
              {currentTime} / {duration}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 relative">
            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 rounded-md text-xs font-bold hover:bg-white/20 text-white/90 transition-colors"
              >
                {speed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 bg-stone-900 border border-white/10 rounded-xl p-1 shadow-xl flex flex-col gap-1 min-w-[70px]">
                  {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSpeed(s);
                        setShowSpeedMenu(false);
                      }}
                      className={`text-xs px-2 py-1 rounded-lg text-left font-semibold ${
                        speed === s ? 'bg-[#E75A24] text-white' : 'text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
              aria-label="Plein écran"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
