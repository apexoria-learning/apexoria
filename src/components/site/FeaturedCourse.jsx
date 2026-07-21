import { ArrowRight, Check, Download } from "lucide-react";
import { toast } from "sonner";
import { CURRICULUM_TRACKS, SALESFORCE_LOGO } from "../../data";
import { Reveal } from "./Reveal";

// Chip color palette — cycled by index across every card so the three chips
// on each card land on {blue, orange, green} in order. Full class strings
// are listed here so Tailwind's JIT scanner keeps them in the build.
const CHIP_COLORS = [
  "bg-brand-blue/10 text-brand-blue ring-1 ring-inset ring-brand-blue/20",
  "bg-brand-orange/10 text-brand-orange ring-1 ring-inset ring-brand-orange/20",
  "bg-brand-green/10 text-brand-green ring-1 ring-inset ring-brand-green/20",
  "bg-purple-100 text-purple-700 ring-1 ring-inset ring-purple-300/50",
];

export default function FeaturedCourse({ onEnroll }) {
  const handleBrochureDownload = async (url, ev) => {
    ev.preventDefault();
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        toast.info("Brochure download will be available shortly. Please reach out on WhatsApp for details.");
      }
    } catch {
      toast.info("Brochure download will be available shortly. Please reach out on WhatsApp for details.");
    }
  };

  // First brochure button on the page keeps the legacy `course-brochure-btn`
  // testid so e2e/tests/brochure.spec.js needs no changes.
  let firstBrochureRendered = false;

  return (
    <section id="featured-course" data-testid="featured-course-section" className="bg-brand-gray py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Section hero — neutral Curriculum framing (covers both Dev + QA) */}
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">Curriculum</span>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <img src={SALESFORCE_LOGO} alt="Salesforce" className="h-12 md:h-14" loading="lazy" />
            <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-navy">
              Our Curriculum
            </h2>
          </div>
          <p className="mt-6 max-w-3xl text-lg text-slate-600 leading-relaxed">
            Two focused tracks, four ways in. Whether you want to build on the Salesforce platform or test what
            others build, pick a course, grab the curriculum brochure, and see exactly what you'll learn — week by
            week.
          </p>
        </Reveal>

        {/* Tracks */}
        <div id="curriculum" className="mt-16 space-y-16">
          {CURRICULUM_TRACKS.map((track) => (
            <div key={track.key} data-testid={`curriculum-track-${track.key}`}>
              <Reveal>
                <div className="flex flex-col gap-2 mb-8">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
                    {track.overline}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-navy">
                    {track.title}
                  </h3>
                </div>
              </Reveal>

              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {track.courses.map((course, i) => {
                  const brochureTestId = firstBrochureRendered
                    ? `curriculum-brochure-${course.key}`
                    : "course-brochure-btn";
                  firstBrochureRendered = true;
                  return (
                    <Reveal key={course.key} delay={i * 0.08}>
                      <article
                        data-testid={`curriculum-course-${course.key}`}
                        className="h-full flex flex-col rounded-2xl bg-white border border-slate-200 p-7 lg:p-8 shadow-lg shadow-navy/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10 hover:border-brand-blue/30"
                      >
                        <h4 className="font-display text-xl md:text-2xl font-bold text-navy">{course.title}</h4>
                        <p className="mt-1 text-sm font-semibold text-brand-blue">{course.tagline}</p>

                        {course.chips?.length > 0 && (
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {course.chips.map((chip, ci) => (
                              <li
                                key={chip}
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${CHIP_COLORS[ci % CHIP_COLORS.length]}`}
                              >
                                {chip}
                              </li>
                            ))}
                          </ul>
                        )}

                        <p className="mt-5 text-slate-600 leading-relaxed">{course.description}</p>

                        <ul className="mt-6 space-y-2.5">
                          {course.highlights.map((h) => (
                            <li key={h} className="flex gap-2 text-sm text-slate-700">
                              <Check size={16} className="text-brand-blue shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto pt-8">
                          <button
                            type="button"
                            data-testid={brochureTestId}
                            onClick={(ev) => handleBrochureDownload(course.brochureUrl, ev)}
                            className="group inline-flex w-full items-center justify-center gap-2 border-2 border-navy text-navy font-bold px-6 py-3 rounded-full hover:bg-navy hover:text-white transition-colors"
                          >
                            <Download size={16} /> Download Brochure
                          </button>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>

              {/* Capstone callout sits under the Development track only */}
              {track.key === "development" && (
                <Reveal>
                  <div
                    data-testid="mini-project-callout"
                    className="mt-8 rounded-2xl bg-white border-l-4 border-brand-blue p-8 shadow-lg shadow-navy/5"
                  >
                    <h4 className="font-display text-xl font-bold text-brand-blue mb-2">
                      Capstone Project: Loan / Case Management System
                    </h4>
                    <p className="text-slate-600 leading-relaxed max-w-3xl">
                      Apex + LWC + Integration. Build a complete deployable app covering the full development
                      lifecycle with real-world complexity — the kind of project that gets you noticed in
                      interviews.
                    </p>
                  </div>
                </Reveal>
              )}
            </div>
          ))}
        </div>

        {/* Section-level enroll CTA */}
        <Reveal>
          <div className="mt-16 flex justify-center">
            <button
              data-testid="course-enroll-btn"
              onClick={() => onEnroll("Salesforce Course")}
              className="group inline-flex items-center gap-2 bg-brand-orange text-white font-bold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-brand-orange/30"
            >
              Enroll in this Course
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
