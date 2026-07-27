#!/usr/bin/env node
/**
 * convert-images.js
 *
 * One-time script: converts the raw JPEGs in public/images/src/ into the
 * responsive WebP + JPEG variants that Hero.jsx / LeadForm.jsx / etc.
 * consume via <picture>. Also outputs "final" (max-width) copies at the
 * top-level public/images/ path.
 *
 * Not wired into the build — image assets are checked into git after this
 * runs once. Re-run manually when swapping source images.
 */

const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const SRC_DIR = path.resolve(__dirname, "..", "public", "images", "src");
const OUT_DIR = path.resolve(__dirname, "..", "public", "images");

// Filename stem → { widths, hasResponsive }. hasResponsive=false means only
// output the canonical width (no `-<w>w` variants).
const TARGETS = [
  { stem: "hero-abstract", widths: [640, 940, 1280], canonical: 940 },
  { stem: "student-1",     widths: [400],            canonical: 400 },
  { stem: "student-2",     widths: [640, 940],       canonical: 940 },
  { stem: "team",          widths: [400],            canonical: 400 },
];

async function processOne(target) {
  const src = path.join(SRC_DIR, `${target.stem}.jpg`);
  if (!fs.existsSync(src)) {
    console.warn(`[skip] ${src} missing`);
    return;
  }
  const meta = await sharp(src).metadata();
  console.log(`[${target.stem}] source ${meta.width}x${meta.height} (${(fs.statSync(src).size / 1024).toFixed(1)} KB)`);

  for (const w of target.widths) {
    const isCanonical = w === target.canonical;
    const jpgName = isCanonical ? `${target.stem}.jpg`  : `${target.stem}-${w}w.jpg`;
    const webpName = isCanonical ? `${target.stem}.webp` : `${target.stem}-${w}w.webp`;

    await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(OUT_DIR, jpgName));

    await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(OUT_DIR, webpName));

    const jpgSize = fs.statSync(path.join(OUT_DIR, jpgName)).size;
    const webpSize = fs.statSync(path.join(OUT_DIR, webpName)).size;
    console.log(`  ${w}w  jpg ${(jpgSize / 1024).toFixed(1)} KB  webp ${(webpSize / 1024).toFixed(1)} KB`);
  }
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const t of TARGETS) {
    await processOne(t);
  }
  console.log("\n[done] converted images written to public/images/");
}

main().catch((err) => {
  console.error("[convert-images] failed:", err);
  process.exit(1);
});
