// Convert a content JSON object into a valid data.js source file.
// Preserves a clean header comment and stable formatting.

const HEADER = `// ---------------------------------------------------------------------------
// EDITABLE CONTENT — managed via the Apexoria CMS at /admin.
// Manual edits are allowed but will be overwritten by the next CMS save.
// ---------------------------------------------------------------------------
`;

// Order matches the current data.js so diffs stay small.
const SECTION_ORDER = [
  "CONTACT",
  "WHATSAPP_LINK",
  "LOGO_URL",
  "SALESFORCE_LOGO",
  "BROCHURE_URL",
  "IMAGES",
  "VALUE_PROPS",
  "CURRICULUM_TRACKS",
  "PATHS",
  "SPECIAL_OFFER",
  "FOUNDER",
  "TESTIMONIALS",
  "GOOGLE_REVIEWS",
  "STATS",
  "BATCHES",
  "PLACEMENT_STEPS",
  "COURSE_OPTIONS",
  "RESOURCES",
  "FAQ_ITEMS",
];

const SECTION_COMMENTS = {
  CONTACT: "// Phone / email / social handles used across the site + footer.",
  WHATSAPP_LINK: "// Pre-filled WhatsApp CTA (floating widget + hero + footer).",
  LOGO_URL: "// Apexoria wordmark used in the navbar.",
  SALESFORCE_LOGO: "// Official Salesforce cloud logo (do not modify unless Salesforce rebrand).",
  BROCHURE_URL: "// Static brochure PDF served from public/ or Firebase Storage.",
  IMAGES: "// Hero + testimonial imagery. Prefer landscape 3:2 assets.",
  VALUE_PROPS: "// Why-Apexoria manifesto tiles.",
  CURRICULUM_TRACKS: "// Curriculum — two tracks (Development + QA), each with its own courses.",
  PATHS: "// Pricing tiers rendered on the Pricing section.",
  SPECIAL_OFFER: "// Standalone offer card below the pricing grid.",
  FOUNDER: "// Founder profile block.",
  TESTIMONIALS: "// Success story quotes.",
  GOOGLE_REVIEWS: "// Aggregate Google reviews badge.",
  STATS: "// Batch stats strip.",
  BATCHES: "// Upcoming cohorts. Seats <=5 shows orange urgency badge.",
  PLACEMENT_STEPS: "// Placement support workflow.",
  COURSE_OPTIONS: "// Values shown in the Lead Form 'Interested Course' dropdown.",
  RESOURCES: "// Downloadable notes shown in the Footer Resources section.",
  FAQ_ITEMS: "// FAQ — order matters (most-common concern first).",
};

function stringifyValue(value, indent = 0) {
  // Stable pretty-print of JSON-safe values. Emits valid JS (JSON is a subset).
  return JSON.stringify(value, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : " ".repeat(indent) + line))
    .join("\n");
}

export function serializeContent(content) {
  const parts = [HEADER];
  for (const key of SECTION_ORDER) {
    if (!(key in content)) continue;
    const val = content[key];
    const comment = SECTION_COMMENTS[key];
    if (comment) parts.push("\n" + comment);
    const rendered = typeof val === "string"
      ? JSON.stringify(val)
      : stringifyValue(val, 0);
    parts.push(`export const ${key} = ${rendered};`);
  }
  return parts.join("\n") + "\n";
}
