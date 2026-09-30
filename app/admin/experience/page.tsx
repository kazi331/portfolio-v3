'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { workExperiences } from '@/lib/data';
import { WorkExperience } from '@/types/portfolio';
import { Building2, Calendar, MapPin, Plus } from 'lucide-react';
import React, { useState } from 'react';

export default function AdminExperiencePage() {
  const [expList, setExpList] = useState<WorkExperience[]>(workExperiences);

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
      <AdminPageHeader
        title="Work Experience & Positions"
        description="Manage professional employment records, achievements, company details, and JSON technologies array mapped to @Experience."
        model="Experience"
        actionLabel="Add Experience"
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
        onDelete={(item) => {
          setExpList((prev) => prev.filter((e) => e.company !== item.company));
        }}
      />
    </div>
  );
}
