import { m } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS, STATS, IMAGES, GOOGLE_REVIEWS } from "../../data";
import { Reveal } from "./Reveal";

const avatars = [IMAGES.student1, IMAGES.student2, IMAGES.team];

export default function SuccessStories() {
  return (
    <section id="success-stories" data-testid="success-stories-section" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">Success Stories</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-navy mt-4 max-w-2xl">
            We don&apos;t just teach — we help you get placed.
          </h2>
        </Reveal>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="rounded-2xl bg-navy grain relative overflow-hidden p-8 text-center">
                <div className="relative z-10">
                  <div className="font-display font-black text-5xl md:text-6xl text-brand-gold">{s.value}</div>
                  <div className="mt-2 text-white/70 font-semibold text-sm uppercase tracking-wider">{s.label}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Google Reviews badge */}
        <Reveal>
          <a
            href={GOOGLE_REVIEWS.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="google-reviews"
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-lg shadow-navy/5 hover:shadow-xl transition-shadow max-w-2xl mx-auto"
          >
            <svg width="34" height="34" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
              <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
              <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
              <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
            </svg>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-display font-black text-3xl text-navy">{GOOGLE_REVIEWS.rating}</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={16} className="fill-brand-gold text-brand-gold" />
                  ))}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Rated on Google · {GOOGLE_REVIEWS.count}+ reviews <span className="text-brand-blue font-semibold">(view all)</span>
              </p>
            </div>
          </a>
        </Reveal>

        {/* Testimonials */}
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <m.div
                whileHover={{ y: -8 }}
                data-testid={`testimonial-${i}`}
                className="h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-lg shadow-navy/5"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={i === 1 ? `${IMAGES.student2640Webp} 640w, ${IMAGES.student2Webp} 940w` : (i === 0 ? IMAGES.student1Webp : IMAGES.teamWebp)}
                    />
                    <img
                      src={t.photo || avatars[i % avatars.length]}
                      srcSet={i === 1 ? `${IMAGES.student2640} 640w, ${IMAGES.student2} 940w` : undefined}
                      alt={t.name}
                      width={48}
                      height={48}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </picture>
                  <div>
                    <div className="font-bold text-navy text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role} {t.company}</div>
                  </div>
                </div>
              </m.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
