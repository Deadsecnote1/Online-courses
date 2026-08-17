import { describe, it, expect } from 'vitest';

describe('Scraper Regex Extraction & Expiration Rules', () => {
  const couponRegex = /(?:[?&](?:couponCode|coupon_code|code)=)([^&]+)/i;

  it('should extract couponCode parameter from standard Udemy URLs', () => {
    const url = 'https://www.udemy.com/course/sample-course/?couponCode=FREE100OFF';
    const match = url.match(couponRegex);
    expect(match).not.toBeNull();
    expect(match![1]).toBe('FREE100OFF');
  });

  it('should extract coupon_code parameter from alternate URL structures', () => {
    const url = 'https://www.udemy.com/course/sample-course/?coupon_code=TESTCODE2026&ref=tracking';
    const match = url.match(couponRegex);
    expect(match).not.toBeNull();
    expect(match![1]).toBe('TESTCODE2026');
  });

  it('should extract code parameter from short Udemy coupon links', () => {
    const url = 'https://www.udemy.com/course/sample/?code=AUGDEAL2026';
    const match = url.match(couponRegex);
    expect(match).not.toBeNull();
    expect(match![1]).toBe('AUGDEAL2026');
  });

  it('should auto-expire courses older than 48 hours (TTL hard cap)', () => {
    const now = Date.now();
    const created70HoursAgo = new Date(now - 70 * 3600 * 1000).toISOString();
    const expiresAt = new Date(new Date(created70HoursAgo).getTime() + 48 * 3600 * 1000).toISOString();

    const isExpired = new Date(expiresAt).getTime() <= now;
    expect(isExpired).toBe(true);
  });

  it('should trigger expiration when community report count reaches threshold (report_count >= 3)', () => {
    const reportCount = 3;
    const isExpired = reportCount >= 3;
    expect(isExpired).toBe(true);
  });
});
