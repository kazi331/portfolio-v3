'use client';

import { Edit, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Project {
  id: string;
  title: string;
  slug: string;
  featured: boolean;
  thumbnail: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      const data = await response.json();
      
      if (response.ok) {
        setProjects(data.projects);
      } else {
        setError(data.error || 'Failed to fetch projects');
      }
    } catch (err) {
      setError('An error occurred while fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProjects(projects.filter(project => project.id !== id));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete project');
      }
    } catch (err) {
      setError('An error occurred while deleting the project');
    }
  };

  if (loading) {
    return <div className="py-16 text-center font-mono text-[11px] uppercase tracking-widest text-muted-text">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-primary-text">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-[12px_3px_12px_3px] border border-accent/40 bg-accent/15 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-accent-secondary transition hover:border-accent hover:bg-accent/25 hover:text-primary-text"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-[10px_2px_10px_2px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="radius-card overflow-x-auto border border-white/10 bg-surface-raised">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/[0.03]">
            <tr>
              <th className="px-6 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Title
              </th>
              <th className="px-6 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Featured
              </th>
              <th className="px-6 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Thumbnail
              </th>
              <th className="px-6 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Created
              </th>
              <th className="px-6 py-3 text-right font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {projects.map((project) => (
              <tr className="transition hover:bg-white/[0.03]" key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary-text">{project.title}</div>
                  <div className="font-mono text-xs text-muted-text">{project.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {project.featured ? (
                    <span className="chip-base chip-success">
                      Yes
                    </span>
                  ) : (
                    <span className="chip-base chip-neutral">
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-[8px_2px_8px_2px] object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-muted-text">
                  {new Date(project.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="mr-4 text-accent-secondary transition hover:text-primary-text"
                  >
                    <Edit className="h-4 w-4 inline" />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-300 transition hover:text-red-200"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="px-6 py-10 text-center font-mono text-[11px] uppercase tracking-widest text-muted-text">
            No projects found. Create your first project!
          </div>
        )}
      </div>
    </div>
  );
}
