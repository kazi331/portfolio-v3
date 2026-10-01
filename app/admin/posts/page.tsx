'use client';

import React, { useState } from 'react';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import PostEditorModal from '@/components/admin/PostEditorModal';
import { blogPosts } from '@/lib/data';
import { BlogPost } from '@/types/portfolio';
import {
  Calendar,
  Eye,
  FileText,
  Star,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPostsPage() {
  const [postList, setPostList] = useState<BlogPost[]>(blogPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleSavePost = (savedPost: BlogPost) => {
    if (editingPost) {
      // Update existing post
      setPostList((prev) =>
        prev.map((p) => (p.slug === editingPost.slug ? savedPost : p))
      );
      showNotification(`Article "${savedPost.title}" was updated successfully.`);
    } else {
      // Create new post: prepend to list
      setPostList((prev) => [savedPost, ...prev]);
      showNotification(`Article "${savedPost.title}" was created successfully.`);
    }
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = (post: BlogPost) => {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      setPostList((prev) => prev.filter((p) => p.slug !== post.slug));
      showNotification(`Article "${post.title}" was deleted.`, 'info');
    }
  };

  const columns: Column<BlogPost>[] = [
    {
      header: 'Article Title',
      accessorKey: 'title',
      cell: (item) => (
        <div className="flex flex-col">
          <Link
            href={`/blog/${item.slug}`}
            target="_blank"
            className="font-semibold text-white hover:text-accent transition-colors line-clamp-1 flex items-center gap-1.5"
          >
            <span>{item.title}</span>
            <ExternalLink className="h-3 w-3 opacity-60 hover:opacity-100" />
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
          {item.category || 'General'}
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
      {/* Toast Notification Banner */}
      {notification && (
        <div className="flex items-center justify-between rounded-[8px_2px_8px_2px] border border-accent/30 bg-accent/15 px-4 py-2.5 text-accent animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-accent/70 hover:text-accent font-mono text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      <AdminPageHeader
        title="Blog Posts & Engineering Logs"
        description="Create, edit, and publish technical articles, tutorials, markdown content, and tag mappings mapped to the @Post model."
        model="Post"
        actionLabel="Write New Post"
        onAction={handleOpenCreate}
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
        onEdit={(item) => handleOpenEdit(item)}
        onDelete={(item) => handleDeletePost(item)}
        onView={(item) => window.open(`/blog/${item.slug}`, '_blank')}
      />

      {/* Dynamic Create & Update Post Modal with Markdown Preview & AI Templates */}
      <PostEditorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPost(null);
        }}
        onSave={handleSavePost}
        initialData={editingPost}
      />
    </div>
  );
}
