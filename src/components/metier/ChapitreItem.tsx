import React from 'react';
import Link from 'next/link';
import { Play, FileText, CheckSquare, Download, BookOpen, ChevronRight } from 'lucide-react';

export interface ChapitreItemProps {
  title: string;
  type: 'video' | 'pdf' | 'exercise';
  subtitle: string;
  href?: string;
  onClick?: () => void;
  onRead?: () => void;
  onDownload?: () => void;
  isActive?: boolean;
  isCompleted?: boolean;
  className?: string;
}

export function ChapitreItem({
  title,
  type,
  subtitle,
  href,
  onClick,
  onRead,
  onDownload,
  isActive = false,
  isCompleted = false,
  className = '',
}: ChapitreItemProps) {
  const getIconConfig = () => {
    switch (type) {
      case 'video':
        return {
          icon: Play,
          bg: 'bg-[#EAF7EE]',
          text: 'text-[#1B7843]',
          iconClass: 'w-4 h-4 fill-current ml-0.5',
        };
      case 'pdf':
        return {
          icon: FileText,
          bg: 'bg-[#FBECE2]',
          text: 'text-[#C85A2B]',
          iconClass: 'w-4 h-4',
        };
      case 'exercise':
        return {
          icon: CheckSquare,
          bg: 'bg-[#EBF4EE]',
          text: 'text-[#236B48]',
          iconClass: 'w-4 h-4',
        };
    }
  };

  const config = getIconConfig();
  const Icon = config.icon;

  const content = (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-4.5 border transition-all duration-200 flex items-center justify-between gap-3 sm:gap-4 group cursor-pointer ${
        isActive
          ? 'border-[#E75A24] ring-2 ring-[#E75A24]/10 shadow-xs'
          : 'border-stone-200/80 hover:border-stone-300 hover:shadow-xs'
      } ${className}`}
      onClick={onClick}
    >
      {/* Left Icon + Text */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div
          className={`w-10 h-10 rounded-xl ${config.bg} ${config.text} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
        >
          <Icon className={config.iconClass} />
        </div>

        <div className="min-w-0">
          <h4 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#E75A24] transition-colors truncate">
            {title}
          </h4>
          <p className="text-xs text-stone-500 mt-0.5 font-normal">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right action buttons */}
      <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
        {type === 'pdf' ? (
          <>
            {/* Reading button requested by the user */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onRead) {
                  onRead();
                } else if (onClick) {
                  onClick();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-xl text-stone-700 bg-stone-100 hover:bg-[#FCEEE7] hover:text-[#C85A2B] active:scale-95 transition-all cursor-pointer"
              title="Lire le document"
            >
              <BookOpen className="w-4 h-4 text-[#C85A2B]" />
              <span>Lire</span>
            </button>

            {/* Download button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onDownload) {
                  onDownload();
                } else if (onClick) {
                  onClick();
                }
              }}
              className="p-2 sm:p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
              title="Télécharger le document"
              aria-label="Télécharger"
            >
              <Download className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="p-1.5 rounded-lg text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all">
            <ChevronRight className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full focus:outline-hidden">
        {content}
      </Link>
    );
  }

  return content;
}

export default ChapitreItem;
