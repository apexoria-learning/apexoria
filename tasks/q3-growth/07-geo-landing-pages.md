# Geo landing pages (`/salesforce-training-<city>`)

**Quadrant:** Q3 (Tough & High Impact — CONDITIONAL)
**Priority within quadrant:** 7
**Status:** **Blocked — awaiting user confirmation on geo-marketing scope per [memory/PRD.md](../../memory/PRD.md)**
**Owner (proposed):** Frontend (once unblocked)
**Impact:** Medium–High (if in scope)
**Effort:** Medium
**Source audit item(s):** R7

## Why

Queries like `"salesforce course in hyderabad"`, `"salesforce training bangalore"`, `"salesforce classes in pune"` have high commercial intent and lower competition than the pan-India variants. Even for a 100 %-online academy, geo-landing pages can capture these queries — Google understands that online courses serve specific geographies and ranks accordingly.

**Caveat:** This is only worth doing if geo-marketing is actually in scope. If Apexoria positions purely as "pan-India online only, no city focus", then geo pages fragment the brand and can look spammy. Confirm with user before starting.

## Scope

Six candidate cities based on Indian Salesforce hiring density (Naukri + LinkedIn data 2026):

- `/salesforce-training-hyderabad`
- `/salesforce-training-bangalore`
- `/salesforce-training-pune`
- `/salesforce-training-chennai`
- `/salesforce-training-mumbai`
- `/salesforce-training-delhi-ncr`

Each page:
- Unique `<title>`: "Salesforce Training in `<City>` — Live Online Classes with Placement | Apexoria"
- Unique meta description referencing the city
- H1 that includes the city name
- Body copy (~800–1200 words) covering:
  - Salesforce hiring landscape in that city (real companies hiring — verifiable data)
  - Local batch timings (align with [BATCHES](../../src/data.js))
  - Testimonials from learners *from that city* (if any exist — cross-link to [06](./06-success-stories-pages.md))
  - Course pricing (identical to pan-India — no price discrimination)
  - FAQ addressing city-specific concerns (commute? in-person option? local hiring partners?)
- JSON-LD: `EducationalOrganization` with `areaServed: "<City>, India"` OR `Course` with `courseInstance.location`
- Enroll CTA that pre-fills `preferred_batch` and tags the lead with the source city (analytics dimension via `trackEvent('lead_submit', { source_city: 'Hyderabad' })`).

## Out of scope

- **In-person / hybrid delivery** — not offered. Every page must be unambiguous that classes are online. Do not imply a physical location.
- More than 6 cities in Phase 1 — expand only after measuring which cities convert.
- International geo pages (US, UK, UAE) — completely different product-market fit, out of scope.

## Files likely touched

- [src/pages/geo/HyderabadTraining.jsx](../../src/pages/geo/HyderabadTraining.jsx) — new
- [src/pages/geo/BangaloreTraining.jsx](../../src/pages/geo/BangaloreTraining.jsx) — new
- [src/pages/geo/PuneTraining.jsx](../../src/pages/geo/PuneTraining.jsx) — new
- [src/pages/geo/ChennaiTraining.jsx](../../src/pages/geo/ChennaiTraining.jsx) — new
- [src/pages/geo/MumbaiTraining.jsx](../../src/pages/geo/MumbaiTraining.jsx) — new
- [src/pages/geo/DelhiNCRTraining.jsx](../../src/pages/geo/DelhiNCRTraining.jsx) — new
- OR: a single `<GeoTemplate city={...}>` component driven by a `GEO_CITIES` array in [src/data.js](../../src/data.js) — dramatically less duplication
- [public/sitemap.xml](../../public/sitemap.xml) — add all 6 URLs
- [src/lib/analytics.js](../../src/lib/analytics.js) — extend `trackEvent` with `source_city` dimension
- [src/App.js](../../src/App.js) — new routes (once React Router is in place from [04](./04-per-course-landing-pages.md))

## Dependencies

- **BLOCKER 1:** User confirms geo-marketing is in scope per [memory/PRD.md](../../memory/PRD.md). If not, close this task as `Won't do` (don't delete the file — supersede per [tasks/README.md](../README.md) convention).
- **BLOCKER 2:** [04-per-course-landing-pages.md](./04-per-course-landing-pages.md) done — needs the React Router + Layout scaffolding.
- **Recommended:** [06-success-stories-pages.md](./06-success-stories-pages.md) partially done — cross-linking city-specific learners is a big content boost.

## Acceptance criteria

1. All 6 city pages return 200 with unique titles, meta descriptions, H1s containing the city name.
2. No page falsely implies in-person / hybrid delivery — Design Auditor gate on wording.
3. Body content is ≥800 words per page, not templated boilerplate with city name swapped (Google's helpful content system flags doorway-page patterns).
4. Sitemap contains all 6 URLs.
5. Rich Results Test — no schema errors on any page.
6. GSC → each URL indexed within 30 days of publish; monitor query performance per city over 90 days before deciding to expand or contract.
7. Playwright: one shared spec `geo-pages.spec.js` iterates over the 6 URLs and asserts title + H1 + no console errors.

## User input needed

- **Go / no-go decision** on geo-marketing (blocker 1 above).
- Which 6 cities (the proposed list is a recommendation, not a mandate).
- Confirmed local hiring partners per city, if any (adds credibility if listable).
- Local testimonials — coordinate with [06](./06-success-stories-pages.md).

## Notes / references

- **Doorway page risk.** Google explicitly discourages pages that exist purely to funnel users from geographic searches to a single generic destination. This task avoids that risk *only if* each page has substantive, unique, verifiable content about that specific city. Copy-pasted templates get de-indexed.
- Consider a subtler alternative: leave the site as-is and target city keywords via blog posts from [05-blog-launch.md](./05-blog-launch.md) (e.g. "Best Salesforce Training in Hyderabad — 2026 Guide"). Blog posts can rank for geo queries without the doorway-page risk.
- Reference: https://developers.google.com/search/docs/appearance/site-names#country-region
