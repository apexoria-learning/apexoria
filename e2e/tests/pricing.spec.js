// Pricing — clicking any tier's "Enroll" button prefills the LeadForm's
// course select and scrolls to #contact. Values mirror the frontend
// data.js PATHS entries (crash-course | complete-course | salesforce-qa) plus the
// standalone Special Offer card.

import { test, expect } from '@playwright/test';
import { PRICING, LEAD_FORM } from '../utils/testIds.js';

const TIERS = [
  { id: 'crash-course', priceText: '₹9,999' },
  { id: 'complete-course', priceText: '₹21,999' },
  { id: 'salesforce-qa', priceText: '₹17,999' },
];

test.describe('pricing → lead form prefill', () => {
  test('homepage pricing renders 3 cards (crash, complete, qa)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const pricingSection = page.getByTestId(PRICING.section);
    await pricingSection.scrollIntoViewIfNeeded();

    // Should render exactly 3 featured cards
    for (const tier of TIERS) {
      await expect(page.getByTestId(PRICING.card(tier.id))).toBeVisible();
    }

    // Foundation should NOT render on homepage (homepageFeatured: false)
    await expect(page.getByTestId(PRICING.card('foundation'))).not.toBeVisible();
  });

  for (const tier of TIERS) {
    test(`${tier.id} tier prefills course + scrolls to #contact`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      // Scroll pricing section into view (not individual cards)
      const pricingSection = page.getByTestId(PRICING.section);
      await pricingSection.scrollIntoViewIfNeeded();

      const card = page.getByTestId(PRICING.card(tier.id));
      await expect(card).toBeVisible();

      await page.getByTestId(PRICING.enrollBtn(tier.id)).click();

      // Lead form section in view + course trigger reflects the tier text.
      await expect(page.getByTestId(LEAD_FORM.section)).toBeInViewport({ ratio: 0.1 });
      const courseTrigger = page.getByTestId(LEAD_FORM.course);
      await expect(courseTrigger).toContainText(tier.priceText);
    });
  }

  test('special offer card "Grab This Offer" → opens WhatsApp', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const card = page.getByTestId(PRICING.specialOfferCard);
    await card.scrollIntoViewIfNeeded();
    
    const offerBtn = page.getByTestId(PRICING.specialOfferEnroll);
    await expect(offerBtn).toBeVisible();

    // Button should be an anchor with WhatsApp href (not a prefill action)
    const href = await offerBtn.getAttribute('href');
    expect(href).toContain('wa.me/917498490687');
  });
});

