# Apexoria Learning

Conversion-focused marketing website for **Apexoria Learning**, a Salesforce training academy in India. The site generates qualified leads, builds trust through social proof, and communicates learning paths and pricing — with a strong focus on the featured **Salesforce Development** track (plus a Salesforce QA cohort).

## Tech stack

**App** — the entire application lives at the repo root (React 19, single-page, no backend).
- React 19 (Create React App via [craco.config.js](craco.config.js))
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) primitives ([components.json](components.json), [tailwind.config.js](tailwind.config.js))
- Framer Motion for kinetic reveals, Lenis for smooth scrolling, react-fast-marquee for the editorial band
- React Hook Form + Zod for the lead-capture form
- Single-page layout composed in [App.js](src/App.js) from section components under [src/components/site/](src/components/site/)
- Lead form POSTs directly to a Google Form (`mode: 'no-cors'` + `FormData`) — see [LeadForm.jsx](src/components/site/LeadForm.jsx). Anti-spam trio (honeypot, 2s time-trap, 12s `localStorage` cooldown) is enforced client-side.

**Backend** — **none.** The FastAPI backend was removed on 2026-07-19 (see [.github/GOTCHAS.md](.github/GOTCHAS.md)) so the whole project deploys as a static site on Vercel. Google Form is the sole lead store.

**E2E tests** — [e2e/](e2e/) — Playwright suite (Chromium), isolated in its own package so the React 19 `--legacy-peer-deps` tree stays clean. See [Testing](#testing) below.

**Design system** — [design_guidelines.json](design_guidelines.json)
- "Hybrid Editorial Tech": light core canvas punctuated by dark navy blocks (hero / final CTA / footer)
- Fonts: Outfit (display) + Plus Jakarta Sans (body)
- Palette: navy `#0A1F44`, blue `#1E90FF`, gold `#F5B400`, orange `#F4622A` (primary CTAs only)

## Project layout

```
apexoria/
├── design_guidelines.json    # Design system spec
├── README.md                 # You are here
├── test_result.md            # Test protocol + status (used by testing agent)
├── package.json              # React 19 app package
├── craco.config.js           # CRA config overrides
├── tailwind.config.js
├── components.json           # shadcn/ui config
├── .github/
│   ├── AGENTS.md             # Multi-agent charter
│   └── GOTCHAS.md            # Institutional memory — read before touching Lenis, GF POST, or E2E
├── memory/
│   └── PRD.md                # Product requirements & implementation log
├── src/
│   ├── App.js                # Composes all site sections + Lenis smooth scroll
│   ├── components/site/      # Hero, Pricing, LeadForm, Founder, Footer, ...
│   ├── components/ui/        # shadcn/ui primitives
│   ├── constants/testIds/    # data-testid registry (shared with e2e/)
│   └── data.js               # Static content (courses, testimonials, links)
├── public/
│   ├── apexoria-brochure.pdf # (to be uploaded by owner — link 404s until then, with a graceful toast fallback)
│   ├── robots.txt
│   └── sitemap.xml
├── plugins/health-check/     # Optional dev-time health endpoints
├── e2e/
│   ├── playwright.config.js  # Chromium-only, GF stubbed
│   ├── tests/*.spec.js       # 8 specs: smoke, hero, nav, lead-form-*, anti-spam, pricing, brochure
│   └── utils/gfStub.js       # Blocks real Google Form POSTs from tests
└── test_reports/             # Playwright HTML + JSON output
```

### Content model

All marketing copy, course structure, pricing tiers, testimonial data, hero images, and contact links live in a single file: [src/data.js](src/data.js). It exports `CONTACT`, `CURRICULUM_TRACKS`, `PATHS`, `IMAGES`, and `VALUE_PROPS`. **Edit content there** — the section components consume from it, so you rarely need to touch JSX to update batch dates, prices, or testimonials.

### Test IDs

Every interactive element carries a `data-testid` sourced from the registry at [src/constants/testIds/](src/constants/testIds/). This is shared with the Playwright specs in [e2e/tests/](e2e/tests/) so tests stay decoupled from copy changes.

## Site sections

Ordered as rendered in [App.js](src/App.js):

1. `Navbar` — sticky, blur on scroll, mobile hamburger
2. `Hero` — dark navy, kinetic masked line reveal, parallax 3D background
3. `EditorialMarquee` — massive outline text, slow scroll
4. `WhyApexoria` — numbered manifesto chapters
5. `FeaturedCourse` — Salesforce Development (Fundamentals / Apex / LWC / Integration) + QA callout
6. `Pricing` — 3 dev paths (Foundation ₹1,999 · Crash ₹9,999 · Complete ₹21,999 *Most Popular*) + Special Offer ₹4,999
7. `Founder` — bio, certifications, skills
8. `LeadForm` — client + server validation, honeypot, WhatsApp fallback, course prefill
9. `SuccessStories` — testimonials + Google Reviews badge
10. `Batches` — upcoming Dev + QA cohorts
11. `PlacementSupport` — resume → mock interviews → referrals flow
12. `FaqSection` — 8-question shadcn Accordion; mirrors `FAQPage` JSON-LD in [index.html](public/index.html)
13. `FinalCTA` + `Footer` (dark navy)
14. `WhatsAppWidget` — floating green pulse

## Lead capture — how it works without a backend

The form in [LeadForm.jsx](src/components/site/LeadForm.jsx) POSTs directly to a Google Form's `formResponse` endpoint from the browser using `fetch({ method: 'POST', mode: 'no-cors', body: FormData })`. Google Forms accept this, and the linked Google Sheet is your single source of truth for leads.

Before POSTing, the form enforces the anti-spam trio client-side:

- **Honeypot** — hidden `company_website` field. If a bot fills it, we show fake success and drop the submission.
- **2-second time-trap** — submits that happen less than 2000 ms after the form mounts are silently dropped (fake success).
- **12-second cooldown** — the timestamp of the last successful submit is written to `localStorage['apex_lead_last']`; a rapid resubmit inside that window shows a friendly cooldown toast and does not POST.

Validation is Indian-mobile-only (`^(?:\+?91)?[6-9]\d{9}$`) plus a standard email regex. Free-text `course_interest` and `preferred_batch` are mapped to the Google Form dropdown choices via helpers inside `LeadForm.jsx`.

All three anti-spam checks and the GF URL/entry IDs are visible in the JS bundle — accepted trade-off, see [.github/GOTCHAS.md](.github/GOTCHAS.md) 2026-07-19 entry.

## Environment

All variables are read at build time by CRA (must be prefixed `REACT_APP_`). **No `.env` file is checked in** — you create one locally, and Vercel holds the production copy in its dashboard.

**`.env`** (create at repo root; gitignored) — needed for `npm start` and local `npm run build`:

| Variable                       | Purpose                                                                 |
|--------------------------------|-------------------------------------------------------------------------|
| `REACT_APP_GF_ACTION_URL`      | Google Form `formResponse` URL                                          |
| `REACT_APP_GF_ENTRY_NAME`      | Google Form `entry.*` id for name                                       |
| `REACT_APP_GF_ENTRY_PHONE`     | Google Form `entry.*` id for phone                                      |
| `REACT_APP_GF_ENTRY_EMAIL`     | Google Form `entry.*` id for email                                      |
| `REACT_APP_GF_ENTRY_COURSE`    | Google Form `entry.*` id for course                                     |
| `REACT_APP_GF_ENTRY_BATCH`     | Google Form `entry.*` id for batch                                      |
| `REACT_APP_GF_ENTRY_MESSAGE`   | Google Form `entry.*` id for message                                    |
| `REACT_APP_GTM_ID` *(optional)*| Google Tag Manager container id (e.g. `GTM-XXXXXX`). Leave unset to skip GTM. |

Grab the `entry.*` ids by opening your Google Form's live URL, viewing source, and searching for `entry.` — each field has one.

**Vercel** — set the same seven `REACT_APP_GF_*` variables in the project's **Settings → Environment Variables** tab. They must be present at build time, not runtime.

## Running locally

```powershell
npm install --legacy-peer-deps
npm start
```

CRA opens `http://localhost:3000`. No Python, no MongoDB, no backend to boot. The `--legacy-peer-deps` flag is required because of a `date-fns@4` vs `react-day-picker@8` peer conflict inside the shadcn set — this is a known workaround.

If `npm start` errors with `Cannot find module 'ajv/dist/compile/codegen'`, run `npm install ajv@8 --legacy-peer-deps --no-save` once — react-scripts on Node 20+ needs ajv v8 hoisted at the root.

## Deploying to Vercel

1. Push the repo to GitHub.
2. In Vercel, import the repo. Choose framework preset **Create React App**, root directory **`.`** (repo root), build command **`npm run build`**, output directory **`build`**.
3. Under **Settings → Environment Variables**, add the seven `REACT_APP_GF_*` values from your local `.env`.
4. (Optional) Also set `CI=false` to keep the build from failing on CRA's warning-as-error default, and `NODE_VERSION=20`.
5. (Optional) Upload the actual brochure PDF to `public/apexoria-brochure.pdf` before the first deploy. Until then, the brochure download button shows a graceful "Brochure coming soon" toast.

## Testing

The active test suite is **Playwright E2E** under [e2e/](e2e/) — Chromium only, kept in its own package so the React 19 dependency tree stays clean. There are no unit tests; CRA's default Jest runner is not used.

```powershell
cd e2e
npm install
npm run install:browsers    # first run only — downloads Chromium
npm test                    # runs all specs headless
npm run test:headed         # watch it drive the browser
npm run test:ui             # Playwright UI mode for debugging
npm run report              # open the HTML report from test_reports/playwright-html
```

The Playwright config auto-boots the CRA dev server (`npm start --prefix ..`) on `http://localhost:3000` before the run — no need to start it manually.

**Specs** in [e2e/tests/](e2e/tests/):

| Spec                              | Covers                                                                       |
|-----------------------------------|------------------------------------------------------------------------------|
| `smoke.spec.js`                   | Homepage renders, hero visible, key CTAs present                             |
| `hero.spec.js`                    | Masked reveal animation, parallax, CTA buttons                               |
| `navigation.spec.js`              | Sticky navbar, mobile hamburger, anchor scroll                               |
| `lead-form-happy.spec.js`         | Valid submission end-to-end (Google Form POST is stubbed)                    |
| `lead-form-validation.spec.js`    | Field regex, required, error copy                                            |
| `anti-spam.spec.js`               | Honeypot, 2 s time-trap, 12 s `localStorage` cooldown                        |
| `pricing.spec.js`                 | Three tiers, "Most Popular" badge, CTAs                                      |
| `brochure.spec.js`                | Download button + graceful 404 fallback                                      |

**Gotcha** — do not use `page.waitForLoadState('networkidle')`. Lenis runs a permanent `requestAnimationFrame` loop that keeps the network from ever going idle. Use `'domcontentloaded'` or explicit locator waits. Full note in [.github/GOTCHAS.md](.github/GOTCHAS.md) (2026-07-20 entry).

**Google Form stubbing** — [e2e/utils/gfStub.js](e2e/utils/gfStub.js) intercepts the real GF POST so tests never pollute the production Sheet. Every spec that submits the form must install this route.

Status is tracked in [test_result.md](test_result.md); per-run reports land in [test_reports/](test_reports/) (HTML + JSON).

## SEO

- **Domain**: `https://www.apexorialearning.in`
- **Robots**: [public/robots.txt](public/robots.txt) — allows all, points at the sitemap.
- **Sitemap**: [public/sitemap.xml](public/sitemap.xml) — currently a single homepage entry; expand as blog / FAQ ship.
- **Meta + Open Graph + JSON-LD** live in [public/index.html](public/index.html). Both `EducationalOrganization` and `FAQPage` schemas are emitted — the FAQ schema must stay in sync with `FAQ_ITEMS` in [src/data.js](src/data.js).
- Gaps to fill next: `Course` JSON-LD, per-page canonicals once we add routes, and a proper OG image.

## Analytics

Three stacks are wired up and every named event fans out to all three via [src/lib/analytics.js](src/lib/analytics.js) — `trackEvent(name, params)`:

1. **PostHog** — preinstalled inline in [index.html](public/index.html); autocaptures clicks + pageviews out of the box.
2. **Vercel Analytics** — rendered from `<Analytics />` inside [App.js](src/App.js); autocaptures pageviews + Web Vitals.
3. **Google Analytics 4** — gtag installed inline in [index.html](public/index.html) (property `G-2GWDGQ115Q`); receives every named event via `window.gtag`.
4. **Google Tag Manager (optional)** — loads at runtime only when `REACT_APP_GTM_ID` is set. Coexists with GA4 for future server-side tagging.

Named events currently fired:

| Event                       | Fired from                                              | Params                                  |
|-----------------------------|---------------------------------------------------------|-----------------------------------------|
| `cta_click`                 | Hero, FinalCTA, FAQ enroll buttons                      | `{ location }`                          |
| `pricing_enroll_click`      | Pricing tier + Special Offer buttons                    | `{ tier, price, level }`                |
| `lead_form_submit_success`  | LeadForm after a real Google Form POST                  | `{ course, batch }`                     |
| `whatsapp_click`            | Hero WhatsApp button, floating widget                   | `{ location }`                          |
| `brochure_download`         | FinalCTA brochure button                                | `{ location, available }`               |
| `faq_open`                  | FAQ accordion trigger                                   | `{ index, question }`                   |

Add new events by calling `trackEvent(name, params)` from any component — no wiring per stack needed.

## Conventions

- Env vars must be prefixed **`REACT_APP_`** — CRA otherwise strips them.
- **Content edits go in [src/data.js](src/data.js)**, not inside components.
- Every new interactive element needs a **`data-testid`** registered in [src/constants/testIds/](src/constants/testIds/) so Playwright can target it.
- Run the **E2E suite** before opening a Vercel deploy PR.
- Any user-visible change must respect [design_guidelines.json](design_guidelines.json) — palette, typography, and motion rules are non-negotiable.

## Further reading

- Product spec and implementation log: [memory/PRD.md](memory/PRD.md)
- Design system (colors, typography, motion, section rules): [design_guidelines.json](design_guidelines.json)
- Institutional gotchas (Lenis, GF POST, deploy quirks): [.github/GOTCHAS.md](.github/GOTCHAS.md)
