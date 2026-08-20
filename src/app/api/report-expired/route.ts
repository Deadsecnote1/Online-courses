import { NextResponse } from 'next/server';
import { getCourseById, updateCourseById } from '@/data/catalogStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { course_id } = body;

    if (!course_id) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }

    if (!(await getCourseById(course_id))) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    const course = await updateCourseById(course_id, (c) => {
      c.report_count += 1;
      if (c.report_count >= 3) {
        c.is_expired = true;
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Report logged successfully',
      report_count: course!.report_count,
      is_expired: course!.is_expired,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
