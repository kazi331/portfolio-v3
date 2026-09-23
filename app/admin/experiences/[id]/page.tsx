'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    period: '',
    duration: '',
    location: '',
    dotX: 0,
    dotY: 0,
    cardX: 0,
    cardY: 0,
    yearLabel: '',
    color: '',
    isCurrent: false,
  });

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(`/api/admin/experiences/${params.id}`);
        const data = await response.json();
        
        if (response.ok) {
          const experience = data.experience;
          setFormData({
            company: experience.company || '',
            role: experience.role || '',
            period: experience.period || '',
            duration: experience.duration || '',
            location: experience.location || '',
            dotX: experience.dotX || 0,
            dotY: experience.dotY || 0,
            cardX: experience.cardX || 0,
            cardY: experience.cardY || 0,
            yearLabel: experience.yearLabel || '',
            color: experience.color || '',
            isCurrent: experience.isCurrent || false,
          });
        } else {
          setError(data.error || 'Failed to fetch experience');
        }
      } catch (err) {
        setError('An error occurred while fetching the experience');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                  e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/experiences/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/experiences');
      } else {
        setError(data.error || 'Failed to update experience');
      }
    } catch (err) {
      setError('An error occurred while updating the experience');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center font-mono text-[11px] uppercase tracking-widest text-muted-text">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/experiences"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-text transition hover:text-primary-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Experiences
        </Link>
      </div>

      <h1 className="mb-6 font-display text-3xl font-bold tracking-tight text-primary-text">Edit Experience</h1>

      {error && (
        <div className="mb-4 rounded-[10px_2px_10px_2px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="radius-card space-y-6 border border-white/10 bg-surface-raised p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
              Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="period" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
              Period (e.g., &quot;Jan 2020 - Present&quot;)
            </label>
            <input
              id="period"
              name="period"
              type="text"
              value={formData.period}
              onChange={handleChange}
              className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div>
            <label htmlFor="duration" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
              Duration (e.g., &quot;2 years&quot;)
            </label>
            <input
              id="duration"
              name="duration"
              type="text"
              value={formData.duration}
              onChange={handleChange}
              className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="flex items-center">
          <input
            id="isCurrent"
            name="isCurrent"
            type="checkbox"
            checked={formData.isCurrent}
            onChange={handleChange}
            className="h-4 w-4 rounded border-white/20 bg-surface text-accent accent-accent focus:ring-accent/30"
          />
          <label htmlFor="isCurrent" className="ml-2 block text-sm text-primary-text">
            Current Position
          </label>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="mb-4 font-display text-lg font-semibold text-primary-text">Visual Positioning (for timeline display)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dotX" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
                Dot X Position (%)
              </label>
              <input
                id="dotX"
                name="dotX"
                type="number"
                value={formData.dotX}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>

            <div>
              <label htmlFor="dotY" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
                Dot Y Position (%)
              </label>
              <input
                id="dotY"
                name="dotY"
                type="number"
                value={formData.dotY}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>

            <div>
              <label htmlFor="cardX" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
                Card X Position (%)
              </label>
              <input
                id="cardX"
                name="cardX"
                type="number"
                value={formData.cardX}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>

            <div>
              <label htmlFor="cardY" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
                Card Y Position (%)
              </label>
              <input
                id="cardY"
                name="cardY"
                type="number"
                value={formData.cardY}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label htmlFor="yearLabel" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
                Year Label
              </label>
              <input
                id="yearLabel"
                name="yearLabel"
                type="text"
                value={formData.yearLabel}
                onChange={handleChange}
                className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>

            <div>
              <label htmlFor="color" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
                Color (hex)
              </label>
              <input
                id="color"
                name="color"
                type="text"
                value={formData.color}
                onChange={handleChange}
                placeholder="#3B82F6"
                className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/experiences"
            className="rounded-[12px_3px_12px_3px] border border-white/12 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-text transition hover:border-white/25 hover:text-primary-text"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-[12px_3px_12px_3px] border border-accent/40 bg-accent/15 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-accent-secondary transition hover:border-accent hover:bg-accent/25 hover:text-primary-text disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
