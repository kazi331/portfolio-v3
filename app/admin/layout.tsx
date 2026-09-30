import AdminShell from '@/components/admin/AdminShell';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0A0C0F] text-primary-text selection:bg-accent/20 selection:text-white">
      {/* Background CAD tech grid */}
      <div className="tech-grid pointer-events-none fixed inset-0 opacity-20" />
      <div className="pointer-events-none fixed -left-32 top-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-24 bottom-0 h-72 w-72 rounded-full bg-accent-secondary/5 blur-3xl" />

      <AdminShell>{children}</AdminShell>
    </div>
  );
}
