import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { references } from '@/lib/data';

export async function GET() {
  try {
    const dbRefs = await prisma.reference.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (dbRefs && dbRefs.length > 0) {
      const formatted = dbRefs.map((r) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        company: r.company,
        email: r.email,
      }));
      return NextResponse.json({ success: true, data: formatted });
    }

    return NextResponse.json({ success: true, data: references, isFallback: true });
  } catch (error) {
    return NextResponse.json({ success: true, data: references, isFallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    try {
      const created = await prisma.reference.create({
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
          id: created.id,
          name: created.name,
          role: created.role,
          company: created.company,
          email: created.email,
        },
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        data: { id: String(Date.now()), ...body },
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
