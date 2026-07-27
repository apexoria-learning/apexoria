#!/usr/bin/env node
/**
 * Post-build script — stamp today's date into every <lastmod> tag in the
 * built sitemap (build/sitemap.xml). Runs automatically after `npm run build`
 * via the `postbuild` npm script.
 *
 * Rationale: Sprint 1 (P15) bumped the sitemap lastmod manually. That decays
 * the moment we ship new content without remembering to touch the file.
 * Automating it here means every production build published to Vercel gets an
 * accurate <lastmod> without a human step.
 *
 * Kept intentionally dependency-free — Node's built-in fs is all we need.
 */

const fs = require("fs");
const path = require("path");

const sitemapPath = path.join(__dirname, "..", "build", "sitemap.xml");

if (!fs.existsSync(sitemapPath)) {
  // Not an error — some builds (e.g. `npm test`) never produce build/. Skip.
  console.log("[postbuild] build/sitemap.xml not found; skipping lastmod stamp.");
  process.exit(0);
}

// YYYY-MM-DD in UTC (W3C Datetime, sitemap-friendly)
const today = new Date().toISOString().slice(0, 10);

const original = fs.readFileSync(sitemapPath, "utf8");
const updated = original.replace(
  /<lastmod>[^<]*<\/lastmod>/g,
  `<lastmod>${today}</lastmod>`
);

if (original === updated) {
  console.log(`[postbuild] sitemap already stamped ${today}; no change.`);
} else {
  fs.writeFileSync(sitemapPath, updated, "utf8");
  const count = (original.match(/<lastmod>/g) || []).length;
  console.log(`[postbuild] stamped ${count} <lastmod> tag(s) with ${today}.`);
}
