// Central registry of the `data-testid` values the specs use.
//
// Historically the frontend components inline their `data-testid` strings
// (see src/components/site/*.jsx). The registry at
// src/constants/testIds/ currently only covers auth + home
// placeholders. Rather than block E2E on a Frontend backfill, we mirror
// the ids actually shipped in the JSX here and cite the source component.
//
// Rule: whenever a new spec needs an id, add it here and reference the JSX
// line — never inline the string in a spec. If an id changes in JSX,
// update it here and the specs stay green.
//
// Bridge: `export *` from the real registry so consumers can also do
// `import { LOGIN } from '../utils/testIds.js'` and get the auth ids.

export * from '../../src/constants/testIds/index.js';

// Hero — src/components/site/Hero.jsx
export const HERO = {
  section: 'hero-section',
  enrollBtn: 'hero-enroll-btn',
  whatsappBtn: 'hero-whatsapp-btn',
};

// Navbar — src/components/site/Navbar.jsx
export const NAVBAR = {
  root: 'navbar',
  logo: 'nav-logo',
  phone: 'nav-phone',
  enrollBtn: 'nav-enroll-btn',
  hamburger: 'nav-hamburger',
};

// Pricing — src/components/site/Pricing.jsx
// Card + enroll ids are templated on the PATHS[].id: foundation | crash | complete.
export const PRICING = {
  section: 'pricing-section',
  card: (id) => `pricing-card-${id}`,
  enrollBtn: (id) => `pricing-enroll-${id}`,
  specialOfferCard: 'special-offer-card',
  specialOfferEnroll: 'special-offer-enroll',
};

// FeaturedCourse — src/components/site/FeaturedCourse.jsx
// Section now renders two tracks (development, qa) with two course cards each.
// `brochureBtn` (course-brochure-btn) is the FIRST card's brochure button —
// preserved for backwards compatibility with brochure.spec.js. Per-course
// brochure buttons carry `curriculum-brochure-<course-key>`.
export const FEATURED_COURSE = {
  section: 'featured-course-section',
  trackHeading: (trackKey) => `curriculum-track-${trackKey}`,
  courseCard: (courseKey) => `curriculum-course-${courseKey}`,
  courseBrochureBtn: (courseKey) => `curriculum-brochure-${courseKey}`,
  miniProjectCallout: 'mini-project-callout',
  courseEnrollBtn: 'course-enroll-btn',
  brochureBtn: 'course-brochure-btn',
};

// LeadForm — src/components/site/LeadForm.jsx
export const LEAD_FORM = {
  section: 'lead-form-section',
  form: 'lead-form',
  success: 'lead-form-success',
  name: 'lead-name',
  phone: 'lead-phone',
  email: 'lead-email',
  course: 'lead-course',
  batch: 'lead-batch',
  message: 'lead-message',
  submitBtn: 'lead-submit-btn',
};

// Batches — src/components/site/Batches.jsx
export const BATCHES = {
  section: 'batches-section',
  row: (i) => `batch-row-${i}`,
  reserveBtn: (i) => `batch-reserve-${i}`,
};

// PlacementSupport — src/components/site/PlacementSupport.jsx
export const PLACEMENT = {
  section: 'placement-section',
  ctaBtn: 'placement-cta-btn',
};

// Footer — src/components/site/Footer.jsx
export const FOOTER = {
  root: 'footer',
  resource: (slug) => `footer-resource-${slug}`,
  privacyLink: 'footer-privacy-link',
  termsLink: 'footer-terms-link',
};

// Legal pages — src/pages/Privacy.jsx + src/pages/Terms.jsx
export const LEGAL = {
  privacyPage: 'privacy-page',
  termsPage: 'terms-page',
};

// FinalCTA — src/components/site/FinalCTA.jsx
export const FINAL_CTA = {
  section: 'final-cta-section',
  enrollBtn: 'final-enroll-btn',
  phone: 'final-phone',
  brochureBtn: 'final-brochure-btn',
};

// WhatsAppWidget — src/components/site/WhatsAppWidget.jsx
export const WHATSAPP = {
  widget: 'whatsapp-widget',
};

// EditorialMarquee — src/components/site/EditorialMarquee.jsx
export const EDITORIAL = {
  marquee: 'editorial-marquee',
};

// Founder — src/components/site/Founder.jsx
export const FOUNDER = {
  section: 'founder-section',
  photoPlaceholder: 'founder-photo-placeholder',
};

// SuccessStories — src/components/site/SuccessStories.jsx
export const SUCCESS_STORIES = {
  section: 'success-stories-section',
};
