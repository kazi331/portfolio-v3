'use client';

import {
  Award,
  BookOpen,
  Briefcase,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Posts', href: '/admin/posts', icon: FileText },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Skills', href: '/admin/skills', icon: Award },
  { name: 'Experiences', href: '/admin/experiences', icon: Briefcase },
  { name: 'API docs', href: '/scalar', icon: BookOpen },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <aside className="z-20 flex w-full shrink-0 flex-col border-b border-white/10 bg-surface/90 backdrop-blur-md md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="px-6 pb-4 pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-secondary">
          Workspace
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-primary-text">
          Admin
        </h1>
      </div>

      <nav className="px-3 pb-3 md:flex-1">
        <ul className="flex gap-2 overflow-x-auto md:block md:space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.name} className="shrink-0">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-[10px_2px_10px_2px] px-4 py-3 font-mono text-[11px] uppercase tracking-wider transition ${isActive
                      ? 'border border-accent/40 bg-accent/15 text-accent-secondary'
                      : 'border border-transparent text-muted-text hover:bg-white/5 hover:text-primary-text'
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-[10px_2px_10px_2px] px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-muted-text transition hover:bg-white/5 hover:text-primary-text"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
