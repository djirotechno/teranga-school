import React from 'react';
import Link from 'next/link';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface MatiereCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  variant: 'francais' | 'histoire' | 'philosophie';
}

const variantStyles = {
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
};

export function MatiereCard({
  title,
  subtitle,
  href,
  icon: Icon,
  variant,
}: MatiereCardProps) {
  const styles = variantStyles[variant];

  return (
    <Link
      href={href}
      className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${styles.bg} ${styles.border}`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        <div className={`shrink-0 ${styles.iconBg} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <h3 className={`font-bold text-base sm:text-lg leading-snug tracking-tight ${styles.text}`}>
            {title}
          </h3>
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

