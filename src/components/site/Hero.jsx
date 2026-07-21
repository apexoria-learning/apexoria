import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { IMAGES, WHATSAPP_LINK } from "../../data";

const ease = [0.16, 1, 0.3, 1];

function Line({ children, delay }) {
  return (
    <span className="reveal-mask">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero({ onEnroll }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      id="home"
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-[100svh] flex items-center bg-navy grain overflow-hidden"
    >
      {/* Parallax abstract */}
      <motion.div style={{ y: yImg, scale: scaleImg }} className="absolute inset-0 z-0">
        <div
          className="absolute right-[-10%] top-0 h-full w-[70%] bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${IMAGES.heroAbstract})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
      </motion.div>

      {/* Glow blobs */}
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-blue/20 blur-[120px] z-0" />
      <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-brand-orange/10 blur-[110px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pt-28 pb-40 w-full">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 text-brand-bluesoft text-xs font-bold uppercase tracking-[0.25em] mb-6"
        >
          <span className="h-px w-8 bg-brand-gold" /> Salesforce Training Academy · India
        </motion.span>

        <h1 className="font-display font-black uppercase tracking-tighter leading-[0.92] text-white text-5xl md:text-6xl lg:text-7xl max-w-4xl">
          <Line delay={0.35}>Master</Line>
          <Line delay={0.48}>
            Salesforce <span className="text-brand-blue">Development</span>
          </Line>
          <Line delay={0.61}>From Zero To</Line>
          <Line delay={0.74}>
            <span className="text-brand-gold">Job-Ready.</span>
          </Line>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7 }}
          className="mt-8 text-white/75 text-base md:text-lg max-w-xl leading-relaxed"
        >
          Live online cohorts in Apex, LWC, Integrations &amp; Admin — plus dedicated Salesforce QA batches.
          <span className="text-white font-semibold"> Guaranteed placement support.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <button
            data-testid="hero-enroll-btn"
            onClick={onEnroll}
            className="group inline-flex items-center justify-center gap-2 bg-brand-orange text-white font-bold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-brand-orange/30"
          >
            Enroll Today
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            data-testid="hero-whatsapp-btn"
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#25D366] text-white font-bold px-8 py-4 rounded-full hover:bg-[#25D366]/10 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Talk to Us on WhatsApp
          </a>
        </motion.div>
      </div>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-0 inset-x-0 z-10 border-t border-white/10 bg-white/5 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-wrap items-center justify-center md:justify-between gap-4 text-white/90 text-base md:text-lg font-semibold">
          {["200+ Learners Trained", "Guaranteed Placement Support", "Weekday Batches"].map((t, i) => (
            <span key={i} className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-brand-gold" /> {t}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
