import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { certifications } from '@/lib/data';

export async function GET() {
  try {
    const dbCerts = await prisma.certification.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (dbCerts && dbCerts.length > 0) {
      const formatted = dbCerts.map((c) => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        completedDate: c.completedDate.toISOString().split('T')[0],
        url: c.url,
      }));
      return NextResponse.json({ success: true, data: formatted });
    }

    return NextResponse.json({ success: true, data: certifications, isFallback: true });
  } catch (error) {
    return NextResponse.json({ success: true, data: certifications, isFallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    try {
      const created = await prisma.certification.create({
        data: {
          name: body.name,
          issuer: body.issuer,
          completedDate: new Date(),
          url: body.url || '',
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: created.id,
          name: created.name,
          issuer: created.issuer,
          completedDate: body.completedDate || '2026',
          url: created.url,
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
