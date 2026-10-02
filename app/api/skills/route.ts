import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { skillCategories } from '@/lib/data';

export async function GET() {
  try {
    const dbSkills = await prisma.skill.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (dbSkills && dbSkills.length > 0) {
      const formatted = dbSkills.map((s, idx) => ({
        id: s.id,
        name: s.name,
        category: s.category && s.category[0] ? s.category[0].name : 'General',
        level: 85,
      }));
      return NextResponse.json({ success: true, data: formatted });
    }

    // Flatten fallback from skillCategories
    const list: any[] = [];
    skillCategories.forEach((cat, catIdx) => {
      cat.skills.forEach((s, sIdx) => {
        list.push({
          id: `${catIdx}-${sIdx}`,
          name: s.name,
          category: cat.category,
          level: s.level,
        });
      });
    });

    return NextResponse.json({ success: true, data: list, isFallback: true });
  } catch (error) {
    const list: any[] = [];
    skillCategories.forEach((cat, catIdx) => {
      cat.skills.forEach((s, sIdx) => {
        list.push({
          id: `${catIdx}-${sIdx}`,
          name: s.name,
          category: cat.category,
          level: s.level,
        });
      });
    });
    return NextResponse.json({ success: true, data: list, isFallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    try {
      const created = await prisma.skill.create({
        data: {
          name: body.name,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: created.id,
          name: created.name,
          category: body.category || 'General',
          level: Number(body.level) || 85,
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
