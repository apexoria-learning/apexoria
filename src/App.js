import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { initAnalytics } from "@/lib/analytics";

import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import EditorialMarquee from "@/components/site/EditorialMarquee";
import WhyApexoria from "@/components/site/WhyApexoria";
import FeaturedCourse from "@/components/site/FeaturedCourse";
import Pricing from "@/components/site/Pricing";
import Founder from "@/components/site/Founder";
import LeadForm from "@/components/site/LeadForm";
import SuccessStories from "@/components/site/SuccessStories";
import Batches from "@/components/site/Batches";
import PlacementSupport from "@/components/site/PlacementSupport";
import FaqSection from "@/components/site/FAQ";
import FinalCTA from "@/components/site/FinalCTA";
import Footer from "@/components/site/Footer";
import WhatsAppWidget from "@/components/site/WhatsAppWidget";

function App() {
  const [prefillCourse, setPrefillCourse] = useState("");

  useEffect(() => {
    initAnalytics();
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  const handleEnroll = useCallback((course) => {
    if (course) setPrefillCourse(course);
    const el = document.getElementById("contact");
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className="App font-body">
      <Navbar onEnroll={() => handleEnroll()} />
      <Hero onEnroll={() => handleEnroll()} />
      <EditorialMarquee />
      <WhyApexoria />
      <FeaturedCourse onEnroll={handleEnroll} />
      <Pricing onEnroll={handleEnroll} />
      <Founder />
      <LeadForm prefillCourse={prefillCourse} />
      <SuccessStories />
      <Batches onEnroll={handleEnroll} />
      <PlacementSupport onEnroll={handleEnroll} />
      <FaqSection onEnroll={handleEnroll} />
      <FinalCTA onEnroll={handleEnroll} />
      <Footer />
      <WhatsAppWidget />
      <Toaster position="top-center" richColors />
      <Analytics />
    </div>
  );
}

export default App;
