'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { educations } from '@/lib/data';
import { Education } from '@/types/portfolio';
import { Calendar, GraduationCap, Plus } from 'lucide-react';
import React, { useState } from 'react';

export default function AdminEducationPage() {
  const [eduList, setEduList] = useState<Education[]>(educations);

  const columns: Column<Education>[] = [
    {
      header: 'Degree / Certificate',
      accessorKey: 'degree',
      cell: (item) => (
        <span className="font-semibold text-white">{item.degree}</span>
      ),
    },
    {
      header: 'Institution',
      accessorKey: 'institution',
      cell: (item) => (
        <div className="flex items-center gap-2 text-xs text-accent-secondary">
          <GraduationCap className="h-3.5 w-3.5 text-accent" />
          <span>{item.institution}</span>
        </div>
      ),
    },
    {
      header: 'Period / Graduation',
      accessorKey: 'period',
      cell: (item) => (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-text">
          <Calendar className="h-3 w-3 text-muted-text" /> {item.period}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Academic Education"
        description="Manage university degrees, graduation timeline, and academic records mapped to the @Education model."
        model="Education"
        actionLabel="Add Degree"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AdminStatCard
          label="Degrees & Diplomas"
          value={eduList.length}
          icon={GraduationCap}
          color="text-pink-400 border-pink-500/20 bg-pink-500/10"
        />
        <AdminStatCard
          label="Highest Degree"
          value="Bachelor of Arts"
          icon={GraduationCap}
          color="text-accent border-accent/20 bg-accent/10"
        />
      </div>

      <AdminDataTable
        columns={columns}
        data={eduList}
        searchKey="institution"
        searchPlaceholder="Search by institution..."
        onDelete={(item) => {
          setEduList((prev) => prev.filter((e) => e.degree !== item.degree));
        }}
      />
    </div>
  );
}
