import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postSchema } from '@/lib/admin/validation';
import { blogPosts } from '@/lib/data';

export async function GET() {
  try {
    const dbPosts = await prisma.post.findMany({
      include: {
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (dbPosts && dbPosts.length > 0) {
      const formatted = dbPosts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.excerpt || '',
        category: p.category || 'General',
        tags: p.tags ? p.tags.map((t) => t.name) : [],
        readTime: `${Math.ceil((p.content?.split(/\s+/).length || 200) / 200)} min read`,
        date: p.createdAt.toISOString().split('T')[0],
        coverImage: p.thumbnail,
        content: p.content,
        featured: false,
        views: p.views,
      }));
      return NextResponse.json({ success: true, data: formatted });
    }

    return NextResponse.json({ success: true, data: blogPosts, isFallback: true });
  } catch (error) {
    console.warn('API /api/posts GET error, serving fallback:', error);
    return NextResponse.json({ success: true, data: blogPosts, isFallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = postSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid post data' },
        { status: 400 }
      );
    }

    try {
      // Find or create default admin user
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: 'Shariful Islam',
            email: 'admin@shariful.dev',
          },
        });
      }

      const created = await prisma.post.create({
        data: {
          title: parsed.data.title,
          slug: parsed.data.slug,
          category: parsed.data.category,
          excerpt: parsed.data.description,
          content: parsed.data.content,
          thumbnail: parsed.data.coverImage,
          user_id: user.id,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: created.id,
          title: created.title,
          slug: created.slug,
          description: created.excerpt || '',
          category: created.category || 'General',
          tags: parsed.data.tags,
          readTime: parsed.data.readTime,
          date: created.createdAt.toISOString().split('T')[0],
          coverImage: created.thumbnail,
          content: created.content,
          featured: parsed.data.featured,
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
