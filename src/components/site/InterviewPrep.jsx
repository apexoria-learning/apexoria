import { Target, FileText, Linkedin, LifeBuoy, MessageCircle, Check } from "lucide-react";
import { INTERVIEW_PREP } from "../../data";
import { Reveal } from "./Reveal";
import { INTERVIEW_PREP as TEST_IDS } from "@/constants/testIds/home";
import { trackEvent } from "@/lib/analytics";

const ICON_MAP = {
  Target,
  FileText,
  Linkedin,
  LifeBuoy,
};

export default function InterviewPrep({ onEnroll }) {
  return (
    <section
      id="interview-prep"
      data-testid={TEST_IDS.section}
      className="bg-[#F2F4F7] py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left column — editorial asymmetric */}
          <div>
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">
                {INTERVIEW_PREP.overline}
              </span>
            </Reveal>
            <Reveal>
              <h2
                data-testid={TEST_IDS.headline}
                className="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-navy mt-4 leading-[0.9]"
              >
                {INTERVIEW_PREP.headlinePrefix}
                <span className="inline-block bg-brand-gold text-navy px-3 py-1 rounded-lg">{INTERVIEW_PREP.headlineHighlight}</span>
                {INTERVIEW_PREP.headlineSuffix}
              </h2>
            </Reveal>
            <Reveal>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl">
                {INTERVIEW_PREP.subCopy}
              </p>
            </Reveal>

            {/* 2×2 feature grid */}
            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {INTERVIEW_PREP.features.map((f, i) => {
                const Icon = ICON_MAP[f.icon];
                return (
                  <Reveal key={f.label} delay={i * 0.08}>
                    <div
                      data-testid={TEST_IDS.feature(i)}
                      className="flex gap-4 items-start"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                        <Icon size={20} className="text-brand-blue" />
                      </div>
                      <div>
                        <h3 className="font-bold text-navy">{f.label}</h3>
                        <p className="mt-1 text-sm text-slate-600 leading-snug">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Right column — price card */}
          <Reveal>
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl shadow-black/5 p-8 sticky top-24">
              <div
                data-testid={TEST_IDS.price}
                className="font-display text-6xl font-black text-navy"
              >
                {INTERVIEW_PREP.price}
              </div>
              <p className="mt-2 text-slate-600 font-semibold">
                {INTERVIEW_PREP.tagline}
              </p>

              <div className="my-6 h-px bg-slate-200" />

              <ul className="space-y-3">
                {INTERVIEW_PREP.features.map((f) => (
                  <li key={f.label} className="flex gap-2 text-sm text-slate-700">
                    <Check size={16} className="text-brand-blue shrink-0 mt-0.5" />
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>

              <button
                data-testid={TEST_IDS.enrollBtn}
                onClick={() => {
                  trackEvent("interview_prep_enroll_click", {
                    price: INTERVIEW_PREP.price,
                  });
                  onEnroll("Salesforce Interview Preparation — ₹2,999");
                }}
                className="mt-6 w-full bg-brand-orange text-white font-bold py-3.5 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-brand-orange/30"
              >
                {INTERVIEW_PREP.ctaLabel}
              </button>

              <a
                data-testid={TEST_IDS.whatsappBtn}
                href={INTERVIEW_PREP.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("interview_prep_whatsapp_click")}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 border-2 border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-full hover:border-[#25D366] hover:text-[#25D366] transition-colors"
              >
                <MessageCircle size={18} />
                {INTERVIEW_PREP.whatsappCta}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
