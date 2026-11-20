'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  className?: string;
  color?: string;
  gradientClass?: string;
  heightClass?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  progress,
  label,
  className = '',
  color = '#E75A24',
  gradientClass,
  heightClass = 'h-2.5',
  showPercentage = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs text-stone-600 font-medium">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-bold text-stone-900">{clamped}%</span>}
        </div>
      )}
      <div className={`w-full bg-[#EAE4D9]/80 ${heightClass} rounded-full overflow-hidden p-[1px] shadow-inner`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out relative ${
            gradientClass ? `bg-gradient-to-r ${gradientClass}` : ''
          }`}
          style={{
            width: `${clamped}%`,
            backgroundColor: gradientClass ? undefined : color,
          }}
        >
          {/* Subtle light reflection on top of the bar for modern look */}
          <div className="absolute inset-0 bg-white/20 rounded-full h-1/2" />
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
