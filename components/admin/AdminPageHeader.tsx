'use client';

import { Plus, Sparkles } from 'lucide-react';
import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  model: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ComponentType<{ className?: string }>;
  extraBadges?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  model,
  actionLabel,
  onAction,
  actionIcon: ActionIcon = Plus,
  extraBadges,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
      <div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent mb-1">
          <Sparkles className="h-3 w-3" />
          <span>Prisma Model • @{model}</span>
          {extraBadges}
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-1 text-xs text-muted-text max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 rounded-[8px_2px_8px_2px] bg-accent px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-accent-secondary transition shadow-sm cursor-pointer"
          >
            <ActionIcon className="h-4 w-4" />
            <span>{actionLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}
