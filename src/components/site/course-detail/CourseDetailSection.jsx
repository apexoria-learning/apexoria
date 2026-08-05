import { Check, Download } from "lucide-react";
import { ALL_COURSES_PAGE, PATHS } from "../../../data";
import { Reveal } from "../Reveal";
import { COURSES_PAGE as TEST_IDS } from "@/constants/testIds/home";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CourseDetailSection({ courseId, onEnroll, index = 0 }) {
  const course = ALL_COURSES_PAGE[courseId];
  const pathData = PATHS.find((p) => p.id === courseId);

  if (!course || !pathData) return null;

  const handleBrochureDownload = async (ev) => {
    ev.preventDefault();
    const url = "/apexoria-brochure.pdf"; // Default brochure for all courses
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

  // Alternate bg-white / bg-slate-50 for visual rhythm
  const bgClass = index % 2 === 0 ? "bg-white" : "bg-slate-50";
  // Course number watermark (01, 02, … 06) — mirrors WhyApexoria pattern
  const courseNumber = String(index + 1).padStart(2, "0");
  const watermarkColor = index % 2 === 0 ? "text-slate-100" : "text-slate-200";

  return (
    <section
      id={`course-${courseId}`}
      data-testid={TEST_IDS.section(courseId)}
      className={`${bgClass} py-24 lg:py-32 scroll-mt-24 relative overflow-clip`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left column — editorial content */}
          <div className="relative">
            <span
              aria-hidden="true"
              className={`pointer-events-none select-none absolute -top-8 -left-2 font-display font-black text-[8rem] md:text-[10rem] leading-none ${watermarkColor}`}
            >
              {courseNumber}
            </span>
            <Reveal>
              <h2 className="relative z-10 font-display text-4xl md:text-5xl font-extrabold tracking-tight text-navy">
                {course.title}
              </h2>
              <p className="relative z-10 mt-2 text-lg font-semibold text-brand-blue">{course.tagline}</p>
            </Reveal>

            {/* Chips */}
            {course.chips?.length > 0 && (
              <Reveal>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {course.chips.map((chip) => (
                    <li
                      key={chip}
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-200 text-slate-700"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <Reveal>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">{course.description}</p>
            </Reveal>

            {/* Week-by-week accordion */}
            {course.weekByWeek?.length > 0 && (
              <Reveal>
                <div className="mt-10">
                  <h3 className="font-display text-2xl font-bold text-navy mb-4">Week by Week</h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {course.weekByWeek.map((w, i) => (
                      <AccordionItem key={i} value={`week-${i}`} className="border border-slate-200 rounded-lg px-4">
                        <AccordionTrigger data-testid={TEST_IDS.weekTrigger(courseId, i)} className="font-semibold text-navy hover:no-underline">
                          Week {w.week}: {w.topic}
                        </AccordionTrigger>
                        <AccordionContent data-testid={TEST_IDS.weekContent(courseId, i)}>
                          <ul className="space-y-1.5 pl-4">
                            {w.points.map((p, pi) => (
                              <li key={pi} className="text-sm text-slate-600 flex gap-2">
                                <span className="text-brand-blue">•</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </Reveal>
            )}

            {/* Key outcomes */}
            {course.outcomes?.length > 0 && (
              <Reveal>
                <div className="mt-10">
                  <h3 className="font-display text-2xl font-bold text-navy mb-4">Key Outcomes</h3>
                  <ul className="space-y-2.5">
                    {course.outcomes.map((o) => (
                      <li key={o} className="flex gap-2 text-slate-700">
                        <Check size={18} className="text-brand-blue shrink-0 mt-0.5" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {/* Who this is for */}
            {course.whoThisIsFor && (
              <Reveal>
                <div className="mt-10">
                  <h3 className="font-display text-2xl font-bold text-navy mb-4">Who This Is For</h3>
                  <p className="text-slate-600 leading-relaxed">{course.whoThisIsFor}</p>
                </div>
              </Reveal>
            )}
          </div>

          {/* Right column — sticky price card */}
          <div className="lg:sticky lg:top-24">
            <Reveal>
              <div className="bg-white rounded-xl border border-slate-200 shadow-xl shadow-black/5 p-8">
                <div className="font-display text-5xl font-black text-navy">{pathData.price}</div>
                <p className="mt-2 text-slate-600">{pathData.detail}</p>

                {pathData.popular && (
                  <span className="inline-block mt-3 bg-brand-green text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    Most Popular
                  </span>
                )}

                <button
                  data-testid={TEST_IDS.enrollBtn(courseId)}
                  onClick={() => {
                    trackEvent("course_detail_enroll_click", {
                      courseId,
                      price: pathData.price,
                    });
                    onEnroll(course.enrollLabel);
                  }}
                  className="mt-6 w-full bg-brand-orange text-white font-bold py-3.5 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-brand-orange/30"
                >
                  Enroll Now
                </button>

                <button
                  data-testid={TEST_IDS.brochureBtn(courseId)}
                  onClick={handleBrochureDownload}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 border-2 border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-full hover:border-navy hover:text-navy transition-colors"
                >
                  <Download size={18} />
                  Download Curriculum
                </button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Testimonial spotlight */}
        {course.testimonial && (
          <Reveal>
            <div className="mt-16 rounded-2xl bg-navy p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-blue/20 blur-[100px]" />
              <div className="relative z-10">
                {course.testimonial.photo ? (
                  <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center">
                    <div className="w-40 h-40 md:w-[200px] md:h-[200px] rounded-[24px_4px_24px_4px] overflow-hidden transition-all duration-500 hover:filter-none grayscale shrink-0">
                      <img
                        src={course.testimonial.photo}
                        alt={course.testimonial.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-lg md:text-xl text-white/90 leading-relaxed italic">
                        "{course.testimonial.quote}"
                      </p>
                      <div className="mt-6">
                        <p className="font-bold text-white">{course.testimonial.name}</p>
                        <p className="text-sm text-white/70">{course.testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed italic max-w-3xl">
                      "{course.testimonial.quote}"
                    </p>
                    <div className="mt-6">
                      <p className="font-bold text-white">{course.testimonial.name}</p>
                      <p className="text-sm text-white/70">{course.testimonial.role}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* FAQ */}
        {course.faq?.length > 0 && (
          <Reveal>
            <div className="mt-16">
              <h3 className="font-display text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="space-y-3">
                {course.faq.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border border-slate-200 rounded-lg px-6 py-2">
                    <AccordionTrigger data-testid={TEST_IDS.faqTrigger(courseId, i)} className="font-semibold text-navy hover:no-underline text-left">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent data-testid={TEST_IDS.faqContent(courseId, i)}>
                      <p className="text-slate-600 leading-relaxed">{f.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
