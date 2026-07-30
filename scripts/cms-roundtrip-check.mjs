// Round-trip proof: parse today's src/data.js and re-serialize, then diff.
// Node runs this in ESM mode via package.json "type": "module" fallback — we
// use dynamic import + fileURL trick to load the .js parser/serializer under
// the CommonJS context Craco / CRA give us at build time.
//
// Run:  node scripts/cms-roundtrip-check.mjs
//
// Exits 0 on clean round-trip, 1 on drift.

import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const dataJsPath = path.join(repoRoot, "src", "data.js");
const parserPath = path.join(repoRoot, "src", "lib", "dataParser.js");
const serializerPath = path.join(repoRoot, "src", "lib", "dataSerializer.js");

const { parseDataSource } = await import(pathToFileURL(parserPath).href);
const { serializeContent } = await import(pathToFileURL(serializerPath).href);

const source = readFileSync(dataJsPath, "utf8");
const content = parseDataSource(source);

const expectedKeys = [
  "CONTACT", "WHATSAPP_LINK", "LOGO_URL", "SALESFORCE_LOGO", "BROCHURE_URL",
  "IMAGES", "VALUE_PROPS", "CURRICULUM_TRACKS", "PATHS", "SPECIAL_OFFER",
  "FOUNDER", "TESTIMONIALS", "GOOGLE_REVIEWS", "STATS", "BATCHES",
  "PLACEMENT_STEPS", "COURSE_OPTIONS", "RESOURCES", "LEGAL_PAGES", "FAQ_ITEMS",
];
const missing = expectedKeys.filter((k) => !(k in content));
if (missing.length) {
  console.error("[roundtrip] MISSING top-level keys after parse:", missing);
  process.exit(1);
}

const imageKeys = Object.keys(content.IMAGES || {});
console.log(`[roundtrip] top-level keys parsed: ${Object.keys(content).length}/${expectedKeys.length}`);
console.log(`[roundtrip] IMAGES sub-keys: ${imageKeys.length}  -> ${imageKeys.join(", ")}`);
console.log(`[roundtrip] LOGO_URL preserved: ${JSON.stringify(content.LOGO_URL)}`);
console.log(`[roundtrip] SALESFORCE_LOGO preserved: ${JSON.stringify(content.SALESFORCE_LOGO)}`);

const reSerialized = serializeContent(content);
// Round-trip the serialized version back through the parser to prove it produces
// the exact same content object (byte-identity of source is not our contract —
// value-identity is).
const contentB = parseDataSource(reSerialized);

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== "object") return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a).sort();
  const kb = Object.keys(b).sort();
  if (ka.length !== kb.length || ka.some((k, i) => k !== kb[i])) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}

let ok = true;
for (const k of expectedKeys) {
  if (!deepEqual(content[k], contentB[k])) {
    console.error(`[roundtrip] DRIFT on key ${k}`);
    ok = false;
  }
}
if (!ok) process.exit(1);
console.log("[roundtrip] ✅ value-identical round-trip on all 19 keys");
