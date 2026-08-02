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

    // Install fake clock at T=0 to control time precisely.
    // The 2000ms trap is measured from PAGE MOUNT (pageMountedAt captured
    // in LeadForm.jsx at mount, NOT when lazy fields hydrate).
    await page.clock.install({ time: new Date('2026-08-02T12:00:00Z') });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // pageMountedAt is frozen at T=0 under the fake clock

    // Scroll to bottom to bring lead-form-section into viewport.
    // This doesn't depend on timers, so it works under fake clock.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Advance clock by 500ms to trigger requestIdleCallback / setTimeout
    // that loads the lazy LeadFormFields chunk. 500ms < 2000ms.
    await page.clock.fastForward(500);

    // Wait for fields to hydrate
    await expect(page.getByTestId(LEAD_FORM.form)).toBeVisible();

    // Submit immediately via testid click (elapsed: ~500ms < 2000ms).
    // The trap check runs BEFORE validate(), so empty fields are OK.
    await page.getByTestId(LEAD_FORM.submitBtn).click();

    // Advance clock to let React flush the state update (setSuccess)
    await page.clock.fastForward(100);

    // Trap fires → fake success view renders, but no POST left the browser
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
