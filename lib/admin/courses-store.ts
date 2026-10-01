import { Course } from '@/types/course';

export const initialCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Introduction to Docker',
    slug: 'introduction-to-docker',
    platform: 'DataCamp',
    instructor: 'DataCamp DevOps Faculty',
    category: 'DevOps & Containers',
    duration: '18 Hours',
    status: 'Completed',
    completionDate: 'June 2026',
    certificateUrl: 'https://www.datacamp.com/statement-of-accomplishment/course/0363f9f0f14bd98d27948149dfdc7466717e66fe?raw=1',
    description: 'Foundational container virtualization course covering container lifecycles, image layers, Dockerfile directives, multi-stage builds, and container networking.',
    syllabus: [
      'Container fundamentals vs hardware hypervisors',
      'Building lean images with multi-stage Dockerfiles',
      'Port forwarding, bind mounts, and volume persistence',
      'Container networking, bridge networks, and security best practices',
    ],
    skills: ['Docker', 'DevOps', 'Containers', 'Linux', 'Microservices'],
    featured: true,
  },
  {
    id: 'course-2',
    title: 'Intermediate Docker',
    slug: 'intermediate-docker',
    platform: 'DataCamp',
    instructor: 'DataCamp Infrastructure Team',
    category: 'DevOps & Containers',
    duration: '22 Hours',
    status: 'Completed',
    completionDate: 'July 2026',
    certificateUrl: 'https://www.datacamp.com/statement-of-accomplishment/course/2f8bda46a9eed9d42a07195798c797848c3d519a?raw=1',
    description: 'Advanced container orchestration with Docker Compose, multi-container microservice stacks, secret management, health checks, and CI/CD pipelines.',
    syllabus: [
      'Docker Compose orchestration for multi-container web architectures',
      'Environment variable hierarchy and sensitive secret injection',
      'Container health checks, auto-restart policies, and resource constraints',
      'Publishing and tagging images in public and private container registries',
    ],
    skills: ['Docker Compose', 'CI/CD', 'Container Security', 'Architecture'],
    featured: true,
  },
  {
    id: 'course-3',
    title: 'Learn Linux & Systems Administration',
    slug: 'learn-linux-systems',
    platform: 'Boot.dev',
    instructor: 'Lane Wagner',
    category: 'Operating Systems & CLI',
    duration: '35 Hours',
    status: 'Completed',
    completionDate: 'July 2026',
    certificateUrl: 'https://www.boot.dev/certificates/a452e6c7-8f5a-49cc-be66-322b50db9265',
    description: 'Hands-on low-level Linux systems administration, bash scripting, POSIX file permissions, process scheduling with systemd, and terminal productivity.',
    syllabus: [
      'POSIX file systems, inodes, hard links, and permission octals',
      'Process management with top, ps, kill, and systemd service units',
      'Bash scripting, pipes, standard streams (stdin, stdout, stderr), and regex',
      'Networking with curl, dig, ssh key generation, and firewall configuration',
    ],
    skills: ['Linux', 'Bash', 'System Administration', 'POSIX', 'SSH'],
    featured: false,
  },
  {
    id: 'course-4',
    title: 'Introduction to Python & Computer Science',
    slug: 'introduction-to-python',
    platform: 'Boot.dev',
    instructor: 'Lane Wagner',
    category: 'Backend & Algorithms',
    duration: '40 Hours',
    status: 'Completed',
    completionDate: 'August 2026',
    certificateUrl: 'https://www.boot.dev/certificates/fc11106e-bd26-4fe5-b204-c47fe76f2b23',
    description: 'Core programming foundations in Python, object-oriented design, abstract data types, recursive algorithms, and algorithmic complexity (Big-O).',
    syllabus: [
      'Type annotations, collections (tuples, sets, dictionaries, lists)',
      'Object-oriented programming, inheritance, and polymorphism',
      'Functional idioms, list comprehensions, lambda expressions',
      'Unit testing, exception hierarchies, and debugging strategies',
    ],
    skills: ['Python', 'Object-Oriented Programming', 'Algorithms', 'Data Structures'],
    featured: false,
  },
  {
    id: 'course-5',
    title: 'Think in a Redux Way',
    slug: 'think-in-a-redux-way',
    platform: 'Learn with Sumit (LWS)',
    instructor: 'Sumit Saha',
    category: 'Frontend State Architecture',
    duration: '30 Hours',
    status: 'Completed',
    completionDate: 'April 2023',
    certificateUrl: 'https://learnwithsumit.com/reports/LWSCTXN-I7ZSR07E',
    description: 'Predictable centralized state management for complex React applications using Redux Toolkit (RTK), RTK Query for caching, and middleware pipelines.',
    syllabus: [
      'Immutability, pure functions, and action-reducer-store lifecycle',
      'Redux Toolkit slices, createAsyncThunk, and extraReducers',
      'RTK Query declarative data fetching, auto-generated hooks, and cache tags',
      'Custom Redux middleware for analytics, crash reporting, and auth tokens',
    ],
    skills: ['Redux Toolkit', 'React', 'RTK Query', 'State Management', 'TypeScript'],
    featured: false,
  },
];

const STORAGE_KEY = 'portfolio_admin_courses';

export function getStoredCourses(): Course[] {
  if (typeof window === 'undefined') return initialCourses;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCourses));
      return initialCourses;
    }
    return JSON.parse(raw);
  } catch {
    return initialCourses;
  }
}

export function saveStoredCourses(courses: Course[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    window.dispatchEvent(new Event('storage'));
  } catch { }
}

export function getCourseById(id: string): Course | undefined {
  const list = getStoredCourses();
  return list.find((c) => c.id === id || c.slug === id);
}

export function upsertCourse(course: Course) {
  const current = getStoredCourses();
  const exists = current.some((c) => c.id === course.id);
  const updated = exists
    ? current.map((c) => (c.id === course.id ? course : c))
    : [course, ...current];
  saveStoredCourses(updated);
  return updated;
}

export function deleteCourse(id: string) {
  const current = getStoredCourses();
  const updated = current.filter((c) => c.id !== id && c.slug !== id);
  saveStoredCourses(updated);
  return updated;
}
