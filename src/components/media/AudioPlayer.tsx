'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  duration?: string;
  src?: string;
  className?: string;
}

export function AudioPlayer({
  duration = '0:38',
  src,
  className = '',
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(38);

  // Sample static bar heights for the visualizer waveform
  const barHeights = [
    30, 50, 75, 40, 85, 100, 65, 90, 45, 70, 95, 60, 80, 50, 70, 90, 60, 40, 75,
    95, 55, 85, 45, 65, 80, 40, 60, 30,
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 38;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className={`bg-[#EAF7EE] px-3.5 py-2.5 rounded-2xl border border-[#CEEFD8] flex items-center gap-3.5 max-w-sm select-none shadow-2xs ${className}`}
    >
      {/* Play/Pause Circle Button */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause la note vocale' : 'Écouter la note vocale'}
        className="w-9 h-9 rounded-full bg-[#0F3833] text-white flex items-center justify-center shrink-0 hover:bg-[#184540] transition-colors shadow-xs"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform Visualizer Bars */}
      <div className="flex items-center gap-[2.5px] flex-1 h-7">
        {barHeights.map((h, i) => {
          const isPlayed = isPlaying && i < Math.floor(((38 - secondsRemaining) / 38) * barHeights.length);
          return (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className={`w-[2.5px] rounded-full transition-all duration-150 ${
                isPlayed
                  ? 'bg-[#E75A24]'
                  : isPlaying
                  ? 'bg-[#236B48] animate-pulse'
                  : 'bg-[#236B48]/70 hover:bg-[#236B48]'
              }`}
            />
          );
        })}
      </div>

      {/* Duration / Timer */}
      <span className="text-xs font-semibold text-stone-600 shrink-0 tabular-nums">
        {isPlaying ? formatTime(secondsRemaining) : duration}
      </span>
    </div>
  );
}

export default AudioPlayer;
