'use client';

import {
  Bell,
  ChevronRight,
  Database,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface AdminHeaderProps {
  onOpenMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userName?: string | null;
}

export default function AdminHeader({
  onOpenMobile,
  isCollapsed,
  onToggleCollapse,
  userName,
}: AdminHeaderProps) {
  const pathname = usePathname();

  // Generate breadcrumb items
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    const isLast = idx === segments.length - 1;
    const label =
      seg === 'admin'
        ? 'Dashboard'
        : seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');

    return { label, href, isLast };
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#090C0F]/90 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="flex h-9 w-9 items-center justify-center rounded-[6px_2px_6px_2px] border border-white/10 bg-white/5 text-muted-text hover:text-white md:hidden transition cursor-pointer"
          aria-label="Open Mobile Menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Desktop Collapse Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-[6px_2px_6px_2px] border border-white/10 bg-white/5 text-muted-text hover:text-white transition cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4 text-accent" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        {/* Breadcrumb Path */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-muted-text">
          <Link
            href="/admin"
            className="hover:text-white transition-colors"
          >
            Admin
          </Link>
          {breadcrumbs.length > 1 && (
            <>
              <ChevronRight className="h-3 w-3 text-white/20" />
              <span className="font-semibold text-white">
                {breadcrumbs[breadcrumbs.length - 1].label}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Header Actions & Database Status */}
      <div className="flex items-center gap-3">
        {/* Database Status Chip */}
        <div className="hidden lg:flex items-center gap-2 rounded-[6px_2px_6px_2px] border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] text-emerald-400 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <Database className="h-3 w-3" />
          <span>Prisma v7 • Active</span>
        </div>

        {/* Quick Search Shortcut Trigger */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-text" />
          <input
            type="text"
            placeholder="Quick search..."
            className="h-8 w-44 lg:w-56 rounded-[6px_2px_6px_2px] border border-white/10 bg-white/5 pl-8 pr-3 font-mono text-xs text-white placeholder:text-muted-text/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 rounded-[8px_2px_8px_2px] border border-white/10 bg-[#12161E] px-2.5 py-1 text-xs">
          <div className="h-2 w-2 rounded-full bg-accent" />
          <span className="font-mono text-[11px] font-semibold text-white">
            {userName || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
}
