import { checkAuth, unauthorizedResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET single experience
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      return unauthorizedResponse();
    }

    const experience = await prisma.experience.findUnique({
      where: { id: params.id },
    });

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({ experience });
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

// PUT update experience
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const experience = await prisma.experience.update({
      where: { id: params.id },
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
        isCurrent,
      },
    });

    return NextResponse.json({ experience });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}

// DELETE experience
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      return unauthorizedResponse();
    }

    await prisma.experience.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}
