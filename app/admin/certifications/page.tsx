'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { certifications } from '@/lib/data';
import { Certification } from '@/types/portfolio';
import { Award, Calendar, ExternalLink, Plus } from 'lucide-react';
import React, { useState } from 'react';

export default function AdminCertificationsPage() {
  const [certList, setCertList] = useState<Certification[]>(certifications);

  const columns: Column<Certification>[] = [
    {
      header: 'Certificate Name',
      accessorKey: 'name',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-accent shrink-0" />
          <span className="font-semibold text-white">{item.name}</span>
        </div>
      ),
    },
    {
      header: 'Issuer',
      accessorKey: 'issuer',
      cell: (item) => (
        <span className="rounded-[4px_1px_4px_1px] border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-accent-secondary">
          {item.issuer}
        </span>
      ),
    },
    {
      header: 'Completed Date',
      accessorKey: 'completedDate',
      cell: (item) => (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-text">
          <Calendar className="h-3 w-3 text-muted-text" /> {item.completedDate}
        </span>
      ),
    },
    {
      header: 'Verification Link',
      accessorKey: 'url',
      cell: (item) => (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:underline"
        >
          <ExternalLink className="h-3 w-3" /> Verify Credential
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Verified Certifications"
        description="Manage official licenses, skill certifications, and credential URLs mapped to the @Certification model."
        model="Certification"
        actionLabel="Add Certificate"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Total Certifications"
          value={certList.length}
          icon={Award}
          color="text-rose-400 border-rose-500/20 bg-rose-500/10"
        />
        <AdminStatCard
          label="Distinct Issuers"
          value={new Set(certList.map((c) => c.issuer)).size}
          icon={Award}
          color="text-accent border-accent/20 bg-accent/10"
        />
        <AdminStatCard
          label="Verified Status"
          value="100% Live"
          icon={Award}
          color="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
      </div>

      <AdminDataTable
        columns={columns}
        data={certList}
        searchKey="name"
        searchPlaceholder="Search certificates..."
        onDelete={(item) => {
          setCertList((prev) => prev.filter((c) => c.name !== item.name));
        }}
      />
    </div>
  );
}
