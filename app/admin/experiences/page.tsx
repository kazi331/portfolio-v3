'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Experience {
  id: string;
  company: string | null;
  role: string | null;
  period: string | null;
  location: string | null;
  isCurrent: boolean;
  createdAt: string;
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/admin/experiences');
      const data = await response.json();
      
      if (response.ok) {
        setExperiences(data.experiences);
      } else {
        setError(data.error || 'Failed to fetch experiences');
      }
    } catch (err) {
      setError('An error occurred while fetching experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const response = await fetch(`/api/admin/experiences/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setExperiences(experiences.filter(exp => exp.id !== id));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete experience');
      }
    } catch (err) {
      setError('An error occurred while deleting the experience');
    }
  };

  if (loading) {
    return <div className="py-16 text-center font-mono text-[11px] uppercase tracking-widest text-muted-text">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-primary-text">Experiences</h1>
        <Link
          href="/admin/experiences/new"
          className="inline-flex items-center gap-2 rounded-[12px_3px_12px_3px] border border-accent/40 bg-accent/15 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-accent-secondary transition hover:border-accent hover:bg-accent/25 hover:text-primary-text"
        >
          <Plus className="h-4 w-4" />
          New Experience
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
                Company
              </th>
              <th className="px-6 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Role
              </th>
              <th className="px-6 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Period
              </th>
              <th className="px-6 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Location
              </th>
              <th className="px-6 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Status
              </th>
              <th className="px-6 py-3 text-right font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {experiences.map((experience) => (
              <tr className="transition hover:bg-white/[0.03]" key={experience.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary-text">{experience.company || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-primary-text">{experience.role || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-muted-text">
                  {experience.period || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-muted-text">
                  {experience.location || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {experience.isCurrent ? (
                    <span className="chip-base chip-success">
                      Current
                    </span>
                  ) : (
                    <span className="chip-base chip-neutral">
                      Past
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/experiences/${experience.id}`}
                    className="mr-4 text-accent-secondary transition hover:text-primary-text"
                  >
                    <Edit className="h-4 w-4 inline" />
                  </Link>
                  <button
                    onClick={() => handleDelete(experience.id)}
                    className="text-red-300 transition hover:text-red-200"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {experiences.length === 0 && (
          <div className="px-6 py-10 text-center font-mono text-[11px] uppercase tracking-widest text-muted-text">
            No experiences found. Add your first experience!
          </div>
        )}
      </div>
    </div>
  );
}
