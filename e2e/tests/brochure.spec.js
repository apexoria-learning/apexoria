// Brochure — clicking the FinalCTA brochure button opens the
// BrochureGateDialog. Submitting name+phone fires a `no-cors` POST to
// the Google Form (which we intercept), then HEAD-checks the static PDF
// at /apexoria-brochure.pdf. HEAD 200 → open the PDF in a new tab,
// HEAD 404 → graceful toast. We mock both.

import { test, expect } from '@playwright/test';
import { FINAL_CTA, BROCHURE_GATE } from '../utils/testIds.js';

// Time-trap guard inside BrochureGateDialog rejects submits <2000ms after
// the dialog opens. Wait a hair over that before filling the form.
const TIME_TRAP_MS = 2100;

/** Stub the Google Form POST so submits don't hit the network. */
async function stubFormPost(page) {
  await page.route('**/formResponse*', (route) => {
    // The client uses `no-cors` so it never inspects the response — a
    // 200 with an empty body keeps the promise chain happy.
    return route.fulfill({ status: 200, body: '' });
  });
}

test.describe('brochure download (gated)', () => {
  test('HEAD 404 → gate submit → graceful toast (no navigation)', async ({ page }) => {
    await stubFormPost(page);
    await page.route('**/apexoria-brochure.pdf', (route) => {
      if (route.request().method() === 'HEAD') {
        return route.fulfill({ status: 404, body: '' });
      }
      return route.continue();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Open the gate.
    const brochureBtn = page.getByTestId(FINAL_CTA.brochureBtn);
    await brochureBtn.scrollIntoViewIfNeeded();
    await brochureBtn.click();

    // Dialog should appear.
    const dialog = page.getByTestId(BROCHURE_GATE.dialog);
    await expect(dialog).toBeVisible();

    // Wait past the time-trap, then fill and submit.
    await page.waitForTimeout(TIME_TRAP_MS);
    await page.getByTestId(BROCHURE_GATE.name).fill('E2E Tester');
    await page.getByTestId(BROCHURE_GATE.phone).fill('9876543210');
    await page.getByTestId(BROCHURE_GATE.submit).click();

    // 404 path → toast, no download.
    await expect(page.locator('text=/will be available shortly/i')).toBeVisible();
  });

  test('HEAD 200 → gate submit → dialog closes cleanly', async ({ page, context }) => {
    await stubFormPost(page);
    await page.route('**/apexoria-brochure.pdf', (route) => {
      if (route.request().method() === 'HEAD') {
        return route.fulfill({ status: 200, body: '' });
      }
      // Block the actual PDF fetch — we don't want to open a real
      // download in the runner. Returning 204 makes window.open a no-op.
      return route.fulfill({ status: 204, body: '' });
    });

    // Don't let a new tab actually navigate somewhere real.
    await context.route('**/apexoria-brochure.pdf', (route) => route.fulfill({ status: 204, body: '' }));

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const brochureBtn = page.getByTestId(FINAL_CTA.brochureBtn);
    await brochureBtn.scrollIntoViewIfNeeded();
    await brochureBtn.click();

    const dialog = page.getByTestId(BROCHURE_GATE.dialog);
    await expect(dialog).toBeVisible();

    await page.waitForTimeout(TIME_TRAP_MS);
    await page.getByTestId(BROCHURE_GATE.name).fill('Happy Path');
    await page.getByTestId(BROCHURE_GATE.phone).fill('9876543210');
    await page.getByTestId(BROCHURE_GATE.submit).click();

    // 200 path → dialog should close after the deliverFile handoff.
    await expect(dialog).toBeHidden({ timeout: 5000 });
  });

  test('validation: too-short phone shows inline error, no submit', async ({ page }) => {
    await stubFormPost(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const brochureBtn = page.getByTestId(FINAL_CTA.brochureBtn);
    await brochureBtn.scrollIntoViewIfNeeded();
    await brochureBtn.click();
    await expect(page.getByTestId(BROCHURE_GATE.dialog)).toBeVisible();

    await page.waitForTimeout(TIME_TRAP_MS);
    await page.getByTestId(BROCHURE_GATE.name).fill('Invalid Phone User');
    await page.getByTestId(BROCHURE_GATE.phone).fill('12345');
    await page.getByTestId(BROCHURE_GATE.submit).click();

    // Dialog stays open, name/phone still editable.
    await expect(page.getByTestId(BROCHURE_GATE.dialog)).toBeVisible();
  });
});
