import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import Navbar from "@/components/site/Navbar";
import LeadForm from "@/components/site/LeadForm";
import CourseDetailSection from "@/components/site/course-detail/CourseDetailSection";
import { Reveal } from "@/components/site/Reveal";
import { COURSES_PAGE as TEST_IDS } from "@/constants/testIds/home";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const FinalCTA = lazy(() => import("@/components/site/FinalCTA"));
const Footer = lazy(() => import("@/components/site/Footer"));
const WhatsAppWidget = lazy(() => import("@/components/site/WhatsAppWidget"));

const COURSE_ORDER = ["foundation", "crash-course", "complete-course", "salesforce-qa", "automation-qa", "interview-prep"];

export default function CoursesPage() {
  const [prefillCourse, setPrefillCourse] = useState("");

  useEffect(() => {
    const setMeta = (selector, attr, value) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const prev = el.getAttribute(attr);
      el.setAttribute(attr, value);
      return () => el.setAttribute(attr, prev ?? '');
    };

    const prevTitle = document.title;
    document.title = 'All Salesforce Courses — Apexoria Learning';

    const restorers = [
      setMeta('meta[name="description"]', 'content', 'Browse all 6 Salesforce training tracks at Apexoria Learning — Foundation, Crash Course, Complete Course, QA Testing, Automation QA, and Interview Preparation. Live cohorts, placement support, transparent pricing.'),
      setMeta('meta[property="og:title"]', 'content', 'All Salesforce Courses — Apexoria Learning'),
      setMeta('meta[property="og:description"]', 'content', 'Browse all 6 Salesforce tracks — Foundation, Crash Course, Complete Course, QA, Automation QA, Interview Prep. Live cohorts + placement support.'),
      setMeta('meta[property="og:url"]', 'content', 'https://www.apexorialearning.in/courses'),
      setMeta('meta[name="twitter:title"]', 'content', 'All Salesforce Courses — Apexoria Learning'),
      setMeta('meta[name="twitter:description"]', 'content', 'Browse all 6 Salesforce tracks — Foundation, Crash Course, Complete Course, QA, Automation QA, Interview Prep.'),
    ].filter(Boolean);

    return () => {
      document.title = prevTitle;
      restorers.forEach(fn => fn());
    };
  }, []);

  const handleEnroll = useCallback((course) => {
    if (course) setPrefillCourse(course);
    // Scroll to #contact on this page. The anchor is inside the inline LeadForm below.
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  }, []);

  return (
    <div className="font-body">
      <Navbar onEnroll={() => handleEnroll()} />

      {/* Hero band */}
      <section data-testid={TEST_IDS.hero} className="bg-navy py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
              Our Courses
            </span>
          </Reveal>
          <Reveal>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mt-4 leading-[0.9]">
              Explore All 6 Courses
            </h1>
          </Reveal>
          <Reveal>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
              From beginner foundations to advanced automation, find the Salesforce path that matches your goals.
              Every course includes live classes, hands-on projects, and placement support.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Course detail sections */}
      {COURSE_ORDER.map((id, i) => (
        <CourseDetailSection key={id} courseId={id} onEnroll={handleEnroll} index={i} />
      ))}

      {/* Inline LeadForm */}
      <div data-testid={TEST_IDS.inlineLeadForm}>
        <LeadForm prefillCourse={prefillCourse} />
      </div>

      <Suspense fallback={null}>
        <FinalCTA onEnroll={handleEnroll} />
        <Footer />
        <WhatsAppWidget />
      </Suspense>

      <Toaster position="top-center" richColors />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
