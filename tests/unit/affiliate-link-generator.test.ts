import { describe, it, expect } from 'vitest';
import { generateUdemyAffiliateUrl, formatPrice, formatTimeRemaining } from '../../src/utils/affiliate';

describe('Rakuten Affiliate Link Generator & Formatter Utils', () => {
  it('should generate valid Rakuten deep link with merchant ID 13884 and encoded destination URL', () => {
    const rawUrl = 'https://www.udemy.com/course/python-masterclass/';
    const couponCode = 'FREE2026';
    const subId = 'telegram_dev';

    const affiliateUrl = generateUdemyAffiliateUrl(rawUrl, couponCode, subId);

    // 1. Assert Rakuten base Gateway URL
    expect(affiliateUrl).toContain('https://click.linksynergy.com/deeplink');

    // 2. Assert Udemy Merchant ID 13884 is present
    expect(affiliateUrl).toContain('mid=13884');

    // 3. Assert SubID parameter is present
    expect(affiliateUrl).toContain(`u1=${subId}`);

    // 4. Assert destination URL is properly percent-encoded
    const encodedTarget = encodeURIComponent('https://www.udemy.com/course/python-masterclass/?couponCode=FREE2026');
    expect(affiliateUrl).toContain(`murl=${encodedTarget}`);
  });

  it('should format numbers into USD price strings correctly', () => {
    expect(formatPrice(119.99)).toBe('$119.99');
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('should calculate time remaining correctly for future expiry dates', () => {
    const futureDate = new Date(Date.now() + 5 * 3600 * 1000).toISOString();
    const timeStr = formatTimeRemaining(futureDate);
    expect(timeStr).toContain('h');
    expect(timeStr).toContain('left');
  });

  it('should return Expired if date is in the past', () => {
    const pastDate = new Date(Date.now() - 3600 * 1000).toISOString();
    expect(formatTimeRemaining(pastDate)).toBe('Expired');
  });
});
