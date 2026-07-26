# Perf: LCP fix + image self-hosting

**Quadrant:** Q3 (Tough & High Impact)
**Priority within quadrant:** 1
**Status:** Not started
**Owner (proposed):** Frontend (+ Design Auditor gate on visual output)
**Impact:** High
**Effort:** Medium–Large
**Source audit item(s):** P24, P26, R14

## Why

Core Web Vitals is a direct Google ranking factor. The current site has three problems that hurt LCP and CLS together:

1. Hero background image is a `pexels.com` remote URL loaded via CSS `background-image` in [Hero.jsx](../../src/components/site/Hero.jsx#L41). The browser's preload scanner cannot discover CSS-referenced images, so the LCP asset is fetched late.
2. All 5 images (`heroAbstract`, `student1`, `student2`, `team`, plus the Salesforce logo and Apexoria logo) load from external CDNs (`pexels.com`, `unsplash.com`, `customer-assets-39nsmqrw.emergentagent.net`, `upload.wikimedia.org`). No cache control, no WebP/AVIF, no responsive `srcset`.
3. No `<img>` has explicit `width`/`height` → CLS spikes on every image load.

Fixing this is the single biggest CWV improvement available and should measurably move Google PageSpeed Insights scores.

## Scope

- **Self-host all images** under `public/images/` at repo root:
  - `hero-abstract.webp` + `.jpg` fallback (currently pexels 940×650)
  - `student-1.webp` + `.jpg` (currently unsplash)
  - `student-2.webp` + `.jpg` (currently pexels)
  - `team.webp` + `.jpg` (currently unsplash)
  - `apexoria-logo.webp` + `.jpg` (currently emergentagent CDN — see [.github/GOTCHAS.md](../../.github/GOTCHAS.md) for context on that host)
  - `salesforce-cloud.svg` (from Wikimedia — safe to self-host as SVG; keep license notice)
- **Update [src/data.js](../../src/data.js)** to point `IMAGES.*` and `LOGO_URL` and `SALESFORCE_LOGO` to the new local paths.
- **Replace hero CSS background** in [Hero.jsx](../../src/components/site/Hero.jsx#L41) with a real `<img fetchpriority="high" loading="eager" decoding="async" width="940" height="650" alt="">` (empty alt — decorative) OR a `<picture>` element. Removes the CSS-background LCP scanner blindspot.
- **Add `<link rel="preload" as="image" href="/images/hero-abstract.webp" fetchpriority="high" imagesrcset="..." imagesizes="...">`** in [public/index.html](../../public/index.html) `<head>` above the font preconnect.
- **Add explicit `width`/`height`** to every `<img>` in [src/components/site/](../../src/components/site/) — kills CLS.
- **Add `srcset` + `sizes`** for responsive delivery on the two hero-adjacent images (`heroAbstract`, `student2` used in LeadForm) — 640w / 940w / 1280w.
- **Use `<picture>`** with WebP `<source>` + JPEG fallback where WebP fails.
- **Wire up per-image `loading` policy**: `eager` + `fetchpriority="high"` on hero only, `lazy` on everything else (some already have this — verify).

## Out of scope

- CDN configuration (Vercel already serves static assets from its edge — no separate CDN needed).
- Image compression pipeline automation (sharp / squoosh CLI) — do a one-time manual pass first; automate only if the asset set grows.
- Blog / per-course landing images — those come with `q3-growth/04-per-course-landing-pages.md` and `q3-growth/05-blog-launch.md`.

## Files likely touched

- [public/index.html](../../public/index.html) — preload hero image
- [public/images/](../../public/images/) — new directory with 5+ image pairs
- [src/data.js](../../src/data.js) — swap all external image URLs to `/images/*`
- [src/components/site/Hero.jsx](../../src/components/site/Hero.jsx) — CSS bg → real `<img>` / `<picture>`
- [src/components/site/Founder.jsx](../../src/components/site/Founder.jsx) — width/height + srcset
- [src/components/site/LeadForm.jsx](../../src/components/site/LeadForm.jsx#L151) — width/height + srcset
- [src/components/site/FeaturedCourse.jsx](../../src/components/site/FeaturedCourse.jsx#L42) — width/height on Salesforce logo
- [src/components/site/Footer.jsx](../../src/components/site/Footer.jsx#L43) — width/height on Apexoria logo
- [src/components/site/Navbar.jsx](../../src/components/site/Navbar.jsx#L81) — width/height on Apexoria logo

## Dependencies

- None. Can start as soon as Sprint 1 (Q1) is merged.
- Design Auditor gate mandatory before merge — hero visual layout must remain identical per [design_guidelines.json](../../design_guidelines.json).

## Acceptance criteria

1. **Baseline capture** before starting: Lighthouse mobile Performance score + LCP time + CLS score against the deployed production URL. Record in PR description.
2. **Goal** post-merge: LCP ≤ 2.5 s on mobile (currently likely > 4 s from external CDN); CLS ≤ 0.05 (currently unbounded from image loads without dimensions).
3. Every `<img>` in the codebase has explicit `width` + `height` attributes.
4. `grep -rE "(pexels|unsplash|emergentagent|wikimedia)" src/ public/index.html` returns zero matches (all images self-hosted).
5. Chrome DevTools → Network → filter Images → all image requests are same-origin (or `assets.vercel.app` edge cache).
6. Rich Results Test + Facebook Sharing Debugger still pass (OG image swap should have been done in Sprint 1 P2 — this task doesn't re-touch OG).
7. Playwright: `hero.spec.js` still passes; add a spec that asserts `<img>` in Hero renders with `fetchpriority="high"`.
8. Design Auditor sign-off — visual regression against pre-merge screenshots.

## User input needed

- Confirm the source Pexels/Unsplash images are OK to redistribute (licence check — Pexels license allows self-hosting for commercial use; Unsplash allows the same; verify each).
- If replacing any image with a custom brand asset, provide the new source file.

## Notes / references

- Currently `loading="lazy"` is set on student2 in [LeadForm.jsx](../../src/components/site/LeadForm.jsx#L151), founder photo in [Founder.jsx](../../src/components/site/Founder.jsx#L24), and Salesforce logo in [FeaturedCourse.jsx](../../src/components/site/FeaturedCourse.jsx#L42) — those stay lazy. Hero flips to `eager` + `fetchpriority="high"`.
- The Emergent host serving the logo (`customer-assets-39nsmqrw.emergentagent.net`) is a source-template artifact — replacing it removes another third-party origin (see [.github/GOTCHAS.md](../../.github/GOTCHAS.md) 2026-07-21 GA4 entry for context on the analytics-stack surface).
- Vercel automatically serves static assets from its edge CDN with long cache headers — no additional config needed.
