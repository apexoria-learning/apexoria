# Individual success stories pages

**Quadrant:** Q3 (Tough & High Impact)
**Priority within quadrant:** 6
**Status:** Not started (blocked by per-learner consent)
**Owner (proposed):** Orchestrator (drafting) + Frontend (routes) + user (consent collection)
**Impact:** Medium–High
**Effort:** Medium
**Source audit item(s):** R6

## Why

Two SEO wins:

1. **E-E-A-T signal** — Google's Search Quality guidelines weight Experience (first-hand accounts) and Trustworthiness heavily. Detailed, named, dated case studies with real photos and metrics are among the strongest E-E-A-T signals available to a training brand.
2. **Long-tail queries** — each case study page can rank for `"<student name> Salesforce placement"`, `"Salesforce QA course review India"`, `"Apexoria review"`, etc. Every named-student page is a mini branded-search win.

Currently [SuccessStories.jsx](../../src/components/site/SuccessStories.jsx) shows testimonials as inline cards on the homepage — no individual URLs, no indexable per-story pages.

## Scope

- Route: `/success-stories` (index) + `/success-stories/:slug` (per-student).
- Index page:
  - Filter chips (all / Development / QA / Career-switch / Fresher)
  - Card grid: photo, name, role landed, previous background, before/after salary bracket (optional — consent-gated)
- Per-student page:
  - Hero: photo, name, "From `<previous role>` to `<Salesforce role>` in `<N>` months"
  - Body: their story in first-person (~800 words), how they discovered Apexoria, what course they took, projects they built, interview experience, current role
  - Callout: which Apexoria course they took (link to per-course landing page from [04](./04-per-course-landing-pages.md))
  - JSON-LD: `Review` schema tied to `EducationalOrganization` + `Person` schema for the student + optional `AggregateRating` on the org (already added in Sprint 1 P12; per-story reviews flow into it)
- Data source: expand [src/data.js](../../src/data.js) `TESTIMONIALS` array to include long-form story fields, or move to `content/success-stories/*.mdx` if using the MDX pipeline from [05-blog-launch.md](./05-blog-launch.md).
- Cross-link from homepage [SuccessStories.jsx](../../src/components/site/SuccessStories.jsx) — each existing card gets a "Read full story →" link.
- Add all story URLs to `sitemap.xml`.

## Out of scope

- Video testimonials — separate future task (would need `VideoObject` schema + hosted video). Text case studies first.
- Anonymous case studies (e.g. "Rajesh, Manual QA → Salesforce Admin") — no SEO value without a name; skip.

## Files likely touched

- [src/pages/success-stories/Index.jsx](../../src/pages/success-stories/Index.jsx) — new
- [src/pages/success-stories/Story.jsx](../../src/pages/success-stories/Story.jsx) — new
- [content/success-stories/*.mdx](../../content/success-stories/) — new (if MDX pipeline exists)
- [src/data.js](../../src/data.js) — extend `TESTIMONIALS` with slug + long-form fields (if not MDX)
- [src/components/site/SuccessStories.jsx](../../src/components/site/SuccessStories.jsx) — "Read full story" links
- [public/images/success-stories/](../../public/images/success-stories/) — new directory with student photos (self-hosted per [01](./01-perf-lcp-and-images.md))
- [public/sitemap.xml](../../public/sitemap.xml) — new URLs
- [e2e/tests/success-stories.spec.js](../../e2e/tests/success-stories.spec.js) — new spec

## Dependencies

- **Blocker: per-learner written consent.** Named, dated, with photo permission and salary-mention permission. Store consent records outside the repo (see `User input needed`). Do not publish any story without explicit consent — legal + ethical.
- Requires React Router from [04-per-course-landing-pages.md](./04-per-course-landing-pages.md).
- Ideally coordinated with [01-perf-lcp-and-images.md](./01-perf-lcp-and-images.md) so student photos ship as self-hosted WebP.

## Acceptance criteria

1. `/success-stories` returns 200, lists all case studies with photo + name + role transition summary.
2. `/success-stories/<slug>` returns 200 per student with unique title/meta/H1 + full story body.
3. Each per-student page renders `Review` + `Person` JSON-LD; validates in Rich Results Test.
4. Every published story has written consent recorded (proof stored in a private location — user confirms in PR review).
5. Homepage `SuccessStories.jsx` cards each link to their full-story page.
6. Sitemap contains all story URLs.
7. Playwright: `success-stories.spec.js` covers index → detail navigation.

## User input needed

- **Written consent from each named learner.** Use a simple consent form (name, photo, story details, permitted use, revocation clause). Keep signed copies outside the repo (Google Drive folder or similar).
- Long-form story drafts — user or the Orchestrator interviews each learner (30 min call → transcript → edited story).
- Photos — high-res headshots per learner.
- Salary numbers — optional per learner; some may not consent to publish specific figures.

## Notes / references

- Read the *current* [SuccessStories.jsx](../../src/components/site/SuccessStories.jsx) + [TESTIMONIALS in data.js](../../src/data.js) to understand which learners are already surfaced and can be candidates.
- Do NOT fabricate details. If a learner declines the interview, drop the story — don't publish generic placeholders.
- Consider a rolling "success story of the month" cadence to keep the content stream fresh.
- E-E-A-T guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
