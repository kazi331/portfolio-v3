'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CourseForm from '@/components/admin/CourseForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';

export default function InterceptedNewCourseModal() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleDismiss = () => {
    router.back();
  };

  // On mobile: Fullscreen edge-to-edge page layout
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0D14] w-screen h-screen overflow-y-auto animate-in fade-in duration-200">
        <CourseForm
          isParallelModal={true}
          onCancel={handleDismiss}
          onSaveSuccess={() => {
            router.back();
            router.refresh();
          }}
        />
      </div>
    );
  }

  // On desktop: Spacious high-depth panel
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-5xl h-[92vh] rounded-[16px_4px_16px_4px] border border-white/10 bg-[#0A0D14] shadow-2xl overflow-y-auto">
        <CourseForm
          isParallelModal={true}
          onCancel={handleDismiss}
          onSaveSuccess={() => {
            router.back();
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
