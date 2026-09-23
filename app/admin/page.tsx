import { prisma } from '@/lib/prisma';
import {
  Award,
  Briefcase,
  FileText,
  FolderKanban
} from 'lucide-react';
import { div } from 'motion/react-client';
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
      name: 'Total Posts',
      value: postsCount,
      icon: FileText,
      color: 'bg-blue-500',
      href: '/admin/posts',
    },
    {
      name: 'Total Projects',
      value: projectsCount,
      icon: FolderKanban,
      color: 'bg-green-500',
      href: '/admin/projects',
    },
    {
      name: 'Total Skills',
      value: skillsCount,
      icon: Award,
      color: 'bg-purple-500',
      href: '/admin/skills',
    },
    {
      name: 'Total Experiences',
      value: experiencesCount,
      icon: Briefcase,
      color: 'bg-orange-500',
      href: '/admin/experiences',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <a
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/posts/new"
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            New Post
          </Link>
          <Link
            href="/admin/projects/new"
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FolderKanban className="h-5 w-5 mr-2" />
            New Project
          </Link>
          <Link
            href="/admin/skills/new"
            className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Award className="h-5 w-5 mr-2" />
            New Skill
          </Link>
          <Link
            href="/admin/experiences/new"
            className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Briefcase className="h-5 w-5 mr-2" />
            New Experience
          </Link>
        </div>
      </div>
    </div>
  );
}
