// Vercel Serverless Function — /api/cms/upload-asset
// Uploads a binary file (PDF / image) from the CMS admin panel to GitHub.
// Files land under public/uploads/{folder}/{ts}-{safeName} and are served
// from the site's own domain via Vercel after the next auto-redeploy.
//
// Auth mirrors /api/cms/commit: Firebase ID token + ADMIN_EMAILS allowlist.
// GITHUB PAT lives ONLY in Vercel env vars, never in the browser.
//
// SIZE CAP: Vercel Hobby caps inbound request body at ~4.5 MB. We enforce a
// 3 MB decoded-file limit here (base64 adds ~33% overhead), matching the
// client-side pre-check in src/admin/components/FileUpload.jsx.

import { importX509, jwtVerify } from "jose";

const GOOGLE_PUBLIC_KEYS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

const MAX_DECODED_BYTES = 3 * 1024 * 1024; // 3 MB — Vercel Hobby body cap.
const FOLDER_RE = /^[a-zA-Z0-9][a-zA-Z0-9/_-]{0,63}$/;
const FILENAME_RE = /^[a-zA-Z0-9][\w.-]{0,99}$/;

let cachedKeys = null;
let cachedAt = 0;

async function getPublicKeys() {
  const now = Date.now();
  if (cachedKeys && now - cachedAt < 1000 * 60 * 30) return cachedKeys;
  const res = await fetch(GOOGLE_PUBLIC_KEYS_URL);
  if (!res.ok) throw new Error(`Failed to fetch Google public keys: ${res.status}`);
  cachedKeys = await res.json();
  cachedAt = now;
  return cachedKeys;
}

async function verifyFirebaseIdToken(idToken, projectId) {
  const [headerB64] = idToken.split(".");
  const header = JSON.parse(
    Buffer.from(headerB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
  );
  const kid = header.kid;
  const keys = await getPublicKeys();
  const pem = keys[kid];
  if (!pem) throw new Error("Unknown key ID in ID token.");
  const publicKey = await importX509(pem, "RS256");

  const { payload } = await jwtVerify(idToken, publicKey, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
    algorithms: ["RS256"],
  });
  return payload;
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function sanitizeFolder(raw) {
  if (typeof raw !== "string") return null;
  const trimmed = raw.replace(/^\/+|\/+$/g, "");
  if (!trimmed) return null;
  if (trimmed.includes("..")) return null;
  if (!FOLDER_RE.test(trimmed)) return null;
  return trimmed;
}

function sanitizeFilename(raw) {
  if (typeof raw !== "string") return null;
  // Replace path separators + any disallowed char with underscore, then validate.
  const safe = raw.replace(/[^\w.-]+/g, "_");
  if (!FILENAME_RE.test(safe)) return null;
  return safe;
}

export const config = {
  api: {
    bodyParser: { sizeLimit: "4.5mb" },
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return json(res, 200, { ok: true });
  if (req.method !== "POST") return json(res, 405, { error: "Method Not Allowed" });

  const {
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH = "feat/cms-integration",
    FIREBASE_PROJECT_ID,
    ADMIN_EMAILS,
  } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO || !FIREBASE_PROJECT_ID || !ADMIN_EMAILS) {
    return json(res, 500, {
      error:
        "Server misconfigured. Missing one of GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, FIREBASE_PROJECT_ID, ADMIN_EMAILS in Vercel env vars.",
    });
  }

  const allowlist = ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return json(res, 401, { error: "Missing Authorization Bearer token." });
  }
  const idToken = authHeader.slice("Bearer ".length);

  let claims;
  try {
    claims = await verifyFirebaseIdToken(idToken, FIREBASE_PROJECT_ID);
  } catch (e) {
    return json(res, 401, { error: `Invalid ID token: ${e.message}` });
  }
  const email = (claims.email || "").toLowerCase();
  if (!email || !allowlist.includes(email)) {
    return json(res, 403, { error: `Email ${email || "(none)"} is not an authorised admin.` });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== "object") body = {};

  const { folder, filename, contentBase64, contentType } = body;

  const safeFolder = sanitizeFolder(folder);
  if (!safeFolder) {
    return json(res, 400, {
      error: "Invalid folder. Use letters, digits, '_', '-', '/' only; no leading/trailing slash; no '..'.",
    });
  }
  const safeFilename = sanitizeFilename(filename);
  if (!safeFilename) {
    return json(res, 400, {
      error: "Invalid filename. Must start with a letter/digit and contain only [A-Za-z0-9._-].",
    });
  }
  if (typeof contentBase64 !== "string" || contentBase64.length === 0) {
    return json(res, 400, { error: "contentBase64 (base64 string) is required." });
  }

  // Validate + measure the decoded size.
  let decodedBytes;
  try {
    // Buffer.from with "base64" silently ignores invalid chars. Sanity-check first.
    if (!/^[A-Za-z0-9+/=\r\n]+$/.test(contentBase64)) {
      throw new Error("payload contains non-base64 characters");
    }
    decodedBytes = Buffer.from(contentBase64, "base64").length;
  } catch (e) {
    return json(res, 400, { error: `contentBase64 is not valid base64: ${e.message}` });
  }
  if (decodedBytes === 0) {
    return json(res, 400, { error: "Uploaded file is empty." });
  }
  if (decodedBytes > MAX_DECODED_BYTES) {
    return json(res, 413, {
      error: `File is ${(decodedBytes / 1024 / 1024).toFixed(2)} MB. Maximum allowed is 3 MB (Vercel Hobby request-body limit). Please compress the file and try again.`,
    });
  }

  const ts = Date.now();
  const filePath = `public/uploads/${safeFolder}/${ts}-${safeFilename}`;
  const publicUrl = `/uploads/${safeFolder}/${ts}-${safeFilename}`;

  const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "apexoria-cms",
  };

  // With a millisecond timestamp prefix, collisions are effectively impossible,
  // but we still handle a rare 422 by returning a clear error rather than
  // silently overwriting an existing file.
  const commitMessage = `chore(cms): upload ${safeFilename} to ${safeFolder} by ${email}`;
  const putBody = {
    message: commitMessage,
    content: contentBase64.replace(/[\r\n]+/g, ""),
    branch: GITHUB_BRANCH,
    committer: { name: "Apexoria CMS", email: "cms@apexorialearning.in" },
    author: { name: claims.name || email, email },
  };

  try {
    const putRes = await fetch(`${apiBase}/contents/${encodeURIComponent(filePath)}`, {
      method: "PUT",
      headers: { ...ghHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(putBody),
    });
    const data = await putRes.json();
    if (!putRes.ok) {
      return json(res, 502, {
        error: `GitHub PUT failed: ${putRes.status} ${data.message || "unknown"}`,
      });
    }
    return json(res, 200, {
      ok: true,
      url: publicUrl,
      path: filePath,
      contentType: typeof contentType === "string" ? contentType : null,
      size: decodedBytes,
      commit: data.commit ? { sha: data.commit.sha, url: data.commit.html_url } : null,
      content: data.content ? { path: data.content.path, sha: data.content.sha } : null,
    });
  } catch (e) {
    return json(res, 502, { error: `GitHub PUT error: ${e.message}` });
  }
}
