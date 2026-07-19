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

// Featured course: SALESFORCE DEVELOPMENT
export const DEV_CURRICULUM = [
  {
    key: "fundamentals",
    title: "Salesforce Fundamentals",
    items: [
      "Salesforce Basics & Navigation",
      "Standard & Custom Objects",
      "Fields & Relationships",
      "Validation Rules & Page Layouts",
      "Reports & Dashboards",
      "Security (Profiles, Roles, Permission Sets)",
    ],
  },
  {
    key: "apex",
    title: "Apex Programming",
    items: [
      "Apex Classes & Methods",
      "Triggers & Trigger Frameworks",
      "SOQL & SOSL Queries",
      "Collections & Control Flow",
      "Asynchronous Apex (Future, Batch, Queueable)",
      "Test Classes & Code Coverage",
    ],
  },
  {
    key: "lwc",
    title: "Lightning Web Components",
    items: [
      "LWC Fundamentals & Structure",
      "Component Communication & Events",
      "Wire Service & Apex Integration",
      "Lightning Data Service",
      "Reactive Properties & Lifecycle Hooks",
      "Building Real UI Components",
    ],
  },
  {
    key: "integration",
    title: "Integration & Automation",
    badge: "Career Booster",
    items: [
      "REST & SOAP API Integrations",
      "Named Credentials & Callouts",
      "Flows, Process Builder & Workflows",
      "Deployment (Change Sets / SFDX)",
      "Best Practices & Governor Limits",
      "Real-Time Integration Scenarios",
    ],
  },
];

export const DEV_OUTCOMES = [
  "Write clean Apex & build LWC components confidently",
  "Design & consume REST/SOAP integrations",
  "Automate business processes with Flows",
  "Demo your own Salesforce org projects",
  "Crack PD1 (Platform Developer I) or Admin certifications",
  "Crack Salesforce Developer & Admin interviews",
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
];

export const SPECIAL_OFFER = {
  id: "special",
  tier: "Special Offer",
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

// QA course (secondary offering — batches running)
export const QA_CURRICULUM = [
  { title: "Manual Testing", items: ["STLC & SDLC", "Test Case Writing", "Bug Reporting", "Agile & JIRA"] },
  { title: "API Testing", items: ["REST & HTTP Methods", "Status Codes", "Postman", "Auth & Real Use Cases"] },
  { title: "Salesforce Testing", items: ["Testing SF Apps", "UI & Data Validation", "Integration Testing", "CRM Scenarios"] },
  { title: "Automation Testing", items: ["Playwright", "Provar", "Selenium", "CI/CD & Frameworks — for high-end testers"] },
];

// Founder — replace name & photo when provided
export const FOUNDER = {
  name: "Founder & Lead Instructor", // PLACEHOLDER — add founder's name
  role: "Salesforce Developer · 4+ Years Experience",
  photo: "https://customer-assets-v7afamib.emergentagent.net/job_sfdc-mastery-hub/artifacts/tji6a6ek_1718476012009.jpg",
  certifications: ["Salesforce Platform Developer I"],
  bio: "Highly skilled Salesforce Developer with 4+ years of experience in designing, developing, and implementing scalable Salesforce solutions. Proficient in Apex, Lightning Web Components (LWC), Triggers, SOQL, and Salesforce Integrations (REST/SOAP APIs). Strong expertise in customizing Salesforce applications, automation (Flows, Process Builder, Workflows), and security settings (Profiles, Sharing Rules, Permission Sets). Experienced in optimizing queries and troubleshooting system performance. Passionate about delivering high-quality solutions, improving business processes, and staying updated with Salesforce best practices.",
  skills: ["Apex", "LWC", "Triggers", "SOQL", "REST / SOAP APIs", "Flows", "Automation", "Security"],
};

// Placed students — real names provided. Companies editable where not given.
export const TESTIMONIALS = [
  {
    name: "Amand Kumar",
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

// Editable batch data — includes both Development & QA cohorts.
export const BATCHES = [
  { start: "12 Jan 2026", mode: "Weekday", seats: 5, course: "Salesforce Development" },
  { start: "19 Jan 2026", mode: "Weekend", seats: 8, course: "Salesforce QA Testing" },
  { start: "26 Jan 2026", mode: "Weekend", seats: 9, course: "Salesforce Development" },
  { start: "09 Feb 2026", mode: "Weekday", seats: 12, course: "Salesforce QA Testing" },
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
  "Special Offer — ₹4,999",
  "Salesforce Development Course",
  "Salesforce QA Testing Course",
  "Not sure yet — need guidance",
];
