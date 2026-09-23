import { prisma } from '@/lib/prisma';
import { Award, Briefcase, FileText, FolderKanban } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [postsCount, projectsCount, skillsCount, experiencesCount] = await Promise.all([
    prisma.post.count(),
    prisma.project.count(),
    prisma.skill.count(),
    prisma.experience.count(),
  ]);

  const stats = [
    {
      name: 'Posts',
      value: postsCount,
      icon: FileText,
      href: '/admin/posts',
    },
    {
      name: 'Projects',
      value: projectsCount,
      icon: FolderKanban,
      href: '/admin/projects',
    },
    {
      name: 'Skills',
      value: skillsCount,
      icon: Award,
      href: '/admin/skills',
    },
    {
      name: 'Experiences',
      value: experiencesCount,
      icon: Briefcase,
      href: '/admin/experiences',
    },
  ];

  const actions = [
    { href: '/admin/posts/new', label: 'New Post', icon: FileText },
    { href: '/admin/projects/new', label: 'New Project', icon: FolderKanban },
    { href: '/admin/skills/new', label: 'New Skill', icon: Award },
    { href: '/admin/experiences/new', label: 'New Experience', icon: Briefcase },
  ];

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-secondary">
        Overview
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-primary-text">
        Dashboard
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-text">
        Posts, projects, skills, and experience records for the public site.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="radius-card border border-white/10 bg-surface-raised p-5 transition hover:border-accent/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-text">
                  {stat.name}
                </p>
                <p className="mt-3 font-display text-3xl font-bold text-primary-text">
                  {stat.value}
                </p>
              </div>
              <div className="rounded-[10px_2px_10px_2px] border border-accent/30 bg-accent/15 p-3 text-accent-secondary">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="radius-card mt-6 border border-white/10 bg-surface-raised p-6">
        <h2 className="font-display text-xl font-semibold text-primary-text">Quick actions</h2>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex items-center justify-center gap-2 rounded-[12px_3px_12px_3px] border border-accent/40 bg-accent/15 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-accent-secondary transition hover:border-accent hover:bg-accent/25 hover:text-primary-text"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
