import { NextResponse } from 'next/server';
import { INITIAL_COURSES } from '@/data/mockCourses';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { course_id, reason, notes } = body;

    if (!course_id) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }

    const courseIndex = INITIAL_COURSES.findIndex((c) => c.id === course_id);

    if (courseIndex !== -1) {
      INITIAL_COURSES[courseIndex].report_count += 1;
      
      // Auto-expire when report count reaches 3 or higher
      if (INITIAL_COURSES[courseIndex].report_count >= 3) {
        INITIAL_COURSES[courseIndex].is_expired = true;
      }

      return NextResponse.json({
        success: true,
        message: 'Report logged successfully',
        report_count: INITIAL_COURSES[courseIndex].report_count,
        is_expired: INITIAL_COURSES[courseIndex].is_expired,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Report logged',
      report_count: 1,
      is_expired: false,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
