import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'white' | 'soft' | 'interactive';
  className?: string;
}

export function Card({
  children,
  variant = 'white',
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    white: 'bg-white border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
    soft: 'bg-[#FAF7F2] border border-stone-200/60',
    interactive: 'bg-white border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
  }[variant];

  return (
    <div className={`rounded-2xl p-5 ${variantStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}
export default Card;

