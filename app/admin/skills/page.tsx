'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { skillCategories } from '@/lib/data';
import { Cpu, Layers, Plus } from 'lucide-react';
import React, { useState } from 'react';

interface FlattenedSkill {
  id: string;
  name: string;
  category: string;
  level: number;
}

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

  const filteredSkills = React.useMemo(() => {
    if (selectedCategory === 'all') return skillsList;
    return skillsList.filter((s) => s.category === selectedCategory);
  }, [selectedCategory, skillsList]);

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
      <AdminPageHeader
        title="Skills & Taxonomy Categories"
        description="Manage domain skill taxonomies and proficiency percentages mapped to the @Skill and @SkillCategory Prisma models."
        model="Skill, SkillCategory"
        actionLabel="Add Skill"
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
          value="89%"
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
        onDelete={(item) => {
          setSkillsList((prev) => prev.filter((s) => s.id !== item.id));
        }}
      />
    </div>
  );
}
