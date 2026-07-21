# Apexoria — Project Gotchas Log

Living record of project-specific constraints, decisions, and workarounds the Orchestrator learns from the user (or from failures) over time. **Every agent MUST read this file before starting any task** — an entry here overrides the defaults in `AGENTS.md` when they conflict.

## When to add an entry

The Orchestrator adds an entry whenever the user reveals or decides something that would change how any specialist works. Examples:

- Deployment target ("we're deploying to Vercel")
- Infra choice ("MongoDB is Atlas, not local Docker")
- External integration chosen ("we use Razorpay for payments, not Stripe")
- Product decision that overrides the default ("keep the honeypot but drop the 12s IP throttle for the demo tenant")
- Known-bad path to avoid ("axios chokes on the CORS preflight when `withCredentials` is set — use fetch here")
- Credential / account facts (never the credentials themselves — those go in `memory/test_credentials.md` locally, never committed)

## Entry format

Append new entries at the top of the "Entries" section (newest first). Use this exact template:

```markdown
### YYYY-MM-DD — <short title>
- Category: <deployment | infra | integration | product-decision | workaround | constraint>
- Fact: <one plain sentence>
- Affects: <agent(s) — e.g. "Frontend + Backend", or "all">
- Impact: <what changes about how we work>
- Source: <"user said in chat on YYYY-MM-DD" or file/commit ref>
```

## Update rules (Orchestrator)

1. **Confirm the fact** with the user via an options prompt (`Confirm / Adjust / Discard`) before writing an entry — the log must be trustworthy.
2. **One fact per entry.** If the user reveals three things, write three entries.
3. **Append at the top** so newest facts win when agents skim.
4. **Never delete an entry.** Supersede it by adding a new entry that references the old one (`Supersedes: 2026-07-19 — <title>`).
5. **Never store secrets.** Credentials, tokens, keys stay out of this file. Store them in `memory/test_credentials.md` (local, git-ignored).
6. **Cross-reference on impact.** If a gotcha invalidates a rule in `AGENTS.md`, note it here — do not silently edit `AGENTS.md`. If the change is permanent, ask the user to promote it into `AGENTS.md` via a separate options prompt.

## How other agents use this file

Read the whole file at the start of every session. If any entry applies to your task, cite it in your reply (e.g. *"Per gotcha 2026-08-01 — Vercel deploy: switching image loader to next/image is not applicable since we're on CRA, using plain <img> instead"*). If a gotcha conflicts with the user's current request, raise a `⚠️ Concern` via the Orchestrator.

---

## Entries

### 2026-07-21 — `frontend/` directory flattened into repo root; Vercel Root Directory flipped to `.`
- Category: infra
- Fact: The `frontend/` sub-directory was removed and its entire tree (React source, `public/`, `package.json`, `craco.config.js`, `tailwind.config.js`, `components.json`, `postcss.config.js`, `jsconfig.json`, `plugins/`, `.env`) was hoisted to the repo root. There is now one npm package at the root — no nested `frontend/package.json`. All path references in docs, agent files, and the Playwright E2E config were rewritten (`../frontend/...` → `../...`, `frontend/xxx` → `xxx`). The Vercel project's **Root Directory** setting was flipped from `frontend` to `.` (repo root) by the user before this commit so deploys keep working. `.gitignore` was rewritten to un-prefix the CRA build/cache patterns.
- Affects: all agents
- Impact: Local dev commands lose the `cd frontend` prefix — `npm install --legacy-peer-deps` and `npm start` run at repo root. `npm run build` writes `build/` at repo root. Playwright's `webServer.command` in [e2e/playwright.config.js](../e2e/playwright.config.js) is now `npm start --prefix ..` (was `--prefix ../frontend`). The E2E test-id re-export in [e2e/utils/testIds.js](../e2e/utils/testIds.js) points at `../../src/constants/testIds/index.js` (was `../../frontend/src/constants/testIds/index.js`) — a runtime import, breaks E2E if reverted. Every doc link that was `[X](frontend/…)` or `[X](../frontend/…)` is now `[X](…)` / `[X](../…)`. Historical entries under `test_result.md` still say `frontend/src/...` — those are dated log entries and are deliberately preserved, not rewritten. If you resurrect the FastAPI backend later, put it under a new `backend/` folder — do not recreate `frontend/`.
- Source: user said in chat on 2026-07-21 ("Don't you think the project structure is too bad here?" → "I think we should remove frontend also - and keep the content only at root") + confirmed Vercel Root Directory change + executed staged flatten (git mv sweeps of `public/`, `plugins/`, `src/`, plus 9 config files at root).

### 2026-07-21 — Google Analytics 4 installed inline (gtag `G-2GWDGQ115Q`)
- Category: integration
- Fact: GA4 gtag snippet is hardcoded inline in [public/index.html](../public/index.html), placed immediately after `<head>` per Google's install instructions. Property id `G-2GWDGQ115Q`. The `<script async>` loader + config live in the HTML so pageviews fire before React mounts. All named events flow through [src/lib/analytics.js](../src/lib/analytics.js) `trackEvent(name, params)`, which fans out to `window.posthog.capture`, `@vercel/analytics` `track`, `window.dataLayer.push`, AND `window.gtag('event', ...)` — GA4 receives every named event automatically without per-call wiring.
- Affects: Frontend + SEO Auditor + QA
- Impact: The site now has FOUR analytics stacks running simultaneously: PostHog (inline autocapture), Vercel Analytics (`<Analytics />` from App.js), GA4 (this entry), and optional GTM (dormant unless `REACT_APP_GTM_ID` is set). Ad-blockers (~30% of Indian traffic) will block `googletagmanager.com` — PostHog + Vercel Analytics remain the reliable fallbacks. When rotating the GA4 property, BOTH `src="...id=G-..."` and `gtag('config', 'G-...')` in index.html must be updated together. Playwright specs may need to stub or ignore `googletagmanager.com` requests to keep the network graph clean. When a Consent-Mode / cookie banner ships, GA4 must be gated on user consent (currently fires unconditionally — accepted trade-off pre-launch).
- Source: user pasted the GA4 install snippet in chat on 2026-07-21 ("Also, I got this from Google Analytics ... Copy and paste it in the code of every page of your website, immediately after the `<head>` element").

### 2026-07-20 — Playwright `networkidle` never resolves (Lenis rAF loop)
- Category: workaround
- Fact: `page.waitForLoadState('networkidle')` never resolves on this app because the Lenis smooth-scroll wrapper in [src/App.js](../src/App.js) runs a permanent `requestAnimationFrame` loop that keeps the browser event queue busy. Use `'domcontentloaded'`, `'load'`, or explicit locator waits (`await expect(locator).toBeVisible()`, `.toBeInViewport()`) in every Playwright spec.
- Affects: QA (E2E)
- Impact: All specs under [e2e/tests/](../e2e/tests/) use `page.goto('/', { waitUntil: 'domcontentloaded' })` and locator-based waits. The [e2e/playwright.config.js](../e2e/playwright.config.js) header comment restates this. Every LeadForm submit spec also installs the Google Form `page.route` stub from [e2e/utils/gfStub.js](../e2e/utils/gfStub.js) so no real submission ever reaches the production Sheet.
- Source: prior test agent report in [test_reports/iteration_1.json](../test_reports/iteration_1.json) (`critical_code_review_comments[3]`), reconfirmed by user on 2026-07-20 when installing Playwright and expanding the QA agent to own E2E.

### 2026-07-19 — Backend removed entirely; frontend posts directly to Google Form
- Category: product-decision
- Fact: The FastAPI backend has been deleted. `POST /api/leads` no longer exists — the React lead form POSTs directly to `GOOGLE_FORM_ACTION_URL` from the browser using `fetch(..., { mode: 'no-cors', body: FormData })`. The `/api/brochure` PDF endpoint is gone; the download button points to a static file at `public/apexoria-brochure.pdf` (user will upload the actual PDF post-Vercel-deploy). `/api/config` is gone. Vercel deploys the whole project as a static site with zero Python surface.
- Affects: Frontend + QA + all agents
- Impact: Reverses AGENTS.md rules §2 (anti-spam trio now enforced client-side: honeypot check + 2s time-trap + 12s `localStorage` cooldown — all bypassable by any bot that skips the JS), §3 (no server-side GF forward), and §11 (no `/api` prefix, no CORS config, no backend routes). The `backend/**` tree ownership row is removed from the file-tree table. The Backend specialist agent still exists in `.github/agents/backend.agent.md` but has no code to own on this project until a real backend is reintroduced. Google Form URL + entry IDs are visible in the JS bundle at build time via `REACT_APP_GF_*` env vars — user explicitly accepted this trade-off on 2026-07-19. Local dev now needs only Node + npm; no Python venv, no MongoDB.
- Source: user said in chat on 2026-07-19 ("Let's delete the python and things associated with it so that it will be simple for vercel to get it deployed") + confirmed proceed on the destructive `Remove-Item -Recurse -Force backend/` step.
- Supersedes: 2026-07-19 — Backend: MongoDB removed, Google Form is the sole store (the MongoDB entry stays historically true, but the whole backend has now been deleted rather than just Mongo).

### 2026-07-19 — Backend: MongoDB removed, Google Form is the sole store
- Category: product-decision
- Fact: Backend no longer persists leads to MongoDB. `POST /api/leads` validates + runs the anti-spam trio + forwards to Google Form and returns. `GET /api/leads` is removed. On Google Form failure the endpoint returns HTTP 502 (no server-side fallback) and the frontend's existing WhatsApp CTA in [LeadForm.jsx](../src/components/site/LeadForm.jsx#L64) becomes the recovery path.
- Affects: Backend + QA
- Impact: Reverses AGENTS.md §3 (now promoted — rule §3 rewritten, Stack + Data tables updated, dev-commands MongoDB note removed). Motor and pymongo dropped from `backend/requirements.txt`. `MONGO_URL` and `DB_NAME` removed from `backend/.env`. Local dev no longer needs MongoDB — just Python + the Google Form env vars. Backend can now be deployed on any stateless host (Render, Railway, Fly.io, Koyeb, or even Vercel Python functions since there is no persistent connection).
- Source: user said in chat on 2026-07-19 ("We can completely remove the mongo db part... If google form is working fine I don't think there is a need of anything else right now")

_No older entries yet._
