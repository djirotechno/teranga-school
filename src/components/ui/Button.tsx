import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-[#E75A24] hover:bg-[#D44E1C] text-white shadow-sm font-medium transition-colors',
    secondary: 'bg-[#EDE7DC] hover:bg-[#E3DCcf] text-stone-800 font-medium transition-colors',
    ghost: 'hover:bg-black/5 text-stone-700 transition-colors',
    outline: 'border border-stone-300 hover:bg-stone-50 text-stone-800 transition-colors',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3 rounded-xl gap-2.5',
  }[size];

  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
export default Button;

