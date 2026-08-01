// ---------------------------------------------------------------------------
// EDITABLE CONTENT — managed via the Apexoria CMS at /admin.
// Manual edits are allowed but will be overwritten by the next CMS save.
// ---------------------------------------------------------------------------


// Phone / email / social handles used across the site + footer.
export const CONTACT = {
  "phone": "+91 7498490687",
  "phoneRaw": "917498490687",
  "email": "apexorialearning@gmail.com",
  "instagram": "https://instagram.com/apexoria_learning",
  "instagramHandle": "@apexoria_learning",
  "linkedin": "https://linkedin.com/company/apexoria-learning",
  "facebook": "https://facebook.com/people/Apexoria-Learning/61579552420160"
};

// Pre-filled WhatsApp CTA (floating widget + hero + footer).
export const WHATSAPP_LINK = "https://wa.me/917498490687?text=Hi%20Apexoria%20Learning%2C%20I%27m%20interested%20in%20your%20Salesforce%20courses";

// Apexoria wordmark used in the navbar.
export const LOGO_URL = "/apexoria-logo.jpeg";

// Official Salesforce cloud logo (do not modify unless Salesforce rebrand).
export const SALESFORCE_LOGO = "/images/salesforce-cloud.svg";

// Static brochure PDF served from public/ or Firebase Storage.
export const BROCHURE_URL = "/apexoria-brochure.pdf";

// Hero + testimonial imagery. Prefer landscape 3:2 assets.
export const IMAGES = {
  "heroAbstract": "/images/hero-abstract.jpg",
  "heroAbstract640": "/images/hero-abstract-640w.jpg",
  "heroAbstract1280": "/images/hero-abstract-1280w.jpg",
  "heroAbstract640Webp": "/images/hero-abstract-640w.webp",
  "heroAbstract940Webp": "/images/hero-abstract.webp",
  "heroAbstract1280Webp": "/images/hero-abstract-1280w.webp",
  "student1": "/images/student-1.jpg",
  "student2": "/images/student-2.jpg",
  "team": "/images/team.jpg"
};

// Why-Apexoria manifesto tiles.
export const VALUE_PROPS = [
  {
    "n": "01",
    "title": "Live Online Classes",
    "body": "Real-time, interactive cohorts with experienced Salesforce developers — not pre-recorded videos.",
    "icon": "Radio"
  },
  {
    "n": "02",
    "title": "Real-World Mini Projects",
    "body": "Build a deployable Loan / Case Management app with Apex, LWC & Integration — full development lifecycle.",
    "icon": "FolderGit2"
  },
  {
    "n": "03",
    "title": "Job-Ready Curriculum",
    "body": "Admin, Apex, LWC, Integrations & QA — mapped to real Salesforce developer & tester roles.",
    "icon": "GraduationCap"
  },
  {
    "n": "04",
    "title": "Placement & Interview Support",
    "body": "Resume building, mock interviews and referrals to our hiring partners.",
    "icon": "Briefcase"
  }
];

// Pricing tiers rendered on the Pricing section.
export const PATHS = [
  {
    "id": "foundation",
    "tier": "Salesforce Foundation",
    "level": "Beginner",
    "price": "₹1,999",
    "detail": "5 hrs / week",
    "color": "#1E90FF",
    "popular": false,
    "homepageFeatured": false,
    "includes": [
      "Best for understanding the Salesforce ecosystem",
      "Salesforce basics & navigation",
      "Objects, fields & relationships",
      "Reports & dashboards",
      "Intro to automation (Flows)",
      "Security fundamentals"
    ]
  },
  {
    "id": "crash-course",
    "tier": "Salesforce Crash Course",
    "level": "Intermediate",
    "price": "₹9,999",
    "detail": "22 hrs / month · 1 month",
    "color": "#F5B400",
    "popular": false,
    "homepageFeatured": true,
    "includes": [
      "Best suited for fast movers — interview ready",
      "Everything in Foundation",
      "Apex fundamentals & triggers",
      "SOQL / SOSL queries",
      "Introduction to LWC",
      "Guided hands-on assignment"
    ]
  },
  {
    "id": "complete-course",
    "tier": "Salesforce Complete Course",
    "level": "Advanced",
    "price": "₹21,999",
    "detail": "70 hrs · 3 months",
    "color": "#2E7D32",
    "popular": true,
    "homepageFeatured": true,
    "includes": [
      "Best for those who want complete hands-on knowledge & expertise",
      "Full Admin + Development track",
      "Advanced Apex & test classes",
      "Lightning Web Components in depth",
      "REST / SOAP integrations & deployment",
      "Capstone project (Loan / Case Mgmt)",
      "Placement & interview support"
    ]
  },
  {
    "id": "salesforce-qa",
    "tier": "Salesforce QA Testing Course",
    "level": "No-Code Track",
    "price": "₹17,999",
    "detail": "60 hrs · 2.5 months",
    "color": "#8E44AD",
    "popular": false,
    "homepageFeatured": true,
    "includes": [
      "Best for those who want a no-coding Salesforce role",
      "Manual + Automation testing fundamentals",
      "Salesforce app testing (UI, data, integration)",
      "API testing with Postman",
      "Automation with Playwright / Provar / Selenium",
      "Placement & interview support"
    ]
  },
  {
    "id": "automation-qa",
    "tier": "Salesforce Automation QA",
    "level": "Advanced Automation",
    "price": "₹22,000",
    "detail": "~30% coding · CI/CD",
    "color": "#8E44AD",
    "popular": false,
    "homepageFeatured": false,
    "includes": [
      "For QA engineers ready to automate at scale",
      "Playwright & Provar automation frameworks",
      "Selenium fundamentals",
      "CI/CD & framework design patterns",
      "Real-world Salesforce automation scenarios",
      "Placement & interview support"
    ]
  },
  {
    "id": "interview-prep",
    "tier": "Salesforce Interview Preparation",
    "level": "Career Track",
    "price": "₹2,999",
    "detail": "2 weeks · career accelerator",
    "color": "#F5B400",
    "popular": false,
    "homepageFeatured": false,
    "includes": [
      "For anyone who already knows Salesforce basics",
      "10 personalized mock interviews (Dev + QA)",
      "Resume optimization (ATS-friendly)",
      "LinkedIn + Naukri profile setup",
      "1-on-1 interview guidance & feedback",
      "2 months post-job support"
    ]
  }
];

// Standalone offer card below the pricing grid.
export const SPECIAL_OFFER = {
  "id": "special",
  "tier": "Enrollment Special Offer",
  "level": "All Levels",
  "price": "₹4,999",
  "tagline": "Start now, pay the rest once you're confident.",
  "includes": [
    "Flexible access to course content",
    "Pay remaining after you feel confident",
    "Ideal for career-switchers on a budget",
    "Available for Development & QA tracks"
  ]
};

// Founder profile block.
export const FOUNDER = {
  "name": "Founder & Lead Instructor",
  "role": "Salesforce Ecosystem · 5+ Years Experience · 3+ Years Teaching",
  "photo": "/founder-img.png",
  "certifications": [],
  "bio": "Salesforce professional with 5+ years of hands-on experience in the Salesforce ecosystem and 3+ years of teaching experience mentoring aspiring developers and QA testers. Proficient in Apex, Lightning Web Components (LWC), Triggers, SOQL, and Salesforce Integrations (REST/SOAP APIs). Strong expertise in customizing Salesforce applications, automation (Flows, Process Builder, Workflows), and security settings (Profiles, Sharing Rules, Permission Sets). Experienced in optimizing queries and troubleshooting system performance. Passionate about delivering high-quality solutions, improving business processes, and staying updated with Salesforce best practices.",
  "skills": [
    "Apex",
    "LWC",
    "Triggers",
    "SOQL",
    "REST / SOAP APIs",
    "Flows",
    "Automation",
    "Security"
  ]
};

// Success story quotes.
export const TESTIMONIALS = [
  {
    "name": "Anand Kumar",
    "role": "Salesforce Trainee",
    "company": "at BM Cloud Consultancy",
    "quote": "I joined with zero coding background and was nervous about Apex. The live classes and hands-on projects changed everything — within weeks I was writing triggers and building LWC components. Landed my trainee role at BM Cloud Consultancy right after the batch!",
    "rating": 5,
    "photo": ""
  },
  {
    "name": "Priyanka Rajguru",
    "role": "Salesforce Developer",
    "company": "",
    "quote": "The mentors break down complex topics like integrations and SOQL so clearly. The capstone project gave me something real to show in interviews. Highly recommend Apexoria to anyone serious about a Salesforce career.",
    "rating": 5,
    "photo": ""
  },
  {
    "name": "Aditya Tandiye",
    "role": "Salesforce Admin & Developer",
    "company": "",
    "quote": "Best decision I made this year. The doubt-clearing sessions and mock interviews made me confident, and the placement support was genuine. I cleared my PD1 certification prep alongside the course.",
    "rating": 5,
    "photo": ""
  }
];

// Aggregate Google reviews badge.
export const GOOGLE_REVIEWS = {
  "rating": 4.9,
  "count": 120,
  "url": "https://share.google/2zZMGfpW2oKJqejO2"
};

// Batch stats strip.
export const STATS = [
  {
    "value": "200+",
    "label": "Students Trained"
  },
  {
    "value": "10+",
    "label": "Hiring Partners"
  },
  {
    "value": "92%",
    "label": "Batch Completion Rate"
  }
];

// Upcoming cohorts. Seats <=5 shows orange urgency badge.
export const BATCHES = [
  {
    "start": "11 August 2026",
    "mode": "Weekday",
    "time": "Morning (9 AM – 11 AM)",
    "seats": 8,
    "course": "Salesforce Complete Course"
  },
  {
    "start": "26 August 2026",
    "mode": "Weekday",
    "time": "Afternoon (1 PM – 4 PM)",
    "seats": 10,
    "course": "Salesforce Complete Course"
  },
  {
    "start": "26 Aug 2026",
    "mode": "Weekday",
    "time": "Evening (8 PM – 10 PM)",
    "seats": 8,
    "course": "Salesforce QA"
  }
];

// Placement support workflow.
export const PLACEMENT_STEPS = [
  {
    "title": "Resume Building",
    "body": "ATS-friendly, role-mapped resumes.",
    "icon": "FileText"
  },
  {
    "title": "Mock Interviews",
    "body": "Real developer & QA interview simulations with feedback.",
    "icon": "MessageSquare"
  },
  {
    "title": "Referrals to Partners",
    "body": "Direct referrals to 40+ hiring partners.",
    "icon": "Users"
  },
  {
    "title": "Post-Placement Support",
    "body": "Guidance through your first 90 days.",
    "icon": "LifeBuoy"
  }
];

// Values shown in the Lead Form 'Interested Course' dropdown.
export const COURSE_OPTIONS = [
  "Salesforce Foundation — ₹1,999",
  "Salesforce Crash Course — ₹9,999",
  "Salesforce Complete Course — ₹21,999",
  "Salesforce QA Testing Course — ₹17,999",
  "Salesforce Automation QA — ₹22,000",
  "Salesforce Interview Preparation — ₹2,999",
  "Not sure yet — need guidance"
];

// Downloadable notes shown in the Footer Resources section.
export const RESOURCES = [
  {
    "label": "LWC Notes",
    "file": "/resources/apexoria-lwc-notes.pdf"
  },
  {
    "label": "Apex Notes",
    "file": "/resources/apexoria-apex-notes.pdf"
  },
  {
    "label": "QA Notes",
    "file": "/resources/apexoria-qa-notes.pdf"
  }
];

// FAQ — order matters (most-common concern first).
export const FAQ_ITEMS = [
  {
    "q": "Do I need coding experience to join?",
    "a": "No. Our courses are designed for absolute beginners. We start from Salesforce fundamentals, walk you through Apex step by step, and pair every concept with hands-on practice so it sticks — no prior programming background required."
  },
  {
    "q": "Are the classes live or pre-recorded?",
    "a": "All batches are 100% live, instructor-led sessions on Google Meet / Zoom. You interact in real time, ask questions, and pair on code. Recordings are shared after each class so you can revisit anything you missed."
  },
  {
    "q": "How long does each course run?",
    "a": "The Crash Course is 1 month, the QA track is ~2.5 months, and the Complete Course (Admin + Development + LWC + Integration + Capstone) runs over 3 months. Each includes structured weekly assignments and a real project."
  },
  {
    "q": "Do you actually help with placements?",
    "a": "Yes — placement support is included in every paid track. You get resume reviews, mock interviews, LinkedIn optimisation, and direct referrals to our 10+ hiring partners. Support continues through your first 90 days on the job."
  },
  {
    "q": "Can I pay in instalments or EMI?",
    "a": "Yes. Our Enrollment Special Offer lets you start at ₹4,999 and pay the remainder once you're confident with the material. Talk to a counsellor on WhatsApp for a plan that fits your budget."
  },
  {
    "q": "Will I get a certificate?",
    "a": "You receive an Apexoria Learning course-completion certificate, and we prepare you for the official Salesforce Platform Developer I (PD1) and Salesforce Administrator certifications — the ones recruiters actually screen for."
  },
  {
    "q": "What if I miss a class?",
    "a": "Every session is recorded and shared in the cohort group within a few hours. You'll also have direct WhatsApp access to your mentor for doubts, and dedicated doubt-clearing sessions each week."
  },
  {
    "q": "How do I get started?",
    "a": "Fill in the enquiry form on this page or ping us on WhatsApp. A counsellor will call you back for a free 15-minute chat, map you to the right batch, and walk you through payment options — no pressure to enrol."
  }
];

// Interview Preparation flagship section — homepage only.
export const INTERVIEW_PREP = {
  "overline": "CAREER SERVICES",
  "headlinePrefix": "Turn your Salesforce skills into a ",
  "headlineHighlight": "signed offer",
  "headlineSuffix": ".",
  "subCopy": "Short-form program for anyone with basic Salesforce knowledge who needs the interview edge. Bootcamp grads, self-taught developers, working professionals switching companies — all welcome.",
  "price": "₹2,999",
  "tagline": "2-week Career Track",
  "features": [
    {
      "icon": "Target",
      "label": "10 Mock Interviews",
      "description": "Dev + QA scenarios, personalized 1-on-1 feedback"
    },
    {
      "icon": "FileText",
      "label": "Resume Optimization",
      "description": "ATS-friendly, role-mapped for Salesforce openings"
    },
    {
      "icon": "Linkedin",
      "label": "LinkedIn + Naukri Profile",
      "description": "Keyword-optimized for Salesforce recruiters"
    },
    {
      "icon": "LifeBuoy",
      "label": "2 Months Post-Job Support",
      "description": "Guidance through your first 60 days on the job"
    }
  ],
  "ctaLabel": "Enroll Now",
  "whatsappCta": "Ask About This Program",
  "whatsappHref": WHATSAPP_LINK
};

// All Courses Page — rich per-course content for /courses route.
export const ALL_COURSES_PAGE = {
  "foundation": {
    "title": "Salesforce Foundation",
    "tagline": "Start your Salesforce journey with the fundamentals",
    "chips": ["5 hrs/week", "Beginner", "Live Classes"],
    "description": "Perfect for absolute beginners. Learn Salesforce navigation, data model, security, automation basics, and reporting — the building blocks every Admin and Developer needs before diving into code.",
    "weekByWeek": [
      { "week": 1, "topic": "Salesforce Basics & Navigation", "points": ["Platform overview", "Objects, fields & relationships", "Data import/export"] },
      { "week": 2, "topic": "Reports & Dashboards", "points": ["Building custom reports", "Dashboard components", "Filtering & grouping"] },
      { "week": 3, "topic": "Automation with Flows", "points": ["Flow Builder intro", "Screen flows vs. autolaunched", "Simple approval workflows"] },
      { "week": 4, "topic": "Security Fundamentals", "points": ["Profiles & permission sets", "Sharing rules", "Field-level security"] }
    ],
    "outcomes": [
      "Confidently navigate Salesforce UI and understand the data model",
      "Create reports and dashboards for real business insights",
      "Build no-code automation with Flow Builder",
      "Understand security layers and role hierarchy"
    ],
    "whoThisIsFor": "Career-switchers exploring Salesforce for the first time, non-technical professionals who need to understand the ecosystem, or anyone preparing to jump into Development or QA tracks with a strong foundation.",
    "testimonial": {
      "name": "Sneha Patil",
      "role": "Salesforce Admin Trainee",
      "quote": "I had zero IT background. This course broke everything down in simple terms and by week 4 I was building flows on my own. Perfect starting point!",
      "photo": null
    },
    "faq": [
      { "q": "Do I need any technical background?", "a": "No. This is designed for absolute beginners with no prior Salesforce or IT experience." },
      { "q": "Can I skip this if I want to become a developer?", "a": "You can, but we recommend Foundation for anyone unfamiliar with Salesforce. It makes the Development track much easier." }
    ],
    "enrollLabel": "Salesforce Foundation — ₹1,999"
  },
  "crash-course": {
    "title": "Salesforce Crash Course",
    "tagline": "Interview-ready in one month",
    "chips": ["22 hrs/month", "Intermediate", "1 Month"],
    "description": "Fast-paced primer for career-switchers who want to hit the ground running. Covers everything in Foundation plus Apex fundamentals, SOQL, and an intro to Lightning Web Components. Live classes, guided assignments, just enough theory to make the code stick.",
    "weekByWeek": [
      { "week": 1, "topic": "Foundation Speedrun", "points": ["Objects, fields, security recap", "Reports & automation essentials"] },
      { "week": 2, "topic": "Apex Fundamentals", "points": ["Triggers & classes", "SOQL queries", "DML operations"] },
      { "week": 3, "topic": "Advanced Apex", "points": ["Bulkification patterns", "Error handling", "Test classes"] },
      { "week": 4, "topic": "Lightning Web Components Intro", "points": ["LWC basics", "Component wiring", "Guided assignment walkthrough"] }
    ],
    "outcomes": [
      "Write Apex triggers and classes for real business logic",
      "Query Salesforce data with SOQL and manipulate it via DML",
      "Build a basic Lightning Web Component",
      "Ace entry-level Salesforce Developer interviews"
    ],
    "whoThisIsFor": "Bootcamp grads, self-taught programmers, or working professionals pivoting into Salesforce who want the shortest path to interview-ready status.",
    "testimonial": {
      "name": "Anand Kumar",
      "role": "Salesforce Trainee",
      "quote": "I joined with zero coding background. Within weeks I was writing triggers and building LWC components. Landed my trainee role at BM Cloud Consultancy right after!",
      "photo": null
    },
    "faq": [
      { "q": "Is one month really enough?", "a": "For someone with basic programming logic, yes. You'll be interview-ready for junior roles. For deeper mastery, consider Complete Course." },
      { "q": "What if I have no coding experience?", "a": "Start with Foundation first to build confidence, then jump into Crash Course." }
    ],
    "enrollLabel": "Salesforce Crash Course — ₹9,999"
  },
  "complete-course": {
    "title": "Salesforce Complete Course",
    "tagline": "End-to-end Admin + Dev mastery",
    "chips": ["70 hrs", "Advanced", "3 Months", "Capstone Project"],
    "description": "The full deep dive — Admin foundations, advanced Apex, LWC in depth, REST/SOAP integrations, and a deployable Loan/Case Management capstone project. This is the track for anyone serious about becoming a production-ready Salesforce Developer.",
    "weekByWeek": [
      { "week": 1, "topic": "Admin Foundations", "points": ["Objects, security, automation", "Reports, dashboards, data lifecycle"] },
      { "week": 2, "topic": "Apex Fundamentals", "points": ["Triggers, classes, SOQL, DML"] },
      { "week": 3, "topic": "Advanced Apex", "points": ["Bulkification, async Apex, test classes"] },
      { "week": 4, "topic": "Lightning Web Components", "points": ["LWC architecture, data binding, wire service"] },
      { "week": 5, "topic": "LWC Deep Dive", "points": ["Parent-child communication", "Apex imperative calls", "Error handling"] },
      { "week": 6, "topic": "REST & SOAP Integrations", "points": ["HTTP callouts, OAuth flows", "Named credentials"] },
      { "week": 7, "topic": "Capstone Project Kickoff", "points": ["Loan/Case Management system design", "User stories & data model"] },
      { "week": 8, "topic": "Capstone Build", "points": ["Apex logic implementation", "LWC UI development"] },
      { "week": 9, "topic": "Capstone Integration", "points": ["REST API integration", "Deployment & testing"] },
      { "week": 10, "topic": "Mock Interviews & Placement Prep", "points": ["Resume reviews", "Technical mock interviews", "Job referrals"] }
    ],
    "outcomes": [
      "Build production-grade Salesforce apps with Apex + LWC",
      "Integrate external systems via REST/SOAP APIs",
      "Deploy a complete Loan/Case Management system to your portfolio",
      "Clear Salesforce PD1 certification and land mid-level developer roles"
    ],
    "whoThisIsFor": "Anyone who wants complete hands-on knowledge and a portfolio project that stands out in interviews. Ideal for career-switchers, bootcamp grads, or professionals upskilling for senior roles.",
    "testimonial": {
      "name": "Priyanka Rajguru",
      "role": "Salesforce Developer",
      "quote": "The capstone project gave me something real to show in interviews. The mentors break down complex topics so clearly. Highly recommend Apexoria!",
      "photo": null
    },
    "faq": [
      { "q": "Is this overkill if I just want a junior role?", "a": "If budget and time allow, Complete Course gives you an edge even for junior roles. But Crash Course is sufficient for entry-level." },
      { "q": "Do I get lifetime access to recordings?", "a": "Yes, all class recordings and materials remain accessible after course completion." },
      { "q": "What's the Capstone project?", "a": "A deployable Loan/Case Management system built with Apex, LWC, and REST integrations — real complexity that interviewers respect." }
    ],
    "enrollLabel": "Salesforce Complete Course — ₹21,999"
  },
  "salesforce-qa": {
    "title": "Salesforce QA Testing",
    "tagline": "Land a no-code Salesforce testing role",
    "chips": ["60 hrs", "No-Code", "2.5 Months"],
    "description": "Manual + API testing built specifically around Salesforce apps. Learn UI testing, data validation, Postman-based API testing, JIRA workflows, and Salesforce-specific QA scenarios you'll actually be asked about in interviews.",
    "weekByWeek": [
      { "week": 1, "topic": "QA Fundamentals & STLC", "points": ["Software testing lifecycle", "Test case design", "Bug reporting"] },
      { "week": 2, "topic": "Salesforce UI Testing", "points": ["Manual testing on standard/custom objects", "Data validation scenarios"] },
      { "week": 3, "topic": "API Testing with Postman", "points": ["REST API basics", "Salesforce REST API testing", "Collections & environments"] },
      { "week": 4, "topic": "Agile & JIRA", "points": ["Agile workflows", "User stories & acceptance criteria", "JIRA ticket management"] },
      { "week": 5, "topic": "Salesforce-Specific Scenarios", "points": ["Testing integrations", "Validation rules & flows", "Security & permissions testing"] },
      { "week": 6, "topic": "Mock Interviews & Placement Prep", "points": ["QA interview questions", "Resume reviews", "Job referrals"] }
    ],
    "outcomes": [
      "Write comprehensive test cases for Salesforce apps",
      "Perform manual and API testing with Postman",
      "Understand Agile/JIRA workflows used in real teams",
      "Land entry-level Salesforce QA roles without writing code"
    ],
    "whoThisIsFor": "Non-coders looking for Salesforce careers, manual testers pivoting into CRM testing, or anyone who wants a no-code path into the Salesforce ecosystem.",
    "testimonial": {
      "name": "Aditya Tandiye",
      "role": "Salesforce QA Analyst",
      "quote": "The mock interviews made me confident. I cleared my first QA role interview on the second attempt and the placement support was genuine.",
      "photo": null
    },
    "faq": [
      { "q": "Do I need coding skills?", "a": "No. This track is 100% no-code. You'll learn Postman and JIRA, but no programming." },
      { "q": "Can I switch to automation later?", "a": "Yes! After completing this, you can enroll in our Automation QA track to learn Playwright and Provar." }
    ],
    "enrollLabel": "Salesforce QA Testing Course — ₹17,999"
  },
  "automation-qa": {
    "title": "Salesforce Automation QA",
    "tagline": "Level up into high-end automation testing",
    "chips": ["Advanced", "Automation Track", "~30% Coding"],
    "description": "For QA engineers who want to automate at scale. Playwright, Provar, Selenium fundamentals, CI/CD patterns, and real-world Salesforce automation scenarios used in production teams.",
    "weekByWeek": [
      { "week": 1, "topic": "Automation Fundamentals", "points": ["Why automate?", "Test automation pyramid", "Tooling landscape"] },
      { "week": 2, "topic": "Playwright for Web", "points": ["Setup & first test", "Locators & assertions", "Page Object Model"] },
      { "week": 3, "topic": "Provar for Salesforce", "points": ["Provar architecture", "Test case creation", "Data-driven testing"] },
      { "week": 4, "topic": "Selenium Basics", "points": ["WebDriver fundamentals", "Cross-browser testing", "Waits & synchronization"] },
      { "week": 5, "topic": "CI/CD Integration", "points": ["Jenkins/GitHub Actions", "Automated test pipelines", "Reporting & notifications"] },
      { "week": 6, "topic": "Real-World Scenarios", "points": ["Salesforce Lightning automation", "API + UI hybrid tests", "Mock interviews"] }
    ],
    "outcomes": [
      "Build end-to-end test suites with Playwright and Provar",
      "Integrate automated tests into CI/CD pipelines",
      "Understand Selenium patterns and cross-browser challenges",
      "Land high-end automation QA roles in Salesforce teams"
    ],
    "whoThisIsFor": "Manual QA engineers ready to upskill into automation, SDET aspirants, or developers pivoting into QA automation roles.",
    "testimonial": {
      "name": "Rohit Deshmukh",
      "role": "Automation QA Engineer",
      "quote": "Provar was new to me. The real-world scenarios and CI/CD integration made everything click. Got placed as an SDET within a month of finishing.",
      "photo": null
    },
    "faq": [
      { "q": "Do I need programming experience?", "a": "Basic coding logic helps (~30% of the course involves JavaScript/Java). If you're completely non-technical, start with Salesforce QA first." },
      { "q": "Is this only for Salesforce?", "a": "Playwright and Selenium skills transfer to any web app. Provar is Salesforce-specific." }
    ],
    "enrollLabel": "Salesforce Automation QA — ₹22,000"
  },
  "interview-prep": {
    "title": "Salesforce Interview Preparation",
    "tagline": "Turn your skills into signed offers",
    "chips": ["2 Weeks", "Career Accelerator", "Post-Job Support"],
    "description": "Short-form program for anyone with basic Salesforce knowledge who needs the interview edge. 10 personalized mock interviews (Dev + QA), resume optimization, LinkedIn + Naukri profile setup, and 2 months of post-job support.",
    "weekByWeek": [
      { "week": 1, "topic": "Resume & Profile Optimization", "points": ["ATS-friendly resume rewrite", "LinkedIn keyword optimization", "Naukri profile setup"] },
      { "week": 2, "topic": "Mock Interviews & Feedback", "points": ["10 personalized mock interviews", "Dev + QA scenario coverage", "Post-job onboarding guidance"] }
    ],
    "outcomes": [
      "ATS-optimized resume that gets past automated screens",
      "LinkedIn and Naukri profiles that recruiters actually find",
      "Confidence to ace Salesforce interviews (Dev or QA)",
      "2 months of guidance through your first 60 days on the job"
    ],
    "whoThisIsFor": "Bootcamp grads ready to interview, self-taught developers with projects but no job yet, working professionals switching companies, or anyone with Salesforce skills who struggles at the interview stage.",
    "testimonial": {
      "name": "Meera Joshi",
      "role": "Salesforce Developer",
      "quote": "I had the skills but kept failing interviews. The mock sessions pinpointed exactly where I was weak. Got 3 offers within 2 weeks of finishing the program.",
      "photo": null
    },
    "faq": [
      { "q": "Do I need to complete a course first?", "a": "No, but you should already know Salesforce basics (Admin, Apex, or QA fundamentals). This is interview prep, not a learning track." },
      { "q": "What if I don't get a job?", "a": "We provide referrals and support, but job outcomes depend on your skill level and market conditions. This program maximizes your chances." }
    ],
    "enrollLabel": "Salesforce Interview Preparation — ₹2,999"
  }
};
