'use client';

import { authClient } from '@/lib/auth-client';
import {
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  FolderGit2,
  GraduationCap,
  Layers,
  MessageSquare,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
  UserCheck,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface ModelStat {
  title: string;
  count: number | string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  model: string;
  description: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const response = await authClient.getSession();
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.warn('Auth check error:', err);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const modelStats: ModelStat[] = [
    {
      title: 'Projects',
      count: '4',
      href: '/admin/projects',
      icon: FolderGit2,
      color: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
      model: 'Project',
      description: 'Portfolio featured builds & case studies',
    },
    {
      title: 'Blog Posts',
      href: '/admin/posts',
      count: '7',
      icon: FileText,
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
      model: 'Post',
      description: 'Engineering logs, deep-dives & tutorials',
    },
    {
      title: 'Tech Stack',
      count: '24',
      href: '/admin/stack',
      icon: Layers,
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10',
      model: 'Stack',
      description: 'Technologies & 3D orbital sphere nodes',
    },
    {
      title: 'Work Experience',
      count: '4',
      href: '/admin/experience',
      icon: Building2,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
      model: 'Experience',
      description: 'Career positions & engineering impact',
    },
    {
      title: 'Skills & Categories',
      count: '32',
      href: '/admin/skills',
      icon: Cpu,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
      model: 'Skill, SkillCategory',
      description: 'Domain taxonomies & competency levels',
    },
    {
      title: 'Comments',
      count: '18',
      href: '/admin/comments',
      icon: MessageSquare,
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
      model: 'Comment',
      description: 'Community interactions & moderation',
    },
    {
      title: 'Education',
      count: '2',
      href: '/admin/education',
      icon: GraduationCap,
      color: 'text-pink-400 border-pink-500/20 bg-pink-500/10',
      model: 'Education',
      description: 'Degrees, colleges & academic credentials',
    },
    {
      title: 'Courses',
      count: '5',
      href: '/admin/courses',
      icon: BookOpen,
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
      model: 'Course',
      description: 'Curriculum records & syllabus modules',
    },
    {
      title: 'Certifications',
      count: '5',
      href: '/admin/certifications',
      icon: Award,
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
      model: 'Certification',
      description: 'Verified certificates & completion links',
    },
    {
      title: 'References',
      count: '2',
      href: '/admin/references',
      icon: Users,
      color: 'text-teal-400 border-teal-500/20 bg-teal-500/10',
      model: 'Reference',
      description: 'Professional recommendations & contacts',
    },
    {
      title: 'Tags',
      count: '15',
      href: '/admin/tags',
      icon: Tag,
      color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10',
      model: 'Tag',
      description: 'Content classification & taxonomy labels',
    },
    {
      title: 'Reactions',
      count: '142',
      href: '/admin/reactions',
      icon: Sparkles,
      color: 'text-orange-400 border-orange-500/20 bg-orange-500/10',
      model: 'Reaction',
      description: 'Reader feedback & sentiment analytics',
    },
    {
      title: 'Users & Security',
      count: 'Active',
      href: '/admin/users',
      icon: UserCheck,
      color: 'text-green-400 border-green-500/20 bg-green-500/10',
      model: 'User, Passkey, Session',
      description: 'RBAC, Passkeys & Session security',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-[16px_4px_16px_4px] border border-white/10 bg-gradient-to-r from-[#121722] via-[#0E121A] to-[#0A0D13] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Control Hub • Prisma v7 ORM</span>
            </div>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {user?.name || 'Administrator'}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-text max-w-xl leading-relaxed">
              Manage schema models, portfolio projects, engineering blog articles, tech stack nodes, and authentication settings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 rounded-[8px_2px_8px_2px] bg-accent px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-accent-secondary transition shadow-md cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Link>
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-2 rounded-[8px_2px_8px_2px] border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>Write Post</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Database Schema Models Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-accent" />
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              Database Entities & Schema Models
            </h2>
          </div>
          <span className="font-mono text-[10px] text-muted-text">
            12 Prisma Entities Configured
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modelStats.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative flex flex-col justify-between rounded-[12px_3px_12px_3px] border border-white/10 bg-[#0F131C]/90 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-[#141926] shadow-sm hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-[8px_2px_8px_2px] border ${item.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-white group-hover:text-accent transition-colors">
                      {item.count}
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-white group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-text line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-muted-text/80">
                  <span className="text-accent-secondary/90 truncate">@{item.model}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform text-white">
                    Manage →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* System Status & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Model Shortcuts */}
        <div className="lg:col-span-2 rounded-[14px_3px_14px_3px] border border-white/10 bg-[#0F131C] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              Quick Management Shortcuts
            </h3>
            <span className="font-mono text-[10px] text-muted-text">Direct Access</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <Link
              href="/admin/projects"
              className="flex items-center gap-2 rounded-[8px_2px_8px_2px] border border-white/5 bg-white/5 p-2.5 font-mono text-xs text-muted-text hover:text-white hover:bg-white/10 hover:border-white/15 transition"
            >
              <FolderGit2 className="h-3.5 w-3.5 text-blue-400" />
              <span className="truncate">Manage Projects</span>
            </Link>
            <Link
              href="/admin/posts"
              className="flex items-center gap-2 rounded-[8px_2px_8px_2px] border border-white/5 bg-white/5 p-2.5 font-mono text-xs text-muted-text hover:text-white hover:bg-white/10 hover:border-white/15 transition"
            >
              <FileText className="h-3.5 w-3.5 text-indigo-400" />
              <span className="truncate">Manage Posts</span>
            </Link>
            <Link
              href="/admin/stack"
              className="flex items-center gap-2 rounded-[8px_2px_8px_2px] border border-white/5 bg-white/5 p-2.5 font-mono text-xs text-muted-text hover:text-white hover:bg-white/10 hover:border-white/15 transition"
            >
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span className="truncate">Tech Stack</span>
            </Link>
            <Link
              href="/admin/experience"
              className="flex items-center gap-2 rounded-[8px_2px_8px_2px] border border-white/5 bg-white/5 p-2.5 font-mono text-xs text-muted-text hover:text-white hover:bg-white/10 hover:border-white/15 transition"
            >
              <Building2 className="h-3.5 w-3.5 text-amber-400" />
              <span className="truncate">Experience</span>
            </Link>
            <Link
              href="/admin/skills"
              className="flex items-center gap-2 rounded-[8px_2px_8px_2px] border border-white/5 bg-white/5 p-2.5 font-mono text-xs text-muted-text hover:text-white hover:bg-white/10 hover:border-white/15 transition"
            >
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              <span className="truncate">Skills Catalog</span>
            </Link>
            <Link
              href="/admin/security"
              className="flex items-center gap-2 rounded-[8px_2px_8px_2px] border border-white/5 bg-white/5 p-2.5 font-mono text-xs text-muted-text hover:text-white hover:bg-white/10 hover:border-white/15 transition"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
              <span className="truncate">Auth & Passkeys</span>
            </Link>
          </div>
        </div>

        {/* Database & Environment Status */}
        <div className="rounded-[14px_3px_14px_3px] border border-white/10 bg-[#0F131C] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              Environment
            </h3>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-text">ORM Engine:</span>
              <span className="font-semibold text-white">Prisma v7.10.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-text">Driver Adapter:</span>
              <span className="font-semibold text-accent">@prisma/adapter-pg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-text">Runtime:</span>
              <span className="font-semibold text-white">Next.js 15+ App Router</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-text">Auth System:</span>
              <span className="font-semibold text-emerald-400">Better-Auth + Passkeys</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
