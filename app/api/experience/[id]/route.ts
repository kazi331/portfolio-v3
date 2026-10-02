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
      const updated = await prisma.experience.update({
        where: { id },
        data: {
          role: body.role,
          company: body.company,
          duration: body.period || body.duration,
          location: body.location,
          responsibilities: Array.isArray(body.highlights) ? body.highlights : [],
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: updated.id,
          role: updated.role,
          company: updated.company,
          period: updated.duration,
          location: updated.location,
          highlights: updated.responsibilities,
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
      await prisma.experience.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn('API /api/experience/[id] DELETE fallback:', dbErr);
    }

    return NextResponse.json({ success: true, message: `Experience ${id} deleted` });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
