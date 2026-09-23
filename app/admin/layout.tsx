import AdminSidebar from '@/components/admin/AdminSidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('better-auth.session_token');

  if (!sessionToken) {
    redirect('/login');
  }

  return (
    <div className="relative min-h-screen bg-background text-primary-text">
      <div className="tech-grid pointer-events-none fixed inset-0" />
      <div className="pointer-events-none fixed -left-32 top-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative flex min-h-screen flex-col md:flex-row">
        <AdminSidebar />
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
