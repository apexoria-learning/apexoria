# Custom 404 page + Vercel rewrite guard

**Quadrant:** Q3 (Tough & High Impact)
**Priority within quadrant:** 2
**Status:** Not started
**Owner (proposed):** Frontend
**Impact:** Medium
**Effort:** Small–Medium
**Source audit item(s):** P16

## Why

Vercel's default SPA rewrite (present as long as `vercel.json` catches all routes with a fallback to `index.html`) means **every unknown path returns HTTP 200 with the SPA shell**. Google Search Console reports these as *soft 404s* — Google spends crawl budget on paths that don't exist and eventually de-indexes the real content. Also user-visible: a wrong URL currently shows the marketing homepage instead of an error page, which is confusing.

Becomes materially more important once [q3-growth/04-per-course-landing-pages.md](./04-per-course-landing-pages.md) and [q3-growth/05-blog-launch.md](./05-blog-launch.md) introduce real routing — every 404 amplifies the soft-404 problem.

## Scope

- Create `public/404.html` — a real HTML 404 page (static, no React needed) with:
  - `<title>Page Not Found — Apexoria Learning</title>`
  - Simple brand-consistent design (navy background, Outfit heading, gold accent) matching [design_guidelines.json](../../design_guidelines.json)
  - Prominent link back to `/` (home) and `/#contact` (lead form)
  - `<meta name="robots" content="noindex">`
- Create `vercel.json` at repo root (does not exist today) with:
  ```json
  {
    "trailingSlash": false,
    "cleanUrls": true,
    "rewrites": [
      { "source": "/((?!api/|_next/|_vercel|images/|static/|favicon.ico|robots.txt|sitemap.xml|manifest.json|apexoria-brochure.pdf|apexoria-logo.jpeg).*)", "destination": "/index.html" }
    ]
  }
  ```
  So the SPA rewrite still catches all React-routed paths, but genuine 404s (missing assets, malformed URLs that fail the negative-lookahead) fall through to Vercel's default 404 which will serve `public/404.html`.
- **Important:** Vercel serves `public/404.html` **for asset 404s**, not for SPA-rewritten routes. The full picture:
  - Missing asset → Vercel default 404 → serves `public/404.html` ✓
  - Unknown React route → SPA rewrite → `index.html` renders React app → **React must handle unknown routes itself** (requires React Router — see dependencies)
- Once React Router is introduced by [04-per-course-landing-pages.md](./04-per-course-landing-pages.md), add a `<Route path="*" element={<NotFound />} />` catch-all that:
  - Renders the same visual as `public/404.html`
  - Calls `window.location.replace('/404.html')` for a real HTTP 404 status (SPA can't set status codes, so redirect to the static 404)
  - Alternatively (cleaner): Vercel `vercel.json` route override with `"status": 404` for a known list of not-found patterns

## Out of scope

- React Router introduction itself — that's the entry point for [04-per-course-landing-pages.md](./04-per-course-landing-pages.md).
- Rewrite rules for the per-course routes / blog routes — those are added by their respective task files.

## Files likely touched

- [public/404.html](../../public/404.html) — new file
- [vercel.json](../../vercel.json) — new file
- Later (once router lands): a new `src/pages/NotFound.jsx` or similar

## Dependencies

- **Recommended order:** ship the static `public/404.html` + `vercel.json` first (this task), then React Router + `<Route path="*">` in [04-per-course-landing-pages.md](./04-per-course-landing-pages.md). But if you introduce React Router first, wire the catch-all route in the same PR.

## Acceptance criteria

1. `curl -I https://www.apexorialearning.in/this-does-not-exist.png` returns `HTTP/1.1 404`.
2. Visiting a made-up asset path in the browser shows the branded 404 page (not the Vercel default text).
3. Google Search Console → Coverage → **soft-404 count decreases** after the next crawl cycle.
4. `public/404.html` has `<meta name="robots" content="noindex">` — Google should not index the 404 template itself.
5. All real SPA routes (`/`, `/#pricing`, `/#faq`, and any future `/salesforce-crash-course`) still return 200 via the rewrite.
6. `vercel.json` rewrite rule tested locally with `vercel dev` before merge.

## User input needed

- None — this can be executed with defaults from design_guidelines.json for branding.

## Notes / references

- Vercel docs on 404 handling: https://vercel.com/docs/errors#custom-404-page
- Gotcha context: [.github/GOTCHAS.md](../../.github/GOTCHAS.md) 2026-07-21 flatten entry — Vercel Root Directory is `.` (repo root), so `public/404.html` at repo root deploys to `/404.html` on the CDN correctly.
- The current site has NO `vercel.json` — Vercel uses its default CRA autodetection. Introducing one is a one-way door (Vercel starts respecting the file exclusively); test locally first.
