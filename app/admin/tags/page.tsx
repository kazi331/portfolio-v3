'use client';

import React, { useState, useEffect } from 'react';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDynamicModal, { FormFieldDef } from '@/components/admin/AdminDynamicModal';
import { tagSchema } from '@/lib/admin/validation';
import { FileText, Tag as TagIcon, CheckCircle2, Loader2 } from 'lucide-react';

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

const TAG_FIELDS: FormFieldDef[] = [
  {
    name: 'name',
    label: 'Tag Label',
    type: 'text',
    placeholder: 'e.g. GraphQL, TailwindCSS, Rust',
    required: true,
    helperText: 'Unique identifier used for categorizing posts and portfolio items.',
  },
  {
    name: 'postCount',
    label: 'Estimated Associated Posts Count',
    type: 'number',
    placeholder: '0',
    defaultValue: 0,
    required: true,
  },
];

export default function AdminTagsPage() {
  const [tags, setTags] = useState<TagItem[]>(initialTags);
  const [selectedTag, setSelectedTag] = useState<TagItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch from API
  useEffect(() => {
    async function loadTags() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/tags');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setTags(json.data);
          }
        }
      } catch (err) {
        console.warn('API fetch tags warning:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTags();
  }, []);

  const handleOpenCreate = () => {
    setSelectedTag(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TagItem) => {
    setSelectedTag(item);
    setIsModalOpen(true);
  };

  const handleSaveTag = async (saved: any) => {
    if (selectedTag) {
      // Optimistic update
      const updatedItem: TagItem = {
        id: selectedTag.id,
        name: saved.name,
        postCount: Number(saved.postCount) || 0,
        createdAt: selectedTag.createdAt,
      };

      setTags((prev) =>
        prev.map((t) => (t.id === selectedTag.id ? updatedItem : t))
      );
      showNotification(`Tag "${saved.name}" updated successfully.`);

      try {
        await fetch(`/api/tags/${selectedTag.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved),
        });
      } catch (err) {
        console.warn('API update tag error:', err);
      }
    } else {
      // Create new tag
      const tempId = String(Date.now());
      const newItem: TagItem = {
        id: tempId,
        name: saved.name,
        postCount: Number(saved.postCount) || 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setTags((prev) => [newItem, ...prev]);
      showNotification(`Tag "${saved.name}" created successfully.`);

      try {
        const res = await fetch('/api/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.id) {
            setTags((prev) =>
              prev.map((t) => (t.id === tempId ? { ...t, id: json.data.id } : t))
            );
          }
        }
      } catch (err) {
        console.warn('API create tag error:', err);
      }
    }

    setIsModalOpen(false);
    setSelectedTag(null);
  };

  const handleDelete = async (item: TagItem) => {
    setTags((prev) => prev.filter((t) => t.id !== item.id));
    showNotification(`Tag "${item.name}" was deleted.`);

    try {
      await fetch(`/api/tags/${item.id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('API delete tag error:', err);
    }
  };

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
      {notification && (
        <div className="flex items-center justify-between rounded-[8px_2px_8px_2px] border border-accent/30 bg-accent/15 px-4 py-2.5 text-accent animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{notification}</span>
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
        title="Content Tags & Topics"
        description="Organize taxonomy keywords and article linkages mapped to the @Tag model."
        model="Tag"
        actionLabel="Create Tag"
        onAction={handleOpenCreate}
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
          value={tags[0]?.name || 'TypeScript'}
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
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <AdminDynamicModal<any>
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTag(null);
        }}
        onSave={handleSaveTag}
        initialData={selectedTag}
        title="Tag"
        model="Tag"
        fields={TAG_FIELDS}
        schema={tagSchema}
      />
    </div>
  );
}
