// ---------------------------------------------------------------------------
// EDITABLE CONTENT — update text/numbers/dates here without touching layout.
// ---------------------------------------------------------------------------

export const CONTACT = {
  phone: "+91 7498490687",
  phoneRaw: "917498490687",
  email: "hello@apexorialearning.com", // PLACEHOLDER — replace with real email
  instagram: "https://instagram.com/apexoria_learning",
  instagramHandle: "@apexoria_learning",
  linkedin: "https://linkedin.com/company/apexoria-learning", // PLACEHOLDER
  facebook: "https://facebook.com/apexorialearning", // PLACEHOLDER
};

export const WHATSAPP_LINK =
  "https://wa.me/917498490687?text=Hi%20Apexoria%20Learning%2C%20I%27m%20interested%20in%20your%20Salesforce%20courses";

export const LOGO_URL =
  "https://customer-assets-39nsmqrw.emergentagent.net/job_db7e5138-b5ed-4681-bdd0-bfef33bc1e2c/artifacts/9brny5z2_apexoria%20image.jpeg";

// Official Salesforce cloud logo (used instead of the word "Salesforce")
export const SALESFORCE_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg";

export const BROCHURE_URL = "/apexoria-brochure.pdf";

export const IMAGES = {
  heroAbstract:
    "https://images.pexels.com/photos/29506610/pexels-photo-29506610.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  student1:
    "https://images.unsplash.com/photo-1737573477556-ac3ed2db618c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBzdHVkZW50JTIwbGFwdG9wJTIwc21pbGV8ZW58MHx8fHwxNzg0NDQ3Mzc4fDA&ixlib=rb-4.1.0&q=85",
  student2:
    "https://images.pexels.com/photos/30858451/pexels-photo-30858451.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  team:
    "https://images.unsplash.com/photo-1688380692117-63178554d76d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMG9mZmljZSUyMHRlYW0lMjBtZWV0aW5nJTIwdGVjaHxlbnwwfHx8fDE3ODE4NDg2MDV8MA&ixlib=rb-4.1.0&q=85",
};

export const VALUE_PROPS = [
  {
    n: "01",
    title: "Live Online Classes",
    body: "Real-time, interactive cohorts with experienced Salesforce developers — not pre-recorded videos.",
    icon: "Radio",
  },
  {
    n: "02",
    title: "Real-World Mini Projects",
    body: "Build a deployable Loan / Case Management app with Apex, LWC & Integration — full development lifecycle.",
    icon: "FolderGit2",
  },
  {
    n: "03",
    title: "Job-Ready Curriculum",
    body: "Admin, Apex, LWC, Integrations & QA — mapped to real Salesforce developer & tester roles.",
    icon: "GraduationCap",
  },
  {
    n: "04",
    title: "Placement & Interview Support",
    body: "Resume building, mock interviews and referrals to our hiring partners.",
    icon: "Briefcase",
  },
];

// Curriculum — two tracks (Development + QA), each with 2 course cards.
// Every card carries its own `brochureUrl` so real per-course PDFs can
// replace the shared fallback (/apexoria-brochure.pdf) later without a
// code change.
export const CURRICULUM_TRACKS = [
  {
    key: "development",
    title: "Development Courses",
    overline: "For future Salesforce developers",
    courses: [
      {
        key: "crash-course",
        title: "Salesforce Crash Course",
        tagline: "Interview-ready in one month",
        chips: ["1 Month", "Intermediate", "Live Classes"],
        description:
          "A fast-paced dev primer for career-switchers who want to hit the ground running. Live classes, guided assignments, and just enough theory to make the code stick.",
        highlights: [
          "Apex fundamentals & triggers",
          "SOQL / SOSL queries",
          "Intro to Lightning Web Components",
          "Guided hands-on assignment",
        ],
        brochureUrl: "/apexoria-brochure.pdf",
        enrollLabel: "Salesforce Crash Course",
      },
      {
        key: "complete-course",
        title: "Salesforce Complete Course",
        tagline: "End-to-end Admin + Dev mastery",
        chips: ["3 Months", "Advanced", "Capstone Project"],
        description:
          "The full 3-month deep dive — Admin foundations, advanced Apex, LWC in depth, and real REST / SOAP integrations, capped with a deployable capstone project.",
        highlights: [
          "Full Admin + Development track",
          "Advanced Apex & test classes",
          "LWC in depth + REST / SOAP integrations",
          "Loan / Case Management capstone project",
        ],
        brochureUrl: "/apexoria-brochure.pdf",
        enrollLabel: "Salesforce Complete Course",
      },
    ],
  },
  {
    key: "qa",
    title: "QA Courses",
    overline: "For no-code Salesforce testing roles",
    courses: [
      {
        key: "salesforce-qa",
        title: "Salesforce QA",
        tagline: "Land a no-code Salesforce testing role",
        chips: ["2.5 Months", "No-Code", "Live Classes"],
        description:
          "Manual + API testing built specifically around Salesforce apps — UI, data validation, and integration scenarios you'll actually be asked about in interviews.",
        highlights: [
          "Manual testing · STLC, test cases, bug reports",
          "API testing with Postman",
          "Salesforce UI & data validation",
          "Agile & JIRA workflows",
        ],
        brochureUrl: "/apexoria-brochure.pdf",
        enrollLabel: "Salesforce QA Testing Course",
      },
      {
        key: "salesforce-automation-qa",
        title: "Salesforce Automation QA",
        tagline: "Level up into high-end automation testing",
        chips: ["Advanced", "Automation Track", "Playwright · Provar"],
        description:
          "For QA engineers who want to automate. Playwright, Provar, and Selenium against real CRM scenarios, plus CI/CD framework patterns used in production teams.",
        highlights: [
          "Playwright & Provar automation",
          "Selenium fundamentals",
          "CI/CD & framework design",
          "Real-world Salesforce automation scenarios",
        ],
        brochureUrl: "/apexoria-brochure.pdf",
        enrollLabel: "Salesforce Automation QA Course",
      },
    ],
  },
];

// Learning paths — Salesforce DEVELOPMENT tracks
export const PATHS = [
  {
    id: "foundation",
    tier: "Salesforce Foundation",
    level: "Beginner",
    price: "₹1,999",
    detail: "5 hrs / week",
    color: "#1E90FF",
    popular: false,
    includes: [
      "Best for understanding the Salesforce ecosystem",
      "Salesforce basics & navigation",
      "Objects, fields & relationships",
      "Reports & dashboards",
      "Intro to automation (Flows)",
      "Security fundamentals",
    ],
  },
  {
    id: "crash",
    tier: "Salesforce Crash Course",
    level: "Intermediate",
    price: "₹9,999",
    detail: "22 hrs / month · 1 month",
    color: "#F5B400",
    popular: false,
    includes: [
      "Best suited for fast movers — interview ready",
      "Everything in Foundation",
      "Apex fundamentals & triggers",
      "SOQL / SOSL queries",
      "Introduction to LWC",
      "Guided hands-on assignment",
    ],
  },
  {
    id: "complete",
    tier: "Salesforce Complete Course",
    level: "Advanced",
    price: "₹21,999",
    detail: "70 hrs · 3 months",
    color: "#2E7D32",
    popular: true,
    includes: [
      "Best for those who want complete hands-on knowledge & expertise",
      "Full Admin + Development track",
      "Advanced Apex & test classes",
      "Lightning Web Components in depth",
      "REST / SOAP integrations & deployment",
      "Capstone project (Loan / Case Mgmt)",
      "Placement & interview support",
    ],
  },
  {
    id: "qa",
    tier: "Salesforce QA Testing",
    level: "No-Code Track",
    price: "₹17,999",
    detail: "60 hrs · 2.5 months",
    color: "#8E44AD",
    popular: false,
    includes: [
      "Best for those who want a no-coding Salesforce role",
      "Manual + Automation testing fundamentals",
      "Salesforce app testing (UI, data, integration)",
      "API testing with Postman",
      "Automation with Playwright / Provar / Selenium",
      "Placement & interview support",
    ],
  },
];

export const SPECIAL_OFFER = {
  id: "special",
  tier: "Enrollment Special Offer",
  level: "All Levels",
  price: "₹4,999",
  tagline: "Start now, pay the rest once you're confident.",
  includes: [
    "Flexible access to course content",
    "Pay remaining after you feel confident",
    "Ideal for career-switchers on a budget",
    "Available for Development & QA tracks",
  ],
};

// Founder — replace name & photo when provided
export const FOUNDER = {
  name: "Founder & Lead Instructor", // PLACEHOLDER — add founder's name
  role: "Salesforce Ecosystem · 5+ Years Experience · 3+ Years Teaching",
  photo: "https://customer-assets-v7afamib.emergentagent.net/job_sfdc-mastery-hub/artifacts/tji6a6ek_1718476012009.jpg",
  certifications: [],
  bio: "Salesforce professional with 5+ years of hands-on experience in the Salesforce ecosystem and 3+ years of teaching experience mentoring aspiring developers and QA testers. Proficient in Apex, Lightning Web Components (LWC), Triggers, SOQL, and Salesforce Integrations (REST/SOAP APIs). Strong expertise in customizing Salesforce applications, automation (Flows, Process Builder, Workflows), and security settings (Profiles, Sharing Rules, Permission Sets). Experienced in optimizing queries and troubleshooting system performance. Passionate about delivering high-quality solutions, improving business processes, and staying updated with Salesforce best practices.",
  skills: ["Apex", "LWC", "Triggers", "SOQL", "REST / SOAP APIs", "Flows", "Automation", "Security"],
};

// Placed students — real names provided. Companies editable where not given.
export const TESTIMONIALS = [
  {
    name: "Anand Kumar",
    role: "Salesforce Trainee",
    company: "at BM Cloud Consultancy",
    quote:
      "I joined with zero coding background and was nervous about Apex. The live classes and hands-on projects changed everything — within weeks I was writing triggers and building LWC components. Landed my trainee role at BM Cloud Consultancy right after the batch!",
    rating: 5,
  },
  {
    name: "Priyanka Rajguru",
    role: "Salesforce Developer",
    company: "",
    quote:
      "The mentors break down complex topics like integrations and SOQL so clearly. The capstone project gave me something real to show in interviews. Highly recommend Apexoria to anyone serious about a Salesforce career.",
    rating: 5,
  },
  {
    name: "Aditya Tandiye",
    role: "Salesforce Admin & Developer",
    company: "",
    quote:
      "Best decision I made this year. The doubt-clearing sessions and mock interviews made me confident, and the placement support was genuine. I cleared my PD1 certification prep alongside the course.",
    rating: 5,
  },
];

// Google reviews summary — replace with real rating & link.
export const GOOGLE_REVIEWS = {
  rating: 4.9,
  count: 120, // PLACEHOLDER — total reviews
  url: "https://share.google/2zZMGfpW2oKJqejO2",
};

// Placeholder stats — clearly editable.
export const STATS = [
  { value: "200+", label: "Students Trained" },
  { value: "10+", label: "Hiring Partners" },
  { value: "92%", label: "Batch Completion Rate" },
];

// Editable batch data — one cohort per course track.
// Seat counts drive the row badge in Batches.jsx: <=5 shows orange
// "Only N seats left" urgency, >5 shows green "N seats available".
export const BATCHES = [
  { start: "27 Jul 2026", mode: "Weekday", time: "Morning (9 AM – 11 AM)", seats: 3,  course: "Salesforce Crash Course" },
  { start: "11 Aug 2026", mode: "Weekday", time: "Afternoon (1 PM – 4 PM)", seats: 7,  course: "Salesforce Complete Course" },
  { start: "26 Aug 2026", mode: "Weekday", time: "Evening (8 PM – 10 PM)", seats: 12, course: "Salesforce QA" },
];

export const PLACEMENT_STEPS = [
  { title: "Resume Building", body: "ATS-friendly, role-mapped resumes.", icon: "FileText" },
  { title: "Mock Interviews", body: "Real developer & QA interview simulations with feedback.", icon: "MessageSquare" },
  { title: "Referrals to Partners", body: "Direct referrals to 40+ hiring partners.", icon: "Users" },
  { title: "Post-Placement Support", body: "Guidance through your first 90 days.", icon: "LifeBuoy" },
];

export const COURSE_OPTIONS = [
  "Salesforce Foundation — ₹1,999",
  "Salesforce Crash Course — ₹9,999",
  "Salesforce Complete Course — ₹21,999",
  "Salesforce QA Testing Course — ₹17,999",
  "Enrollment Special Offer — ₹4,999",
  "Not sure yet — need guidance",
];

// Downloadable study notes shown in the Footer Resources section.
// PDFs live under frontend/public/resources/ — buttons fall back to a toast if missing.
export const RESOURCES = [
  { label: "LWC Notes", file: "/resources/apexoria-lwc-notes.pdf" },
  { label: "Apex Notes", file: "/resources/apexoria-apex-notes.pdf" },
  { label: "QA Notes", file: "/resources/apexoria-qa-notes.pdf" },
];

// FAQ — order matters (most-common concern first for SEO + conversion).
// Answers should mirror what a counsellor would say on the phone: warm,
// concrete, no marketing fluff. Every question also lands in the FAQPage
// JSON-LD in public/index.html — keep the two in sync when editing.
export const FAQ_ITEMS = [
  {
    q: "Do I need coding experience to join?",
    a: "No. Our courses are designed for absolute beginners. We start from Salesforce fundamentals, walk you through Apex step by step, and pair every concept with hands-on practice so it sticks — no prior programming background required.",
  },
  {
    q: "Are the classes live or pre-recorded?",
    a: "All batches are 100% live, instructor-led sessions on Google Meet / Zoom. You interact in real time, ask questions, and pair on code. Recordings are shared after each class so you can revisit anything you missed.",
  },
  {
    q: "How long does each course run?",
    a: "The Crash Course is 1 month, the QA track is ~2.5 months, and the Complete Course (Admin + Development + LWC + Integration + Capstone) runs over 3 months. Each includes structured weekly assignments and a real project.",
  },
  {
    q: "Do you actually help with placements?",
    a: "Yes — placement support is included in every paid track. You get resume reviews, mock interviews, LinkedIn optimisation, and direct referrals to our 10+ hiring partners. Support continues through your first 90 days on the job.",
  },
  {
    q: "Can I pay in instalments or EMI?",
    a: "Yes. Our Enrollment Special Offer lets you start at ₹4,999 and pay the remainder once you're confident with the material. Talk to a counsellor on WhatsApp for a plan that fits your budget.",
  },
  {
    q: "Will I get a certificate?",
    a: "You receive an Apexoria Learning course-completion certificate, and we prepare you for the official Salesforce Platform Developer I (PD1) and Salesforce Administrator certifications — the ones recruiters actually screen for.",
  },
  {
    q: "What if I miss a class?",
    a: "Every session is recorded and shared in the cohort group within a few hours. You'll also have direct WhatsApp access to your mentor for doubts, and dedicated doubt-clearing sessions each week.",
  },
  {
    q: "How do I get started?",
    a: "Fill in the enquiry form on this page or ping us on WhatsApp. A counsellor will call you back for a free 15-minute chat, map you to the right batch, and walk you through payment options — no pressure to enrol.",
  },
];
