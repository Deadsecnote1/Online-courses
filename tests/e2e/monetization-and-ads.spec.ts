import { test, expect } from '@playwright/test';

test.describe('Module 4: Monetization & Ad Placements (AdBanner.tsx)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('AD_ZONE_HEADER renders leaderboard container with pre-reserved minHeight', async ({ page }) => {
    const headerAd = page.locator('.ad-container').first();
    await expect(headerAd).toBeVisible();

    // Check minHeight style prevents Cumulative Layout Shift (CLS < 0.1)
    const minHeight = await headerAd.getAttribute('style');
    expect(minHeight).toContain('min-height');
  });

  test('AD_ZONE_INFEED injects native ad cards into grid', async ({ page }) => {
    const infeedAd = page.locator('text=Native In-Feed Unit').first();
    await expect(infeedAd).toBeVisible();
  });

  test('Mobile sticky footer anchor banner renders on mobile viewport (<768px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const stickyFooter = page.locator('text=SPONSORED').first();
    await expect(stickyFooter).toBeVisible();
  });

  test('Secondary contextual referral widget appears inside Course Detail Modal', async ({ page }) => {
    await page.click('text=Python 3 Masterclass');

    await expect(page.locator('text=Recommended Developer Tool')).toBeVisible();
    await expect(page.locator('text=Claim Offer')).toBeVisible();
  });
});
