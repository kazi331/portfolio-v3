'use client';

import React, { useState, useEffect } from 'react';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDynamicModal, { FormFieldDef } from '@/components/admin/AdminDynamicModal';
import { educationSchema } from '@/lib/admin/validation';
import { educations } from '@/lib/data';
import { Education } from '@/types/portfolio';
import { Calendar, GraduationCap, CheckCircle2 } from 'lucide-react';

const EDUCATION_FIELDS: FormFieldDef[] = [
  {
    name: 'degree',
    label: 'Degree / Certificate',
    type: 'text',
    placeholder: 'e.g. Bachelor of Science in Computer Science',
    required: true,
  },
  {
    name: 'institution',
    label: 'Institution / University',
    type: 'text',
    placeholder: 'e.g. Stanford University',
    required: true,
  },
  {
    name: 'period',
    label: 'Graduation Year / Timeline',
    type: 'text',
    placeholder: 'e.g. 2018 - 2022',
    required: true,
  },
];

export default function AdminEducationPage() {
  const [eduList, setEduList] = useState<Education[]>(educations);
  const [selectedEdu, setSelectedEdu] = useState<Education | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadEducation() {
      try {
        const res = await fetch('/api/education');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setEduList(json.data);
          }
        }
      } catch (err) {
        console.warn('API fetch education warning:', err);
      }
    }
    loadEducation();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setSelectedEdu(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Education) => {
    setSelectedEdu(item);
    setIsModalOpen(true);
  };

  const handleSave = async (saved: any) => {
    if (selectedEdu) {
      setEduList((prev) =>
        prev.map((e) =>
          e.degree === selectedEdu.degree && e.institution === selectedEdu.institution ? saved : e
        )
      );
      showNotification(`Education "${saved.degree}" was updated.`);

      try {
        const targetId = (selectedEdu as any).id || selectedEdu.degree;
        await fetch(`/api/education/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved),
        });
      } catch (err) {
        console.warn('API update education error:', err);
      }
    } else {
      setEduList((prev) => [saved, ...prev]);
      showNotification(`Education "${saved.degree}" was added.`);

      try {
        const res = await fetch('/api/education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.id) {
            setEduList((prev) =>
              prev.map((e) =>
                e.degree === saved.degree && e.institution === saved.institution
                  ? { ...e, id: json.data.id }
                  : e
              )
            );
          }
        }
      } catch (err) {
        console.warn('API create education error:', err);
      }
    }
    setIsModalOpen(false);
    setSelectedEdu(null);
  };

  const handleDelete = async (item: Education) => {
    if (confirm(`Remove degree "${item.degree}"?`)) {
      setEduList((prev) => prev.filter((e) => e.degree !== item.degree || e.institution !== item.institution));
      showNotification(`Degree "${item.degree}" was deleted.`);

      try {
        const targetId = (item as any).id || item.degree;
        await fetch(`/api/education/${targetId}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.warn('API delete education error:', err);
      }
    }
  };

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
        title="Academic Education"
        description="Manage university degrees, graduation timeline, and academic records mapped to the @Education model."
        model="Education"
        actionLabel="Add Degree"
        onAction={handleOpenCreate}
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
          value={eduList[0]?.degree || 'Bachelor Degree'}
          icon={GraduationCap}
          color="text-accent border-accent/20 bg-accent/10"
        />
      </div>

      <AdminDataTable
        columns={columns}
        data={eduList}
        searchKey="institution"
        searchPlaceholder="Search by institution..."
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <AdminDynamicModal<any>
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEdu(null);
        }}
        onSave={handleSave}
        initialData={selectedEdu}
        title="Education"
        model="Education"
        fields={EDUCATION_FIELDS}
        schema={educationSchema}
      />
    </div>
  );
}
