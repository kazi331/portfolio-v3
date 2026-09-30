'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { CheckCircle2, MessageSquare, ThumbsDown, ThumbsUp, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface CommentRecord {
  id: string;
  authorName: string;
  postTitle: string;
  content: string;
  upvotes: number;
  downvotes: number;
  status: 'Approved' | 'Pending' | 'Flagged';
  createdAt: string;
}

const initialComments: CommentRecord[] = [
  {
    id: '1',
    authorName: 'Alex Mercer',
    postTitle: 'Boosting React Response Speeds by 30% with TanStack Query',
    content: 'The staleTime versus gcTime explanation was super clear. We applied this on our dashboard.',
    upvotes: 8,
    downvotes: 0,
    status: 'Approved',
    createdAt: '2024-03-22',
  },
  {
    id: '2',
    authorName: 'Sarah Connor',
    postTitle: 'How We Scaled Shopify Apps Using Custom Shopify Functions',
    content: 'Did you benchmark memory limits when handling carts with 50+ line items on edge WASM?',
    upvotes: 14,
    downvotes: 1,
    status: 'Approved',
    createdAt: '2024-02-15',
  },
  {
    id: '3',
    authorName: 'David K.',
    postTitle: 'Dynamic Page Delivery: Next.js Incremental Static Regeneration (ISR)',
    content: 'Does on-demand revalidation cause concurrency stampedes if traffic is extremely high?',
    upvotes: 4,
    downvotes: 0,
    status: 'Pending',
    createdAt: '2024-06-11',
  },
  {
    id: '4',
    authorName: 'Marcus Wright',
    postTitle: 'Code Quality Architecture: Locking Standards with Linter Rules',
    content: 'Great writeup on husky lint-staged automation hooks.',
    upvotes: 6,
    downvotes: 0,
    status: 'Approved',
    createdAt: '2024-05-30',
  },
];

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentRecord[]>(initialComments);

  const columns: Column<CommentRecord>[] = [
    {
      header: 'Author & Post',
      accessorKey: 'authorName',
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-white">{item.authorName}</span>
          <span className="font-mono text-[10px] text-accent-secondary truncate max-w-xs">
            {item.postTitle}
          </span>
        </div>
      ),
    },
    {
      header: 'Comment Content',
      accessorKey: 'content',
      cell: (item) => (
        <p className="text-xs text-muted-text max-w-sm line-clamp-2 leading-relaxed">
          "{item.content}"
        </p>
      ),
    },
    {
      header: 'Votes',
      cell: (item) => (
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <ThumbsUp className="h-3 w-3" /> {item.upvotes}
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <ThumbsDown className="h-3 w-3" /> {item.downvotes}
          </span>
        </div>
      ),
    },
    {
      header: 'Moderation Status',
      accessorKey: 'status',
      cell: (item) => (
        <span
          className={`inline-flex items-center gap-1 rounded-[4px_1px_4px_1px] px-2 py-0.5 font-mono text-[10px] ${
            item.status === 'Approved'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              : item.status === 'Pending'
              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              : 'bg-red-500/10 text-red-300 border border-red-500/20'
          }`}
        >
          {item.status === 'Approved' ? (
            <CheckCircle2 className="h-2.5 w-2.5" />
          ) : (
            <XCircle className="h-2.5 w-2.5" />
          )}
          {item.status}
        </span>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: (item) => (
        <span className="font-mono text-[10px] text-muted-text">{item.createdAt}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Comments Moderation"
        description="Review, approve, and moderate user discussions, upvotes, and replies mapped to the @Comment model."
        model="Comment"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Total Comments"
          value={comments.length}
          icon={MessageSquare}
          color="text-purple-400 border-purple-500/20 bg-purple-500/10"
        />
        <AdminStatCard
          label="Approved Live"
          value={comments.filter((c) => c.status === 'Approved').length}
          icon={CheckCircle2}
          color="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
        <AdminStatCard
          label="Pending Review"
          value={comments.filter((c) => c.status === 'Pending').length}
          icon={MessageSquare}
          color="text-amber-400 border-amber-500/20 bg-amber-500/10"
        />
      </div>

      <AdminDataTable
        columns={columns}
        data={comments}
        searchKey="content"
        searchPlaceholder="Search comment text or author..."
        onDelete={(item) => {
          setComments((prev) => prev.filter((c) => c.id !== item.id));
        }}
      />
    </div>
  );
}
