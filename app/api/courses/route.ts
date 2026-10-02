import { NextRequest, NextResponse } from 'next/server';
import { initialCourses } from '@/lib/admin/courses-store';
import { courseSchema } from '@/lib/admin/validation';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: initialCourses,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = courseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid course data' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: `course-${Date.now()}`,
        ...parsed.data,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
