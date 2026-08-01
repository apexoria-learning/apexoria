import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { initAnalytics } from "@/lib/analytics";

// Above-the-fold / critical path — imported eagerly.
import ScrollToHashHandler from "@/components/ScrollToHashHandler";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import EditorialMarquee from "@/components/site/EditorialMarquee";
import WhyApexoria from "@/components/site/WhyApexoria";
// LeadForm stays eager: it hosts the #contact anchor that every primary CTA
// (nav enroll, hero enroll, pricing card enroll, FAQ enroll, hero-image click)
// scrolls to. Making it lazy would produce a no-op click if the chunk hasn't
// downloaded yet — a UX regression caught by e2e/tests/{hero,navigation}.spec.js
// in QA iteration 3 (2026-07-27).
import LeadForm from "@/components/site/LeadForm";

// Below-the-fold — code-split into a secondary chunk so the initial JS
// payload only carries the hero experience. Any new section added here
// must decide whether it belongs above the fold (eager) or below (lazy).
const Founder = lazy(() => import("@/components/site/Founder"));
const InterviewPrep = lazy(() => import("@/components/site/InterviewPrep"));
const Pricing = lazy(() => import("@/components/site/Pricing"));
const Batches = lazy(() => import("@/components/site/Batches"));
const PlacementSupport = lazy(() => import("@/components/site/PlacementSupport"));
const SuccessStories = lazy(() => import("@/components/site/SuccessStories"));
const FaqSection = lazy(() => import("@/components/site/FAQ"));
const FinalCTA = lazy(() => import("@/components/site/FinalCTA"));
const Footer = lazy(() => import("@/components/site/Footer"));
const WhatsAppWidget = lazy(() => import("@/components/site/WhatsAppWidget"));

function App() {
  const [prefillCourse, setPrefillCourse] = useState("");
  const location = useLocation();

  useEffect(() => {
    initAnalytics();

    // Defer smooth-scroll library init until the browser is idle. Lenis
    // ships a per-frame RAF loop that starts as soon as it's constructed,
    // which competes with hero paint/layout on load. `requestIdleCallback`
    // (or a 200ms timeout fallback for Safari) pushes it past FCP/LCP.
    let lenis;
    let raf;
    let idleHandle;
    let timeoutHandle;

    const startLenis = async () => {
      const { default: Lenis } = await import("lenis");
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      window.__lenis = lenis;
      const loop = (t) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(startLenis, { timeout: 1000 });
    } else {
      timeoutHandle = setTimeout(startLenis, 200);
    }

    return () => {
      if (idleHandle && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (raf) cancelAnimationFrame(raf);
      if (lenis) lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Cross-page hash scroll. When a user clicks a Navbar/Footer link from
  // /privacy or /terms, we navigate to /#some-id. Below-fold sections are
  // React.lazy so the target element isn't in the DOM at mount time —
  // poll briefly (max ~3s) until the target appears, then smooth-scroll.
  useEffect(() => {
    const hash = location.hash?.replace(/^#/, "");
    if (!hash) return undefined;
    let cancelled = false;
    let attempts = 0;
    const tick = () => {
      if (cancelled) return;
      const el = document.getElementById(hash);
      if (el) {
        if (window.__lenis) window.__lenis.scrollTo(el);
        else el.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (++attempts < 60) setTimeout(tick, 50);
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [location.hash, location.key]);

  const handleEnroll = useCallback((course) => {
    if (course) setPrefillCourse(course);
    // Scroll to #contact. That anchor lives inside <LeadForm>, which is
    // rendered eagerly, so the element is guaranteed to exist by the time
    // any CTA is clickable. Fall back to native smooth scroll if Lenis
    // hasn't finished its idle-callback init yet.
    const scrollTo = (el) => {
      if (window.__lenis) window.__lenis.scrollTo(el);
      else el.scrollIntoView({ behavior: "smooth" });
    };
    const el = document.getElementById("contact");
    if (el) {
      scrollTo(el);
    } else {
      // Belt-and-suspenders: if some future refactor makes LeadForm lazy
      // again, retry once on the next macrotask so the click still resolves.
      setTimeout(() => {
        const late = document.getElementById("contact");
        if (late) scrollTo(late);
      }, 0);
    }
  }, []);

  return (
    <div className="App font-body">
      <ScrollToHashHandler />
      <Navbar onEnroll={() => handleEnroll()} />
      <Hero onEnroll={() => handleEnroll()} />
      <EditorialMarquee />
      <WhyApexoria />
      {/* Suspense boundary for every below-fold section. A null fallback is
          acceptable because Reveal / whileInView entry animations already
          animate each section in from the bottom — the split-second before
          the chunk resolves is indistinguishable from the entry animation.
          LeadForm is rendered OUTSIDE this boundary so the #contact anchor
          exists at first paint (see comment on the eager import). */}
      <Suspense fallback={null}>
        <Founder />
        <InterviewPrep onEnroll={handleEnroll} />
        <Pricing onEnroll={handleEnroll} />
        <Batches onEnroll={handleEnroll} />
        <PlacementSupport onEnroll={handleEnroll} />
        <SuccessStories />
        <FaqSection onEnroll={handleEnroll} />
      </Suspense>
      <LeadForm prefillCourse={prefillCourse} />
      <Suspense fallback={null}>
        <FinalCTA onEnroll={handleEnroll} />
        <Footer />
        <WhatsAppWidget />
      </Suspense>
      <Toaster position="top-center" richColors />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
