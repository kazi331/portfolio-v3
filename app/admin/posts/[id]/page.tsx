'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    tags: '',
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${params.id}`);
        const data = await response.json();
        
        if (response.ok) {
          setFormData({
            title: data.post.title,
            slug: data.post.slug,
            category: data.post.category || '',
            excerpt: data.post.excerpt || '',
            content: data.post.content,
            thumbnail: data.post.thumbnail,
            tags: data.post.tags || '',
          });
        } else {
          setError(data.error || 'Failed to fetch post');
        }
      } catch (err) {
        setError('An error occurred while fetching the post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/posts');
      } else {
        setError(data.error || 'Failed to update post');
      }
    } catch (err) {
      setError('An error occurred while updating the post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center font-mono text-[11px] uppercase tracking-widest text-muted-text">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-text transition hover:text-primary-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Link>
      </div>

      <h1 className="mb-6 font-display text-3xl font-bold tracking-tight text-primary-text">Edit Post</h1>

      {error && (
        <div className="mb-4 rounded-[10px_2px_10px_2px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="radius-card space-y-6 border border-white/10 bg-surface-raised p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div>
            <label htmlFor="slug" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
              Slug *
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label htmlFor="thumbnail" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Thumbnail URL *
          </label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="url"
            value={formData.thumbnail}
            onChange={handleChange}
            required
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label htmlFor="tags" className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-text">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            className="w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/posts"
            className="rounded-[12px_3px_12px_3px] border border-white/12 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-text transition hover:border-white/25 hover:text-primary-text"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-[12px_3px_12px_3px] border border-accent/40 bg-accent/15 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-accent-secondary transition hover:border-accent hover:bg-accent/25 hover:text-primary-text disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
