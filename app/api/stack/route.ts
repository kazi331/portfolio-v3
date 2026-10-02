import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stackSchema } from '@/lib/admin/validation';

export async function GET() {
  try {
    const dbStack = await prisma.stack.findMany({
      include: {
        project: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (dbStack && dbStack.length > 0) {
      const formatted = dbStack.map((s) => ({
        id: s.id,
        name: s.name,
        category: 'Technology',
        orbitTier: 'Core Core',
        iconType: s.icon || 'nextjs',
        projectCount: s.project ? s.project.length : 0,
      }));
      return NextResponse.json({ success: true, data: formatted });
    }

    return NextResponse.json({
      success: true,
      data: [
        { id: '1', name: 'TypeScript', category: 'Language', orbitTier: 'Core Core', iconType: 'typescript', projectCount: 4 },
        { id: '2', name: 'Next.js', category: 'Framework', orbitTier: 'Core Core', iconType: 'nextjs', projectCount: 4 },
        { id: '3', name: 'React', category: 'Library', orbitTier: 'Core Core', iconType: 'react', projectCount: 4 },
        { id: '4', name: 'Node.js', category: 'Runtime', orbitTier: 'Core Core', iconType: 'nodejs', projectCount: 3 },
        { id: '5', name: 'PostgreSQL', category: 'Database', orbitTier: 'Inner Orbital', iconType: 'postgresql', projectCount: 3 },
        { id: '6', name: 'Prisma ORM', category: 'ORM', orbitTier: 'Inner Orbital', iconType: 'prisma', projectCount: 3 },
        { id: '7', name: 'Tailwind CSS', category: 'Styling', orbitTier: 'Inner Orbital', iconType: 'tailwind', projectCount: 4 },
        { id: '8', name: 'FastAPI', category: 'Framework', orbitTier: 'Outer Orbital', iconType: 'fastapi', projectCount: 1 },
        { id: '9', name: 'Docker', category: 'DevOps', orbitTier: 'Inner Orbital', iconType: 'docker', projectCount: 2 },
        { id: '10', name: 'TanStack Query', category: 'State / Cache', orbitTier: 'Inner Orbital', iconType: 'tanstack', projectCount: 2 },
      ],
      isFallback: true,
    });
  } catch (error) {
    console.warn('API /api/stack GET error, serving fallback:', error);
    return NextResponse.json({
      success: true,
      data: [
        { id: '1', name: 'TypeScript', category: 'Language', orbitTier: 'Core Core', iconType: 'typescript', projectCount: 4 },
        { id: '2', name: 'Next.js', category: 'Framework', orbitTier: 'Core Core', iconType: 'nextjs', projectCount: 4 },
        { id: '3', name: 'React', category: 'Library', orbitTier: 'Core Core', iconType: 'react', projectCount: 4 },
        { id: '4', name: 'Node.js', category: 'Runtime', orbitTier: 'Core Core', iconType: 'nodejs', projectCount: 3 },
      ],
      isFallback: true,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    try {
      const created = await prisma.stack.create({
        data: {
          name: body.name,
          icon: body.iconType || body.icon || 'nextjs',
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: created.id,
          name: created.name,
          category: body.category || 'Technology',
          orbitTier: body.orbitTier || 'Core Core',
          iconType: created.icon || 'nextjs',
          projectCount: 0,
        },
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        data: {
          id: String(Date.now()),
          ...body,
        },
        simulated: true,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
