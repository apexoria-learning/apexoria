// Parse a data.js source file into a plain content object.
// Uses a sandboxed Function eval — safe because the source is our own repo file.

const KEYS = [
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
  "LEGAL_PAGES",
  "FAQ_ITEMS",
];

export function parseDataSource(source) {
  // Strip export keywords + convert to a plain JS script that assigns to captures.
  const stripped = source.replace(/export\s+const\s+/g, "const ");
  const captureLines = KEYS.map(
    (k) => `try { __out.${k} = typeof ${k} !== 'undefined' ? ${k} : undefined; } catch(e) {}`
  ).join("\n");
  const script = `${stripped}\nconst __out = {};\n${captureLines}\nreturn __out;`;
  const fn = new Function(script);
  return fn();
}
