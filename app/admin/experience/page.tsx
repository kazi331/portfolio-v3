'use client';

import React, { useState } from 'react';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDynamicModal, { FormFieldDef } from '@/components/admin/AdminDynamicModal';
import { workExperiences } from '@/lib/data';
import { WorkExperience } from '@/types/portfolio';
import { Building2, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

const experienceValidationSchema = z.object({
  role: z.string().min(2, 'Job title/role is required'),
  company: z.string().min(2, 'Company name is required'),
  period: z.string().min(2, 'Period/timeline is required'),
  location: z.string().min(2, 'Location is required'),
  highlights: z.array(z.string()).default([]),
  url: z.string().optional(),
});

const EXPERIENCE_FIELDS: FormFieldDef[] = [
  {
    name: 'role',
    label: 'Job Title / Position',
    type: 'text',
    placeholder: 'e.g. Lead Software Engineer',
    required: true,
  },
  {
    name: 'company',
    label: 'Company / Organization',
    type: 'text',
    placeholder: 'e.g. Stripe, Acme Corp',
    required: true,
  },
  {
    name: 'period',
    label: 'Timeline / Duration',
    type: 'text',
    placeholder: 'e.g. Jan 2023 - Present',
    required: true,
  },
  {
    name: 'location',
    label: 'Work Location',
    type: 'text',
    placeholder: 'e.g. San Francisco, CA / Remote',
    required: true,
  },
  {
    name: 'highlights',
    label: 'Key Responsibilities & Impact',
    type: 'tags',
    helperText: 'Add bullet points of achievements or impact.',
  },
  {
    name: 'url',
    label: 'Company Website URL',
    type: 'url',
    placeholder: 'https://company.com',
  },
];

export default function AdminExperiencePage() {
  const [expList, setExpList] = useState<WorkExperience[]>(workExperiences);
  const [selectedExp, setSelectedExp] = useState<WorkExperience | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setSelectedExp(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: WorkExperience) => {
    setSelectedExp(item);
    setIsModalOpen(true);
  };

  const handleSave = (saved: any) => {
    if (selectedExp) {
      setExpList((prev) =>
        prev.map((e) =>
          e.company === selectedExp.company && e.role === selectedExp.role ? saved : e
        )
      );
      showNotification(`Position at "${saved.company}" was updated.`);
    } else {
      setExpList((prev) => [saved, ...prev]);
      showNotification(`Position at "${saved.company}" was added.`);
    }
    setIsModalOpen(false);
    setSelectedExp(null);
  };

  const handleDelete = (item: WorkExperience) => {
    if (confirm(`Remove position at "${item.company}"?`)) {
      setExpList((prev) => prev.filter((e) => e.company !== item.company || e.role !== item.role));
      showNotification(`Position at "${item.company}" was deleted.`);
    }
  };

  const columns: Column<WorkExperience>[] = [
    {
      header: 'Role & Company',
      accessorKey: 'role',
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-white">{item.role}</span>
          <span className="text-xs text-accent-secondary flex items-center gap-1">
            <Building2 className="h-3 w-3" /> {item.company}
          </span>
        </div>
      ),
    },
    {
      header: 'Timeline / Period',
      accessorKey: 'period',
      cell: (item) => (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-text">
          <Calendar className="h-3 w-3 text-accent" /> {item.period}
        </span>
      ),
    },
    {
      header: 'Location',
      accessorKey: 'location',
      cell: (item) => (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-text">
          <MapPin className="h-3 w-3 text-muted-text" /> {item.location || 'Remote'}
        </span>
      ),
    },
    {
      header: 'Key Achievements',
      cell: (item) => (
        <div className="text-xs text-muted-text max-w-sm line-clamp-2">
          {item.highlights[0] || 'No summary'}
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
        title="Work Experience & Positions"
        description="Manage professional employment records, achievements, company details, and JSON technologies array mapped to @Experience."
        model="Experience"
        actionLabel="Add Experience"
        onAction={handleOpenCreate}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Total Positions"
          value={expList.length}
          icon={Building2}
          color="text-amber-400 border-amber-500/20 bg-amber-500/10"
        />
        <AdminStatCard
          label="Current Role"
          value="Software Engineer"
          icon={Building2}
          color="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
        <AdminStatCard
          label="Total Experience"
          value="3+ Years"
          icon={Calendar}
          color="text-blue-400 border-blue-500/20 bg-blue-500/10"
        />
      </div>

      <AdminDataTable
        columns={columns}
        data={expList}
        searchKey="company"
        searchPlaceholder="Search by company or role..."
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <AdminDynamicModal<any>
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExp(null);
        }}
        onSave={handleSave}
        initialData={selectedExp}
        title="Work Experience"
        model="Experience"
        fields={EXPERIENCE_FIELDS}
        schema={experienceValidationSchema}
      />
    </div>
  );
}
