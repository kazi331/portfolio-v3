import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/lib/admin/validation';
import { projects as initialProjects } from '@/lib/data';

export async function GET() {
  try {
    const dbProjects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (dbProjects && dbProjects.length > 0) {
      const formatted = dbProjects.map((p) => ({
        id: p.id,
        title: p.name,
        slug: p.slug,
        description: p.excerpt || p.description || '',
        category: p.category || 'General',
        tags: p.tags ? p.tags.split(',').map((t) => t.trim()) : [],
        githubUrl: p.sourceLink,
        liveUrl: p.liveLink,
        featured: p.featured,
        image: p.images && p.images.length > 0 ? p.images[0] : undefined,
      }));
      return NextResponse.json({ success: true, data: formatted });
    }

    return NextResponse.json({ success: true, data: initialProjects, isFallback: true });
  } catch (error) {
    console.warn('API /api/projects GET error, serving fallback:', error);
    return NextResponse.json({ success: true, data: initialProjects, isFallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid project data' },
        { status: 400 }
      );
    }

    try {
      const created = await prisma.project.create({
        data: {
          name: parsed.data.title,
          slug: parsed.data.slug,
          excerpt: parsed.data.description,
          description: parsed.data.description,
          category: parsed.data.category,
          tags: parsed.data.tags.join(','),
          liveLink: parsed.data.liveUrl || '',
          sourceLink: parsed.data.githubUrl || '',
          featured: Boolean(parsed.data.featured),
          images: parsed.data.image ? [parsed.data.image] : [],
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: created.id,
          title: created.name,
          slug: created.slug,
          description: created.excerpt,
          category: created.category,
          tags: parsed.data.tags,
          liveUrl: created.liveLink,
          githubUrl: created.sourceLink,
          featured: created.featured,
        },
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        data: parsed.data,
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
