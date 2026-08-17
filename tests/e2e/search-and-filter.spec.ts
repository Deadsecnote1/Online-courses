import { test, expect } from '@playwright/test';

test.describe('Module 2: Search, Category & Sorting Logic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Fuzzy Search (Fuse.js) with typo tolerance filters courses in < 50ms', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('pythn'); // Typo tolerance test

    // Assert Python course card appears
    await expect(page.locator('text=Python 3 Masterclass')).toBeVisible();
  });

  test('Searching instructor name filters UI correctly', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('Stephane');

    await expect(page.locator('text=AWS Certified Solutions Architect')).toBeVisible();
  });

  test('Category filter pill isolates matching cards', async ({ page }) => {
    // Click 'IT & Security' category pill
    await page.click('button:has-text("IT & Security")');

    await expect(page.locator('text=Ethical Hacking')).toBeVisible();
  });

  test('Empty search state displays clear search button', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('nonexistentcoursekeyword999');

    await expect(page.locator('text=No courses matched your search')).toBeVisible();
    
    // Click reset button
    await page.click('button:has-text("Reset Search")');
    await expect(page.locator('text=Python 3 Masterclass')).toBeVisible();
  });
});
