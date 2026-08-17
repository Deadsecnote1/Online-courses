import { NextResponse } from 'next/server';
import { INITIAL_COURSES } from '@/data/mockCourses';
import Fuse from 'fuse.js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'All';
  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'newest';

  let result = [...INITIAL_COURSES];

  // 1. Category Filter
  if (category !== 'All') {
    result = result.filter((c) => c.category === category);
  }

  // 2. Client / Server Instant Search (Fuse.js)
  if (query.trim()) {
    const fuse = new Fuse(result, {
      keys: ['title', 'instructor', 'category', 'description', 'coupon_code'],
      threshold: 0.35,
    });
    result = fuse.search(query).map((res) => res.item);
  }

  // 3. Sorting
  if (sort === 'newest') {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sort === 'popular') {
    result.sort((a, b) => b.students_count - a.students_count);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }

  return NextResponse.json({
    success: true,
    total: result.length,
    courses: result,
  });
}
