'use client';

import React, { useState, useEffect } from 'react';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDynamicModal, { FormFieldDef } from '@/components/admin/AdminDynamicModal';
import { skillCategories } from '@/lib/data';
import { Cpu, Layers, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

interface FlattenedSkill {
  id: string;
  name: string;
  category: string;
  level: number;
}

const skillValidationSchema = z.object({
  name: z.string().min(2, 'Skill name must be at least 2 characters'),
  category: z.string().min(2, 'Category is required'),
  level: z.coerce.number().min(1, 'Level must be 1-100%').max(100, 'Max level is 100%'),
});

const SKILL_FIELDS: FormFieldDef[] = [
  {
    name: 'name',
    label: 'Skill / Technology Name',
    type: 'text',
    placeholder: 'e.g. Distributed Systems, Kubernetes, GraphQL',
    required: true,
  },
  {
    name: 'category',
    label: 'Taxonomy Category',
    type: 'select',
    options: [
      { label: 'Frontend & UI', value: 'Frontend & UI' },
      { label: 'Backend & APIs', value: 'Backend & APIs' },
      { label: 'Cloud & DevOps', value: 'Cloud & DevOps' },
      { label: 'Databases & Cache', value: 'Databases & Cache' },
      { label: 'Architecture & Design', value: 'Architecture & Design' },
    ],
    required: true,
  },
  {
    name: 'level',
    label: 'Proficiency Percentage (1 - 100)',
    type: 'number',
    placeholder: '85',
    defaultValue: 85,
    required: true,
    helperText: 'Displayed in proficiency gauges on the public portfolio.',
  },
];

export default function AdminSkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allSkills: FlattenedSkill[] = React.useMemo(() => {
    const list: FlattenedSkill[] = [];
    skillCategories.forEach((cat, catIdx) => {
      cat.skills.forEach((s, sIdx) => {
        list.push({
          id: `${catIdx}-${sIdx}`,
          name: s.name,
          category: cat.category,
          level: s.level,
        });
      });
    });
    return list;
  }, []);

  const [skillsList, setSkillsList] = useState<FlattenedSkill[]>(allSkills);
  const [selectedSkill, setSelectedSkill] = useState<FlattenedSkill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await fetch('/api/skills');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setSkillsList(json.data);
          }
        }
      } catch (err) {
        console.warn('API fetch skills warning:', err);
      }
    }
    loadSkills();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredSkills = React.useMemo(() => {
    if (selectedCategory === 'all') return skillsList;
    return skillsList.filter((s) => s.category === selectedCategory);
  }, [selectedCategory, skillsList]);

  const handleOpenCreate = () => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: FlattenedSkill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (saved: any) => {
    if (selectedSkill) {
      setSkillsList((prev) =>
        prev.map((s) => (s.id === selectedSkill.id ? { ...saved, id: selectedSkill.id } : s))
      );
      showNotification(`Skill "${saved.name}" was updated.`);

      try {
        await fetch(`/api/skills/${selectedSkill.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved),
        });
      } catch (err) {
        console.warn('API update skill error:', err);
      }
    } else {
      const tempId = String(Date.now());
      const newSkill: FlattenedSkill = {
        ...saved,
        id: tempId,
      };
      setSkillsList((prev) => [newSkill, ...prev]);
      showNotification(`Skill "${saved.name}" was added.`);

      try {
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.id) {
            setSkillsList((prev) =>
              prev.map((s) => (s.id === tempId ? { ...s, id: json.data.id } : s))
            );
          }
        }
      } catch (err) {
        console.warn('API create skill error:', err);
      }
    }
    setIsModalOpen(false);
    setSelectedSkill(null);
  };

  const handleDelete = async (item: FlattenedSkill) => {
    setSkillsList((prev) => prev.filter((s) => s.id !== item.id));
    showNotification(`Skill "${item.name}" was removed.`);

    try {
      await fetch(`/api/skills/${item.id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('API delete skill error:', err);
    }
  };

  const columns: Column<FlattenedSkill>[] = [
    {
      header: 'Skill Name',
      accessorKey: 'name',
      cell: (item) => (
        <span className="font-semibold text-white">{item.name}</span>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (item) => (
        <span className="rounded-[4px_1px_4px_1px] border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-accent-secondary">
          {item.category}
        </span>
      ),
    },
    {
      header: 'Proficiency Level',
      accessorKey: 'level',
      cell: (item) => (
        <div className="flex items-center gap-3 w-40">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: `${item.level}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-muted-text w-8 text-right">
            {item.level}%
          </span>
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
        title="Skills & Taxonomy Categories"
        description="Manage domain skill taxonomies and proficiency percentages mapped to the @Skill and @SkillCategory Prisma models."
        model="Skill, SkillCategory"
        actionLabel="Add Skill"
        onAction={handleOpenCreate}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Total Skills"
          value={skillsList.length}
          icon={Cpu}
          color="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
        <AdminStatCard
          label="Taxonomy Groups"
          value={skillCategories.length}
          icon={Layers}
          color="text-cyan-400 border-cyan-500/20 bg-cyan-500/10"
        />
        <AdminStatCard
          label="Average Proficiency"
          value={`${Math.round(
            skillsList.reduce((acc, curr) => acc + curr.level, 0) / (skillsList.length || 1)
          )}%`}
          icon={Cpu}
          color="text-accent border-accent/20 bg-accent/10"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`rounded-[6px_2px_6px_2px] px-3 py-1 font-mono text-[11px] transition ${
            selectedCategory === 'all'
              ? 'bg-accent text-black font-bold'
              : 'bg-white/5 text-muted-text hover:text-white'
          }`}
        >
          All Categories ({skillsList.length})
        </button>
        {skillCategories.map((cat) => (
          <button
            key={cat.category}
            type="button"
            onClick={() => setSelectedCategory(cat.category)}
            className={`rounded-[6px_2px_6px_2px] px-3 py-1 font-mono text-[11px] transition ${
              selectedCategory === cat.category
                ? 'bg-accent text-black font-bold'
                : 'bg-white/5 text-muted-text hover:text-white'
            }`}
          >
            {cat.category}
          </button>
        ))}
      </div>

      <AdminDataTable
        columns={columns}
        data={filteredSkills}
        searchKey="name"
        searchPlaceholder="Search skills..."
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <AdminDynamicModal<any>
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSkill(null);
        }}
        onSave={handleSaveSkill}
        initialData={selectedSkill}
        title="Skill"
        model="Skill"
        fields={SKILL_FIELDS}
        schema={skillValidationSchema}
      />
    </div>
  );
}
