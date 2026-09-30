'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { FileText, Plus, Tag as TagIcon } from 'lucide-react';
import React, { useState } from 'react';

interface TagItem {
  id: string;
  name: string;
  postCount: number;
  createdAt: string;
}

const initialTags: TagItem[] = [
  { id: '1', name: 'React', postCount: 4, createdAt: '2024-01-10' },
  { id: '2', name: 'Next.js', postCount: 5, createdAt: '2024-01-10' },
  { id: '3', name: 'TypeScript', postCount: 6, createdAt: '2024-01-10' },
  { id: '4', name: 'TanStack Query', postCount: 2, createdAt: '2024-02-14' },
  { id: '5', name: 'Shopify Functions', postCount: 1, createdAt: '2024-02-18' },
  { id: '6', name: 'WebAssembly', postCount: 1, createdAt: '2024-02-18' },
  { id: '7', name: 'Performance', postCount: 3, createdAt: '2024-03-01' },
  { id: '8', name: 'PostgreSQL', postCount: 3, createdAt: '2024-03-05' },
  { id: '9', name: 'Node.js', postCount: 4, createdAt: '2024-03-10' },
  { id: '10', name: 'FastAPI', postCount: 1, createdAt: '2024-03-12' },
  { id: '11', name: 'Docker', postCount: 2, createdAt: '2024-03-15' },
];

export default function AdminTagsPage() {
  const [tags, setTags] = useState<TagItem[]>(initialTags);

  const columns: Column<TagItem>[] = [
    {
      header: 'Tag Label',
      accessorKey: 'name',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <TagIcon className="h-3.5 w-3.5 text-accent" />
          <span className="font-semibold text-white">{item.name}</span>
        </div>
      ),
    },
    {
      header: 'Associated Posts',
      accessorKey: 'postCount',
      cell: (item) => (
        <span className="inline-flex items-center gap-1 rounded-[4px_1px_4px_1px] border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-accent-secondary">
          <FileText className="h-3 w-3" /> {item.postCount} {item.postCount === 1 ? 'post' : 'posts'}
        </span>
      ),
    },
    {
      header: 'Created On',
      accessorKey: 'createdAt',
      cell: (item) => (
        <span className="font-mono text-[10px] text-muted-text">{item.createdAt}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Content Tags & Topics"
        description="Organize taxonomy keywords and article linkages mapped to the @Tag model."
        model="Tag"
        actionLabel="Create Tag"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Total Tags"
          value={tags.length}
          icon={TagIcon}
          color="text-yellow-400 border-yellow-500/20 bg-yellow-500/10"
        />
        <AdminStatCard
          label="Most Popular"
          value="TypeScript"
          icon={TagIcon}
          color="text-accent border-accent/20 bg-accent/10"
        />
        <AdminStatCard
          label="Total Associations"
          value={tags.reduce((acc, t) => acc + t.postCount, 0)}
          icon={FileText}
          color="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
      </div>

      <AdminDataTable
        columns={columns}
        data={tags}
        searchKey="name"
        searchPlaceholder="Search tags..."
        onDelete={(item) => {
          setTags((prev) => prev.filter((t) => t.id !== item.id));
        }}
      />
    </div>
  );
}
