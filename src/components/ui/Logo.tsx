import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textVariant?: 'light' | 'dark';
  subtitle?: string;
  href?: string;
  className?: string;
  priority?: boolean;
}

export function Logo({
  size = 'md',
  showText = true,
  textVariant = 'light',
  subtitle,
  href = '/accueil',
  className = '',
  priority = false,
}: LogoProps) {
  // Dimension mappings for the logo icon
  const iconSizes = {
    xs: { px: 28, class: 'w-7 h-7 rounded-lg' },
    sm: { px: 34, class: 'w-8.5 h-8.5 rounded-lg' },
    md: { px: 44, class: 'w-11 h-11 rounded-xl' },
    lg: { px: 56, class: 'w-14 h-14 rounded-2xl' },
    xl: { px: 72, class: 'w-18 h-18 rounded-2xl' },
  }[size];

  // Font size mappings for brand text
  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-3 group transition-transform ${className}`}>
      {/* Official Teranga Logo Container */}
      <div
        className={`relative ${iconSizes.class} bg-white flex items-center justify-center shadow-xs overflow-hidden p-0.5 border border-stone-200/50 group-hover:scale-105 transition-transform shrink-0`}
      >
        <Image
          src="/images/logo-teranga.jpeg"
          alt="Téranga S'cool"
          width={iconSizes.px}
          height={iconSizes.px}
          className="w-full h-full object-contain"
          priority={priority}
        />
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <div className="flex items-center gap-1">
            <span
              className={`font-extrabold tracking-tight ${textSizes} ${
                textVariant === 'light' ? 'text-white' : 'text-stone-900'
              }`}
            >
              Téranga
            </span>
            <span className={`font-extrabold tracking-tight ${textSizes} text-[#E75A24]`}>
              S'cool
            </span>
          </div>

          {subtitle && (
            <span
              className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${
                textVariant === 'light' ? 'text-white/60' : 'text-stone-500'
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/40 rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
