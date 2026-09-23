'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string | null;
  slug: string | null;
}

export default function NewSkillPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    level: 50,
    categoryId: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/skill-categories');
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/skills');
      } else {
        setError(data.error || 'Failed to create skill');
      }
    } catch (err) {
      setError('An error occurred while creating the skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/skills"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-text transition hover:text-primary-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Skills
        </Link>
      </div>

      <h1 className="mb-6 font-display text-3xl font-bold tracking-tight text-primary-text">Create New Skill</h1>

      {error && (
        <div className="mb-4 rounded-[10px_2px_10px_2px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="radius-card space-y-6 border border-white/10 bg-surface-raised p-6">
        <div>
          <label htmlFor="name" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Skill Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name || 'Unnamed Category'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="level" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Proficiency Level: {formData.level}%
          </label>
          <input
            id="level"
            name="level"
            type="range"
            min="0"
            max="100"
            value={formData.level}
            onChange={handleChange}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-accent"
          />
          <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-text">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/skills"
            className="rounded-[12px_3px_12px_3px] border border-white/12 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-text transition hover:border-white/25 hover:text-primary-text"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-[12px_3px_12px_3px] border border-accent/40 bg-accent/15 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-accent-secondary transition hover:border-accent hover:bg-accent/25 hover:text-primary-text disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Skill'}
          </button>
        </div>
      </form>
    </div>
  );
}
