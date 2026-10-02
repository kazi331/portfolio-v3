import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { workExperiences } from '@/lib/data';

export async function GET() {
  try {
    const dbExp = await prisma.experience.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (dbExp && dbExp.length > 0) {
      const formatted = dbExp.map((e) => ({
        id: e.id,
        role: e.role,
        company: e.company,
        period: e.duration,
        location: e.location || 'Remote',
        highlights: Array.isArray(e.responsibilities) ? e.responsibilities : [],
      }));
      return NextResponse.json({ success: true, data: formatted });
    }

    return NextResponse.json({ success: true, data: workExperiences, isFallback: true });
  } catch (error) {
    console.warn('API /api/experience GET error, serving fallback:', error);
    return NextResponse.json({ success: true, data: workExperiences, isFallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    try {
      const created = await prisma.experience.create({
        data: {
          role: body.role,
          company: body.company,
          duration: body.period || body.duration || '2024 - Present',
          startDate: new Date(),
          location: body.location || 'Remote',
          description: body.role,
          responsibilities: Array.isArray(body.highlights) ? body.highlights : [],
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: created.id,
          role: created.role,
          company: created.company,
          period: created.duration,
          location: created.location,
          highlights: created.responsibilities,
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
