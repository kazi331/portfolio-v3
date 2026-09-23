import React from 'react';

export type ChipVariant = 'neutral' | 'accent' | 'secondary' | 'success' | 'amber';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: ChipVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  interactive?: boolean;
}

/**
 * Standardized Chip Component adhering to the portfolio's fixed style guide:
 * - Asymmetric CAD architectural radius: rounded-[8px_2px_8px_2px]
 * - Monospace, single-line, uppercase tracking-wider
 * - Precision border, background, and contrast-safe color matrix
 */
export default function Chip({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  interactive = false,
  className = '',
  ...props
}: ChipProps) {
  const variantStyles: Record<ChipVariant, string> = {
    neutral: 'bg-[#141923] border-white/12 text-[#969DA7] hover:text-[#F1F3F5] hover:border-white/25',
    accent: 'bg-accent/15 border-accent/40 text-accent font-semibold',
    secondary: 'bg-[#162335] border-accent-secondary/35 text-accent-secondary font-semibold',
    success: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400 font-semibold',
    amber: 'bg-amber-500/15 border-amber-500/35 text-amber-400 font-semibold',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-1 text-[10px]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[8px_2px_8px_2px] border font-mono uppercase tracking-wider leading-none whitespace-nowrap select-none transition-colors duration-150 ${variantStyles[variant]} ${sizeStyles[size]} ${interactive ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
