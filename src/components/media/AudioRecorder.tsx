'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Square, Send, X } from 'lucide-react';

interface AudioRecorderProps {
  onSendAudio: (duration: string) => void;
  onCancel: () => void;
  className?: string;
}

export function AudioRecorder({
  onSendAudio,
  onCancel,
  className = '',
}: AudioRecorderProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFinish = () => {
    const dur = formatDuration(Math.max(1, seconds));
    onSendAudio(dur);
  };

  return (
    <div
      className={`p-3.5 bg-red-50/70 border border-red-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150 ${className}`}
    >
      <div className="flex items-center gap-3">
        {/* Pulsing Red Recording Indicator */}
        <div className="relative flex items-center justify-center">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping absolute" />
          <span className="w-3.5 h-3.5 rounded-full bg-red-600 relative" />
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-red-700">
          <Mic className="w-4 h-4 text-red-600" />
          <span>Enregistrement en cours...</span>
          <span className="font-mono bg-red-100 px-2 py-0.5 rounded-md text-red-900 font-bold">
            {formatDuration(seconds)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={handleFinish}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white text-xs font-bold transition-all shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Envoyer le vocal</span>
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
          aria-label="Annuler l'enregistrement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default AudioRecorder;
