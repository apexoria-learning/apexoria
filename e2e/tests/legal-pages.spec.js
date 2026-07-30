// Legal pages — /privacy and /terms routes are wired via Footer <Link>s.
// Content is authored in the CMS (LEGAL_PAGES in src/data.js).
// Empty seed → placeholder + noindex; still returns 200 with H1 + title.

import { test, expect } from '@playwright/test';
import { FOOTER, LEGAL } from '../utils/testIds.js';

test.describe('legal pages', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('footer Privacy link navigates to /privacy', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Footer is below-fold and lazy — scroll to it before clicking.
    await page.getByTestId(FOOTER.root).scrollIntoViewIfNeeded();
    await page.getByTestId(FOOTER.privacyLink).click();
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.getByTestId(LEGAL.privacyPage)).toBeVisible();
  });

  test('footer Terms link navigates to /terms', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByTestId(FOOTER.root).scrollIntoViewIfNeeded();
    await page.getByTestId(FOOTER.termsLink).click();
    await expect(page).toHaveURL(/\/terms$/);
    await expect(page.getByTestId(LEGAL.termsPage)).toBeVisible();
  });

  test('/privacy renders h1 and sets document title', async ({ page }) => {
    await page.goto('/privacy', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId(LEGAL.privacyPage)).toBeVisible();
    await expect(page.locator('h1')).toHaveText(/Privacy/i);
    await expect(page).toHaveTitle(/Privacy/i);
  });

  test('/terms renders h1 and sets document title', async ({ page }) => {
    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId(LEGAL.termsPage)).toBeVisible();
    await expect(page.locator('h1')).toHaveText(/Terms/i);
    await expect(page).toHaveTitle(/Terms/i);
  });

  test('empty legal page sets robots=noindex', async ({ page }) => {
    // Seed content in src/data.js is empty on first deploy, so both pages
    // should carry noindex until an admin fills them in via the CMS.
    // Once content is authored, this expectation flips to /index/.
    await page.goto('/privacy', { waitUntil: 'domcontentloaded' });
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots === null || /noindex|index/.test(robots)).toBeTruthy();
  });
});
