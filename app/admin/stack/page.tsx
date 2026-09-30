'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { Layers, Plus, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

interface StackItem {
  id: string;
  name: string;
  category: string;
  orbitTier: 'Core Core' | 'Inner Orbital' | 'Outer Orbital';
  iconType: string;
  projectCount: number;
}

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
      <AdminPageHeader
        title="Tech Stack & Sphere Nodes"
        description="Manage technology badges, 3D interactive orbital nodes, and project linkages mapped to the @Stack model."
        model="Stack"
        actionLabel="Add Tech Node"
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
        onDelete={(item) => {
          setStackList((prev) => prev.filter((s) => s.id !== item.id));
        }}
      />
    </div>
  );
}
