'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import {
  Award,
  BookOpen,
  Building2,
  Cpu,
  ExternalLink,
  FileText,
  FolderGit2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Tag as TagIcon,
  UserCheck,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';


export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  description?: string;
  model: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    group: 'Overview',
    items: [
      {
        name: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        description: 'System metrics & overview',
        model: 'Dashboard',
      },
    ],
  },
  {
    group: 'Portfolio & Works',
    items: [
      {
        name: 'Projects',
        href: '/admin/projects',
        icon: FolderGit2,
        description: 'Portfolio projects and case studies',
        model: 'Project',
        badge: '4',
      },
      {
        name: 'Tech Stack',
        href: '/admin/stack',
        icon: Layers,
        description: 'Technologies & 3D sphere nodes',
        model: 'Stack',
        badge: '24',
      },
      {
        name: 'Experience',
        href: '/admin/experience',
        icon: Building2,
        description: 'Work history & responsibilities',
        model: 'Experience',
        badge: '4',
      },
      {
        name: 'Skills & Categories',
        href: '/admin/skills',
        icon: Cpu,
        description: 'Technical skills & domain grouping',
        model: 'Skill, SkillCategory',
        badge: '32',
      },
    ],
  },
  {
    group: 'Editorial & Content',
    items: [
      {
        name: 'Blog Posts',
        href: '/admin/posts',
        icon: FileText,
        description: 'Articles, tutorials & engineering logs',
        model: 'Post',
        badge: '7',
      },
      {
        name: 'Comments',
        href: '/admin/comments',
        icon: MessageSquare,
        description: 'User commentary & moderation',
        model: 'Comment',
        badge: '18',
      },
      {
        name: 'Tags',
        href: '/admin/tags',
        icon: TagIcon,
        description: 'Content tags & topics',
        model: 'Tag',
        badge: '15',
      },
      {
        name: 'Reactions',
        href: '/admin/reactions',
        icon: Sparkles,
        description: 'Post reactions & reader sentiment',
        model: 'Reaction',
        badge: '142',
      },
    ],
  },
  {
    group: 'Credentials',
    items: [
      {
        name: 'Courses',
        href: '/admin/courses',
        icon: BookOpen,
        description: 'Curriculum & professional training',
        model: 'Course',
        badge: '5',
      },
      {
        name: 'Education',
        href: '/admin/education',
        icon: GraduationCap,
        description: 'Academic degrees & institutions',
        model: 'Education',
        badge: '2',
      },
      {
        name: 'Certifications',
        href: '/admin/certifications',
        icon: Award,
        description: 'Verified industry licenses',
        model: 'Certification',
        badge: '5',
      },
      {
        name: 'References',
        href: '/admin/references',
        icon: Users,
        description: 'Professional recommendations',
        model: 'Reference',
        badge: '2',
      },
    ],
  },
  {
    group: 'Identity & Security',
    items: [
      {
        name: 'Users',
        href: '/admin/users',
        icon: UserCheck,
        description: 'Registered users & accounts',
        model: 'User',
      },
      {
        name: 'Security & Auth',
        href: '/admin/security',
        icon: ShieldCheck,
        description: 'Sessions, Passkeys & Accounts',
        model: 'Session, Passkey',
      },
    ],
  },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  userEmail?: string | null;
  userName?: string | null;
  onSignOut?: () => void;
}

export default function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  userEmail,
  userName,
  onSignOut,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const showLabel = !isCollapsed || isMobile;
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);

    if (onSignOut) {
      try {
        await onSignOut();
      } catch (err) {
        console.warn('Signout error:', err);
      } finally {
        setIsSigningOut(false);
      }
    } else {
      try {
        const { authClient } = await import('@/lib/auth-client');
        await authClient.signOut();
      } catch (err) {
        console.warn('Signout warning:', err);
      } finally {
        router.push('/admin/login');
      }
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-hidden bg-[#0D1015] border-r border-white/10 text-[#F1F3F5] select-none">
      {/* Top Header & Brand */}
      <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-4 h-16">
        {showLabel ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px_2px_6px_2px] bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold shadow-sm">
              K
            </div>
            <div className="flex flex-col truncate">
              <span className="font-display text-sm font-bold tracking-tight text-white truncate">
                Admin Console
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-text">
                Prisma v7 Schema
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-[6px_2px_6px_2px] bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold">
            K
          </div>
        )}

        {/* Desktop Collapse Toggle Button */}
        {/* <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-[6px_2px_6px_2px] border border-white/10 bg-white/5 text-muted-text hover:text-white hover:bg-white/10 transition cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5 text-accent" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5" />
          )}
        </button> */}
      </div>

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            {showLabel ? (
              <div className="px-2.5 pb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-text/70">
                {group.group}
              </div>
            ) : (
              <div className="my-2 border-t border-white/5 mx-1" />
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={isCollapsed ? `${item.name} (@${item.model})` : undefined}
                    className={`group relative flex items-center gap-3 rounded-[8px_2px_8px_2px] px-2.5 py-2 font-mono text-xs transition-all duration-150 ${isActive
                      ? 'bg-accent/15 text-accent border-l-2 border-accent font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                      : 'text-muted-text hover:bg-white/5 hover:text-white'
                      } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-accent' : 'text-muted-text group-hover:text-white'
                        }`}
                    />

                    {showLabel && (
                      <div className="flex flex-1 items-center justify-between truncate">
                        <span className="truncate tracking-wide">{item.name}</span>
                        {item.badge && (
                          <span
                            className={`ml-2 rounded-[4px_1px_4px_1px] px-1.5 py-0.5 text-[9px] font-mono ${isActive
                              ? 'bg-accent/20 text-accent border border-accent/30'
                              : 'bg-white/5 text-muted-text border border-white/10'
                              }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Active Pip in Collapsed Mode */}
                    {isCollapsed && isActive && (
                      <span className="absolute right-1 top-1.5 h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom User Area & Actions */}
      <div className="border-t border-white/10 p-3 space-y-2 bg-[#090C0F]">
        {/* Live Site Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2.5 rounded-[8px_2px_8px_2px] border border-white/10 bg-white/5 px-2.5 py-2 font-mono text-[11px] text-muted-text hover:text-white hover:bg-white/10 transition ${isCollapsed ? 'justify-center px-2' : ''
            }`}
          title="Open Public Site in New Tab"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-accent-secondary" />
          {showLabel && (
            <span className="truncate flex-1">View Public Site</span>
          )}
        </Link>

        {/* User Card & Sign Out */}
        <div
          className={`flex items-center justify-between rounded-[8px_2px_8px_2px] border border-white/5 bg-[#12161E] p-2 ${!showLabel ? 'flex-col gap-2' : 'gap-2'
            }`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-accent-secondary font-mono text-[10px] font-bold text-[#0A0C0F]">
              {userName ? userName.charAt(0).toUpperCase() : 'A'}
            </div>
            {showLabel && (
              <div className="flex flex-col truncate">
                <span className="truncate text-xs font-semibold text-white">
                  {userName || 'Administrator'}
                </span>
                <span className="truncate font-mono text-[9px] text-muted-text">
                  {userEmail || 'admin@session'}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px_2px_6px_2px] border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-100 transition cursor-pointer ${
              isSigningOut ? 'opacity-80 cursor-wait animate-pulse' : ''
            }`}
            title={isSigningOut ? 'Signing out...' : 'Sign Out'}
            aria-label="Sign Out"
          >
            {isSigningOut ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-red-400" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCollapsed ? 'w-18' : 'w-64'
          }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform bg-[#0D1015] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
