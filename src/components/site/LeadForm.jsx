import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { m } from "framer-motion";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { WHATSAPP_LINK, IMAGES } from "../../data";
import { Reveal } from "./Reveal";

const LeadFormFields = lazy(() => import("./LeadFormFields"));

function FieldsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div>
        <div className="h-4 w-24 bg-slate-200 rounded mb-1.5"></div>
        <div className="h-11 bg-slate-100 rounded-xl"></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="h-4 w-28 bg-slate-200 rounded mb-1.5"></div>
          <div className="h-11 bg-slate-100 rounded-xl"></div>
        </div>
        <div>
          <div className="h-4 w-20 bg-slate-200 rounded mb-1.5"></div>
          <div className="h-11 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="h-4 w-36 bg-slate-200 rounded mb-1.5"></div>
          <div className="h-12 bg-slate-100 rounded-xl"></div>
        </div>
        <div>
          <div className="h-4 w-36 bg-slate-200 rounded mb-1.5"></div>
          <div className="h-12 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
      <div>
        <div className="h-4 w-32 bg-slate-200 rounded mb-1.5"></div>
        <div className="h-24 bg-slate-100 rounded-xl"></div>
      </div>
      <div className="h-12 bg-slate-200 rounded-full"></div>
    </div>
  );
}

export default function LeadForm({ prefillCourse }) {
  const [success, setSuccess] = useState(false);
  const [shouldLoadFields, setShouldLoadFields] = useState(false);
  const sectionRef = useRef(null);
  const pageMountedAt = useRef(Date.now());

  // Deterministic idle-callback hydration: fields load shortly after mount,
  // decoupled from scroll/interaction to avoid race conditions with Playwright
  useEffect(() => {
    if (shouldLoadFields) return;
    const trigger = () => setShouldLoadFields(true);

    let idle, timeout;
    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(trigger, { timeout: 2000 });
    } else {
      // Safari + iOS Safari fallback — 500ms after mount is well past LCP.
      timeout = setTimeout(trigger, 500);
    }

    return () => {
      if (idle && typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      if (timeout) clearTimeout(timeout);
    };
  }, [shouldLoadFields]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      data-testid="lead-form-section"
      className="bg-brand-gray py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">Get Started</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-navy mt-4">
            Book your <span className="text-brand-orange">free counselling call.</span>
          </h2>
          <p className="mt-5 text-slate-600 leading-relaxed max-w-md">
            Tell us a little about yourself and our team will guide you to the right learning path — no pressure, no jargon.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl clip-frame max-w-sm">
            <picture>
              <source
                type="image/webp"
                srcSet={`${IMAGES.student2640Webp} 640w, ${IMAGES.student2Webp} 940w`}
                sizes="(max-width: 640px) 100vw, 640px"
              />
              <img
                src={IMAGES.student2}
                srcSet={`${IMAGES.student2640} 640w, ${IMAGES.student2} 940w`}
                sizes="(max-width: 640px) 100vw, 640px"
                alt="Student learning Salesforce online"
                width={940}
                height={650}
                loading="lazy"
                decoding="async"
                className="w-full h-64 object-cover"
              />
            </picture>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-white p-8 lg:p-10 shadow-2xl shadow-navy/10 border border-slate-100">
            {success ? (
              <m.div
                data-testid="lead-form-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle2 size={56} className="text-brand-green mx-auto" />
                <h3 className="font-display text-2xl font-bold text-navy mt-5">You&apos;re all set!</h3>
                <p className="text-slate-600 mt-2">Our counsellor will reach out to you shortly.</p>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 bg-[#25D366] text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
                >
                  <MessageCircle size={18} /> Prefer WhatsApp? Chat with us instantly
                </a>
                <button onClick={() => setSuccess(false)} className="block mx-auto mt-4 text-sm text-slate-400 underline">
                  Submit another response
                </button>
              </m.div>
            ) : shouldLoadFields ? (
              <Suspense fallback={<FieldsSkeleton />}>
                <LeadFormFields pageMountedAt={pageMountedAt.current} prefillCourse={prefillCourse} onSuccess={() => setSuccess(true)} />
              </Suspense>
            ) : (
              <FieldsSkeleton />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
