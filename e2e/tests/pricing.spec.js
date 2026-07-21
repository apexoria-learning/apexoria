// Pricing — clicking any tier's "Enroll" button prefills the LeadForm's
// course select and scrolls to #contact. Values mirror the frontend
// data.js PATHS entries (foundation | crash | complete) plus the
// standalone Special Offer card.

import { test, expect } from '@playwright/test';
import { PRICING, LEAD_FORM } from '../utils/testIds.js';

const TIERS = [
  { id: 'foundation', priceText: '₹1,999' },
  { id: 'crash', priceText: '₹9,999' },
  { id: 'complete', priceText: '₹21,999' },
];

test.describe('pricing → lead form prefill', () => {
  for (const tier of TIERS) {
    test(`${tier.id} tier prefills course + scrolls to #contact`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      const card = page.getByTestId(PRICING.card(tier.id));
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();

      await page.getByTestId(PRICING.enrollBtn(tier.id)).click();

      // Lead form section in view + course trigger reflects the tier text.
      await expect(page.getByTestId(LEAD_FORM.section)).toBeInViewport({ ratio: 0.1 });
      const courseTrigger = page.getByTestId(LEAD_FORM.course);
      await expect(courseTrigger).toContainText(tier.priceText);
    });
  }

  test('special offer card enroll scrolls + prefills', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const card = page.getByTestId(PRICING.specialOfferCard);
    await card.scrollIntoViewIfNeeded();
    await page.getByTestId(PRICING.specialOfferEnroll).click();

    await expect(page.getByTestId(LEAD_FORM.section)).toBeInViewport({ ratio: 0.1 });
    await expect(page.getByTestId(LEAD_FORM.course)).toContainText(/Special Offer/i);
  });
});
