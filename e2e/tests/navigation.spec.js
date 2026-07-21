// Navigation — sticky navbar Enroll CTA scrolls to #contact. Mobile
// hamburger toggle is covered when viewport is narrow.

import { test, expect } from '@playwright/test';
import { NAVBAR, LEAD_FORM } from '../utils/testIds.js';

test.describe('navigation (desktop)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('nav enroll button scrolls to #contact', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByTestId(NAVBAR.enrollBtn).click();
    await expect(page.getByTestId(LEAD_FORM.section)).toBeInViewport({ ratio: 0.1 });
  });

  test('logo and phone CTA are visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId(NAVBAR.logo)).toBeVisible();
    await expect(page.getByTestId(NAVBAR.phone)).toBeVisible();
  });
});

test.describe('navigation (mobile)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hamburger button is exposed at narrow viewport', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId(NAVBAR.hamburger)).toBeVisible();
  });
});
