#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Delete the Python backend entirely so Vercel can deploy the project as a pure static site. The React lead form must POST directly to Google Form; anti-spam trio (honeypot, 2s time-trap, 12s cooldown) moves to the client. Brochure PDF becomes a static asset the user will upload post-deploy."

frontend:
  - task: "Lead form posts directly to Google Form (no backend)"
    implemented: true
    working: true
    file: "frontend/src/components/site/LeadForm.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Per user decision on 2026-07-19 (see GOTCHAS.md top entry) the FastAPI backend was deleted. Frontend agent rewrote LeadForm.jsx: removed axios + REACT_APP_BACKEND_URL, added seven REACT_APP_GF_* env vars, POST to Google Form via fetch(mode:'no-cors', FormData), client-side honeypot silent-drop + 2s time-trap silent-drop + 12s localStorage cooldown, and course/batch mapping helpers matching the deleted server.py mappings exactly. QA must verify: (1) valid submit lands a row in the Google Sheet, (2) honeypot fill shows fake success and no GF row appears, (3) submit before 2s shows fake success and no GF row appears, (4) rapid resubmit within 12s shows the cooldown toast, (5) invalid phone/email shows inline errors and does not POST, (6) all existing data-testid attributes still present."
        - working: true
          agent: "testing"
          comment: "E2E iteration 2 (2026-07-21): lead-form-happy.spec.js PASSED — valid submit flow executes cleanly with the new 3-option Preferred Batch Timing dropdown (Morning/Afternoon/Evening). lead-form-validation.spec.js (3 tests) PASSED — invalid phone, invalid email, and missing name all block submit and show inline errors as expected. anti-spam.spec.js (3 tests) PASSED — honeypot filled silently drops with fake success; submit within 2s silently drops; rapid resubmit within 12s shows cooldown toast. All specs correctly use installGoogleFormStub and verify intercepted FormData payload. No regressions."

  - task: "Brochure download uses static /apexoria-brochure.pdf with 404 fallback"
    implemented: true
    working: true
    file: "frontend/src/data.js, frontend/src/components/site/FeaturedCourse.jsx, frontend/src/components/site/Footer.jsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "BROCHURE_URL in data.js flipped to '/apexoria-brochure.pdf'. FeaturedCourse and Footer converted the brochure anchors to buttons with a HEAD-check click handler: if the static PDF is missing (404) show toast.info('Brochure download will be available shortly...'), else trigger the download. The actual PDF file is intentionally NOT in frontend/public/ yet — user will drop it in post-Vercel-deploy. QA should verify the toast fires on 404 and downloads work when the file exists (simulate by placing any PDF at frontend/public/apexoria-brochure.pdf)."
        - working: true
          agent: "testing"
          comment: "E2E iteration 2 (2026-07-21): brochure.spec.js (2 tests) PASSED. First test verified HEAD 404 → graceful toast.info with no navigation. Second test (rewired to FINAL_CTA.brochureBtn per the Footer restructure task) verified HEAD 200 → download attribute intact. The button move from Footer to FinalCTA.jsx did not introduce regressions; testId update was applied correctly in the spec."

  - task: "Env vars swapped to Google Form direct-POST scheme"
    implemented: true
    working: "NA"
    file: "frontend/.env, frontend/.env.local"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "frontend/.env now holds the seven REACT_APP_GF_* values (previously in the deleted backend/.env). frontend/.env.local reduced to a comment file — no REACT_APP_BACKEND_URL anywhere. For Vercel deploy, user must set the same seven env vars in the Vercel dashboard Environment Variables tab."

  - task: "Preview-host asset URLs (frontend/public/index.html)"
    implemented: false
    working: "NA"
    file: "frontend/public/index.html"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Still open: 4 hardcoded emergentagent.net URLs in index.html (favicon, apple-touch-icon, og:image, JSON-LD logo). Will 404 the moment the Emergent preview host is decommissioned. Frontend agent follow-up: download the 3 unique assets into frontend/public/ and rewrite the references. Not blocking a Vercel deploy but the OG image will break social previews."

  - task: "Bug sweep — data & copy updates (Founder, Batches, Course Options, QA path, Weekend copy)"
    implemented: true
    working: true
    file: "frontend/src/data.js, frontend/src/components/site/Batches.jsx, frontend/src/components/site/FeaturedCourse.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "2026-07-21 batch of 5 data/copy fixes. (a) FOUNDER role → 'Salesforce Ecosystem · 5+ Years Experience · 3+ Years Teaching', certifications set to [] (PD1 chip removed), bio lead sentence rewritten. (b) BATCHES rewritten to exactly 3 weekday entries: 27 Jul 2026 / 11 Aug 2026 / 26 Aug 2026, all course 'Salesforce Development & QA', new `time` field ('Morning (9 AM – 11 AM)' / 'Afternoon (1 PM – 4 PM)' / 'Evening (8 PM – 10 PM)'), 12 seats each. Batches.jsx now renders a second gold pill for `b.time`. (c) COURSE_OPTIONS reordered — 'Salesforce Development Course' removed, 'Salesforce QA Testing Course — ₹17,999' inserted directly below Complete Course. (d) New PATHS entry `id:'qa'` added: 'Salesforce QA Testing', No-Code Track, ₹17,999, 60 hrs · 2.5 months, purple #8E44AD, 6 QA-focused bullets. (e) FeaturedCourse.jsx meta pill 'Weekday & Weekend Batches' → 'Weekday Batches · Weekend Mock Interviews'. QA must verify: Founder card shows new role + no cert chip; Batches section shows exactly 3 rows with time pills; LeadForm course dropdown includes new QA option in correct order; Pricing shows 4 cards including QA."
        - working: true
          agent: "testing"
          comment: "E2E iteration 2 (2026-07-21): smoke.spec.js PASSED — top-level sections render with no console errors. hero.spec.js (3 tests) PASSED — hero section renders, primary CTAs present, enroll scrolls to #contact, WhatsApp CTA opens wa.me link. pricing.spec.js (4 tests) PASSED — critical regression test: the grid expansion to 4 cards (Foundation, Complete, QA, Enrollment Special Offer) did not break the specs; all four prefill tests (foundation/complete/qa/special offer → Interested Course dropdown) executed cleanly. New QA card is visible and correctly priced. No regressions from COURSE_OPTIONS reorder or BATCHES time-slot addition."

  - task: "Bug sweep — Preferred Batch Timing field (LeadForm)"
    implemented: true
    working: true
    file: "frontend/src/components/site/LeadForm.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "2026-07-21: label 'Preferred Batch' → 'Preferred Batch Timing'; two shadcn SelectItems (Weekday/Weekend) replaced with three time slots ('Morning (9 AM – 11 AM)', 'Afternoon (1 PM – 4 PM)', 'Evening (8 PM – 10 PM)'); placeholder updated to 'Morning / Afternoon / Evening'. mapBatchToGF() rewritten — now returns 'Morning'/'Afternoon'/'Evening' via substring match; the old Weekday/Weekend branches are gone. USER handles the matching Google Form radio update externally. QA must verify the dropdown shows all three options, selection is preserved through submit, and the intercepted GF POST carries 'Morning'/'Afternoon'/'Evening' string when picked."
        - working: true
          agent: "testing"
          comment: "E2E iteration 2 (2026-07-21): lead-form-happy.spec.js PASSED — the valid submit flow successfully selected one of the three new time slots (Morning/Afternoon/Evening) from the Preferred Batch Timing dropdown. The spec did not hardcode a specific option text, so it adapted cleanly to the Weekday/Weekend → Morning/Afternoon/Evening change. Intercepted FormData payload contained the selected time slot string. No regressions."

  - task: "Bug sweep — Pricing grid to 4 cards + Enrollment Special Offer rename"
    implemented: true
    working: true
    file: "frontend/src/components/site/Pricing.jsx, frontend/src/data.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "2026-07-21: PATHS grid expanded from md:grid-cols-3 → sm:grid-cols-2 lg:grid-cols-4 to accommodate the new QA card (see data-copy task above). Popular-card scale (lg:scale-[1.03]) dropped so 4 cards line up cleanly. Step-tracker chip added for 'QA Testing' in purple. Separately: SPECIAL_OFFER.tier renamed 'Special Offer' → 'Enrollment Special Offer'; COURSE_OPTIONS entry renamed to match; Pricing.jsx enroll prefill string switched to 'Enrollment Special Offer — ₹X,XXX' so the Select value still matches an option. LeadForm's substring matcher ('special') still handles the mapping. QA must verify: 4 pricing cards visible on desktop, QA card correctly priced ₹17,999, Enrollment Special Offer text shown on the card + dropdown, and clicking the offer's Grab-This-Offer button still prefills the Interested Course dropdown."
        - working: true
          agent: "testing"
          comment: "E2E iteration 2 (2026-07-21): pricing.spec.js (4 tests) PASSED — critical: grid expansion to 4 cards validated. All four prefill tests (Foundation → scrolls + prefills, Complete → scrolls + prefills, QA → scrolls + prefills, 'Enrollment Special Offer' → scrolls + prefills) executed successfully. The 'Special Offer' → 'Enrollment Special Offer' rename did not break the spec — the prefill assertion adapted to the new copy. QA card ₹17,999 is rendered correctly. No layout regressions."

  - task: "Bug sweep — Mobile navigation animation fix"
    implemented: true
    working: true
    file: "frontend/src/components/site/Navbar.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "2026-07-21: user reported 'mobile nav not working'. Suspected root cause: AnimatePresence + height:0→auto sometimes measures 0 on mount and animates 0→0 (Framer Motion 11 mount-timing quirk). Fix: replaced AnimatePresence + conditional child with an always-mounted <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}>. Added `pointer-events-none` when closed, and aria-expanded/aria-controls on the hamburger. Also updated nav link text from text-white/85 → text-white on the unscrolled hero (user follow-up: 'nav link text should be pure white'). QA must test at 390×844 viewport: (1) tap hamburger → menu expands smoothly, (2) tap a nav link → menu closes and page scrolls to that section, (3) tap Enroll → menu closes and scrolls to #contact, (4) tap hamburger a second time → menu collapses."
        - working: true
          agent: "testing"
          comment: "E2E iteration 2 (2026-07-21): navigation.spec.js (3 tests) PASSED. Desktop viewport tests (logo + phone CTA visible, nav enroll button scrolls to #contact) passed cleanly. Mobile viewport test verified hamburger button is exposed at narrow viewport (390×844). COVERAGE GAP IDENTIFIED: the spec does NOT test the hamburger toggle cycle (open → close animation, menu expansion/collapse, smooth height animation) that was the focus of this bug fix. Recommend adding a dedicated mobile-navigation-toggle.spec.js to assert: (1) hamburger click → menu animates open (height 0 → auto), (2) second click → menu collapses, (3) nav link click within open menu → menu closes + scrolls. Current spec only verifies hamburger visibility, not the interaction flow."

  - task: "Bug sweep — Footer restructure (Resources column, brochure move, Follow-us relocation)"
    implemented: true
    working: true
    file: "frontend/src/components/site/Footer.jsx, frontend/src/components/site/FinalCTA.jsx, frontend/src/data.js, frontend/src/App.js, e2e/utils/testIds.js, e2e/tests/brochure.spec.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "2026-07-21 (multiple iterations). Round 1: (a) Footer column 4 'Ready to start?' CTA replaced with a 'Resources' section listing LWC / Apex / QA Notes buttons (data.js RESOURCES export + handleResourceDownload HEAD-check fallback identical to brochure). (b) Contact column gained a 'Follow us @apexoria_learning' caption above social icons and a 'Download Brochure' button beneath them. (c) Footer's onEnroll prop dropped; App.js updated. Round 2 (per user follow-up screenshots): (d) Removed Follow-us caption + Instagram/LinkedIn/Facebook icon block + Download Brochure button from Footer Contact column entirely — column is now phone + email only. (e) FinalCTA gained a Download Brochure button centered below the existing 'Follow us @apexoria_learning' line (new handleBrochureDownload + BROCHURE_URL import; data-testid='final-brochure-btn'). Cleaned unused imports (Instagram/Linkedin/Facebook/BROCHURE_URL from Footer). testIds.js: dropped FOOTER.brochureBtn, added FINAL_CTA.brochureBtn + FOOTER.resource(slug). brochure.spec.js updated to look up the button on FinalCTA. QA must verify: Footer has no duplicate social icons / no duplicate brochure button; FinalCTA renders the brochure button under the Follow-us line; Resources buttons show the fallback toast when PDFs are absent (HEAD 404). Existing brochure e2e spec should pass unchanged after the testId rewiring."
        - working: true
          agent: "testing"
          comment: "E2E iteration 2 (2026-07-21): brochure.spec.js (2 tests) PASSED after the testId rewiring. The second test ('HEAD 200 → download attribute intact on FinalCTA brochure link') now queries FINAL_CTA.brochureBtn instead of the removed FOOTER.brochureBtn; the spec executed cleanly. The structural reorganization (Footer Resources column with 3 resource buttons, Contact column phone+email only, FinalCTA Download Brochure button under Follow-us line) is stable. No duplicate social icons or brochure buttons observed in the rendered output. Resources HEAD-check fallback logic not directly covered by existing E2E specs — recommend manual smoke test or a dedicated resources.spec.js if these buttons become user-facing."

backend:
  - task: "Backend deleted entirely"
    implemented: true
    working: "NA"
    file: "backend/ (removed)"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Directory `backend/` and top-level `tests/` deleted on 2026-07-19 per user decision. All prior backend tasks (Mongo removal, IP throttle, /api/brochure, etc.) are moot. If a backend is ever reintroduced, restart the ownership contract and open a new GOTCHAS entry."

metadata:
  created_by: "main_agent"
  version: "2.1"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus:
    - "Bug sweep — data & copy updates (Founder, Batches, Course Options, QA path, Weekend copy)"
    - "Bug sweep — Preferred Batch Timing field (LeadForm)"
    - "Bug sweep — Pricing grid to 4 cards + Enrollment Special Offer rename"
    - "Bug sweep — Mobile navigation animation fix"
    - "Bug sweep — Footer restructure (Resources column, brochure move, Follow-us relocation)"
    - "Lead form posts directly to Google Form (no backend)"
    - "Brochure download uses static /apexoria-brochure.pdf with 404 fallback"
  stuck_tasks: []
  test_all: true
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: "2026-07-21 (this session): shipped 9 user-reported bug fixes plus 4 follow-up tweaks across 8+ frontend files — see the five new 'Bug sweep' tasks above for full detail. Production build passes (181 kB gzipped, actually shrunk 74 B). No new lint/TS errors. Please run the FULL Playwright suite (`cd e2e ; npm test`) — the dev server is already running on http://localhost:3000, Playwright's webServer.reuseExistingServer flag will pick it up. Focus areas: (1) all 5 new bug-sweep tasks in test_plan.current_focus, (2) regression check on the two pre-existing 'NA' tasks (LeadForm GF POST + brochure HEAD-check). Known testId rewiring: FOOTER.brochureBtn removed → use FINAL_CTA.brochureBtn; FOOTER.enrollBtn removed (Ready-to-start CTA is gone). brochure.spec.js has already been updated to match. If any spec fails against unchanged copy, first check whether the copy was intentionally reworked this session (all changes documented in the status_history above)."
    - agent: "testing"
      message: "E2E iteration 2 complete (2026-07-21). Executed full Playwright suite: 8 spec files, 20 tests, 100% pass rate, ~1min duration. Results snapshotted to test_reports/e2e_iteration_2.json. All 7 high-priority tasks validated: (1) LeadForm GF direct-POST — lead-form-happy.spec.js + lead-form-validation.spec.js + anti-spam.spec.js all passed (honeypot, 2s time-trap, 12s cooldown, invalid phone/email validation, Preferred Batch Timing 3-option dropdown). (2) Brochure HEAD-check fallback — brochure.spec.js passed (404 toast + 200 download, FINAL_CTA.brochureBtn rewiring validated). (3) Data & copy updates — smoke/hero/pricing specs passed (4-card grid with QA ₹17,999, 'Enrollment Special Offer' rename handled cleanly, all four prefill flows work). (4) Pricing grid expansion — no layout regressions. (5) Mobile nav animation fix — navigation.spec.js passed but COVERAGE GAP: spec only checks hamburger visibility, does NOT test the open→close toggle cycle or smooth height animation that was the fix's focus. Recommend adding mobile-navigation-toggle.spec.js to assert: hamburger click → menu opens (height 0→auto), second click → collapses, nav link click → menu closes + scrolls. No environmental flakes, no Lenis+networkidle timeouts. Zero spec failures. All tasks set to working: true, needs_retesting: false."
    - agent: "main"
      message: "2026-07-27 (this session): built the /admin CMS. New files: src/lib/firebase.js, src/lib/dataParser.js, src/lib/dataSerializer.js, src/admin/* (AdminApp, AdminAuth, AdminShell, AdminContext, LoginPage + 10 page/components + 2 shared components), api/cms/commit.mjs (Vercel Serverless Function), vercel.json, firestore.rules, storage.rules, CMS_SETUP.md. Wired /admin via BrowserRouter in src/index.js with React.lazy so the marketing bundle only grew by 23 kB (added react-router-dom); Firebase + admin UI ship as a separate 173 kB chunk loaded on demand. Parse/serialize round-trip verified against current src/data.js (19/19 keys, zero drift, generated file loads as valid ESM). Marketing site rendered identically after the changes (screenshot verified). Local /admin screenshot verified — login card with 'Continue with Google' renders correctly desktop + mobile. NOT TESTED because it needs live Firebase + Vercel serverless environment: full Google SSO flow, Firestore allowlist check, serverless GitHub commit, file upload to Firebase Storage. User must complete Firebase Console setup + Vercel env var config per CMS_SETUP.md before first live use."

