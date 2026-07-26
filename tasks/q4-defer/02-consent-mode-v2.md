# Consent Mode v2 + cookie banner (DPDP compliance)

**Quadrant:** Q4 (Tough & Low Impact for SEO — but high legal impact)
**Priority within quadrant:** 2
**Status:** Deferred — bundled with Privacy Policy work, ship together
**Owner (proposed):** Frontend + Orchestrator (Consent Mode config) + user (legal review)
**Impact:** Low-direct SEO, High legal/compliance
**Effort:** Medium
**Source audit item(s):** P28, P29, R12

## Why

Three converging drivers:

1. **India's DPDP Act 2023** requires explicit consent before analytics / advertising cookies fire. GA4 currently fires unconditionally (see [.github/GOTCHAS.md](../../.github/GOTCHAS.md) 2026-07-21 GA4 entry — "GA4 must be gated on user consent (currently fires unconditionally — accepted trade-off pre-launch)"). That trade-off expires the moment the site is publicly promoted at scale.
2. **Google Consent Mode v2** — Google Ads and GA4 both use consent signals for bidding + attribution modelling. Without Consent Mode v2 wired up, Google Ads campaigns lose ~15–30 % of conversion tracking accuracy for EEA + emerging DPDP regions.
3. **Trim the analytics stack** (P28) — currently four analytics stacks fire simultaneously: PostHog, Vercel Analytics, GA4, Emergent (last one hopefully removed in Sprint 1 P27). Consent gating is the natural chokepoint to enforce which stacks require consent (GA4 + PostHog) and which don't (Vercel Analytics, if operating in privacy-preserving mode).

Listed as Q4 for SEO because direct ranking impact is small, but legal-first — this **must** ship before a public launch push.

## Scope

**Phase A — cookie banner UI:**

- Choose a library. Recommended: [`cookieconsent`](https://github.com/orestbida/cookieconsent) (vanilla, ~5 KB gzipped, no framework dependency, Google Consent Mode v2 support built-in). Alternatives: `@osano/cookieconsent`, `usercentrics-cmp` (heavier, feature-rich).
- Categories:
  - `necessary` — always on (functional, security)
  - `analytics` — GA4, PostHog session recording — off by default, requires opt-in
  - `advertising` — none currently used, but declare category for future Google Ads
- Banner UX: bottom sheet on mobile, small bottom-right card on desktop, brand palette per [design_guidelines.json](../../design_guidelines.json).
- Cookie preference centre accessible from Footer link.

**Phase B — Consent Mode v2 wiring:**

- Update [public/index.html](../../public/index.html) GA4 snippet:
  ```html
  <!-- BEFORE gtag('js', new Date()) -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    // Consent Mode v2 default: everything denied except security_storage
    gtag('consent', 'default', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied',
      'functionality_storage': 'granted',
      'security_storage': 'granted',
      'wait_for_update': 500
    });
    gtag('js', new Date());
    gtag('config', 'G-2GWDGQ115Q');
  </script>
  ```
- When banner captures consent, dispatch `gtag('consent', 'update', {...})` with granted values.
- Gate PostHog `init()` behind analytics consent — currently fires unconditionally.
- Vercel Analytics runs in privacy-preserving mode (no cookies) — no consent gating needed but disclose in Privacy Policy.

**Phase C — Privacy Policy alignment:**

- Update [tasks/q3-growth/03-privacy-and-terms-pages.md](../q3-growth/03-privacy-and-terms-pages.md) output — the privacy page must list all cookie categories, name every analytics processor, and link to Consent Mode preference centre.

**Phase D — Emergent script cleanup (P28):**

- If Sprint 1 P27 did not already remove `<script src="https://assets.emergent.sh/scripts/emergent-main.js">`, do it here.

## Out of scope

- Multi-language banner — English only for now (English is the DPDP-compliant lingua franca for a national audience).
- Server-side consent enforcement — client-side gating is sufficient given the current analytics-only surface. Revisit if the site ever runs paid ads or does server-side event forwarding.

## Files likely touched

- [package.json](../../package.json) — add cookie-consent library
- [public/index.html](../../public/index.html) — Consent Mode v2 default state, remove Emergent script (if not done in Sprint 1)
- [src/lib/analytics.js](../../src/lib/analytics.js) — gate `initAnalytics()` behind consent
- [src/App.js](../../src/App.js) — mount cookie banner + preference centre
- [src/components/site/CookieBanner.jsx](../../src/components/site/CookieBanner.jsx) — new
- [src/components/site/CookiePreferences.jsx](../../src/components/site/CookiePreferences.jsx) — new
- [src/components/site/Footer.jsx](../../src/components/site/Footer.jsx) — new "Cookie Preferences" link
- [.github/GOTCHAS.md](../../.github/GOTCHAS.md) — update the 2026-07-21 GA4 entry after ship: "Consent Mode v2 shipped YYYY-MM-DD; GA4 no longer fires unconditionally"

## Dependencies

- **Coordinate with [q3-growth/03-privacy-and-terms-pages.md](../q3-growth/03-privacy-and-terms-pages.md)** — cannot ship a cookie banner that links to `/privacy` before that page exists. Recommended: same PR chain, this task lands second.
- Design Auditor gate — banner must match [design_guidelines.json](../../design_guidelines.json).

## Acceptance criteria

1. Fresh browser session on the site shows the banner within 500 ms.
2. Rejecting all cookies (except necessary) results in **no** `_ga` or `_ph` cookies being set (verify in DevTools → Application → Cookies).
3. Accepting analytics cookies fires `gtag('consent', 'update', {analytics_storage: 'granted'})` — verify in DevTools → Network → GA4 collect endpoint.
4. Google Tag Assistant → Consent Mode → shows `analytics_storage` correctly toggled based on user choice.
5. PostHog does not fire before consent.
6. Cookie preference link in Footer reopens the preference centre.
7. Cookie preferences persist across sessions (via first-party cookie).
8. [.github/GOTCHAS.md](../../.github/GOTCHAS.md) 2026-07-21 GA4 entry updated with the ship date.
9. Playwright: `consent-mode.spec.js` covers reject-all + accept-all + granular selection paths.

## User input needed

- Legal review of banner copy — 2–3 sentences explaining what data is collected and why. Must align with the privacy policy.
- Confirmation that Vercel Analytics is running in privacy-preserving mode (default) and can be disclosed without consent gating.
- Decision on the default banner behaviour — recommended "deny-by-default, require explicit opt-in" (DPDP standard).

## Notes / references

- [.github/GOTCHAS.md](../../.github/GOTCHAS.md) 2026-07-21 GA4 entry — "GA4 must be gated on user consent (currently fires unconditionally — accepted trade-off pre-launch)". This task discharges that debt.
- Google Consent Mode v2 docs: https://developers.google.com/tag-platform/security/guides/consent
- DPDP Act 2023 text: https://www.meity.gov.in/data-protection-framework
- PostHog respects `posthog.opt_out_capturing()` — use that API when consent is denied.
- Consider a "consent-signature audit log" (client-side, timestamp + choice) that ships to PostHog *only after* consent is granted — useful evidence for regulatory queries.
