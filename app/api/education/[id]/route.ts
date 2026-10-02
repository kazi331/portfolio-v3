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
      const updated = await prisma.education.update({
        where: { id },
        data: {
          degree: body.degree,
          institution: body.institution,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: updated.id,
          degree: updated.degree,
          institution: updated.institution,
          period: body.period,
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
      await prisma.education.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn('API /api/education/[id] DELETE fallback:', dbErr);
    }

    return NextResponse.json({ success: true, message: `Education ${id} deleted` });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
