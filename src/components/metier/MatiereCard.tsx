import React from 'react';
import Link from 'next/link';
import { ChevronRight, LucideIcon } from 'lucide-react';

export type MatiereVariant =
  | 'francais'
  | 'histoire'
  | 'philosophie'
  | 'maths'
  | 'physique'
  | 'svt'
  | 'anglais';

interface MatiereCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon | React.ComponentType<{ className?: string; strokeWidth?: number }>;
  variant: MatiereVariant;
  badge?: string;
}

const variantStyles: Record<
  MatiereVariant,
  { bg: string; border: string; text: string; iconBg: string }
> = {
  francais: {
    bg: 'bg-[#FBECE2] hover:bg-[#F7E2D5]',
    border: 'border-[#F4DACB]',
    text: 'text-[#C85A2B]',
    iconBg: 'text-[#C85A2B]',
  },
  histoire: {
    bg: 'bg-[#EBF4EE] hover:bg-[#DFEDE3]',
    border: 'border-[#D9EADB]',
    text: 'text-[#236B48]',
    iconBg: 'text-[#236B48]',
  },
  philosophie: {
    bg: 'bg-[#F0EDFA] hover:bg-[#E7E2F6]',
    border: 'border-[#E2DCF4]',
    text: 'text-[#6644B8]',
    iconBg: 'text-[#6644B8]',
  },
  maths: {
    bg: 'bg-[#E6F0FA] hover:bg-[#DAE9F7]',
    border: 'border-[#D0E2F7]',
    text: 'text-[#1D63B8]',
    iconBg: 'text-[#1D63B8]',
  },
  physique: {
    bg: 'bg-[#FEF3E2] hover:bg-[#FBE9CE]',
    border: 'border-[#F7E5C8]',
    text: 'text-[#B86B1D]',
    iconBg: 'text-[#B86B1D]',
  },
  svt: {
    bg: 'bg-[#EAF7EE] hover:bg-[#DEF3E5]',
    border: 'border-[#CEEFD8]',
    text: 'text-[#1B7843]',
    iconBg: 'text-[#1B7843]',
  },
  anglais: {
    bg: 'bg-[#FDF2F8] hover:bg-[#FCE7F3]',
    border: 'border-[#FBCFE8]',
    text: 'text-[#BE185D]',
    iconBg: 'text-[#BE185D]',
  },
};

export function MatiereCard({
  title,
  subtitle,
  href,
  icon: Icon,
  variant,
  badge,
}: MatiereCardProps) {
  const styles = variantStyles[variant] || variantStyles.francais;

  return (
    <Link
      href={href}
      className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${styles.bg} ${styles.border}`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
        <div className={`shrink-0 ${styles.iconBg} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-base sm:text-lg leading-snug tracking-tight truncate ${styles.text}`}>
              {title}
            </h3>
            {badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/70 text-stone-700 shrink-0">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-[13px] text-stone-600 truncate mt-0.5 font-normal">
            {subtitle}
          </p>
        </div>
      </div>

      <ChevronRight
        className={`w-5 h-5 shrink-0 ml-2 transition-transform group-hover:translate-x-1 ${styles.text}`}
      />
    </Link>
  );
}

export default MatiereCard;
