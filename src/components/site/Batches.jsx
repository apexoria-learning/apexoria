import { m } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { BATCHES } from "../../data";
import { Reveal } from "./Reveal";

export default function Batches({ onEnroll }) {
  return (
    <section id="batches" data-testid="batches-section" className="bg-brand-gray py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">Upcoming Batches</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-navy mt-4 max-w-2xl">
            Reserve your seat before they&apos;re gone.
          </h2>
        </Reveal>

        <div className="mt-12 space-y-4">
          {BATCHES.map((b, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <m.div
                whileHover={{ x: 6 }}
                data-testid={`batch-row-${i}`}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 rounded-2xl bg-white border border-slate-200 p-6 shadow-lg shadow-navy/5"
              >
                <div className="flex items-center gap-3 sm:w-56">
                  <span className="h-12 w-12 rounded-xl bg-navy flex items-center justify-center shrink-0">
                    <CalendarDays className="text-brand-gold" size={22} />
                  </span>
                  <div>
                    <div className="font-display font-bold text-navy text-lg">{b.start}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Batch Start</div>
                  </div>
                </div>
                <div className="sm:w-64">
                  <div className="font-semibold text-navy text-sm">{b.course}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-block bg-brand-blue/10 text-brand-blue font-semibold text-xs px-3 py-1 rounded-full">
                      {b.mode}
                    </span>
                    {b.time && (
                      <span className="inline-block bg-brand-gold/15 text-navy font-semibold text-xs px-3 py-1 rounded-full">
                        {b.time}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <span className={`inline-block font-bold text-sm px-4 py-1.5 rounded-full ${
                    b.seats <= 5 ? "bg-brand-orange/10 text-brand-orange" : "bg-brand-green/10 text-brand-green"
                  }`}>
                    {b.seats <= 5 ? `Only ${b.seats} seats left` : `${b.seats} seats available`}
                  </span>
                </div>
                <button
                  data-testid={`batch-reserve-${i}`}
                  onClick={() => onEnroll()}
                  className="group inline-flex items-center justify-center gap-2 bg-navy text-white font-bold px-6 py-3 rounded-full hover:bg-brand-orange transition-colors"
                >
                  Reserve Your Seat
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </m.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
