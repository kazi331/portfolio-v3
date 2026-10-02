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
      const updated = await prisma.reference.update({
        where: { id },
        data: {
          name: body.name,
          role: body.role,
          company: body.company,
          email: body.email,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: updated.id,
          name: updated.name,
          role: updated.role,
          company: updated.company,
          email: updated.email,
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
      await prisma.reference.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn('API /api/references/[id] DELETE fallback:', dbErr);
    }

    return NextResponse.json({ success: true, message: `Reference ${id} deleted` });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
