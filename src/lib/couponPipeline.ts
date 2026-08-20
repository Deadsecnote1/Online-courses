import { Course } from '@/types/course';
import { generateUdemyAffiliateUrl } from '@/utils/affiliate';
import { addCourse, getCatalog, updateCourseById } from '@/data/catalogStore';

export const COUPON_QUERY_REGEX = /(?:[?&](?:couponCode|coupon_code|code)=)([^&]+)/i;

export interface FeedCoupon {
  title: string;
  category: string;
  instructor: string;
  udemy_url: string;
  coupon_code: string;
  original_price: number;
  rating: number;
}

export const PIPELINE_FEEDS: FeedCoupon[] = [
  {
    title: 'Rust Programming & WebAssembly Systems Engineering 2026',
    category: 'Development',
    instructor: 'Jon Gjengset',
    udemy_url: 'https://www.udemy.com/course/rust-systems-programming/',
    coupon_code: 'FREERUST2026',
    original_price: 119.99,
    rating: 4.9,
  },
  {
    title: 'Docker & Kubernetes Hands-On Microservices Masterclass',
    category: 'IT & Security',
    instructor: 'Bret Fisher',
    udemy_url: 'https://www.udemy.com/course/docker-kubernetes-bootcamp/',
    coupon_code: 'FREEDOCKER2026',
    original_price: 129.99,
    rating: 4.8,
  },
];

const CATEGORIES: Course['category'][] = [
  'Development',
  'IT & Security',
  'Business',
  'Design',
  'Marketing',
  'Data Science',
  'Personal Development',
];

export function extractCouponCode(url: string): string | null {
  const match = url.match(COUPON_QUERY_REGEX);
  return match ? decodeURIComponent(match[1]) : null;
}

export function isCourseStale(course: Course, now = Date.now()): boolean {
  return new Date(course.expires_at).getTime() <= now || course.report_count >= 3;
}

function asCategory(raw: string): Course['category'] {
  return CATEGORIES.includes(raw as Course['category']) ? (raw as Course['category']) : 'Development';
}

export function feedToCourse(feed: FeedCoupon): Course {
  const coupon = feed.coupon_code || extractCouponCode(feed.udemy_url) || 'FREE';
  const now = Date.now();

  return {
    id: `udemy-pipe-${coupon.toLowerCase()}`,
    title: feed.title,
    description: `Verified 100% OFF coupon for ${feed.title}.`,
    category: asCategory(feed.category),
    instructor: feed.instructor,
    rating: feed.rating,
    reviews_count: 1200,
    students_count: 15400,
    original_price: feed.original_price,
    coupon_code: coupon,
    raw_udemy_url: feed.udemy_url,
    destination_url: generateUdemyAffiliateUrl(feed.udemy_url, coupon, 'cron_sync'),
    created_at: new Date(now).toISOString(),
    expires_at: new Date(now + 48 * 3600 * 1000).toISOString(),
    is_expired: false,
    is_featured: false,
    report_count: 0,
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    level: 'All Levels',
    duration: '10.0 total hours',
    language: 'English',
  };
}

export async function ingestFeeds(feeds: FeedCoupon[] = PIPELINE_FEEDS): Promise<{ newIngested: number; added: Course[] }> {
  const added: Course[] = [];
  const catalog = await getCatalog();

  for (const feed of feeds) {
    const coupon = feed.coupon_code || extractCouponCode(feed.udemy_url) || '';
    const exists = catalog.some((c) => c.coupon_code === coupon) || added.some((c) => c.coupon_code === coupon);
    if (exists || !coupon) continue;

    const course = feedToCourse({ ...feed, coupon_code: coupon });
    await addCourse(course);
    added.push(course);
  }

  return { newIngested: added.length, added };
}

export async function expireStaleCourses(now = Date.now()): Promise<{ expiredCleaned: number }> {
  let expiredCleaned = 0;
  const catalog = await getCatalog();
  for (const course of catalog) {
    if (isCourseStale(course, now) && !course.is_expired) {
      await updateCourseById(course.id, (row) => {
        row.is_expired = true;
      });
      expiredCleaned += 1;
    }
  }
  return { expiredCleaned };
}

export async function runCouponPipeline() {
  const ingest = await ingestFeeds();
  const expire = await expireStaleCourses();
  const catalog = await getCatalog();

  return {
    newIngested: ingest.newIngested,
    added_ids: ingest.added.map((c) => c.id),
    expired_cleaned: expire.expiredCleaned,
    total_courses: catalog.length,
    active_courses: catalog.filter((c) => !c.is_expired).length,
    timestamp: new Date().toISOString(),
  };
}
