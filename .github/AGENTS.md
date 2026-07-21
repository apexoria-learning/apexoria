# Apexoria Learning — Agent Team Contract

Shared workspace context loaded for every agent in `.github/agents/`. Read this **first**, every time.

## Product in one paragraph

Apexoria Learning is a conversion-focused, single-page marketing site for a Salesforce training academy in India. The featured track is **Salesforce Development**; a **Salesforce QA** cohort is offered alongside. Primary goal: capture qualified leads. See [memory/PRD.md](../memory/PRD.md) for the full product spec and backlog.

## Stack

| Layer | What |
|---|---|
| Frontend | React 19 + CRA/craco, Tailwind 3.4, shadcn/ui, Framer Motion 11, Lenis smooth-scroll, react-hook-form + Zod, react-fast-marquee |
| Backend | **None.** The FastAPI backend was deleted 2026-07-19 (see [.github/GOTCHAS.md](GOTCHAS.md)). The site is a pure static build. |
| Data | Google Form is the sole store. The React lead form POSTs directly to `GOOGLE_FORM_ACTION_URL` from the browser (`mode: 'no-cors'`, `FormData` body). On failure the visible WhatsApp CTA in [LeadForm.jsx](../src/components/site/LeadForm.jsx) is the only recovery path. See [.github/GOTCHAS.md](GOTCHAS.md) — 2026-07-19 entries. |
| Design system | [design_guidelines.json](../design_guidelines.json) — "Hybrid Editorial Tech" |

## File-tree ownership (agents MUST respect)

| Path | Owner |
|---|---|
| `src/**` | Frontend agent |
| `plugins/**`, `*.config.js`, `package.json` | Frontend agent (with concern check) |
| `**/*.test.js`, `e2e/**`, `test_reports/**` | QA agent |
| `test_result.md` | Orchestrator (as `main_agent`) + QA (as `testing_agent`), per the protocol block inside that file |
| `design_guidelines.json` | Design Auditor reads; nobody else edits |
| `memory/PRD.md`, `README.md` | Orchestrator (with user approval for scope-changing edits) |
| git branches, commits, pushes, PRs, merges to `main` (Vercel auto-deploy trigger) | Deployment agent |

The `backend/` tree and the Backend specialist agent definition were both removed on 2026-07-19 (see [.github/GOTCHAS.md](GOTCHAS.md) top entry). If a real backend is ever reintroduced, restore the Backend agent under `.github/agents/backend.agent.md`, add it back to the Orchestrator's `agents:` list, and log a new GOTCHAS entry.

Cross-tree edits require Orchestrator approval.

## Non-negotiable rules (all agents)

1. **`data-testid` on every interactive or key informational element.** Pull ids from [src/constants/testIds/](../src/constants/testIds/). New ids get added to that registry — never inline.
2. **Preserve the anti-spam trio** — now enforced **client-side** in [LeadForm.jsx](../src/components/site/LeadForm.jsx) after the 2026-07-19 backend deletion: (a) `company_website` honeypot silently drops the submission, (b) 2000ms time-trap between mount and submit, (c) 12s `localStorage` cooldown between successful submits. All three are bypassable by any bot that skips the JS — do not remove them without user override.
3. **Preserve validators**: `PHONE_RE` (Indian mobile only) and `EMAIL_RE` — same regexes, now enforced only client-side. The lead form POSTs directly to Google Form (`mode: 'no-cors'`, `FormData`); on failure the WhatsApp CTA is the visible fallback. Do not reintroduce a backend or add a database without an explicit user Override (see [.github/GOTCHAS.md](GOTCHAS.md) 2026-07-19).
4. **No PII in logs** beyond the existing single info line (`{name} ({email})`). No email/phone bodies dumped.
5. **Orange (`#F4622A`) is for primary conversion CTAs only.** Gold (`#F5B400`) is for sparing inline highlight. See `colors.usage_rules` in [design_guidelines.json](../design_guidelines.json).
6. **Fonts**: Outfit (display) + Plus Jakarta Sans (body). Never Inter or Roboto for headings.
7. **No emoji icons.** Use Lucide or Phosphor.
8. **Section padding**: `py-24` minimum on new sections, per design guide.
9. **Motion contract**: new sections use Framer Motion `whileInView` with `{opacity: 0, y: 40}` → `{opacity: 1, y: 0}` and stagger for children. The Lenis wrapper in [src/App.js](../src/App.js) must stay intact.
10. **No new UI library** without user approval — reuse [src/components/ui/](../src/components/ui/) shadcn primitives.
11. **No backend surface exists.** The `/api` prefix rule and CORS middleware guidance are retired. All external calls happen from the browser (Google Form POST). If a backend is ever reintroduced, restore this rule and add a new GOTCHAS entry.
12. **Git safety**: never `push --force`, `reset --hard` on a shared branch, `--no-verify`, or amend a pushed commit without an explicit user `Override` from an options prompt.
13. **Read [.github/GOTCHAS.md](GOTCHAS.md) first.** It's the living record of project-specific facts (deployment target, infra, integrations, workarounds). An entry there **overrides** the defaults in this file when they conflict. Cite the relevant entry in your reply when it applies.

## Team communication contract

Every specialist reply ends with:

```
Summary: <one plain sentence>
Files touched: <paths, or "none">
Concerns raised: <⚠️ items, or "none">
Recommended next step: <one action>
```

Every risky/off-convention ask gets challenged **before** action:

```
⚠️ Concern: <what>
Why: <impact — security / design / test / scope>
Suggested alternative: <what to do instead>
```

Then wait for Orchestrator acknowledgement.

## Dev commands (Windows PowerShell)

```powershell
# Frontend (only — no backend to run)
npm install --legacy-peer-deps
npm start

# Jest / RTL tests
npm test

# Playwright end-to-end tests (added 2026-07-20)
cd e2e ; npm install ; npx playwright install chromium ; npm test
```

No Python, no venv, no MongoDB. All lead traffic goes browser → Google Form.

## Where to find things

- Product spec + backlog: [memory/PRD.md](../memory/PRD.md)
- Design system rules: [design_guidelines.json](../design_guidelines.json)
- Test protocol (mandatory YAML format): [test_result.md](../test_result.md)
- Section composition: [src/App.js](../src/App.js)
- Lead form (spam trio + GF POST): [src/components/site/LeadForm.jsx](../src/components/site/LeadForm.jsx)
- Test id registry: [src/constants/testIds/](../src/constants/testIds/)
- Playwright config + specs: [e2e/playwright.config.js](../e2e/playwright.config.js), [e2e/tests/](../e2e/tests/), [e2e/utils/gfStub.js](../e2e/utils/gfStub.js)
- Prior test outputs: [test_reports/](../test_reports/)
