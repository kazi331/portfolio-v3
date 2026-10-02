'use client';

import React, { useState, useEffect } from 'react';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDynamicModal, { FormFieldDef } from '@/components/admin/AdminDynamicModal';
import { certificationSchema } from '@/lib/admin/validation';
import { certifications } from '@/lib/data';
import { Certification } from '@/types/portfolio';
import { Award, Calendar, ExternalLink, CheckCircle2 } from 'lucide-react';

const CERT_FIELDS: FormFieldDef[] = [
  {
    name: 'name',
    label: 'Certificate / Credential Title',
    type: 'text',
    placeholder: 'e.g. AWS Certified Solutions Architect',
    required: true,
  },
  {
    name: 'issuer',
    label: 'Issuing Organization',
    type: 'text',
    placeholder: 'e.g. Amazon Web Services, Linux Foundation',
    required: true,
  },
  {
    name: 'completedDate',
    label: 'Issue / Completion Date',
    type: 'text',
    placeholder: 'e.g. May 2024',
    required: true,
  },
  {
    name: 'url',
    label: 'Credential Verification URL',
    type: 'url',
    placeholder: 'https://verify.credential.net/...',
    helperText: 'Official public credential verification link.',
  },
];

export default function AdminCertificationsPage() {
  const [certList, setCertList] = useState<Certification[]>(certifications);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadCertifications() {
      try {
        const res = await fetch('/api/certifications');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setCertList(json.data);
          }
        }
      } catch (err) {
        console.warn('API fetch certifications warning:', err);
      }
    }
    loadCertifications();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setSelectedCert(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Certification) => {
    setSelectedCert(item);
    setIsModalOpen(true);
  };

  const handleSave = async (saved: any) => {
    if (selectedCert) {
      setCertList((prev) =>
        prev.map((c) =>
          c.name === selectedCert.name && c.issuer === selectedCert.issuer ? saved : c
        )
      );
      showNotification(`Certificate "${saved.name}" was updated.`);

      try {
        const targetId = (selectedCert as any).id || selectedCert.name;
        await fetch(`/api/certifications/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved),
        });
      } catch (err) {
        console.warn('API update certification error:', err);
      }
    } else {
      setCertList((prev) => [saved, ...prev]);
      showNotification(`Certificate "${saved.name}" was added.`);

      try {
        const res = await fetch('/api/certifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.id) {
            setCertList((prev) =>
              prev.map((c) =>
                c.name === saved.name && c.issuer === saved.issuer
                  ? { ...c, id: json.data.id }
                  : c
              )
            );
          }
        }
      } catch (err) {
        console.warn('API create certification error:', err);
      }
    }
    setIsModalOpen(false);
    setSelectedCert(null);
  };

  const handleDelete = async (item: Certification) => {
    setCertList((prev) => prev.filter((c) => c.name !== item.name || c.issuer !== item.issuer));
    showNotification(`Certificate "${item.name}" was removed.`);

    try {
      const targetId = (item as any).id || item.name;
      await fetch(`/api/certifications/${targetId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('API delete certification error:', err);
    }
  };

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
        title="Verified Certifications"
        description="Manage official licenses, skill certifications, and credential URLs mapped to the @Certification model."
        model="Certification"
        actionLabel="Add Certificate"
        onAction={handleOpenCreate}
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
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <AdminDynamicModal<any>
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCert(null);
        }}
        onSave={handleSave}
        initialData={selectedCert}
        title="Certification"
        model="Certification"
        fields={CERT_FIELDS}
        schema={certificationSchema}
      />
    </div>
  );
}
