import Fuse from 'fuse.js';
import { Course, CategoryFilter } from '@/types/course';

export type DirectorySort = 'newest' | 'popular' | 'rating' | 'expiry';

export function filterDirectory(
  courses: Course[],
  options: {
    searchQuery?: string;
    category?: CategoryFilter | string;
    sortOrder?: DirectorySort | string;
    includeExpired?: boolean;
  } = {}
): Course[] {
  const { searchQuery = '', category = 'All', sortOrder = 'newest', includeExpired = false } = options;

  let result = includeExpired ? [...courses] : courses.filter((c) => !c.is_expired);

  if (category && category !== 'All') {
    result = result.filter((c) => c.category === category);
  }

  if (searchQuery.trim()) {
    const fuse = new Fuse(result, {
      keys: ['title', 'instructor', 'category', 'description', 'coupon_code'],
      threshold: 0.35,
    });
    result = fuse.search(searchQuery).map((res) => res.item);
  }

  if (sortOrder === 'newest') {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sortOrder === 'popular') {
    result.sort((a, b) => b.students_count - a.students_count);
  } else if (sortOrder === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortOrder === 'expiry') {
    result.sort((a, b) => new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime());
  }

  return result;
}
