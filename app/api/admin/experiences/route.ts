import { checkAuth, unauthorizedResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET all experiences
export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      return unauthorizedResponse();
    }

    const experiences = await prisma.experience.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ experiences });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

// POST create new experience
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const {
      company,
      role,
      period,
      duration,
      location,
      highlights,
      dotX,
      dotY,
      cardX,
      cardY,
      yearLabel,
      color,
      isCurrent,
    } = body;

    const experience = await prisma.experience.create({
      data: {
        company,
        role,
        period,
        duration,
        location,
        highlights,
        dotX,
        dotY,
        cardX,
        cardY,
        yearLabel,
        color,
        isCurrent: isCurrent || false,
      },
    });

    return NextResponse.json({ experience }, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}
