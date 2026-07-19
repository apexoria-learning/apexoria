import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";

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
import FinalCTA from "@/components/site/FinalCTA";
import Footer from "@/components/site/Footer";
import WhatsAppWidget from "@/components/site/WhatsAppWidget";

function App() {
  const [prefillCourse, setPrefillCourse] = useState("");

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  const handleEnroll = useCallback((course) => {
    if (course) setPrefillCourse(course);
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
      <FinalCTA onEnroll={handleEnroll} />
      <Footer onEnroll={() => handleEnroll()} />
      <WhatsAppWidget />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
