import { z } from "zod";
import * as LucideIcons from "lucide-react";
import { navForDataKey } from "./sections";

/* -------------------------------------------------------- primitives */

const urlSchema = z
  .string()
  .trim()
  .url({ message: "Must be a valid URL (start with http:// or https://)" });

const optionalUrl = z.union([
  z.literal(""),
  z.string().trim().url({ message: "Must be a valid URL" }),
]);

const emailSchema = z.string().trim().email({ message: "Must be a valid email" });

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-().]{7,20}$/, { message: "Phone must be 7–20 digits" });

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
    message: "Must be a hex colour like #334155",
  });

const iconNameSchema = z
  .string()
  .trim()
  .refine((name) => Boolean(LucideIcons[name]), {
    message: "Not a known lucide-react icon name",
  });

const dateDisplaySchema = z
  .string()
  .trim()
  .regex(/^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/, {
    message: 'Date must look like "27 Jul 2026"',
  });

/* ------------------------------------------------------- per-section */

const CONTACT = z.object({
  phone: phoneSchema,
  phoneRaw: z.string().trim().regex(/^\+?[0-9]{7,15}$/, {
    message: "phoneRaw must be digits (E.164-ish)",
  }),
  email: emailSchema,
  instagram: optionalUrl,
  instagramHandle: z.string().trim().optional().or(z.literal("")),
  linkedin: optionalUrl,
  facebook: optionalUrl,
});

const WHATSAPP_LINK = urlSchema;

const GOOGLE_REVIEWS = z.object({
  rating: z.coerce.number().min(0).max(5),
  count: z.coerce.number().int().min(0),
  url: urlSchema,
});

const FOUNDER = z.object({
  name: z.string().trim().min(1, "Name is required"),
  role: z.string().trim().min(1, "Role is required"),
  bio: z.string().trim().min(1, "Bio is required"),
  photo: optionalUrl,
  skills: z.array(z.string().trim().min(1)).default([]),
  certifications: z.array(z.string().trim().min(1)).default([]),
});

const BATCH = z.object({
  start: dateDisplaySchema,
  mode: z.string().trim().min(1),
  time: z.string().trim().min(1),
  seats: z.coerce.number().int().min(0),
  course: z.string().trim().min(1),
});
const BATCHES = z.array(BATCH);

const PATH_TIER = z.object({
  id: z.string().trim().min(1),
  tier: z.string().trim().min(1),
  level: z.string().trim().min(1),
  price: z.string().trim().min(1),
  detail: z.string().trim().optional().or(z.literal("")),
  color: hexColorSchema,
  popular: z.boolean().optional(),
  includes: z.array(z.string().trim().min(1)).default([]),
});
const PATHS = z.array(PATH_TIER);

const SPECIAL_OFFER = z.object({
  id: z.string().trim().min(1),
  tier: z.string().trim().min(1),
  level: z.string().trim().min(1),
  price: z.string().trim().min(1),
  tagline: z.string().trim().optional().or(z.literal("")),
  includes: z.array(z.string().trim().min(1)).default([]),
});

const COURSE_OPTIONS = z.array(z.string().trim().min(1));

const COURSE = z.object({
  key: z.string().trim().min(1),
  title: z.string().trim().min(1),
  tagline: z.string().trim().optional().or(z.literal("")),
  chips: z.array(z.string().trim().min(1)).default([]),
  description: z.string().trim().min(1),
  highlights: z.array(z.string().trim().min(1)).default([]),
  brochureUrl: optionalUrl,
  enrollLabel: z.string().trim().optional().or(z.literal("")),
});
const CURRICULUM_TRACK = z.object({
  key: z.string().trim().min(1),
  title: z.string().trim().min(1),
  overline: z.string().trim().optional().or(z.literal("")),
  courses: z.array(COURSE),
});
const CURRICULUM_TRACKS = z.array(CURRICULUM_TRACK);

const TESTIMONIAL = z.object({
  name: z.string().trim().min(1),
  role: z.string().trim().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
  quote: z.string().trim().min(1),
  rating: z.coerce.number().min(0).max(5),
  photo: optionalUrl,
});
const TESTIMONIALS = z.array(TESTIMONIAL);

const FAQ_ITEM = z.object({
  q: z.string().trim().min(1, "Question is required"),
  a: z.string().trim().min(1, "Answer is required"),
});
const FAQ_ITEMS = z.array(FAQ_ITEM);

const BROCHURE_URL = optionalUrl;
const RESOURCE = z.object({
  label: z.string().trim().min(1),
  file: optionalUrl,
});
const RESOURCES = z.array(RESOURCE);

const LEGAL_DOC = z.object({
  title: z.string().trim().min(1, "Title is required"),
  metaDescription: z.string().trim().optional().or(z.literal("")),
  lastUpdated: z.string().trim().optional().or(z.literal("")),
  contentMd: z.string().optional().or(z.literal("")),
});
const LEGAL_PAGES = z.object({
  privacy: LEGAL_DOC,
  terms: LEGAL_DOC,
});

const LOGO_URL = optionalUrl;
const SALESFORCE_LOGO = optionalUrl;
const IMAGES = z.record(z.string()); // free-form image map

const STAT = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
});
const STATS = z.array(STAT);

const VALUE_PROP = z.object({
  n: z.string().trim().optional().or(z.literal("")),
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
  icon: iconNameSchema,
});
const VALUE_PROPS = z.array(VALUE_PROP);

const PLACEMENT_STEP = z.object({
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
  icon: iconNameSchema,
});
const PLACEMENT_STEPS = z.array(PLACEMENT_STEP);

/* ------------------------------------------------------------ export */

export const SECTION_SCHEMAS = {
  CONTACT,
  WHATSAPP_LINK,
  GOOGLE_REVIEWS,
  FOUNDER,
  BATCHES,
  PATHS,
  SPECIAL_OFFER,
  COURSE_OPTIONS,
  CURRICULUM_TRACKS,
  TESTIMONIALS,
  FAQ_ITEMS,
  BROCHURE_URL,
  RESOURCES,
  LEGAL_PAGES,
  LOGO_URL,
  SALESFORCE_LOGO,
  IMAGES,
  STATS,
  VALUE_PROPS,
  PLACEMENT_STEPS,
};

/**
 * Validate a full content object.
 * Returns [] on success, or an array of { section, key, path, message }.
 * `section` is the human NAV label; `key` is the data.js key.
 */
export function validateContent(content) {
  const errors = [];
  if (!content) return errors;
  for (const [key, schema] of Object.entries(SECTION_SCHEMAS)) {
    if (!(key in content)) continue;
    const res = schema.safeParse(content[key]);
    if (!res.success) {
      const nav = navForDataKey(key);
      for (const issue of res.error.issues) {
        const p = issue.path.length ? ` › ${issue.path.join(".")}` : "";
        errors.push({
          section: nav?.label || key,
          key,
          path: issue.path,
          message: `${key}${p}: ${issue.message}`,
        });
      }
    }
  }
  return errors;
}
