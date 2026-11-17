import React from 'react';

interface AvatarProps {
  initials: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'green' | 'default';
}

export function Avatar({
  initials,
  name,
  size = 'md',
  className = '',
  variant = 'green',
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-bold',
  }[size];

  const variantClasses = {
    green: 'bg-[#D6EADB] text-[#14443F]',
    default: 'bg-stone-200 text-stone-800',
  }[variant];

  return (
    <div
      className={`rounded-full flex items-center justify-center select-none font-medium ${sizeClasses} ${variantClasses} ${className}`}
      title={name || initials}
    >
      {initials}
    </div>
  );
}
export default Avatar;

