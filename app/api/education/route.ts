import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { educations } from '@/lib/data';

export async function GET() {
  try {
    const dbEdu = await prisma.education.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (dbEdu && dbEdu.length > 0) {
      const formatted = dbEdu.map((e) => ({
        id: e.id,
        degree: e.degree,
        institution: e.institution,
        period: e.startDate ? e.startDate.getFullYear().toString() : '2022',
      }));
      return NextResponse.json({ success: true, data: formatted });
    }

    return NextResponse.json({ success: true, data: educations, isFallback: true });
  } catch (error) {
    return NextResponse.json({ success: true, data: educations, isFallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    try {
      const created = await prisma.education.create({
        data: {
          degree: body.degree,
          institution: body.institution,
          startDate: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: created.id,
          degree: created.degree,
          institution: created.institution,
          period: body.period || '2024',
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
