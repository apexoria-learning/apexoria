# Apexoria Learning — PRD

## Problem Statement
Conversion-focused marketing website for Apexoria Learning, a Salesforce training academy in India. Generates qualified leads, builds trust via social proof, communicates learning paths & pricing. Focus: Salesforce **Development** (featured), plus Salesforce QA cohorts.

## Users
- Career-switchers / freshers (non-tech welcome) in India entering Salesforce/CRM roles
- Working professionals upskilling

## Architecture
- Frontend: React (CRA) + Tailwind + shadcn/ui + framer-motion + lenis (smooth scroll) + react-fast-marquee. Single-page with anchor sections.
- Backend: **none** — the FastAPI + MongoDB backend was deleted 2026-07-19 (see [.github/GOTCHAS.md](../.github/GOTCHAS.md)). The site deploys as a pure static build on Vercel.
- Lead store: Google Form / Google Sheet is the sole store. The browser POSTs directly from [LeadForm.jsx](../src/components/site/LeadForm.jsx) using `fetch(mode:'no-cors', FormData)`.
- Design: "Hybrid Editorial Tech" — light core + dark navy hero/CTA/footer. Fonts: Outfit (display) + Plus Jakarta Sans (body).

## User Choice
- Lead form: **Google Form only** integration. Values live in `.env` under seven `REACT_APP_GF_*` keys and are also set in the Vercel dashboard. No Mongo fallback (backend removed). No Salesforce Web-to-Lead.
- Recovery UX for GF failure: WhatsApp CTA already surfaced in [LeadForm.jsx](../src/components/site/LeadForm.jsx).

## Implemented (2026-07-19)
- Sticky navbar (blur on scroll, hamburger mobile), kinetic hero (masked line reveal + parallax), editorial marquee (darkened text), Why Apexoria manifesto, Featured Course = Salesforce Development (4-col curriculum: Fundamentals/Apex/LWC/Integration + Salesforce cloud logo), QA cohort callout.
- Pricing: 3 dev paths (Foundation ₹1,999 / Crash ₹9,999 / Complete ₹21,999 Most Popular) each with "includes" list + step tracker; separate Special Offer ₹4,999 card.
- Founder section (bio, cert: Salesforce Platform Developer I, skills, photo placeholder).
- Lead form (client + server validation, honeypot, success + WhatsApp fallback, pricing prefill).
- Success Stories (placeholder testimonials) + Google Reviews badge + stats; Upcoming Batches (Dev + QA); Placement Support; Final CTA; Footer; floating WhatsApp widget.
- Download Brochure button -> static `/apexoria-brochure.pdf` with a HEAD-check fallback that toasts "Brochure download will be available shortly" when the PDF isn't uploaded yet.
- SEO: meta description/keywords, OG/Twitter tags, favicon (logo), JSON-LD EducationalOrganization.

## Placeholders to update later
- Founder name & photo; testimonial names/reviews; placement stats; Google reviews rating/count/link; LinkedIn & Facebook URLs; batch dates/seats; Google Form action URL + entry field ids (in `.env` **and** Vercel dashboard environment variables); brochure PDF at `public/apexoria-brochure.pdf`.

## Backlog (P1/P2)
- P1: Upload real brochure PDF; wire real Google Form values in Vercel; add real founder photo & testimonials; replace preview-CDN asset URLs in `public/index.html`.
- P2: Blog/SEO content pages; add reCAPTCHA (client-side v3 since there's no backend to verify server-side); analytics events on CTA clicks.

## CMS (added 2026-07-27)
- Admin panel at `/admin` (React route, lazy-loaded — no impact on marketing site bundle).
- Auth: Firebase Google SSO + Firestore `/admins/{email}` allowlist (rules in `firestore.rules`).
- Save flow: client POSTs to `/api/cms/commit` (Vercel Serverless Function, ES module using `jose` to verify Firebase ID tokens), which commits `src/data.js` to GitHub via the Contents API. Vercel auto-redeploys.
- Uploads: Firebase Storage (rules in `storage.rules`), URLs stored inline in `data.js`.
- Editable sections: Contact, WhatsApp, Founder (+photo upload), Batches, Pricing (4 tiers + Enrollment Special Offer + course dropdown), Curriculum (2 tracks × 2 courses with per-course brochure PDF upload), Testimonials, FAQ, Downloads (main brochure + Resources study notes), Images (logos + hero/students/team), Stats + Value Props + Placement Steps.
- Setup instructions: [CMS_SETUP.md](../CMS_SETUP.md). Requires 6 GitHub/Firebase env vars + 7 REACT_APP_FIREBASE_* keys in Vercel.
- Fonts: reuses site's Google fonts (Outfit + Plus Jakarta Sans) for consistency. Sidebar collapses to a drawer at `<lg` breakpoint.
