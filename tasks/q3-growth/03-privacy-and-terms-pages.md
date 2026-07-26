# Privacy Policy + Terms of Service pages

**Quadrant:** Q3 (Tough & High Impact)
**Priority within quadrant:** 3
**Status:** Not started
**Owner (proposed):** Orchestrator (drafts copy) + Frontend (routes + UI)
**Impact:** Medium
**Effort:** Small–Medium
**Source audit item(s):** P21, R5

## Why

Three converging reasons:

1. **Legal** — India's **Digital Personal Data Protection Act 2023 (DPDP)** requires a published, accessible privacy policy for any site collecting personal data. The lead form collects name, phone, email, course interest → we're in scope.
2. **SEO / E-E-A-T** — Google's Search Quality guidelines treat missing privacy/terms pages as a negative *trust* signal. Sites without them lose Your Money Your Life (YMYL) trust weighting — and paid training is YMYL-adjacent.
3. **User surface** — the current [Footer.jsx](../../src/components/site/Footer.jsx#L61-L62) has "Privacy Policy" and "Terms" as dead `<button>` elements with no destination. Broken UI links visibly signal an unfinished site.

Also — [q4-defer/02-consent-mode-v2.md](../q4-defer/02-consent-mode-v2.md) (Consent Mode + cookie banner) *depends on* an actual privacy policy being live to link to.

## Scope

- Create `/privacy` route with:
  - What personal data is collected (name, phone, email, course interest, IP-derived analytics)
  - Why (lead qualification, counsellor callback, analytics)
  - Third-party processors: Google Forms (data storage), Google Analytics 4, PostHog, Vercel Analytics — link to each processor's privacy notice
  - User rights under DPDP (access, correction, erasure, grievance officer contact)
  - Retention period
  - Cookies used (functional + analytics; align with Consent Mode work)
  - Contact for privacy requests (must be a real inbox — see `User input needed`)
- Create `/terms` route with:
  - Course enrolment terms (payment, EMI, refund policy — must match [SPECIAL_OFFER](../../src/data.js) and [PATHS](../../src/data.js) content)
  - Placement support disclaimers ("placement support" ≠ "guaranteed placement" — needs precise language; see PRD)
  - Intellectual property (course content ownership)
  - Governing law + jurisdiction
- Update [Footer.jsx](../../src/components/site/Footer.jsx#L61-L62) to point Privacy / Terms buttons to `/privacy` and `/terms` as real `<a>` links.
- Add both URLs to [public/sitemap.xml](../../public/sitemap.xml).
- Add each page with unique `<title>`, meta description, `<meta name="robots" content="index, follow">`, and clean H1.
- No aggressive styling — use existing Tailwind + shadcn primitives; a simple prose layout with the "Hybrid Editorial Tech" typography.

## Out of scope

- Cookie banner UI itself — deferred to [q4-defer/02-consent-mode-v2.md](../q4-defer/02-consent-mode-v2.md).
- DPDP grievance officer *appointment* — legal formality, not code.
- Refund policy language *approval* — user must review with counsel before we publish; task can proceed with a `[REVIEW REQUIRED]` placeholder in that section.

## Files likely touched

- [src/pages/Privacy.jsx](../../src/pages/Privacy.jsx) — new file (or `src/routes/privacy.jsx`)
- [src/pages/Terms.jsx](../../src/pages/Terms.jsx) — new file
- [src/App.js](../../src/App.js) — introduce React Router if not already added by [04-per-course-landing-pages.md](./04-per-course-landing-pages.md); otherwise just add routes
- [src/components/site/Footer.jsx](../../src/components/site/Footer.jsx#L61-L62) — Privacy / Terms `<button>` → `<Link to="/privacy">` / `<Link to="/terms">`
- [public/sitemap.xml](../../public/sitemap.xml) — add two new `<url>` entries
- [package.json](../../package.json) — add `react-router-dom` dependency if not present

## Dependencies

- **React Router required** — coordinate with [04-per-course-landing-pages.md](./04-per-course-landing-pages.md) so we introduce the router *once* in one of the two tasks and both use it. Recommend: whichever ships first introduces `react-router-dom`; the second reuses it.
- Real support inbox from user (see `User input needed`).

## Acceptance criteria

1. `https://www.apexorialearning.in/privacy` returns 200 with unique title, meta, H1.
2. `https://www.apexorialearning.in/terms` returns 200 with unique title, meta, H1.
3. Footer Privacy / Terms links navigate to those pages (both via click and right-click → open in new tab).
4. Both URLs appear in `sitemap.xml`.
5. Rich Results Test — no schema errors introduced.
6. Manual legal review sign-off (owner responsibility): user reviews the drafted copy before merge.
7. Playwright: new spec `privacy.spec.js` asserts navigation from Footer + page renders H1 + `[data-testid="privacy-page"]` present per [AGENTS.md](../../.github/AGENTS.md) §1.

## User input needed

- Real support inbox (from Sprint 1's P18 blocker — if resolved there, reuse).
- Grievance officer contact (DPDP requires a named individual + email).
- Refund policy language — how many days? Pro-rated or all-or-nothing?
- Governing law + jurisdiction city.

## Notes / references

- DPDP Act 2023 text: https://www.meity.gov.in/data-protection-framework
- Google's E-E-A-T guidelines: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Do NOT copy-paste a template — use one as reference only, then adapt to the actual data collection surface in [LeadForm.jsx](../../src/components/site/LeadForm.jsx).
- Analytics stacks currently active per [.github/GOTCHAS.md](../../.github/GOTCHAS.md) 2026-07-21: GA4, PostHog, Vercel Analytics, optional GTM. Privacy policy must name all four.
