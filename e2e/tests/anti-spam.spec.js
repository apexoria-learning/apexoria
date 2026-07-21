// Anti-spam trio — enforced client-side in LeadForm.jsx after the
// 2026-07-19 backend deletion (see .github/GOTCHAS.md). All three
// checks MUST silently drop the submission (no Google Form POST).
//
// 1. Honeypot: `company_website` filled → fake success, no POST.
// 2. Time-trap: submit within 2000ms of form mount → fake success, no POST.
// 3. Cooldown: rapid re-submit inside 12s → toast, no POST.

import { test, expect } from '@playwright/test';
import { installGoogleFormStub } from '../utils/gfStub.js';
import { LEAD_FORM, NAVBAR } from '../utils/testIds.js';

test.describe('anti-spam trio', () => {
  test('honeypot filled → fake success, no POST', async ({ page }) => {
    const { requests } = installGoogleFormStub(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByTestId(NAVBAR.enrollBtn).click();
    await expect(page.getByTestId(LEAD_FORM.form)).toBeVisible();
    await page.waitForTimeout(2500); // clear the time-trap

    // Fill the hidden honeypot the way a naive bot would.
    await page.evaluate(() => {
      const form = document.querySelector('[data-testid="lead-form"]');
      const hp = form?.querySelector('input.hidden');
      if (hp) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(hp, 'https://spam.example');
        hp.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    // Fill the visible fields too so the bot looks plausible.
    await page.getByTestId(LEAD_FORM.name).fill('Bot Name');
    await page.getByTestId(LEAD_FORM.phone).fill('9876543210');
    await page.getByTestId(LEAD_FORM.email).fill('bot@example.test');
    await page.getByTestId(LEAD_FORM.course).click();
    await page.getByRole('option', { name: /foundation/i }).first().click();

    await page.getByTestId(LEAD_FORM.submitBtn).click();

    // Fake-success view renders but no POST left the browser.
    await expect(page.getByTestId(LEAD_FORM.success)).toBeVisible();
    expect(requests).toHaveLength(0);
  });

  test('time-trap: submit within 2s silently drops', async ({ page }) => {
    const { requests } = installGoogleFormStub(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // The 2s trap is measured from LeadForm mount (page load).
    // Any interaction — navbar scroll, Playwright's auto-scroll +
    // field fills — easily eats 2s, so submit IMMEDIATELY via a direct
    // DOM `.click()` before doing anything else. The trap check runs
    // BEFORE `validate()`, so an empty submit still triggers the trap.
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="lead-submit-btn"]');
      if (btn) btn.click();
    });

    await expect(page.getByTestId(LEAD_FORM.success)).toBeVisible();
    expect(requests).toHaveLength(0);
  });

  test('cooldown: localStorage.apex_lead_last inside 12s blocks second submit', async ({ page }) => {
    const { requests } = installGoogleFormStub(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Prime the cooldown as if a submit just happened.
    await page.evaluate(() => {
      localStorage.setItem('apex_lead_last', String(Date.now()));
    });

    await page.getByTestId(NAVBAR.enrollBtn).click();
    await expect(page.getByTestId(LEAD_FORM.form)).toBeVisible();
    await page.waitForTimeout(2500); // clear the time-trap

    await page.getByTestId(LEAD_FORM.name).fill('Test User');
    await page.getByTestId(LEAD_FORM.phone).fill('9876543210');
    await page.getByTestId(LEAD_FORM.email).fill('e2e@example.test');
    await page.getByTestId(LEAD_FORM.course).click();
    await page.getByRole('option', { name: /foundation/i }).first().click();

    await page.getByTestId(LEAD_FORM.submitBtn).click();

    // Cooldown toast is visible + no POST fired.
    await expect(page.locator('text=/wait a few seconds/i')).toBeVisible();
    expect(requests).toHaveLength(0);
    await expect(page.getByTestId(LEAD_FORM.success)).toHaveCount(0);
  });
});
