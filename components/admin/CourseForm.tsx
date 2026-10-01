'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/course';
import { courseSchema, CourseFormData } from '@/lib/admin/validation';
import { generateSlug } from '@/lib/admin/slug';
import { upsertCourse } from '@/lib/admin/courses-store';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Layers,
  Plus,
  RotateCcw,
  Sparkles,
  Star,
  Tag as TagIcon,
  Trash2,
  User,
  X,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface CourseFormProps {
  initialData?: Course | null;
  onSaveSuccess?: (course: Course) => void;
  onCancel?: () => void;
  isParallelModal?: boolean;
}

const COMMON_PLATFORMS = [
  'DataCamp',
  'Boot.dev',
  'Frontend Masters',
  'Coursera',
  'edX',
  'Udemy',
  'Learn with Sumit (LWS)',
  'MIT OpenCourseWare',
  'Other',
];

const COMMON_CATEGORIES = [
  'DevOps & Containers',
  'Backend & APIs',
  'Operating Systems & CLI',
  'Frontend Architecture',
  'Distributed Systems',
  'Databases & Data Modeling',
  'Cloud Infrastructure',
  'Computer Science & Algorithms',
];

const SUGGESTED_SKILLS = [
  'Docker',
  'Linux',
  'TypeScript',
  'Python',
  'Next.js',
  'React',
  'PostgreSQL',
  'Redis',
  'Kubernetes',
  'Redux Toolkit',
  'Microservices',
  'CI/CD',
];

export default function CourseForm({
  initialData,
  onSaveSuccess,
  onCancel,
  isParallelModal = false,
}: CourseFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [autoSlug, setAutoSlug] = useState(!initialData);
  const [platform, setPlatform] = useState(initialData?.platform || 'DataCamp');
  const [customPlatform, setCustomPlatform] = useState('');
  const [instructor, setInstructor] = useState(initialData?.instructor || '');
  const [category, setCategory] = useState(initialData?.category || COMMON_CATEGORIES[0]);
  const [duration, setDuration] = useState(initialData?.duration || '20 Hours');
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Planned'>(
    initialData?.status || 'Completed'
  );
  const [completionDate, setCompletionDate] = useState(
    initialData?.completionDate || 'June 2026'
  );
  const [certificateUrl, setCertificateUrl] = useState(initialData?.certificateUrl || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [syllabus, setSyllabus] = useState<string[]>(
    initialData?.syllabus || [
      'Core architecture and conceptual foundations',
      'Hands-on implementation and practical labs',
      'Production deployment and debugging strategies',
    ]
  );
  const [moduleInput, setModuleInput] = useState('');
  const [skills, setSkills] = useState<string[]>(initialData?.skills || ['Docker', 'DevOps']);
  const [skillInput, setSkillInput] = useState('');
  const [featured, setFeatured] = useState(Boolean(initialData?.featured));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSlug(initialData.slug);
      setAutoSlug(false);
      setPlatform(initialData.platform);
      setInstructor(initialData.instructor || '');
      setCategory(initialData.category);
      setDuration(initialData.duration || '');
      setStatus(initialData.status);
      setCompletionDate(initialData.completionDate);
      setCertificateUrl(initialData.certificateUrl || '');
      setDescription(initialData.description);
      setSyllabus(initialData.syllabus || []);
      setSkills(initialData.skills || []);
      setFeatured(Boolean(initialData.featured));
    }
  }, [initialData]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(generateSlug(val));
    }
  };

  const handleAddModule = () => {
    const trimmed = moduleInput.trim();
    if (!trimmed) return;
    setSyllabus([...syllabus, trimmed]);
    setModuleInput('');
  };

  const handleRemoveModule = (index: number) => {
    setSyllabus(syllabus.filter((_, i) => i !== index));
  };

  const handleAddSkill = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleDismiss = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    if (isParallelModal) {
      router.back();
    } else {
      router.push('/admin/courses');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const actualPlatform =
      platform === 'Other' && customPlatform.trim() ? customPlatform.trim() : platform;

    const candidateData: CourseFormData = {
      title,
      slug: slug || generateSlug(title || 'untitled-course'),
      platform: actualPlatform,
      instructor: instructor || undefined,
      category,
      duration: duration || undefined,
      status,
      completionDate,
      certificateUrl: certificateUrl || undefined,
      description,
      syllabus,
      skills,
      featured,
    };

    const parsed = courseSchema.safeParse(candidateData);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);

      // Scroll to top of form if errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    const courseRecord: Course = {
      id: initialData?.id || `course-${Date.now()}`,
      title: parsed.data.title,
      slug: parsed.data.slug,
      platform: parsed.data.platform,
      instructor: parsed.data.instructor,
      category: parsed.data.category,
      duration: parsed.data.duration,
      status: parsed.data.status,
      completionDate: parsed.data.completionDate,
      certificateUrl: parsed.data.certificateUrl,
      description: parsed.data.description,
      syllabus: parsed.data.syllabus,
      skills: parsed.data.skills,
      featured: parsed.data.featured,
    };

    // Save locally
    upsertCourse(courseRecord);

    if (onSaveSuccess) {
      onSaveSuccess(courseRecord);
    } else {
      router.push('/admin/courses');
      router.refresh();
    }
  };

  return (
    <div className="w-full text-[#F1F3F5] animate-in fade-in duration-200">
      
      {/* Top sticky action banner */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0A0D14]/95 px-4 sm:px-8 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex h-8 w-8 items-center justify-center rounded-[6px_2px_6px_2px] border border-white/10 bg-white/5 text-muted-text hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                Prisma Model • @Course
              </span>
              <span className="rounded-[4px_1px_4px_1px] border border-white/10 bg-white/5 px-1.5 py-0.2 font-mono text-[9px] text-muted-text">
                {isEditing ? 'UPDATE' : 'CREATE'} • FULL PAGE
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold font-display text-white line-clamp-1">
              {isEditing ? `Edit: ${title || 'Course'}` : 'Add Course / Training'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDismiss}
            className="hidden sm:inline-block rounded-[6px_2px_6px_2px] border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-muted-text hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-[6px_2px_6px_2px] bg-accent px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-accent-secondary transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            <span>{isEditing ? 'Save Changes' : 'Publish Course'}</span>
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
        
        {/* Error Notification Banner */}
        {Object.keys(errors).length > 0 && (
          <div className="rounded-[10px_3px_10px_3px] border border-red-500/30 bg-red-500/10 p-4 text-red-300 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-mono text-xs font-bold uppercase tracking-wider">
                  Please review the following requirements:
                </p>
                <ul className="list-disc list-inside font-mono text-[11px] space-y-0.5">
                  {Object.entries(errors).map(([key, msg]) => (
                    <li key={key}>
                      <span className="uppercase text-red-200">{key}</span>: {msg}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Core Course Identity */}
        <div className="rounded-[12px_3px_12px_3px] border border-white/10 bg-[#0E121B] p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <BookOpen className="h-4 w-4 text-accent" />
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              1. Course Identity & Platform
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Title (Col 8) */}
            <div className="md:col-span-8 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-semibold text-white">
                  Course Title <span className="text-red-400">*</span>
                </label>
                <span className="font-mono text-[10px] text-muted-text">
                  {title.length}/160
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Introduction to Docker, Distributed Systems in Go"
                className={`h-10 w-full rounded-[8px_2px_8px_2px] border bg-black/40 px-3 font-mono text-sm text-white placeholder:text-muted-text/50 focus:outline-none transition ${
                  errors.title ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-accent'
                }`}
              />
              {errors.title && (
                <p className="font-mono text-[11px] text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Platform / Academy (Col 4) */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="block font-mono text-xs font-semibold text-white">
                Platform / Academy <span className="text-red-400">*</span>
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="h-10 w-full rounded-[8px_2px_8px_2px] border border-white/10 bg-black/40 px-3 font-mono text-xs text-white focus:border-accent focus:outline-none"
              >
                {COMMON_PLATFORMS.map((p) => (
                  <option key={p} value={p} className="bg-[#0E121B] text-white">
                    {p}
                  </option>
                ))}
              </select>

              {platform === 'Other' && (
                <input
                  type="text"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  placeholder="Enter academy/provider name"
                  className="mt-2 h-9 w-full rounded-[6px_2px_6px_2px] border border-white/10 bg-black/40 px-2.5 font-mono text-xs text-white placeholder:text-muted-text/50 focus:border-accent focus:outline-none"
                />
              )}
              {errors.platform && (
                <p className="font-mono text-[11px] text-red-400">{errors.platform}</p>
              )}
            </div>
          </div>

          {/* Slug URL Bar */}
          <div className="rounded-[8px_2px_8px_2px] border border-white/10 bg-black/30 p-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
              <span className="font-mono text-[11px] text-accent">URL Identifier / Slug</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 font-mono text-[10px] text-muted-text cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoSlug}
                    onChange={(e) => setAutoSlug(e.target.checked)}
                    className="rounded border-white/20 text-accent focus:ring-0"
                  />
                  <span>Sync with Title</span>
                </label>
                <button
                  type="button"
                  onClick={() => setSlug(generateSlug(title || 'untitled-course'))}
                  className="rounded px-2 py-0.5 font-mono text-[10px] text-muted-text hover:text-white bg-white/5 border border-white/10 transition cursor-pointer"
                >
                  <RotateCcw className="h-2.5 w-2.5 inline mr-1" />
                  Regenerate
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs text-muted-text">
              <span>/courses/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setAutoSlug(false);
                }}
                className="flex-1 bg-transparent font-mono text-xs text-white border-b border-dashed border-white/20 focus:border-accent focus:outline-none"
              />
            </div>
            {errors.slug && <p className="mt-1 font-mono text-[11px] text-red-400">{errors.slug}</p>}
          </div>

          {/* Category, Instructor & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block font-mono text-xs font-semibold text-white">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 w-full rounded-[6px_2px_6px_2px] border border-white/10 bg-black/40 px-2.5 font-mono text-xs text-white focus:border-accent focus:outline-none"
              >
                {COMMON_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0E121B] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs font-semibold text-white">
                Instructor / Mentor
              </label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="e.g. Lane Wagner, Sumit Saha"
                className="h-9 w-full rounded-[6px_2px_6px_2px] border border-white/10 bg-black/40 px-2.5 font-mono text-xs text-white placeholder:text-muted-text/50 focus:border-accent focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs font-semibold text-white">
                Estimated Duration / Hours
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 24 Hours, 6 Weeks"
                className="h-9 w-full rounded-[6px_2px_6px_2px] border border-white/10 bg-black/40 px-2.5 font-mono text-xs text-white placeholder:text-muted-text/50 focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Progress Status & Credentials */}
        <div className="rounded-[12px_3px_12px_3px] border border-white/10 bg-[#0E121B] p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <GraduationCap className="h-4 w-4 text-accent" />
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              2. Progress Status & Verification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Status Selector (Col 6) */}
            <div className="md:col-span-6 space-y-2">
              <label className="block font-mono text-xs font-semibold text-white">
                Progress Status <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Completed', 'In Progress', 'Planned'] as const).map((s) => {
                  const isCurrent = status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-[8px_2px_8px_2px] border font-mono text-xs transition cursor-pointer ${
                        isCurrent
                          ? s === 'Completed'
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                            : s === 'In Progress'
                            ? 'bg-blue-500/15 border-blue-500 text-blue-300 font-bold'
                            : 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                          : 'bg-black/30 border-white/10 text-muted-text hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{s}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Completion Timeline (Col 3) */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="block font-mono text-xs font-semibold text-white">
                Completion Date / Period <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                placeholder="e.g. July 2026"
                className={`h-10 w-full rounded-[8px_2px_8px_2px] border bg-black/40 px-3 font-mono text-xs text-white focus:outline-none ${
                  errors.completionDate ? 'border-red-500' : 'border-white/10 focus:border-accent'
                }`}
              />
              {errors.completionDate && (
                <p className="font-mono text-[11px] text-red-400">{errors.completionDate}</p>
              )}
            </div>

            {/* Featured toggle (Col 3) */}
            <div className="md:col-span-3 space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center justify-between rounded-[8px_2px_8px_2px] border border-white/10 bg-black/30 p-2.5 cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <Star className={`h-4 w-4 ${featured ? 'text-amber-400 fill-amber-400' : 'text-muted-text'}`} />
                  <span className="font-mono text-xs text-white">Featured Course</span>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-accent focus:ring-0"
                />
              </label>
            </div>
          </div>

          {/* Certificate URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs font-semibold text-white flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5 text-accent" />
                <span>Certificate / Statement of Accomplishment URL</span>
              </label>
              {certificateUrl && (
                <a
                  href={certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-accent hover:underline flex items-center gap-1"
                >
                  Test Link <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>
            <input
              type="url"
              value={certificateUrl}
              onChange={(e) => setCertificateUrl(e.target.value)}
              placeholder="https://www.datacamp.com/statement-of-accomplishment/course/..."
              className={`h-10 w-full rounded-[8px_2px_8px_2px] border bg-black/40 px-3 font-mono text-xs text-white placeholder:text-muted-text/50 focus:outline-none ${
                errors.certificateUrl ? 'border-red-500' : 'border-white/10 focus:border-accent'
              }`}
            />
            {errors.certificateUrl && (
              <p className="font-mono text-[11px] text-red-400">{errors.certificateUrl}</p>
            )}
          </div>
        </div>

        {/* Section 3: Overview & Description */}
        <div className="rounded-[12px_3px_12px_3px] border border-white/10 bg-[#0E121B] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-accent" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                3. Overview & Executive Summary <span className="text-red-400">*</span>
              </h2>
            </div>
            <span className="font-mono text-[10px] text-muted-text">
              {description.length} chars
            </span>
          </div>

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comprehensive description of topics covered, technical challenges solved, architecture designs mastered, and final capstone deliverables..."
            className={`w-full rounded-[8px_2px_8px_2px] border bg-black/40 p-3 font-sans text-xs leading-relaxed text-white placeholder:text-muted-text/50 focus:outline-none ${
              errors.description ? 'border-red-500' : 'border-white/10 focus:border-accent'
            }`}
          />
          {errors.description && (
            <p className="font-mono text-[11px] text-red-400">{errors.description}</p>
          )}
        </div>

        {/* Section 4: Syllabus & Modules List Builder */}
        <div className="rounded-[12px_3px_12px_3px] border border-white/10 bg-[#0E121B] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                4. Syllabus Modules & Key Learnings
              </h2>
            </div>
            <span className="font-mono text-[10px] text-muted-text">
              {syllabus.length} {syllabus.length === 1 ? 'module' : 'modules'}
            </span>
          </div>

          {/* List of existing syllabus items */}
          <div className="space-y-2">
            {syllabus.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 rounded-[6px_2px_6px_2px] border border-white/5 bg-black/30 px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 border border-accent/30 font-mono text-[10px] font-bold text-accent">
                    {index + 1}
                  </span>
                  <span className="text-white/90 truncate">{item}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveModule(index)}
                  className="rounded p-1 text-muted-text hover:text-red-400 transition cursor-pointer"
                  title="Remove module"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Module Input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={moduleInput}
              onChange={(e) => setModuleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddModule();
                }
              }}
              placeholder="e.g. Asynchronous event loops and IO multiplexing..."
              className="h-10 flex-1 rounded-[8px_2px_8px_2px] border border-white/10 bg-black/40 px-3 font-sans text-xs text-white placeholder:text-muted-text/50 focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddModule}
              className="inline-flex items-center gap-1.5 h-10 rounded-[8px_2px_8px_2px] border border-white/10 bg-white/5 px-4 font-mono text-xs text-white hover:bg-white/10 transition cursor-pointer shrink-0"
            >
              <Plus className="h-3.5 w-3.5" /> Add Module
            </button>
          </div>
        </div>

        {/* Section 5: Skills & Technologies Learned */}
        <div className="rounded-[12px_3px_12px_3px] border border-white/10 bg-[#0E121B] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4 text-accent" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                5. Skills & Technologies Acquired <span className="text-red-400">*</span>
              </h2>
            </div>
            <span className="font-mono text-[10px] text-muted-text">
              {skills.length} attached
            </span>
          </div>

          {/* Selected Tag Badges */}
          <div className="flex flex-wrap gap-2 min-h-[36px] p-2 rounded-[8px_2px_8px_2px] border border-white/5 bg-black/30">
            {skills.length === 0 ? (
              <span className="font-mono text-xs text-muted-text/60 italic self-center">
                No skill tags added yet. Choose from suggestions below or type custom.
              </span>
            ) : (
              skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 rounded-[4px_1px_4px_1px] border border-accent/30 bg-accent/15 px-2.5 py-1 font-mono text-xs text-accent"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="hover:text-white transition cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add custom skill input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(skillInput);
                }
              }}
              placeholder="Type skill & press enter..."
              className="h-9 flex-1 rounded-[6px_2px_6px_2px] border border-white/10 bg-black/40 px-3 font-mono text-xs text-white placeholder:text-muted-text/50 focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddSkill(skillInput)}
              className="h-9 rounded-[6px_2px_6px_2px] border border-white/10 bg-white/5 px-3 font-mono text-xs text-white hover:bg-white/10 transition cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Suggestion Chips */}
          <div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-text block mb-1.5">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_SKILLS.map((item) => {
                const isSelected = skills.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      if (isSelected) handleRemoveSkill(item);
                      else handleAddSkill(item);
                    }}
                    className={`rounded-[4px_1px_4px_1px] px-2 py-0.5 font-mono text-[10px] border transition cursor-pointer ${
                      isSelected
                        ? 'border-accent bg-accent text-black font-semibold'
                        : 'border-white/10 bg-white/5 text-muted-text hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
          {errors.skills && <p className="font-mono text-[11px] text-red-400">{errors.skills}</p>}
        </div>

        {/* Bottom Action Footer for Mobile & Desktop */}
        <div className="flex items-center justify-between border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-[8px_2px_8px_2px] border border-white/10 bg-white/5 px-5 py-2.5 font-mono text-xs text-muted-text hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            Cancel / Back to Courses
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-[8px_2px_8px_2px] bg-accent px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-accent-secondary transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            <span>{isEditing ? 'Save Changes' : 'Publish Course'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
