// Hero — renders the two primary CTAs and the "Enroll" button scrolls to
// #contact. Uses `expect(locator).toBeInViewport()` instead of any
// scroll-completion / networkidle wait.

import { test, expect } from '@playwright/test';
import { HERO, LEAD_FORM } from '../utils/testIds.js';

test.describe('hero', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('primary CTAs render', async ({ page }) => {
    await expect(page.getByTestId(HERO.enrollBtn)).toBeVisible();
    await expect(page.getByTestId(HERO.whatsappBtn)).toBeVisible();
  });

  test('enroll CTA scrolls to #contact lead form', async ({ page }) => {
    await page.getByTestId(HERO.enrollBtn).click();
    // Lenis animates the scroll — poll the locator's viewport-visibility.
    await expect(page.getByTestId(LEAD_FORM.section)).toBeInViewport({ ratio: 0.1 });
    await expect(page.getByTestId(LEAD_FORM.form)).toBeVisible();
  });

  test('WhatsApp CTA opens a wa.me link', async ({ page }) => {
    const wa = page.getByTestId(HERO.whatsappBtn);
    const href = await wa.getAttribute('href');
    expect(href).toMatch(/wa\.me|whatsapp/i);
  });
});
