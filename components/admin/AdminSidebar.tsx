'use client';

import {
    Award,
    Briefcase,
    FileText,
    FolderKanban,
    LayoutDashboard,
    LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Posts', href: '/admin/posts', icon: FileText },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Skills', href: '/admin/skills', icon: Award },
  { name: 'Experiences', href: '/admin/experiences', icon: Briefcase },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 w-64 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}
