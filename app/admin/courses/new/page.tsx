'use client';

import React from 'react';
import CourseForm from '@/components/admin/CourseForm';

export default function NewCoursePage() {
  return (
    <div className="min-h-screen py-4 sm:py-6">
      <CourseForm isParallelModal={false} />
    </div>
  );
}
