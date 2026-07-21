// Smoke — the single mandatory green baseline. If this fails, the dev
// server didn't come up correctly and every other spec is expected to
// fail too. Uses `domcontentloaded` (never `networkidle` — Lenis rAF loop).

import { test, expect } from '@playwright/test';
import { HERO, NAVBAR, LEAD_FORM, FOOTER } from '../utils/testIds.js';

test.describe('smoke', () => {
  test('landing page renders top-level sections', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveTitle(/apexoria/i);
    await expect(page.getByTestId(NAVBAR.root)).toBeVisible();
    await expect(page.getByTestId(HERO.section)).toBeVisible();
    await expect(page.getByTestId(LEAD_FORM.section)).toBeAttached();
    await expect(page.getByTestId(FOOTER.root)).toBeAttached();
  });
});
