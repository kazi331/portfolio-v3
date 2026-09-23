'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    featured: false,
    stacks: '',
    thumbnail: '',
    excerpt: '',
    githubUrl: '',
    clientLive: '',
    apiLive: '',
    challenge: '',
    solution: '',
    impact: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          links: {
            github: formData.githubUrl,
            clientLive: formData.clientLive,
            apiLive: formData.apiLive,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/projects');
      } else {
        setError(data.error || 'Failed to create project');
      }
    } catch (err) {
      setError('An error occurred while creating the project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-text transition hover:text-primary-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      <h1 className="mb-6 font-display text-3xl font-bold tracking-tight text-primary-text">Create New Project</h1>

      {error && (
        <div className="mb-4 rounded-[10px_2px_10px_2px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="radius-card space-y-6 border border-white/10 bg-surface-raised p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div>
            <label htmlFor="slug" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
              Slug *
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-white/20 bg-surface text-accent accent-accent focus:ring-accent/30"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-primary-text">
            Featured Project
          </label>
        </div>

        <div>
          <label htmlFor="stacks" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Tech Stacks (comma-separated) *
          </label>
          <input
            id="stacks"
            name="stacks"
            type="text"
            value={formData.stacks}
            onChange={handleChange}
            required
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label htmlFor="thumbnail" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Thumbnail URL *
          </label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="url"
            value={formData.thumbnail}
            onChange={handleChange}
            required
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Excerpt *
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows={3}
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="githubUrl" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
              GitHub URL
            </label>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div>
            <label htmlFor="clientLive" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
              Client Live URL
            </label>
            <input
              id="clientLive"
              name="clientLive"
              type="url"
              value={formData.clientLive}
              onChange={handleChange}
              className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div>
            <label htmlFor="apiLive" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
              API Live URL
            </label>
            <input
              id="apiLive"
              name="apiLive"
              type="url"
              value={formData.apiLive}
              onChange={handleChange}
              className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        <div>
          <label htmlFor="challenge" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Challenge
          </label>
          <textarea
            id="challenge"
            name="challenge"
            value={formData.challenge}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label htmlFor="solution" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Solution
          </label>
          <textarea
            id="solution"
            name="solution"
            value={formData.solution}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label htmlFor="impact" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Impact
          </label>
          <textarea
            id="impact"
            name="impact"
            value={formData.impact}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/projects"
            className="rounded-[12px_3px_12px_3px] border border-white/12 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-text transition hover:border-white/25 hover:text-primary-text"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-[12px_3px_12px_3px] border border-accent/40 bg-accent/15 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-accent-secondary transition hover:border-accent hover:bg-accent/25 hover:text-primary-text disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
