'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: number;
  category: {
    id: string;
    name: string | null;
  };
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/admin/skills');
      const data = await response.json();
      
      if (response.ok) {
        setSkills(data.skills);
      } else {
        setError(data.error || 'Failed to fetch skills');
      }
    } catch (err) {
      setError('An error occurred while fetching skills');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSkills(skills.filter(skill => skill.id !== id));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete skill');
      }
    } catch (err) {
      setError('An error occurred while deleting the skill');
    }
  };

  if (loading) {
    return <div className="py-16 text-center font-mono text-[11px] uppercase tracking-widest text-muted-text">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-primary-text">Skills</h1>
        <Link
          href="/admin/skills/new"
          className="inline-flex items-center gap-2 rounded-[12px_3px_12px_3px] border border-accent/40 bg-accent/15 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-accent-secondary transition hover:border-accent hover:bg-accent/25 hover:text-primary-text"
        >
          <Plus className="h-4 w-4" />
          New Skill
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
                Name
              </th>
              <th className="px-6 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Category
              </th>
              <th className="px-6 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Level
              </th>
              <th className="px-6 py-3 text-right font-mono text-[10px] font-medium uppercase tracking-widest text-muted-text">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {skills.map((skill) => (
              <tr className="transition hover:bg-white/[0.03]" key={skill.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary-text">{skill.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="chip-base chip-secondary">
                    {skill.category.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div 
                      className="h-full rounded-full bg-accent" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <span className="font-mono text-xs text-muted-text">{skill.level}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/skills/${skill.id}`}
                    className="mr-4 text-accent-secondary transition hover:text-primary-text"
                  >
                    <Edit className="h-4 w-4 inline" />
                  </Link>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="text-red-300 transition hover:text-red-200"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {skills.length === 0 && (
          <div className="px-6 py-10 text-center font-mono text-[11px] uppercase tracking-widest text-muted-text">
            No skills found. Create your first skill!
          </div>
        )}
      </div>
    </div>
  );
}
