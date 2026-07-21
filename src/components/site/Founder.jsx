import { motion } from "framer-motion";
import { Award, BadgeCheck, UserRound } from "lucide-react";
import { FOUNDER } from "../../data";
import { Reveal } from "./Reveal";

export default function Founder() {
  return (
    <section id="founder" data-testid="founder-section" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">Meet Your Mentor</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-navy mt-4 max-w-2xl">
            Learn from experienced Salesforce professionals.
          </h2>
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-14 items-center">
          {/* Photo */}
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-3 bg-brand-blue/10 rounded-3xl rotate-3" />
              <div className="relative rounded-3xl overflow-hidden clip-frame bg-brand-gray aspect-[4/5] flex items-center justify-center">
                {FOUNDER.photo ? (
                  <img src={FOUNDER.photo} alt={FOUNDER.name} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center px-6" data-testid="founder-photo-placeholder">
                    <span className="h-24 w-24 rounded-full bg-navy flex items-center justify-center mx-auto">
                      <UserRound size={44} className="text-brand-gold" />
                    </span>
                    <p className="mt-4 text-sm font-semibold text-slate-500">Founder&apos;s photo</p>
                    <p className="text-xs text-slate-400">(placeholder — add photo)</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* Bio */}
          <Reveal delay={0.1}>
            <div>
              <h3 className="font-display text-3xl font-extrabold text-navy">{FOUNDER.name}</h3>
              <p className="text-brand-blue font-semibold mt-1">{FOUNDER.role}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {FOUNDER.certifications.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green font-semibold text-sm px-3 py-1.5 rounded-full">
                    <BadgeCheck size={16} /> {c}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-slate-600 leading-relaxed">{FOUNDER.bio}</p>

              <div className="mt-6">
                <div className="flex items-center gap-2 text-navy font-bold text-sm mb-3">
                  <Award size={16} className="text-brand-gold" /> Core Expertise
                </div>
                <div className="flex flex-wrap gap-2">
                  {FOUNDER.skills.map((s) => (
                    <span key={s} className="bg-brand-gray border border-slate-200 text-navy text-sm font-medium px-3 py-1.5 rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
