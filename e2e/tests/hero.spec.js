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

  // Perf-critical: the hero image must be a real <img> (not a CSS
  // background) with fetchpriority="high" so the browser's preload scanner
  // + <link rel="preload"> in index.html can fetch it in parallel with the
  // JS bundle. Guards the LCP fix landed 2026-07-27.
  test('hero LCP image is <img> with fetchpriority="high"', async ({ page }) => {
    const heroImg = page.locator('section#home img[fetchpriority="high"]').first();
    await expect(heroImg).toHaveCount(1);
    const src = await heroImg.getAttribute('src');
    // Must be same-origin (self-hosted), never pexels/unsplash/emergent CDN.
    expect(src).toMatch(/^\/images\//);
    // Preload link in <head> must reference the same asset stem.
    const preload = page.locator('link[rel="preload"][as="image"][fetchpriority="high"]').first();
    await expect(preload).toHaveCount(1);
  });
});
