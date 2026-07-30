import {
  Phone,
  User2,
  Calendar,
  Tag,
  BookOpen,
  MessageSquareQuote,
  HelpCircle,
  FileDown,
  FileText,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

/**
 * NAV — source of truth for admin sidebar entries.
 *
 *   route      URL segment under /admin (deep-linkable)
 *   label      Human label
 *   icon       lucide component
 *   cluster    Sidebar grouping
 *   dataKeys   data.js top-level keys owned by this section — used to
 *              map field-level dirty tracking back to a section label.
 */
export const NAV = [
  {
    route: "contact",
    label: "Contact & Socials",
    icon: Phone,
    cluster: "basics",
    dataKeys: ["CONTACT", "WHATSAPP_LINK", "GOOGLE_REVIEWS"],
  },
  {
    route: "founder",
    label: "Founder",
    icon: User2,
    cluster: "basics",
    dataKeys: ["FOUNDER"],
  },
  {
    route: "images",
    label: "Images",
    icon: ImageIcon,
    cluster: "basics",
    dataKeys: ["LOGO_URL", "SALESFORCE_LOGO", "IMAGES"],
  },
  {
    route: "batches",
    label: "Batches",
    icon: Calendar,
    cluster: "programme",
    dataKeys: ["BATCHES"],
  },
  {
    route: "pricing",
    label: "Pricing & Offers",
    icon: Tag,
    cluster: "programme",
    dataKeys: ["PATHS", "SPECIAL_OFFER", "COURSE_OPTIONS"],
  },
  {
    route: "curriculum",
    label: "Curriculum",
    icon: BookOpen,
    cluster: "programme",
    dataKeys: ["CURRICULUM_TRACKS"],
  },
  {
    route: "downloads",
    label: "Downloads",
    icon: FileDown,
    cluster: "programme",
    dataKeys: ["BROCHURE_URL", "RESOURCES"],
  },
  {
    route: "testimonials",
    label: "Testimonials",
    icon: MessageSquareQuote,
    cluster: "marketing",
    dataKeys: ["TESTIMONIALS"],
  },
  {
    route: "faq",
    label: "FAQ",
    icon: HelpCircle,
    cluster: "marketing",
    dataKeys: ["FAQ_ITEMS"],
  },
  {
    route: "misc",
    label: "Stats · Value Props · Extras",
    icon: Sparkles,
    cluster: "marketing",
    dataKeys: ["STATS", "VALUE_PROPS", "PLACEMENT_STEPS"],
  },
  {
    route: "legal",
    label: "Legal Pages",
    icon: FileText,
    cluster: "marketing",
    dataKeys: ["LEGAL_PAGES"],
  },
];

export const CLUSTERS = [
  { key: "basics", label: "Site basics" },
  { key: "programme", label: "Programme" },
  { key: "marketing", label: "Marketing" },
];

export const DEFAULT_ROUTE = NAV[0].route;

/** Map a data.js key ("CONTACT") to its NAV entry. */
export function navForDataKey(key) {
  return NAV.find((n) => n.dataKeys.includes(key));
}

/** Given a Set of dirty data-keys, return distinct NAV labels. */
export function dirtyLabels(dirtyKeys) {
  const labels = new Set();
  for (const key of dirtyKeys) {
    const nav = navForDataKey(key);
    if (nav) labels.add(nav.label);
  }
  return Array.from(labels);
}
