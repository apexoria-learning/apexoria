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
  "student1Webp": "/images/student-1.webp",
  "student2": "/images/student-2.jpg",
  "student2Webp": "/images/student-2.webp",
  "student2640": "/images/student-2-640w.jpg",
  "student2640Webp": "/images/student-2-640w.webp",
  "team": "/images/team.jpg",
  "teamWebp": "/images/team.webp"
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

// Legal pages — rendered at /privacy and /terms. Content is Markdown
// authored via the CMS "Legal Pages" section. Leave `contentMd` blank
// to render the empty-state placeholder + noindex signal.
export const LEGAL_PAGES = {
  "privacy": {
    "title": "Privacy Policy",
    "metaDescription": "How Apexoria Learning collects, uses, and protects your personal data.",
    "lastUpdated": "",
    "contentMd": "# Apexoria Learning — Privacy Policy\n\n**Effective Date**: 30 July 2026\n**Version**: 1.0\n**Applies to**: apexorialearning.in, and all personal data collected by Apexoria Learning through the website, WhatsApp, email, phone, and its live-online training programs.\n\n***\n\n## 1\\. Who We Are\n\napexorialearning.in and the Apexoria Learning training programs are operated by:\n\n* **Kajal Kohale**, sole proprietor, trading as **Apexoria Learning**\n* **Location**: Nagpur, Maharashtra, India\n* **GSTIN**: {{GSTIN}}\n* **Email**: apexorialearning@gmail.com\n* **Phone / WhatsApp**: +91 7498490687\n\nFor the purposes of the Digital Personal Data Protection Act, 2023 (\"DPDP Act\") and the Information Technology Act, 2000 (with the Reasonable Security Practices and Procedures and Sensitive Personal Data or Information Rules, 2011), **Kajal Kohale, sole proprietor trading as Apexoria Learning, is the Data Fiduciary** responsible for the personal data described in this Privacy Policy.\n\nThis Privacy Policy explains what personal data we collect, why we collect it, how we use it, who we share it with, how long we keep it, and what rights you have as a Data Principal.\n\n***\n\n## 2\\. Who This Policy Applies To\n\nThis Privacy Policy applies to:\n\n* **Visitors** to apexorialearning.in.\n* **Prospective students** who submit our enquiry form, or who contact us on WhatsApp, phone, or email.\n* **Enrolled students** in any Apexoria Learning batch — Salesforce Admin, Salesforce Developer, Salesforce Complete Course, Salesforce QA (Manual + API), Salesforce QA Automation, and any specialist track.\n* **Alumni** who continue to receive placement support or community access after completing a batch.\n* Anyone who consents to feature in a testimonial, case study, or student-success story.\n\n***\n\n## 3\\. Personal Data We Collect\n\nWe only collect personal data that is necessary for the purposes described in Section 4.\n\n### 3.1 From the Enquiry Form on the Website\n\n* Full name\n* Email address\n* Phone number (with country code)\n* Track / course of interest\n* Current professional background (job title, years of experience, or \"student / fresh graduate\" — a short free-text field)\n* Any additional message you choose to send us\n\n### 3.2 From WhatsApp, Phone, and Email\n\n* The contents of the messages, calls, and emails you send us.\n* Discovery-call notes recorded by our enrolment team during voice calls (topic discussed, track of interest, expected batch, follow-up date).\n\n### 3.3 At Enrolment\n\n* Payment reference — UPI transaction ID or bank transfer reference number.\n* Billing name and postal address, **only if** you request a GST invoice.\n* Batch and cohort you are enrolled in.\n\n### 3.4 During the Training Program\n\n* Session attendance records (dates and durations of the sessions you joined).\n* The name and email address you use to join Zoom or Google Meet sessions.\n* Submissions and code you share for labs and the capstone project. You submit these using your **own personal Salesforce Developer Org** — we do not create or hold Salesforce accounts on your behalf.\n\n### 3.5 Website Analytics\n\n* We use **Vercel Web Analytics**, which is a cookieless, privacy-friendly analytics service. It measures aggregate metrics such as page views, referrers, and approximate country of visit. It does not use persistent identifiers, does not track you across other websites, and does not store your IP address.\n\n### 3.6 For Testimonials and Success Stories\n\nOnly if you give us your explicit, informed, and withdrawable consent, we may additionally collect:\n\n* Your written testimonial or interview responses.\n* Your photo, video clip, or LinkedIn profile URL.\n* The name of your new employer and your new job title, if you choose to share them.\n\nTestimonial consent is captured separately in writing (email or WhatsApp) and can be withdrawn at any time (see Section 10).\n\n### 3.7 What We Do NOT Collect\n\n* **We do not record live sessions.** Apexoria Learning's teaching model is live-only. Sessions are not recorded, archived, or shared as playback. See our recordings decision at [`08-key-activities/decisions/2026-07-25-no-recordings-policy.md`](../08-key-activities/decisions/2026-07-25-no-recordings-policy.md) for the reasoning.\n* **We do not collect a government-issued ID at any stage.** The name printed on your certificate of completion is the name you provided at enrolment.\n* **We do not ask for or store your Salesforce, Trailhead, or Trailblazer.me passwords.**\n* **We do not store payment-card details.** We currently accept payments only via UPI and direct bank transfer; no card data ever touches our systems.\n* We do not collect biometric data, health data, or other special-category personal data.\n* We do not knowingly collect personal data from children under 18 (see Section 12).\n\n***\n\n## 4\\. Why We Collect It \\(Purposes of Processing\\)\n\nWe use your personal data only for the following purposes:\n\n1. **Responding to your enquiry** — contacting you by phone, WhatsApp, or email to discuss your goals and the right track for you.\n2. **Delivering the course you enrolled in** — sending session links, sharing course notes and lab briefs, tracking attendance, and grading your capstone.\n3. **Issuing your certificate of completion** — the certificate carries the name you provided at enrolment.\n4. **Placement support** — sharing your resume with hiring partners with your explicit prior consent, arranging mock interviews, and issuing referral introductions.\n5. **Billing, GST, and tax compliance** — issuing invoices and maintaining records required under Indian tax law.\n6. **Communicating important service notices** — batch schedule changes, cohort re-scheduling, batch-transfer confirmations, refund confirmations under Sections 4 and 5 of the [Refund Policy](06-refund-policy.md).\n7. **Non-promotional community updates** — for alumni who opt in.\n8. **Aggregate service improvement** — using Vercel Web Analytics to understand which pages help visitors most.\n9. **Testimonials, case studies, and student-success stories** — only with your explicit written consent, which you can withdraw at any time.\n\nWe do not use your personal data for any purpose that is not listed above.\n\n***\n\n## 5\\. Legal Basis for Processing \\(DPDP Act\\, 2023\\)\n\nWe process your personal data on the following legal bases under the DPDP Act:\n\n* **Consent** (Section 6, DPDP Act) — for testimonials, case studies, photos, videos, and any promotional communication that is not directly tied to a service you already have with us.\n* **Legitimate use** (Section 7, DPDP Act) — for responding to enquiries you have initiated with us, for delivering the course you have paid for, for issuing certificates, for placement support to enrolled students and alumni, and for meeting our legal obligations under Indian tax and consumer-protection laws.\n\nWhere processing depends on your consent, you can withdraw that consent at any time using the process described in Section 10. Withdrawal of consent does not affect the lawfulness of processing carried out before the withdrawal.\n\n***\n\n## 6\\. Who We Share Your Personal Data With\n\nWe do not sell your personal data. We do not share your personal data with third parties for their own advertising or marketing.\n\nWe share your personal data only with the following categories of recipients, and only to the extent necessary for the purposes described in Section 4.\n\n### 6.1 Third-Party Service Providers (Data Processors)\n\nThe following service providers process your personal data on our behalf under standard commercial terms. Several of them are located outside India, so processing your data through these services involves a **cross-border transfer** of personal data.\n\n| Service Provider | Purpose | Location of Processing |\n| ---------------- | ------- | ---------------------- |\n| Vercel Inc. | Website hosting and cookieless web analytics | United States |\n| Salesforce.com, inc. | Customer Relationship Management — stores enquiry-form leads and enrolment records | United States |\n| Google LLC (Google Workspace, Google Drive, Google Meet) | Email, document storage for course notes and lab briefs, and live-class delivery | United States |\n| Zoom Video Communications, Inc. | Live-class delivery for some batches | United States |\n| Meta Platforms Ireland Ltd. / WhatsApp LLC | WhatsApp messaging for enquiries, discovery calls, batch communication | Ireland / United States |\n| Our banking partner and UPI infrastructure | Processing your fee payment | India |\n\nBy using the website, submitting the enquiry form, or enrolling in a program, you acknowledge that your personal data may be processed in the countries listed above, which may have data-protection laws different from those of India. We select service providers with published privacy and security commitments appropriate to the type of data involved.\n\n### 6.2 Legal and Regulatory Recipients\n\nWe may disclose your personal data:\n\n* To the Chartered Accountant and the tax authorities of India, to comply with GST, income tax, and other statutory requirements.\n* To a court, tribunal, law-enforcement authority, or regulator, where we are required to do so under Indian law.\n* To our legal advisors, in confidence, when it is necessary to protect our rights or defend a claim.\n\n### 6.3 Hiring Partners (Only With Consent)\n\nFor enrolled students and alumni who have opted in to placement support, we share your resume, capstone project, and (with your prior express consent) your contact details with our hiring partners.\n\n***\n\n## 7\\. How Long We Keep Your Personal Data \\(Retention\\)\n\nWe keep your personal data only for as long as is necessary for the purposes for which it was collected, plus any period required by law.\n\n| Category | Retention Period |\n| -------- | ---------------- |\n| Enquiry-form leads that do not convert | Up to 24 months from your last contact with us, then deleted. |\n| Enrolled-student records (name, contact, enrolment, payments, attendance) | 7 years from batch completion — required for Indian tax and consumer-record retention. |\n| Session attendance and class-participation logs | 3 years from batch completion. |\n| Testimonials, photos, videos, and success-story content | Until you withdraw consent, after which the content is removed from our public materials within 30 days. |\n| Placement-support records (resume, interview outcomes) | 3 years from your placement, or until you request deletion, whichever is earlier. |\n| Website analytics (aggregate) | 12 months. Does not identify individuals. |\n\nAfter the retention period, we either securely delete the personal data or anonymise it so that it can no longer be linked to you.\n\n***\n\n## 8\\. Cookies and Tracking Technologies\n\napexorialearning.in currently uses **Vercel Web Analytics**, which is cookieless. It does not place tracking cookies on your device, does not use persistent identifiers, and does not track you across other websites.\n\nWe do **not** currently use:\n\n* Google Analytics (GA4)\n* Meta Pixel / Facebook Pixel\n* LinkedIn Insight Tag\n* Any other advertising, remarketing, or cross-site tracking cookie.\n\nIf we add any tracking that uses cookies or similar technologies in future, we will update this Privacy Policy, publish a cookie consent banner on the website, and ask for your consent before setting any non-essential cookie.\n\n***\n\n## 9\\. How We Protect Your Personal Data \\(Security\\)\n\nWe take reasonable technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction, appropriate to the nature of the data. These measures include:\n\n* Two-factor authentication on the Google Workspace accounts we use to receive and store enquiries and course materials.\n* Role-based access controls in our Salesforce CRM, so that lead and enrolment data is accessible only to team members who need it.\n* Password-protected access to shared course notes and lab briefs on Google Drive.\n* HTTPS (TLS) encryption for all traffic to and from the website.\n* A limited-access banking channel for payment receipts, held only by Kajal Kohale as sole proprietor.\n\nNo system connected to the internet is perfectly secure. If a personal data breach affects your rights, we will notify you and the Data Protection Board of India in accordance with the DPDP Act.\n\n***\n\n## 10\\. Your Rights as a Data Principal\n\nUnder the DPDP Act, 2023, you have the following rights in respect of your personal data:\n\n1. **Right to access** — you can ask us for a summary of the personal data we hold about you and the purposes for which it is processed.\n2. **Right to correction and erasure** — you can ask us to correct inaccurate data or to erase data that is no longer needed for the purpose it was collected for (subject to our legal record-keeping obligations described in Section 7).\n3. **Right to withdraw consent** — where processing is based on your consent (for example, testimonials, photos, or promotional communications), you can withdraw that consent at any time.\n4. **Right to nominate** — you can nominate another individual to exercise your rights on your behalf in the event of your death or incapacity.\n5. **Right to grievance redressal** — you can raise a concern with our Grievance Officer, who will respond within the timeline set out in Section 11.\n6. **Right to lodge a complaint** — if you are not satisfied with our response, you have the right to complain to the Data Protection Board of India constituted under the DPDP Act.\n\n### How to Exercise Your Rights\n\n* Email us at **apexorialearning@gmail.com** with the subject line **\"Data Principal Request\"**, describing the right you wish to exercise.\n* Include enough information for us to verify your identity (the email address / phone number under which we hold your data, and the approximate date of the last interaction).\n* We will respond within **30 days**. If your request is complex, we will tell you why we need more time.\n\n***\n\n## 11\\. Grievance Officer\n\nIf you have a concern about how your personal data has been handled, you may contact our Grievance Officer:\n\n* **Name**: Kajal Kohale\n* **Designation**: Grievance Officer, Apexoria Learning\n* **Email**: apexorialearning@gmail.com\n* **Postal address**: Nagpur, Maharashtra, India\n* **Response commitment**: We will acknowledge your grievance within 3 business days and provide a substantive response within 30 days of receipt, in accordance with the DPDP Act.\n\n***\n\n## 12\\. Children\n\nOur services are intended for adults aged 18 or above. We do not knowingly market to, or knowingly collect personal data from, any individual below the age of 18.\n\nIf we become aware that we have inadvertently collected personal data from a person below 18, we will delete that data promptly. If you believe we hold data about a child, please contact the Grievance Officer at the address above so we can act quickly.\n\n***\n\n## 13\\. Payment Data\n\nWe do not collect or store payment-card details. Fees are paid to Apexoria Learning via:\n\n* **UPI** (QR code or VPA) into the business bank account of Kajal Kohale, sole proprietor, or\n* **Direct bank transfer** into the same business bank account.\n\nYour UPI ID or bank account number is visible to us only to the extent it is disclosed by the UPI or banking network on the receipt of your payment. This information is used to identify your payment and issue a receipt / GST invoice, and to process a refund back to the same account if one becomes due under the [Refund Policy](06-refund-policy.md).\n\nIf we introduce a payment gateway in future (for example, Razorpay or PayU), we will update this Privacy Policy to describe the additional processor and the additional data it will handle, before switching it on.\n\n***\n\n## 14\\. Communications From Us\n\nIf you are an enrolled student, we will send you course-related communications (batch schedules, session links, schedule changes) throughout your batch. These are essential for delivering the service you have paid for and are not marketing communications.\n\nFor promotional communications — for example, batch launches, webinars, blog posts, or referral offers — we rely on your consent. You can opt out of promotional communications at any time by:\n\n* Replying **STOP** on WhatsApp, or\n* Emailing **apexorialearning@gmail.com** with the subject line \"Unsubscribe\".\n\nOpting out of promotional communications does not stop essential service communications while you are enrolled in a batch.\n\n***\n\n## 15\\. Changes to This Privacy Policy\n\nWe may update this Privacy Policy from time to time to reflect changes in law, in the services we use, or in our own practices. When we do, we will change the \"Effective Date\" at the top of this page. If the change is material and affects the rights of existing enrolled students, we will notify them by email or WhatsApp at least 14 days before the updated version takes effect.\n\nWe recommend checking this page occasionally to stay informed about how we protect your personal data.\n\n***\n\n## 16\\. Governing Law and Jurisdiction\n\nThis Privacy Policy is governed by, and construed in accordance with, the laws of India, including the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000. Any dispute arising out of or in connection with this Privacy Policy shall be subject to the exclusive jurisdiction of the courts at **Nagpur, Maharashtra, India**, without prejudice to your statutory right to complain to the Data Protection Board of India.\n\n***\n\n## 17\\. Contact\n\n* **Email**: apexorialearning@gmail.com\n* **WhatsApp / Phone**: +91 7498490687\n* **Grievance Officer**: Kajal Kohale (see Section 11)\n* **Response time**: Within 24 hours on business days for general questions; within the timelines in Sections 10 and 11 for Data Principal requests and grievances.\n\n***\n\n*By using apexorialearning.in, submitting the enquiry form, contacting us on WhatsApp / phone / email, or enrolling in an Apexoria Learning program, you confirm that you have read and understood this Privacy Policy.*"
  },
  "terms": {
    "title": "Terms of Service",
    "metaDescription": "Terms of enrolment and use of Apexoria Learning courses and website.",
    "lastUpdated": "",
    "contentMd": "# Apexoria Learning — Website Terms of Use\n\n**Effective Date**: 30 July 2026\n**Version**: 1.0\n**Applies to**: apexorialearning.in and all sub-pages\n\n***\n\n## 1\\. About this website\n\napexorialearning.in (\"the website\", \"we\", \"us\", \"our\") is operated by:\n\n* **Kajal Kohale**, sole proprietor, trading as **Apexoria Learning**\n* **Location**: Nagpur, Maharashtra, India\n* **GSTIN**: {{GSTIN}}\n* **Email**: apexorialearning@gmail.com\n* **Phone / WhatsApp**: +91 7498490687\n\nThese Terms of Use govern your access to and use of the website. Your access and use of the website is conditional on your acceptance of and compliance with these Terms.\n\n***\n\n## 2\\. Acceptance of Terms\n\nBy accessing, browsing, or using the website in any way, you confirm that you have read, understood, and agree to be bound by these Terms of Use, along with our [Privacy Policy](09-privacy-policy.md). If you do not agree, please stop using the website.\n\nIf you go on to enrol in an Apexoria Learning program, the following additional documents also apply to you and form part of the contract between you and Apexoria Learning:\n\n* [Terms of Use & Intellectual Property Policy (Enrolled Students)](07-terms-and-ip.md)\n* [Refund, Cancellation & Batch-Transfer Policy](06-refund-policy.md)\n\n***\n\n## 3\\. Nature of website content\n\n3.1 The website is provided for general information about Apexoria Learning's live-online training programs in Salesforce Administration, Salesforce Development, Salesforce QA (Manual + API), Salesforce QA Automation, and specialist tracks.\n\n3.2 Course descriptions, curriculum outlines, batch start dates, session schedules, fees, seat-hold amounts, and any illustrative offers displayed on the website are **for information only** and may be updated from time to time without prior notice.\n\n3.3 The binding offer for any specific batch is the **enrolment confirmation** issued to you individually by email or WhatsApp from Apexoria Learning, together with the payment receipt and the applicable policies referenced in Section 2 above. Nothing on the website itself constitutes a binding offer to sell training services.\n\n3.4 We reserve the right to modify, suspend, or discontinue any part of the website, any program, or any feature at any time, with reasonable notice where operationally possible.\n\n***\n\n## 4\\. No guarantees of outcome\n\n4.1 Apexoria Learning provides live-online training and career-preparation support. We do **not** guarantee employment, job offers, salary levels, promotions, certification exam results, or any specific career outcome.\n\n4.2 Any placement statistics, alumni counts, hiring-partner counts, batch-completion rates, or student reviews shown on the website describe past cohorts. Past results do not guarantee that any individual student will experience the same outcome.\n\n4.3 Apexoria Learning is an **independent training academy**. We are not affiliated with, endorsed by, or acting as an agent of Salesforce Inc., Salesforce.com Inc., or any of their subsidiaries. Any references to Salesforce products, certifications, or Trailhead are for descriptive purposes only. Salesforce certifications are issued by Salesforce Inc. under their own terms; we prepare you for them but do not issue them.\n\n***\n\n## 5\\. Enquiry form and contact\n\n5.1 When you submit the enquiry form or send us a message on WhatsApp, email, or phone, you consent to being contacted by the Apexoria Learning enrolment team on the number, email address, or WhatsApp identifier you have provided, for the purpose of responding to your enquiry.\n\n5.2 The full details of what personal data we collect through the enquiry form and other contact channels, how we use it, how long we keep it, who we share it with, and your rights as a data principal are set out in our [Privacy Policy](09-privacy-policy.md).\n\n5.3 You are responsible for ensuring that the information you submit is accurate and belongs to you. Please do not submit another person's personal data through the enquiry form without their consent.\n\n***\n\n## 6\\. WhatsApp and third\\-party communication channels\n\n6.1 The \"Chat on WhatsApp\" button and any similar click-to-chat links on the website open a conversation on WhatsApp Messenger, a service operated by Meta Platforms. Your use of WhatsApp is separately governed by Meta's own terms and privacy policy.\n\n6.2 Communications you send us via WhatsApp are handled by us as described in the [Privacy Policy](09-privacy-policy.md).\n\n***\n\n## 7\\. Links to external websites\n\n7.1 The website may link to external websites — for example, LinkedIn, Instagram, YouTube, Trailhead, Salesforce Inc., partner blogs, or news articles.\n\n7.2 Apexoria Learning does not control and is not responsible for the content, availability, accuracy, or privacy practices of any external website. Following an external link is at your own risk, and any interaction with that external site is subject to that site's own terms.\n\n***\n\n## 8\\. Intellectual property\n\n8.1 All content on the website — including but not limited to page copy, headlines, course descriptions, curriculum outlines, diagrams, downloadable brochures, lead magnets, PDFs, blog posts, images, illustrations, videos, logos, brand marks, colour palettes, and the underlying structure of the site — is the exclusive intellectual property of Apexoria Learning (Kajal Kohale, sole proprietor) and is protected under Indian copyright, trademark, and related intellectual property laws.\n\n8.2 You may:\n\n* View, read, and print pages for your own personal, non-commercial reference.\n* Share links to public pages on the website (e.g. sharing a course page URL with a friend).\n* Reference Apexoria Learning by name in a review, blog post, or social-media post, provided the reference is truthful and does not imply endorsement, affiliation, or partnership that does not exist.\n\n8.3 You may not, without prior written permission from Apexoria Learning:\n\n* Copy, reproduce, republish, distribute, or resell any content from the website.\n* Extract text, curriculum outlines, brochures, or lead magnets and use them in your own training program, video course, YouTube channel, or paid content.\n* Use Apexoria Learning's name, logo, or brand marks in a way that suggests you are affiliated with, endorsed by, or reselling on behalf of Apexoria Learning.\n* Scrape, harvest, or automatically download content from the website.\n* Use the website's content to train, fine-tune, or evaluate a machine-learning model or AI system.\n\n8.4 Violation of Section 8.3 may result in a takedown request, a claim for damages under the Copyright Act, 1957 and the Trade Marks Act, 1999, and — for enrolled students — removal from the batch under the [Enrolment Terms](07-terms-and-ip.md) without refund.\n\n***\n\n## 9\\. Instructor and enrolment\\-team identity\n\n9.1 Apexoria Learning's instructors and enrolment-team members may operate publicly under first-name-only introductions or agreed working names. By using the website, submitting the enquiry form, or joining a discovery call, you agree that you will not:\n\n* Attempt to research, identify, or publicly disclose the full legal name, employer, professional affiliation, or personal social-media profile of any Apexoria Learning instructor or enrolment-team member beyond what has been explicitly published by Apexoria Learning.\n* Tag, mention, or link any Apexoria Learning instructor's or enrolment-team member's personal social-media profile (LinkedIn, Twitter/X, Instagram, Facebook, or similar) in any public post, review, complaint, or platform without their prior written consent.\n* Share information about the identity or employer of any Apexoria Learning team member in student groups, social media, review platforms, or other public or semi-public channels.\n\n9.2 If you are an enrolled student, the corresponding clause in the [Enrolment Terms](07-terms-and-ip.md) also applies, and a breach may result in removal from the batch without refund.\n\n***\n\n## 10\\. Prohibited use of the website\n\nYou agree not to:\n\n* Use the website in any manner that could disable, overburden, damage, or impair the website or interfere with any other party's use of it.\n* Use any robot, spider, scraper, or other automated means to access the website for any purpose without our prior written consent, except for well-behaved search-engine crawlers respecting `robots.txt`.\n* Attempt to gain unauthorised access to any part of the website, any account, any linked system, or any computer or database connected to the website.\n* Submit fake, duplicate, or malicious enquiries, including test submissions, spam, phishing attempts, or credential-stuffing attacks against the enquiry form.\n* Introduce any virus, trojan, worm, logic bomb, or other harmful material.\n* Use the website in any way that violates applicable Indian law or the laws of the jurisdiction from which you access it.\n\n***\n\n## 11\\. Fees\\, payments\\, and enrolment\n\n11.1 Course fees, seat-hold amounts, and the \"pay ₹4,999 to start, pay the rest once confident\" arrangement are described on the relevant course pages of the website.\n\n11.2 Apexoria Learning currently collects payments via UPI (QR / VPA) and direct bank transfer to the business bank account held under the sole proprietorship. Apexoria Learning does not store payment-card details. Any future payment-gateway integration will be handled under the same sole proprietorship and disclosed on the enrolment page.\n\n11.3 The [Refund, Cancellation & Batch-Transfer Policy](06-refund-policy.md) governs what happens if you change your mind, if you cannot continue in a batch, or if Apexoria Learning cancels or postpones a batch.\n\n***\n\n## 12\\. Disclaimer\n\n12.1 The website is provided on an \"as is\" and \"as available\" basis. To the maximum extent permitted by applicable law, Apexoria Learning makes no representations or warranties of any kind, express or implied, regarding the operation of the website, or the accuracy, completeness, or timeliness of any content on it.\n\n12.2 Apexoria Learning does not warrant that the website will be uninterrupted, error-free, or free from viruses or other harmful components. You are responsible for maintaining your own antivirus protection and secure internet connection.\n\n***\n\n## 13\\. Limitation of liability\n\n13.1 Nothing in these Terms limits or excludes liability where such limitation or exclusion is not permitted under applicable Indian law.\n\n13.2 Subject to Section 13.1, Apexoria Learning shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or in connection with your use of, or inability to use, the website.\n\n13.3 Apexoria Learning's aggregate liability to any individual visitor for any claim arising from the visitor's use of the website (excluding paid enrolment, which is separately governed by the [Enrolment Terms](07-terms-and-ip.md)) shall not exceed ₹1,000 (Indian Rupees One Thousand).\n\n13.4 Apexoria Learning is not responsible for interruptions, failures, or errors caused by third-party platforms used to operate the website or deliver training — including but not limited to the hosting provider, the domain registrar, Zoom, Google Meet, Google Workspace, WhatsApp, Salesforce CRM, or any UPI/banking network.\n\n***\n\n## 14\\. Indemnity\n\nYou agree to indemnify and hold harmless Apexoria Learning (Kajal Kohale, sole proprietor) from and against any claim, demand, loss, liability, cost, or expense (including reasonable legal fees) arising out of:\n\n* Your breach of these Terms of Use;\n* Your misuse of the website;\n* Any content you submit through the enquiry form or other channels that infringes the rights of a third party.\n\n***\n\n## 15\\. Governing law and jurisdiction\n\n15.1 These Terms of Use are governed by, and construed in accordance with, the laws of India.\n\n15.2 Any dispute arising out of or in connection with these Terms, your use of the website, or the relationship between you and Apexoria Learning shall be subject to the exclusive jurisdiction of the courts at **Nagpur, Maharashtra, India**.\n\n***\n\n## 16\\. Changes to these Terms\n\nWe may update these Terms of Use from time to time. When we do, we will change the \"Effective Date\" at the top of this page. If the change is material and affects enrolled students, we will notify enrolled students by email or WhatsApp at least 14 days before the change takes effect. Your continued use of the website after the Effective Date constitutes acceptance of the updated Terms.\n\n***\n\n## 17\\. Severability\n\nIf any provision of these Terms is found by a court of competent jurisdiction to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect, and the invalid provision shall be modified to the minimum extent necessary to be valid and enforceable while giving effect to the original intent.\n\n***\n\n## 18\\. Contact\n\nFor any question about these Terms of Use, please contact us:\n\n* **Email**: apexorialearning@gmail.com\n* **WhatsApp / Phone**: +91 7498490687\n* **Response time**: Within 24 hours on business days (Monday to Saturday)\n\n***\n\n*By continuing to use apexorialearning.in, you confirm that you have read, understood, and agreed to these Terms of Use.*"
  }
};

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
