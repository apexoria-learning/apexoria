# Apexoria CMS — Setup Guide

A tiny admin panel at **/admin** that lets approved team members edit `src/data.js` and upload files, with changes auto-committed to GitHub → auto-deployed by Vercel.

## Architecture

```
apexorialearning.in/admin
  ├─ Firebase Auth (Google SSO) — login only
  ├─ Firestore /admins/{email} allowlist
  └─ POST /api/cms/commit         → commits src/data.js to GitHub
     POST /api/cms/upload-asset   → commits binary uploads to public/uploads/
        └─ Both verify Firebase ID token + ADMIN_EMAILS allowlist
        └─ Both push to GitHub → Vercel auto-redeploy
```

Firebase is used for **auth only**. All file storage — PDFs, images, brochures,
study notes — lives in this GitHub repo under `public/uploads/`. No Firebase
Storage bucket or Google Cloud Storage is used.

## First-time setup (~10 minutes)

### 1. Firebase Console

In your `apexorialearningcms` project:

- **Authentication → Sign-in method** → Google → **Enable** → set support email → Save
- **Authentication → Settings → Authorized domains** → Add `apexorialearning.in`, `www.apexorialearning.in` (keep `localhost` for testing)
- **Firestore Database → Create database** → Production mode → `asia-south1` (Mumbai) region
- **Firestore → Rules** → paste contents of `firestore.rules` from the repo → Publish

> Firebase **Storage** is no longer used. If you previously enabled it for this
> project you can leave the bucket in place (or delete it) — the CMS never
> touches it.

### 2. Seed the first admin (bootstrap)

Firestore rules require you to already be an admin to add other admins, so the very first admin must be added manually:

- **Firestore Database → Data → Start collection**
- Collection ID: `admins`
- Document ID: `apexorialearning@gmail.com` (must be lowercase, must match your Google account)
- Add a field `name` (string) = `"Apexoria Founder"` (optional; anything works)
- **Save**

Repeat for the other admin emails:
- `vikki.apexoria@gmail.com`
- `vishveshu143@gmail.com`

### 3. Vercel environment variables

In the Vercel dashboard for the `apexoria` project → **Settings → Environment Variables**, add:

| Name | Value | Scope |
|---|---|---|
| `GITHUB_TOKEN` | `github_pat_11CJEC6...` (the fine-grained PAT you generated) | Production + Preview |
| `GITHUB_OWNER` | `apexoria-learning` | Production + Preview |
| `GITHUB_REPO` | `apexoria` | Production + Preview |
| `GITHUB_BRANCH` | `main` | Production + Preview |
| `FIREBASE_PROJECT_ID` | `apexorialearningcms` | Production + Preview |
| `ADMIN_EMAILS` | `apexorialearning@gmail.com,vikki.apexoria@gmail.com,vishveshu143@gmail.com` | Production + Preview |

Also add the Firebase **web** config keys (same values as in `.env`) so they're baked into the built site:

| Name | Value |
|---|---|
| `REACT_APP_FIREBASE_API_KEY` | `AIzaSyCmh5fwBjBm-1tG2Tyu5V7PRsRJEhxoopI` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `apexorialearningcms.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | `apexorialearningcms` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `apexorialearningcms.firebasestorage.app` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `659226371563` |
| `REACT_APP_FIREBASE_APP_ID` | `1:659226371563:web:1a51eb8751c45c2d13a5ae` |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | `G-E4KWDWYNB2` |

### 4. Push & deploy

```bash
git push origin main
```

Vercel picks up the push and deploys. In ~45s, `/admin` is live.

## Using the CMS

1. Visit **https://apexorialearning.in/admin**
2. Click **Continue with Google** → sign in with an admin email
3. Edit any section from the sidebar
4. Click **Save changes** at the top-right — Vercel will redeploy in ~45s

**Sections available:**
- Contact & Socials (phone, email, WhatsApp link, Instagram, LinkedIn, Facebook, Google reviews)
- Founder (name, role, photo upload, bio, skills, certifications)
- Batches (add/edit/delete cohorts with time slot, seats)
- Pricing & Offers (4 tiers + Enrollment Special Offer + Course dropdown values)
- Curriculum (2 tracks × 2 courses each — chips, descriptions, highlights, per-course brochure PDF)
- Testimonials (add/remove student quotes)
- FAQ (add/reorder/edit)
- Downloads (main brochure upload + LWC/Apex/QA study notes uploads)
- Images (hero background, student photos, team photo — with uploads)
- Stats · Value Props · Extras (Why Apexoria manifesto + Placement steps + batch stats)

**Every save is a git commit** — full audit trail. Revert via GitHub if anything goes wrong.

## Media uploads (PDFs, images)

All admin uploads — brochure, per-course brochures, study notes, founder photo,
testimonial headshots, hero/team images — are committed to this repo under
`public/uploads/{folder}/{ts}-{filename}` and served from your own domain at
`/uploads/...`.

- **Size limit: 3 MB per file.** This is a hard cap enforced both in the browser
  and by `/api/cms/upload-asset`. It exists because Vercel's Hobby plan caps
  serverless-function request bodies at ~4.5 MB and base64 encoding adds ~33%
  overhead. Files above 3 MB will be rejected client-side before upload.
- **If your file is too large**, compress it first:
  - PDFs → [ilovepdf.com/compress_pdf](https://www.ilovepdf.com/compress_pdf)
    or [smallpdf.com/compress-pdf](https://smallpdf.com/compress-pdf)
  - Images → [squoosh.app](https://squoosh.app) (WebP at ~75% quality is usually
    well under 500 KB with no visible loss)
- **Availability**: uploaded files appear on the live site after the next Vercel
  redeploy (~45–60 s), same as content edits to `src/data.js`.
- **Old files stay in the repo.** When you upload a replacement, the previous
  file remains in `public/uploads/` — nothing is deleted automatically. If
  history bloat becomes a concern later, we can prune manually or move to Git
  LFS.

## Adding more admins later

Currently only Firestore Console works (a self-service admin page is on the roadmap). To add someone:

- Go to Firebase Console → Firestore → `admins` collection → Add document
- Document ID: `their-email@gmail.com` (lowercase)
- Save

Then update the `ADMIN_EMAILS` Vercel env var to include the new email, and redeploy.

## Security notes

- **GitHub PAT never touches the browser.** It sits only in Vercel env vars.
- **Firebase Auth** verifies the caller on every save via signed ID tokens.
- **Firestore rules + serverless function allowlist** = defense in depth. Even if someone bypasses the client-side check, the serverless function will reject them.
- Uploaded files land in `public/uploads/` and are publicly readable (they're
  linked from the live site), but only admins can commit them via
  `/api/cms/upload-asset`.

## Troubleshooting

- **"is not on the admin allowlist"** on sign-in → email not in Firestore `/admins`. Add it via the console.
- **"Server misconfigured. Missing..."** on save → Vercel env vars incomplete. Check the table above.
- **Save succeeded but changes don't show** → Vercel deploy in progress (~45s). Watch the Vercel dashboard for the new build. Hard-refresh once green.
- **"Invalid ID token"** → your session expired. Sign out and back in.
