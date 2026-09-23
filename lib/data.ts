import { BlogPost, Certification, Education, OpenSourceRepo, PersonalInfo, Project, Reference, Service, SkillCategory, Stat, Testimonial, WorkExperience } from '@/types/portfolio';

export const personalInfo: PersonalInfo = {
  name: 'Kazi Shariful Islam',
  title: 'Full Stack Developer',
  location: 'Mirpur, Dhaka, Bangladesh',
  email: 'kazisharif.dev@gmail.com',
  phone: '+8801612-178331',
  github: 'https://github.com/kazi331',
  linkedin: 'https://linkedin.com/in/kazi331',
  website: 'https://kazisharif.dev',
  summary: 'Full Stack Software Engineer with 3+ years of experience building production applications with Node.js, TypeScript, and Next.js. Experienced across frontend, REST APIs, databases, and Docker, with end-to-end ownership of production applications.',
  profileImage: 'https://github.com/kazi331.png'
};

export const stats: Stat[] = [
  { id: 'exp', value: '03+', label: 'Years Experience' },
  { id: 'projects', value: '12+', label: 'Projects Completed' },
  { id: 'perf', value: '+60%', label: 'Performance Gain' },
  { id: 'roundtrips', value: '-40%', label: 'API Roundtrips' },
];

export const projects: Project[] = [
  {
    title: 'EdTech Platform – Next.js + TypeScript + Real-time LMS',
    slug: 'edtech-platform',
    description: 'An enterprise real-time Learning Management System engineered with Next.js, TypeScript, Tailwind CSS, and WebSocket event channels. Designed to eliminate client state desynchronization and handle high concurrent classroom interactions.',
    featured: true,
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'REST API', 'Firebase'],
    githubUrl: 'https://github.com/kazi331',
    liveUrl: 'https://tutorsplan.com',
    category: 'Full Stack Web',
    image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=1200&auto=format&fit=crop',
    challenge: 'Traditional learning systems suffered from sluggish page reloads, disjointed student-tutor synchronization, and high administrative overhead during live classroom sessions.',
    solution: 'Engineered a modern Next.js single-page application with type-safe TypeScript interfaces, responsive real-time chat, interactive quiz states, and TanStack Query caching.',
    impact: 'Increased student engagement by 40% and reduced administrative overhead by 25% with 40% fewer backend roundtrips.',
    metrics: [
      { label: 'Engagement', value: '+40%' },
      { label: 'Admin Overhead', value: '-25%' },
      { label: 'API Roundtrips', value: '-40%' }
    ]
  },
  {
    title: 'Hotelson Flight Booking – React + Next.js + TanStack Caching',
    slug: 'hotelson-flight-booking',
    description: 'A high-speed flight and hotel reservation engine engineered for dynamic airfare queries, instant parametric filtering, and frictionless checkout. Built with React, Next.js, Redux Toolkit, and TanStack Query caching.',
    featured: true,
    tags: ['React', 'Next.js', 'TypeScript', 'TanStack Query', 'Redux', 'Node.js'],
    githubUrl: 'https://github.com/kazi331',
    liveUrl: 'https://hotelson.com',
    category: 'Travel & Booking',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    challenge: 'Sluggish multi-hop airline inventory queries and client-side state drift caused checkout latency, frustrating travelers and driving up cart abandonment rates.',
    solution: 'Re-architected into Next.js with optimized client state machines, predictive airfare search filters, and TanStack Query response deduplication.',
    impact: 'Boosted overall platform rendering performance by 60% and slashed search response latency down to under 120ms.',
    metrics: [
      { label: 'Performance', value: '+60%' },
      { label: 'Page Load', value: '-30%' },
      { label: 'Search Speed', value: '<120ms' }
    ]
  },
  {
    title: 'Mixory Bundles – Shopify App + Node.js + Prisma + PostgreSQL',
    slug: 'mixory-bundles',
    description: 'A revenue-driving Shopify App Store application featuring full-stack architecture with Node.js, Prisma ORM, PostgreSQL database, React admin portal, and sub-5ms WebAssembly Shopify Functions for dynamic discount transformations.',
    featured: true,
    tags: ['Node.js', 'Prisma', 'PostgreSQL', 'Shopify Functions', 'React', 'GraphQL'],
    githubUrl: 'https://github.com/kazi331',
    liveUrl: 'https://mixory-bundles.com',
    category: 'Shopify Ecosystem',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    challenge: 'Merchants needed tiered bundle pricing and complex cart transformations without introducing checkout delay or relying on legacy server polling.',
    solution: 'Engineered high-performance WebAssembly Shopify Functions running at Edge infrastructure in under 5ms, backed by a Node.js and PostgreSQL relational database.',
    impact: 'Engineered sub-5ms custom Shopify Functions for dynamic pricing rules, driving a verified 12% conversion lift across merchant storefronts.',
    metrics: [
      { label: 'Edge Latency', value: '<5ms' },
      { label: 'Conversion Lift', value: '+12%' },
      { label: 'Server Overhead', value: '-80%' }
    ]
  },
  {
    title: 'Maison Property Platform – React Native + Express + FCM Alerts',
    slug: 'maison-property',
    description: 'An interactive cross-platform real estate application featuring secure KYC document uploads, instant listing search, and sub-second push notification delivery built with React, Redux, Express REST APIs, and Firebase Cloud Messaging.',
    featured: true,
    tags: ['React', 'React Native', 'TypeScript', 'Express', 'Firebase', 'REST API'],
    githubUrl: 'https://github.com/kazi331',
    liveUrl: 'https://play.google.com',
    category: 'Mobile Applications',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    challenge: 'Property buyers and agents experienced disjointed document synchronization, slow listing updates, and missed inquiry alerts.',
    solution: 'Engineered resilient REST API microservices with Firebase Cloud Messaging (FCM) to deliver instant sub-second alert pipelines and real-time listing feeds.',
    impact: 'Integrated real-time notification flows with sub-second alert delivery and immediate listing updates across mobile and web clients.',
    metrics: [
      { label: 'Notification Latency', value: '<1s' },
      { label: 'Listing Sync', value: 'Realtime' }
    ]
  }
];

export const skillCategories: SkillCategory[] = [
  {
    category: 'Languages',
    skills: [
      { name: 'JavaScript (ES6+)', level: 95 },
      { name: 'TypeScript', level: 92 },
      { name: 'Python', level: 80 },
      { name: 'HTML5 & CSS3', level: 95 },
      { name: 'SQL (PostgreSQL)', level: 90 },
    ],
  },
  {
    category: 'Frontend & State',
    skills: [
      { name: 'React / Next.js', level: 94 },
      { name: 'React Native', level: 86 },
      { name: 'Redux & Toolkit', level: 90 },
      { name: 'TanStack Query', level: 92 },
      { name: 'Zustand & Context API', level: 88 },
      { name: 'Tailwind CSS', level: 95 },
    ],
  },
  {
    category: 'Backend & Databases',
    skills: [
      { name: 'Node.js / Express', level: 93 },
      { name: 'NestJS', level: 88 },
      { name: 'FastAPI (Python)', level: 82 },
      { name: 'Prisma ORM', level: 91 },
      { name: 'PostgreSQL & MongoDB', level: 89 },
      { name: 'GraphQL / REST APIs', level: 90 },
    ],
  },
  {
    category: 'Tools & Ecosystem',
    skills: [
      { name: 'Git & GitHub Actions', level: 90 },
      { name: 'Shopify Functions', level: 85 },
      { name: 'Firebase', level: 88 },
      { name: 'Vercel Deployment', level: 92 },
      { name: 'SEO & Performance', level: 90 },
      { name: 'Agile / Scrum / Jira', level: 88 },
    ],
  },
  {
    category: 'Systems & AI Workflow',
    skills: [
      { name: 'Docker', level: 82 },
      { name: 'Linux', level: 80 },
      { name: 'AI-Assisted Development', level: 88 },
      { name: 'Claude Code', level: 84 },
      { name: 'Cursor', level: 84 },
      { name: 'GitHub Copilot', level: 90 },
    ],
  },
];

export const services: Service[] = [
  {
    id: 'react-nextjs-consulting',
    title: 'React & Next.js Development Services',
    description: 'Architecting high-performance web applications using Next.js App Router, React 19, Server Components, and TanStack Query. Designed for fast Core Web Vitals (<2.5s LCP) and flawless UX.',
    iconName: 'Layout',
    capabilities: [
      'Next.js 14/15 App Router Layouts',
      'React Server Components & ISR',
      'Client State & Cache Management',
      'Core Web Vitals Optimization',
    ],
  },
  {
    id: 'fullstack-architecture',
    title: 'Full Stack Solutions & TypeScript Systems',
    description: 'End-to-end full-stack engineering with strict TypeScript type safety, from interactive responsive frontends to scalable relational database systems in PostgreSQL and Prisma.',
    iconName: 'Cpu',
    capabilities: [
      'End-to-End TypeScript Validation',
      'Modular Full-Stack Architecture',
      'PostgreSQL & Prisma ORM Schema Design',
      'Real-Time WebSockets & FCM Alerts',
    ],
  },
  {
    id: 'nodejs-nestjs-api',
    title: 'Node.js & NestJS API',
    description: 'Building resilient, enterprise REST & GraphQL microservices with NestJS dependency injection, DTO validation guards, Express pipelines, and JWT authorization.',
    iconName: 'Terminal',
    capabilities: [
      'NestJS Clean Architecture & DTOs',
      'Express High-Throughput REST APIs',
      'Modular Microservices & Caching',
      'CI/CD & Docker Containerization',
    ],
  },
  {
    id: 'fastapi-backend',
    title: 'FastAPI & Python Microservices',
    description: 'Developing high-concurrency, asynchronous API microservices using Python and FastAPI with Pydantic validation, async database drivers, and automated OpenAPI documentation.',
    iconName: 'Database',
    capabilities: [
      'Asynchronous FastAPI Routers',
      'Pydantic v2 Type Serialization',
      'High-Concurrency Data Pipelines',
      'Automated Swagger/OpenAPI Specs',
    ],
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Jerome Stephan',
    role: 'Founder',
    company: 'Approveage Inc.',
    content: 'Kazi is a phenomenal frontend and full stack engineer. He established real-time websocket flows between client and admin panels using Socket.IO and FCM. He improved data caching using TanStack Query, boosting our response rates by 30%.',
    avatarUrl: 'https://picsum.photos/seed/jerome/200/200',
  },
  {
    id: '2',
    name: 'Rahiyan Safin',
    role: 'Senior Software Engineer',
    company: 'Techjays',
    content: 'I worked closely with Kazi as a collaborator and technical reference. His ability to solo-build production applications like the Mixory Bundles app, while mastering complex cart-transform Shopify Functions, makes him an invaluable asset.',
    avatarUrl: 'https://picsum.photos/seed/rahiyan/200/200',
  }
];

export const blogPosts: BlogPost[] = [
  {
    title: 'Boosting React Response Speeds by 30% with TanStack Query',
    slug: 'boosting-react-tanstack-query',
    description: 'A deep architectural dive on setting up robust stale times, garbage collection, and localized key mutations to eliminate duplicate server load.',
    date: 'March 2024',
    readTime: '6 min read',
    category: 'Performance',
    tags: ['React', 'TanStack Query', 'State Management', 'Cache Strategy'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    content: `
### Introduction

In modern client-side architectures, excessive API roundtrips and stale client states degrade user experience. At **Approveage Inc.**, we faced a similar challenge: our client-side administrative portals frequently polled server states, triggering excessive database re-queries. By integrating **TanStack Query (React Query)** and fine-tuning query hooks, we managed to **boost response speeds by 30%** and completely eliminate redundant server requests.

---

### The Problem: Redundant Client Polls

Before moving to TanStack Query, our frontend relied on standard React \`useEffect\` hooks coupled with Axios fetches. Every time a user toggled views or returned to active tabs, we fired unconditional server fetches. This led to:
- **Race conditions**: Delayed API responses overwriting fresher state variables.
- **Cache invalidation issues**: Users viewing outdated lists while waiting for network payloads.
- **High API latency**: Heavy stress on PostgreSQL databases due to duplicate read queries.

---

### The Solution: Strategic Stale & Cache Management

Our first major optimization was configuring robust \`staleTime\` and \`gcTime\` values. Instead of treating all data as immediately stale, we divided our data endpoints into three major categories:

1. **Immutable Configuration Data**: \`staleTime: Infinity\` (e.g. system constants, user profiles).
2. **Semi-Mutable Portal States**: \`staleTime: 5 * 60 * 1000\` (5 minutes). This kept list items accessible with zero fetch delays.
3. **Highly Volatile Realtime Elements**: \`staleTime: 10 * 1000\` (10 seconds) with Socket.IO fallbacks.

\`\`\`ts
const { data, isLoading } = useQuery({
  queryKey: ['portal-users', projectId],
  queryFn: () => fetchUsers(projectId),
  staleTime: 5 * 60 * 1000, // Keep cached data fresh for 5 mins
  gcTime: 10 * 60 * 1000,    // Retain in garbage collection for 10 mins
  refetchOnWindowFocus: false // Prevent re-fetching on tab toggles
});
\`\`\`

---

### Key Takeaway: Localized Mutation Optimizations

Additionally, we implemented **Optimistic Updates** for actions like adding or editing list items. Instead of forcing a full page re-render while awaiting backend confirmations, we mutated the local TanStack cache instantly, falling back gracefully if server requests failed. This gave users a near-instantaneous 0ms perceived latency.
`
  },
  {
    title: 'How We Scaled Shopify Apps Using Custom Shopify Functions',
    slug: 'scaling-shopify-functions',
    description: 'An engineering review on writing low-latency discount and cart-transform logics in Node.js running directly on Shopify Edge servers.',
    date: 'January 2024',
    readTime: '10 min read',
    category: 'Edge & Architecture',
    tags: ['Shopify Functions', 'WebAssembly', 'Node.js', 'WASM Edge'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop',
    content: `
### The Transition to Shopify Functions

As a **Shopify App Developer** at **Devsnest OPC**, I architected the **Mixory Bundles** Shopify application to help merchants configure customized product packages. Historically, custom Shopify pricing logic was handled through Shopify Scripts (Ruby) or client-side draft order hacks. However, Shopify Scripts is deprecated and restricted to Plus merchants, and client-side draft-order creations add massive checkout frictions.

To build a high-performance, edge-compatible solution available to all merchants, I migrated our bundling pricing engines to **Shopify Functions**.

---

### Architectural Design: Executing on the Edge

Shopify Functions run inside **WebAssembly (WASM)** containers directly on Shopify’s global edge infrastructure. This guarantees execution times **under 5ms**, avoiding latency spikes during heavy flash sale traffic.

Our tech stack for the bundler was:
- **Next.js** for the embedded Merchant Administration portal.
- **Node.js** with TypeScript for generating the Function logic.
- **Prisma** and **PostgreSQL** to map configurable bundle schemas.

---

### Code Execution: Defining the Custom Discount Rules

Below is a conceptual workflow of how our Node.js Shopify Cart Transform function maps customer carts against merchant-defined database bundles:

\`\`\`ts
import { RunInput, FunctionRunResult } from "../api";

export function run(input: RunInput): FunctionRunResult {
  const targets = input.cart.lines
    .filter(line => line.merchandise.__typename === "ProductVariant")
    .map(line => ({
      productVariant: {
        id: line.merchandise.id,
        quantity: line.quantity
      }
    }));

  if (targets.length < 2) {
    return { discountApplicationStrategy: "FIRST", discounts: [] };
  }

  // Calculate dynamic automatic tier-discounts
  return {
    discountApplicationStrategy: "MAXIMUM",
    discounts: [
      {
        value: { percentage: { value: "15.0" } }, // Apply 15% discount for custom bundle matches
        targets: targets
      }
    ]
  };
}
\`\`\`

---

### Performance & Business Results

By moving our calculation engines from standard external app-proxy servers directly to Shopify's edge WebAssembly runtime:
- **Perceived Latency dropped to zero**: Prices recalculate instantly on cart additions.
- **Conversion increased by 12%**: Smooth, bug-free, automatic pricing rules eliminated cart abandonment.
- **Server overhead plummeted by 80%**: No need to manage heavy auto-scaling server clusters to intercept checkouts during peak holiday traffic.
`
  },
  {
    title: 'Mastering Vite Configs for Enterprise: Port Binding, SSL, and Code Splitting',
    slug: 'mastering-vite-configuration',
    description: 'A hands-on production guide to configuring Vite for local SSL development, custom ports, and advanced rollupOptions for vendor chunk separation.',
    date: 'April 2024',
    readTime: '8 min read',
    category: 'Tooling',
    tags: ['Vite', 'SSL', 'Rollup', 'Code Splitting', 'DevOps'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1600&auto=format&fit=crop',
    content: `
### Introduction

In modern frontend build systems, default configurations are excellent for simple single-page applications, but they fall short in secure, multi-environment deployments. During our transition at **Dhali Overseas**, we needed our local development environment to mimic our production SSL-secured proxy, while combating ballooning initial javascript bundle files.

This guide outlines how to configure Vite for custom host interfaces, SSL development, and advanced vendor chunk-splitting.

---

### Local Development on Custom Host, Port, and SSL

When developing apps that interface with secure cookies, cross-domain sessions, or mobile client testing on the local network, standard \`http://localhost\` is insufficient. We need a fully SSL-secured local dev container environment.

Here is a typical production-grade \`vite.config.ts\` configuration that binds to all interfaces, reserves a strict port, and reads SSL certificates dynamically:

\`\`\`ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Try loading SSL certificates for secure local dev
  const hasCert = fs.existsSync(path.resolve(__dirname, 'certs/key.pem'));
  
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Bind to all network interfaces (essential for mobile testing)
      port: 3000,      // Secure dedicated port
      strictPort: true,
      https: hasCert ? {
        key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem')),
      } : false,
      cors: true,
    },
  };
});
\`\`\`

---

### Chunk Splitting & Bundle Minification

By default, Vite bundles your source code and external dependencies into a single, massive index file. This results in huge initial page sizes and slow Time-to-Interactive (TTI).

Using Rollup's manual chunking options under \`build.rollupOptions\`, we can dissect our vendor libraries (like React, Lucide-react, or Framer Motion) into their own cacheable blocks:

\`\`\`ts
build: {
  sourcemap: false,
  minify: 'terser', // Premium high-efficiency minification
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          if (id.includes('react') || id.includes('scheduler')) {
            return 'vendor-react';
          }
          if (id.includes('framer-motion') || id.includes('motion')) {
            return 'vendor-motion';
          }
          return 'vendor-core'; // Other third-party modules
        }
      }
    }
  }
}
\`\`\`

---

### The Result

Implementing this modular bundle structure:
- **Reduces first-load bundle size by 55%**: Split vendor chunks benefit from aggressive caching.
- **Enables secure local test suites**: Eliminates cross-origin cookie blocks when communicating with remote authentication APIs.
`
  },
  {
    title: 'Dynamic Page Delivery: Next.js Incremental Static Regeneration (ISR) at Scale',
    slug: 'nextjs-isr-at-scale',
    description: 'How to use Next.js Incremental Static Regeneration to serve static, lightning-fast content while refreshing data-driven pages on-demand without full re-deploys.',
    date: 'June 2024',
    readTime: '7 min read',
    category: 'Architecture',
    tags: ['Next.js', 'ISR', 'Edge CDN', 'Caching', 'Server Actions'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop',
    content: `
### Introduction

Serving high-traffic blogs or dynamic real-estate indexes requires an intricate balance between load speeds and content freshness. Static Site Generation (SSG) is incredibly fast but requires a complete server rebuild to publish a single update. Server-Side Rendering (SSR) serves dynamic data but introduces high latency and increases database stress on every page load.

**Next.js Incremental Static Regeneration (ISR)** solves this by letting you create or update static pages *after* you’ve built the site, incrementally on the edge.

---

### Time-Based Revalidation

To update a specific static route automatically at a set interval, we use the \`revalidate\` property. If a request arrives after the revalidation timer has expired, Next.js serves the cached static page but silently triggers a background rebuild to refresh the cache.

\`\`\`ts
// app/blog/page.tsx
import { getPosts } from '@/lib/api';

// Revalidate this page every 60 seconds (1 minute)
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts();
  
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Latest Industry Logs</h1>
      <div className="grid gap-6 mt-6">
        {posts.map(post => (
          <article key={post.id} className="border-b pb-4">
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
\`\`\`

---

### On-Demand Revalidation via Webhook

Time-based revalidation is useful but can lead to stale data during active intervals. To update pages *immediately* when a CMS event occurs, we can trigger on-demand revalidation using **Server Actions** or **API Routes** with tags.

First, tag your fetch request:

\`\`\`ts
const res = await fetch('https://api.example.com/posts', {
  next: { tags: ['blog-posts'] }
});
\`\`\`

Then, trigger revalidation from your webhook route:

\`\`\`ts
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  // Clear cache for any fetch request tagged with 'blog-posts'
  revalidateTag('blog-posts');
  
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
\`\`\`

---

### Production Metrics

By replacing Server-Side Rendering (SSR) with ISR for our high-traffic lookup portals:
- **TTFB (Time to First Byte) dropped by 80%**: Delivering immediate static pages from the CDN edge.
- **Database CPU utilization reduced from 65% to under 5%**: Eliminating thousands of redundant database read operations.
`
  },
  {
    title: 'Code Quality Architecture: Locking Standards with Linter Rules & Git Hooks',
    slug: 'code-quality-architecture',
    description: 'A deep dive into enforcing clean TypeScript rules, preventing circular imports, and locking down team standards using Husky and ESLint configs.',
    date: 'May 2024',
    readTime: '5 min read',
    category: 'Engineering Culture',
    tags: ['TypeScript', 'ESLint', 'Husky', 'Git Hooks', 'CI/CD'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=1470&auto=format&fit=crop',
    content: `
### The Cost of Tech Debt

In rapid product development cycles, code quality and strict formatting standards are often bypassed in favor of raw feature speed. Over time, this builds massive technical debt: circular imports, mismatched TypeScript type declarations, and inconsistent code syntax.

To prevent this architectural decay, we engineered an uncompromising, fully automated code quality pipeline at **Tutorsplan Corp** to enforce system standards on every single commit.

---

### Designing an Uncompromising ESLint Schema

We configure our linter to aggressively block common sources of production bugs, such as synchronous setState calls in \`useEffect\`, unused variables, and improper React dependency listings.

Here is an extract from a production-ready ESLint configuration:

\`\`\`json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-duplicate-imports": "error"
  }
}
\`\`\`

---

### Gating Git Commits with Husky and Lint-Staged

Relying on developers to manually run linters before pushing to GitHub is a losing battle. We automate this enforcement by hooking into the native git lifecycles.

Using **Husky** and **lint-staged**, we ensure that only properly formatted, lint-passed code can ever be committed:

\`\`\`json
// package.json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
\`\`\`

Whenever a developer runs \`git commit\`, Husky intercepts the hook, runs the linter across only the modified files, and auto-corrects simple spacing or formatting errors. If an error is unfixable, the commit is aborted, completely protecting our code repositories.
`
  },
  {
    title: 'How to Build Scalable Node.js and Express Applications (Enterprise Guide)',
    slug: 'scalable-nodejs-express-architecture',
    description: 'A comprehensive architectural breakdown of building high-concurrency, resilient Node.js and Express services with clean modular controllers, connection pooling, and JWT authorization.',
    date: 'February 2024',
    readTime: '12 min read',
    category: 'Backend Architecture',
    tags: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Architecture'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop',
    content: `
### Architecture Overview

When enterprise applications scale from serving hundreds of active users to hundreds of thousands of concurrent requests, monolithic **Node.js** and **Express** setups often crumble under unmanaged event loops, unindexed database scans, and tight coupling between routing and business logic.

Building truly scalable systems demands strict **modular separation of concerns**, **resilient connection pooling with PostgreSQL**, and **defensive error propagation**.

---

### Layered Clean Architecture in Express

Rather than mixing database operations directly into route handlers, production-grade applications adhere to a strict 4-layer taxonomy:

1. **Routing & Transport Layer**: Validates HTTP payloads, parses headers, and delegates execution to controllers.
2. **Controller Layer**: Decouples incoming JSON/HTTP semantics from domain logic.
3. **Service / Domain Layer**: Executes core business calculations, event triggers, and cache strategies.
4. **Data Access Layer (Repository / ORM)**: Manages database connections via Prisma or raw SQL query optimization.

\`\`\`ts
// src/services/OrderService.ts
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly paymentGateway: StripeGateway,
    private readonly cache: RedisCacheService
  ) {}

  async processOrder(orderId: string, userId: string): Promise<OrderResult> {
    const lockKey = \`lock:order:\${orderId}\`;
    const acquired = await this.cache.acquireLock(lockKey, 5000);
    if (!acquired) {
      throw new ConflictException('Concurrent order operation detected');
    }

    try {
      return await this.orderRepo.executeTransaction(async (tx) => {
        const order = await tx.findById(orderId);
        const receipt = await this.paymentGateway.charge(order.totalAmount);
        return tx.markCompleted(orderId, receipt.id);
      });
    } finally {
      await this.cache.releaseLock(lockKey);
    }
  }
}
\`\`\`

---

### Database Connection Pooling with PostgreSQL

One of the most frequent performance bottlenecks in Node.js backends is thread-exhaustion caused by spinning up fresh TCP sockets for each HTTP request. 

Utilizing connection pools like \`pg.Pool\` or configured **Prisma Client pool sizes** ensures database connection reuse:

- Set \`max\` connection limits based on available PostgreSQL hardware (\`RAM / (connection_memory * 1.5)\`).
- Implement idle timeouts (\`idleTimeoutMillis: 30000\`) to harvest abandoned sockets.
- Monitor active vs waiting queries to scale horizontally with Kubernetes or Cloud Run.

---

### Need an Enterprise Node.js / Express Developer?

Whether you are scaling from a monolithic MVP or architecting a resilient distributed microservice, I specialize in building type-safe, sub-50ms Node.js backends for global engineering teams across the US, EU, and UK.

`
  },
  {
    title: 'FastAPI vs Express: Performance, Concurrency, and Developer Experience Compared',
    slug: 'fastapi-vs-express-performance-comparison',
    description: 'An empirical benchmark comparing Python FastAPI and Node.js Express across asynchronous I/O, serialization overhead, type safety, and real-world microservice workloads.',
    date: 'January 2024',
    readTime: '10 min read',
    category: 'Backend Benchmark',
    tags: ['FastAPI', 'Express', 'Python', 'Node.js', 'Microservices'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop',
    content: `
### The Modern Backend Crossroads

When engineering microservices, engineering leaders frequently compare two industry titans: **Express (Node.js)** and **FastAPI (Python)**. 

Both frameworks support non-blocking asynchronous architectures, yet their runtime mechanics, serialization pipelines, and type-checking paradigms differ fundamentally.

---

### Asynchronous Concurrency: V8 Event Loop vs Python asyncio

- **Express (Node.js)** relies on the V8 engine and \`libuv\` multi-threaded event loop. Node.js excels at raw high-concurrency WebSockets and I/O-bound data streams with near-instant event loop cycle dispatch.
- **FastAPI (Python)** leverages \`uvicorn\` and Python's native \`asyncio\` event loop, coupled with Starlette for lightweight ASGI routing and Pydantic v2 (written in Rust) for zero-copy data parsing.

\`\`\`python
# FastAPI High-Throughput Endpoint
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, Field
import asyncio

app = FastAPI(title="Telemetry Service", version="2.0.0")

class TelemetryPayload(BaseModel):
    device_id: str = Field(..., min_length=8, max_length=64)
    metric_value: float = Field(..., ge=0.0)
    timestamp: int

@app.post("/api/v1/telemetry", status_code=status.HTTP_202_ACCEPTED)
async def ingest_telemetry(payload: TelemetryPayload):
    # Async background task delegation
    asyncio.create_task(persist_telemetry(payload))
    return {"status": "queued", "device_id": payload.device_id}
\`\`\`

---

### Benchmark Comparison

| Metric | Express.js (v4.x + Node 20) | FastAPI (v0.110 + Uvicorn) |
| :--- | :--- | :--- |
| **JSON Serialization (Req/Sec)** | ~45,000 req/s | ~38,000 req/s (Rust Pydantic v2) |
| **Type Validation Overhead** | Manual (Zod / Joi runtime) | Native built-in Pydantic |
| **Interactive API Documentation** | Swagger manually configured | Automated out-of-the-box Swagger/OpenAPI |
| **AI/ML Integration Friction** | Moderate (Requires IPC / PyBridge) | Zero (Native PyTorch, NumPy, LangChain) |

---

### When to Pick Each Framework

- **Choose Node.js / Express**: When your entire team uses full-stack TypeScript, when real-time client hydration is required, or when building high-frequency transaction networks.
- **Choose FastAPI**: When integrating AI/ML model inferences, data engineering pipelines, or when automatic OpenAPI specifications and strict schema validation are top priorities.

---

### Looking to Scale Your Microservices?

I engineer dual-stack backend ecosystems combining high-throughput **Node.js / Express / NestJS** gateways with **FastAPI** compute engines. 

`
  },
  {
    title: 'Next.js vs React: Architectural Guidance for Global SaaS Teams in 2024',
    slug: 'nextjs-vs-react-when-to-use-each',
    description: 'When should high-growth teams pick Next.js App Router versus standalone React SPAs? A comprehensive guide exploring SSR, ISR, SEO indexability, and bundle performance.',
    date: 'December 2023',
    readTime: '11 min read',
    category: 'Frontend Strategy',
    tags: ['Next.js', 'React', 'TypeScript', 'SEO', 'Core Web Vitals'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop',
    content: `
### The Dilemma: SPA vs Full-Stack Server Components

As frontend engineering evolves, deciding between a standalone **Vite + React Single Page Application (SPA)** and a **Next.js 14/15 App Router Full-Stack Solution** is one of the most critical decisions facing CTOs and engineering managers.

The choice dictates **Core Web Vitals, Google SEO discoverability, time-to-market, and server infrastructure costs**.

---

### 1. Organic Search Visibility & SEO

- **Standalone React SPAs**: Load an empty \`<div id="root"></div>\` shell, deferring HTML compilation to client JavaScript execution. While Googlebot executes JS, social crawlers (LinkedIn, Twitter, Slack previews) often fail to parse dynamic meta tags, hurting CTR.
- **Next.js App Router**: Automatically serves pre-rendered HTML with dynamic \`generateMetadata()\` tags, enabling instant SERP indexing, Open Graph previews, and sub-second **First Contentful Paint (FCP)**.

---

### 2. Core Web Vitals & Streaming SSR

With Next.js App Router, **React Server Components (RSC)** execute exclusively on the server, sending zero JavaScript to client bundles for static layouts:

\`\`\`tsx
// app/dashboard/page.tsx - Zero Client JS bundle footprint
import { Suspense } from 'react';
import MetricsGrid from '@/components/MetricsGrid';
import SkeletonLoader from '@/components/SkeletonLoader';

export default async function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Executive Overview</h1>
      <Suspense fallback={<SkeletonLoader />}>
        <MetricsGrid />
      </Suspense>
    </main>
  );
}
\`\`\`

---

### Architectural Recommendation

1. **Pick Standalone React**: For behind-the-login internal tools, browser extensions, or applications with zero SEO requirements where static S3/Cloudflare hosting is preferred.
2. **Pick Next.js**: For customer-facing SaaS platforms, marketplaces, e-commerce storefronts, and international portfolios where search discoverability and speed are vital.

---

### Need a Senior Next.js & React Consultant?

I help venture-funded startups and enterprise teams migrate legacy web apps to high-speed Next.js architectures with sub-2.5s LCP metrics.

[Contact me today](#contact-cta) to discuss your application roadmap.
`
  }
];

export const openSourceProjects: OpenSourceRepo[] = [
  {
    name: 'nest-prisma-boilerplate',
    description: 'A production-ready NestJS starter template complete with Prisma ORM, PostgreSQL schema setup, robust JWT authentication, and automated linter configurations.',
    stars: 124,
    forks: 18,
    language: 'TypeScript',
    url: 'https://github.com/kazi331',
  },
  {
    name: 'shopify-cart-transform-helper',
    description: 'A lightweight Node.js helper utility to easily format and validate input/output payloads for Shopify Cart Transform Functions.',
    stars: 62,
    forks: 7,
    language: 'TypeScript',
    url: 'https://github.com/kazi331',
  },
  {
    name: 'tanstack-cache-profiler',
    description: 'A minimal Chrome extension and React provider to profile, inspect, and benchmark cache hits and query key cycles of TanStack Query.',
    stars: 94,
    forks: 12,
    language: 'TypeScript',
    url: 'https://github.com/kazi331',
  }
];

export const workExperiences: WorkExperience[] = [
  {
    role: 'Software Engineer',
    company: 'Devsnest OPC',
    location: 'Dhaka, Bangladesh',
    period: 'Oct 2025 – Present',
    highlights: [
      'Solo-built a production Shopify app end to end — Next.js/React frontend, Node.js backend, PostgreSQL database via Prisma — now live on the Shopify App Store.',
      'Implemented REST API endpoints for dynamic pricing and cart-transform logic via Shopify Functions, with a strong focus on clean, debuggable code.',
      'Containerized local development with Docker, standardizing the development environment and reducing environment-specific setup issues.'
    ],
    url: 'https://devsnest.net/'
  },
  {
    role: 'Full Stack Developer (Frontend Lead)',
    company: 'Tutorsplan Corp',
    location: 'Dhaka, Bangladesh',
    period: 'Sept 2024 – July 2025',
    highlights: [
      'Led the frontend team on a Next.js tutor/student portal, running code reviews and managing Git branching/PR workflows across the team.',
      'Partnered with the backend engineer on Prisma/PostgreSQL schema design and REST API endpoints for the NestJS backend.'
    ],
    url: 'https://tutorsplan.com'
  },
  {
    role: 'React/Next.js Developer',
    company: 'Dhali Overseas Limited',
    location: 'Dhaka, Bangladesh',
    period: 'Apr 2024 – Aug 2024',
    highlights: [
      'Migrated three projects from Webflow to React/Next.js and redesigned flight/hotel booking sites and B2B/B2C sales portals, increasing performance by 60%.',
      'Improved data fetching and caching using TanStack Query, reducing page load time by 30%.'
    ]
  },
  {
    role: 'Frontend Engineer',
    company: 'Approveage Inc',
    location: 'Toronto, Canada (Remote)',
    period: 'Mar 2023 – Mar 2024',
    highlights: [
      'Established real-time data flow between client and admin panels using Socket.IO, and integrated Firebase Cloud Messaging for real-time notifications.',
      'Improved data fetching and caching with TanStack Query, boosting response speed by 30%.'
    ]
  }
];

export const educations: Education[] = [
  {
    institution: 'Govt. Safar Ali College',
    degree: 'B.A. English Language and Literature',
    period: 'Graduated 2023'
  },
  {
    institution: 'Mosharrof Hossain Khan Chowdhury University College',
    degree: 'Higher Secondary Certificate, Science',
    period: 'Completed 2017'
  }
];

export const certifications: Certification[] = [
  {
    name: 'Introduction to Docker',
    issuer: 'DataCamp',
    completedDate: 'June 2026',
    url: 'https://www.datacamp.com/statement-of-accomplishment/course/0363f9f0f14bd98d27948149dfdc7466717e66fe?raw=1'
  },
  {
    name: 'Intermediate Docker',
    issuer: 'DataCamp',
    completedDate: 'July 2026',
    url: 'https://www.datacamp.com/statement-of-accomplishment/course/2f8bda46a9eed9d42a07195798c797848c3d519a?raw=1'
  },
  {
    name: 'Learn Linux',
    issuer: 'Boot.dev',
    completedDate: 'July 2026',
    url: 'https://www.boot.dev/certificates/a452e6c7-8f5a-49cc-be66-322b50db9265'
  },
  {
    name: 'Introduction to Python',
    issuer: 'Boot.dev',
    completedDate: 'August 2026',
    url: 'https://www.boot.dev/certificates/fc11106e-bd26-4fe5-b204-c47fe76f2b23'
  },
  {
    name: 'Think in a Redux Way',
    issuer: 'LWS',
    completedDate: 'April 2023',
    url: 'https://learnwithsumit.com/reports/LWSCTXN-I7ZSR07E'
  }
];

export const references: Reference[] = [
  {
    name: 'Rahiyan Safin',
    role: 'Senior Software Engineer',
    company: 'Techjays',
    email: 'rahiyansafin@gmail.com'
  },
  {
    name: 'Jerome Stephan',
    role: 'Founder',
    company: 'Approveage Inc.',
    email: 'jerome.ramsay@gmail.com'
  }
];

export const snippetSkills = [
  {
    name: 'React',
    code: 'const App = () => {\n  return <Dashboard />;\n};',
    dots: ['#4EC4BF', '#7054E6', '#8F3DB8', '#42B883'],
  },
  {
    name: 'Next.js',
    code: 'export default function Page() {\n  return <main className="flex" />\n}',
    dots: ['#ffffff', '#888888', '#444444', '#111111'],
  },
  {
    name: 'Node.js',
    code: "app.listen(3000, () => {\n  console.log('Live on port 3000');\n});",
    dots: ['#81C784', '#66BB6A', '#4CAF50', '#388E3C'],
  },
  {
    name: 'TypeScript',
    code: 'interface User {\n  id: string;\n  role: "admin" | "user";\n}',
    dots: ['#3178C6', '#2F74C0', '#1F5E9B', '#4EA2FF'],
  },
  {
    name: 'PostgreSQL',
    code: 'SELECT * FROM users\nWHERE active = true\nORDER BY created_at DESC;',
    dots: ['#336791', '#2F5D85', '#1D3B55', '#4D82B8'],
  },
  {
    name: 'Python',
    code: 'def handle_event(event):\n    return {"status": "success"}',
    dots: ['#306998', '#FFD43B', '#4B8BBE', '#FFE873'],
  },
];