# Test Credentials

This app has NO authentication. No login / admin credentials required.

- Public marketing site, static build only — the FastAPI backend was deleted 2026-07-19 (see [.github/GOTCHAS.md](../.github/GOTCHAS.md)).
- Lead form POSTs directly from the browser to a Google Form (`REACT_APP_GF_ACTION_URL` in `frontend/.env`, `mode: 'no-cors'`, `FormData` body). The linked Google Sheet is the only store; there is no admin surface.
- Brochure download hits the static asset `/apexoria-brochure.pdf` served from `frontend/public/`.
- To eyeball a real lead landing, use the Google Sheet linked from the Google Form owner's account. No app credentials are exchanged.
