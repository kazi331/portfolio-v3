import { checkAuth, unauthorizedResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET single skill
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({ skill });
  } catch (error) {
    console.error('Error fetching skill:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill' },
      { status: 500 }
    );
  }
}

// PUT update skill
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { name, level, categoryId } = body;

    const { id } = await params;
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        level: parseInt(level),
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ skill });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE skill
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    await prisma.skill.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}
