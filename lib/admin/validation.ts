import { z } from 'zod';

/**
 * Zod validation schemas for Admin entities
 */

// Blog Post schema
export const postSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(160, 'Title cannot exceed 160 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens (e.g. my-awesome-post)'),
  description: z
    .string()
    .min(10, 'Excerpt/Description must be at least 10 characters')
    .max(300, 'Excerpt/Description should not exceed 300 characters'),
  category: z
    .string()
    .min(2, 'Please select or enter a category'),
  tags: z
    .array(z.string())
    .min(1, 'Please add at least 1 tag'),
  readTime: z
    .string()
    .min(1, 'Read time is required'),
  date: z
    .string()
    .min(4, 'Published date is required'),
  coverImage: z
    .string()
    .min(1, 'Cover image URL is required')
    .refine((val) => val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'), {
      message: 'Cover image must be a valid URL or relative path',
    }),
  content: z
    .string()
    .min(20, 'Markdown content must be at least 20 characters long'),
  featured: z.boolean().default(false),
});

export type PostFormData = z.infer<typeof postSchema>;

// Project schema
export const projectSchema = z.object({
  title: z
    .string()
    .min(2, 'Project title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  category: z
    .string()
    .min(2, 'Category is required'),
  tags: z
    .array(z.string())
    .min(1, 'Please select at least 1 technology tag'),
  featured: z.boolean().default(false),
  githubUrl: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith('http://') || val.startsWith('https://'), {
      message: 'GitHub link must be a valid URL',
    }),
  liveUrl: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith('http://') || val.startsWith('https://'), {
      message: 'Demo link must be a valid URL',
    }),
  image: z
    .string()
    .optional(),
  impact: z
    .string()
    .optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Stack / Tech item schema
export const stackSchema = z.object({
  name: z.string().min(2, 'Technology name is required'),
  category: z.string().min(2, 'Category is required'),
  proficiency: z.number().min(1, 'Proficiency must be at least 1%').max(100, 'Max proficiency is 100%'),
  tier: z.enum(['Core', 'Inner', 'Outer']).default('Core'),
  icon: z.string().min(1, 'Icon name or identifier is required'),
});

export type StackFormData = z.infer<typeof stackSchema>;

// Experience schema
export const experienceSchema = z.object({
  role: z.string().min(2, 'Job title/role is required'),
  company: z.string().min(2, 'Company name is required'),
  duration: z.string().min(2, 'Employment period/duration is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  technologies: z.array(z.string()).min(1, 'Add at least one technology used'),
  achievements: z.array(z.string()).default([]),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

// Skill schema
export const skillSchema = z.object({
  name: z.string().min(2, 'Skill name is required'),
  level: z.number().min(1, 'Level must be 1-100').max(100, 'Level must be 1-100'),
  category: z.string().min(2, 'Skill category is required'),
});

export type SkillFormData = z.infer<typeof skillSchema>;

// Education schema
export const educationSchema = z.object({
  degree: z.string().min(2, 'Degree/qualification is required'),
  institution: z.string().min(2, 'Institution name is required'),
  period: z.string().min(2, 'Period/graduating year is required'),
});

export type EducationFormData = z.infer<typeof educationSchema>;

// Certification schema
export const certificationSchema = z.object({
  name: z.string().min(2, 'Certification title is required'),
  issuer: z.string().min(2, 'Issuing organization is required'),
  completedDate: z.string().min(2, 'Date is required'),
  url: z.string().optional().refine((val) => !val || val.startsWith('http://') || val.startsWith('https://'), {
    message: 'Credential link must be a valid URL',
  }),
});

export type CertificationFormData = z.infer<typeof certificationSchema>;

// Reference schema
export const referenceSchema = z.object({
  name: z.string().min(2, 'Reference name is required'),
  role: z.string().min(2, 'Role/position is required'),
  company: z.string().min(2, 'Company name is required'),
  email: z.string().email('Please enter a valid email address'),
});

export type ReferenceFormData = z.infer<typeof referenceSchema>;

// Course schema (spacious full-page / parallel route entity)
export const courseSchema = z.object({
  title: z
    .string()
    .min(3, 'Course title must be at least 3 characters')
    .max(160, 'Title cannot exceed 160 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  platform: z
    .string()
    .min(2, 'Platform or academy name is required (e.g. DataCamp, Boot.dev)'),
  instructor: z
    .string()
    .optional(),
  category: z
    .string()
    .min(2, 'Category is required'),
  duration: z
    .string()
    .optional(),
  status: z
    .enum(['Completed', 'In Progress', 'Planned'])
    .default('Completed'),
  completionDate: z
    .string()
    .min(2, 'Completion date or timeline is required'),
  certificateUrl: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith('http://') || val.startsWith('https://'), {
      message: 'Certificate URL must start with http:// or https://',
    }),
  description: z
    .string()
    .min(10, 'Course description must be at least 10 characters long'),
  syllabus: z
    .array(z.string())
    .default([]),
  skills: z
    .array(z.string())
    .min(1, 'Please add at least 1 technology or skill learned'),
  featured: z
    .boolean()
    .default(false),
});

export type CourseFormData = z.infer<typeof courseSchema>;
