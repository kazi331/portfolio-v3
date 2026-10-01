export interface Course {
  id: string;
  title: string;
  slug: string;
  platform: string;
  instructor?: string;
  category: string;
  duration?: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  completionDate: string;
  certificateUrl?: string;
  description: string;
  syllabus: string[];
  skills: string[];
  featured?: boolean;
}
