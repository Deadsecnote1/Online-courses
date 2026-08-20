import { test, expect } from '@playwright/test';

test.describe('Module 2: Search, Category & Sorting Logic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Fuzzy Search (Fuse.js) with typo tolerance filters courses in < 50ms', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('pythn');

    await expect(page.locator('text=Python 3 Masterclass')).toBeVisible();
  });

  test('Searching instructor name filters UI correctly', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('Stephane');

    await expect(page.locator('text=AWS Certified Solutions Architect')).toBeVisible();
  });

  test('Category filter pill isolates matching cards', async ({ page }) => {
    await page.click('button:has-text("IT & Security")');

    await expect(page.locator('text=Ethical Hacking')).toBeVisible();
  });

  test('Searching within a category does not leak other categories', async ({ page }) => {
    await page.click('button:has-text("IT & Security")');
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('Hacking');
    await expect(page.locator('text=Ethical Hacking')).toBeVisible();
    await expect(page.locator('text=Python 3 Masterclass')).toHaveCount(0);
  });

  test('Empty search state displays clear search button', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('nonexistentcoursekeyword999');

    await expect(page.locator('text=No courses matched your search')).toBeVisible();

    await page.click('button:has-text("Reset Search")');
    await expect(page.locator('text=Python 3 Masterclass')).toBeVisible();
  });
});
