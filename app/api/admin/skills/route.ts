import { checkAuth, unauthorizedResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET all skills with categories
export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      return unauthorizedResponse();
    }

    const skills = await prisma.skill.findMany({
      include: {
        category: true,
      },
      orderBy: {
        categoryId: 'asc',
      },
    });

    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST create new skill
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { name, level, categoryId } = body;
    console.log("log level", level, parseInt(level));

    if (!name || !level || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        level: parseInt(level),
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}
