import { m } from "framer-motion";
import { Check, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS, SPECIAL_OFFER, WHATSAPP_LINK } from "../../data";
import { Reveal } from "./Reveal";
import { trackEvent } from "@/lib/analytics";
import { COURSES_PAGE as TEST_IDS } from "@/constants/testIds/home";

export default function Pricing({ onEnroll }) {
  const featuredPaths = PATHS.filter((p) => p.homepageFeatured);
  return (
    <section id="pricing" data-testid="pricing-section" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">Learning Paths</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-navy mt-4 max-w-2xl">
            A Salesforce path for every stage of your journey.
          </h2>
        </Reveal>

        {/* Step tracker */}
        <Reveal>
          <div className="hidden lg:flex items-center gap-2 mt-10 mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Crash Course</span>
            <m.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-0.5 w-16 bg-brand-gold origin-left" />
            <span className="text-brand-green">Complete Course</span>
            <m.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-0.5 w-16 bg-[#8E44AD] origin-left" />
            <span className="text-[#8E44AD]">QA Testing</span>
          </div>
        </Reveal>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch lg:py-2">
          {featuredPaths.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className="h-full">
              <m.div
                whileHover={{ y: -10 }}
                data-testid={`pricing-card-${p.id}`}
                className={`relative flex flex-col h-full rounded-2xl border bg-white p-7 transition-shadow ${
                  p.popular
                    ? "border-brand-green ring-2 ring-brand-green/30 shadow-2xl shadow-brand-green/10 z-10 lg:scale-[1.03]"
                    : "border-slate-200 shadow-lg shadow-navy/5"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                )}
                <span
                  className="inline-block self-start text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-5"
                  style={{ backgroundColor: p.color }}
                >
                  {p.level}
                </span>
                <h3 className="font-display text-xl font-bold text-navy">{p.tier}</h3>
                <div className="mt-3 font-display font-black text-4xl text-navy">{p.price}</div>
                <p className="mt-1 text-sm text-slate-500">{p.detail}</p>

                <ul className="mt-5 space-y-2.5 flex-1">
                  {p.includes.map((it) => (
                    <li key={it} className="flex gap-2 text-sm text-slate-600">
                      <Check size={16} style={{ color: p.color }} className="shrink-0 mt-0.5" /> {it}
                    </li>
                  ))}
                </ul>

                <button
                  data-testid={`pricing-enroll-${p.id}`}
                  onClick={() => {
                    trackEvent("pricing_enroll_click", {
                      tier: p.tier,
                      price: p.price,
                      level: p.level,
                    });
                    onEnroll(`${p.tier} — ${p.price}`);
                  }}
                  className={`mt-6 w-full font-bold py-3.5 rounded-full transition-transform hover:scale-105 active:scale-95 ${
                    p.popular ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/30" : "bg-navy text-white"
                  }`}
                >
                  Click to Enroll Now
                </button>
              </m.div>
            </Reveal>
          ))}
        </div>

        {/* Special Offer — separate highlighted card */}
        <Reveal>
          <div
            data-testid="special-offer-card"
            className="mt-8 rounded-3xl overflow-hidden bg-navy grain relative"
          >
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-orange/20 blur-[100px]" />
            <div className="relative z-10 grid lg:grid-cols-[1.4fr_1fr] gap-8 p-8 lg:p-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  <Gift size={14} /> {SPECIAL_OFFER.tier} · {SPECIAL_OFFER.level}
                </span>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-display font-black text-5xl md:text-6xl text-white">{SPECIAL_OFFER.price}</span>
                  <span className="text-brand-gold font-semibold">{SPECIAL_OFFER.tagline}</span>
                </div>
                <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                  {SPECIAL_OFFER.includes.map((it) => (
                    <li key={it} className="flex gap-2 text-sm text-white/80">
                      <Check size={16} className="text-brand-gold shrink-0 mt-0.5" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:text-right">
                <a
                  data-testid="special-offer-enroll"
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent("pricing_special_offer_whatsapp_click", {
                      tier: SPECIAL_OFFER.tier,
                      price: SPECIAL_OFFER.price,
                    });
                  }}
                  className="inline-flex items-center justify-center border-2 border-[#25D366] text-white bg-transparent hover:bg-[#25D366]/10 hover:scale-105 active:scale-95 transition-all font-semibold px-6 py-3 rounded-lg"
                >
                  Grab This Offer
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* View All Courses link */}
        <Reveal>
          <div className="mt-10 text-center">
            <Link
              to="/courses"
              data-testid={TEST_IDS.viewAllBtn}
              onClick={() => trackEvent("view_all_courses_click", { source: "pricing" })}
              className="inline-flex items-center gap-2 border-2 border-navy text-navy font-bold px-8 py-3.5 rounded-full hover:bg-navy hover:text-white hover:scale-105 active:scale-95 transition-all"
            >
              View All 6 Courses
              <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
