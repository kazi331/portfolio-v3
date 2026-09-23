import { checkAuth, unauthorizedResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      return unauthorizedResponse();
    }

    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const {
      title,
      slug,
      featured,
      stacks,
      thumbnail,
      excerpt,
      links,
      githubUrl,
      clientLive,
      apiLive,
      challenge,
      solution,
      impact,
      metrics,
    } = body;

    if (!title || !slug || !stacks || !thumbnail || !excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        featured: featured || false,
        stacks,
        thumbnail,
        excerpt,
        links: links || {},
        githubUrl,
        clientLive,
        apiLive,
        challenge,
        solution,
        impact,
        metrics: metrics || [],
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
