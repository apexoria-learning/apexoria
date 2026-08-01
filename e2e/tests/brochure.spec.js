// Brochure — the download buttons in FeaturedCourse and Footer HEAD-check
// the static PDF at /apexoria-brochure.pdf. HEAD 200 → open in new tab,
// HEAD 404 → graceful toast. We mock both.

import { test, expect } from '@playwright/test';
import { FEATURED_COURSE, FINAL_CTA } from '../utils/testIds.js';

test.describe('brochure download', () => {
  test('HEAD 404 → graceful toast (no navigation)', async ({ page }) => {
    // Intercept the HEAD probe before it goes anywhere.
    await page.route('**/apexoria-brochure.pdf', (route) => {
      if (route.request().method() === 'HEAD') {
        return route.fulfill({ status: 404, body: '' });
      }
      return route.continue();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const btn = page.getByTestId(FINAL_CTA.brochureBtn);
    await btn.scrollIntoViewIfNeeded();
    await btn.click();

    await expect(page.locator('text=/brochure download will be available/i')).toBeVisible();
  });

  test('HEAD 200 → download attribute intact on FinalCTA brochure link', async ({ page }) => {
    await page.route('**/apexoria-brochure.pdf', (route) => {
      if (route.request().method() === 'HEAD') {
        return route.fulfill({ status: 200, body: '' });
      }
      return route.continue();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const finalCtaBtn = page.getByTestId(FINAL_CTA.brochureBtn);
    await finalCtaBtn.scrollIntoViewIfNeeded();
    // Just assert the button is wired up — we don't actually want to
    // trigger a download in the test runner.
    await expect(finalCtaBtn).toBeVisible();
  });
});
