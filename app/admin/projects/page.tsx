'use client';

import React, { useState, useEffect } from 'react';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDynamicModal, { FormFieldDef } from '@/components/admin/AdminDynamicModal';
import { projectSchema } from '@/lib/admin/validation';
import { projects as initialProjects } from '@/lib/data';
import { Project } from '@/types/portfolio';
import { ExternalLink, FolderGit2, Github, Star, CheckCircle2 } from 'lucide-react';

const PROJECT_FIELDS: FormFieldDef[] = [
  {
    name: 'title',
    label: 'Project Title',
    type: 'text',
    placeholder: 'e.g. Distributed Task Orchestrator',
    required: true,
  },
  {
    name: 'slug',
    label: 'Slug (URL Identifier)',
    type: 'text',
    placeholder: 'distributed-task-orchestrator',
    autoSlugFrom: 'title',
    required: true,
    helperText: 'Auto-generated from title or custom editable.',
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'Full-Stack Systems', value: 'Full-Stack' },
      { label: 'Cloud & Infrastructure', value: 'Cloud / DevOps' },
      { label: 'Web Applications', value: 'Web Application' },
      { label: 'Developer Tooling & CLI', value: 'Developer Tools' },
      { label: 'Distributed Systems', value: 'Distributed Systems' },
    ],
    required: true,
  },
  {
    name: 'description',
    label: 'Summary / Description',
    type: 'textarea',
    placeholder: 'Detailed architecture, challenges resolved, and throughput metrics...',
    required: true,
  },
  {
    name: 'tags',
    label: 'Technology Stack Tags',
    type: 'tags',
    required: true,
    helperText: 'Add technologies used (e.g. Next.js, Prisma, Redis, TypeScript).',
  },
  {
    name: 'liveUrl',
    label: 'Live Application Demo URL',
    type: 'url',
    placeholder: 'https://demo.example.com',
  },
  {
    name: 'githubUrl',
    label: 'GitHub Repository URL',
    type: 'url',
    placeholder: 'https://github.com/username/repo',
  },
  {
    name: 'featured',
    label: 'Featured Project',
    type: 'switch',
    defaultValue: false,
  },
];

export default function AdminProjectsPage() {
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setProjectList(json.data);
          }
        }
      } catch (err) {
        console.warn('API fetch projects warning:', err);
      }
    }
    loadProjects();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveProject = async (saved: Project) => {
    if (selectedProject) {
      setProjectList((prev) =>
        prev.map((p) => (p.slug === selectedProject.slug ? saved : p))
      );
      showNotification(`Project "${saved.title}" was updated successfully.`);

      try {
        const targetId = (selectedProject as any).id || selectedProject.slug;
        await fetch(`/api/projects/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved),
        });
      } catch (err) {
        console.warn('API update project error:', err);
      }
    } else {
      setProjectList((prev) => [saved, ...prev]);
      showNotification(`Project "${saved.title}" was created successfully.`);

      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.id) {
            setProjectList((prev) =>
              prev.map((p) => (p.slug === saved.slug ? { ...p, id: json.data.id } : p))
            );
          }
        }
      } catch (err) {
        console.warn('API create project error:', err);
      }
    }
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteProject = async (proj: Project) => {
    setProjectList((prev) => prev.filter((p) => p.slug !== proj.slug));
    showNotification(`Project "${proj.title}" was removed.`);

    try {
      const targetId = (proj as any).id || proj.slug;
      await fetch(`/api/projects/${targetId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('API delete project error:', err);
    }
  };

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
        title="Projects & Case Studies"
        description="Manage portfolio builds, live showcase deployments, challenge/solution architecture, and metrics."
        model="Project"
        actionLabel="New Project"
        onAction={() => {
          setSelectedProject(null);
          setIsModalOpen(true);
        }}
      />

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

      <AdminDataTable
        columns={columns}
        data={projectList}
        searchKey="title"
        searchPlaceholder="Search projects by title..."
        onEdit={(item) => {
          setSelectedProject(item);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteProject}
        onView={(item) => {
          if (item.liveUrl) window.open(item.liveUrl, '_blank');
          else if (item.githubUrl) window.open(item.githubUrl, '_blank');
        }}
      />

      {/* Dynamic Create / Update Project Modal */}
      <AdminDynamicModal<Project>
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleSaveProject}
        initialData={selectedProject}
        title="Project"
        model="Project"
        fields={PROJECT_FIELDS}
        schema={projectSchema}
      />
    </div>
  );
}
