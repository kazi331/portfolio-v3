'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { references } from '@/lib/data';
import { Reference } from '@/types/portfolio';
import { Building2, Mail, Plus, UserCheck, Users } from 'lucide-react';
import React, { useState } from 'react';

export default function AdminReferencesPage() {
  const [refList, setRefList] = useState<Reference[]>(references);

  const columns: Column<Reference>[] = [
    {
      header: 'Reference Name',
      accessorKey: 'name',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 border border-accent/30 font-mono text-xs font-bold text-accent">
            {item.name.charAt(0)}
          </div>
          <span className="font-semibold text-white">{item.name}</span>
        </div>
      ),
    },
    {
      header: 'Company & Position',
      accessorKey: 'role',
      cell: (item) => (
        <div className="flex flex-col">
          <span className="text-white">{item.role}</span>
          <span className="text-xs text-accent-secondary flex items-center gap-1">
            <Building2 className="h-3 w-3" /> {item.company}
          </span>
        </div>
      ),
    },
    {
      header: 'Email Contact',
      accessorKey: 'email',
      cell: (item) => (
        <a
          href={`mailto:${item.email}`}
          className="inline-flex items-center gap-1 font-mono text-xs text-muted-text hover:text-white"
        >
          <Mail className="h-3 w-3 text-accent" /> {item.email}
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Professional References"
        description="Manage professional colleagues, recommendations, and contact information mapped to the @Reference model."
        model="Reference"
        actionLabel="Add Reference"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AdminStatCard
          label="Total References"
          value={refList.length}
          icon={Users}
          color="text-teal-400 border-teal-500/20 bg-teal-500/10"
        />
        <AdminStatCard
          label="Companies Represented"
          value={new Set(refList.map((r) => r.company)).size}
          icon={Building2}
          color="text-accent border-accent/20 bg-accent/10"
        />
      </div>

      <AdminDataTable
        columns={columns}
        data={refList}
        searchKey="name"
        searchPlaceholder="Search references..."
        onDelete={(item) => {
          setRefList((prev) => prev.filter((r) => r.name !== item.name));
        }}
      />
    </div>
  );
}
