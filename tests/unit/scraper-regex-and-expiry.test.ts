import { describe, it, expect, beforeEach } from 'vitest';
import { extractCouponCode, isCourseStale, ingestFeeds, expireStaleCourses, feedToCourse } from '../../src/lib/couponPipeline';
import { resetCatalog, getCatalog, getCourseById } from '../../src/data/catalogStore';
import { filterDirectory } from '../../src/utils/directory';
import { INITIAL_COURSES } from '../../src/data/mockCourses';

describe('Coupon extraction & expiration', () => {
  it('extracts couponCode from standard Udemy URLs', () => {
    expect(extractCouponCode('https://www.udemy.com/course/sample-course/?couponCode=FREE100OFF')).toBe('FREE100OFF');
  });

  it('extracts coupon_code from alternate URLs', () => {
    expect(extractCouponCode('https://www.udemy.com/course/sample-course/?coupon_code=TESTCODE2026&ref=tracking')).toBe(
      'TESTCODE2026'
    );
  });

  it('extracts code from short coupon links', () => {
    expect(extractCouponCode('https://www.udemy.com/course/sample/?code=AUGDEAL2026')).toBe('AUGDEAL2026');
  });

  it('marks stale when expires_at is in the past', () => {
    const course = {
      ...INITIAL_COURSES[0],
      expires_at: new Date(Date.now() - 1000).toISOString(),
      report_count: 0,
    };
    expect(isCourseStale(course)).toBe(true);
  });

  it('marks stale when report_count >= 3', () => {
    const course = { ...INITIAL_COURSES[0], report_count: 3 };
    expect(isCourseStale(course)).toBe(true);
  });
});

describe('Directory filter', () => {
  const catalog = INITIAL_COURSES;

  it('does not return expired courses by default', () => {
    const withExpired = catalog.map((c, i) => (i === 0 ? { ...c, is_expired: true } : c));
    const result = filterDirectory(withExpired, { searchQuery: 'Python' });
    expect(result.some((c) => c.is_expired)).toBe(false);
    expect(result.some((c) => c.title.includes('Python'))).toBe(false);
  });

  it('keeps category filter when searching', () => {
    const result = filterDirectory(catalog, {
      searchQuery: 'Hacking',
      category: 'IT & Security',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((c) => c.category === 'IT & Security')).toBe(true);
    expect(result.some((c) => c.title.includes('Python'))).toBe(false);
  });
});

describe('Pipeline ingest', () => {
  beforeEach(() => {
    resetCatalog();
  });

  it('appends new feed coupons to the catalog', async () => {
    const before = (await getCatalog()).length;
    const { newIngested, added } = await ingestFeeds();
    expect(newIngested).toBe(2);
    expect((await getCatalog()).length).toBe(before + 2);
    expect(await getCourseById(added[0].id)).toBeDefined();
  });

  it('does not duplicate coupon codes', async () => {
    await ingestFeeds();
    const second = await ingestFeeds();
    expect(second.newIngested).toBe(0);
  });

  it('feedToCourse wraps a Rakuten destination URL', () => {
    const course = feedToCourse({
      title: 'Test',
      category: 'Development',
      instructor: 'A',
      udemy_url: 'https://www.udemy.com/course/test/',
      coupon_code: 'FREETEST',
      original_price: 10,
      rating: 4.5,
    });
    expect(course.destination_url).toContain('click.linksynergy.com/deeplink');
    expect(course.destination_url).toContain('mid=13884');
  });

  it('expireStaleCourses flags past expiry', async () => {
    resetCatalog();
    const row = (await getCatalog())[0];
    row.expires_at = new Date(Date.now() - 1000).toISOString();
    row.is_expired = false;
    const { expiredCleaned } = await expireStaleCourses();
    expect(expiredCleaned).toBeGreaterThanOrEqual(1);
    expect(row.is_expired).toBe(true);
  });
});
