'use client';

import { authClient } from '@/lib/auth-client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage =
    pathname === '/admin/login' ||
    pathname === '/admin/register' ||
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/admin/register');

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userData, setUserData] = useState<{ name?: string | null; email?: string | null } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_sidebar_collapsed');
      if (stored !== null) {
        setIsCollapsed(stored === 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  useEffect(() => {
    if (isAuthPage) return;

    const fetchSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data?.user) {
          setUserData({
            name: session.data.user.name,
            email: session.data.user.email,
          });
        }
      } catch (err) {
        console.warn('Session check warning:', err);
      }
    };

    fetchSession();
  }, [isAuthPage]);

  // Auth pages render clean full-screen layout without sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0A0C0F] text-[#F1F3F5] flex">
      {/* Collapsible Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        userName={userData?.name}
        userEmail={userData?.email}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCollapsed ? 'md:pl-18' : 'md:pl-64'
        }`}
      >
        <AdminHeader
          onOpenMobile={() => setMobileOpen(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          userName={userData?.name}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
