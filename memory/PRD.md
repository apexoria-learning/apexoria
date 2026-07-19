# Apexoria Learning — PRD

## Problem Statement
Conversion-focused marketing website for Apexoria Learning, a Salesforce training academy in India. Generates qualified leads, builds trust via social proof, communicates learning paths & pricing. Focus: Salesforce **Development** (featured), plus Salesforce QA cohorts.

## Users
- Career-switchers / freshers (non-tech welcome) in India entering Salesforce/CRM roles
- Working professionals upskilling

## Architecture
- Frontend: React (CRA) + Tailwind + shadcn/ui + framer-motion + lenis (smooth scroll) + react-fast-marquee. Single-page with anchor sections.
- Backend: FastAPI + MongoDB (motor). Lead capture stored in `leads` collection. Brochure PDF via reportlab.
- Design: "Hybrid Editorial Tech" — light core + dark navy hero/CTA/footer. Fonts: Outfit (display) + Plus Jakarta Sans (body).

## User Choice
- Lead form: **Google Form only** integration (config placeholders in backend .env: GOOGLE_FORM_ACTION_URL + GF_ENTRY_* field ids). Leads ALWAYS stored in MongoDB as safe fallback. No Salesforce Web-to-Lead.

## Implemented (2026-07-19)
- Sticky navbar (blur on scroll, hamburger mobile), kinetic hero (masked line reveal + parallax), editorial marquee (darkened text), Why Apexoria manifesto, Featured Course = Salesforce Development (4-col curriculum: Fundamentals/Apex/LWC/Integration + Salesforce cloud logo), QA cohort callout.
- Pricing: 3 dev paths (Foundation ₹1,999 / Crash ₹9,999 / Complete ₹21,999 Most Popular) each with "includes" list + step tracker; separate Special Offer ₹4,999 card.
- Founder section (bio, cert: Salesforce Platform Developer I, skills, photo placeholder).
- Lead form (client + server validation, honeypot, success + WhatsApp fallback, pricing prefill).
- Success Stories (placeholder testimonials) + Google Reviews badge + stats; Upcoming Batches (Dev + QA); Placement Support; Final CTA; Footer; floating WhatsApp widget.
- Download Brochure button -> GET /api/brochure (branded PDF).
- SEO: meta description/keywords, OG/Twitter tags, favicon (logo), JSON-LD EducationalOrganization.
- All backend (7/7) + frontend (14/14) tests passed.

## Placeholders to update later
- Founder name & photo; testimonial names/reviews; placement stats; Google reviews rating/count/link; LinkedIn & Facebook URLs; batch dates/seats; Google Form action URL + entry field ids (backend .env).

## Backlog (P1/P2)
- P1: Wire real Google Form (add env vars) once provided; add real founder photo & testimonials.
- P2: Admin dashboard to view leads; blog/SEO content pages; add reCAPTCHA; analytics events on CTA clicks.
