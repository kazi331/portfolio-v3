'use client';

import React from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export default function AnimatedButton({
  variant = 'primary',
  href,
  className = '',
  children,
  ...props
}: AnimatedButtonProps) {
  const baseStyle =
    'px-5 py-2.5 rounded-[12px_3px_12px_3px] font-mono text-[11px] font-semibold tracking-wider transition-all duration-200 inline-flex items-center justify-center gap-2.5 cursor-pointer select-none active:translate-y-[1px]';

  const variants = {
    primary:
      'bg-[#F1F3F5] text-[#0A0C0F] hover:bg-white border border-[#F1F3F5] shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.8)] font-bold',
    secondary:
      'bg-[#141820] text-[#F1F3F5] border border-white/10 hover:border-white/20 hover:bg-[#1A202A] shadow-[0_2px_6px_rgba(0,0,0,0.3)]',
    outline:
      'bg-transparent text-[#F1F3F5] border border-white/15 hover:border-accent hover:text-accent hover:bg-accent/5 shadow-none',
    text:
      'bg-transparent text-[#969DA7] hover:text-[#F1F3F5] border-transparent px-0 py-0 rounded-none tracking-wider shadow-none',
  };

  const buttonClass = twMerge(clsx(baseStyle, variants[variant], className));

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    if (isExternal) {
      return (
        <a id="animated-button-link-ext" href={href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
          {children}
        </a>
      );
    }
    return (
      <Link id="animated-button-link-int" href={href} className={buttonClass}>
        {children}
      </Link>
    );
  }

  return (
    <motion.button
      id="animated-button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={buttonClass}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
