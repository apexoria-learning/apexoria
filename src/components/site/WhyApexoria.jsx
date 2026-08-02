import { m } from "framer-motion";
import { Radio, FolderGit2, GraduationCap, Briefcase } from "lucide-react";
import { VALUE_PROPS, IMAGES } from "../../data";
import { Reveal } from "./Reveal";

const ICONS = { Radio, FolderGit2, GraduationCap, Briefcase };

export default function WhyApexoria() {
  return (
    <section id="why" data-testid="why-section" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">The Manifesto</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-navy mt-4 max-w-3xl">
            We don&apos;t just teach Salesforce. We build{" "}
            <span className="relative inline-block">
              careers
              <span className="absolute left-0 bottom-1 h-2 w-full bg-brand-gold/40 -z-0" />
            </span>
            .
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-2 gap-6 lg:gap-8">
          {VALUE_PROPS.map((v, i) => {
            const Icon = ICONS[v.icon];
            return (
              <Reveal key={v.n} delay={i * 0.08}>
                <m.div
                  whileHover={{ y: -8 }}
                  data-testid={`value-card-${v.n}`}
                  className={`relative overflow-hidden rounded-2xl border border-slate-200 p-8 lg:p-10 bg-white shadow-xl shadow-navy/5 h-full ${
                    i % 2 === 1 ? "md:translate-y-8" : ""
                  }`}
                >
                  <span className="absolute -top-6 -right-2 font-display font-black text-8xl text-slate-100 select-none">
                    {v.n}
                  </span>
                  <div className="relative z-10">
                    <div className="h-14 w-14 rounded-xl bg-navy flex items-center justify-center mb-6">
                      <Icon className="text-brand-gold" size={26} />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-navy mb-3">{v.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{v.body}</p>
                  </div>
                </m.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
