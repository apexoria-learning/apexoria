import { useState } from "react";
import { Phone, Instagram, Linkedin, Facebook, ArrowRight, Download } from "lucide-react";
import { CONTACT, BROCHURE_URL } from "../../data";
import { Reveal } from "./Reveal";
import { trackEvent } from "@/lib/analytics";
import BrochureGateDialog from "./BrochureGateDialog";

export default function FinalCTA({ onEnroll }) {
  // The brochure download is now gated behind BrochureGateDialog. The
  // Google-Form POST + HEAD-check + graceful 404 toast all live inside
  // the dialog so this component just owns the open/close state.
  const [gateOpen, setGateOpen] = useState(false);

  const openBrochureGate = () => {
    trackEvent("brochure_gate_open", { location: "final_cta" });
    setGateOpen(true);
  };

  return (
    <section id="get-started" data-testid="final-cta-section" className="bg-navy grain relative overflow-hidden py-24 lg:py-32">
      <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-brand-blue/20 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-brand-orange/10 blur-[110px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 lg:px-8 text-center">
        <Reveal>
          <h2 className="font-display font-black uppercase tracking-tighter text-white text-4xl md:text-6xl leading-[0.95]">
            Ready to Start Your <span className="text-brand-gold">Salesforce Career?</span>
          </h2>
          <p className="mt-6 text-white/70 text-lg">Limited Seats Available. Book Your Slot Today!</p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              data-testid="final-enroll-btn"
              onClick={() => {
                trackEvent("cta_click", { location: "final_cta" });
                onEnroll();
              }}
              className="group inline-flex items-center gap-2 bg-brand-orange text-white font-bold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-brand-orange/30"
            >
              Book a Free Demo Class
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              data-testid="final-phone"
              href={`tel:${CONTACT.phoneRaw}`}
              className="inline-flex items-center gap-2 border-2 border-white/25 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              <Phone size={18} className="text-brand-blue" /> {CONTACT.phone}
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-4">
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors text-white">
              <Instagram size={20} />
            </a>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (placeholder)" className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors text-white">
              <Linkedin size={20} />
            </a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook (placeholder)" className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors text-white">
              <Facebook size={20} />
            </a>
          </div>
          <p className="mt-4 text-white/50 text-sm">Follow us {CONTACT.instagramHandle}</p>

          <div className="mt-6 flex justify-center">
            <button
              data-testid="final-brochure-btn"
              onClick={openBrochureGate}
              className="inline-flex items-center gap-2 border-2 border-white/25 text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <Download size={18} className="text-brand-gold" /> Download Brochure
            </button>
          </div>
        </Reveal>
      </div>

      <BrochureGateDialog
        open={gateOpen}
        onOpenChange={setGateOpen}
        sourceLabel="Download Brochure"
        fileUrl={BROCHURE_URL}
        fileTitle="Course Brochure"
      />
    </section>
  );
}
