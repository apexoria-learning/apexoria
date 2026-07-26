# Deferred JSON-LD schemas (LocalBusiness, VideoObject)

**Quadrant:** Q4 (Tough & Low Impact)
**Priority within quadrant:** 1
**Status:** Deferred — waiting on product triggers, not on effort
**Owner (proposed):** Frontend
**Impact:** Low (in current state)
**Effort:** Small (per schema)
**Source audit item(s):** P13, P14

## Why

Two schema types were called out in the audit but explicitly deferred because their trigger conditions aren't met today:

- **`LocalBusiness`** (P13) — helps Google Maps / Local Pack rankings. Only useful if there's a physical office to list. Apexoria is 100 % online today.
- **`VideoObject`** (P14) — powers Google's video rich results. Only useful once demo / founder / testimonial videos are published and hosted somewhere indexable.

Not shipping these now avoids "empty schema" — Google penalises schema that describes claims not backed by visible content on the page.

## Scope

Move to `Status: Not started` and start work **only** when one of these triggers fires:

### Trigger 1 — physical office opens (unlocks LocalBusiness)

If Apexoria opens a physical training space or office in India:

- Add a `LocalBusiness` (or more specific `EducationalOrganization` + `LocalBusiness` intersection) JSON-LD block in [public/index.html](../../public/index.html):
  ```json
  {
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "address": { "@type": "PostalAddress", "streetAddress": "...", "addressLocality": "...", "addressRegion": "...", "postalCode": "...", "addressCountry": "IN" },
    "geo": { "@type": "GeoCoordinates", "latitude": "...", "longitude": "..." },
    "openingHoursSpecification": [ ... ],
    "telephone": "+91...",
    "priceRange": "₹1,999 - ₹21,999"
  }
  ```
- Update the existing `EducationalOrganization` block (added in Sprint 1) so both aren't duplicated — merge instead.
- Verify a Google Business Profile exists for the office and matches the schema.

### Trigger 2 — videos published (unlocks VideoObject)

If founder intro / testimonial / demo videos ship (self-hosted on Vercel, YouTube-embedded, or on Vimeo):

- For each video, add a `VideoObject` JSON-LD block:
  ```json
  {
    "@type": "VideoObject",
    "name": "How Rajesh went from Manual QA to Salesforce Developer in 4 months",
    "description": "...",
    "thumbnailUrl": "https://www.apexorialearning.in/images/videos/rajesh-thumb.jpg",
    "uploadDate": "2026-XX-XX",
    "duration": "PT4M32S",
    "contentUrl": "https://www.apexorialearning.in/videos/rajesh-story.mp4",
    "embedUrl": "https://www.youtube.com/embed/..."
  }
  ```
- Wire this per-page — a testimonial video on [06-success-stories-pages.md](../q3-growth/06-success-stories-pages.md) belongs on that specific story page, not the homepage.

## Out of scope

- Video production itself — content project, not code.
- Google Business Profile setup — user action, not code.

## Files likely touched

- [public/index.html](../../public/index.html) — LocalBusiness (if trigger 1)
- Per-page JSON-LD blocks — VideoObject (if trigger 2)
- [src/components/seo/Head.jsx](../../src/components/seo/Head.jsx) (if it exists from [04-per-course-landing-pages.md](../q3-growth/04-per-course-landing-pages.md)) — extend to accept `videoObject` prop

## Dependencies

- Waiting on product triggers (see `Why`).

## Acceptance criteria

**When triggered:**

1. `LocalBusiness` schema validates in Rich Results Test and matches published Google Business Profile.
2. `VideoObject` schema validates and points to a real hosted video URL that returns 200.
3. Google Search Console → Video results / Local Pack presence checked 30 days post-deploy.

## User input needed

- Trigger 1: full postal address + geo coordinates + hours + Google Business Profile URL.
- Trigger 2: video assets (or hosting URLs), transcripts (for accessibility + SEO), thumbnails.

## Notes / references

- Do NOT ship placeholder LocalBusiness schema with fake addresses "to look established". Google penalises structured-data spam and it damages the entire domain's trust score.
- If a physical office is announced, coordinate with [q3-growth/07-geo-landing-pages.md](../q3-growth/07-geo-landing-pages.md) — the city where the office opens is the natural first geo landing page.
