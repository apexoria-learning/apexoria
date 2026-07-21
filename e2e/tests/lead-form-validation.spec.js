// Lead form — client-side validation. Invalid Indian phone / email each
// surface an inline error and the Google Form POST never fires.

import { test, expect } from '@playwright/test';
import { installGoogleFormStub } from '../utils/gfStub.js';
import { LEAD_FORM, NAVBAR } from '../utils/testIds.js';

test.describe('lead form — validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByTestId(NAVBAR.enrollBtn).click();
    await expect(page.getByTestId(LEAD_FORM.form)).toBeVisible();
    // Clear the 2s time-trap so we can exercise the validator, not the trap.
    await page.waitForTimeout(2500);
  });

  test('invalid phone blocks submit + shows inline error', async ({ page }) => {
    const { requests } = installGoogleFormStub(page);

    await page.getByTestId(LEAD_FORM.name).fill('Test User');
    await page.getByTestId(LEAD_FORM.phone).fill('12345'); // fails PHONE_RE
    await page.getByTestId(LEAD_FORM.email).fill('valid@example.test');
    await page.getByTestId(LEAD_FORM.course).click();
    await page.getByRole('option', { name: /foundation/i }).first().click();

    await page.getByTestId(LEAD_FORM.submitBtn).click();

    // Inline error appears near the phone input.
    await expect(page.locator('text=/valid indian mobile/i')).toBeVisible();
    // No POST fired, no success view.
    expect(requests).toHaveLength(0);
    await expect(page.getByTestId(LEAD_FORM.success)).toHaveCount(0);
  });

  test('invalid email blocks submit + shows inline error', async ({ page }) => {
    const { requests } = installGoogleFormStub(page);

    await page.getByTestId(LEAD_FORM.name).fill('Test User');
    await page.getByTestId(LEAD_FORM.phone).fill('9876543210');
    await page.getByTestId(LEAD_FORM.email).fill('not-an-email');
    await page.getByTestId(LEAD_FORM.course).click();
    await page.getByRole('option', { name: /foundation/i }).first().click();

    await page.getByTestId(LEAD_FORM.submitBtn).click();

    await expect(page.locator('text=/valid email/i')).toBeVisible();
    expect(requests).toHaveLength(0);
    await expect(page.getByTestId(LEAD_FORM.success)).toHaveCount(0);
  });

  test('missing name blocks submit', async ({ page }) => {
    const { requests } = installGoogleFormStub(page);

    await page.getByTestId(LEAD_FORM.phone).fill('9876543210');
    await page.getByTestId(LEAD_FORM.email).fill('valid@example.test');
    await page.getByTestId(LEAD_FORM.course).click();
    await page.getByRole('option', { name: /foundation/i }).first().click();

    await page.getByTestId(LEAD_FORM.submitBtn).click();

    await expect(page.locator('text=/please enter your name/i')).toBeVisible();
    expect(requests).toHaveLength(0);
  });
});
