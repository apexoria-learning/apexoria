# Apexoria Learning

Conversion-focused marketing website for **Apexoria Learning**, a Salesforce training academy in India. The site generates qualified leads, builds trust through social proof, and communicates learning paths and pricing — with a strong focus on the featured **Salesforce Development** track (plus a Salesforce QA cohort).

## Tech stack

**Frontend** — [frontend/](frontend/) (this is the entire application — there is no backend)
- React 19 (Create React App via [craco.config.js](frontend/craco.config.js))
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) primitives ([components.json](frontend/components.json), [tailwind.config.js](frontend/tailwind.config.js))
- Framer Motion for kinetic reveals, Lenis for smooth scrolling, react-fast-marquee for the editorial band
- React Hook Form + Zod for the lead-capture form
- Single-page layout composed in [App.js](frontend/src/App.js) from section components under [frontend/src/components/site/](frontend/src/components/site/)
- Lead form POSTs directly to a Google Form (`mode: 'no-cors'` + `FormData`) — see [LeadForm.jsx](frontend/src/components/site/LeadForm.jsx). Anti-spam trio (honeypot, 2s time-trap, 12s `localStorage` cooldown) is enforced client-side.

**Backend** — **none.** The FastAPI backend was removed on 2026-07-19 (see [.github/GOTCHAS.md](.github/GOTCHAS.md)) so the whole project deploys as a static site on Vercel. Google Form is the sole lead store.

**Design system** — [design_guidelines.json](design_guidelines.json)
- "Hybrid Editorial Tech": light core canvas punctuated by dark navy blocks (hero / final CTA / footer)
- Fonts: Outfit (display) + Plus Jakarta Sans (body)
- Palette: navy `#0A1F44`, blue `#1E90FF`, gold `#F5B400`, orange `#F4622A` (primary CTAs only)

## Project layout

```
apexoria/
├── design_guidelines.json    # Design system spec
├── memory/PRD.md             # Product requirements & implementation log
├── test_result.md            # Test protocol + status (used by testing agent)
└── frontend/
    ├── src/
    │   ├── App.js            # Composes all site sections + Lenis smooth scroll
    │   ├── components/site/  # Hero, Pricing, LeadForm, Founder, Footer, ...
    │   ├── components/ui/    # shadcn/ui primitives
    │   ├── constants/testIds # data-testid registry
    │   └── data.js           # Static content (courses, testimonials, links)
    ├── public/
    │   └── apexoria-brochure.pdf  # (to be uploaded by owner — link 404s until then, with a graceful toast fallback)
    └── plugins/health-check  # Optional dev-time health endpoints
```

## Site sections

Ordered as rendered in [App.js](frontend/src/App.js):

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
12. `FinalCTA` + `Footer` (dark navy)
13. `WhatsAppWidget` — floating green pulse

## Lead capture — how it works without a backend

The form in [LeadForm.jsx](frontend/src/components/site/LeadForm.jsx) POSTs directly to a Google Form's `formResponse` endpoint from the browser using `fetch({ method: 'POST', mode: 'no-cors', body: FormData })`. Google Forms accept this, and the linked Google Sheet is your single source of truth for leads.

Before POSTing, the form enforces the anti-spam trio client-side:

- **Honeypot** — hidden `company_website` field. If a bot fills it, we show fake success and drop the submission.
- **2-second time-trap** — submits that happen less than 2000 ms after the form mounts are silently dropped (fake success).
- **12-second cooldown** — the timestamp of the last successful submit is written to `localStorage['apex_lead_last']`; a rapid resubmit inside that window shows a friendly cooldown toast and does not POST.

Validation is Indian-mobile-only (`^(?:\+?91)?[6-9]\d{9}$`) plus a standard email regex. Free-text `course_interest` and `preferred_batch` are mapped to the Google Form dropdown choices via helpers inside `LeadForm.jsx`.

All three anti-spam checks and the GF URL/entry IDs are visible in the JS bundle — accepted trade-off, see [.github/GOTCHAS.md](.github/GOTCHAS.md) 2026-07-19 entry.

## Environment

All variables are read at build time by CRA (must be prefixed `REACT_APP_`).

**frontend/.env** (checked in, used as the default for local + prod builds)

| Variable                       | Purpose                                                                 |
|--------------------------------|-------------------------------------------------------------------------|
| `REACT_APP_GF_ACTION_URL`      | Google Form `formResponse` URL                                          |
| `REACT_APP_GF_ENTRY_NAME`      | Google Form `entry.*` id for name                                       |
| `REACT_APP_GF_ENTRY_PHONE`     | Google Form `entry.*` id for phone                                      |
| `REACT_APP_GF_ENTRY_EMAIL`     | Google Form `entry.*` id for email                                      |
| `REACT_APP_GF_ENTRY_COURSE`    | Google Form `entry.*` id for course                                     |
| `REACT_APP_GF_ENTRY_BATCH`     | Google Form `entry.*` id for batch                                      |
| `REACT_APP_GF_ENTRY_MESSAGE`   | Google Form `entry.*` id for message                                    |

**frontend/.env.local** (gitignored) — for local overrides only. Empty by default because the same GF values apply to local + prod.

**Vercel** — set the same seven `REACT_APP_GF_*` variables in the project's **Settings → Environment Variables** tab.

## Running locally

```powershell
cd frontend
npm install --legacy-peer-deps
npm start
```

CRA opens `http://localhost:3000`. No Python, no MongoDB, no backend to boot. The `--legacy-peer-deps` flag is required because of a `date-fns@4` vs `react-day-picker@8` peer conflict inside the shadcn set — this is a known workaround.

If `npm start` errors with `Cannot find module 'ajv/dist/compile/codegen'`, run `npm install ajv@8 --legacy-peer-deps --no-save` once — react-scripts on Node 20+ needs ajv v8 hoisted at the root.

## Deploying to Vercel

1. Push the repo to GitHub.
2. In Vercel, import the repo. Choose framework preset **Create React App**, root directory **frontend**, build command **`npm run build`**, output directory **`build`**.
3. Under **Settings → Environment Variables**, add the seven `REACT_APP_GF_*` values from your `frontend/.env`.
4. (Optional) Also set `CI=false` to keep the build from failing on CRA's warning-as-error default, and `NODE_VERSION=20`.
5. (Optional) Upload the actual brochure PDF to `frontend/public/apexoria-brochure.pdf` before the first deploy. Until then, the brochure download button shows a graceful "Brochure coming soon" toast.

## Testing

- Frontend: `npm test` (CRA/Jest) from the `frontend/` directory
- Status tracked in [test_result.md](test_result.md); per-run reports in [test_reports/](test_reports/)

Every interactive element carries a `data-testid` attribute (see [frontend/src/constants/testIds/](frontend/src/constants/testIds/)) to keep automated tests robust.

## Further reading

- Product spec and implementation log: [memory/PRD.md](memory/PRD.md)
- Design system (colors, typography, motion, section rules): [design_guidelines.json](design_guidelines.json)

