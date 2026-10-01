'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CourseForm from '@/components/admin/CourseForm';
import { getCourseById } from '@/lib/admin/courses-store';
import { Course } from '@/types/course';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditCoursePage() {
  const params = useParams();
  const id = params?.id as string;
  const [course, setCourse] = useState<Course | null | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const found = getCourseById(id);
      setCourse(found || null);
    }
  }, [id]);

  if (course === undefined) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8 text-muted-text font-mono text-xs">
        Loading course configuration...
      </div>
    );
  }

  if (course === null) {
    return (
      <div className="max-w-xl mx-auto my-12 rounded-[12px_3px_12px_3px] border border-white/10 bg-[#0E121B] p-8 text-center space-y-4">
        <AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold font-display text-white">Course Not Found</h2>
        <p className="font-mono text-xs text-muted-text">
          The requested course record with identifier &ldquo;{id}&rdquo; does not exist.
        </p>
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-2 rounded-[6px_2px_6px_2px] bg-white/10 px-4 py-2 font-mono text-xs text-white hover:bg-white/20 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <CourseForm initialData={course} isParallelModal={false} />
    </div>
  );
}
