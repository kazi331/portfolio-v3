import React from 'react';

interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
  isPositive?: boolean;
  color?: string;
}

export default function AdminStatCard({
  label,
  value,
  icon: Icon,
  change,
  isPositive = true,
  color = 'text-accent border-accent/20 bg-accent/10',
}: AdminStatCardProps) {
  return (
    <div className="rounded-[12px_3px_12px_3px] border border-white/10 bg-[#0F131C] p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-text">
          {label}
        </span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-[6px_2px_6px_2px] border ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-display text-2xl font-bold tracking-tight text-white">
          {value}
        </span>
        {change && (
          <span
            className={`font-mono text-[10px] ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
