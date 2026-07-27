// Vercel Serverless Function — /api/cms/commit
// Verifies a Firebase ID token and commits a file to GitHub.
// GITHUB PAT lives ONLY in Vercel env vars, never in the browser.

import { importX509, jwtVerify } from "jose";

const GOOGLE_PUBLIC_KEYS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

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
    GITHUB_BRANCH = "main",
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
  const { path: filePath, content: newContent, message } = body;
  if (!filePath || typeof newContent !== "string") {
    return json(res, 400, { error: "path and content are required." });
  }
  if (!/^(src|public)\//.test(filePath)) {
    return json(res, 400, { error: "path must be within src/ or public/." });
  }

  const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "apexoria-cms",
  };

  let sha;
  try {
    const getRes = await fetch(
      `${apiBase}/contents/${encodeURIComponent(filePath)}?ref=${GITHUB_BRANCH}`,
      { headers: ghHeaders }
    );
    if (getRes.ok) {
      const meta = await getRes.json();
      sha = meta.sha;
    } else if (getRes.status !== 404) {
      const txt = await getRes.text();
      return json(res, 500, { error: `GitHub GET failed: ${getRes.status} ${txt}` });
    }
  } catch (e) {
    return json(res, 500, { error: `GitHub GET error: ${e.message}` });
  }

  const b64 = Buffer.from(newContent, "utf8").toString("base64");
  const commitMessage = message || `chore(cms): update ${filePath} by ${email}`;

  const putBody = {
    message: commitMessage,
    content: b64,
    branch: GITHUB_BRANCH,
    committer: { name: "Apexoria CMS", email: "cms@apexorialearning.in" },
    author: { name: claims.name || email, email },
    ...(sha ? { sha } : {}),
  };

  try {
    const putRes = await fetch(`${apiBase}/contents/${encodeURIComponent(filePath)}`, {
      method: "PUT",
      headers: { ...ghHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(putBody),
    });
    const data = await putRes.json();
    if (!putRes.ok) {
      return json(res, 500, { error: `GitHub PUT failed: ${putRes.status} ${data.message || ""}` });
    }
    return json(res, 200, {
      ok: true,
      commit: data.commit ? { sha: data.commit.sha, url: data.commit.html_url } : null,
      content: data.content ? { path: data.content.path, sha: data.content.sha } : null,
    });
  } catch (e) {
    return json(res, 500, { error: `GitHub PUT error: ${e.message}` });
  }
}
