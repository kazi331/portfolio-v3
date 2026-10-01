/**
 * AI-assisted engineering metadata, curated categories, tags, image presets,
 * and realistic technical article templates for the Blog Editor.
 */

export const AI_BLOG_CATEGORIES = [
  'Architecture & Systems',
  'Next.js & React 19',
  'TypeScript & Node',
  'Databases & Prisma',
  'Distributed Systems',
  'Cloud & DevOps',
  'Security & Auth',
  'Web Performance',
  'AI Engineering',
  'Real-Time Systems',
];

export const POPULAR_TECH_TAGS = [
  'TypeScript',
  'Next.js 15/16',
  'React 19',
  'Prisma',
  'PostgreSQL',
  'Better-Auth',
  'WebSockets',
  'TailwindCSS',
  'Distributed Systems',
  'Docker',
  'Performance',
  'Architecture',
  'GraphQL',
  'Redis',
  'Server Components',
  'Microservices',
  'Security',
  'Cloud SQL',
];

export const COVER_IMAGE_PRESETS = [
  {
    name: 'Abstract Dark Neon & Cybernet',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'High Performance Server Chassi',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Modern Code & Terminal Matrix',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Silicon Wafer & Circuitry',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Distributed Cloud Network Topology',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
  },
];

export interface BlogPostTemplate {
  name: string;
  badge: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  coverImage: string;
  content: string;
}

export const AI_POST_TEMPLATES: BlogPostTemplate[] = [
  {
    name: 'Prisma & PostgreSQL Scaling Deep Dive',
    badge: 'Database Architecture',
    title: 'Zero-Downtime Schema Evolution with Prisma and PostgreSQL in Production',
    category: 'Databases & Prisma',
    tags: ['Prisma', 'PostgreSQL', 'Architecture', 'TypeScript', 'Performance'],
    description: 'A comprehensive operational guide on handling complex database schema migrations with zero downtime, connection pooling, and resilient indexing strategies.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    content: `# Zero-Downtime Schema Evolution with Prisma and PostgreSQL in Production

When enterprise applications scale past hundreds of thousands of active users, database migrations can no longer afford maintenance windows. Locking high-traffic tables during column modifications or foreign-key constraints can cascade into HTTP 504 timeouts across microservices.

In this deep dive, we explore how to design backward-compatible database schemas using **Prisma ORM** paired with native PostgreSQL migration patterns.

## 1. The Core Dilemma: Access Exclusive Locks

PostgreSQL executes certain DDL statements with an \`ACCESS EXCLUSIVE\` lock, preventing concurrent reads and writes:

\`\`\`sql
-- RISKY: Adds a column with a default value and rewrites table data under exclusive lock in older versions
ALTER TABLE users ADD COLUMN loyalty_tier VARCHAR(32) NOT NULL DEFAULT 'standard';
\`\`\`

Instead, modern workflows employ the **Expand-and-Contract** pattern:
1. **Expand**: Add the new column as nullable or without immediate runtime dependencies.
2. **Backfill**: Incrementally backfill historical rows via background worker jobs.
3. **Contract**: Promote the column to \`NOT NULL\` and deprecate the legacy column.

## 2. Configuring Prisma for Non-Blocking Pools

Here is how we configure the Prisma Client connection pool to avoid connection starvation during heavy query bursts:

\`\`\`typescript
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Configure Pg pool with aggressive connection bounds and idle timeouts
const adapter = new PrismaPg(process.env.DATABASE_URL!);

export const prisma = new PrismaClient({
  adapter,
  log: ['warn', 'error'],
});
\`\`\`

> [!TIP]
> Always verify your PostgreSQL \`statement_timeout\` and \`lock_timeout\` settings before initiating production migration scripts. Setting \`lock_timeout = '2s'\` ensures the engine fails fast rather than queueing blocking locks.

## 3. Safe Schema Evolution Checklist

- [ ] Every new column is initially created nullable or with a non-rewriting default.
- [ ] Concurrent indexes are created using \`CREATE INDEX CONCURRENTLY\`.
- [ ] Application code supports both the old and new schema variants during rollout.
- [ ] Rollback procedures are verified against production-like read replicas.

By strictly adhering to these principles, our systems maintain 99.99% uptime through continuous deployment cycles.`,
  },
  {
    name: 'React 19 & Next.js Streaming Architecture',
    badge: 'Frontend Systems',
    title: 'Architecting Resilient Real-Time UIs with React 19 Server Components and Suspense Streaming',
    category: 'Next.js & React 19',
    tags: ['React 19', 'Next.js 15/16', 'TypeScript', 'Server Components', 'Performance'],
    description: 'How to decouple latency-sensitive backend queries using React 19 Server Actions, selective hydration, and streaming boundaries for instant TTFB.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    content: `# Architecting Resilient Real-Time UIs with React 19 Server Components and Suspense Streaming

Modern web architecture has pivoted sharply towards server-centric computing. With React 19 and Next.js App Router, the boundary between server runtime and client interactivity is fluid yet rigorously optimized.

## Understanding the Request Lifecycle

Traditional client-rendered applications suffer from client-side network waterfalls:
1. Download HTML document.
2. Download JavaScript bundle.
3. Execute bundle and invoke \`fetch('/api/user')\`.
4. Render UI skeletons while waiting for responses.

With **React Server Components (RSC)**, the initial render occurs on the edge or server without shipping byte-heavy libraries to client memory:

\`\`\`tsx
// app/dashboard/page.tsx - Server Component
import { Suspense } from 'react';
import AnalyticsFeed from '@/components/AnalyticsFeed';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

export default async function DashboardPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Telemetry Console</h1>
        <p className="text-muted-text">Real-time edge performance metrics.</p>
      </header>

      {/* Instant TTFB with Streaming Boundary */}
      <Suspense fallback={<SkeletonLoader count={4} />}>
        <AnalyticsFeed />
      </Suspense>
    </section>
  );
}
\`\`\`

## Key Advantages in Production

- **Zero Bundle Impact**: Dependencies used solely for parsing or rendering on the server never ship to the browser.
- **Progressive Hydration**: Interactive islands hydrate independently without freezing the main thread.
- **Secure by Default**: Database credentials and internal microservice tokens stay isolated within the server context.`,
  },
  {
    name: 'WebAuthn & Passkey Authentication',
    badge: 'Security & Auth',
    title: 'Implementing Passwordless WebAuthn & Passkeys with Better-Auth and Prisma',
    category: 'Security & Auth',
    tags: ['Better-Auth', 'Security', 'Prisma', 'TypeScript', 'Next.js 15/16'],
    description: 'Eliminate credential stuffing and phishable passwords by introducing biometric passkeys and WebAuthn authenticators into your modern full-stack stack.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    content: `# Implementing Passwordless WebAuthn & Passkeys with Better-Auth and Prisma

Traditional passwords remain the single largest vector of authentication breaches. With FIDO2 and WebAuthn standardized across modern browsers, passkeys offer cryptographic public-key authentication that is mathematically immune to phishing.

## Architecture of a Passkey Exchange

1. **Registration Ceremony**:
   - The server creates a cryptographically random challenge.
   - The user authenticates locally on their device via FaceID, TouchID, or hardware key.
   - The device generates a private/public keypair and sends the public key and signed challenge back.
2. **Verification**:
   - The server stores the public key in PostgreSQL via Prisma.
   - Future logins only require signing a new challenge with the enclave-protected private key.

\`\`\`typescript
import { passkey } from "@better-auth/passkey";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    passkey()
  ],
  advanced: {
    cookiePrefix: "portfolio_auth"
  },
  emailAndPassword: { enabled: true },
});
\`\`\`

> [!TIP]
> Ensure WebAuthn reliance origin matches your production domain exactly (\`rpId\`), otherwise browsers will reject key creation during credential attestation.`,
  },
];
