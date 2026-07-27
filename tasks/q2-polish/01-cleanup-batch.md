# Q2 Cleanup — polish batch

**Quadrant:** Q2 (Easy & Low Impact)
**Priority within quadrant:** 1
**Status:** Done (shipped 2026-07-27, direct to `main`)
**Owner (proposed):** Frontend
**Impact:** Low
**Effort:** Small
**Source audit item(s):** P7, P8, P10, P19, P20, P23, R10, R11, R15 + sitemap `lastmod` automation deferred from Sprint 1

## Why

Nine small polish items batched into one PR. None move ranking materially, but together they clean up outline hierarchy, crawlability semantics, and browser polish surface. Cheap to ship — worth doing once Sprint 1 (Q1) is deployed.

## Scope

- **P7** Proper favicon set: replace `.jpeg` favicon with `favicon.ico` + 32×32, 192×192, 512×512 PNGs + `manifest.json` for PWA install prompt.
- **P8** Remove or trim `<meta name="keywords">` — Google ignores it, Bing near-zero weight. Recommendation: remove entirely.
- **P10** Extend `Organization.sameAs` in JSON-LD to include YouTube channel URL (once channel exists — see `User input needed`).
- **P19** Convert Navbar internal links from `<button onClick>` to `<a href="#anchor">` with `preventDefault` + Lenis scroll in the handler. Best of both worlds — crawlers see anchors, UX keeps smooth scroll.
- **P20** Same conversion in Footer Quick Links.
- **P23** Add `id="get-started"` to the `<section>` wrapper in [FinalCTA.jsx](../../src/components/site/FinalCTA.jsx) so the nav can scroll to it (currently unlinked).
- **R10** Add `hreflang="en-IN"` on `<html>` element in [public/index.html](../../public/index.html) and add an `<xhtml:link rel="alternate" hreflang="en-IN">` entry in `sitemap.xml`.
- **R11** Add per-scheme `theme-color` for `prefers-color-scheme: dark` and `light`.
- **R15** Verify every element added in Sprint 1 has a `data-testid` per [AGENTS.md](../../.github/AGENTS.md) §1; add missing ones to [src/constants/testIds/](../../src/constants/testIds/).
- **Deferred from Sprint 1**: automate sitemap `<lastmod>` via a `postbuild` script in [package.json](../../package.json) so every `npm run build` stamps today's date automatically — otherwise the P15 fix will decay.

## Out of scope

- OG image regeneration — done in Sprint 1 (P2)
- JSON-LD `Course` schema — done in Sprint 1 (P9)
- Any perf/LCP work — see `q3-growth/01-perf-lcp-and-images.md`
- Custom 404 page — see `q3-growth/02-custom-404-page.md`

## Files likely touched

- [public/index.html](../../public/index.html) — favicon links, keywords removal, theme-color per-scheme, hreflang on `<html>`, sameAs YouTube
- [public/manifest.json](../../public/manifest.json) — new file (PWA basics)
- [public/favicon.ico](../../public/favicon.ico) + `favicon-32.png` + `favicon-192.png` + `favicon-512.png` — new assets
- [public/sitemap.xml](../../public/sitemap.xml) — `xhtml:link` alternate
- [src/components/site/Navbar.jsx](../../src/components/site/Navbar.jsx) — `<button>` → `<a>` semantic swap
- [src/components/site/Footer.jsx](../../src/components/site/Footer.jsx) — Quick Links `<button>` → `<a>` swap
- [src/components/site/FinalCTA.jsx](../../src/components/site/FinalCTA.jsx) — add `id="get-started"` on section
- [src/data.js](../../src/data.js) — YouTube URL in CONTACT (if adopted)
- [src/constants/testIds/](../../src/constants/testIds/) — any missed ids from Sprint 1
- [package.json](../../package.json) — `postbuild` script for sitemap lastmod automation
- Optional: a new `scripts/update-sitemap-lastmod.js` for the postbuild step

## Dependencies

- Sprint 1 (Q1) merged to `main` first — several items build on the OG image / JSON-LD groundwork.

## Acceptance criteria

1. Chrome DevTools → Application → Manifest shows a valid PWA manifest with name, icons, theme, background.
2. `curl -I https://www.apexorialearning.in/favicon.ico` returns 200 with `image/x-icon`.
3. View-source of the home page — no `<meta name="keywords">` tag present (or trimmed to ≤6 tokens if kept).
4. Navbar + Footer anchor clicks navigate correctly AND right-click "Open in new tab" opens `#anchor` (proves `<a href>` conversion).
5. `<section id="get-started">` present around FinalCTA in the built HTML.
6. `<html lang="en" hreflang="en-IN">` present; sitemap `<url>` contains matching `<xhtml:link rel="alternate">`.
7. Two `<meta name="theme-color">` tags with `media` attributes (light + dark).
8. Playwright: existing `navigation.spec.js` still passes without changes (or gets updated in-PR).
9. `npm run build` — the postbuild script stamps today's date into `build/sitemap.xml` automatically.

## User input needed

- Real YouTube channel URL — or confirm no channel exists yet (skip P10).
- Confirm favicon design source — do we want the current logo cropped to a square icon, or a distinct "A" glyph favicon?

## Notes / references

- Audit item codes come from the 2026-07-26 SEO audit report.
- Sitemap lastmod automation note: the current [public/sitemap.xml](../../public/sitemap.xml) has one `<url>` entry — the postbuild script needs to handle N entries once Q3 tasks add per-course + blog URLs.
- Consider extracting `<meta>` head management into `react-helmet-async` if [q3-growth/04-per-course-landing-pages.md](../q3-growth/04-per-course-landing-pages.md) is already in flight — otherwise vanilla `public/index.html` edits are fine.

## Execution log

- **2026-07-27** — Shipped direct to `main` (skipped feature-branch flow at user request). All items landed except **P10** (marked Blocked — no YouTube channel exists yet). Favicon set generated by cropping `public/apexoria-logo.jpeg` to square via `System.Drawing`; ICO built as PNG-inside-ICO wrapper (32×32). `<meta name="keywords">` removed entirely. Navbar + Footer Quick Links converted from `<button>` to `<a href="#anchor">` with `preventDefault + Lenis smooth-scroll` handler — crawlers see anchors, UX unchanged. R15 checked — no missing test-ids (Sprint 1 was head-tag / JSON-LD only, no new user-visible components). Postbuild automation via `scripts/update-sitemap-lastmod.js` wired into `npm run build`.
