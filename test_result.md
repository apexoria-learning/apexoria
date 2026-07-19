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
    working: "NA"
    file: "frontend/src/components/site/LeadForm.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Per user decision on 2026-07-19 (see GOTCHAS.md top entry) the FastAPI backend was deleted. Frontend agent rewrote LeadForm.jsx: removed axios + REACT_APP_BACKEND_URL, added seven REACT_APP_GF_* env vars, POST to Google Form via fetch(mode:'no-cors', FormData), client-side honeypot silent-drop + 2s time-trap silent-drop + 12s localStorage cooldown, and course/batch mapping helpers matching the deleted server.py mappings exactly. QA must verify: (1) valid submit lands a row in the Google Sheet, (2) honeypot fill shows fake success and no GF row appears, (3) submit before 2s shows fake success and no GF row appears, (4) rapid resubmit within 12s shows the cooldown toast, (5) invalid phone/email shows inline errors and does not POST, (6) all existing data-testid attributes still present."

  - task: "Brochure download uses static /apexoria-brochure.pdf with 404 fallback"
    implemented: true
    working: "NA"
    file: "frontend/src/data.js, frontend/src/components/site/FeaturedCourse.jsx, frontend/src/components/site/Footer.jsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "main"
          comment: "BROCHURE_URL in data.js flipped to '/apexoria-brochure.pdf'. FeaturedCourse and Footer converted the brochure anchors to buttons with a HEAD-check click handler: if the static PDF is missing (404) show toast.info('Brochure download will be available shortly...'), else trigger the download. The actual PDF file is intentionally NOT in frontend/public/ yet — user will drop it in post-Vercel-deploy. QA should verify the toast fires on 404 and downloads work when the file exists (simulate by placing any PDF at frontend/public/apexoria-brochure.pdf)."

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
  version: "2.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus:
    - "Lead form posts directly to Google Form (no backend)"
    - "Brochure download uses static /apexoria-brochure.pdf with 404 fallback"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: "Major refactor 2026-07-19: FastAPI backend deleted entirely. AGENTS.md rules §2/§3/§11 promoted, new GOTCHAS entry logged. Frontend agent rewrote LeadForm.jsx to POST directly to Google Form (no-cors FormData), enforced honeypot + 2s time-trap + 12s localStorage cooldown client-side, added HEAD-check brochure fallback in FeaturedCourse and Footer. Env swapped from REACT_APP_BACKEND_URL to seven REACT_APP_GF_* vars. Two frontend tasks need QA retesting (see current_focus). Preview-host asset URLs in index.html still open — separate task, not blocking a Vercel deploy."
    - agent: "main"
      message: "Prior infra chore: rewrote root .gitignore, added frontend/.env.local pointing at http://localhost:8000. Concerns still open post-refactor: (a) preview-CDN URLs hardcoded in frontend/public/index.html + frontend/src/data.js — Frontend agent follow-up; (b) CORS_ORIGINS='*' + allow_credentials=True must be tightened before any real Vercel origin is add
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: "Infra chore only this turn: (1) rewrote root .gitignore with full Python + Node + env + IDE + OS + .emergent/ coverage; (2) added frontend/.env.local pointing at http://localhost:8000 for local dev. No product code touched, so QA not invoked. Open concerns pending user decision: (a) Vercel serverless is not a good target for the current FastAPI + Motor + Mongo + reportlab backend — recommend deploying backend on Render/Railway/Fly.io/Koyeb; (b) 7 hardcoded preview-CDN asset URLs still live in frontend/public/index.html and frontend/src/data.js; (c) backend CORS_ORIGINS='*' + allow_credentials=True is spec-invalid once a real Vercel origin is used."
