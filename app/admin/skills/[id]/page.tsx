'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string | null;
  slug: string | null;
}

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    level: 50,
    categoryId: '',
  });

  useEffect(() => {
    Promise.all([fetchSkill(), fetchCategories()]);
  }, [params.id]);

  const fetchSkill = async () => {
    try {
      const response = await fetch(`/api/admin/skills/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setFormData({
          name: data.skill.name,
          level: data.skill.level,
          categoryId: data.skill.categoryId,
        });
      } else {
        setError(data.error || 'Failed to fetch skill');
      }
    } catch (err) {
      setError('An error occurred while fetching the skill');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/skill-categories');
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/skills/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/skills');
      } else {
        setError(data.error || 'Failed to update skill');
      }
    } catch (err) {
      setError('An error occurred while updating the skill');
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
          href="/admin/skills"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Skills
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Skill</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Skill Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name || 'Unnamed Category'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
            Proficiency Level: {formData.level}%
          </label>
          <input
            id="level"
            name="level"
            type="range"
            min="0"
            max="100"
            value={formData.level}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/skills"
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
