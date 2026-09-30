'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { projects as initialProjects } from '@/lib/data';
import { Project } from '@/types/portfolio';
import { ExternalLink, FolderGit2, Github, Plus, Star } from 'lucide-react';
import React, { useState } from 'react';

export default function AdminProjectsPage() {
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: Column<Project>[] = [
    {
      header: 'Project / Title',
      accessorKey: 'title',
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-white">{item.title}</span>
          <span className="font-mono text-[10px] text-muted-text">/{item.slug}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (item) => (
        <span className="inline-block rounded-[4px_1px_4px_1px] border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-accent-secondary">
          {item.category || 'General'}
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
      header: 'Tech Stack',
      cell: (item) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-[3px_1px_3px_1px] bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-muted-text"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="font-mono text-[9px] text-muted-text">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Links',
      cell: (item) => (
        <div className="flex items-center gap-2 font-mono text-[11px]">
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline inline-flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" /> Live
            </a>
          )}
          {item.githubUrl && (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-text hover:text-white inline-flex items-center gap-1"
            >
              <Github className="h-3 w-3" /> Repo
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projects & Case Studies"
        description="Manage portfolio builds, live showcase deployments, challenge/solution architecture, and metrics."
        model="Project"
        actionLabel="New Project"
        onAction={() => {
          setSelectedProject(null);
          setIsModalOpen(true);
        }}
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Total Projects"
          value={projectList.length}
          icon={FolderGit2}
          color="text-blue-400 border-blue-500/20 bg-blue-500/10"
        />
        <AdminStatCard
          label="Featured Highlights"
          value={projectList.filter((p) => p.featured).length}
          icon={Star}
          color="text-amber-400 border-amber-500/20 bg-amber-500/10"
        />
        <AdminStatCard
          label="Distinct Categories"
          value={new Set(projectList.map((p) => p.category)).size}
          icon={FolderGit2}
          color="text-cyan-400 border-cyan-500/20 bg-cyan-500/10"
        />
      </div>

      {/* Main Table */}
      <AdminDataTable
        columns={columns}
        data={projectList}
        searchKey="title"
        searchPlaceholder="Search projects by title..."
        onEdit={(item) => {
          setSelectedProject(item);
          setIsModalOpen(true);
        }}
        onDelete={(item) => {
          setProjectList((prev) => prev.filter((p) => p.slug !== item.slug));
        }}
      />
    </div>
  );
}
