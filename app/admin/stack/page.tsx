'use client';

import React, { useState, useEffect } from 'react';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDynamicModal, { FormFieldDef } from '@/components/admin/AdminDynamicModal';
import { Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

export interface StackItem {
  id: string;
  name: string;
  category: string;
  orbitTier: 'Core Core' | 'Inner Orbital' | 'Outer Orbital';
  iconType: string;
  projectCount: number;
}

const stackValidationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(2, 'Category is required'),
  orbitTier: z.enum(['Core Core', 'Inner Orbital', 'Outer Orbital']),
  iconType: z.string().min(1, 'Icon identifier is required'),
  projectCount: z.coerce.number().min(0, 'Project count cannot be negative').default(0),
});

const STACK_FIELDS: FormFieldDef[] = [
  {
    name: 'name',
    label: 'Technology Name',
    type: 'text',
    placeholder: 'e.g. Next.js, Redis, Rust',
    required: true,
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'Language', value: 'Language' },
      { label: 'Framework', value: 'Framework' },
      { label: 'Library', value: 'Library' },
      { label: 'Runtime', value: 'Runtime' },
      { label: 'Database', value: 'Database' },
      { label: 'ORM / Data Layer', value: 'ORM' },
      { label: 'Styling / UI', value: 'Styling' },
      { label: 'DevOps / Cloud', value: 'DevOps' },
      { label: 'State / Cache', value: 'State / Cache' },
    ],
    required: true,
  },
  {
    name: 'orbitTier',
    label: '3D Sphere Orbit Tier',
    type: 'select',
    options: [
      { label: 'Core Core (Central Sphere)', value: 'Core Core' },
      { label: 'Inner Orbital (Primary Ring)', value: 'Inner Orbital' },
      { label: 'Outer Orbital (Secondary Ring)', value: 'Outer Orbital' },
    ],
    required: true,
  },
  {
    name: 'iconType',
    label: 'Icon Identifier',
    type: 'text',
    placeholder: 'e.g. nextjs, react, typescript, postgresql',
    required: true,
  },
  {
    name: 'projectCount',
    label: 'Linked Projects Count',
    type: 'number',
    placeholder: '0',
    defaultValue: 1,
    required: true,
  },
];

const initialStack: StackItem[] = [
  { id: '1', name: 'TypeScript', category: 'Language', orbitTier: 'Core Core', iconType: 'typescript', projectCount: 4 },
  { id: '2', name: 'Next.js', category: 'Framework', orbitTier: 'Core Core', iconType: 'nextjs', projectCount: 4 },
  { id: '3', name: 'React', category: 'Library', orbitTier: 'Core Core', iconType: 'react', projectCount: 4 },
  { id: '4', name: 'Node.js', category: 'Runtime', orbitTier: 'Core Core', iconType: 'nodejs', projectCount: 3 },
  { id: '5', name: 'PostgreSQL', category: 'Database', orbitTier: 'Inner Orbital', iconType: 'postgresql', projectCount: 3 },
  { id: '6', name: 'Prisma ORM', category: 'ORM', orbitTier: 'Inner Orbital', iconType: 'prisma', projectCount: 3 },
  { id: '7', name: 'Tailwind CSS', category: 'Styling', orbitTier: 'Inner Orbital', iconType: 'tailwind', projectCount: 4 },
  { id: '8', name: 'FastAPI', category: 'Framework', orbitTier: 'Outer Orbital', iconType: 'fastapi', projectCount: 1 },
  { id: '9', name: 'Docker', category: 'DevOps', orbitTier: 'Inner Orbital', iconType: 'docker', projectCount: 2 },
  { id: '10', name: 'TanStack Query', category: 'State / Cache', orbitTier: 'Inner Orbital', iconType: 'tanstack', projectCount: 2 },
  { id: '11', name: 'Shopify Functions', category: 'E-commerce / Edge', orbitTier: 'Outer Orbital', iconType: 'shopify', projectCount: 1 },
  { id: '12', name: 'Firebase / FCM', category: 'Cloud', orbitTier: 'Outer Orbital', iconType: 'firebase', projectCount: 2 },
];

export default function AdminStackPage() {
  const [stackList, setStackList] = useState<StackItem[]>(initialStack);
  const [selectedItem, setSelectedItem] = useState<StackItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadStack() {
      try {
        const res = await fetch('/api/stack');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setStackList(json.data);
          }
        }
      } catch (err) {
        console.warn('API fetch stack warning:', err);
      }
    }
    loadStack();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: StackItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSaveStack = async (savedData: any) => {
    if (selectedItem) {
      setStackList((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...savedData, id: selectedItem.id } : item
        )
      );
      showNotification(`Technology "${savedData.name}" was updated.`);

      try {
        await fetch(`/api/stack/${selectedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedData),
        });
      } catch (err) {
        console.warn('API update stack error:', err);
      }
    } else {
      const tempId = String(Date.now());
      const newItem: StackItem = {
        ...savedData,
        id: tempId,
      };
      setStackList((prev) => [newItem, ...prev]);
      showNotification(`Technology "${savedData.name}" was added to the orbital stack.`);

      try {
        const res = await fetch('/api/stack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedData),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.id) {
            setStackList((prev) =>
              prev.map((s) => (s.id === tempId ? { ...s, id: json.data.id } : s))
            );
          }
        }
      } catch (err) {
        console.warn('API create stack error:', err);
      }
    }
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = async (item: StackItem) => {
    if (confirm(`Remove "${item.name}" from stack?`)) {
      setStackList((prev) => prev.filter((s) => s.id !== item.id));
      showNotification(`"${item.name}" was removed.`);

      try {
        await fetch(`/api/stack/${item.id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.warn('API delete stack error:', err);
      }
    }
  };

  const columns: Column<StackItem>[] = [
    {
      header: 'Technology / Node',
      accessorKey: 'name',
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[4px_1px_4px_1px] border border-white/10 bg-white/5 font-mono text-xs font-bold text-accent">
            {item.name.charAt(0)}
          </div>
          <div>
            <span className="font-semibold text-white">{item.name}</span>
            <div className="font-mono text-[10px] text-muted-text">Type: {item.iconType}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (item) => (
        <span className="rounded-[4px_1px_4px_1px] border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-text">
          {item.category}
        </span>
      ),
    },
    {
      header: '3D Sphere Orbit',
      accessorKey: 'orbitTier',
      cell: (item) => (
        <span
          className={`inline-flex items-center gap-1 rounded-[4px_1px_4px_1px] px-2 py-0.5 font-mono text-[10px] ${
            item.orbitTier === 'Core Core'
              ? 'bg-accent/15 text-accent border border-accent/30 font-semibold'
              : item.orbitTier === 'Inner Orbital'
              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
              : 'bg-white/5 text-muted-text border border-white/10'
          }`}
        >
          <Sparkles className="h-2.5 w-2.5" />
          {item.orbitTier}
        </span>
      ),
    },
    {
      header: 'Linked Projects',
      accessorKey: 'projectCount',
      cell: (item) => (
        <span className="font-mono text-xs text-white">
          {item.projectCount} {item.projectCount === 1 ? 'project' : 'projects'}
        </span>
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
        title="Tech Stack & Sphere Nodes"
        description="Manage technology badges, 3D interactive orbital nodes, and project linkages mapped to the @Stack model."
        model="Stack"
        actionLabel="Add Tech Node"
        onAction={handleOpenCreate}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Total Technologies"
          value={stackList.length}
          icon={Layers}
          color="text-cyan-400 border-cyan-500/20 bg-cyan-500/10"
        />
        <AdminStatCard
          label="Core Orbital Anchors"
          value={stackList.filter((s) => s.orbitTier === 'Core Core').length}
          icon={Sparkles}
          color="text-accent border-accent/20 bg-accent/10"
        />
        <AdminStatCard
          label="Connected to Projects"
          value="100%"
          icon={Layers}
          color="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
      </div>

      <AdminDataTable
        columns={columns}
        data={stackList}
        searchKey="name"
        searchPlaceholder="Search technologies by name..."
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <AdminDynamicModal<any>
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveStack}
        initialData={selectedItem}
        title="Technology Node"
        model="Stack"
        fields={STACK_FIELDS}
        schema={stackValidationSchema}
      />
    </div>
  );
}
