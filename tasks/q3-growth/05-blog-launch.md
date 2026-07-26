# Blog launch (/blog + evergreen posts)

**Quadrant:** Q3 (Tough & High Impact)
**Priority within quadrant:** 5
**Status:** Not started
**Owner (proposed):** Orchestrator (content strategy) + Frontend (routing/rendering) + user (subject matter approval)
**Impact:** High
**Effort:** Large (ongoing)
**Source audit item(s):** R2

## Why

The **#1 sustained organic growth channel** for a training brand. Every landing page (per-course pages from [04](./04-per-course-landing-pages.md)) targets high-commercial-intent transactional queries. A blog targets high-volume informational queries where users are researching, comparing, or learning — the top of the funnel that later converts to enrollments.

Concrete example: "how to prepare for PD1 in 30 days" gets thousands of monthly searches in India. If Apexoria owns the top answer, that's a stream of Salesforce learners landing on the site every day, seeing the crash course CTA in the article, and converting.

Content compounds — the blog only becomes valuable after 6–12 months of consistent publishing. Start now.

## Scope

**Phase 1 — infrastructure (single PR):**

- Introduce a blog rendering pipeline. Recommended stack:
  - MDX via `@mdx-js/react` + a Vite/webpack loader (or plain markdown via `react-markdown` if MDX is overkill).
  - Posts stored as `content/blog/*.mdx` at repo root.
  - Build-time route generation: a small script reads `content/blog/`, produces `src/generated/blogRoutes.js`.
- Routes:
  - `/blog` — index page with post cards (title, excerpt, hero image, date, category, reading time)
  - `/blog/:slug` — individual post page
- Per-post frontmatter schema (YAML):
  ```yaml
  ---
  title: "How to prepare for Salesforce PD1 in 30 days"
  slug: "salesforce-pd1-prep-30-days"
  description: "A day-by-day study plan for the Platform Developer I exam."
  publishedAt: "2026-08-XX"
  updatedAt: "2026-08-XX"
  author: "Apexoria Team"
  category: "Certification"
  tags: ["PD1", "certification", "study-plan"]
  heroImage: "/images/blog/pd1-prep.webp"
  ogImage: "/images/blog/pd1-prep-og.jpg"
  readingMinutes: 8
  ---
  ```
- SEO per post: unique `<title>`, meta description, `Article` JSON-LD (`@type: BlogPosting`), Open Graph, Twitter Card, canonical.
- RSS feed at `/blog/rss.xml` — build-time generated.
- Sitemap subfeed `/sitemap-blog.xml` referenced from the main `sitemap.xml`.
- Blog card typography + spacing per [design_guidelines.json](../../design_guidelines.json) — Outfit for post titles, Plus Jakarta Sans for body prose. `prose` Tailwind plugin for readable long-form text.

**Phase 2 — initial content batch (post-infrastructure PR, ongoing):**

Publish 8 evergreen seed posts. Recommended outlines (each 1200–2500 words):

1. **"Salesforce PD1 Certification: 30-Day Prep Plan (2026)"** — day-by-day schedule, resource list, practice tests. Targets: `salesforce pd1 preparation`, `pd1 study plan india`.
2. **"Apex Trigger Best Practices — the Patterns Real Salesforce Teams Use"** — bulkification, handler pattern, recursion guards. Targets: `apex trigger best practices`, `apex trigger design pattern`.
3. **"Salesforce Developer Salary in India 2026 — Real Numbers"** — Naukri/Glassdoor data by experience + city. Targets: `salesforce developer salary india`, high-intent commercial.
4. **"Salesforce QA vs Manual QA: Which Career Pays More in 2026?"** — comparison table, market demand, transition path. Targets: `salesforce qa career`, `salesforce testing career`.
5. **"Lightning Web Components vs Aura — Which Should You Learn First?"** — decision guide for newcomers. Targets: `lwc vs aura`, `lwc for beginners`.
6. **"Salesforce Admin Certification Path: Complete Roadmap 2026"** — Admin → Advanced Admin → Platform App Builder → PD1. Targets: `salesforce admin certification`, `salesforce admin roadmap`.
7. **"REST vs SOAP Integrations in Salesforce — When to Use Which"** — practical patterns with examples. Targets: `salesforce rest api tutorial`, `salesforce integration patterns`.
8. **"Salesforce Certifications Ranked by Job Market Demand (India)"** — data-driven ranking from LinkedIn/Naukri postings. Targets: `salesforce certification worth it india`, high-intent.

Each post ends with a soft CTA linking to the relevant per-course landing page from [04](./04-per-course-landing-pages.md).

## Out of scope

- Author pages / multi-author support — single "Apexoria Team" byline for now.
- Comments / newsletter signup on posts — Phase 3+ (later task, not scheduled).
- AMP versions — deprecated by Google, skip.
- Post monetisation / paid content — out of scope; blog is top-of-funnel only.

## Files likely touched

- [package.json](../../package.json) — add MDX/markdown loader + `gray-matter` for frontmatter + `reading-time`
- [craco.config.js](../../craco.config.js) — MDX webpack loader if MDX is chosen
- [content/blog/*.mdx](../../content/blog/) — new directory with 8 seed posts
- [public/images/blog/](../../public/images/blog/) — new directory with post hero images (self-hosted per [01-perf-lcp-and-images.md](./01-perf-lcp-and-images.md) principles)
- [src/pages/blog/BlogIndex.jsx](../../src/pages/blog/BlogIndex.jsx) — new
- [src/pages/blog/BlogPost.jsx](../../src/pages/blog/BlogPost.jsx) — new
- [src/generated/blogRoutes.js](../../src/generated/blogRoutes.js) — build-generated (add to `.gitignore` or commit — team decision)
- [scripts/build-blog-index.js](../../scripts/build-blog-index.js) — new
- [scripts/generate-rss.js](../../scripts/generate-rss.js) — new
- [public/sitemap.xml](../../public/sitemap.xml) — reference `sitemap-blog.xml`
- [public/sitemap-blog.xml](../../public/sitemap-blog.xml) — build-generated

## Dependencies

- **Requires React Router from [04-per-course-landing-pages.md](./04-per-course-landing-pages.md).** Do 04 first.
- Requires perf baseline from [01-perf-lcp-and-images.md](./01-perf-lcp-and-images.md) — blog posts add many new pages, LCP/CLS discipline must be in place.
- User must approve tone/voice + factual accuracy of every post before publish.

## Acceptance criteria

**Phase 1 (infrastructure):**

1. `https://www.apexorialearning.in/blog` returns 200, lists posts sorted newest first.
2. `https://www.apexorialearning.in/blog/<slug>` returns 200 for every seed post with unique title/meta/H1.
3. Rich Results Test → each post validates `BlogPosting` schema.
4. `https://www.apexorialearning.in/blog/rss.xml` returns valid RSS 2.0.
5. `https://www.apexorialearning.in/sitemap-blog.xml` returns valid sitemap with all post URLs.
6. Main `sitemap.xml` references the blog subfeed via `<sitemapindex>`.
7. Reading time + published date shown correctly per post.
8. Playwright: `blog.spec.js` covers index render + navigate to post.

**Phase 2 (content):**

9. Eight seed posts published, each with:
   - ≥1200 words of substantive content (Google penalises thin content)
   - ≥1 hero image (self-hosted WebP per [01](./01-perf-lcp-and-images.md))
   - ≥3 internal links (to per-course pages + other posts)
   - Soft CTA in the last section linking to a course
10. GSC indexes all 8 posts within 30 days of publish.

## User input needed

- Approve blog tone/voice guide (Orchestrator can draft — recommend "confident, plainspoken, no jargon-hiding, examples over abstractions").
- Confirm publishing cadence post-launch (weekly? bi-weekly?) — determines editorial commitment.
- Fact-check each seed post — salary numbers, cert exam details must be current.
- Optional: user-supplied author bio if a specific person will own the content.

## Notes / references

- **Do not use AI-generated content as-is.** Google's helpful content system aggressively demotes it. AI can draft, but the user (or a hired writer) must materially edit each post.
- Publishing rhythm matters more than post count. Two thoughtful posts per month beats eight low-quality posts.
- Cross-link liberally between posts and to the per-course pages — internal link equity flows both ways.
- Blog is a compounding asset; expect little SERP movement for the first 3–4 months, then acceleration.
