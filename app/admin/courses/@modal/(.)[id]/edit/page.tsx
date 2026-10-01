'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CourseForm from '@/components/admin/CourseForm';
import { getCourseById } from '@/lib/admin/courses-store';
import { Course } from '@/types/course';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function InterceptedEditCourseModal() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isMobile = useIsMobile();
  const [course, setCourse] = useState<Course | null | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const found = getCourseById(id);
      setCourse(found || null);
    }
  }, [id]);

  const handleDismiss = () => {
    router.back();
  };

  const content = () => {
    if (course === undefined) {
      return (
        <div className="flex h-64 items-center justify-center text-muted-text font-mono text-xs">
          Loading course data...
        </div>
      );
    }

    if (course === null) {
      return (
        <div className="p-8 text-center space-y-3">
          <AlertCircle className="h-7 w-7 text-red-400 mx-auto" />
          <h2 className="text-base font-bold text-white">Course Not Found</h2>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded px-3 py-1.5 font-mono text-xs text-white bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            Back to Courses
          </button>
        </div>
      );
    }

    return (
      <CourseForm
        initialData={course}
        isParallelModal={true}
        onCancel={handleDismiss}
        onSaveSuccess={() => {
          router.back();
          router.refresh();
        }}
      />
    );
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0D14] w-screen h-screen overflow-y-auto animate-in fade-in duration-200">
        {content()}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-5xl h-[92vh] rounded-[16px_4px_16px_4px] border border-white/10 bg-[#0A0D14] shadow-2xl overflow-y-auto">
        {content()}
      </div>
    </div>
  );
}
