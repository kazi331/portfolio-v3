'use client';

import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';

interface SocialButtonProps {
  platform: string;
  url: string;
  iconName: string;
  className?: string;
}

export default function SocialButton({ platform, url, iconName, className }: SocialButtonProps) {
  // Safe dynamic lucide-react icon loading
  // @ts-expect-error dynamic icon lookup
  const IconComponent = Icons[iconName] || Icons.Link;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit my ${platform}`}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`p-2.5 rounded-[10px_2px_10px_2px] bg-[#141820] border border-white/10 text-muted-text hover:text-primary-text hover:border-accent/50 hover:bg-[#1A202A] transition-all duration-200 flex items-center justify-center cursor-pointer ${className}`}
    >
      <IconComponent className="w-5 h-5" />
    </motion.a>
  );
}
