import { NextResponse } from 'next/server';
import { filterDirectory } from '@/utils/directory';
import { catalogDriver, getCatalog, getCourseById } from '@/data/catalogStore';
import { CategoryFilter } from '@/types/course';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const includeExpired = searchParams.get('include_expired') === '1';
  const category = (searchParams.get('category') || 'All') as CategoryFilter;
  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'newest';

  if (id) {
    const course = await getCourseById(id);
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, course, courses: [course], driver: catalogDriver() });
  }

  const courses = filterDirectory(await getCatalog(), {
    searchQuery: query,
    category,
    sortOrder: sort,
    includeExpired,
  });

  return NextResponse.json({
    success: true,
    total: courses.length,
    courses,
    driver: catalogDriver(),
  });
}
