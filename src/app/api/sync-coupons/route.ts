import { NextResponse } from 'next/server';
import { INITIAL_COURSES } from '@/data/mockCourses';

export async function POST(request: Request) {
  // Authorization header verification for Cron trigger secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'demo-cron-secret';

  if (authHeader !== `Bearer ${cronSecret}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // Auto-expire items older than 48 hours
  const now = new Date().getTime();
  let expiredCount = 0;

  INITIAL_COURSES.forEach((course) => {
    const expires = new Date(course.expires_at).getTime();
    if (expires <= now) {
      course.is_expired = true;
      expiredCount += 1;
    }
  });

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    total_courses: INITIAL_COURSES.length,
    active_courses: INITIAL_COURSES.filter((c) => !c.is_expired).length,
    expired_cleaned: expiredCount,
  });
}
