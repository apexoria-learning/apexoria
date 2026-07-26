# Gated brochure downloads (email-for-PDF)

**Quadrant:** Q4 (Tough & Low Impact)
**Priority within quadrant:** 3
**Status:** Deferred — reassess only if lead conversion data justifies
**Owner (proposed):** Frontend + Orchestrator (backend/email service decision)
**Impact:** Low–Medium (unproven)
**Effort:** Medium–Large
**Source audit item(s):** R13

## Why

The audit surfaced two potential wins:

1. **Higher-quality leads** — asking for email before downloading a course brochure filters casual visitors out and delivers a warmer lead into the counsellor's queue.
2. **Indexable content** — if brochures live at `/curriculum/salesforce-crash-course.pdf`, Google indexes PDFs directly and can rank them for niche queries like "salesforce lwc curriculum pdf".

**However** — the audit also noted the current WhatsApp funnel already converts well. Gating brochures adds friction to a conversion step that isn't broken. The recommendation is: **do not build this** until we have data showing the ungated brochure download stops leads from progressing.

## Scope (if greenlit)

- Replace the current [BROCHURE_URL](../../src/data.js) direct-download pattern in [FinalCTA.jsx](../../src/components/site/FinalCTA.jsx#L11-L25) + [FeaturedCourse.jsx](../../src/components/site/FeaturedCourse.jsx#L19-L30) + [Footer.jsx](../../src/components/site/Footer.jsx#L24-L36) with a modal:
  - Fields: name + email + course of interest (pre-selected from context)
  - Same anti-spam trio as [LeadForm.jsx](../../src/components/site/LeadForm.jsx) — honeypot + time-trap + 12s cooldown
  - Submit → POST to Google Form (reuse the existing form URL + entry IDs)
  - After successful submit → return signed short-lived download URL OR direct download link
- Store PDFs at indexable paths under `/curriculum/` — currently `/apexoria-brochure.pdf` — split into per-course files:
  - `/curriculum/salesforce-foundation.pdf`
  - `/curriculum/salesforce-crash-course.pdf`
  - `/curriculum/salesforce-complete-course.pdf`
  - `/curriculum/salesforce-qa.pdf`
  - `/curriculum/salesforce-automation-qa.pdf`
- Add to `sitemap.xml` — Google indexes PDFs.
- Track the download event with the source location (`brochure_download` event already exists in [FinalCTA.jsx](../../src/components/site/FinalCTA.jsx#L15) — extend with course dimension).

**Backend decision** — this is a live product decision, not a technical one:

- **Option A: gate client-side only** — modal captures email, POSTs to Google Form, then reveals the direct download link. Trivial to bypass by inspecting the DOM. Zero backend. Fits current architecture per [.github/GOTCHAS.md](../../.github/GOTCHAS.md) 2026-07-19 (backend removed).
- **Option B: real signed URLs** — requires re-introducing a small backend (Vercel Edge Function is cheap) to generate short-lived signed download URLs and forward the email to the counsellor. Actual gating. Reintroduces backend surface per [.github/GOTCHAS.md](../../.github/GOTCHAS.md) — needs explicit user Override.

## Out of scope

- Marketing automation drip campaigns after email capture — separate CRM concern.
- Progressive profiling (asking phone on second download) — Phase 2+.

## Files likely touched

- [src/components/site/BrochureGate.jsx](../../src/components/site/BrochureGate.jsx) — new modal component
- [src/components/site/FinalCTA.jsx](../../src/components/site/FinalCTA.jsx) — replace direct-download `<a>` with modal trigger
- [src/components/site/FeaturedCourse.jsx](../../src/components/site/FeaturedCourse.jsx) — same
- [src/components/site/Footer.jsx](../../src/components/site/Footer.jsx) — same for resources list
- [public/curriculum/](../../public/curriculum/) — new directory with per-course PDFs
- [public/sitemap.xml](../../public/sitemap.xml) — add PDF URLs
- [src/lib/analytics.js](../../src/lib/analytics.js) — extend `brochure_download` event with `course` dimension
- (Option B only) [api/brochure-token.js](../../api/brochure-token.js) — new Vercel Edge Function

## Dependencies

- Data justification — user must show lead-drop-off metrics where the current ungated download is a bottleneck. Without that data, do not start.
- Real per-course PDF assets (5 files) — currently there's one placeholder `/apexoria-brochure.pdf` referenced everywhere.
- If Option B: user Override per [.github/GOTCHAS.md](../../.github/GOTCHAS.md) 2026-07-19 to reintroduce backend surface.

## Acceptance criteria

**If greenlit:**

1. Every "Download Brochure" CTA in the site opens the gate modal (not a direct download).
2. Successful modal submit routes the lead to the Google Form (verify by checking a test submission lands in the Sheet).
3. Modal has honeypot + time-trap + cooldown identical to [LeadForm.jsx](../../src/components/site/LeadForm.jsx) — reuse the same helpers.
4. PDFs at `/curriculum/*.pdf` return 200 and are indexed by Google within 30 days (verify in GSC).
5. `brochure_download` event fires with course dimension across GA4 + PostHog + Vercel Analytics.
6. Playwright: `brochure-gate.spec.js` covers happy path + validation errors + honeypot rejection.
7. A/B test setup: 50 % of traffic sees the gate, 50 % keeps direct download. Measure lead volume + lead quality (counsellor scored) over 4 weeks. Ship the winner permanently; roll back the loser.

## User input needed

- **Data justification** — lead funnel numbers showing that the current ungated download is a conversion leak.
- 5 real per-course PDFs.
- Approval for Option A vs Option B (client-side gate vs real signed URLs).
- If Option B: explicit Override to reintroduce backend surface.

## Notes / references

- Current brochure flow works and converts. **Do not fix what isn't broken** unless there's data supporting a change.
- Consider a simpler alternative: keep the current direct download and add a *follow-up* email capture 30 seconds after download starts (a lightweight sticky prompt). Non-blocking but still captures interested users.
- If the site ever runs paid campaigns, gated content is a stronger fit because it justifies the CPC spend by qualifying leads immediately.
