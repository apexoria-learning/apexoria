import { FileText, MessageSquare, Users, LifeBuoy, ArrowRight } from "lucide-react";
import { PLACEMENT_STEPS } from "../../data";
import { Reveal } from "./Reveal";

const ICONS = { FileText, MessageSquare, Users, LifeBuoy };

export default function PlacementSupport({ onEnroll }) {
  return (
    <section id="placement" data-testid="placement-section" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">Placement Support</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-navy mt-4 max-w-2xl">
            A clear path from learning to getting hired.
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-4 gap-6 relative">
          {PLACEMENT_STEPS.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <Reveal key={s.title} delay={i * 0.12}>
                <div data-testid={`placement-step-${i}`} className="relative text-center md:text-left">
                  <div className="flex items-center gap-4 md:block">
                    <div className="h-16 w-16 rounded-2xl bg-navy flex items-center justify-center md:mb-5 shrink-0">
                      <Icon className="text-brand-gold" size={28} />
                    </div>
                    <span className="font-display font-black text-5xl text-slate-100 hidden md:block absolute top-0 right-2">0{i + 1}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy mt-2 md:mt-0">{s.title}</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{s.body}</p>
                  {i < PLACEMENT_STEPS.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-5 -right-4 text-brand-blue/40" size={22} />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-14">
            <button
              data-testid="placement-cta-btn"
              onClick={() => onEnroll()}
              className="group inline-flex items-center gap-2 bg-brand-orange text-white font-bold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-brand-orange/30"
            >
              See How We Help You Get Hired
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
