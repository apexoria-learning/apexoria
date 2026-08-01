// Interview Preparation section — homepage flagship (replaces FeaturedCourse)
//
// Tests the new InterviewPrep section at slot #6 on the homepage with Enroll +
// WhatsApp CTAs and correct prefill behavior.

import { test, expect } from '@playwright/test';
import { INTERVIEW_PREP, LEAD_FORM } from '../utils/testIds.js';

test.describe('interview prep section', () => {
  test('section renders with correct headline and gold "signed offer" text', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const section = page.getByTestId(INTERVIEW_PREP.section);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();

    // Headline should contain "signed offer" in gold
    const headline = page.getByTestId(INTERVIEW_PREP.headline);
    await expect(headline).toBeVisible();
    await expect(headline).toContainText('signed offer');

    // Price should render
    const price = page.getByTestId(INTERVIEW_PREP.price);
    await expect(price).toContainText('₹2,999');
  });

  test('enroll button click → scrolls to homepage #contact with correct dropdown value', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Scroll to Interview Prep section
    const section = page.getByTestId(INTERVIEW_PREP.section);
    await section.scrollIntoViewIfNeeded();

    // Click Enroll button
    await page.getByTestId(INTERVIEW_PREP.enrollBtn).click();

    // Should scroll to homepage lead form
    await expect(page.getByTestId(LEAD_FORM.section)).toBeInViewport({ ratio: 0.1 });

    // Dropdown should prefill with "Salesforce Interview Preparation — ₹2,999"
    const courseTrigger = page.getByTestId(LEAD_FORM.course);
    await expect(courseTrigger).toContainText(/Interview Preparation/i);
    await expect(courseTrigger).toContainText('₹2,999');
  });

  test('whatsapp button href includes wa.me/917498490687', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const section = page.getByTestId(INTERVIEW_PREP.section);
    await section.scrollIntoViewIfNeeded();

    const whatsappBtn = page.getByTestId(INTERVIEW_PREP.whatsappBtn);
    await expect(whatsappBtn).toBeVisible();

    const href = await whatsappBtn.getAttribute('href');
    expect(href).toContain('wa.me/917498490687');
  });
});
