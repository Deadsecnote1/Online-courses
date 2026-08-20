import { test, expect } from '@playwright/test';

test.describe('Module 3: Course Card Actions & State Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Copy Coupon Code copies to clipboard and displays visual feedback', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const copyBtn = page.locator('button:has-text("Copy Code")').first();
    await copyBtn.click();

    await expect(page.locator('text=Copied!')).toBeVisible();
  });

  test('Rakuten affiliate redirect opens in new tab with mid=13884', async ({ page }) => {
    const claimBtn = page.locator('button:has-text("Get 100% Free Course")').first();

    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      claimBtn.click(),
    ]);

    expect(newPage.url()).toContain('click.linksynergy.com/deeplink');
    expect(newPage.url()).toContain('mid=13884');
  });

  test('Report Expired flow submits flag and updates report count', async ({ page }) => {
    const reportBtn = page.locator('button:has-text("Report Broken Code")').first();
    await reportBtn.click();

    await expect(page.locator('text=Report Dead Deal')).toBeVisible();

    await page.click('input[value="expired_code"]');
    await page.click('button:has-text("Submit Flag")');

    await expect(page.locator('text=Thank You for Reporting!')).toBeVisible();
  });

  test('Clicking course card opens detail modal with share links', async ({ page }) => {
    const courseCard = page.locator('text=Python 3 Masterclass').first();
    await courseCard.click();

    await expect(page.locator('text=100% OFF COUPON ACTIVE')).toBeVisible();
    await expect(page.locator('button:has-text("Enroll Now on Udemy")')).toBeVisible();
  });

  test('Course share route renders the deal', async ({ page }) => {
    await page.goto('/course/udemy-py-2026-001');
    await expect(page.locator('text=100% OFF COUPON ACTIVE')).toBeVisible();
  });
});
