import { test, expect } from '@playwright/test';

test.describe('Module 5: Legal & Compliance Verification', () => {
  test('Privacy Policy page contains GDPR, CCPA, and AdSense disclosures', async ({ page }) => {
    await page.goto('/privacy-policy');

    await expect(page.locator('h1:has-text("Privacy Policy")')).toBeVisible();
    await expect(page.locator('text=GDPR & CCPA Compliance')).toBeVisible();
    await expect(page.locator('text=Google AdSense')).toBeVisible();
    await expect(page.locator('text=Rakuten Advertising')).toBeVisible();
  });

  test('Terms of Service page contains Udemy trademark disclaimer and redemption limits', async ({ page }) => {
    await page.goto('/terms-of-service');

    await expect(page.locator('h1:has-text("Terms of Service")')).toBeVisible();
    await expect(page.locator('text=Udemy is a registered trademark of Udemy, Inc.')).toBeVisible();
    await expect(page.locator('text=1,000 redemptions per code')).toBeVisible();
  });

  test('Affiliate Disclosure page contains FTC compliance statement and $0 price guarantee', async ({ page }) => {
    await page.goto('/affiliate-disclosure');

    await expect(page.locator('h1:has-text("Affiliate Disclosure")')).toBeVisible();
    await expect(page.locator('text=Federal Trade Commission (FTC)')).toBeVisible();
    await expect(page.locator('text=100% FREE ($0.00)')).toBeVisible();
  });

  test('Global footer displays trademark disclaimer across all routes', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('text=Disclaimer: Udemy is a trademark of Udemy, Inc.')).toBeVisible();
  });
});
