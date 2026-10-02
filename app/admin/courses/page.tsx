'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { Course } from '@/types/course';
import { getStoredCourses, deleteCourse } from '@/lib/admin/courses-store';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Layers,
  Plus,
  Sparkles,
  Star,
} from 'lucide-react';

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setCourses(getStoredCourses());

    const handleStorageChange = () => {
      setCourses(getStoredCourses());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDelete = (course: Course) => {
    const updated = deleteCourse(course.id);
    setCourses(updated);
    showNotification(`Course "${course.title}" was deleted.`);
  };

  const columns: Column<Course>[] = [
    {
      header: 'Course & Platform',
      accessorKey: 'title',
      cell: (item) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <span>{item.title}</span>
            {item.featured && (
              <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="rounded-[4px_1px_4px_1px] border border-white/10 bg-white/5 px-1.5 py-0.2 font-mono text-[9px] text-accent">
              {item.platform}
            </span>
            <span className="font-mono text-[10px] text-muted-text">/courses/{item.slug}</span>
          </div>
        </div>
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
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => (
        <span
          className={`inline-flex items-center gap-1 rounded-[4px_1px_4px_1px] px-2 py-0.5 font-mono text-[10px] ${
            item.status === 'Completed'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              : item.status === 'In Progress'
              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
              : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
          }`}
        >
          {item.status === 'Completed' ? (
            <CheckCircle2 className="h-2.5 w-2.5" />
          ) : (
            <Clock className="h-2.5 w-2.5" />
          )}
          {item.status}
        </span>
      ),
    },
    {
      header: 'Timeline & Duration',
      accessorKey: 'completionDate',
      cell: (item) => (
        <div className="flex flex-col font-mono text-[11px] text-muted-text">
          <span className="flex items-center gap-1 text-white/90">
            <Calendar className="h-3 w-3 text-muted-text" /> {item.completionDate}
          </span>
          {item.duration && (
            <span className="text-[10px] text-muted-text/80">{item.duration}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Credential',
      accessorKey: 'certificateUrl',
      cell: (item) =>
        item.certificateUrl ? (
          <a
            href={item.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:underline"
          >
            <ExternalLink className="h-3 w-3" /> Certificate
          </a>
        ) : (
          <span className="font-mono text-[10px] text-muted-text/60 italic">Self-Study</span>
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
        title="Courses & Professional Training"
        description="Comprehensive curriculum records, syllabus modules, practical lab credentials, and engineering academies mapped to @Course."
        model="Course"
        actionLabel="Add New Course"
        onAction={() => router.push('/admin/courses/new')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <AdminStatCard
          label="Total Courses"
          value={courses.length}
          icon={BookOpen}
          color="text-indigo-400 border-indigo-500/20 bg-indigo-500/10"
        />
        <AdminStatCard
          label="Completed"
          value={courses.filter((c) => c.status === 'Completed').length}
          icon={CheckCircle2}
          color="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
        <AdminStatCard
          label="Active / Ongoing"
          value={courses.filter((c) => c.status === 'In Progress').length}
          icon={Clock}
          color="text-blue-400 border-blue-500/20 bg-blue-500/10"
        />
        <AdminStatCard
          label="Academies"
          value={new Set(courses.map((c) => c.platform)).size}
          icon={GraduationCap}
          color="text-accent border-accent/20 bg-accent/10"
        />
      </div>

      <AdminDataTable
        columns={columns}
        data={courses}
        searchKey="title"
        searchPlaceholder="Search courses by title..."
        onEdit={(item) => router.push(`/admin/courses/${item.id}/edit`)}
        onDelete={handleDelete}
        onView={(item) => {
          if (item.certificateUrl) window.open(item.certificateUrl, '_blank');
        }}
      />
    </div>
  );
}
