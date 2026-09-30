'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { blogPosts } from '@/lib/data';
import { BlogPost } from '@/types/portfolio';
import { Calendar, Eye, FileText, Plus, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function AdminPostsPage() {
  const [postList, setPostList] = useState<BlogPost[]>(blogPosts);

  const columns: Column<BlogPost>[] = [
    {
      header: 'Article Title',
      accessorKey: 'title',
      cell: (item) => (
        <div className="flex flex-col">
          <Link
            href={`/blog/${item.slug}`}
            target="_blank"
            className="font-semibold text-white hover:text-accent transition-colors line-clamp-1"
          >
            {item.title}
          </Link>
          <span className="font-mono text-[10px] text-muted-text">/blog/{item.slug}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (item) => (
        <span className="rounded-[4px_1px_4px_1px] border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-accent-secondary">
          {item.category}
        </span>
      ),
    },
    {
      header: 'Published Date',
      accessorKey: 'date',
      cell: (item) => (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-text">
          <Calendar className="h-3 w-3 text-muted-text" /> {item.date}
        </span>
      ),
    },
    {
      header: 'Featured',
      accessorKey: 'featured',
      cell: (item) => (
        <span
          className={`inline-flex items-center gap-1 rounded-[4px_1px_4px_1px] px-2 py-0.5 font-mono text-[10px] ${
            item.featured
              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              : 'bg-white/5 text-muted-text border border-white/10'
          }`}
        >
          <Star className={`h-2.5 w-2.5 ${item.featured ? 'fill-amber-300' : ''}`} />
          {item.featured ? 'Featured' : 'Standard'}
        </span>
      ),
    },
    {
      header: 'Read Time',
      accessorKey: 'readTime',
      cell: (item) => (
        <span className="font-mono text-[11px] text-muted-text">{item.readTime}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog Posts & Engineering Logs"
        description="Create, edit, and publish technical articles, tutorials, markdown content, and tag mappings mapped to the @Post model."
        model="Post"
        actionLabel="Write New Post"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Published Articles"
          value={postList.length}
          icon={FileText}
          color="text-indigo-400 border-indigo-500/20 bg-indigo-500/10"
        />
        <AdminStatCard
          label="Featured Articles"
          value={postList.filter((p) => p.featured).length}
          icon={Star}
          color="text-amber-400 border-amber-500/20 bg-amber-500/10"
        />
        <AdminStatCard
          label="Total Readership Views"
          value="4.8k+"
          icon={Eye}
          color="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
      </div>

      <AdminDataTable
        columns={columns}
        data={postList}
        searchKey="title"
        searchPlaceholder="Search articles by title..."
        onDelete={(item) => {
          setPostList((prev) => prev.filter((p) => p.slug !== item.slug));
        }}
      />
    </div>
  );
}
