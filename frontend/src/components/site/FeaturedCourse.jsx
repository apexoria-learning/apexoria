import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, CalendarDays, Radio, ArrowRight, FlaskConical, Download } from "lucide-react";
import { toast } from "sonner";
import { DEV_CURRICULUM, DEV_OUTCOMES, QA_CURRICULUM, SALESFORCE_LOGO, BROCHURE_URL } from "../../data";
import { Reveal } from "./Reveal";

export default function FeaturedCourse({ onEnroll }) {
  const [active, setActive] = useState(DEV_CURRICULUM[0].key);
  const activeCol = DEV_CURRICULUM.find((c) => c.key === active);

  const handleBrochureDownload = async (ev) => {
    ev.preventDefault();
    try {
      const res = await fetch(BROCHURE_URL, { method: "HEAD" });
      if (res.ok) {
        window.open(BROCHURE_URL, "_blank", "noopener,noreferrer");
      } else {
        toast.info("Brochure download will be available shortly. Please reach out on WhatsApp for details.");
      }
    } catch {
      toast.info("Brochure download will be available shortly. Please reach out on WhatsApp for details.");
    }
  };

  return (
    <section id="featured-course" data-testid="featured-course-section" className="bg-brand-gray py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">Featured Course</span>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <img src={SALESFORCE_LOGO} alt="Salesforce" className="h-12 md:h-14" loading="lazy" />
            <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-navy">
              Development Course
            </h2>
          </div>
          <p className="mt-4 text-xl md:text-2xl font-display font-semibold text-navy/80">
            Go from <span className="text-brand-gold">Zero to Developer</span> — build real apps, not just theory.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: Clock, label: "3 Months" },
              { icon: Radio, label: "Live Online Classes" },
              { icon: CalendarDays, label: "Weekday & Weekend Batches" },
            ].map((m, i) => (
              <span key={i} className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm font-semibold text-navy">
                <m.icon size={16} className="text-brand-blue" /> {m.label}
              </span>
            ))}
          </div>

          <p className="mt-6 max-w-3xl text-slate-600 leading-relaxed">
            Master the complete Salesforce development stack — <strong>Admin fundamentals</strong>, <strong>Apex</strong>,
            <strong> Lightning Web Components</strong> and <strong>Integrations</strong>. Taught live by experienced
            developers, with hands-on projects that mirror real CRM work.
          </p>
        </Reveal>

        {/* Curriculum: 4-col grid on desktop, tabs on mobile */}
        <div id="curriculum" className="mt-14">
          <div className="hidden md:grid grid-cols-4 gap-5">
            {DEV_CURRICULUM.map((col, i) => (
              <Reveal key={col.key} delay={i * 0.08}>
                <div
                  data-testid={`curriculum-card-${col.key}`}
                  className={`h-full rounded-2xl bg-white border p-6 shadow-lg shadow-navy/5 ${
                    col.badge ? "border-brand-green/40 ring-1 ring-brand-green/20" : "border-slate-200"
                  }`}
                >
                  <h3 className="font-display text-lg font-bold text-navy mb-4">{col.title}</h3>
                  {col.badge && (
                    <span className="inline-block mb-4 text-[10px] font-bold uppercase tracking-wider bg-brand-green text-white px-2.5 py-1 rounded-full">
                      {col.badge}
                    </span>
                  )}
                  <ul className="space-y-2.5">
                    {col.items.map((it) => (
                      <li key={it} className="flex gap-2 text-sm text-slate-600">
                        <Check size={16} className="text-brand-blue shrink-0 mt-0.5" /> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="md:hidden">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {DEV_CURRICULUM.map((col) => (
                <button
                  key={col.key}
                  data-testid={`curriculum-tab-${col.key}`}
                  onClick={() => setActive(col.key)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    active === col.key ? "bg-navy text-white" : "bg-white text-navy border border-slate-200"
                  }`}
                >
                  {col.title}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="mt-4 rounded-2xl bg-white border border-slate-200 p-6 shadow-lg"
              >
                {activeCol.badge && (
                  <span className="inline-block mb-3 text-[10px] font-bold uppercase tracking-wider bg-brand-green text-white px-2.5 py-1 rounded-full">
                    {activeCol.badge}
                  </span>
                )}
                <ul className="space-y-2.5">
                  {activeCol.items.map((it) => (
                    <li key={it} className="flex gap-2 text-sm text-slate-600">
                      <Check size={16} className="text-brand-blue shrink-0 mt-0.5" /> {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mini project callout */}
        <Reveal>
          <div data-testid="mini-project-callout" className="mt-10 rounded-2xl bg-white border-l-4 border-brand-blue p-8 shadow-lg shadow-navy/5">
            <h3 className="font-display text-xl font-bold text-brand-blue mb-2">
              Capstone Project: Loan / Case Management System
            </h3>
            <p className="text-slate-600 leading-relaxed max-w-3xl">
              Apex + LWC + Integration. Build a complete deployable app covering the full development lifecycle with
              real-world complexity — the kind of project that gets you noticed in interviews.
            </p>
          </div>
        </Reveal>

        {/* Outcomes */}
        <Reveal>
          <div className="mt-12">
            <h3 className="font-display text-2xl font-bold text-navy mb-6">What you&apos;ll walk away able to do</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {DEV_OUTCOMES.map((o) => (
                <div key={o} className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-5">
                  <span className="h-8 w-8 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <Check size={18} className="text-brand-blue" />
                  </span>
                  <span className="font-semibold text-navy">{o}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-10">
          <button
            data-testid="course-enroll-btn"
            onClick={() => onEnroll("Salesforce Development Course")}
            className="group inline-flex items-center gap-2 bg-brand-orange text-white font-bold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-brand-orange/30"
          >
            Enroll in this Course
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Also running: QA Testing cohort */}
        <Reveal>
          <div data-testid="qa-cohort-callout" className="mt-16 rounded-3xl bg-navy grain relative overflow-hidden p-8 lg:p-12">
            <div className="relative z-10 grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-[0.2em]">
                  <FlaskConical size={16} /> Also Running
                </span>
                <h3 className="font-display text-3xl md:text-4xl font-extrabold text-white mt-3">
                  Salesforce QA Testing Cohorts
                </h3>
                <p className="text-white/70 mt-4 leading-relaxed max-w-xl">
                  Prefer testing over development? We run dedicated QA batches covering Manual Testing, API Testing with
                  Postman, and Salesforce application testing — no coding background required.
                </p>
                <button
                  data-testid="qa-enroll-btn"
                  onClick={() => onEnroll("Salesforce QA Testing Course")}
                  className="mt-6 inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
                >
                  Explore QA Cohorts <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {QA_CURRICULUM.map((q) => (
                  <div key={q.title} className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <div className="font-bold text-white text-sm mb-1">{q.title}</div>
                    <div className="text-white/50 text-xs">{q.items.join(" · ")}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Download brochure */}
        <Reveal>
          <div className="mt-10 flex justify-center">
            <button
              data-testid="course-brochure-btn"
              onClick={handleBrochureDownload}
              className="group inline-flex items-center gap-2 border-2 border-navy text-navy font-bold px-8 py-4 rounded-full hover:bg-navy hover:text-white transition-colors"
            >
              <Download size={18} /> Download Course Brochure
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
