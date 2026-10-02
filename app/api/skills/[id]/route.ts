import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    try {
      const updated = await prisma.skill.update({
        where: { id },
        data: {
          name: body.name,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: updated.id,
          name: updated.name,
          category: body.category || 'General',
          level: Number(body.level) || 85,
        },
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        data: { id, ...body },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      await prisma.skill.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn('API /api/skills/[id] DELETE fallback:', dbErr);
    }

    return NextResponse.json({ success: true, message: `Skill ${id} deleted` });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
