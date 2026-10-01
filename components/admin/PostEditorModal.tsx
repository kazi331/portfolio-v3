'use client';

import React, { useState, useEffect, useId } from 'react';
import { BlogPost } from '@/types/portfolio';
import { postSchema, PostFormData } from '@/lib/admin/validation';
import { generateSlug, calculateReadTime } from '@/lib/admin/slug';
import {
  AI_BLOG_CATEGORIES,
  POPULAR_TECH_TAGS,
  COVER_IMAGE_PRESETS,
  AI_POST_TEMPLATES,
  BlogPostTemplate,
} from '@/lib/admin/blog-ai-data';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import {
  X,
  Sparkles,
  Eye,
  Edit3,
  Columns,
  Star,
  Calendar,
  Clock,
  Tag as TagIcon,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Code,
  FileCode,
  List,
  ListOrdered,
  Quote,
  Link2,
  Lightbulb,
  AlertCircle,
  FolderTree,
  ChevronDown,
} from 'lucide-react';
import Image from 'next/image';

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: BlogPost) => void;
  initialData?: BlogPost | null;
}

export default function PostEditorModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: PostEditorModalProps) {
  const isEditing = Boolean(initialData);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(AI_BLOG_CATEGORIES[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [readTime, setReadTime] = useState('3 min read');
  const [coverImage, setCoverImage] = useState(COVER_IMAGE_PRESETS[0].url);
  const [content, setContent] = useState('');
  const [featured, setFeatured] = useState(false);

  // Editor View State: 'write' | 'split' | 'preview'
  const [viewMode, setViewMode] = useState<'write' | 'split' | 'preview'>('split');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAiTemplates, setShowAiTemplates] = useState(false);
  const [showImagePresets, setShowImagePresets] = useState(false);

  // Sync with initialData when opened or changed
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setTitle(initialData.title || '');
      setSlug(initialData.slug || '');
      setAutoSlug(false); // In edit mode, preserve original slug unless requested
      setDescription(initialData.description || '');
      setCategory(initialData.category || AI_BLOG_CATEGORIES[0]);
      setTags(initialData.tags || ['TypeScript', 'Architecture']);
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setReadTime(initialData.readTime || '3 min read');
      setCoverImage(initialData.coverImage || COVER_IMAGE_PRESETS[0].url);
      setContent(initialData.content || '');
      setFeatured(Boolean(initialData.featured));
    } else {
      // Default new post
      setTitle('');
      setSlug('');
      setAutoSlug(true);
      setDescription('');
      setCategory(AI_BLOG_CATEGORIES[0]);
      setTags(['TypeScript', 'Architecture']);
      setDate(new Date().toISOString().split('T')[0]);
      setReadTime('3 min read');
      setCoverImage(COVER_IMAGE_PRESETS[0].url);
      setContent(
        `# Modern Architectural Principles\n\nStart writing technical documentation or load an AI template to get started...\n\n## Overview\n\nExplain the architectural problem statement and background here.\n\n\`\`\`typescript\n// Example code snippet\nexport const config = {\n  runtime: 'edge',\n};\n\`\`\`\n\n> [!TIP]\n> Key architectural takeaway for production deployments.`
      );
      setFeatured(false);
    }
    setErrors({});
  }, [isOpen, initialData]);

  // Handle title changes and dynamic slug generation
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (autoSlug) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Re-generate slug manually
  const handleRegenerateSlug = () => {
    const generated = generateSlug(title || 'untitled-post');
    setSlug(generated);
  };

  // Auto-calculate read time when content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    const computed = calculateReadTime(newContent);
    setReadTime(computed);
  };

  // Tag management
  const handleAddTag = (rawTag: string) => {
    const trimmed = rawTag.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Quick toolbar insertion helper
  const insertMarkdown = (before: string, after = '', placeholder = 'text') => {
    const textarea = document.getElementById('blog-markdown-textarea') as HTMLTextAreaElement | null;
    if (!textarea) {
      setContent((prev) => `${prev}\n${before}${placeholder}${after}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;
    const replacement = `${before}${selectedText}${after}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 10);
  };

  // Load AI Template
  const handleLoadAiTemplate = (tpl: BlogPostTemplate) => {
    setTitle(tpl.title);
    setSlug(generateSlug(tpl.title));
    setAutoSlug(true);
    setCategory(tpl.category);
    setTags(tpl.tags);
    setDescription(tpl.description);
    setCoverImage(tpl.coverImage);
    setContent(tpl.content);
    setReadTime(calculateReadTime(tpl.content));
    setShowAiTemplates(false);
  };

  // Form submission with Zod validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const candidateData: PostFormData = {
      title,
      slug: slug || generateSlug(title),
      description,
      category,
      tags,
      readTime: readTime || calculateReadTime(content),
      date,
      coverImage,
      content,
      featured,
    };

    const result = postSchema.safeParse(candidateData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const postRecord: BlogPost = {
      title: result.data.title,
      slug: result.data.slug,
      description: result.data.description,
      category: result.data.category,
      tags: result.data.tags,
      readTime: result.data.readTime,
      date: result.data.date,
      coverImage: result.data.coverImage,
      content: result.data.content,
      featured: result.data.featured,
    };

    onSave(postRecord);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-6xl h-[94vh] rounded-[16px_4px_16px_4px] border border-white/10 bg-[#0A0D14] text-[#F1F3F5] shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-[#0E121B] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[6px_2px_6px_2px] bg-accent/20 border border-accent/30 text-accent">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  Prisma Model • @Post
                </span>
                <span className="rounded-[4px_1px_4px_1px] border border-white/10 bg-white/5 px-1.5 py-0.2 font-mono text-[9px] text-muted-text">
                  {isEditing ? 'UPDATE MODE' : 'CREATE MODE'}
                </span>
              </div>
              <h2 className="text-base font-bold font-display text-white">
                {isEditing ? `Edit: ${title || 'Post'}` : 'Compose Technical Article'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* AI Template Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAiTemplates(!showAiTemplates)}
                className="inline-flex items-center gap-1.5 rounded-[6px_2px_6px_2px] border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-xs text-accent hover:bg-accent/20 transition cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Templates</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {showAiTemplates && (
                <div className="absolute right-0 mt-2 w-80 rounded-[10px_3px_10px_3px] border border-white/15 bg-[#121622] p-2 shadow-2xl z-50 space-y-1">
                  <div className="px-2 py-1 border-b border-white/10 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-text">
                      Pre-generated Technical Drafts
                    </span>
                  </div>
                  {AI_POST_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleLoadAiTemplate(tpl)}
                      className="w-full text-left rounded-[6px_2px_6px_2px] p-2 hover:bg-white/5 transition flex flex-col gap-0.5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-accent font-semibold">{tpl.badge}</span>
                        <span className="font-mono text-[9px] text-muted-text">{tpl.category}</span>
                      </div>
                      <span className="text-xs font-semibold text-white line-clamp-1">{tpl.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center rounded-[6px_2px_6px_2px] border border-white/10 bg-white/5 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('write')}
                className={`flex items-center gap-1 px-2.5 py-1 font-mono text-[11px] rounded-[4px_1px_4px_1px] transition ${
                  viewMode === 'write' ? 'bg-accent text-black font-semibold' : 'text-muted-text hover:text-white'
                }`}
                title="Code/Markdown Editor Only"
              >
                <Edit3 className="h-3 w-3" /> Write
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1 px-2.5 py-1 font-mono text-[11px] rounded-[4px_1px_4px_1px] transition ${
                  viewMode === 'split' ? 'bg-accent text-black font-semibold' : 'text-muted-text hover:text-white'
                }`}
                title="Split Side-by-Side Editor & Preview"
              >
                <Columns className="h-3 w-3" /> Split
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 font-mono text-[11px] rounded-[4px_1px_4px_1px] transition ${
                  viewMode === 'preview' ? 'bg-accent text-black font-semibold' : 'text-muted-text hover:text-white'
                }`}
                title="Full Markdown Preview"
              >
                <Eye className="h-3 w-3" /> Preview
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-[6px_2px_6px_2px] p-1.5 text-muted-text hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Top Row: Title, Auto-Slug, Category & Featured */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Title & Slug Generator (Col 8) */}
              <div className="md:col-span-8 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-xs font-semibold text-white">
                      Article Title <span className="text-red-400">*</span>
                    </label>
                    <span className="font-mono text-[10px] text-muted-text">
                      {title.length}/160
                    </span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Architecting Distributed Systems with Next.js & WebSockets"
                    className={`h-10 w-full rounded-[8px_2px_8px_2px] border bg-[#0E121B] px-3 font-mono text-sm text-white placeholder:text-muted-text/50 focus:outline-none transition ${
                      errors.title ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-accent'
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 font-mono text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.title}
                    </p>
                  )}
                </div>

                {/* Auto-Generated Slug Bar */}
                <div className="rounded-[8px_2px_8px_2px] border border-white/10 bg-[#0E121B] p-2.5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-accent">
                      <FolderTree className="h-3.5 w-3.5" />
                      <span>URL Path / Slug</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 font-mono text-[10px] text-muted-text cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={autoSlug}
                          onChange={(e) => setAutoSlug(e.target.checked)}
                          className="rounded border-white/20 text-accent focus:ring-0"
                        />
                        <span>Auto-generate from title</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleRegenerateSlug}
                        className="rounded px-1.5 py-0.5 font-mono text-[10px] text-muted-text hover:text-white bg-white/5 border border-white/10 transition"
                        title="Regenerate slug"
                      >
                        <RotateCcw className="h-2.5 w-2.5 inline mr-1" />
                        Sync
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-xs text-muted-text">
                    <span className="text-muted-text/60">/blog/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setAutoSlug(false);
                      }}
                      placeholder="generated-article-slug"
                      className="flex-1 bg-transparent font-mono text-xs text-white focus:outline-none border-b border-dashed border-white/20 focus:border-accent"
                    />
                  </div>
                  {errors.slug && (
                    <p className="mt-1 font-mono text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.slug}
                    </p>
                  )}
                </div>
              </div>

              {/* Category, Date & Featured Flags (Col 4) */}
              <div className="md:col-span-4 space-y-3">
                {/* Category Selection */}
                <div>
                  <label className="block font-mono text-xs font-semibold text-white mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-10 w-full rounded-[8px_2px_8px_2px] border border-white/10 bg-[#0E121B] px-3 font-mono text-xs text-white focus:border-accent focus:outline-none"
                  >
                    {AI_BLOG_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0E121B] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 font-mono text-[11px] text-red-400">{errors.category}</p>
                  )}
                </div>

                {/* Published Date & Read Time */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-mono text-[11px] text-muted-text mb-1">
                      Published Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-9 w-full rounded-[6px_2px_6px_2px] border border-white/10 bg-[#0E121B] px-2 font-mono text-xs text-white focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-muted-text mb-1">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="e.g. 5 min read"
                      className="h-9 w-full rounded-[6px_2px_6px_2px] border border-white/10 bg-[#0E121B] px-2 font-mono text-xs text-white focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Featured Post Switch */}
                <div className="flex items-center justify-between rounded-[8px_2px_8px_2px] border border-white/10 bg-[#0E121B] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Star className={`h-4 w-4 ${featured ? 'text-amber-400 fill-amber-400' : 'text-muted-text'}`} />
                    <span className="font-mono text-xs text-white">Featured Article</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-accent focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Description / Summary Excerpt */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs font-semibold text-white">
                  Executive Excerpt / Meta Description <span className="text-red-400">*</span>
                </label>
                <span className="font-mono text-[10px] text-muted-text">
                  {description.length}/300 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A high-density summary of the architectural patterns, latency benchmarks, or operational principles explored in this article..."
                className={`w-full rounded-[8px_2px_8px_2px] border bg-[#0E121B] p-2.5 font-sans text-xs text-white placeholder:text-muted-text/50 focus:outline-none transition ${
                  errors.description ? 'border-red-500' : 'border-white/10 focus:border-accent'
                }`}
              />
              {errors.description && (
                <p className="mt-1 font-mono text-[11px] text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.description}
                </p>
              )}
            </div>

            {/* Tags & Cover Image Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Tags Management */}
              <div className="rounded-[8px_2px_8px_2px] border border-white/10 bg-[#0E121B] p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs font-semibold text-white flex items-center gap-1.5">
                    <TagIcon className="h-3.5 w-3.5 text-accent" />
                    <span>Technology Tags <span className="text-red-400">*</span></span>
                  </label>
                  <span className="font-mono text-[10px] text-muted-text">{tags.length} selected</span>
                </div>

                {/* Selected Tag Pills */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-1.5 rounded-[6px_2px_6px_2px] border border-white/5 bg-black/20">
                  {tags.length === 0 ? (
                    <span className="font-mono text-[11px] text-muted-text/60 italic self-center">
                      No tags attached yet. Pick from below or type custom.
                    </span>
                  ) : (
                    tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-[4px_1px_4px_1px] border border-accent/30 bg-accent/15 px-2 py-0.5 font-mono text-[10px] text-accent"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-white transition cursor-pointer"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Tag Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(tagInput);
                      }
                    }}
                    placeholder="Type tag & press Enter..."
                    className="h-8 flex-1 rounded-[6px_2px_6px_2px] border border-white/10 bg-black/30 px-2.5 font-mono text-xs text-white placeholder:text-muted-text/50 focus:border-accent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagInput)}
                    className="h-8 rounded-[6px_2px_6px_2px] border border-white/10 bg-white/5 px-2.5 font-mono text-xs text-white hover:bg-white/10 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Quick Suggestion Chips */}
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-text block mb-1">
                    Quick Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {POPULAR_TECH_TAGS.map((popTag) => {
                      const isSelected = tags.includes(popTag);
                      return (
                        <button
                          key={popTag}
                          type="button"
                          onClick={() => {
                            if (isSelected) handleRemoveTag(popTag);
                            else handleAddTag(popTag);
                          }}
                          className={`rounded-[4px_1px_4px_1px] px-1.5 py-0.5 font-mono text-[9px] border transition cursor-pointer ${
                            isSelected
                              ? 'border-accent bg-accent text-black font-semibold'
                              : 'border-white/10 bg-white/5 text-muted-text hover:text-white'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {popTag}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {errors.tags && (
                  <p className="font-mono text-[11px] text-red-400">{errors.tags}</p>
                )}
              </div>

              {/* Cover Image & Presets */}
              <div className="rounded-[8px_2px_8px_2px] border border-white/10 bg-[#0E121B] p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs font-semibold text-white flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-accent" />
                    <span>Cover Hero Image <span className="text-red-400">*</span></span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowImagePresets(!showImagePresets)}
                    className="font-mono text-[10px] text-accent hover:underline cursor-pointer"
                  >
                    {showImagePresets ? 'Hide presets' : 'Select preset'}
                  </button>
                </div>

                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="h-8 w-full rounded-[6px_2px_6px_2px] border border-white/10 bg-black/30 px-2.5 font-mono text-xs text-white placeholder:text-muted-text/50 focus:border-accent focus:outline-none"
                />

                {/* Cover Image Presets Drawer */}
                {showImagePresets && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1.5 rounded-[6px_2px_6px_2px] border border-white/10 bg-black/40">
                    {COVER_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCoverImage(preset.url);
                          setShowImagePresets(false);
                        }}
                        className="group relative h-14 overflow-hidden rounded border border-white/10 hover:border-accent transition text-left cursor-pointer"
                      >
                        <Image
                          src={preset.url}
                          alt={preset.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-black/75 px-1 py-0.5 font-mono text-[8px] text-white line-clamp-1">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Image Preview Banner */}
                {coverImage && (
                  <div className="relative h-20 w-full overflow-hidden rounded-[6px_2px_6px_2px] border border-white/10 bg-black/50">
                    <Image
                      src={coverImage}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="font-mono text-[10px] text-muted-text">
                        Hero image live preview
                      </span>
                    </div>
                  </div>
                )}

                {errors.coverImage && (
                  <p className="font-mono text-[11px] text-red-400">{errors.coverImage}</p>
                )}
              </div>
            </div>

            {/* Markdown Content Editor & Live Preview Area */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-white">
                    Article Markdown Body <span className="text-red-400">*</span>
                  </span>
                  <span className="font-mono text-[10px] text-muted-text">
                    ({content.split(/\s+/).filter(Boolean).length} words • {readTime})
                  </span>
                </div>

                {/* Markdown Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-1 rounded-[6px_2px_6px_2px] border border-white/10 bg-[#0E121B] p-1">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('## ', '', 'Heading 2')}
                    className="rounded p-1 text-muted-text hover:bg-white/10 hover:text-white transition"
                    title="Heading 2"
                  >
                    <Heading2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('### ', '', 'Heading 3')}
                    className="rounded p-1 text-muted-text hover:bg-white/10 hover:text-white transition"
                    title="Heading 3"
                  >
                    <Heading3 className="h-3.5 w-3.5" />
                  </button>
                  <span className="h-3 w-px bg-white/10 mx-0.5" />
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**', 'bold text')}
                    className="rounded p-1 text-muted-text hover:bg-white/10 hover:text-white transition"
                    title="Bold"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*', 'italic text')}
                    className="rounded p-1 text-muted-text hover:bg-white/10 hover:text-white transition"
                    title="Italic"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('`', '`', 'inline code')}
                    className="rounded p-1 text-muted-text hover:bg-white/10 hover:text-white transition"
                    title="Inline Code"
                  >
                    <Code className="h-3.5 w-3.5" />
                  </button>
                  <span className="h-3 w-px bg-white/10 mx-0.5" />
                  <button
                    type="button"
                    onClick={() => insertMarkdown('```typescript\n', '\n```', '// code')}
                    className="rounded p-1 text-muted-text hover:bg-white/10 hover:text-white transition"
                    title="Code Block"
                  >
                    <FileCode className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('- ', '', 'List item')}
                    className="rounded p-1 text-muted-text hover:bg-white/10 hover:text-white transition"
                    title="Bullet List"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('1. ', '', 'First item')}
                    className="rounded p-1 text-muted-text hover:bg-white/10 hover:text-white transition"
                    title="Ordered List"
                  >
                    <ListOrdered className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('> ', '', 'Quoted thought')}
                    className="rounded p-1 text-muted-text hover:bg-white/10 hover:text-white transition"
                    title="Blockquote"
                  >
                    <Quote className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('[', '](https://example.com)', 'Link text')}
                    className="rounded p-1 text-muted-text hover:bg-white/10 hover:text-white transition"
                    title="Hyperlink"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('> [!TIP]\n> ', '', 'Critical architectural observation')}
                    className="rounded p-1 text-muted-text hover:bg-white/10 hover:text-accent transition"
                    title="Callout Tip"
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Editor Workspace: Write, Split, or Preview */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 min-h-[360px]">
                
                {/* Markdown Input Area */}
                {(viewMode === 'write' || viewMode === 'split') && (
                  <div className={`${viewMode === 'split' ? 'md:col-span-6' : 'md:col-span-12'} flex flex-col`}>
                    <textarea
                      id="blog-markdown-textarea"
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="# Start your engineering deep dive here..."
                      className={`h-[420px] w-full resize-y rounded-[8px_2px_8px_2px] border bg-[#080B11] p-3.5 font-mono text-xs leading-relaxed text-[#ECEFF4] placeholder:text-muted-text/40 focus:outline-none ${
                        errors.content ? 'border-red-500' : 'border-white/10 focus:border-accent'
                      }`}
                    />
                    {errors.content && (
                      <p className="mt-1 font-mono text-[11px] text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.content}
                      </p>
                    )}
                  </div>
                )}

                {/* Live Preview Area using existing MarkdownRenderer */}
                {(viewMode === 'preview' || viewMode === 'split') && (
                  <div
                    className={`${
                      viewMode === 'split' ? 'md:col-span-6' : 'md:col-span-12'
                    } h-[420px] overflow-y-auto rounded-[8px_2px_8px_2px] border border-white/10 bg-[#090C12] p-4 text-[#ECEFF4]`}
                  >
                    <div className="border-b border-white/10 pb-2 mb-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-accent flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Live Markdown Rendering Preview
                      </span>
                      <span className="font-mono text-[10px] text-muted-text">
                        Renderer: @components/blog/MarkdownRenderer
                      </span>
                    </div>

                    {content ? (
                      <div className="prose prose-invert max-w-none text-xs">
                        <MarkdownRenderer content={content} />
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-center">
                        <p className="font-mono text-xs text-muted-text/60 italic">
                          Write markdown in the left pane to see real-time syntax highlighting and rich elements.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Error summary alert */}
            {Object.keys(errors).length > 0 && (
              <div className="rounded-[8px_2px_8px_2px] border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-2.5 text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                <div className="space-y-1">
                  <p className="font-mono text-xs font-semibold">
                    Please correct the following fields before saving:
                  </p>
                  <ul className="list-disc list-inside font-mono text-[11px] space-y-0.5">
                    {Object.entries(errors).map(([key, msg]) => (
                      <li key={key}>
                        <span className="uppercase">{key}</span>: {msg}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Modal Bottom Footer / Actions */}
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3.5 bg-[#0E121B] shrink-0">
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-text">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Entity state: Ready for local update / Future API binding</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[8px_2px_8px_2px] border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-muted-text hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-[8px_2px_8px_2px] bg-accent px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-accent-secondary transition shadow-sm cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>{isEditing ? 'Update Post' : 'Create Post'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
