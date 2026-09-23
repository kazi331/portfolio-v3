'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    featured: false,
    stacks: '',
    thumbnail: '',
    excerpt: '',
    githubUrl: '',
    clientLive: '',
    apiLive: '',
    challenge: '',
    solution: '',
    impact: '',
  });

  useEffect(() => {
    fetchProject();
  }, [params.id, fetchProject]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        const project = data.project;
        setFormData({
          title: project.title,
          slug: project.slug,
          featured: project.featured,
          stacks: project.stacks,
          thumbnail: project.thumbnail,
          excerpt: project.excerpt,
          githubUrl: project.githubUrl || '',
          clientLive: project.clientLive || '',
          apiLive: project.apiLive || '',
          challenge: project.challenge || '',
          solution: project.solution || '',
          impact: project.impact || '',
        });
      } else {
        setError(data.error || 'Failed to fetch project');
      }
    } catch (err) {
      setError('An error occurred while fetching the project');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          links: {
            github: formData.githubUrl,
            clientLive: formData.clientLive,
            apiLive: formData.apiLive,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/projects');
      } else {
        setError(data.error || 'Failed to update project');
      }
    } catch (err) {
      setError('An error occurred while updating the project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/projects"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Projects
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Project</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
            Featured Project
          </label>
        </div>

        <div>
          <label htmlFor="stacks" className="block text-sm font-medium text-gray-700 mb-1">
            Tech Stacks (comma-separated) *
          </label>
          <input
            id="stacks"
            name="stacks"
            type="text"
            value={formData.stacks}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail URL *
          </label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="url"
            value={formData.thumbnail}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt *
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub URL
            </label>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="clientLive" className="block text-sm font-medium text-gray-700 mb-1">
              Client Live URL
            </label>
            <input
              id="clientLive"
              name="clientLive"
              type="url"
              value={formData.clientLive}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="apiLive" className="block text-sm font-medium text-gray-700 mb-1">
              API Live URL
            </label>
            <input
              id="apiLive"
              name="apiLive"
              type="url"
              value={formData.apiLive}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="challenge" className="block text-sm font-medium text-gray-700 mb-1">
            Challenge
          </label>
          <textarea
            id="challenge"
            name="challenge"
            value={formData.challenge}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-1">
            Solution
          </label>
          <textarea
            id="solution"
            name="solution"
            value={formData.solution}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-1">
            Impact
          </label>
          <textarea
            id="impact"
            name="impact"
            value={formData.impact}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/projects"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
