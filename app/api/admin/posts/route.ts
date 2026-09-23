import { checkAuth, getAuthSession, unauthorizedResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET all posts
export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      return unauthorizedResponse();
    }

    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: true,
        reactions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST create new post
export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const {
      title,
      slug,
      category,
      excerpt,
      content,
      thumbnail,
      tags,
    } = body;

    if (!title || !slug || !content || !thumbnail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        title,
        slug,
        category,
        excerpt,
        content,
        thumbnail,
        tags,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
