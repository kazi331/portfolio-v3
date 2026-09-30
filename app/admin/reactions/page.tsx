'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { Bookmark, Flame, Heart, Lightbulb, Smile, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

interface ReactionStat {
  id: string;
  type: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  topPost: string;
}

const initialReactions: ReactionStat[] = [
  {
    id: '1',
    type: 'insightful',
    count: 64,
    icon: Lightbulb,
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    topPost: 'How We Scaled Shopify Apps Using Custom Shopify Functions',
  },
  {
    id: '2',
    type: 'practical',
    count: 42,
    icon: Sparkles,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    topPost: 'Boosting React Response Speeds by 30% with TanStack Query',
  },
  {
    id: '3',
    type: 'must-save',
    count: 28,
    icon: Bookmark,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    topPost: 'How to Build Scalable Node.js and Express Applications',
  },
  {
    id: '4',
    type: 'funny',
    count: 8,
    icon: Smile,
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    topPost: 'Code Quality Architecture: Locking Standards',
  },
];

export default function AdminReactionsPage() {
  const [reactions] = useState<ReactionStat[]>(initialReactions);

  const columns: Column<ReactionStat>[] = [
    {
      header: 'Reaction Sentiment',
      accessorKey: 'type',
      cell: (item) => {
        const Icon = item.icon;
        return (
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-[4px_1px_4px_1px] border ${item.color}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-white capitalize">{item.type}</span>
          </div>
        );
      },
    },
    {
      header: 'Total Count',
      accessorKey: 'count',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-white">{item.count}</span>
      ),
    },
    {
      header: 'Highest Reaction On Article',
      accessorKey: 'topPost',
      cell: (item) => (
        <span className="text-xs text-muted-text max-w-md truncate block">
          {item.topPost}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reader Reactions & Feedback"
        description="Analytics on insightful, practical, funny, and must-save emoji sentiments mapped to the @Reaction model."
        model="Reaction"
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {reactions.map((r) => {
          const Icon = r.icon;
          return (
            <AdminStatCard
              key={r.id}
              label={r.type}
              value={r.count}
              icon={Icon}
              color={r.color}
            />
          );
        })}
      </div>

      <AdminDataTable
        columns={columns}
        data={reactions}
        searchKey="type"
        searchPlaceholder="Search sentiment..."
      />
    </div>
  );
}
