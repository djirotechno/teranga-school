import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'peach' | 'green' | 'purple' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'orange',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    orange: 'bg-[#E75A24] text-white',
    peach: 'bg-[#FBECE2] text-[#D05624] font-medium',
    green: 'bg-[#EBF4EE] text-[#2E794C] font-medium',
    purple: 'bg-[#EFEAF8] text-[#6942B5] font-medium',
    gray: 'bg-stone-200 text-stone-700 font-medium',
  }[variant];

  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.5 rounded-full',
    md: 'text-xs px-3 py-1 rounded-full',
  }[size];

  return (
    <span className={`inline-flex items-center justify-center font-medium ${sizeStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
}
export default Badge;

