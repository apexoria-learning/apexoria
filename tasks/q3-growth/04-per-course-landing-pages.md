# Per-course landing pages (introduce React Router)

**Quadrant:** Q3 (Tough & High Impact)
**Priority within quadrant:** 4
**Status:** Not started
**Owner (proposed):** Frontend
**Impact:** High
**Effort:** Large
**Source audit item(s):** R1

## Why

**The single biggest structural SEO lever available to this site.**

Today's marketing site is one URL competing for many keyword clusters simultaneously: *"Salesforce Crash Course"*, *"Salesforce Complete Course"*, *"Salesforce QA training"*, *"Salesforce Automation QA"*, *"Salesforce training India"*, etc. Google ranking algorithms reward pages that focus on a single intent per URL. Splitting into per-course landing pages lets each page dominate its own long-tail cluster instead of the homepage fighting for all of them.

Also unlocks:
- `Course` schema per page (already emitted in Sprint 1 P9, but per-route rendering via `react-helmet-async` is cleaner than one giant JSON-LD blob on `/`).
- Cleaner conversion funnel — direct landing on `/salesforce-crash-course` sees the crash-course pricing, brochure, and enrollment CTA without scrolling past unrelated sections.
- Prerequisite for [q3-growth/06-success-stories-pages.md](./06-success-stories-pages.md) and [q3-growth/07-geo-landing-pages.md](./07-geo-landing-pages.md).

## Scope

Four new routes, each with its own SEO surface:

| Route | Course | Primary keywords |
|-------|--------|------------------|
| `/salesforce-crash-course` | Crash Course | "Salesforce crash course", "1 month Salesforce training" |
| `/salesforce-complete-course` | Complete Course | "Salesforce full stack course", "Admin Dev LWC training" |
| `/salesforce-qa` | Salesforce QA | "Salesforce QA training", "Salesforce testing course" |
| `/salesforce-automation-qa` | Automation QA | "Salesforce automation testing", "Provar Playwright Salesforce" |

Each page:
- Unique `<title>`, `<meta name="description">`, canonical, `og:image` (potentially per-course)
- H1 that matches the query intent
- Rich body copy — 800–1500 words per page including curriculum, tools taught, prerequisites, career outcomes, FAQ, testimonials
- `Course` schema (JSON-LD) rendered per-route
- Enroll CTA that pre-fills the lead form with the course name (existing `handleEnroll(course)` pattern in [src/App.js](../../src/App.js#L44-L54) — reuse it)
- Breadcrumb (visible + `BreadcrumbList` JSON-LD): Home > Courses > `<course name>`

Route infrastructure:
- Introduce `react-router-dom` v6.
- Wrap [src/App.js](../../src/App.js) in `<BrowserRouter>`.
- Keep the existing homepage on `/` — no regression.
- Introduce `react-helmet-async` for per-route `<head>` management.
- Extract shared page shell (Navbar + Footer + WhatsAppWidget + Lenis wrapper) into a `<Layout>` component; each page renders inside it.
- Update [public/sitemap.xml](../../public/sitemap.xml) with the 4 new URLs.
- Update Vercel rewrite rule in `vercel.json` (see [q3-growth/02-custom-404-page.md](./02-custom-404-page.md)) — must allow the new client-side routes.

## Out of scope

- Blog routing — see [05-blog-launch.md](./05-blog-launch.md).
- Success stories personalisation — see [06-success-stories-pages.md](./06-success-stories-pages.md).
- Geo landing pages — see [07-geo-landing-pages.md](./07-geo-landing-pages.md).
- Server-side rendering / static generation — CRA stays as-is; per-route JSON-LD is emitted client-side via helmet + hydrated pre-crawl by Google (verify in GSC's URL Inspection tool).

## Files likely touched

- [package.json](../../package.json) — add `react-router-dom`, `react-helmet-async`
- [src/App.js](../../src/App.js) — wrap in `BrowserRouter`, define routes
- [src/pages/HomePage.jsx](../../src/pages/HomePage.jsx) — new (extracted from current App.js body)
- [src/pages/course/CrashCourse.jsx](../../src/pages/course/CrashCourse.jsx) — new
- [src/pages/course/CompleteCourse.jsx](../../src/pages/course/CompleteCourse.jsx) — new
- [src/pages/course/SalesforceQA.jsx](../../src/pages/course/SalesforceQA.jsx) — new
- [src/pages/course/AutomationQA.jsx](../../src/pages/course/AutomationQA.jsx) — new
- [src/components/site/Layout.jsx](../../src/components/site/Layout.jsx) — new shared shell
- [src/components/seo/Head.jsx](../../src/components/seo/Head.jsx) — new — wraps `react-helmet-async` with typed props (title, description, canonical, og, jsonLd)
- [public/sitemap.xml](../../public/sitemap.xml) — 4 new URLs
- [vercel.json](../../vercel.json) — coordinate with [02-custom-404-page.md](./02-custom-404-page.md)
- [e2e/tests/](../../e2e/tests/) — new specs `per-course-crash.spec.js`, `per-course-complete.spec.js`, `per-course-qa.spec.js`, `per-course-automation-qa.spec.js`

## Dependencies

- Sprint 1 (Q1) merged first — the Course JSON-LD schema shape defined in Sprint 1 gets reused here.
- Coordinate with [q3-growth/02-custom-404-page.md](./02-custom-404-page.md) — both introduce `vercel.json`; do them in the same PR or in strict sequence.
- Blocker: Design Auditor + Frontend jointly design one course-page layout template before content writing begins.

## Acceptance criteria

1. All four routes return 200 and render unique `<title>` + `<meta description>` + H1 + body content.
2. `curl -s https://www.apexorialearning.in/salesforce-crash-course | grep -o '<title>.*</title>'` shows a course-specific title (not the homepage title).
3. Rich Results Test on each URL — `Course`, `BreadcrumbList`, `EducationalOrganization` all validate.
4. `sitemap.xml` contains all four URLs with today's `lastmod`.
5. Navigating from `/` → `/salesforce-crash-course` via the Pricing card CTA works (SPA transition, no full reload).
6. Direct-load (opening `/salesforce-crash-course` fresh from Google) works — Vercel rewrite serves `index.html`, React Router renders the course page.
7. Enroll button on each course page opens the lead form with `course_interest` pre-selected to the correct value.
8. All new interactive elements have `data-testid` per [AGENTS.md](../../.github/AGENTS.md) §1.
9. Google Search Console URL Inspection → each page's rendered HTML contains the JSON-LD (proves client-side helmet is picked up).
10. Lighthouse Performance ≥ 90 mobile on each course page (assumes [01-perf-lcp-and-images.md](./01-perf-lcp-and-images.md) is already done — otherwise carry perf work into this task).
11. Playwright: all four new specs pass; existing homepage specs still pass.

## User input needed

- Course-specific body copy (800–1500 words per page) — the Orchestrator can draft, but user must approve before publishing. Copy touches curriculum details that must match reality.
- Optional: distinct 1200×630 OG images per course (fallback: reuse the site-wide OG cover from Sprint 1).
- Confirm the 4 URLs above are the right slugs. Alternate proposals: `/courses/salesforce-crash-course` (nested under `/courses`) — decide once, hard to change later.

## Notes / references

- CRA + React Router + Vercel rewrite is a known-working combination — no build gymnastics needed.
- `react-helmet-async` is preferred over legacy `react-helmet` (SSR-safe, correct hydration).
- The current App.js single-page composition (`Hero → Marquee → WhyApexoria → Founder → …`) becomes `HomePage.jsx` verbatim.
- Consider extracting a shared `<CourseTemplate>` component that takes course props from [src/data.js](../../src/data.js) — reduces duplication across the 4 pages and makes future course additions cheap.
