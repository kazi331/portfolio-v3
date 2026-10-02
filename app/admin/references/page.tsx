'use client';

import React, { useState, useEffect } from 'react';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDynamicModal, { FormFieldDef } from '@/components/admin/AdminDynamicModal';
import { referenceSchema } from '@/lib/admin/validation';
import { references } from '@/lib/data';
import { Reference } from '@/types/portfolio';
import { Building2, Mail, Users, CheckCircle2 } from 'lucide-react';

const REF_FIELDS: FormFieldDef[] = [
  {
    name: 'name',
    label: 'Reference Full Name',
    type: 'text',
    placeholder: 'e.g. Sarah Jenkins',
    required: true,
  },
  {
    name: 'role',
    label: 'Role / Designation',
    type: 'text',
    placeholder: 'e.g. VP of Engineering',
    required: true,
  },
  {
    name: 'company',
    label: 'Company / Organization',
    type: 'text',
    placeholder: 'e.g. Linear, Vercel',
    required: true,
  },
  {
    name: 'email',
    label: 'Corporate / Contact Email',
    type: 'text',
    placeholder: 'sarah.jenkins@company.com',
    required: true,
  },
];

export default function AdminReferencesPage() {
  const [refList, setRefList] = useState<Reference[]>(references);
  const [selectedRef, setSelectedRef] = useState<Reference | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadReferences() {
      try {
        const res = await fetch('/api/references');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setRefList(json.data);
          }
        }
      } catch (err) {
        console.warn('API fetch references warning:', err);
      }
    }
    loadReferences();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setSelectedRef(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Reference) => {
    setSelectedRef(item);
    setIsModalOpen(true);
  };

  const handleSave = async (saved: any) => {
    if (selectedRef) {
      setRefList((prev) =>
        prev.map((r) =>
          r.name === selectedRef.name && r.email === selectedRef.email ? saved : r
        )
      );
      showNotification(`Reference "${saved.name}" was updated.`);

      try {
        const targetId = (selectedRef as any).id || selectedRef.email;
        await fetch(`/api/references/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved),
        });
      } catch (err) {
        console.warn('API update reference error:', err);
      }
    } else {
      setRefList((prev) => [saved, ...prev]);
      showNotification(`Reference "${saved.name}" was added.`);

      try {
        const res = await fetch('/api/references', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.id) {
            setRefList((prev) =>
              prev.map((r) =>
                r.name === saved.name && r.email === saved.email
                  ? { ...r, id: json.data.id }
                  : r
              )
            );
          }
        }
      } catch (err) {
        console.warn('API create reference error:', err);
      }
    }
    setIsModalOpen(false);
    setSelectedRef(null);
  };

  const handleDelete = async (item: Reference) => {
    setRefList((prev) => prev.filter((r) => r.name !== item.name || r.email !== item.email));
    showNotification(`Reference "${item.name}" was deleted.`);

    try {
      const targetId = (item as any).id || item.email;
      await fetch(`/api/references/${targetId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('API delete reference error:', err);
    }
  };

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
        title="Professional References"
        description="Manage professional colleagues, recommendations, and contact information mapped to the @Reference model."
        model="Reference"
        actionLabel="Add Reference"
        onAction={handleOpenCreate}
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
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <AdminDynamicModal<any>
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRef(null);
        }}
        onSave={handleSave}
        initialData={selectedRef}
        title="Reference"
        model="Reference"
        fields={REF_FIELDS}
        schema={referenceSchema}
      />
    </div>
  );
}
