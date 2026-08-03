// Courses Page — navigation, enroll prefill, inline lead form, robots.txt
//
// Tests the new /courses route with all 6 course detail sections, the inline
// LeadForm, and the "View All 6 Courses →" link on the homepage Pricing section.

import { test, expect } from '@playwright/test';
import { PRICING, COURSES_PAGE, LEAD_FORM } from '../utils/testIds.js';
import { installGoogleFormStub } from '../utils/gfStub.js';

const COURSE_IDS = ['foundation', 'crash-course', 'complete-course', 'salesforce-qa', 'automation-qa', 'interview-prep'];

test.describe('courses page', () => {
  test('page renders with actual content (regression: LazyMotion strict mode)', async ({ page }) => {
    // Regression test for Phase 2A LazyMotion bug: when LazyMotion wrapper only
    // existed in App.js (homepage), other routes threw in strict mode, rendering
    // only outer section wrappers (navy <section> with no children). This test
    // asserts actual TEXT content is present, not just the section element.
    await page.goto('/courses', { waitUntil: 'domcontentloaded' });

    // Hero heading must render with actual text
    await expect(page.getByRole('heading', { name: /Explore All 6 Courses/i })).toBeVisible();

    // At least one course section should have visible text content
    const crashCourseSection = page.getByTestId(COURSES_PAGE.section('crash-course'));
    await expect(crashCourseSection.getByRole('heading', { name: /Crash Course/i })).toBeVisible();
  });

  test('navigation: click "View All 6 Courses" on homepage → lands on /courses with 6 sections', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Scroll to Pricing section and click "View All 6 Courses" link
    const pricingSection = page.getByTestId(PRICING.section);
    await pricingSection.scrollIntoViewIfNeeded();
    await page.getByTestId(PRICING.viewAllBtn).click();

    // Should land on /courses
    await page.waitForURL('/courses', { timeout: 5000 });
    expect(page.url()).toContain('/courses');

    // Hero should render
    await expect(page.getByTestId(COURSES_PAGE.hero)).toBeVisible();

    // All 6 course sections should render
    for (const id of COURSE_IDS) {
      await expect(page.getByTestId(COURSES_PAGE.section(id))).toBeVisible();
    }
  });

  test('enroll prefill: click Enroll on Interview Prep section → scrolls to inline LeadForm with correct dropdown value', async ({ page }) => {
    await page.goto('/courses', { waitUntil: 'domcontentloaded' });

    // Scroll to Interview Prep section
    const interviewPrepSection = page.getByTestId(COURSES_PAGE.section('interview-prep'));
    await interviewPrepSection.scrollIntoViewIfNeeded();

    // Click Enroll button
    await page.getByTestId(COURSES_PAGE.enrollBtn('interview-prep')).click();

    // Should scroll to inline LeadForm
    const inlineForm = page.getByTestId(COURSES_PAGE.inlineLeadForm);
    await expect(inlineForm).toBeInViewport({ ratio: 0.1 });

    // Dropdown should prefill with "Salesforce Interview Preparation — ₹2,999"
    const courseTrigger = inlineForm.locator(`[data-testid="${LEAD_FORM.course}"]`);
    await expect(courseTrigger).toContainText(/Interview Preparation/i);
    await expect(courseTrigger).toContainText('₹2,999');
  });

  test('inline lead form submits: anti-spam trio + Google Form stub', async ({ page }) => {
    // Install stub so no real submission reaches production Sheet
    await installGoogleFormStub(page);

    await page.goto('/courses', { waitUntil: 'domcontentloaded' });

    // Scroll to inline lead form
    const inlineForm = page.getByTestId(COURSES_PAGE.inlineLeadForm);
    await inlineForm.scrollIntoViewIfNeeded();

    // Fill valid data
    await page.getByTestId(LEAD_FORM.name).fill('Courses Page Test User');
    await page.getByTestId(LEAD_FORM.phone).fill('9876543210');
    await page.getByTestId(LEAD_FORM.email).fill('coursestest@example.com');

    // Select course
    await page.getByTestId(LEAD_FORM.course).click();
    await page.locator('[role="option"]').filter({ hasText: 'Complete Course' }).first().click();

    // Select batch timing
    await page.getByTestId(LEAD_FORM.batch).click();
    await page.locator('[role="option"]').filter({ hasText: 'Morning' }).first().click();

    // Optional message
    await page.getByTestId(LEAD_FORM.message).fill('Testing inline lead form on /courses');

    // Submit
    await page.getByTestId(LEAD_FORM.submitBtn).click();

    // Should see success view
    await expect(page.getByTestId(LEAD_FORM.success)).toBeVisible({ timeout: 5000 });
  });

  test('robots.txt HTTP fetch shows "Disallow: /admin" line', async ({ page, request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain('Disallow: /admin');
    expect(body).toContain('Disallow: /api/');
  });
});
