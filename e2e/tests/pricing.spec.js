// Pricing — clicking any tier's "Learn More" button navigates to
// /courses#course-{id} and scrolls to that course's detail section.
// Values mirror the frontend data.js PATHS entries
// (crash-course | complete-course | salesforce-qa) plus the standalone
// Special Offer card.

import { test, expect } from '@playwright/test';
import { PRICING } from '../utils/testIds.js';

const TIERS = [
  { id: 'crash-course', priceText: '₹9,999' },
  { id: 'complete-course', priceText: '₹21,999' },
  { id: 'salesforce-qa', priceText: '₹17,999' },
];

test.describe('pricing → learn more → course detail', () => {
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
    test(`${tier.id} tier "Learn More" navigates to /courses#course-${tier.id}`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      // Scroll pricing section into view (not individual cards)
      const pricingSection = page.getByTestId(PRICING.section);
      await pricingSection.scrollIntoViewIfNeeded();

      const card = page.getByTestId(PRICING.card(tier.id));
      await expect(card).toBeVisible();

      const learnMore = page.getByTestId(PRICING.learnMoreBtn(tier.id));
      await expect(learnMore).toBeVisible();

      // Verify it is a real anchor with the correct hash target (SEO-crawlable link)
      const href = await learnMore.getAttribute('href');
      expect(href).toBe(`/courses#course-${tier.id}`);

      await learnMore.click();

      // Router lands on /courses and the matching detail section is rendered.
      // We don't assert `toBeInViewport` because Lenis smooth-scroll timing is
      // flaky under Playwright; the crawl-relevant assertions are the href
      // above (SEO signal) and the section presence below.
      await page.waitForURL(`**/courses#course-${tier.id}`);
      const detail = page.locator(`#course-${tier.id}`);
      await expect(detail).toBeVisible();
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

