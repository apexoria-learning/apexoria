// Lead form — happy path. Fill the form, submit, assert the success view
// renders and the intercepted Google Form request carries the correct
// entry-ID mapping (name, phone, email, course, batch, message).
//
// The Google Form POST is intercepted via `page.route('**/formResponse*', …)`
// so real submissions never leave the test runner.

import { test, expect } from '@playwright/test';
import { installGoogleFormStub } from '../utils/gfStub.js';
import { LEAD_FORM, NAVBAR } from '../utils/testIds.js';

test.describe('lead form — happy path', () => {
  test('valid submit → success view + correct FormData payload', async ({ page }) => {
    const { requests } = installGoogleFormStub(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByTestId(NAVBAR.enrollBtn).click();
    await expect(page.getByTestId(LEAD_FORM.form)).toBeVisible();

    // Wait past the 2000ms time-trap so the submit actually POSTs.
    await page.waitForTimeout(2500);

    await page.getByTestId(LEAD_FORM.name).fill('Test User');
    await page.getByTestId(LEAD_FORM.phone).fill('9876543210');
    await page.getByTestId(LEAD_FORM.email).fill('e2e@example.test');

    // shadcn Select — click trigger, choose the first option that includes "Foundation".
    await page.getByTestId(LEAD_FORM.course).click();
    await page.getByRole('option', { name: /foundation/i }).first().click();

    // Preferred Batch Timing is required — pick Evening.
    await page.getByTestId(LEAD_FORM.batch).click();
    await page.getByRole('option', { name: /evening/i }).first().click();

    await page.getByTestId(LEAD_FORM.message).fill('End-to-end test — please ignore.');

    await page.getByTestId(LEAD_FORM.submitBtn).click();

    // Success view renders.
    await expect(page.getByTestId(LEAD_FORM.success)).toBeVisible();

    // Exactly one Google Form POST intercepted.
    expect(requests).toHaveLength(1);
    const req = requests[0];
    expect(req.method).toBe('POST');
    expect(req.url).toContain('/formResponse');

    // Entry-ID mapping (fixture values live in .env — placeholder
    // ids like entry.111 are fine as long as they match).
    const values = Object.values(req.fields);
    expect(values).toContain('Test User');
    expect(values.some((v) => v.replace(/\s/g, '') === '9876543210')).toBeTruthy();
    expect(values).toContain('e2e@example.test');
    expect(values.some((v) => /foundation/i.test(v))).toBeTruthy();
  });
});
